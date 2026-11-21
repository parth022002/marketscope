"""
MarketScope.io — Central Market Data Engine & Service
Orchestrates multi-provider ingestion, validation rules, L1 in-memory caching,
session calendar resolution, and WebSocket broadcasting.
"""

import os
import time
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import Sequence

from app.domain.schemas import (
    MarketQuote,
    TickerItem,
    MarketOverviewResponse,
    MarketBreadth,
    MarketMood,
    TopCompanyItem,
    MarketMoverItem,
    SectorPerformanceItem,
    ProviderHealthItem,
    DataQualityReport,
    InstrumentMasterItem,
)
from app.engine.market_calendar import (
    resolve_session_state_for_exchange,
    get_nse_session_state,
    get_us_session_state,
)
from app.providers.market_data.base import BaseMarketDataProvider
from app.providers.market_data.twelvedata_provider import TwelveDataProvider
from app.providers.market_data.fmp_provider import FMPDataProvider
from app.providers.market_data.fallback_provider import FallbackDevProvider, FALLBACK_UNIVERSE

logger = logging.getLogger(__name__)

CANONICAL_SYMBOLS = [
    ("NIFTY 50", "NSE", "indian_index"),
    ("SENSEX", "BSE", "indian_index"),
    ("NIFTY BANK", "NSE", "indian_index"),
    ("NIFTY IT", "NSE", "indian_index"),
    ("NIFTY MIDCAP 100", "NSE", "indian_index"),
    ("BSE 500", "BSE", "indian_index"),
    ("NASDAQ 100", "NASDAQ", "global_index"),
    ("S&P 500", "NYSE", "global_index"),
    ("BRENT CRUDE", "ICE", "commodity"),
    ("WTI CRUDE", "NYMEX", "commodity"),
    ("GOLD SPOT", "COMEX", "commodity"),
    ("GOLD MCX", "MCX", "commodity"),
    ("SILVER", "COMEX", "commodity"),
    ("NATURAL GAS", "NYMEX", "commodity"),
    ("USD/INR", "FOREX", "currency"),
    ("EUR/INR", "FOREX", "currency"),
    ("DXY", "ICE", "currency"),
    ("US 10Y YIELD", "BOND", "yield"),
    ("INDIA 10Y YIELD", "RBI", "yield"),
]

CANONICAL_EQUITIES = [
    ("RELIANCE", "Reliance Industries Limited", "NSE", "Energy & Conglomerates", "INR", False),
    ("TCS", "Tata Consultancy Services Limited", "NSE", "Information Technology", "INR", False),
    ("HDFCBANK", "HDFC Bank Limited", "NSE", "Financial Services", "INR", False),
    ("INFY", "Infosys Limited", "NSE", "Information Technology", "INR", False),
    ("BHARTIARTL", "Bharti Airtel Limited", "NSE", "Telecommunications", "INR", False),
    ("TATAMOTORS", "Tata Motors Limited", "NSE", "Automotive", "INR", False),
    ("LT", "Larsen & Toubro Limited", "NSE", "Infrastructure & Engineering", "INR", False),
    ("AAPL", "Apple Inc.", "NASDAQ", "Technology", "USD", True),
    ("NVDA", "NVIDIA Corporation", "NASDAQ", "Semiconductors", "USD", True),
    ("MSFT", "Microsoft Corporation", "NASDAQ", "Cloud & Software", "USD", True),
]


class CachedQuote:
    __slots__ = ("quote", "cached_at", "ttl_seconds")

    def __init__(self, quote: MarketQuote, ttl_seconds: float = 5.0):
        self.quote = quote
        self.cached_at = time.monotonic()
        self.ttl_seconds = ttl_seconds

    @property
    def is_expired(self) -> bool:
        return (time.monotonic() - self.cached_at) > self.ttl_seconds


class MarketDataService:
    def __init__(self):
        twelve_key = os.getenv("TWELVEDATA_API_KEY", "")
        fmp_key = os.getenv("FMP_API_KEY", "") or os.getenv("FINANCIAL_DATA_API_KEY", "")

        self.twelve_provider = TwelveDataProvider(api_key=twelve_key)
        self.fmp_provider = FMPDataProvider(api_key=fmp_key)
        self.fallback_provider = FallbackDevProvider()

        self._l1_cache: dict[str, CachedQuote] = {}
        self._anomaly_log: list[dict] = []
        self._active_ws_connections: int = 0

    def register_ws_connection(self):
        self._active_ws_connections += 1

    def unregister_ws_connection(self):
        self._active_ws_connections = max(0, self._active_ws_connections - 1)

    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote:
        cache_key = f"{symbol.upper()}:{exchange.upper() if exchange else 'DEF'}"
        cached = self._l1_cache.get(cache_key)
        if cached and not cached.is_expired:
            return cached.quote

        session = resolve_session_state_for_exchange(exchange or "")
        quote: MarketQuote | None = None

        # 1. Attempt Twelve Data
        if self.twelve_provider.api_key:
            try:
                quote = await self.twelve_provider.get_quote(symbol, exchange)
            except Exception as e:
                logger.warning(f"TwelveData get_quote failed for {symbol}: {e}")

        # 2. Attempt FMP if Twelve Data returned None
        if not quote and self.fmp_provider.api_key:
            try:
                quote = await self.fmp_provider.get_quote(symbol, exchange)
            except Exception as e:
                logger.warning(f"FMP get_quote failed for {symbol}: {e}")

        # 3. Deterministic Fallback if external providers unavailable
        if not quote:
            quote = await self.fallback_provider.get_quote(symbol, exchange)

        if not quote:
            # Synthetic emergency fallback for unknown symbols
            now = datetime.now(timezone.utc)
            quote = MarketQuote(
                instrument_id=f"inst_dev_{symbol}",
                symbol=symbol,
                name=symbol,
                exchange=exchange or "NSE",
                asset_class="EQUITY",
                currency="INR",
                price=100.0,
                previous_close=100.0,
                change=0.0,
                change_pct=0.0,
                market_status=session.market_status,
                data_status="SYNTHETIC_DEVELOPMENT",
                source_provider="synthetic_dev",
                timestamp=now,
                received_at=now,
                sparkline=[100.0, 100.0],
            )

        # Apply strict validation & session alignment
        quote = self._apply_validation_and_session(quote, session)

        # TTL determination: 5 seconds if open, 300 seconds if closed
        ttl = 5.0 if session.is_regular_trading else 300.0
        self._l1_cache[cache_key] = CachedQuote(quote, ttl_seconds=ttl)
        return quote

    def _apply_validation_and_session(self, quote: MarketQuote, session) -> MarketQuote:
        # Validate mathematical change
        change, change_pct = BaseMarketDataProvider.calculate_price_change(
            quote.price, quote.previous_close
        )
        quote.change = change
        quote.change_pct = change_pct

        # Check price jump anomaly
        if BaseMarketDataProvider.is_price_jump_anomalous(quote.price, quote.previous_close):
            self._anomaly_log.append({
                "symbol": quote.symbol,
                "price": quote.price,
                "prev_close": quote.previous_close,
                "change_pct": quote.change_pct,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

        # Align market status with calendar
        quote.market_status = session.market_status

        # If market is closed, data status must be CLOSED or EOD unless already synthetic
        if not session.is_regular_trading and quote.data_status not in ("SYNTHETIC_DEVELOPMENT", "EOD"):
            quote.data_status = "CLOSED"

        return quote

    async def get_ticker_feed(self) -> list[TickerItem]:
        items: list[TickerItem] = []
        for sym, exch, category in CANONICAL_SYMBOLS:
            quote = await self.get_quote(sym, exch)
            items.append(
                TickerItem(
                    symbol=quote.symbol,
                    name=quote.name,
                    category=category,
                    exchange=quote.exchange,
                    price=quote.price,
                    change=quote.change,
                    change_pct=quote.change_pct,
                    currency=quote.currency,
                    market_status=quote.market_status,
                    data_status=quote.data_status,
                    sparkline=quote.sparkline,
                    timestamp=quote.timestamp.isoformat(),
                    provider=quote.source_provider,
                )
            )
        return items

    async def get_market_overview(self) -> MarketOverviewResponse:
        nse_session = get_nse_session_state()
        us_session = get_us_session_state()
        ticker_items = await self.get_ticker_feed()

        # Build top companies
        top_companies: list[TopCompanyItem] = []
        for sym, name, exch, sector, curr, is_global in CANONICAL_EQUITIES:
            q = await self.get_quote(sym, exch)
            top_companies.append(
                TopCompanyItem(
                    symbol=q.symbol,
                    name=name,
                    exchange=exch,
                    sector=sector,
                    price=q.price,
                    change_pct=q.change_pct,
                    market_cap_cr=1991200.0 if sym == "RELIANCE" else (1492500.0 if sym == "TCS" else 889200.0),
                    volume=q.volume or 5000000,
                    currency=curr,
                    is_global=is_global,
                )
            )

        indices = [item for item in ticker_items if "index" in item.category]
        commodities = [item for item in ticker_items if item.category == "commodity"]
        currencies_and_yields = [
            item for item in ticker_items if item.category in ("currency", "yield")
        ]

        # Top gainers and losers from top companies & indices
        all_sorted = sorted(top_companies, key=lambda x: x.change_pct, reverse=True)
        top_gainers = [
            MarketMoverItem(
                symbol=c.symbol,
                name=c.name,
                exchange=c.exchange,
                price=c.price,
                change=round(c.price * (c.change_pct / 100.0), 2),
                change_pct=c.change_pct,
                volume=c.volume,
                week52_high=round(c.price * 1.25, 2),
                week52_low=round(c.price * 0.75, 2),
                currency=c.currency,
            )
            for c in all_sorted if c.change_pct > 0
        ]
        top_losers = [
            MarketMoverItem(
                symbol=c.symbol,
                name=c.name,
                exchange=c.exchange,
                price=c.price,
                change=round(c.price * (c.change_pct / 100.0), 2),
                change_pct=c.change_pct,
                volume=c.volume,
                week52_high=round(c.price * 1.25, 2),
                week52_low=round(c.price * 0.75, 2),
                currency=c.currency,
            )
            for c in reversed(all_sorted) if c.change_pct < 0
        ]

        sectors = [
            SectorPerformanceItem(sector="Energy", change_pct=1.45, market_cap_cr=2450000.0, leading_stock="RELIANCE (+1.45%)", lagging_stock="BPCL (-0.35%)"),
            SectorPerformanceItem(sector="Financial Services", change_pct=0.82, market_cap_cr=3890000.0, leading_stock="ICICIBANK (+1.12%)", lagging_stock="KOTAKBANK (-0.22%)"),
            SectorPerformanceItem(sector="Information Technology", change_pct=-0.48, market_cap_cr=2840000.0, leading_stock="HCLTECH (+0.45%)", lagging_stock="INFY (-0.62%)"),
            SectorPerformanceItem(sector="Automotive", change_pct=1.12, market_cap_cr=1420000.0, leading_stock="TATAMOTORS (+2.15%)", lagging_stock="BAJAJ-AUTO (-0.15%)"),
            SectorPerformanceItem(sector="Semiconductors", change_pct=2.85, market_cap_cr=3580000.0, leading_stock="NVDA (+2.85%)", lagging_stock="INTC (-1.20%)"),
        ]

        return MarketOverviewResponse(
            indian_market_status=nse_session.market_status,
            global_market_status=us_session.market_status,
            as_of=datetime.now(timezone.utc),
            market_breadth=MarketBreadth(
                advances=32,
                declines=18,
                unchanged=0,
                advance_decline_ratio=1.78,
                total_turnover_cr=84250.0,
                exchange_status=nse_session.market_status,
            ),
            market_mood=MarketMood(
                score=64,
                label="Greed",
                description="Domestic institutional flows remain positive with firm global market cues.",
            ),
            indices=indices,
            commodities=commodities,
            currencies_and_yields=currencies_and_yields,
            top_companies=top_companies,
            movers={
                "top_gainers": top_gainers,
                "top_losers": top_losers,
                "most_active": top_gainers,
            },
            sector_performance=sectors,
        )

    async def get_data_quality_report(self) -> DataQualityReport:
        # Check providers
        twelve_health = await self.twelve_provider.health_check()
        fmp_health = await self.fmp_provider.health_check()
        fallback_health = await self.fallback_provider.health_check()

        providers = [twelve_health, fmp_health, fallback_health]

        # Scan cache for freshness counts
        live_cnt = sum(1 for c in self._l1_cache.values() if c.quote.data_status == "LIVE")
        delayed_cnt = sum(1 for c in self._l1_cache.values() if "DELAYED" in c.quote.data_status)
        eod_cnt = sum(1 for c in self._l1_cache.values() if c.quote.data_status in ("EOD", "CLOSED"))

        overall_status = "OPTIMAL" if any(p.status == "HEALTHY" and p.provider_name != "synthetic_dev" for p in providers) else "ACCEPTABLE"

        return DataQualityReport(
            status=overall_status,
            providers=providers,
            total_instruments_monitored=len(CANONICAL_SYMBOLS) + len(CANONICAL_EQUITIES),
            live_streaming_count=live_cnt,
            delayed_count=delayed_cnt,
            eod_closed_count=eod_cnt,
            anomaly_count=len(self._anomaly_log),
            active_websocket_connections=self._active_ws_connections,
            timestamp=datetime.now(timezone.utc),
        )

    def get_canonical_instruments(self) -> list[InstrumentMasterItem]:
        items: list[InstrumentMasterItem] = []
        for sym, exch, category in CANONICAL_SYMBOLS:
            items.append(
                InstrumentMasterItem(
                    instrument_id=f"inst_master_{sym.replace(' ', '_')}",
                    symbol=sym,
                    display_name=sym,
                    exchange=exch,
                    asset_class=category.upper(),
                    currency="INR" if exch in ("NSE", "BSE", "MCX", "RBI") else "USD",
                    isin=None,
                    bse_scrip_code=None,
                    primary_vendor="twelvedata",
                    supported_vendors=["twelvedata", "fmp", "synthetic_dev"],
                )
            )
        for sym, name, exch, sector, curr, _ in CANONICAL_EQUITIES:
            items.append(
                InstrumentMasterItem(
                    instrument_id=f"inst_master_{sym}",
                    symbol=sym,
                    display_name=name,
                    exchange=exch,
                    asset_class="EQUITY",
                    currency=curr,
                    isin="INE002A01018" if sym == "RELIANCE" else None,
                    bse_scrip_code="500325" if sym == "RELIANCE" else None,
                    primary_vendor="twelvedata",
                    supported_vendors=["twelvedata", "fmp", "synthetic_dev"],
                )
            )
        return items


# Global singleton instance
market_data_service = MarketDataService()
