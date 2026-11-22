"""
MarketScope.io — Automated Test Suite for Global Market Calendar & Market Status Intelligence
Validates exchange session calculation, IANA timezone handling, holiday segregation
(trading vs settlement vs banking vs commodity), special sessions (Muhurat trading),
and API endpoints.
"""

import pytest
from datetime import datetime, timezone, time
from fastapi.testclient import TestClient

from app.main import app
from app.domain.canonical_calendar import MarketStatus, HolidayCategory
from app.engine.market_calendar import (
    market_calendar_engine,
    CANONICAL_HOLIDAYS,
    CANONICAL_CATALYST_EVENTS,
    EXCHANGE_CONFIGS,
)

client = TestClient(app)


def test_market_calendar_engine_nse_regular_open():
    """Verify NSE evaluates to OPEN on a Wednesday at 11:30 IST."""
    # 2026-04-15 06:00 UTC = 11:30 IST (Wed)
    dt = datetime(2026, 4, 15, 6, 0, tzinfo=timezone.utc)
    session = market_calendar_engine.get_market_session("NSE", now_utc=dt)
    assert session.status == MarketStatus.OPEN
    assert session.is_regular_trading is True
    assert session.effective_data_status == "LIVE"
    assert session.exchange == "NSE"


def test_market_calendar_engine_nse_pre_market():
    """Verify NSE evaluates to PRE_MARKET at 09:05 IST."""
    # 2026-04-15 03:35 UTC = 09:05 IST
    dt = datetime(2026, 4, 15, 3, 35, tzinfo=timezone.utc)
    session = market_calendar_engine.get_market_session("NSE", now_utc=dt)
    assert session.status == MarketStatus.PRE_MARKET
    assert session.is_regular_trading is False


def test_market_calendar_engine_tse_lunch_break():
    """Verify Tokyo Stock Exchange evaluates to BREAK during lunch (11:30–12:30 JST)."""
    # 2026-04-15 03:00 UTC = 12:00 JST (Wed)
    dt = datetime(2026, 4, 15, 3, 0, tzinfo=timezone.utc)
    session = market_calendar_engine.get_market_session("TSE", now_utc=dt)
    assert session.status == MarketStatus.BREAK
    assert session.is_regular_trading is False


def test_market_calendar_engine_exchange_vs_banking_holiday():
    """Verify April 1 Annual Bank Closing: NSE is OPEN for trading, banking settlement CLOSED."""
    apr1_dt = datetime(2026, 4, 1, 6, 0, tzinfo=timezone.utc) # 11:30 IST
    nse_session = market_calendar_engine.get_market_session("NSE", now_utc=apr1_dt)
    # Stock exchanges remain open on April 1
    assert nse_session.status == MarketStatus.OPEN

    # Find the April 1 record in holiday registry
    apr1_rec = next(h for h in CANONICAL_HOLIDAYS if h.holiday_date == "2026-04-01")
    assert apr1_rec.category == HolidayCategory.BANKING_HOLIDAY
    assert apr1_rec.trading_status == "OPEN"
    assert apr1_rec.settlement_status == "CLOSED"


def test_market_calendar_engine_special_session_muhurat():
    """Verify Diwali Muhurat Trading on Nov 8, 2026 is recognized as SPECIAL_SESSION."""
    # 2026-11-08 13:00 UTC = 18:30 IST (during 18:15–19:15 special session)
    muhurat_dt = datetime(2026, 11, 8, 13, 0, tzinfo=timezone.utc)
    session = market_calendar_engine.get_market_session("NSE", now_utc=muhurat_dt)
    assert session.status == MarketStatus.SPECIAL_SESSION
    assert session.special_session_today is True


def test_api_calendar_markets_status():
    """Verify GET /api/v1/calendar/markets/status returns comprehensive summary."""
    res = client.get("/api/v1/calendar/markets/status")
    assert res.status_code == 200
    data = res.json()
    assert "markets" in data
    assert len(data["markets"]) >= 8
    exchanges = [m["market_id"] for m in data["markets"]]
    assert "NSE" in exchanges
    assert "NYSE" in exchanges
    assert "LSE" in exchanges
    assert "TSE" in exchanges


def test_api_calendar_holidays():
    """Verify GET /api/v1/calendar/holidays returns verified holiday items."""
    res = client.get("/api/v1/calendar/holidays?year=2026&country=India")
    assert res.status_code == 200
    holidays = res.json()
    assert len(holidays) >= 10
    names = [h["event_name"] for h in holidays]
    assert "Republic Day" in names
    assert "Good Friday" in names


def test_api_calendar_events():
    """Verify GET /api/v1/calendar/events returns economic and corporate catalysts."""
    res = client.get("/api/v1/calendar/events?country=India")
    assert res.status_code == 200
    events = res.json()
    assert len(events) >= 3
    titles = [e["title"] for e in events]
    assert any("RBI" in t for t in titles)


def test_api_calendar_market_hours():
    """Verify GET /api/v1/calendar/market-hours returns directory."""
    res = client.get("/api/v1/calendar/market-hours")
    assert res.status_code == 200
    directory = res.json()
    assert len(directory) >= 8
