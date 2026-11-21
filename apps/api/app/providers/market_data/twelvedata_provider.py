"""
MarketScope.io — Twelve Data Market Data Provider Adapter
Integrates Twelve Data REST API for global quotes, US equities, indices, and forex.
"""

import os
import time
import httpx
import logging
from datetime import datetime, timezone
from typing import Sequence
from app.providers.market_data.base import BaseMarketDataProvider
from app.domain.schemas import MarketQuote, ProviderHealthItem
from app.engine.market_calendar import resolve_session_state_for_exchange

logger = logging.getLogger(__name__)

TWELVEDATA_BASE_URL = "https://api.twelvedata.com"


class TwelveDataProvider(BaseMarketDataProvider):
    provider_name = "twelvedata"

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("TWELVEDATA_API_KEY", "")

    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote | None:
        if not self.api_key:
            return None

        # Build query symbol
        query_sym = symbol
        if exchange and exchange.upper() in ("NSE", "BSE"):
            query_sym = f"{symbol}:{exchange.upper()}"

        url = f"{TWELVEDATA_BASE_URL}/quote"
        params = {"symbol": query_sym, "apikey": self.api_key}

        try:
            async with httpx.AsyncClient(timeout=4.5) as client:
                res = await client.get(url, params=params)
                if res.status_code != 200:
                    logger.warning(f"TwelveData HTTP error {res.status_code} for {symbol}")
                    return None

                data = res.json()
                if data.get("status") == "error" or "close" not in data:
                    logger.warning(f"TwelveData response error for {symbol}: {data.get('message')}")
                    return None

                return self._parse_quote(data, symbol, exchange)
        except Exception as e:
            logger.error(f"TwelveData request failed for {symbol}: {str(e)}")
            return None

    async def get_batch_quotes(self, symbols: Sequence[str]) -> list[MarketQuote]:
        if not self.api_key or not symbols:
            return []

        joined_symbols = ",".join(symbols[:20])  # Cap batch at 20 symbols
        url = f"{TWELVEDATA_BASE_URL}/quote"
        params = {"symbol": joined_symbols, "apikey": self.api_key}

        quotes: list[MarketQuote] = []
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(url, params=params)
                if res.status_code != 200:
                    return []

                data = res.json()
                if isinstance(data, dict):
                    # Multi-symbol returns dict where keys are symbols
                    for sym, item in data.items():
                        if isinstance(item, dict) and "close" in item:
                            q = self._parse_quote(item, sym, item.get("exchange"))
                            if q:
                                quotes.append(q)
        except Exception as e:
            logger.error(f"TwelveData batch quotes failed: {str(e)}")

        return quotes

    async def get_historical_bars(
        self, symbol: str, interval: str = "1D", limit: int = 30
    ) -> list[dict]:
        if not self.api_key:
            return []

        url = f"{TWELVEDATA_BASE_URL}/time_series"
        params = {
            "symbol": symbol,
            "interval": interval,
            "outputsize": limit,
            "apikey": self.api_key,
        }
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    values = data.get("values", [])
                    return [
                        {
                            "datetime": v.get("datetime"),
                            "open": float(v.get("open", 0)),
                            "high": float(v.get("high", 0)),
                            "low": float(v.get("low", 0)),
                            "close": float(v.get("close", 0)),
                            "volume": int(v.get("volume", 0)),
                        }
                        for v in values
                    ]
        except Exception as e:
            logger.error(f"TwelveData historical bars failed: {str(e)}")
        return []

    async def health_check(self) -> ProviderHealthItem:
        t0 = time.perf_counter()
        if not self.api_key:
            return ProviderHealthItem(
                provider_name=self.provider_name,
                status="DISABLED",
                latency_ms=0.0,
                last_checked=datetime.now(timezone.utc),
                error_message="API key not configured",
            )

        try:
            async with httpx.AsyncClient(timeout=3.5) as client:
                res = await client.get(
                    f"{TWELVEDATA_BASE_URL}/quote",
                    params={"symbol": "AAPL", "apikey": self.api_key},
                )
                latency = round((time.perf_counter() - t0) * 1000, 2)
                if res.status_code == 200 and "close" in res.json():
                    return ProviderHealthItem(
                        provider_name=self.provider_name,
                        status="HEALTHY",
                        latency_ms=latency,
                        last_checked=datetime.now(timezone.utc),
                        error_message=None,
                        rate_limit_remaining=res.headers.get("api-credits-left", None),
                    )
                else:
                    return ProviderHealthItem(
                        provider_name=self.provider_name,
                        status="DEGRADED",
                        latency_ms=latency,
                        last_checked=datetime.now(timezone.utc),
                        error_message=res.json().get("message", "Non-200 or invalid payload"),
                    )
        except Exception as e:
            return ProviderHealthItem(
                provider_name=self.provider_name,
                status="ERROR",
                latency_ms=round((time.perf_counter() - t0) * 1000, 2),
                last_checked=datetime.now(timezone.utc),
                error_message=str(e),
            )

    def _parse_quote(self, data: dict, symbol: str, exchange: str | None) -> MarketQuote | None:
        try:
            close_price = float(data.get("close", 0))
            if not self.is_valid_price(close_price):
                return None

            prev_close = float(data.get("previous_close", close_price))
            change, change_pct = self.calculate_price_change(close_price, prev_close)

            exch = exchange or data.get("exchange", "UNKNOWN")
            session = resolve_session_state_for_exchange(exch)

            # Determine true data freshness
            is_market_open = data.get("is_market_open", session.is_regular_trading)
            if not is_market_open or session.market_status in ("CLOSED", "HOLIDAY", "POST_CLOSE"):
                data_status = "EOD" if session.market_status != "CLOSED" else "CLOSED"
            else:
                data_status = "DELAYED_15M"  # Default for standard TwelveData API key

            now = datetime.now(timezone.utc)
            return MarketQuote(
                instrument_id=f"inst_td_{symbol}",
                symbol=symbol,
                name=data.get("name", symbol),
                exchange=exch,
                asset_class="EQUITY" if "index" not in symbol.lower() else "INDEX",
                currency=data.get("currency", "USD"),
                price=close_price,
                open=float(data["open"]) if data.get("open") else None,
                high=float(data["high"]) if data.get("high") else None,
                low=float(data["low"]) if data.get("low") else None,
                previous_close=prev_close,
                change=change,
                change_pct=change_pct,
                volume=int(data["volume"]) if data.get("volume") else None,
                market_status=session.market_status,
                data_status=data_status,
                source_provider=self.provider_name,
                timestamp=now,
                received_at=now,
                sparkline=[prev_close, close_price],
            )
        except Exception as e:
            logger.error(f"Error parsing TwelveData quote: {str(e)}")
            return None
