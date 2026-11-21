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

# Complete 51-instrument canonical universe calibrated to real market levels
FALLBACK_UNIVERSE = [
    # ─── 1. Indian Benchmark & Sectoral Indices ────────────────────────────────
    {
        "symbol": "NIFTY 50",
        "name": "Nifty 50 Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 25800.60,
        "previous_close": 25514.30,
        "sparkline": [25420.0, 25514.30, 25680.0, 25740.0, 25800.60],
    },
    {
        "symbol": "NIFTY NEXT 50",
        "name": "Nifty Next 50 Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 73207.25,
        "previous_close": 72892.75,
        "sparkline": [72750.0, 72892.75, 73050.0, 73150.0, 73207.25],
    },
    {
        "symbol": "NIFTY BANK",
        "name": "Nifty Bank Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 64635.20,
        "previous_close": 63063.00,
        "sparkline": [62980.0, 63063.00, 63800.0, 64200.0, 64635.20],
    },
    {
        "symbol": "NIFTY FINANCIAL SERVICES",
        "name": "Nifty Financial Services Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 28871.20,
        "previous_close": 28299.65,
        "sparkline": [28250.0, 28299.65, 28500.0, 28720.0, 28871.20],
    },
    {
        "symbol": "NIFTY IT",
        "name": "Nifty IT Sector",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 31322.65,
        "previous_close": 30919.45,
        "sparkline": [30850.0, 30919.45, 31100.0, 31250.0, 31322.65],
    },
    {
        "symbol": "NIFTY MIDCAP 100",
        "name": "Nifty Midcap 100 Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 62031.00,
        "previous_close": 61618.85,
        "sparkline": [61550.0, 61618.85, 61850.0, 61950.0, 62031.00],
    },
    {
        "symbol": "SENSEX",
        "name": "BSE SENSEX 30",
        "exchange": "BSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 83919.71,
        "previous_close": 83021.75,
        "sparkline": [82950.0, 83021.75, 83450.0, 83780.0, 83919.71],
    },
    {
        "symbol": "BSE 100",
        "name": "S&P BSE 100 Index",
        "exchange": "BSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 27480.50,
        "previous_close": 27190.20,
        "sparkline": [27150.0, 27190.20, 27320.0, 27410.0, 27480.50],
    },
    {
        "symbol": "BSE 500",
        "name": "S&P BSE 500",
        "exchange": "BSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 37735.95,
        "previous_close": 37442.64,
        "sparkline": [37380.0, 37442.64, 37580.0, 37690.0, 37735.95],
    },

    # ─── 2. International Benchmark Indices ──────────────────────────────────
    {
        "symbol": "NASDAQ Composite",
        "name": "NASDAQ Composite Index",
        "exchange": "NASDAQ",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 22617.73,
        "previous_close": 23882.10,
        "sparkline": [23882.10, 23450.0, 23100.0, 22800.0, 22617.73],
    },
    {
        "symbol": "NASDAQ 100",
        "name": "NASDAQ 100 Index",
        "exchange": "NASDAQ",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 25028.98,
        "previous_close": 26523.44,
        "sparkline": [26523.44, 26050.0, 25680.0, 25300.0, 25028.98],
    },
    {
        "symbol": "S&P 500",
        "name": "S&P 500 Index",
        "exchange": "NYSE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 6910.39,
        "previous_close": 7177.56,
        "sparkline": [7177.56, 7080.0, 7020.0, 6960.0, 6910.39],
    },
    {
        "symbol": "Dow Jones",
        "name": "Dow Jones Industrial Average",
        "exchange": "NYSE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 48147.33,
        "previous_close": 49112.63,
        "sparkline": [49112.63, 48800.0, 48500.0, 48300.0, 48147.33],
    },
    {
        "symbol": "Russell 2000",
        "name": "Russell 2000 Small Cap Index",
        "exchange": "NYSE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 2581.79,
        "previous_close": 2656.24,
        "sparkline": [2656.24, 2630.0, 2610.0, 2595.0, 2581.79],
    },
    {
        "symbol": "VIX",
        "name": "CBOE Volatility Index",
        "exchange": "CBOE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 35.89,
        "previous_close": 28.47,
        "sparkline": [28.47, 30.2, 32.5, 34.1, 35.89],
    },
    {
        "symbol": "FTSE 100",
        "name": "FTSE 100 Index London",
        "exchange": "LSE",
        "asset_class": "INDEX",
        "currency": "GBP",
        "price": 10346.30,
        "previous_close": 10459.18,
        "sparkline": [10459.18, 10420.0, 10380.0, 10360.0, 10346.30],
    },
    {
        "symbol": "DAX 40",
        "name": "DAX Index Germany",
        "exchange": "XETRA",
        "asset_class": "INDEX",
        "currency": "EUR",
        "price": 24802.78,
        "previous_close": 25498.54,
        "sparkline": [25498.54, 25200.0, 25050.0, 24900.0, 24802.78],
    },
    {
        "symbol": "CAC 40",
        "name": "CAC 40 Index Paris",
        "exchange": "EURONEXT",
        "asset_class": "INDEX",
        "currency": "EUR",
        "price": 7927.75,
        "previous_close": 8084.91,
        "sparkline": [8084.91, 8040.0, 7990.0, 7950.0, 7927.75],
    },
    {
        "symbol": "EURO STOXX 50",
        "name": "EURO STOXX 50 Index",
        "exchange": "EURONEXT",
        "asset_class": "INDEX",
        "currency": "EUR",
        "price": 5941.95,
        "previous_close": 6120.02,
        "sparkline": [6120.02, 6060.0, 6010.0, 5970.0, 5941.95],
    },
    {
        "symbol": "Nikkei 225",
        "name": "Nikkei 225 Tokyo",
        "exchange": "TSE",
        "asset_class": "INDEX",
        "currency": "JPY",
        "price": 56436.65,
        "previous_close": 59542.41,
        "sparkline": [59542.41, 58600.0, 57800.0, 57100.0, 56436.65],
    },
    {
        "symbol": "Hang Seng",
        "name": "Hang Seng Index Hong Kong",
        "exchange": "HKEX",
        "asset_class": "INDEX",
        "currency": "HKD",
        "price": 22410.80,
        "previous_close": 22841.62,
        "sparkline": [22841.62, 22700.0, 22580.0, 22490.0, 22410.80],
    },
    {
        "symbol": "Shanghai Composite",
        "name": "Shanghai Composite Index",
        "exchange": "SSE",
        "asset_class": "INDEX",
        "currency": "CNY",
        "price": 3533.79,
        "previous_close": 3575.79,
        "sparkline": [3575.79, 3560.0, 3550.0, 3540.0, 3533.79],
    },
    {
        "symbol": "KOSPI",
        "name": "Korea Composite Stock Index",
        "exchange": "KRX",
        "asset_class": "INDEX",
        "currency": "KRW",
        "price": 4869.96,
        "previous_close": 5084.99,
        "sparkline": [5084.99, 5020.0, 4960.0, 4910.0, 4869.96],
    },
    {
        "symbol": "ASX 200",
        "name": "S&P/ASX 200 Australia",
        "exchange": "ASX",
        "asset_class": "INDEX",
        "currency": "AUD",
        "price": 8592.60,
        "previous_close": 8730.40,
        "sparkline": [8730.40, 8680.0, 8640.0, 8610.0, 8592.60],
    },

    # ─── 3. Commodities & Energy ──────────────────────────────────────────────
    {
        "symbol": "GOLD SPOT",
        "name": "Gold Spot (oz)",
        "exchange": "COMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 3515.40,
        "previous_close": 3533.00,
        "sparkline": [3533.0, 3528.0, 3522.0, 3518.0, 3515.40],
    },
    {
        "symbol": "GOLD MCX",
        "name": "Gold 24K (10g)",
        "exchange": "MCX",
        "asset_class": "COMMODITY",
        "currency": "INR",
        "price": 98450.00,
        "previous_close": 98920.00,
        "sparkline": [98920.0, 98800.0, 98650.0, 98520.0, 98450.00],
    },
    {
        "symbol": "SILVER",
        "name": "Silver Spot (oz)",
        "exchange": "COMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 41.03,
        "previous_close": 41.36,
        "sparkline": [41.36, 41.25, 41.15, 41.08, 41.03],
    },
    {
        "symbol": "BRENT CRUDE",
        "name": "Brent Crude Oil",
        "exchange": "ICE",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 92.57,
        "previous_close": 90.05,
        "sparkline": [90.05, 90.80, 91.40, 92.00, 92.57],
    },
    {
        "symbol": "WTI CRUDE",
        "name": "Crude Oil WTI",
        "exchange": "NYMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 83.98,
        "previous_close": 82.99,
        "sparkline": [82.99, 83.20, 83.50, 83.75, 83.98],
    },
    {
        "symbol": "NATURAL GAS",
        "name": "Natural Gas Henry Hub",
        "exchange": "NYMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 3.41,
        "previous_close": 3.23,
        "sparkline": [3.23, 3.28, 3.32, 3.37, 3.41],
    },
    {
        "symbol": "COPPER",
        "name": "Copper Futures (lb)",
        "exchange": "COMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 5.48,
        "previous_close": 5.49,
        "sparkline": [5.49, 5.49, 5.48, 5.48, 5.48],
    },
    {
        "symbol": "ALUMINIUM",
        "name": "Aluminium LME Cash",
        "exchange": "LME",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 2860.00,
        "previous_close": 2795.00,
        "sparkline": [2795.0, 2810.0, 2830.0, 2845.0, 2860.00],
    },

    # ─── 4. Foreign Exchange & Dollar Index ──────────────────────────────────
    {
        "symbol": "USD/INR",
        "name": "US Dollar / Indian Rupee",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 92.67,
        "previous_close": 93.28,
        "sparkline": [93.28, 93.10, 92.95, 92.80, 92.67],
    },
    {
        "symbol": "EUR/INR",
        "name": "Euro / Indian Rupee",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 101.61,
        "previous_close": 102.35,
        "sparkline": [102.35, 102.15, 101.90, 101.75, 101.61],
    },
    {
        "symbol": "GBP/INR",
        "name": "British Pound / Indian Rupee",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 121.23,
        "previous_close": 122.07,
        "sparkline": [122.07, 121.85, 121.60, 121.40, 121.23],
    },
    {
        "symbol": "JPY/INR",
        "name": "Japanese Yen / Indian Rupee (100)",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 58.20,
        "previous_close": 58.45,
        "sparkline": [58.45, 58.40, 58.32, 58.25, 58.20],
    },
    {
        "symbol": "EUR/USD",
        "name": "Euro / US Dollar",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "USD",
        "price": 1.1000,
        "previous_close": 1.1000,
        "sparkline": [1.1000, 1.1000, 1.1000, 1.1000, 1.1000],
    },
    {
        "symbol": "GBP/USD",
        "name": "British Pound / US Dollar",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "USD",
        "price": 1.3100,
        "previous_close": 1.3100,
        "sparkline": [1.3100, 1.3100, 1.3100, 1.3100, 1.3100],
    },
    {
        "symbol": "USD/JPY",
        "name": "US Dollar / Japanese Yen",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "JPY",
        "price": 159.71,
        "previous_close": 159.74,
        "sparkline": [159.74, 159.72, 159.70, 159.71, 159.71],
    },
    {
        "symbol": "DXY",
        "name": "US Dollar Index",
        "exchange": "ICE",
        "asset_class": "CURRENCY",
        "currency": "USD",
        "price": 103.81,
        "previous_close": 103.79,
        "sparkline": [103.79, 103.79, 103.80, 103.81, 103.81],
    },

    # ─── 5. Sovereign Benchmark Bond Yields ───────────────────────────────────
    {
        "symbol": "US 10Y YIELD",
        "name": "US 10-Year Treasury Yield",
        "exchange": "BOND",
        "asset_class": "YIELD",
        "currency": "USD",
        "price": 4.91,
        "previous_close": 5.05,
        "sparkline": [5.05, 5.00, 4.96, 4.93, 4.91],
    },
    {
        "symbol": "INDIA 10Y YIELD",
        "name": "India 10-Year Benchmark G-Sec",
        "exchange": "RBI",
        "asset_class": "YIELD",
        "currency": "INR",
        "price": 6.82,
        "previous_close": 6.84,
        "sparkline": [6.84, 6.83, 6.83, 6.82, 6.82],
    },

    # ─── 6. Major Indian & Global Equities ───────────────────────────────────
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1377.50,
        "previous_close": 1375.60,
        "sparkline": [1370.0, 1375.60, 1365.0, 1372.0, 1377.50],
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 2376.20,
        "previous_close": 2342.70,
        "sparkline": [2335.0, 2342.70, 2355.0, 2368.0, 2376.20],
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 846.00,
        "previous_close": 821.80,
        "sparkline": [818.0, 821.80, 830.0, 840.0, 846.00],
    },
    {
        "symbol": "INFY",
        "name": "Infosys Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1098.00,
        "previous_close": 1091.90,
        "sparkline": [1085.0, 1091.90, 1090.0, 1095.0, 1098.00],
    },
    {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1640.00,
        "previous_close": 1608.90,
        "sparkline": [1600.0, 1608.90, 1620.0, 1632.0, 1640.00],
    },
    {
        "symbol": "BHARTIARTL",
        "name": "Bharti Airtel Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 2161.70,
        "previous_close": 2144.00,
        "sparkline": [2135.0, 2144.00, 2150.0, 2158.0, 2161.70],
    },
    {
        "symbol": "TATAMOTORS",
        "name": "Tata Motors Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 742.50,
        "previous_close": 736.20,
        "sparkline": [730.0, 736.20, 738.0, 740.0, 742.50],
    },
    {
        "symbol": "LT",
        "name": "Larsen & Toubro Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 4209.10,
        "previous_close": 4211.00,
        "sparkline": [4215.0, 4211.00, 4205.0, 4210.0, 4209.10],
    },
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 342.56,
        "previous_close": 350.97,
        "sparkline": [350.97, 348.0, 345.0, 343.5, 342.56],
    },
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 125.53,
        "previous_close": 145.84,
        "sparkline": [145.84, 140.0, 134.0, 128.0, 125.53],
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 484.52,
        "previous_close": 497.34,
        "sparkline": [497.34, 492.0, 488.0, 485.5, 484.52],
    },
]
FALLBACK_MAP = {item["symbol"].upper(): item for item in FALLBACK_UNIVERSE}


class FallbackDevProvider(BaseMarketDataProvider):
    provider_name = "synthetic_dev"

    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote | None:
        sym_clean = symbol.upper().strip()
        data = FALLBACK_MAP.get(sym_clean)
        if not data:
            # Fallback search by base symbol if symbol contains prefix or suffix
            for k, v in FALLBACK_MAP.items():
                if sym_clean in k or k in sym_clean:
                    data = v
                    break

        if not data:
            return None

        exch = exchange or data["exchange"]
        session = resolve_session_state_for_exchange(exch)
        price = data["price"]
        prev_close = data["previous_close"]
        change, change_pct = self.calculate_price_change(price, prev_close)
        now = datetime.now(timezone.utc)

        return MarketQuote(
            instrument_id=f"inst_dev_{sym_clean.replace(' ', '_').replace('/', '_')}",
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
