from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_search_returns_live_or_indexed_instrument():
    response = client.get("/api/v1/instruments/search", params={"q": "TCS"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["count"] >= 1
    assert payload["items"][0]["symbol"] == "TCS"
    assert payload["items"][0]["data_status"] in ["LIVE_MARKET", "SYNTHETIC_DEMO"]


def test_dossier_contains_research_disclaimer():
    response = client.get("/api/v1/instruments/in-nse-tcs/dossier")
    assert response.status_code == 200
    payload = response.json()
    assert "MarketScope.io is strictly a research and decision-support workspace" in payload["disclaimer"]


def test_unknown_instrument_returns_404():
    response = client.get("/api/v1/instruments/does-not-exist-xyz-9999/dossier")
    assert response.status_code == 404
