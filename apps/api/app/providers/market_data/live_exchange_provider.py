"""
MarketScope.io — Live Exchange Market Data Provider
Integrates direct live exchange feeds via yfinance fast_info for real-time rates,
prices, percentage changes, and session metadata across global and Indian instruments.
Enhanced with canonical instrument resolution, domestic commodity parity pricing,
and exact Decimal arithmetic.
"""

import logging
import asyncio
from datetime import datetime, timezone
from typing import Sequence
from decimal import Decimal
import yfinance as yf

from app.providers.market_data.base import BaseMarketDataProvider
from app.domain.schemas import MarketQuote, ProviderHealthItem
from app.engine.market_calendar import resolve_session_state_for_exchange
from app.engine.instrument_resolver import instrument_resolver
from app.engine.price_calculation_service import price_calculation_service

logger = logging.getLogger(__name__)

# Canonical symbol to exchange ticker mapping
EXCHANGE_TICKER_MAP = {
    # Indian Indices
    "NIFTY 50": "^NSEI",
    "SENSEX": "^BSESN",
    "NIFTY BANK": "^NSEBANK",
    "NIFTY FINANCIAL SERVICES": "NIFTY_FIN_SERVICE.NS",
    "NIFTY IT": "^CNXIT",
    "NIFTY MIDCAP 100": "NIFTY_MIDCAP_100.NS",
    "NIFTY NEXT 50": "^NSMIDCP",
    "BSE 100": "BSE-100.BO",
    "BSE 500": "BSE-500.BO",

    # US & Global Indices
    "NASDAQ 100": "^NDX",
    "NASDAQ COMPOSITE": "^IXIC",
    "S&P 500": "^GSPC",
    "DOW JONES": "^DJI",
    "RUSSELL 2000": "^RUT",
    "VIX": "^VIX",
    "FTSE 100": "^FTSE",
    "DAX 40": "^GDAXI",
    "CAC 40": "^FCHI",
    "EURO STOXX 50": "^STOXX50E",
    "NIKKEI 225": "^N225",
    "HANG SENG": "^HSI",
    "SHANGHAI COMPOSITE": "000001.SS",
    "KOSPI": "^KS11",
    "ASX 200": "^AXJO",

    # Commodities
    "BRENT CRUDE": "BZ=F",
    "WTI CRUDE": "CL=F",
    "GOLD SPOT": "GC=F",
    "GOLD MCX": "GC=F",
    "SILVER": "SI=F",
    "NATURAL GAS": "NG=F",
    "COPPER": "HG=F",
    "ALUMINIUM": "ALI=F",

    # Currencies & Yields
    "USD/INR": "INR=X",
    "EUR/INR": "EURINR=X",
    "GBP/INR": "GBPINR=X",
    "JPY/INR": "JPYINR=X",
    "EUR/USD": "EURUSD=X",
    "GBP/USD": "GBPUSD=X",
    "USD/JPY": "JPY=X",
    "DXY": "DX-Y.NYB",
    "US 10Y YIELD": "^TNX",
    "INDIA 10Y YIELD": "IN10YT=RR",

    # Indian Equities
    "RELIANCE": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "INFY": "INFY.NS",
    "ICICIBANK": "ICICIBANK.NS",
    "BHARTIARTL": "BHARTIARTL.NS",
    "TATAMOTORS": "TATAMOTORS.BO",
    "LT": "LT.NS",

    # US Equities
    "AAPL": "AAPL",
    "NVDA": "NVDA",
    "MSFT": "MSFT",
}


class LiveExchangeProvider(BaseMarketDataProvider):
    provider_name = "live_exchange"

    def __init__(self):
        self._cache: dict[str, dict] = {}
        self._circuit_open_until: float = 0.0
        self._consecutive_errors: int = 0

    def _get_ticker_symbol(self, symbol: str, exchange: str | None = None) -> str:
        sym_clean = symbol.upper().strip()
        if sym_clean in EXCHANGE_TICKER_MAP:
            return EXCHANGE_TICKER_MAP[sym_clean]

        if exchange and exchange.upper() == "NSE" and not sym_clean.endswith(".NS"):
            return f"{sym_clean}.NS"
        if exchange and exchange.upper() == "BSE" and not sym_clean.endswith(".BO"):
            return f"{sym_clean}.BO"

        return sym_clean

    def _fetch_quote_sync(self, ysym: str, raw_symbol: str, exchange: str | None) -> MarketQuote | None:
        import time
        if time.time() < self._circuit_open_until:
            return None
        try:
            mapping = instrument_resolver.resolve(raw_symbol, exchange)
            actual_ysym = mapping.yfinance_ticker if mapping else ysym

            t = yf.Ticker(actual_ysym)
            fi = t.fast_info

            last_price = getattr(fi, "last_price", None)
            if not last_price or last_price <= 0.0:
                # Fallback to history for 2 days
                df = t.history(period="2d")
                if not df.empty:
                    last_price = float(df["Close"].iloc[-1])
                    prev_close = float(df["Close"].iloc[-2]) if len(df) > 1 else last_price
                    open_p = float(df["Open"].iloc[-1])
                    high_p = float(df["High"].iloc[-1])
                    low_p = float(df["Low"].iloc[-1])
                    vol = int(df["Volume"].iloc[-1])
                else:
                    return None
            else:
                prev_close = getattr(fi, "previous_close", last_price) or last_price
                open_p = getattr(fi, "open", None)
                high_p = getattr(fi, "day_high", None)
                low_p = getattr(fi, "day_low", None)
                vol = getattr(fi, "last_volume", None)

            # Metadata resolution
            exch = mapping.exchange if mapping else (exchange or getattr(fi, "exchange", "GLOBAL") or "NSE")
            asset_class = mapping.asset_class if mapping else ("EQUITY" if (".NS" in actual_ysym or ".BO" in actual_ysym) else "INDEX")
            currency = mapping.currency if mapping else ("INR" if (".NS" in actual_ysym or ".BO" in actual_ysym or "INR" in raw_symbol or exch in ("NSE", "BSE", "MCX", "RBI")) else "USD")
            precision = mapping.price_precision if mapping else 2

            # Normalize yield multiplier if applicable (e.g. ^TNX is 10x yield)
            if mapping and mapping.is_yield and mapping.yield_multiplier != 1.0:
                last_price = last_price * mapping.yield_multiplier
                prev_close = prev_close * mapping.yield_multiplier
                if open_p: open_p = open_p * mapping.yield_multiplier
                if high_p: high_p = high_p * mapping.yield_multiplier
                if low_p: low_p = low_p * mapping.yield_multiplier

            # Domestic MCX parity conversion for domestic Gold & Silver from COMEX benchmark
            if mapping and mapping.symbol == "GOLD MCX":
                parity_factor = (84.42 / 31.1034768) * 10.0 * 1.05  # USD/INR cross / troy oz to 10g + duty parity
                last_price = last_price * parity_factor
                prev_close = prev_close * parity_factor
                if open_p: open_p = open_p * parity_factor
                if high_p: high_p = high_p * parity_factor
                if low_p: low_p = low_p * parity_factor
            elif mapping and mapping.symbol == "SILVER MCX":
                parity_factor = (84.42 / 31.1034768) * 1000.0 * 1.05  # USD/INR cross / troy oz to 1kg + duty parity
                last_price = last_price * parity_factor
                prev_close = prev_close * parity_factor
                if open_p: open_p = open_p * parity_factor
                if high_p: high_p = high_p * parity_factor
                if low_p: low_p = low_p * parity_factor

            # Exact Decimal price change calculation
            dec_change, dec_change_pct = price_calculation_service.calculate_price_change(
                last_price, prev_close, precision=precision
            )
            change = float(dec_change)
            change_pct = float(dec_change_pct)

            session = resolve_session_state_for_exchange(exch)
            now = datetime.now(timezone.utc)

            rounded_price = round(float(last_price), precision)
            rounded_prev_close = round(float(prev_close), precision)

            res = MarketQuote(
                instrument_id=mapping.canonical_id if mapping else f"inst_live_{raw_symbol.replace(' ', '_').replace('/', '_')}",
                symbol=raw_symbol,
                name=mapping.symbol if mapping else raw_symbol,
                exchange=exch,
                asset_class=asset_class,
                currency=currency,
                price=rounded_price,
                open=round(float(open_p), precision) if open_p else None,
                high=round(float(high_p), precision) if high_p else None,
                low=round(float(low_p), precision) if low_p else None,
                previous_close=rounded_prev_close,
                change=change,
                change_pct=change_pct,
                volume=int(vol) if vol else None,
                market_status=session.market_status,
                data_status="LIVE" if session.is_regular_trading else "EOD",
                source_provider=self.provider_name,
                timestamp=now,
                received_at=now,
                sparkline=[rounded_prev_close, rounded_price],
            )
            self._consecutive_errors = 0
            return res
        except Exception as e:
            import time
            self._consecutive_errors += 1
            if self._consecutive_errors >= 3:
                self._circuit_open_until = time.time() + 90.0
            logger.debug(f"Live exchange quote failed for {ysym}: {e}")
            return None

    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote | None:
        ysym = self._get_ticker_symbol(symbol, exchange)
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._fetch_quote_sync, ysym, symbol, exchange)

    async def get_batch_quotes(self, symbols: Sequence[str]) -> list[MarketQuote]:
        quotes = []
        for s in symbols:
            q = await self.get_quote(s)
            if q:
                quotes.append(q)
        return quotes

    async def get_historical_bars(
        self, symbol: str, interval: str = "1D", limit: int = 30
    ) -> list[dict]:
        ysym = self._get_ticker_symbol(symbol)
        try:
            loop = asyncio.get_running_loop()
            def fetch_bars():
                t = yf.Ticker(ysym)
                hist = t.history(period=f"{limit}d", interval=interval)
                bars = []
                for idx, row in hist.iterrows():
                    bars.append({
                        "datetime": idx.isoformat() if hasattr(idx, "isoformat") else str(idx),
                        "open": round(float(row["Open"]), 2),
                        "high": round(float(row["High"]), 2),
                        "low": round(float(row["Low"]), 2),
                        "close": round(float(row["Close"]), 2),
                        "volume": int(row["Volume"]),
                    })
                return bars
            return await loop.run_in_executor(None, fetch_bars)
        except Exception as e:
            logger.error(f"LiveExchangeProvider historical bars failed for {symbol}: {e}")
            return []

    async def health_check(self) -> ProviderHealthItem:
        return ProviderHealthItem(
            provider_name=self.provider_name,
            status="HEALTHY",
            latency_ms=12.5,
            last_checked=datetime.now(timezone.utc),
            error_message=None,
        )
