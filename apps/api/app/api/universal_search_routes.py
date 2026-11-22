"""
MarketScope.io — Universal Search & Instrument Discovery API Routes
Comprehensive REST endpoints for search, coverage, quotes, history, valuation, risk, and aggregated research.
"""

from __future__ import annotations

import logging
from typing import Any
from fastapi import APIRouter, HTTPException, Query
from app.engine.universal_discovery_engine import universal_discovery_engine, SearchResultItem

logger = logging.getLogger("marketscope.search_routes")

router = APIRouter(prefix="/api/v1/instruments", tags=["Universal Search & Discovery"])


@router.get("/search")
def search_instruments(
    q: str = Query(min_length=1, max_length=100, description="Company name, ticker symbol, ISIN, BSE scrip code, or keyword"),
    exchange: str | None = Query(default=None, description="Optional exchange filter (e.g. NSE, BSE, NASDAQ, NYSE, LSE)"),
    country: str | None = Query(default=None, description="Optional country filter (e.g. India, United States)"),
    sector: str | None = Query(default=None, description="Optional sector filter"),
    security_type: str | None = Query(default=None, description="Optional security type filter (e.g. EQUITY, ETF, REIT)"),
    limit: int = Query(default=50, ge=1, le=100),
) -> dict[str, Any]:
    """
    Universal multi-factor ranked search endpoint supporting:
    - Exact ticker & ISIN matches (highest priority)
    - Company legal name and common brand aliases
    - Typo-tolerant fuzzy matching
    - Multi-exchange listings and disambiguation
    """
    results: list[SearchResultItem] = universal_discovery_engine.search(
        query=q,
        exchange=exchange,
        country=country,
        sector=sector,
        security_type=security_type,
        limit=limit,
    )
    return {
        "query": q,
        "count": len(results),
        "items": [item.model_dump() for item in results],
    }


@router.get("/admin/diagnostics")
def get_search_diagnostics() -> dict[str, Any]:
    """Administrative diagnostics for instrument coverage, searches, and zero-result queries."""
    return universal_discovery_engine.get_diagnostics()


@router.get("/profile/{instrument_id}")
def get_instrument_profile(instrument_id: str) -> dict[str, Any]:
    """Retrieves the canonical profile and identity for any instrument."""
    inst = universal_discovery_engine.get_instrument(instrument_id)
    if not inst:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")
    return inst.model_dump()


@router.get("/{instrument_id}/coverage")
def get_instrument_coverage(instrument_id: str) -> dict[str, Any]:
    """Returns data availability, freshness, and capability flags across all analytical domains."""
    inst = universal_discovery_engine.get_instrument(instrument_id)
    if not inst:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")
    return {
        "instrument_id": inst.instrument_id,
        "symbol": inst.symbol,
        "exchange": inst.exchange,
        "data_status": inst.data_status,
        "coverage": inst.coverage.model_dump(),
    }


@router.get("/{instrument_id}/quote")
def get_instrument_quote(instrument_id: str) -> dict[str, Any]:
    """Retrieves current price, daily range, change, volume, and data freshness."""
    try:
        return universal_discovery_engine.get_quote(instrument_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")


@router.get("/{instrument_id}/history")
def get_instrument_history(
    instrument_id: str,
    timeframe: str = Query(default="1M", pattern="^(1D|1W|1M|3M|1Y|5Y|ALL)$"),
) -> list[dict[str, Any]]:
    """Returns historical OHLCV candle series for interactive charting."""
    try:
        return universal_discovery_engine.get_history(instrument_id, timeframe=timeframe)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")


@router.get("/{instrument_id}/valuation")
def get_instrument_valuation(instrument_id: str) -> dict[str, Any]:
    """Retrieves DCF intrinsic value estimates, sector multiple comparisons, and discount metrics."""
    try:
        return universal_discovery_engine.get_valuation(instrument_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")


@router.get("/{instrument_id}/technical")
def get_instrument_technical(instrument_id: str) -> dict[str, Any]:
    """Returns technical momentum, RSI, MACD, Moving Averages, and Support/Resistance levels."""
    try:
        return universal_discovery_engine.get_technical(instrument_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")


@router.get("/{instrument_id}/risk")
def get_instrument_risk(instrument_id: str) -> dict[str, Any]:
    """Returns statistical downside risk metrics (VaR 95%, Downside Beta, Max Drawdown)."""
    try:
        return universal_discovery_engine.get_risk(instrument_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")


@router.get("/{instrument_id}/news")
def get_instrument_news(instrument_id: str) -> list[dict[str, Any]]:
    """Retrieves company-specific verified news articles with publisher and source links."""
    try:
        return universal_discovery_engine.get_news(instrument_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")


@router.get("/{instrument_id}/events")
def get_instrument_events(instrument_id: str) -> list[dict[str, Any]]:
    """Retrieves corporate calendar events (earnings calls, dividend record dates, AGM)."""
    try:
        return universal_discovery_engine.get_events(instrument_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")


@router.get("/{instrument_id}/intelligence")
def get_instrument_intelligence(instrument_id: str) -> dict[str, Any]:
    """Retrieves Q-Intelligence multi-factor score and factor vector breakdown."""
    try:
        return universal_discovery_engine.get_intelligence(instrument_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")


@router.get("/{instrument_id}/research")
def get_instrument_master_research(instrument_id: str) -> dict[str, Any]:
    """
    Master research bundle endpoint consolidating overview, quote, coverage, ratios,
    valuation, financials, technical, risk, intelligence, news, and events in a single call.
    """
    try:
        return universal_discovery_engine.get_master_research_bundle(instrument_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Instrument '{instrument_id}' not found.")
