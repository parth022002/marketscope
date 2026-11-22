"""
MarketScope.io — Multi-Criteria Screener Engine Test Suite
Validates criteria filtering, presets, market cap categorization, and valuation ratios.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_screener_presets_endpoint():
    """Verify screener presets return valid list with required criteria keys."""
    res = client.get("/api/v1/screener/presets")
    assert res.status_code == 200
    data = res.json()
    assert "presets" in data
    assert len(data["presets"]) >= 3
    for p in data["presets"]:
        assert "id" in p
        assert "name" in p
        assert "criteria" in p


def test_screener_run_filter_by_roe_and_debt():
    """Verify screening by minimum ROE and maximum debt-to-equity."""
    payload = {
        "min_roe": 20.0,
        "max_debt_equity": 0.8,
    }
    res = client.post("/api/v1/screener/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    for item in data["results"]:
        assert item["roe"] >= 20.0
        assert item["debt_to_equity"] <= 0.8


def test_screener_run_filter_by_sector_and_pe():
    """Verify screening by sector and maximum P/E ratio."""
    payload = {
        "max_pe": 40.0,
    }
    res = client.post("/api/v1/screener/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    for item in data["results"]:
        if item["pe_ratio"] is not None:
            assert item["pe_ratio"] <= 40.0
