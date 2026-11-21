"""
MarketScope.io — Automated Test Suite for Market Data Infrastructure
Tests exchange calendars, mathematical precision, validation rules,
multi-provider fallback, WebSocket streaming gateway, and REST endpoints.
"""

import pytest
from datetime import datetime, timezone, timedelta, date, time
from fastapi.testclient import TestClient
from app.main import app
from app.engine.market_calendar import (
    get_nse_session_state,
    get_us_session_state,
    get_mcx_session_state,
    get_forex_session_state,
    resolve_session_state_for_exchange,
    IST_OFFSET,
    EST_OFFSET,
)
from app.providers.market_data.base import BaseMarketDataProvider
from app.providers.market_data.fallback_provider import FallbackDevProvider
from app.engine.market_data_service import market_data_service

client = TestClient(app)


# ─── 1. Exchange Calendar & Session Tests ─────────────────────────────────────

def test_market_calendar_nse_regular_session():
    """Verify NSE regular session is OPEN on a weekday at 11:00 IST."""
    # A Wednesday at 11:00 IST = 05:30 UTC
    dt = datetime(2026, 4, 15, 5, 30, tzinfo=timezone.utc)
    session = get_nse_session_state(dt)
    assert session.market_status == "OPEN"
    assert session.is_regular_trading is True
    assert session.effective_data_status == "LIVE"


def test_market_calendar_nse_pre_open():
    """Verify NSE pre-open session is PRE_OPEN at 09:05 IST."""
    # A Wednesday at 09:05 IST = 03:35 UTC
    dt = datetime(2026, 4, 15, 3, 35, tzinfo=timezone.utc)
    session = get_nse_session_state(dt)
    assert session.market_status == "PRE_OPEN"
    assert session.is_regular_trading is False
    assert session.effective_data_status == "DELAYED_15M"


def test_market_calendar_nse_weekend_closed():
    """Verify NSE is CLOSED on Saturday and Sunday."""
    # Saturday at 11:00 IST
    saturday_dt = datetime(2026, 4, 18, 5, 30, tzinfo=timezone.utc)
    session = get_nse_session_state(saturday_dt)
    assert session.market_status == "CLOSED"
    assert session.is_regular_trading is False
    assert session.effective_data_status == "EOD"


def test_market_calendar_nse_holiday():
    """Verify NSE is closed on a scheduled public holiday (Republic Day, Jan 26)."""
    holiday_dt = datetime(2026, 1, 26, 5, 30, tzinfo=timezone.utc)
    session = get_nse_session_state(holiday_dt)
    assert session.market_status == "HOLIDAY"
    assert session.is_regular_trading is False


def test_market_calendar_us_regular_session():
    """Verify US session is OPEN at 11:00 EST."""
    # A Wednesday at 11:00 EST = 16:00 UTC
    dt = datetime(2026, 4, 15, 16, 0, tzinfo=timezone.utc)
    session = get_us_session_state(dt)
    assert session.market_status == "OPEN"
    assert session.is_regular_trading is True


def test_market_calendar_forex_weekend():
    """Verify Forex is CLOSED on Saturday."""
    saturday_utc = datetime(2026, 4, 18, 12, 0, tzinfo=timezone.utc)
    session = get_forex_session_state(saturday_utc)
    assert session.market_status == "CLOSED"


# ─── 2. Data Validation & Math Precision Tests ────────────────────────────────

def test_price_change_precision_no_float_drift():
    """Verify price change calculation eliminates floating point drift."""
    price = 24480.20
    prev_close = 24367.80
    change, change_pct = BaseMarketDataProvider.calculate_price_change(price, prev_close)

    # In raw float, 24480.20 - 24367.80 = 112.40000000000327
    assert change == 112.40
    assert change_pct == 0.46


def test_price_jump_anomaly_detection():
    """Verify single-tick price jumps > 30% are flagged as anomalous."""
    # Normal 2% change
    assert BaseMarketDataProvider.is_price_jump_anomalous(102.0, 100.0) is False
    # Flash crash or bad tick: 50% drop
    assert BaseMarketDataProvider.is_price_jump_anomalous(50.0, 100.0) is True
    # Flash jump: 40% jump
    assert BaseMarketDataProvider.is_price_jump_anomalous(140.0, 100.0) is True


# ─── 3. Provider Integrity & Truth In Labeling ────────────────────────────────

@pytest.mark.anyio
async def test_fallback_provider_strictly_flags_synthetic():
    """Verify FallbackDevProvider NEVER claims to be LIVE."""
    provider = FallbackDevProvider()
    quote = await provider.get_quote("NIFTY 50")
    assert quote is not None
    assert quote.data_status == "SYNTHETIC_DEVELOPMENT"
    assert quote.source_provider == "synthetic_dev"
    assert quote.price > 0.0


# ─── 4. REST Endpoints Tests ──────────────────────────────────────────────────

def test_market_ticker_rest_endpoint():
    """Verify GET /api/v1/market/ticker returns normalized items with data freshness."""
    res = client.get("/api/v1/market/ticker")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 15

    symbols = [item["symbol"] for item in data]
    assert "NIFTY 50" in symbols
    assert "RELIANCE" not in symbols  # Equities in top companies, not ticker bar

    first = data[0]
    assert "price" in first
    assert "change" in first
    assert "change_pct" in first
    assert "data_status" in first
    assert "market_status" in first
    assert first["data_status"] in ("LIVE", "DELAYED_15M", "EOD", "CLOSED", "SYNTHETIC_DEVELOPMENT")


def test_market_overview_rest_endpoint():
    """Verify GET /api/v1/market/overview returns complete snapshot."""
    res = client.get("/api/v1/market/overview")
    assert res.status_code == 200
    data = res.json()
    assert "indian_market_status" in data
    assert "global_market_status" in data
    assert "market_breadth" in data
    assert "top_companies" in data
    assert len(data["top_companies"]) >= 8


def test_market_instruments_catalog_endpoint():
    """Verify GET /api/v1/market/instruments returns instrument master registry."""
    res = client.get("/api/v1/market/instruments")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 15
    first = data[0]
    assert "instrument_id" in first
    assert "symbol" in first
    assert "primary_vendor" in first


def test_data_quality_report_endpoint():
    """Verify GET /api/v1/data/quality returns provider health and freshness metrics."""
    res = client.get("/api/v1/data/quality")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "providers" in data
    assert "total_instruments_monitored" in data
    assert len(data["providers"]) >= 2


# ─── 5. WebSocket Streaming Gateway Test ──────────────────────────────────────

def test_websocket_market_data_gateway():
    """Verify WebSocket endpoint /ws/v1/market-data connects, responds to ping and subscribe."""
    with client.websocket_connect("/ws/v1/market-data") as websocket:
        # Initial greeting message
        welcome = websocket.receive_json()
        assert welcome["type"] == "connection_established"

        # Send ping
        websocket.send_json({"action": "ping"})
        
        # Read until pong
        pong = None
        for _ in range(5):
            msg = websocket.receive_json()
            if msg.get("type") == "pong":
                pong = msg
                break
        assert pong is not None
        assert pong["type"] == "pong"

        # Send subscription
        websocket.send_json({"action": "subscribe", "symbols": ["NIFTY 50", "AAPL"]})
        sub_ack = None
        for _ in range(5):
            msg = websocket.receive_json()
            if msg.get("type") == "subscribed":
                sub_ack = msg
                break
        assert sub_ack is not None
        assert "NIFTY 50" in sub_ack["symbols"]

        # Request instant snapshot
        websocket.send_json({"action": "snapshot"})
        snapshot = None
        for _ in range(5):
            msg = websocket.receive_json()
            if msg.get("type") == "snapshot":
                snapshot = msg
                break
        assert snapshot is not None
        assert len(snapshot["items"]) >= 15
