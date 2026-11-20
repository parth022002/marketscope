import uuid
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

TEST_WS_ID = "11111111-1111-1111-1111-111111111111"


def test_data_freshness_endpoint():
    """
    MOD-15: Tests the Data Quality & Freshness Engine for live staleness scores
    and provider entitlement disclosures.
    """
    response = client.get("/api/v1/instruments/AAPL/freshness")
    assert response.status_code == 200
    data = response.json()
    assert data["symbol"] == "AAPL"
    assert data["exchange"] in ["NASDAQ", "GLOBAL"]
    assert data["quote_freshness"] in ["REAL_TIME", "DELAYED_15M"]
    assert data["staleness_score"] >= 0.8
    assert "REAL_TIME_MARKET_QUOTES" in data["entitlements"]
    assert "DPDP_DATA_PORTABILITY" in data["entitlements"]


def test_data_freshness_indian_equity():
    """
    MOD-15: Tests freshness for Indian equities (NSE/BSE).
    """
    response = client.get("/api/v1/instruments/RELIANCE/freshness")
    assert response.status_code == 200
    data = response.json()
    assert data["symbol"] == "RELIANCE"
    assert data["currency"] == "INR"
    assert "AUDITED" in data["filings_freshness"]


def test_dpdp_user_data_export():
    """
    MOD-19: Tests statutory DPDP Act 2023 / GDPR data export portability.
    """
    response = client.post("/api/v1/compliance/dpdp/export", json={"workspace_id": TEST_WS_ID})
    assert response.status_code == 200
    payload = response.json()
    assert payload["workspace_id"] == TEST_WS_ID
    assert "notes_count" in payload
    assert "snapshots_count" in payload
    assert "watchlists_count" in payload
    assert payload["data"]["compliance_standard"] == "India DPDP Act 2023 / GDPR Article 20"


def test_dpdp_purge_phrase_mismatch():
    """
    MOD-19: Tests that cascade deletion is blocked if the safety confirmation phrase is invalid.
    """
    response = client.post(
        "/api/v1/compliance/dpdp/purge",
        json={"workspace_id": TEST_WS_ID, "confirmation_phrase": "WRONG_PHRASE"},
    )
    assert response.status_code == 400
    assert "Confirmation phrase mismatch" in response.json()["detail"]


def test_dpdp_purge_cascade_success():
    """
    MOD-19: Tests successful irreversible cascade deletion under DPDP Right to Erasure.
    """
    # Create a dummy note first
    create_resp = client.post(
        f"/api/v1/workspaces/{TEST_WS_ID}/notes",
        json={"instrument_id": "in-nse-reliance", "title": "Temporary Note to Purge", "thesis": "Testing erasure."},
    )
    assert create_resp.status_code in [200, 201]

    # Execute purge
    purge_resp = client.post(
        "/api/v1/compliance/dpdp/purge",
        json={"workspace_id": TEST_WS_ID, "confirmation_phrase": "PURGE_ALL_DATA"},
    )
    assert purge_resp.status_code == 200
    purge_data = purge_resp.json()
    assert purge_data["status"] == "PURGED"
    assert purge_data["workspace_id"] == TEST_WS_ID
    assert "records_deleted" in purge_data
