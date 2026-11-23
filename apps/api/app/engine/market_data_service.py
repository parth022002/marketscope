"""
MarketScope.io — Central Market Data Engine & Service
Orchestrates multi-provider ingestion, validation rules, L1 in-memory and L2 Redis caching,
session calendar resolution, and WebSocket broadcasting.
"""

import os
import time
import json
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import Sequence

import redis

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
from app.providers.market_data.live_exchange_provider import LiveExchangeProvider
from app.providers.market_data.twelvedata_provider import TwelveDataProvider
from app.providers.market_data.fmp_provider import FMPDataProvider
from app.providers.market_data.fallback_provider import FallbackDevProvider, FALLBACK_UNIVERSE
from app.engine.instrument_resolver import instrument_resolver
from app.engine.price_calculation_service import PriceCalculationService
from decimal import Decimal
from app.core.database import SessionLocal
from app.domain.models import MarketQuoteRecord

logger = logging.getLogger(__name__)

# Complete Canonical Universe (51 instruments across 6 asset classes)
CANONICAL_SYMBOLS = [
    # ─── 1. Indian Indices ───────────────────────────────────────────────────
    ("NIFTY 50", "NSE", "indian_index"),
    ("NIFTY NEXT 50", "NSE", "indian_index"),
    ("NIFTY BANK", "NSE", "indian_index"),
    ("NIFTY FINANCIAL SERVICES", "NSE", "indian_index"),
    ("NIFTY IT", "NSE", "indian_index"),
    ("NIFTY MIDCAP 100", "NSE", "indian_index"),
    ("SENSEX", "BSE", "indian_index"),
    ("BSE 100", "BSE", "indian_index"),
    ("BSE 500", "BSE", "indian_index"),

    # ─── 2. International Benchmark Indices ──────────────────────────────────
    ("NASDAQ Composite", "NASDAQ", "global_index"),
    ("NASDAQ 100", "NASDAQ", "global_index"),
    ("S&P 500", "NYSE", "global_index"),
    ("Dow Jones", "NYSE", "global_index"),
    ("Russell 2000", "NYSE", "global_index"),
    ("VIX", "CBOE", "global_index"),
    ("FTSE 100", "LSE", "global_index"),
    ("DAX 40", "XETRA", "global_index"),
    ("CAC 40", "EURONEXT", "global_index"),
    ("EURO STOXX 50", "EURONEXT", "global_index"),
    ("Nikkei 225", "TSE", "global_index"),
    ("Hang Seng", "HKEX", "global_index"),
    ("Shanghai Composite", "SSE", "global_index"),
    ("KOSPI", "KRX", "global_index"),
    ("ASX 200", "ASX", "global_index"),

    # ─── 3. Commodities & Energy ──────────────────────────────────────────────
    ("GOLD SPOT", "COMEX", "commodity"),
    ("GOLD MCX", "MCX", "commodity"),
    ("SILVER", "COMEX", "commodity"),
    ("BRENT CRUDE", "ICE", "commodity"),
    ("WTI CRUDE", "NYMEX", "commodity"),
    ("NATURAL GAS", "NYMEX", "commodity"),
    ("COPPER", "COMEX", "commodity"),
    ("ALUMINIUM", "LME", "commodity"),

    # ─── 4. Foreign Exchange & Dollar Index ──────────────────────────────────
    ("USD/INR", "FOREX", "currency"),
    ("EUR/INR", "FOREX", "currency"),
    ("GBP/INR", "FOREX", "currency"),
    ("JPY/INR", "FOREX", "currency"),
    ("EUR/USD", "FOREX", "currency"),
    ("GBP/USD", "FOREX", "currency"),
    ("USD/JPY", "FOREX", "currency"),
    ("DXY", "ICE", "currency"),

    # ─── 5. Sovereign Benchmark Bond Yields ───────────────────────────────────
    ("US 10Y YIELD", "BOND", "yield"),
    ("INDIA 10Y YIELD", "RBI", "yield"),
]

CANONICAL_EQUITIES = [
    ("RELIANCE", "Reliance Industries Limited", "NSE", "Energy & Conglomerates", "INR", False),
    ("TCS", "Tata Consultancy Services Limited", "NSE", "Information Technology", "INR", False),
    ("HDFCBANK", "HDFC Bank Limited", "NSE", "Financial Services", "INR", False),
    ("INFY", "Infosys Limited", "NSE", "Information Technology", "INR", False),
    ("ICICIBANK", "ICICI Bank Limited", "NSE", "Financial Services", "INR", False),
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

        self.live_provider = LiveExchangeProvider()
        self.twelve_provider = TwelveDataProvider(api_key=twelve_key)
        self.fmp_provider = FMPDataProvider(api_key=fmp_key)
        self.fallback_provider = FallbackDevProvider()

        self._l1_cache: dict[str, CachedQuote] = {}
        self._anomaly_log: list[dict] = []
        self._active_ws_connections: int = 0
        self._ws_broadcast_callback = None

        # Optional Redis L2 Cache connection
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self._redis_client = None
        try:
            client = redis.from_url(redis_url, decode_responses=True, socket_connect_timeout=0.2)
            client.ping()
            self._redis_client = client
        except Exception:
            self._redis_client = None

    def set_ws_broadcast_callback(self, callback):
        self._ws_broadcast_callback = callback

    def register_ws_connection(self):
        self._active_ws_connections += 1

    def unregister_ws_connection(self):
        self._active_ws_connections = max(0, self._active_ws_connections - 1)

    def persist_quote_to_db(self, quote: MarketQuote):
        try:
            db = SessionLocal()
            try:
                rec = db.query(MarketQuoteRecord).filter(MarketQuoteRecord.symbol == quote.symbol).first()
                now = datetime.now(timezone.utc)
                if not rec:
                    rec = MarketQuoteRecord(
                        symbol=quote.symbol,
                        instrument_id=quote.instrument_id,
                        name=quote.name,
                        exchange=quote.exchange,
                        asset_class=quote.asset_class,
                        currency=quote.currency,
                        price=quote.price,
                        open=quote.open,
                        high=quote.high,
                        low=quote.low,
                        previous_close=quote.previous_close,
                        change=quote.change,
                        change_pct=quote.change_pct,
                        volume=quote.volume,
                        market_status=quote.market_status,
                        data_status=quote.data_status,
                        source_provider=quote.source_provider,
                        sparkline=quote.sparkline,
                        timestamp=quote.timestamp,
                        updated_at=now,
                    )
                    db.add(rec)
                else:
                    rec.price = quote.price
                    rec.open = quote.open
                    rec.high = quote.high
                    rec.low = quote.low
                    rec.previous_close = quote.previous_close
                    rec.change = quote.change
                    rec.change_pct = quote.change_pct
                    rec.volume = quote.volume
                    rec.market_status = quote.market_status
                    rec.data_status = quote.data_status
                    rec.source_provider = quote.source_provider
                    rec.sparkline = quote.sparkline
                    rec.timestamp = quote.timestamp
                    rec.updated_at = now
                db.commit()
            finally:
                db.close()
        except Exception as e:
            logger.debug(f"Failed to persist quote {quote.symbol} to DB: {e}")

    def load_quote_from_db(self, symbol: str, exchange: str | None = None) -> MarketQuote | None:
        try:
            db = SessionLocal()
            try:
                rec = db.query(MarketQuoteRecord).filter(MarketQuoteRecord.symbol == symbol).first()
                if rec:
                    return MarketQuote(
                        instrument_id=rec.instrument_id or f"inst_db_{rec.symbol}",
                        symbol=rec.symbol,
                        name=rec.name,
                        exchange=rec.exchange,
                        asset_class=rec.asset_class,
                        currency=rec.currency,
                        price=float(rec.price),
                        open=float(rec.open) if rec.open is not None else None,
                        high=float(rec.high) if rec.high is not None else None,
                        low=float(rec.low) if rec.low is not None else None,
                        previous_close=float(rec.previous_close),
                        change=float(rec.change),
                        change_pct=float(rec.change_pct),
                        volume=int(rec.volume) if rec.volume is not None else None,
                        market_status=rec.market_status,
                        data_status=rec.data_status,
                        source_provider=f"db_{rec.source_provider}",
                        sparkline=rec.sparkline or [],
                        timestamp=rec.timestamp,
                        received_at=rec.updated_at,
                    )
            finally:
                db.close()
        except Exception as e:
            logger.debug(f"Failed to load quote {symbol} from DB: {e}")
        return None

    def persist_batch_quotes_to_db(self, quotes: list[MarketQuote]):
        if not quotes:
            return
        try:
            db = SessionLocal()
            try:
                symbols = [q.symbol for q in quotes]
                existing = {r.symbol: r for r in db.query(MarketQuoteRecord).filter(MarketQuoteRecord.symbol.in_(symbols)).all()}
                now = datetime.now(timezone.utc)
                for q in quotes:
                    rec = existing.get(q.symbol)
                    if not rec:
                        rec = MarketQuoteRecord(
                            symbol=q.symbol,
                            instrument_id=q.instrument_id,
                            name=q.name,
                            exchange=q.exchange,
                            asset_class=q.asset_class,
                            currency=q.currency,
                            price=q.price,
                            open=q.open,
                            high=q.high,
                            low=q.low,
                            previous_close=q.previous_close,
                            change=q.change,
                            change_pct=q.change_pct,
                            volume=q.volume,
                            market_status=q.market_status,
                            data_status=q.data_status,
                            source_provider=q.source_provider,
                            sparkline=q.sparkline,
                            timestamp=q.timestamp,
                            updated_at=now,
                        )
                        db.add(rec)
                    else:
                        rec.price = q.price
                        rec.open = q.open
                        rec.high = q.high
                        rec.low = q.low
                        rec.previous_close = q.previous_close
                        rec.change = q.change
                        rec.change_pct = q.change_pct
                        rec.volume = q.volume
                        rec.market_status = q.market_status
                        rec.data_status = q.data_status
                        rec.source_provider = q.source_provider
                        rec.sparkline = q.sparkline
                        rec.timestamp = q.timestamp
                        rec.updated_at = now
                db.commit()
            finally:
                db.close()
        except Exception as e:
            logger.debug(f"Failed to persist batch quotes to DB: {e}")

    async def sync_live_quotes_to_db(self) -> list[MarketQuote]:
        """
        Actively queries live exchange feeds for core global and Indian market instruments,
        persists snapshots into PostgreSQL database, and updates in-memory and Redis caches.
        """
        symbols_to_sync = [
            ("NIFTY 50", "NSE"),
            ("SENSEX", "BSE"),
            ("NIFTY BANK", "NSE"),
            ("NIFTY IT", "NSE"),
            ("RELIANCE", "NSE"),
            ("TCS", "NSE"),
            ("HDFCBANK", "NSE"),
            ("INFY", "NSE"),
            ("ICICIBANK", "NSE"),
            ("BHARTIARTL", "NSE"),
            ("TATAMOTORS", "NSE"),
            ("LT", "NSE"),
            ("NASDAQ 100", "NASDAQ"),
            ("S&P 500", "NYSE"),
            ("DOW JONES", "NYSE"),
            ("AAPL", "NASDAQ"),
            ("NVDA", "NASDAQ"),
            ("MSFT", "NASDAQ"),
            ("BRENT CRUDE", "ICE"),
            ("GOLD MCX", "MCX"),
            ("SILVER", "MCX"),
            ("USD/INR", "FOREX"),
            ("US 10Y YIELD", "BOND"),
        ]

        tasks = [self.live_provider.get_quote(sym, exch) for sym, exch in symbols_to_sync]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        valid_quotes: list[MarketQuote] = []
        for (sym, exch), res in zip(symbols_to_sync, results):
            if isinstance(res, MarketQuote):
                session = resolve_session_state_for_exchange(exch)
                validated = self._apply_validation_and_session(res, session)
                valid_quotes.append(validated)
                cache_key = f"{sym.upper()}:{exch.upper()}"
                ttl = 5.0 if session.is_regular_trading else 300.0
                self._l1_cache[cache_key] = CachedQuote(validated, ttl_seconds=ttl)

        if valid_quotes:
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, self.persist_batch_quotes_to_db, valid_quotes)
            logger.info(f"Successfully synced and persisted {len(valid_quotes)} live quotes to database.")

            if self._ws_broadcast_callback:
                try:
                    await self._ws_broadcast_callback(valid_quotes)
                except Exception as e:
                    logger.debug(f"WebSocket broadcast callback error: {e}")

        return valid_quotes

    async def get_quote(self, symbol: str, exchange: str | None = None) -> MarketQuote:
        cache_key = f"{symbol.upper()}:{exchange.upper() if exchange else 'DEF'}"
        
        # 1. L1 In-Memory Cache Check
        cached = self._l1_cache.get(cache_key)
        if cached and not cached.is_expired:
            return cached.quote

        # 2. L2 Redis Cache Check (if connected)
        if self._redis_client:
            try:
                redis_data = self._redis_client.get(f"marketscope:quote:{cache_key}")
                if redis_data:
                    q_dict = json.loads(redis_data)
                    quote = MarketQuote.model_validate(q_dict)
                    self._l1_cache[cache_key] = CachedQuote(quote, ttl_seconds=5.0)
                    return quote
            except Exception:
                pass

        session = resolve_session_state_for_exchange(exchange or "")
        quote: MarketQuote | None = None

        # 3. Attempt Primary Live Exchange Provider (Real-Time Exchange Rates)
        try:
            quote = await self.live_provider.get_quote(symbol, exchange)
            if quote:
                loop = asyncio.get_running_loop()
                loop.run_in_executor(None, self.persist_quote_to_db, quote)
        except Exception as e:
            logger.debug(f"LiveExchangeProvider get_quote failed for {symbol}: {e}")

        # 4. Attempt Secondary Commercial Provider (Twelve Data)
        if not quote and self.twelve_provider.api_key:
            try:
                quote = await self.twelve_provider.get_quote(symbol, exchange)
                if quote:
                    loop = asyncio.get_running_loop()
                    loop.run_in_executor(None, self.persist_quote_to_db, quote)
            except Exception as e:
                logger.warning(f"TwelveData get_quote failed for {symbol}: {e}")

        # 5. Attempt Tertiary Provider (FMP)
        if not quote and self.fmp_provider.api_key:
            try:
                quote = await self.fmp_provider.get_quote(symbol, exchange)
                if quote:
                    loop = asyncio.get_running_loop()
                    loop.run_in_executor(None, self.persist_quote_to_db, quote)
            except Exception as e:
                logger.warning(f"FMP get_quote failed for {symbol}: {e}")

        # 5b. Attempt to load latest recorded real quote from PostgreSQL database
        if not quote:
            try:
                loop = asyncio.get_running_loop()
                quote = await loop.run_in_executor(None, self.load_quote_from_db, symbol, exchange)
            except Exception as e:
                logger.debug(f"Database quote lookup failed for {symbol}: {e}")

        # 6. Calibrated Deterministic Fallback if external providers and database unavailable
        if not quote:
            quote = await self.fallback_provider.get_quote(symbol, exchange)


        if not quote:
            # Fallback for unknown symbols
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

        # Write through to Redis L2 if active
        if self._redis_client:
            try:
                self._redis_client.setex(
                    f"marketscope:quote:{cache_key}",
                    int(ttl),
                    quote.model_dump_json(),
                )
            except Exception:
                pass

        return quote

    def _apply_validation_and_session(self, quote: MarketQuote, session) -> MarketQuote:
        canonical_inst = instrument_resolver.resolve(quote.symbol, quote.exchange)
        precision = canonical_inst.price_precision if canonical_inst else 2

        # Validate mathematical change with strict Decimal precision
        change_dec, pct_dec = PriceCalculationService.calculate_price_change(
            Decimal(str(quote.price)),
            Decimal(str(quote.previous_close)),
            precision=precision,
        )
        quote.change = float(change_dec)
        quote.change_pct = float(pct_dec)

        # Check price jump anomaly
        if PriceCalculationService.is_price_jump_anomalous(
            Decimal(str(quote.price)),
            Decimal(str(quote.previous_close)),
            threshold_pct=35.0,
        ):
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
        tasks = [self.get_quote(sym, exch) for sym, exch, _ in CANONICAL_SYMBOLS]
        quotes = await asyncio.gather(*tasks, return_exceptions=True)

        for (sym, exch, category), quote in zip(CANONICAL_SYMBOLS, quotes):
            if isinstance(quote, Exception) or not quote:
                quote = await self.fallback_provider.get_quote(sym, exch)
            if not quote:
                continue
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

        mcap_map = {
            "RELIANCE": 1991200.0,
            "TCS": 1492500.0,
            "HDFCBANK": 1334000.0,
            "BHARTIARTL": 1224000.0,
            "ICICIBANK": 1148000.0,
            "INFY": 912000.0,
            "LT": 578000.0,
            "TATAMOTORS": 298500.0,
            "AAPL": 4978000.0,
            "NVDA": 3580000.0,
            "MSFT": 3620000.0,
        }

        # Build top companies concurrently
        top_tasks = [self.get_quote(sym, exch) for sym, _, exch, _, _, _ in CANONICAL_EQUITIES]
        top_quotes = await asyncio.gather(*top_tasks, return_exceptions=True)

        top_companies: list[TopCompanyItem] = []
        for (sym, name, exch, sector, curr, is_global), q in zip(CANONICAL_EQUITIES, top_quotes):
            if isinstance(q, Exception) or not q:
                q = await self.fallback_provider.get_quote(sym, exch)
            if not q:
                continue
            top_companies.append(
                TopCompanyItem(
                    symbol=q.symbol,
                    name=name,
                    exchange=exch,
                    sector=sector,
                    price=q.price,
                    change_pct=q.change_pct,
                    market_cap_cr=mcap_map.get(sym, 500000.0),
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
        live_health = await self.live_provider.health_check()
        twelve_health = await self.twelve_provider.health_check()
        fmp_health = await self.fmp_provider.health_check()
        fallback_health = await self.fallback_provider.health_check()

        providers = [live_health, twelve_health, fmp_health, fallback_health]

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
                    instrument_id=f"inst_master_{sym.replace(' ', '_').replace('/', '_')}",
                    symbol=sym,
                    display_name=sym,
                    exchange=exch,
                    asset_class=category.upper(),
                    currency="INR" if exch in ("NSE", "BSE", "MCX", "RBI") else "USD",
                    isin=None,
                    bse_scrip_code=None,
                    primary_vendor="live_exchange",
                    supported_vendors=["live_exchange", "twelvedata", "fmp", "synthetic_dev"],
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
                    isin="INE002A01018" if sym == "RELIANCE" else ("INE467B01029" if sym == "TCS" else None),
                    bse_scrip_code="500325" if sym == "RELIANCE" else ("532540" if sym == "TCS" else None),
                    primary_vendor="live_exchange",
                    supported_vendors=["live_exchange", "twelvedata", "fmp", "synthetic_dev"],
                )
            )
        return items


# Global singleton instance
market_data_service = MarketDataService()
