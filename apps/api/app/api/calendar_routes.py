"""
MarketScope.io — Global Market Calendar & Market Status Intelligence API Routes
Full implementation of endpoints for real-time market status, multi-exchange holiday databases,
economic and corporate earnings catalysts, market hours, and user calendar alerts.
"""

from typing import Any
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.domain.canonical_calendar import (
    MarketStatus,
    HolidayCategory,
    EventImportance,
    EventCategory,
    MarketSessionInfo,
    CalendarHolidayRecord,
    EconomicCorporateEventRecord,
    GlobalMarketStatusSummary,
    CalendarUserPreferences,
)
from app.engine.market_calendar import (
    market_calendar_engine,
    EXCHANGE_CONFIGS,
    CANONICAL_HOLIDAYS,
)

calendar_router = APIRouter(prefix="", tags=["Global Market Calendar & Status"])


# ─────────────────────────────────────────────────────────────────────────────
# 1. Market Status Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@calendar_router.get(
    "/calendar/markets/status",
    response_model=GlobalMarketStatusSummary,
    summary="Global Market Status Snapshot",
)
def get_global_markets_status(
    timezone: str | None = Query(None, description="Optional user timezone name (e.g. Asia/Kolkata, America/New_York)"),
):
    """
    Returns real-time session calculations across Indian (NSE, BSE, MCX), US, European,
    and Asian exchanges, including countdowns, open/close times, and today's holidays.
    """
    return market_calendar_engine.get_all_markets_summary(user_timezone=timezone)


@calendar_router.get(
    "/calendar/markets/{market_id}",
    response_model=MarketSessionInfo,
    summary="Individual Market Session Status",
)
def get_individual_market_status(
    market_id: str,
    timezone: str | None = Query(None, description="Optional user timezone"),
):
    """Returns detailed session status, operating hours, and holiday status for a specific exchange."""
    return market_calendar_engine.get_market_session(market_id=market_id, user_timezone=timezone)


@calendar_router.get(
    "/calendar/market-hours",
    summary="Global Exchange Trading Hours Directory",
)
def get_market_hours_directory():
    """Returns authoritative opening, closing, pre-market, and lunch break hours for all registered exchanges."""
    directory = []
    for code, conf in EXCHANGE_CONFIGS.items():
        directory.append({
            "market_id": code,
            "exchange_name": conf["name"],
            "mic": conf["mic"],
            "country": conf["country"],
            "region": conf["region"],
            "timezone": conf["tz_name"],
            "pre_market": f"{conf['pre_market_start'].strftime('%H:%M')}–{conf['pre_market_end'].strftime('%H:%M')}" if conf.get("pre_market_start") else None,
            "regular_hours": f"{conf['market_open'].strftime('%H:%M')}–{conf['market_close'].strftime('%H:%M')}",
            "lunch_break": f"{conf['break_start'].strftime('%H:%M')}–{conf['break_end'].strftime('%H:%M')}" if conf.get("has_break") else None,
            "post_market": f"{conf['post_close_start'].strftime('%H:%M')}–{conf['post_close_end'].strftime('%H:%M')}" if conf.get("post_close_start") else None,
            "asset_classes": conf["asset_classes"],
        })
    return directory


# ─────────────────────────────────────────────────────────────────────────────
# 2. Holiday Intelligence Database Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@calendar_router.get(
    "/calendar/holidays",
    response_model=list[CalendarHolidayRecord],
    summary="Authoritative Exchange & Banking Holiday Database",
)
def get_holidays(
    year: int = Query(2026, description="Calendar year filter"),
    country: str | None = Query(None, description="Country filter (e.g. India, United States, United Kingdom, Japan)"),
    exchange: str | None = Query(None, description="Exchange filter (e.g. NSE, BSE, MCX, NYSE, LSE, TSE)"),
    category: str | None = Query(None, description="Holiday category: EXCHANGE_HOLIDAY, BANKING_HOLIDAY, COMMODITY_HOLIDAY, SPECIAL_SESSION"),
):
    """
    Returns structured market holidays, explicitly distinguishing exchange trading holidays,
    banking closures (RBI / NI Act), commodity session adjustments, and special sessions.
    """
    return market_calendar_engine.get_holidays(
        year=year,
        country=country,
        exchange=exchange,
        category=category,
    )


# ─────────────────────────────────────────────────────────────────────────────
# 3. Catalyst & Corporate Events Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@calendar_router.get(
    "/calendar/events",
    response_model=list[EconomicCorporateEventRecord],
    summary="Economic Indicators & Corporate Events Calendar",
)
def get_calendar_events(
    event_type: str | None = Query(None, description="Filter: CENTRAL_BANK, INFLATION, GDP, EARNINGS, CORPORATE_ACTION"),
    country: str | None = Query(None, description="Country filter (e.g. India, United States, Eurozone)"),
    importance: str | None = Query(None, description="Importance filter: HIGH, MEDIUM, LOW"),
    symbol: str | None = Query(None, description="Ticker symbol filter (e.g. NSE:RELIANCE, NSE:TCS)"),
    limit: int = Query(50, ge=1, le=100),
):
    """Returns economic indicator releases, central bank decisions, and corporate earnings announcements."""
    return market_calendar_engine.get_catalyst_events(
        event_type=event_type,
        country=country,
        importance=importance,
        symbol=symbol,
        limit=limit,
    )


@calendar_router.get(
    "/calendar/upcoming",
    response_model=list[EconomicCorporateEventRecord],
    summary="Next Upcoming Catalysts Timeline",
)
def get_upcoming_catalysts(
    limit: int = Query(10, ge=1, le=25),
):
    """Returns chronologically ordered upcoming macroeconomic events and earnings releases."""
    return market_calendar_engine.get_upcoming_catalysts(limit=limit)


# ─────────────────────────────────────────────────────────────────────────────
# 4. Calendar User Preferences Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@calendar_router.get(
    "/calendar/preferences",
    response_model=CalendarUserPreferences,
    summary="Get User Calendar Preferences",
)
def get_calendar_preferences(
    user_id: str = Query("default_user", description="Authenticated user ID"),
):
    """Retrieves configured followed markets, event categories, and alert thresholds."""
    return market_calendar_engine.get_user_preferences(user_id=user_id)


@calendar_router.put(
    "/calendar/preferences",
    response_model=CalendarUserPreferences,
    summary="Update User Calendar Preferences",
)
def update_calendar_preferences(
    preferences: CalendarUserPreferences,
):
    """Persists customized followed markets and notification options."""
    return market_calendar_engine.save_user_preferences(preferences)
