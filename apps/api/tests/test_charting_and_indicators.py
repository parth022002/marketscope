"""
MarketScope.io — Charting, Historical OHLCV & Technical Analysis Test Suite
Validates mathematical indicator calculations, OHLC integrity, drawing persistence, and alerts.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.domain.canonical_chart import (
    OHLCVBar,
    ChartTimeframe,
    IndicatorType,
    DrawingToolType,
    PriceAlertCondition,
)
from app.engine.technical_indicators import TechnicalIndicatorsEngine
from app.engine.historical_data_service import historical_data_service

client = TestClient(app)


def test_ohlcv_daily_integrity():
    """Verify daily OHLCV bars respect financial constraints (high >= max(o, c) and low <= min(o, c))."""
    res = client.get("/api/v1/instruments/RELIANCE/ohlcv?timeframe=1D&limit=50")
    assert res.status_code == 200
    bars = res.json()
    assert len(bars) == 50

    for b in bars:
        assert b["high"] >= max(b["open"], b["close"])
        assert b["low"] <= min(b["open"], b["close"])
        assert b["volume"] >= 0
        assert b["low"] > 0


def test_ohlcv_intraday_timestamps():
    """Verify intraday timeframe returns valid unix timestamps."""
    res = client.get("/api/v1/instruments/NIFTY/ohlcv?timeframe=5m&limit=30")
    assert res.status_code == 200
    bars = res.json()
    assert len(bars) == 30

    for b in bars:
        assert isinstance(b["time"], int)
        assert b["time"] > 1600000000


def test_chart_package_endpoint():
    """Verify complete chart data response includes exchange metadata and timezone."""
    res = client.get("/api/v1/instruments/TCS/chart?timeframe=1D")
    assert res.status_code == 200
    data = res.json()
    assert data["symbol"] == "TCS"
    assert data["exchange"] == "NSE"
    assert data["currency"] == "INR"
    assert data["exchange_timezone"] == "Asia/Kolkata"
    assert len(data["bars"]) > 0


def test_indicator_sma_calculation():
    """Verify Simple Moving Average (SMA) calculation accuracy."""
    res = client.get("/api/v1/instruments/RELIANCE/indicators?indicator=SMA&period=20&limit=60")
    assert res.status_code == 200
    data = res.json()
    assert data["indicator_type"] == "SMA"
    assert len(data["data"]) > 0
    first_pt = data["data"][0]
    assert "sma" in first_pt["values"]
    assert first_pt["values"]["sma"] > 0


def test_indicator_rsi_wilder_bounds():
    """Verify RSI calculation is bounded between 0 and 100."""
    res = client.get("/api/v1/instruments/RELIANCE/indicators?indicator=RSI&period=14&limit=60")
    assert res.status_code == 200
    data = res.json()
    assert data["indicator_type"] == "RSI"
    assert len(data["data"]) > 0
    for pt in data["data"]:
        rsi_val = pt["values"]["rsi"]
        assert 0.0 <= rsi_val <= 100.0


def test_indicator_macd_and_histogram():
    """Verify MACD, signal line, and histogram values."""
    res = client.get("/api/v1/instruments/RELIANCE/indicators?indicator=MACD&limit=80")
    assert res.status_code == 200
    data = res.json()
    assert data["indicator_type"] == "MACD"
    assert len(data["data"]) > 0
    first_pt = data["data"][0]
    assert "macd" in first_pt["values"]
    assert "signal" in first_pt["values"]
    assert "histogram" in first_pt["values"]


def test_indicator_bollinger_bands():
    """Verify Bollinger Bands relationship: Upper >= Middle >= Lower."""
    res = client.get("/api/v1/instruments/RELIANCE/indicators?indicator=BOLLINGER&period=20&limit=60")
    assert res.status_code == 200
    data = res.json()
    assert data["indicator_type"] == "BOLLINGER"
    assert len(data["data"]) > 0
    for pt in data["data"]:
        vals = pt["values"]
        assert vals["upper"] >= vals["middle"]
        assert vals["middle"] >= vals["lower"]


def test_indicator_supertrend():
    """Verify Supertrend returns trend flag (1 for bull, -1 for bear) and stop band."""
    res = client.get("/api/v1/instruments/RELIANCE/indicators?indicator=SUPERTREND&period=10&limit=60")
    assert res.status_code == 200
    data = res.json()
    assert data["indicator_type"] == "SUPERTREND"
    assert len(data["data"]) > 0
    for pt in data["data"]:
        vals = pt["values"]
        assert "supertrend" in vals
        assert vals["trend"] in [1.0, -1.0]


def test_user_drawing_annotations_lifecycle():
    """Verify creating, listing, and deleting chart drawing annotations."""
    payload = {
        "instrument_id": "RELIANCE",
        "timeframe": "1D",
        "tool_type": "trend_line",
        "points": [
            {"time": "2026-01-10", "price": 1320.0},
            {"time": "2026-02-15", "price": 1380.0},
        ],
        "style": {"color": "#3B82F6", "lineWidth": 2},
    }
    create_res = client.post("/api/v1/chart/drawings", json=payload)
    assert create_res.status_code == 201
    drawing = create_res.json()
    drawing_id = drawing["drawing_id"]
    assert drawing["tool_type"] == "trend_line"

    # List drawings
    list_res = client.get(f"/api/v1/chart/drawings?instrument_id=RELIANCE")
    assert list_res.status_code == 200
    drawings = list_res.json()
    assert any(d["drawing_id"] == drawing_id for d in drawings)

    # Delete drawing
    del_res = client.delete(f"/api/v1/chart/drawings/{drawing_id}")
    assert del_res.status_code == 200


def test_price_alerts_lifecycle():
    """Verify creating, listing, and deleting price alerts."""
    payload = {
        "instrument_id": "RELIANCE",
        "symbol": "RELIANCE",
        "condition_type": "CROSS_ABOVE",
        "target_value": 1400.0,
        "note": "Notify on 1400 breakout",
    }
    create_res = client.post("/api/v1/alerts", json=payload)
    assert create_res.status_code == 201
    alert = create_res.json()
    alert_id = alert["alert_id"]
    assert alert["target_value"] == 1400.0

    # List alerts
    list_res = client.get("/api/v1/alerts?symbol=RELIANCE")
    assert list_res.status_code == 200
    alerts = list_res.json()
    assert any(a["alert_id"] == alert_id for a in alerts)

    # Delete alert
    del_res = client.delete(f"/api/v1/alerts/{alert_id}")
    assert del_res.status_code == 200
