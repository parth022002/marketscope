"""
MarketScope.io — Deterministic Fallback Development Provider
Explicitly flags all data as SYNTHETIC_DEVELOPMENT.
Used exclusively for local testing, offline development, or graceful degradation
when upstream commercial providers hit rate limits or network failures.
NEVER claims to be live real-time market data.
"""

import logging
from datetime import datetime, timezone
from decimal import Decimal
from typing import Sequence
from app.providers.market_data.base import BaseMarketDataProvider
from app.domain.schemas import MarketQuote, ProviderHealthItem
from app.engine.market_calendar import resolve_session_state_for_exchange
from app.engine.instrument_resolver import instrument_resolver
from app.engine.price_calculation_service import PriceCalculationService

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
        "price": 24180.80,
        "previous_close": 24055.40,
        "sparkline": [24055.40, 24090.0, 24140.0, 24160.0, 24180.80],
    },
    {
        "symbol": "NIFTY NEXT 50",
        "name": "Nifty Next 50 Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 68450.00,
        "previous_close": 68120.00,
        "sparkline": [68120.0, 68210.0, 68330.0, 68400.0, 68450.00],
    },
    {
        "symbol": "NIFTY BANK",
        "name": "Nifty Bank Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 51820.50,
        "previous_close": 51610.20,
        "sparkline": [51610.20, 51680.0, 51740.0, 51790.0, 51820.50],
    },
    {
        "symbol": "NIFTY FINANCIAL SERVICES",
        "name": "Nifty Financial Services Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 23980.50,
        "previous_close": 23890.00,
        "sparkline": [23890.0, 23910.0, 23940.0, 23960.0, 23980.50],
    },
    {
        "symbol": "NIFTY IT",
        "name": "Nifty IT Sector",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 41250.00,
        "previous_close": 40920.00,
        "sparkline": [40920.0, 41020.0, 41110.0, 41190.0, 41250.00],
    },
    {
        "symbol": "NIFTY MIDCAP 100",
        "name": "Nifty Midcap 100 Index",
        "exchange": "NSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 55420.00,
        "previous_close": 55180.00,
        "sparkline": [55180.0, 55240.0, 55310.0, 55380.0, 55420.00],
    },
    {
        "symbol": "SENSEX",
        "name": "BSE SENSEX 30",
        "exchange": "BSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 79802.40,
        "previous_close": 79422.20,
        "sparkline": [79422.20, 79510.0, 79650.0, 79740.0, 79802.40],
    },
    {
        "symbol": "BSE 100",
        "name": "S&P BSE 100 Index",
        "exchange": "BSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 25850.00,
        "previous_close": 25720.00,
        "sparkline": [25720.0, 25760.0, 25800.0, 25830.0, 25850.00],
    },
    {
        "symbol": "BSE 500",
        "name": "S&P BSE 500",
        "exchange": "BSE",
        "asset_class": "INDEX",
        "currency": "INR",
        "price": 34920.00,
        "previous_close": 34750.00,
        "sparkline": [34750.0, 34800.0, 34850.0, 34890.0, 34920.00],
    },

    # ─── 2. International Benchmark Indices ──────────────────────────────────
    {
        "symbol": "NASDAQ Composite",
        "name": "NASDAQ Composite Index",
        "exchange": "NASDAQ",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 18987.42,
        "previous_close": 19020.10,
        "sparkline": [19020.10, 19005.0, 18995.0, 18990.0, 18987.42],
    },
    {
        "symbol": "NASDAQ 100",
        "name": "NASDAQ 100 Index",
        "exchange": "NASDAQ",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 20910.45,
        "previous_close": 20995.65,
        "sparkline": [20995.65, 20970.0, 20940.0, 20925.0, 20910.45],
    },
    {
        "symbol": "S&P 500",
        "name": "S&P 500 Index",
        "exchange": "NYSE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 5969.34,
        "previous_close": 5956.84,
        "sparkline": [5956.84, 5960.0, 5964.0, 5968.0, 5969.34],
    },
    {
        "symbol": "Dow Jones",
        "name": "Dow Jones Industrial Average",
        "exchange": "NYSE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 43910.25,
        "previous_close": 43850.10,
        "sparkline": [43850.10, 43870.0, 43890.0, 43900.0, 43910.25],
    },
    {
        "symbol": "Russell 2000",
        "name": "Russell 2000 Small Cap Index",
        "exchange": "NYSE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 2365.40,
        "previous_close": 2358.10,
        "sparkline": [2358.10, 2360.0, 2362.5, 2364.0, 2365.40],
    },
    {
        "symbol": "VIX",
        "name": "CBOE Volatility Index",
        "exchange": "CBOE",
        "asset_class": "INDEX",
        "currency": "USD",
        "price": 14.80,
        "previous_close": 15.20,
        "sparkline": [15.20, 15.05, 14.95, 14.88, 14.80],
    },
    {
        "symbol": "FTSE 100",
        "name": "FTSE 100 Index London",
        "exchange": "LSE",
        "asset_class": "INDEX",
        "currency": "GBP",
        "price": 8380.50,
        "previous_close": 8360.20,
        "sparkline": [8360.20, 8368.0, 8372.0, 8377.0, 8380.50],
    },
    {
        "symbol": "DAX 40",
        "name": "DAX Index Germany",
        "exchange": "XETRA",
        "asset_class": "INDEX",
        "currency": "EUR",
        "price": 19950.20,
        "previous_close": 19890.00,
        "sparkline": [19890.00, 19910.0, 19930.0, 19942.0, 19950.20],
    },
    {
        "symbol": "CAC 40",
        "name": "CAC 40 Index Paris",
        "exchange": "EURONEXT",
        "asset_class": "INDEX",
        "currency": "EUR",
        "price": 7420.15,
        "previous_close": 7405.00,
        "sparkline": [7405.00, 7410.0, 7414.0, 7418.0, 7420.15],
    },
    {
        "symbol": "EURO STOXX 50",
        "name": "EURO STOXX 50 Index",
        "exchange": "EURONEXT",
        "asset_class": "INDEX",
        "currency": "EUR",
        "price": 4890.30,
        "previous_close": 4880.00,
        "sparkline": [4880.00, 4882.0, 4885.0, 4888.0, 4890.30],
    },
    {
        "symbol": "Nikkei 225",
        "name": "Nikkei 225 Tokyo",
        "exchange": "TSE",
        "asset_class": "INDEX",
        "currency": "JPY",
        "price": 38650.00,
        "previous_close": 38520.00,
        "sparkline": [38520.00, 38560.0, 38600.0, 38630.0, 38650.00],
    },
    {
        "symbol": "Hang Seng",
        "name": "Hang Seng Index Hong Kong",
        "exchange": "HKEX",
        "asset_class": "INDEX",
        "currency": "HKD",
        "price": 19580.00,
        "previous_close": 19640.00,
        "sparkline": [19640.00, 19620.0, 19600.0, 19590.0, 19580.00],
    },
    {
        "symbol": "Shanghai Composite",
        "name": "Shanghai Composite Index",
        "exchange": "SSE",
        "asset_class": "INDEX",
        "currency": "CNY",
        "price": 3370.00,
        "previous_close": 3365.00,
        "sparkline": [3365.00, 3366.0, 3368.0, 3369.0, 3370.00],
    },
    {
        "symbol": "KOSPI",
        "name": "Korea Composite Stock Index",
        "exchange": "KRX",
        "asset_class": "INDEX",
        "currency": "KRW",
        "price": 2480.00,
        "previous_close": 2490.00,
        "sparkline": [2490.00, 2488.0, 2485.0, 2482.0, 2480.00],
    },
    {
        "symbol": "ASX 200",
        "name": "S&P/ASX 200 Australia",
        "exchange": "ASX",
        "asset_class": "INDEX",
        "currency": "AUD",
        "price": 8420.00,
        "previous_close": 8400.00,
        "sparkline": [8400.00, 8405.0, 8412.0, 8416.0, 8420.00],
    },

    # ─── 3. Commodities & Energy ──────────────────────────────────────────────
    {
        "symbol": "GOLD SPOT",
        "name": "Gold Spot (oz)",
        "exchange": "COMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 2685.40,
        "previous_close": 2678.00,
        "sparkline": [2678.0, 2680.0, 2682.0, 2684.0, 2685.40],
    },
    {
        "symbol": "GOLD MCX",
        "name": "Gold 24K (10g)",
        "exchange": "MCX",
        "asset_class": "COMMODITY",
        "currency": "INR",
        "price": 76450.00,
        "previous_close": 76240.00,
        "sparkline": [76240.0, 76300.0, 76360.0, 76410.0, 76450.00],
    },
    {
        "symbol": "SILVER",
        "name": "Silver Spot (oz)",
        "exchange": "COMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 31.42,
        "previous_close": 31.25,
        "sparkline": [31.25, 31.30, 31.35, 31.39, 31.42],
    },
    {
        "symbol": "SILVER MCX",
        "name": "Silver 1Kg",
        "exchange": "MCX",
        "asset_class": "COMMODITY",
        "currency": "INR",
        "price": 89200.00,
        "previous_close": 88800.00,
        "sparkline": [88800.0, 88900.0, 89050.0, 89150.0, 89200.00],
    },
    {
        "symbol": "BRENT CRUDE",
        "name": "Brent Crude Oil",
        "exchange": "ICE",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 74.20,
        "previous_close": 73.35,
        "sparkline": [73.35, 73.60, 73.85, 74.05, 74.20],
    },
    {
        "symbol": "WTI CRUDE",
        "name": "Crude Oil WTI",
        "exchange": "NYMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 70.15,
        "previous_close": 69.40,
        "sparkline": [69.40, 69.65, 69.85, 70.00, 70.15],
    },
    {
        "symbol": "NATURAL GAS",
        "name": "Natural Gas Henry Hub",
        "exchange": "NYMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 3.15,
        "previous_close": 3.08,
        "sparkline": [3.08, 3.10, 3.12, 3.14, 3.15],
    },
    {
        "symbol": "COPPER",
        "name": "Copper Futures (lb)",
        "exchange": "COMEX",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 4.18,
        "previous_close": 4.15,
        "sparkline": [4.15, 4.16, 4.17, 4.175, 4.18],
    },
    {
        "symbol": "ALUMINIUM",
        "name": "Aluminium LME Cash",
        "exchange": "LME",
        "asset_class": "COMMODITY",
        "currency": "USD",
        "price": 2620.00,
        "previous_close": 2610.00,
        "sparkline": [2610.0, 2612.0, 2615.0, 2618.0, 2620.00],
    },

    # ─── 4. Foreign Exchange & Dollar Index ──────────────────────────────────
    {
        "symbol": "USD/INR",
        "name": "US Dollar / Indian Rupee",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 84.4200,
        "previous_close": 84.3800,
        "sparkline": [84.3800, 84.3900, 84.4050, 84.4150, 84.4200],
    },
    {
        "symbol": "EUR/INR",
        "name": "Euro / Indian Rupee",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 89.1500,
        "previous_close": 89.0500,
        "sparkline": [89.0500, 89.0800, 89.1100, 89.1350, 89.1500],
    },
    {
        "symbol": "GBP/INR",
        "name": "British Pound / Indian Rupee",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 106.8500,
        "previous_close": 106.7000,
        "sparkline": [106.7000, 106.7400, 106.7900, 106.8200, 106.8500],
    },
    {
        "symbol": "JPY/INR",
        "name": "Japanese Yen / Indian Rupee (100)",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "INR",
        "price": 54.8000,
        "previous_close": 54.9000,
        "sparkline": [54.9000, 54.8800, 54.8500, 54.8200, 54.8000],
    },
    {
        "symbol": "EUR/USD",
        "name": "Euro / US Dollar",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "USD",
        "price": 1.0560,
        "previous_close": 1.0550,
        "sparkline": [1.0550, 1.0552, 1.0555, 1.0558, 1.0560],
    },
    {
        "symbol": "GBP/USD",
        "name": "British Pound / US Dollar",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "USD",
        "price": 1.2650,
        "previous_close": 1.2640,
        "sparkline": [1.2640, 1.2642, 1.2646, 1.2648, 1.2650],
    },
    {
        "symbol": "USD/JPY",
        "name": "US Dollar / Japanese Yen",
        "exchange": "FOREX",
        "asset_class": "CURRENCY",
        "currency": "JPY",
        "price": 154.20,
        "previous_close": 153.90,
        "sparkline": [153.90, 154.00, 154.10, 154.15, 154.20],
    },
    {
        "symbol": "DXY",
        "name": "US Dollar Index",
        "exchange": "ICE",
        "asset_class": "CURRENCY",
        "currency": "USD",
        "price": 106.85,
        "previous_close": 106.90,
        "sparkline": [106.90, 106.88, 106.87, 106.86, 106.85],
    },

    # ─── 5. Sovereign Benchmark Bond Yields ───────────────────────────────────
    {
        "symbol": "US 10Y YIELD",
        "name": "US 10-Year Treasury Yield",
        "exchange": "BOND",
        "asset_class": "YIELD",
        "currency": "USD",
        "price": 4.420,
        "previous_close": 4.450,
        "sparkline": [4.450, 4.442, 4.435, 4.428, 4.420],
    },
    {
        "symbol": "INDIA 10Y YIELD",
        "name": "India 10-Year Benchmark G-Sec",
        "exchange": "RBI",
        "asset_class": "YIELD",
        "currency": "INR",
        "price": 6.780,
        "previous_close": 6.810,
        "sparkline": [6.810, 6.802, 6.795, 6.788, 6.780],
    },

    # ─── 6. Major Indian & Global Equities ───────────────────────────────────
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1265.40,
        "previous_close": 1258.00,
        "sparkline": [1258.00, 1260.0, 1262.5, 1264.0, 1265.40],
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 4150.20,
        "previous_close": 4120.00,
        "sparkline": [4120.00, 4130.0, 4138.0, 4145.0, 4150.20],
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1745.00,
        "previous_close": 1732.00,
        "sparkline": [1732.00, 1736.0, 1740.0, 1742.5, 1745.00],
    },
    {
        "symbol": "INFY",
        "name": "Infosys Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1860.00,
        "previous_close": 1845.00,
        "sparkline": [1845.00, 1850.0, 1855.0, 1858.0, 1860.00],
    },
    {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1260.00,
        "previous_close": 1250.00,
        "sparkline": [1250.00, 1252.0, 1256.0, 1258.5, 1260.00],
    },
    {
        "symbol": "BHARTIARTL",
        "name": "Bharti Airtel Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 1580.00,
        "previous_close": 1565.00,
        "sparkline": [1565.00, 1570.0, 1574.0, 1578.0, 1580.00],
    },
    {
        "symbol": "TATAMOTORS",
        "name": "Tata Motors Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 820.00,
        "previous_close": 815.00,
        "sparkline": [815.00, 816.5, 818.0, 819.0, 820.00],
    },
    {
        "symbol": "LT",
        "name": "Larsen & Toubro Limited",
        "exchange": "NSE",
        "asset_class": "EQUITY",
        "currency": "INR",
        "price": 3620.00,
        "previous_close": 3590.00,
        "sparkline": [3590.00, 3600.0, 3608.0, 3615.0, 3620.00],
    },
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 228.50,
        "previous_close": 227.00,
        "sparkline": [227.00, 227.4, 227.9, 228.2, 228.50],
    },
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 142.20,
        "previous_close": 140.50,
        "sparkline": [140.50, 141.0, 141.5, 141.9, 142.20],
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "exchange": "NASDAQ",
        "asset_class": "EQUITY",
        "currency": "USD",
        "price": 425.00,
        "previous_close": 423.00,
        "sparkline": [423.00, 423.5, 424.2, 424.8, 425.00],
    },
]
FALLBACK_MAP = {item["symbol"].upper(): item for item in FALLBACK_UNIVERSE}


class FallbackDevProvider(BaseMarketDataProvider):
    provider_name = "synthetic_dev"

    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote | None:
        sym_clean = symbol.upper().strip()
        canonical_inst = instrument_resolver.resolve(sym_clean, exchange)
        lookup_symbol = canonical_inst.symbol if canonical_inst else sym_clean

        data = FALLBACK_MAP.get(lookup_symbol)
        if not data:
            # Fallback search by base symbol if symbol contains prefix or suffix
            for k, v in FALLBACK_MAP.items():
                if lookup_symbol in k or k in lookup_symbol:
                    data = v
                    break

        if not data:
            return None

        exch = canonical_inst.exchange if canonical_inst else (exchange or data["exchange"])
        session = resolve_session_state_for_exchange(exch)
        price = data["price"]
        prev_close = data["previous_close"]
        precision = canonical_inst.price_precision if canonical_inst else 2

        change_dec, pct_dec = PriceCalculationService.calculate_price_change(
            Decimal(str(price)),
            Decimal(str(prev_close)),
            precision=precision,
        )
        now = datetime.now(timezone.utc)

        return MarketQuote(
            instrument_id=f"inst_dev_{lookup_symbol.replace(' ', '_').replace('/', '_')}",
            symbol=data["symbol"],
            name=data["name"],
            exchange=exch,
            asset_class=canonical_inst.asset_class if canonical_inst else data["asset_class"],
            currency=canonical_inst.currency if canonical_inst else data["currency"],
            price=price,
            open=round(prev_close * 1.001, precision),
            high=round(max(price, prev_close) * 1.004, precision),
            low=round(min(price, prev_close) * 0.996, precision),
            previous_close=prev_close,
            change=float(change_dec),
            change_pct=float(pct_dec),
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
