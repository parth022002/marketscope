import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.engine.exchange_registry import exchange_registry, GLOBAL_EXCHANGE_REGISTRY
from app.engine.investment_access_engine import investment_access_engine, InvestmentAccessStatus
from app.engine.instrument_master import universal_instrument_master

client = TestClient(app)


def test_exchange_registry_coverage():
    """Verify registry contains 30+ domestic and international exchanges across key regions."""
    assert len(GLOBAL_EXCHANGE_REGISTRY) >= 30
    
    # Check domestic Indian exchanges & authorities
    assert "NSE" in GLOBAL_EXCHANGE_REGISTRY
    assert "BSE" in GLOBAL_EXCHANGE_REGISTRY
    assert "MCX" in GLOBAL_EXCHANGE_REGISTRY
    assert "RBI" in GLOBAL_EXCHANGE_REGISTRY
    assert "INX" in GLOBAL_EXCHANGE_REGISTRY
    
    # Check US & Americas
    assert "NYSE" in GLOBAL_EXCHANGE_REGISTRY
    assert "NASDAQ" in GLOBAL_EXCHANGE_REGISTRY
    assert "CBOE" in GLOBAL_EXCHANGE_REGISTRY
    assert "COMEX" in GLOBAL_EXCHANGE_REGISTRY
    assert "NYMEX" in GLOBAL_EXCHANGE_REGISTRY
    
    # Check Europe & Asia
    assert "LSE" in GLOBAL_EXCHANGE_REGISTRY
    assert "XETRA" in GLOBAL_EXCHANGE_REGISTRY
    assert "TSE" in GLOBAL_EXCHANGE_REGISTRY
    assert "HKEX" in GLOBAL_EXCHANGE_REGISTRY
    assert "SGX" in GLOBAL_EXCHANGE_REGISTRY
    
    # Check MIC code integrity
    assert GLOBAL_EXCHANGE_REGISTRY["NSE"].mic == "XNSE"
    assert GLOBAL_EXCHANGE_REGISTRY["NYSE"].mic == "XNYS"
    assert GLOBAL_EXCHANGE_REGISTRY["NASDAQ"].mic == "XNAS"


def test_investment_access_engine_rules():
    """Verify resident Indian regulatory classification conforms to SEBI, RBI LRS, and FEMA."""
    # 1. Domestic Indian Equities -> DOMESTIC_ACCESS
    res_nse = investment_access_engine.classify("EQUITY", "NSE", "IN")
    assert res_nse.status == InvestmentAccessStatus.DOMESTIC_ACCESS

    # 2. US Equities -> INTERNATIONAL_ACCESS_SUBJECT_TO_LRS ($250,000/FY)
    res_us = investment_access_engine.classify("EQUITY", "NASDAQ", "US")
    assert res_us.status == InvestmentAccessStatus.INTERNATIONAL_ACCESS_SUBJECT_TO_LRS
    assert any("250,000" in cond for cond in res_us.key_conditions)

    # 3. GIFT City IFSC -> ACCESS_VIA_IFSC_ROUTE
    res_ifsc = investment_access_engine.classify("EQUITY", "INX", "IN")
    assert res_ifsc.status == InvestmentAccessStatus.ACCESS_VIA_IFSC_ROUTE

    # 4. Feeder Funds -> ACCESS_VIA_DOMESTIC_FUND
    res_feeder = investment_access_engine.classify("MUTUAL_FUND", "AMFI", "IN", is_feeder_fund=True)
    assert res_feeder.status == InvestmentAccessStatus.ACCESS_VIA_DOMESTIC_FUND

    # 5. Offshore Derivatives / FX Margin -> RESEARCH_ONLY (FEMA prohibited for remittances)
    res_deriv = investment_access_engine.classify("FUTURE", "CME", "US")
    assert res_deriv.status == InvestmentAccessStatus.RESEARCH_ONLY


def test_universal_instrument_master_catalog():
    """Verify 120+ curated multi-asset instruments across 20 asset classes."""
    total_count = universal_instrument_master.get_canonical_count()
    assert total_count >= 120

    # Test symbol lookups
    nifty = universal_instrument_master.get_by_symbol("NIFTY 50")
    assert nifty is not None
    assert nifty.exchange == "NSE"
    assert nifty.asset_class == "INDEX"

    apple = universal_instrument_master.get_by_symbol("AAPL")
    assert apple is not None
    assert apple.exchange == "NASDAQ"
    assert apple.trading_currency == "USD"

    gold = universal_instrument_master.get_by_symbol("GOLD-MCX")
    assert gold is not None
    assert gold.exchange == "MCX"
    assert gold.asset_class == "COMMODITY"


def test_api_get_exchanges():
    """Verify GET /api/v1/market/exchanges endpoint."""
    response = client.get("/api/v1/market/exchanges")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 30
    assert any(e["exchange_id"] == "NSE" for e in data)
    assert any(e["exchange_id"] == "NASDAQ" for e in data)


def test_api_get_universal_instruments():
    """Verify GET /api/v1/market/instruments/universal endpoint."""
    response = client.get("/api/v1/market/instruments/universal?limit=25")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 25
    first = data[0]
    assert "symbol" in first
    assert "regulatory_details" in first
    assert "investment_access_status" in first


def test_api_universal_search():
    """Verify GET /api/v1/market/universal-search endpoint."""
    response = client.get("/api/v1/market/universal-search?q=Reliance")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 1
    assert any("RELIANCE" in item["symbol"] for item in data["results"])


def test_api_derivatives_pulse():
    """Verify GET /api/v1/market/derivatives endpoint."""
    response = client.get("/api/v1/market/derivatives")
    assert response.status_code == 200
    data = response.json()
    assert "india_vix" in data
    assert "cboe_vix" in data
    assert len(data["items"]) >= 4
    assert any(item["symbol"] == "NIFTY-FUT" for item in data["items"])


def test_api_fixed_income():
    """Verify GET /api/v1/market/fixed-income endpoint."""
    response = client.get("/api/v1/market/fixed-income")
    assert response.status_code == 200
    data = response.json()
    assert "india_benchmark_10y" in data
    assert "us_benchmark_10y" in data
    assert len(data["india_yield_curve"]) >= 5
    assert len(data["policy_rates"]) >= 4
    assert len(data["sovereign_gold_bonds"]) >= 2


def test_api_funds_overview():
    """Verify GET /api/v1/market/funds endpoint."""
    response = client.get("/api/v1/market/funds")
    assert response.status_code == 200
    data = response.json()
    assert data["total_schemes"] >= 5
    assert len(data["funds"]) >= 5


def test_api_commodities_overview():
    """Verify GET /api/v1/market/commodities endpoint."""
    response = client.get("/api/v1/market/commodities")
    assert response.status_code == 200
    data = response.json()
    assert len(data["commodities"]) >= 6
    assert any(c["symbol"] == "GOLD-MCX" for c in data["commodities"])


def test_api_currencies_overview():
    """Verify GET /api/v1/market/currencies endpoint."""
    response = client.get("/api/v1/market/currencies")
    assert response.status_code == 200
    data = response.json()
    assert "usd_inr" in data
    assert len(data["pairs"]) >= 5
    assert any(p["pair"] == "USD/INR" for p in data["pairs"])


def test_api_admin_providers():
    """Verify GET /api/v1/market/admin/providers endpoint."""
    response = client.get("/api/v1/market/admin/providers")
    assert response.status_code == 200
    data = response.json()
    assert data["active_providers"] >= 5
    assert len(data["providers"]) >= 5
