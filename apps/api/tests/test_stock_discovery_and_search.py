import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.engine.exchange_registry import exchange_registry
from app.engine.global_instrument_master import global_instrument_master
from app.engine.stock_universe_ingestion import stock_universe_ingestion


@pytest.fixture(scope="module")
def client():
    return TestClient(app)


# ─── 1. Exchange Registry Tests ──────────────────────────────────────────────

def test_exchange_registry_coverage():
    """Verify registry covers 30+ exchanges across India, US, UK, Europe, and Asia."""
    exchanges = exchange_registry.list_all()
    assert len(exchanges) >= 30

    mic_codes = [e.mic for e in exchanges]
    assert "XNSE" in mic_codes
    assert "XBOM" in mic_codes
    assert "XNAS" in mic_codes
    assert "XNYS" in mic_codes
    assert "XLON" in mic_codes
    assert "XETR" in mic_codes
    assert "XTKS" in mic_codes
    assert "XHKG" in mic_codes

    # Verify coverage summary
    summary = exchange_registry.get_coverage_summary()
    assert summary["total_exchanges"] >= 30
    assert "India" in summary["by_country"]
    assert "United States" in summary["by_country"]


def test_exchange_api_endpoints(client):
    """Test /api/v1/exchanges endpoints."""
    res = client.get("/api/v1/exchanges")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 30
    assert len(data["exchanges"]) >= 30

    # Filter by region
    res_asia = client.get("/api/v1/exchanges?region=Asia-Pacific")
    assert res_asia.status_code == 200
    asia_exchanges = res_asia.json()
    assert asia_exchanges["count"] >= 5


# ─── 2. Global Instrument Master & Search Tests ──────────────────────────────

def test_exact_symbol_search():
    """Exact ticker symbol searches must achieve top tier-1 relevance score."""
    results = global_instrument_master.search("RELIANCE")
    assert len(results) >= 1
    top = results[0]
    assert top["symbol"] == "RELIANCE"
    assert top["score"] >= 100
    assert top["match_reason"] == "EXACT_SYMBOL"


def test_company_name_search():
    """Company name query must match canonical issuer."""
    results = global_instrument_master.search("Tata Motors")
    assert len(results) >= 2
    symbols = [r["symbol"] for r in results]
    assert "TATAMOTORS" in symbols
    assert "TATAMTRDVR" in symbols


def test_isin_search():
    """Authoritative ISIN search should return precise instrument."""
    results = global_instrument_master.search("INE002A01018")
    assert len(results) >= 1
    assert results[0]["symbol"] == "RELIANCE"
    assert results[0]["isin"] == "INE002A01018"


def test_cross_listing_and_share_classes():
    """Ordinary shares and DVR / Class A vs Class C must remain distinct instruments."""
    tata_ord = global_instrument_master.get_instrument_by_symbol("TATAMOTORS", "NSE")
    tata_dvr = global_instrument_master.get_instrument_by_symbol("TATAMTRDVR", "NSE")
    assert tata_ord is not None
    assert tata_dvr is not None
    assert tata_ord.instrument_id != tata_dvr.instrument_id
    assert tata_ord.share_class == "Ordinary Shares"
    assert tata_dvr.share_class == "DVR (Differential Voting Rights)"
    assert tata_ord.voting_rights == 1.0
    assert tata_dvr.voting_rights == 0.1

    # Verify Alphabet Class A vs C
    googl = global_instrument_master.get_instrument_by_symbol("GOOGL", "NASDAQ")
    goog = global_instrument_master.get_instrument_by_symbol("GOOG", "NASDAQ")
    assert googl is not None
    assert goog is not None
    assert googl.share_class == "Class A Voting"
    assert goog.share_class == "Class C Non-Voting"


def test_instrument_resolve_disambiguation(client):
    """Multiple matching instruments must trigger requires_disambiguation=True."""
    res = client.get("/api/v1/instruments/resolve?q=TATA")
    assert res.status_code == 200
    data = res.json()
    assert data["requires_disambiguation"] is True
    assert len(data["candidates"]) >= 2


# ─── 3. Stock Discovery Engine Tests ─────────────────────────────────────────

def test_stock_discovery_filters_and_pagination(client):
    """Test server-side discovery with pagination, sorting, and exchange filtering."""
    # Test all stocks
    res = client.get("/api/v1/market/stock-discovery?page=1&page_size=10&sort_by=market_cap&sort_dir=desc")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] > 30
    assert len(data["results"]) == 10
    assert data["page"] == 1
    assert data["total_pages"] >= 3

    # Results should be sorted by market cap descending
    caps = [r["market_cap"] for r in data["results"]]
    assert caps == sorted(caps, reverse=True)

    # Test filtering by exchange
    res_nse = client.get("/api/v1/market/stock-discovery?exchange=NSE&page_size=50")
    assert res_nse.status_code == 200
    nse_data = res_nse.json()
    for item in nse_data["results"]:
        assert item["exchange"] == "NSE"

    # Test filtering by country
    res_us = client.get("/api/v1/market/stock-discovery?country=United+States&page_size=50")
    assert res_us.status_code == 200
    us_data = res_us.json()
    for item in us_data["results"]:
        assert item["country"] == "United States"


def test_company_listings_endpoint(client):
    """Test /api/v1/companies/{company_id}/listings endpoint."""
    res = client.get("/api/v1/companies/comp-tatamotors/listings")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 2
    symbols = [l["symbol"] for l in data["listings"]]
    assert "TATAMOTORS" in symbols
    assert "TATAMTRDVR" in symbols


# ─── 4. Dynamic Dossier & Research Calibration Tests ─────────────────────────

def test_dynamic_dossier_arbitrary_stock(client):
    """Any registered stock must have a valid calibrated dossier without 404."""
    # Test US tech stock
    res_aapl = client.get("/api/v1/instruments/aapl/dossier")
    assert res_aapl.status_code == 200
    dossier = res_aapl.json()
    assert dossier["instrument"]["symbol"] == "AAPL"
    assert dossier["instrument"]["exchange"] == "NASDAQ"
    assert len(dossier["metrics"]) > 0

    # Test UK stock
    res_shel = client.get("/api/v1/instruments/shel/dossier")
    assert res_shel.status_code == 200
    dossier_shel = res_shel.json()
    assert dossier_shel["instrument"]["symbol"] == "SHEL"
    assert dossier_shel["instrument"]["exchange"] == "LSE"


def test_dynamic_financial_statements_arbitrary_stock(client):
    """Any registered stock must have calibrated financial statements."""
    res = client.get("/api/v1/instruments/NVDA/financials?statement_type=income_statement&period_type=annual")
    assert res.status_code == 200
    stmts = res.json()
    assert stmts["symbol"] == "NVDA"
    assert len(stmts["items"]) > 0
    assert any("24" in p for p in stmts["periods"]) or "FY24" in stmts["periods"] or "FY 2024" in stmts["periods"]


# ─── 5. Universe Ingestion & Audit Metrics Tests ──────────────────────────────

def test_universe_ingestion_and_metrics(client):
    """Test universe coverage metrics and provider capability register."""
    res = client.get("/api/v1/market/coverage")
    assert res.status_code == 200
    cov = res.json()
    assert cov["total_instruments"] >= 30
    assert cov["total_companies"] >= 25
    assert cov["exchanges_covered"] >= 8
    assert cov["status"] == "OPERATIONAL"

    # Admin endpoints
    res_admin = client.get("/api/v1/admin/universe/stats")
    assert res_admin.status_code == 200
    assert res_admin.json()["total_instruments"] >= 30

    res_batches = client.get("/api/v1/admin/universe/batches")
    assert res_batches.status_code == 200
    assert "batches" in res_batches.json()
