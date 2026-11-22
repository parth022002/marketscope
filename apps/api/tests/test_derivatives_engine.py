"""
MarketScope.io — Derivatives & Options Analytics Test Suite
Validates Black-Scholes Greeks, Put-Call Ratio (PCR), Max Pain strikes, and Futures Build-Up.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.engine.derivatives_engine import calculate_black_scholes_greeks

client = TestClient(app)


def test_black_scholes_greeks_bounds():
    """Verify European Call Delta in [0, 1] and Put Delta in [-1, 0]."""
    greeks = calculate_black_scholes_greeks(
        spot=25800.0, strike=25800.0, time_to_expiry_years=7.0 / 365.0, risk_free_rate=0.065, iv=0.14
    )
    assert 0.0 <= greeks["call_delta"] <= 1.0
    assert -1.0 <= greeks["put_delta"] <= 0.0
    assert greeks["gamma"] > 0.0
    assert greeks["vega"] > 0.0
    assert greeks["call_theta"] < 0.0  # Time decay is negative


def test_option_chain_endpoint():
    """Verify Option Chain payload for NIFTY includes strikes, PCR, Max Pain, and ATM strike."""
    res = client.get("/api/v1/derivatives/option-chain?symbol=NIFTY")
    assert res.status_code == 200
    data = res.json()
    assert data["underlying"] == "NIFTY"
    assert data["spot_price"] > 20000
    assert data["pcr"] > 0.0
    assert data["max_pain"] > 0.0
    assert data["atm_strike"] > 0.0
    assert len(data["strikes"]) >= 20

    first_strike = data["strikes"][0]
    assert "call_oi" in first_strike
    assert "put_oi" in first_strike
    assert "call_ltp" in first_strike
    assert "put_ltp" in first_strike
    assert "call_delta" in first_strike


def test_futures_buildup_endpoint():
    """Verify futures build-up classifications fall into valid 4-quadrant categories."""
    res = client.get("/api/v1/derivatives/futures-buildup")
    assert res.status_code == 200
    contracts = res.json()
    assert len(contracts) > 0
    valid_classes = {"LONG_BUILDUP", "SHORT_BUILDUP", "SHORT_COVERING", "LONG_UNWINDING"}
    for c in contracts:
        assert c["classification"] in valid_classes
        assert c["open_interest"] > 0
        assert c["last_price"] > 0


def test_market_flow_intelligence_endpoint():
    """Verify advance/decline breadth and sector relative strength."""
    res = client.get("/api/v1/market/flow-intelligence")
    assert res.status_code == 200
    data = res.json()
    assert data["advances"] > 0
    assert data["ad_ratio"] > 0
    assert len(data["sector_leadership"]) > 0
    assert len(data["setup_radar"]) > 0
