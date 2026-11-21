"""
MarketScope.io — Deterministic Fallback Development Provider
Explicitly flags all data as SYNTHETIC_DEVELOPMENT.
Used exclusively for local testing, offline development, or graceful degradation
when upstream commercial providers hit rate limits or network failures.
NEVER claims to be live real-time market data.
"""

import logging
from datetime import datetime, timezone
from typing import Sequence
from app.providers.market_data.base import BaseMarketDataProvider
from app.domain.schemas import MarketQuote, ProviderHealthItem
from app.engine.market_calendar import resolve_session_state_for_exchange

logger = logging.getLogger(__name__)

# Deterministic baseline quotes (calibrated to real market levels)
FALLBACK_UNIVERSE = [
    {
        "symbol": "NIFTY 50",
        "name": "Nifty 50 Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 24480.20,
        "previous_close": 24367.80,
        "sparkline": [24360.0, 24390.0, 24410.0, 24450.0, 24480.20],
    },
    {
        "symbol": "SENSEX",
        "name": "BSE SENSEX 30",
        "exchange": "BSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 80365.10,
        "previous_close": 80044.95,
        "sparkline": [80050.0, 80120.0, 80210.0, 80290.0, 80365.10],
    },
    {
        "symbol": "NIFTY BANK",
        "name": "Nifty Bank Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 52180.50,
        "previous_close": 51934.70,
        "sparkline": [51920.0, 52010.0, 52090.0, 52140.0, 52180.50],
    },
    {
        "symbol": "NIFTY IT",
        "name": "Nifty IT Sector",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 41920.00,
        "previous_close": 42105.30,
        "sparkline": [42150.0, 42100.0, 42020.0, 41960.0, 41920.00],
    },
    {
        "symbol": "NIFTY MIDCAP 100",
        "name": "Nifty Midcap 100 Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 56840.10,
        "previous_close": 56427.80,
        "sparkline": [56420.0, 56550.0, 56680.0, 56790.0, 56840.10],
    },
    {
        "symbol": "BSE 500",
        "name": "S&P BSE 500",
        "exchange": "BSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 37410.25,
        "previous_close": 37221.85,
        "sparkline": [37210.0, 37280.0, 37340.0, 37390.0, 37410.25],
    },
    {
        "symbol": "NASDAQ 100",
        "name": "NASDAQ 100 Index",
        "exchange": "NASDAQ",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 20890.40,
        "previous_close": 20747.80,
        "sparkline": [20710.0, 20750.0, 20810.0, 20860.0, 20890.40],
    },
    {
        "symbol": "S&P 500",
        "name": "S&P 500 Index",
        "exchange": "NYSE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 5910.80,
        "previous_close": 5892.40,
        "sparkline": [5880.0, 5890.0, 5900.0, 5905.0, 5910.80],
    },
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 2942.50,
        "previous_close": 2900.40,
        "sparkline": [2900.0, 2915.0, 2928.0, 2935.0, 2942.50],
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 4125.80,
        "previous_close": 4141.50,
        "sparkline": [4145.0, 4138.0, 4130.0, 4122.0, 4125.80],
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1748.20,
        "previous_close": 1734.00,
        "sparkline": [1732.0, 1738.0, 1742.0, 1745.0, 1748.20],
    },
    {
        "symbol": "INFY",
        "name": "Infosys Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1874.15,
        "previous_close": 1885.80,
        "sparkline": [1888.0, 1882.0, 1879.0, 1872.0, 1874.15],
    },
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 228.40,
        "previous_close": 227.44,
        "sparkline": [226.5, 227.0, 227.8, 228.1, 228.4],
    },
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 146.50,
        "previous_close": 142.44,
        "sparkline": [142.0, 143.5, 144.8, 145.9, 146.5],
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 428.50,
        "previous_close": 425.20,
        "sparkline": [424.0, 426.0, 427.5, 428.0, 428.5],
    },
    {
        "symbol": "BHARTIARTL",
        "name": "Bharti Airtel Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1582.00,
        "previous_close": 1567.20,
        "sparkline": [1565.0, 1572.0, 1578.0, 1580.0, 1582.0],
    },
    {
        "symbol": "TATAMOTORS",
        "name": "Tata Motors Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 812.30,
        "previous_close": 795.20,
        "sparkline": [794.0, 802.0, 808.0, 810.0, 812.3],
    },
    {
        "symbol": "LT",
        "name": "Larsen & Toubro Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 3680.00,
        "previous_close": 3641.75,
        "sparkline": [3640.0, 3655.0, 3668.0, 3675.0, 3680.0],
    },
    {
        "symbol": "BRENT CRUDE",
        "name": "Brent Crude Oil",
        "exchange": "ICE",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 74.65,
        "previous_close": 73.40,
        "sparkline": [73.2, 73.6, 74.0, 74.4, 74.65],
    },
    {
        "symbol": "WTI CRUDE",
        "name": "Crude Oil WTI",
        "exchange": "NYMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 70.35,
        "previous_close": 69.20,
        "sparkline": [69.1, 69.45, 69.85, 70.15, 70.35],
    },
    {
        "symbol": "GOLD SPOT",
        "name": "Gold Spot (oz)",
        "exchange": "COMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 2684.50,
        "previous_close": 2692.70,
        "sparkline": [2695.0, 2692.0, 2689.0, 2686.0, 2684.50],
    },
    {
        "symbol": "GOLD MCX",
        "name": "Gold 24K (10g)",
        "exchange": "MCX",
        "asset_class": "COMMODITY",
        "currency": "INR",
        "price": 77450.00,
        "previous_close": 77270.00,
        "sparkline": [77210.0, 77290.0, 77360.0, 77410.0, 77450.00],
    },
    {
        "symbol": "SILVER",
        "name": "Silver Spot (oz)",
        "exchange": "COMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 31.45,
        "previous_close": 31.10,
        "sparkline": [31.05, 31.18, 31.28, 31.39, 31.45],
    },
    {
        "symbol": "NATURAL GAS",
        "name": "Natural Gas Henry Hub",
        "exchange": "NYMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 2.98,
        "previous_close": 2.92,
        "sparkline": [2.91, 2.93, 2.95, 2.97, 2.98],
    },
    {
        "symbol": "USD/INR",
        "name": "US Dollar / Indian Rupee",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 84.42,
        "previous_close": 84.34,
        "sparkline": [84.32, 84.36, 84.39, 84.41, 84.42],
    },
    {
        "symbol": "EUR/INR",
        "name": "Euro / Indian Rupee",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 89.15,
        "previous_close": 89.27,
        "sparkline": [89.32, 89.28, 89.22, 89.18, 89.15],
    },
    {
        "symbol": "DXY",
        "name": "US Dollar Index",
        "exchange": "ICE",
        "asset_class": "CURRENCY",
        "currency": "USD",
        "price": 106.85,
        "previous_close": 106.63,
        "sparkline": [106.55, 106.65, 106.74, 106.81, 106.85],
    },
    {
        "symbol": "US 10Y YIELD",
        "name": "US 10-Year Treasury Yield",
        "exchange": "BOND",
        "asset_class": "YIELD",
        "currency": "USD",
        "price": 4.42,
        "previous_close": 4.39,
        "sparkline": [4.38, 4.39, 4.40, 4.41, 4.42],
    },
    {
        "symbol": "INDIA 10Y YIELD",
        "name": "India 10-Year Benchmark G-Sec",
        "exchange": "RBI",
        "asset_class": "YIELD",
        "currency": "INR",
        "price": 6.82,
        "previous_close": 6.83,
        "sparkline": [6.84, 6.83, 6.83, 6.82, 6.82],
    },
]

FALLBACK_MAP = {item["symbol"].upper(): item for item in FALLBACK_UNIVERSE}


class FallbackDevProvider(BaseMarketDataProvider):
    provider_name = "synthetic_dev"

    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote | None:
        sym_clean = symbol.upper().strip()
        data = FALLBACK_MAP.get(sym_clean)
        if not data:
            return None

        exch = exchange or data["exchange"]
        session = resolve_session_state_for_exchange(exch)
        price = data["price"]
        prev_close = data["previous_close"]
        change, change_pct = self.calculate_price_change(price, prev_close)
        now = datetime.now(timezone.utc)

        return MarketQuote(
            instrument_id=f"inst_dev_{sym_clean.replace(' ', '_')}",
            symbol=data["symbol"],
            name=data["name"],
            exchange=exch,
            asset_class=data["asset_class"],
            currency=data["currency"],
            price=price,
            open=round(prev_close * 1.001, 2),
            high=round(max(price, prev_close) * 1.004, 2),
            low=round(min(price, prev_close) * 0.996, 2),
            previous_close=prev_close,
            change=change,
            change_pct=change_pct,
            volume=5000000,
            market_status=session.market_status,
            data_status="SYNTHETIC_DEVELOPMENT",  # STRICTLY FLAGGED
            source_provider=self.provider_name,
            timestamp=now,
            received_at=now,
            sparkline=data["sparkline"],
        )

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
        return []

    async def health_check(self) -> ProviderHealthItem:
        return ProviderHealthItem(
            provider_name=self.provider_name,
            status="HEALTHY",
            latency_ms=0.1,
            last_checked=datetime.now(timezone.utc),
            error_message="Fallback simulated provider (active for local testing)",
        )
