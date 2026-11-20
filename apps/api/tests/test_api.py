from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_search_returns_demo_instrument():
    response = client.get("/api/v1/instruments/search", params={"q": "TCS"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["count"] >= 1
    assert payload["items"][0]["symbol"] == "TCS"
    assert payload["items"][0]["data_status"] == "SYNTHETIC_DEMO"


def test_dossier_contains_synthetic_disclaimer():
    response = client.get("/api/v1/instruments/in-nse-tcs/dossier")
    assert response.status_code == 200
    payload = response.json()
    assert "Synthetic demo data only" in payload["disclaimer"]


def test_unknown_instrument_returns_404():
    response = client.get("/api/v1/instruments/does-not-exist/dossier")
    assert response.status_code == 404
