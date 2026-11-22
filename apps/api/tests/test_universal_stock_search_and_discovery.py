"""
MarketScope.io — Universal Stock Search & Discovery Test Suite
Validates multi-strategy search ranking, ISIN resolution, typo tolerance, multi-exchange disambiguation,
and all 15 specialized stock research endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_search_by_ticker_exact():
    """Exact ticker searches must return highest ranked match."""
    res = client.get("/api/v1/instruments/search?q=SBIN")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 1
    top = data["items"][0]
    assert top["symbol"] == "SBIN"
    assert top["exchange"] == "NSE"
    assert top["match_reason"] == "EXACT_SYMBOL"
    assert top["score"] >= 100.0


def test_search_by_company_name():
    """Searching by full or partial company name must resolve correctly."""
    res = client.get("/api/v1/instruments/search?q=State Bank of India")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 1
    top = data["items"][0]
    assert top["symbol"] == "SBIN"
    assert "State Bank" in top["company_name"]


def test_search_by_isin():
    """Searching by 12-character ISIN must resolve to the exact security."""
    # State Bank of India ISIN
    res = client.get("/api/v1/instruments/search?q=INE062A01020")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 1
    top = data["items"][0]
    assert top["symbol"] == "SBIN"
    assert top["isin"] == "INE062A01020"


def test_search_by_bse_scrip_code():
    """Searching by numeric 6-digit BSE scrip code must resolve to the security."""
    # Reliance BSE Scrip Code
    res = client.get("/api/v1/instruments/search?q=500325")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 1
    symbols = [item["symbol"] for item in data["items"]]
    assert "RELIANCE" in symbols


def test_search_typo_fuzzy_matching():
    """Typo in symbol or company name must match with fuzzy similarity."""
    res = client.get("/api/v1/instruments/search?q=Relaince")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 1
    top = data["items"][0]
    assert top["symbol"] == "RELIANCE"


def test_search_global_markets():
    """Validates international exchange leaders (US, UK, Germany, Japan, South Korea)."""
    global_queries = [
        ("AAPL", "Apple Inc.", "NASDAQ"),
        ("NVDA", "NVIDIA Corporation", "NASDAQ"),
        ("NFLX", "Netflix, Inc.", "NASDAQ"),
        ("WMT", "Walmart Inc.", "NYSE"),
        ("005930.KS", "Samsung Electronics", "KRX"),
        ("7203.T", "Toyota Motor", "TSE"),
        ("SAP.DE", "SAP SE", "XETRA"),
        ("SHEL.L", "Shell plc", "LSE"),
    ]
    for q, expected_name, expected_exchange in global_queries:
        res = client.get(f"/api/v1/instruments/search?q={q}")
        assert res.status_code == 200
        data = res.json()
        assert data["count"] >= 1
        top = data["items"][0]
        assert expected_name.lower() in top["company_name"].lower()
        assert top["exchange"] == expected_exchange


def test_search_diagnostics_endpoint():
    """Validates the administrator search diagnostics and coverage breakdown."""
    res = client.get("/api/v1/instruments/admin/diagnostics")
    assert res.status_code == 200
    data = res.json()
    assert data["total_instruments"] >= 100
    assert data["total_companies"] >= 80
    assert "NSE" in data["exchange_breakdown"]
    assert "NASDAQ" in data["exchange_breakdown"]


def test_stock_research_endpoints_for_sbin():
    """Validates all stock research endpoints for State Bank of India."""
    inst_id = "in-nse-sbin"

    # 1. Coverage
    res_cov = client.get(f"/api/v1/instruments/{inst_id}/coverage")
    assert res_cov.status_code == 200
    assert res_cov.json()["data_status"] in ["LIVE_MARKET", "FULL_DATA_AVAILABLE", "PARTIAL_DATA_AVAILABLE"]

    # 2. Quote
    res_quote = client.get(f"/api/v1/instruments/{inst_id}/quote")
    assert res_quote.status_code == 200
    assert res_quote.json()["price"] > 0
    assert res_quote.json()["currency"] == "INR"

    # 3. History
    res_hist = client.get(f"/api/v1/instruments/{inst_id}/history?timeframe=1M")
    assert res_hist.status_code == 200
    assert len(res_hist.json()) >= 14
    assert "close" in res_hist.json()[0]

    # 4. Valuation
    res_val = client.get(f"/api/v1/instruments/{inst_id}/valuation")
    assert res_val.status_code == 200
    assert "dcf_intrinsic_value" in res_val.json()

    # 5. Technical
    res_tech = client.get(f"/api/v1/instruments/{inst_id}/technical")
    assert res_tech.status_code == 200
    assert "rsi_14" in res_tech.json()

    # 6. Risk
    res_risk = client.get(f"/api/v1/instruments/{inst_id}/risk")
    assert res_risk.status_code == 200
    assert "var_95" in res_risk.json()

    # 7. News
    res_news = client.get(f"/api/v1/instruments/{inst_id}/news")
    assert res_news.status_code == 200
    assert len(res_news.json()) >= 1
    assert "headline" in res_news.json()[0]

    # 8. Events
    res_events = client.get(f"/api/v1/instruments/{inst_id}/events")
    assert res_events.status_code == 200
    assert len(res_events.json()) >= 1

    # 9. Intelligence
    res_intel = client.get(f"/api/v1/instruments/{inst_id}/intelligence")
    assert res_intel.status_code == 200
    assert res_intel.json()["q_score"] > 0

    # 10. Master Research Aggregation Bundle
    res_bundle = client.get(f"/api/v1/instruments/{inst_id}/research")
    assert res_bundle.status_code == 200
    bundle = res_bundle.json()
    assert bundle["instrument"]["symbol"] == "SBIN"
    assert "quote" in bundle
    assert "financials" in bundle
    assert "technical" in bundle
    assert "risk" in bundle
    assert "intelligence" in bundle
