"""
MarketScope.io — Financial Modeling Prep (FMP) Market Data Adapter
Integrates FMP for equities, global indices, and corporate metrics.
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

FMP_BASE_URL = "https://financialmodelingprep.com/stable"


class FMPDataProvider(BaseMarketDataProvider):
    provider_name = "fmp"

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("FMP_API_KEY", "")

    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote | None:
        if not self.api_key:
            return None

        # FMP symbol mapping: Indian equities use .NS or .BO
        fmp_sym = symbol
        if exchange and exchange.upper() == "NSE" and not symbol.endswith(".NS"):
            fmp_sym = f"{symbol}.NS"
        elif exchange and exchange.upper() == "BSE" and not symbol.endswith(".BO"):
            fmp_sym = f"{symbol}.BO"

        url = f"{FMP_BASE_URL}/quote"
        params = {"symbol": fmp_sym, "apikey": self.api_key}

        try:
            async with httpx.AsyncClient(timeout=4.5) as client:
                res = await client.get(url, params=params)
                if res.status_code != 200:
                    return None

                data = res.json()
                if not data or not isinstance(data, list) or len(data) == 0:
                    return None

                return self._parse_quote(data[0], symbol, exchange)
        except Exception as e:
            logger.error(f"FMP quote request failed for {symbol}: {str(e)}")
            return None

    async def get_batch_quotes(self, symbols: Sequence[str]) -> list[MarketQuote]:
        if not self.api_key or not symbols:
            return []

        joined_symbols = ",".join(symbols[:30])
        url = f"{FMP_BASE_URL}/quote"
        params = {"symbol": joined_symbols, "apikey": self.api_key}

        quotes: list[MarketQuote] = []
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    items = res.json()
                    if isinstance(items, list):
                        for item in items:
                            q = self._parse_quote(item, item.get("symbol", ""), item.get("exchange"))
                            if q:
                                quotes.append(q)
        except Exception as e:
            logger.error(f"FMP batch quote failed: {str(e)}")
        return quotes

    async def get_historical_bars(
        self, symbol: str, interval: str = "1D", limit: int = 30
    ) -> list[dict]:
        if not self.api_key:
            return []

        url = f"{FMP_BASE_URL}/historical-price-full/{symbol}"
        params = {"timeseries": limit, "apikey": self.api_key}
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    historical = data.get("historical", [])
                    return [
                        {
                            "datetime": h.get("date"),
                            "open": float(h.get("open", 0)),
                            "high": float(h.get("high", 0)),
                            "low": float(h.get("low", 0)),
                            "close": float(h.get("close", 0)),
                            "volume": int(h.get("volume", 0)),
                        }
                        for h in historical
                    ]
        except Exception as e:
            logger.error(f"FMP historical bars failed: {str(e)}")
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
                    f"{FMP_BASE_URL}/quote",
                    params={"symbol": "AAPL", "apikey": self.api_key},
                )
                latency = round((time.perf_counter() - t0) * 1000, 2)
                if res.status_code == 200 and isinstance(res.json(), list):
                    return ProviderHealthItem(
                        provider_name=self.provider_name,
                        status="HEALTHY",
                        latency_ms=latency,
                        last_checked=datetime.now(timezone.utc),
                        error_message=None,
                    )
                else:
                    return ProviderHealthItem(
                        provider_name=self.provider_name,
                        status="DEGRADED",
                        latency_ms=latency,
                        last_checked=datetime.now(timezone.utc),
                        error_message=f"HTTP {res.status_code}",
                    )
        except Exception as e:
            return ProviderHealthItem(
                provider_name=self.provider_name,
                status="ERROR",
                latency_ms=round((time.perf_counter() - t0) * 1000, 2),
                last_checked=datetime.now(timezone.utc),
                error_message=str(e),
            )

    def _parse_quote(self, data: dict, raw_symbol: str, exchange: str | None) -> MarketQuote | None:
        try:
            price = float(data.get("price", 0))
            if not self.is_valid_price(price):
                return None

            prev_close = float(data.get("previousClose", price))
            change, change_pct = self.calculate_price_change(price, prev_close)

            exch = exchange or data.get("exchange", "UNKNOWN")
            session = resolve_session_state_for_exchange(exch)

            now = datetime.now(timezone.utc)
            return MarketQuote(
                instrument_id=f"inst_fmp_{raw_symbol}",
                symbol=raw_symbol.replace(".NS", "").replace(".BO", ""),
                name=data.get("name", raw_symbol),
                exchange=exch,
                asset_class="EQUITY",
                currency="INR" if ".NS" in raw_symbol or ".BO" in raw_symbol else "USD",
                price=price,
                open=float(data["open"]) if data.get("open") else None,
                high=float(data["dayHigh"]) if data.get("dayHigh") else None,
                low=float(data["dayLow"]) if data.get("dayLow") else None,
                previous_close=prev_close,
                change=change,
                change_pct=change_pct,
                volume=int(data["volume"]) if data.get("volume") else None,
                market_status=session.market_status,
                data_status="DELAYED_15M" if session.is_regular_trading else "EOD",
                source_provider=self.provider_name,
                timestamp=now,
                received_at=now,
                sparkline=[prev_close, price],
            )
        except Exception as e:
            logger.error(f"Error parsing FMP quote: {str(e)}")
            return None
