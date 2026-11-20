import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.seed import DEFAULT_WORKSPACE_ID


@pytest.fixture
def client():
    return TestClient(app)


def test_resolve_instrument_single(client):
    response = client.get("/api/v1/instruments/resolve?q=INFY&exchange=NSE")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "INFY"
    # Should resolve or list candidates
    assert len(data["candidates"]) >= 1


def test_resolve_instrument_disambiguation(client):
    # Testing search with multiple listings (e.g., TATA matching TCS, TATAMOTORS, TATAMTRDVR)
    response = client.get("/api/v1/instruments/resolve?q=TATA")
    assert response.status_code == 200
    data = response.json()
    assert data["requires_disambiguation"] is True
    assert len(data["candidates"]) > 1


def test_get_metric_evidence_detail(client):
    response = client.get("/api/v1/instruments/in-nse-reliance/metrics/roe/evidence")
    assert response.status_code == 200
    data = response.json()
    assert data["metric_id"] == "roe"
    assert data["formula_expression"] == "Net Income (PAT) / Total Shareholders' Equity"
    assert data["quality_status"] == "VERIFIED_AUDITED"
    assert len(data["components"]) >= 2
    assert len(data["evidence"]) >= 1
    assert "BSE/NSE Filing" in data["evidence"][0]["source_name"]


def test_research_notes_crud(client):
    ws_id = str(DEFAULT_WORKSPACE_ID)

    # 1. Create Note
    create_payload = {
        "instrument_id": "in-nse-reliance",
        "title": "Reliance Industries Q3 Research Thesis",
        "thesis": "Retail & Digital segments expanding margins despite capex cycle.",
        "counterpoints": "Net debt reduction pacing slower than anticipated.",
        "open_questions": ["What is the timeline for the telecom IPO?"],
    }
    create_res = client.post(f"/api/v1/workspaces/{ws_id}/notes", json=create_payload)
    assert create_res.status_code == 201
    created_note = create_res.json()
    note_id = created_note["id"]
    assert created_note["title"] == create_payload["title"]

    # 2. List Notes
    list_res = client.get(f"/api/v1/workspaces/{ws_id}/notes")
    assert list_res.status_code == 200
    notes = list_res.json()
    assert any(n["id"] == note_id for n in notes)

    # 3. Update Note
    update_payload = {"title": "Updated Reliance Thesis (FY24 Revised)"}
    update_res = client.put(f"/api/v1/workspaces/{ws_id}/notes/{note_id}", json=update_payload)
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Reliance Thesis (FY24 Revised)"

    # 4. Delete Note
    del_res = client.delete(f"/api/v1/workspaces/{ws_id}/notes/{note_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "success"
