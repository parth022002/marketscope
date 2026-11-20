"""MarketScope.io — Phase 5 Test Suite: Gated AI Research Synthesis (MOD-17 / REQ-FN-14)"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ai_synthesis_grounded_reliance():
    """Verify that AI synthesis for a valid symbol returns grounded citations, strengths, and risks."""
    response = client.get("/api/v1/instruments/RELIANCE/ai-synthesis")
    assert response.status_code == 200
    data = response.json()

    assert data["symbol"] == "RELIANCE"
    assert data["status"] == "SUCCESS"
    assert len(data["executive_summary"]) > 20
    assert len(data["key_fundamental_strengths"]) >= 2
    assert len(data["key_fundamental_risks"]) >= 2
    assert len(data["valuation_and_solvency_assessment"]) > 10
    assert data["grounding_score"] >= 0.95
    assert "SEBI" in data["disclaimer"] or "STRICTLY FOR RESEARCH" in data["disclaimer"]

    # Verify Citations
    assert len(data["citations"]) >= 3
    for cit in data["citations"]:
        assert "citation_id" in cit
        assert "fact_or_ratio" in cit
        assert "value" in cit
        assert "source_formula_or_filing" in cit


def test_ai_synthesis_abstention_on_unknown_symbol():
    """Verify that AI engine strictly abstains when audited facts are missing (MOD-17 guardrail)."""
    response = client.get("/api/v1/instruments/TOTALLY_UNKNOWN_XYZ_999/ai-synthesis")
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "ABSTAINED"
    assert "INSUFFICIENT_EVIDENCE" in data["executive_summary"]
    assert data["grounding_score"] == 0.0
    assert len(data["citations"]) == 0


def test_ai_synthesis_post_custom_focus():
    """Verify POST re-synthesis with custom focus topic."""
    payload = {
        "focus_topic": "Balance Sheet Leverage and Free Cash Flow Yield",
        "provider_preference": "auto",
    }
    response = client.post("/api/v1/instruments/TCS/ai-synthesis", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["symbol"] == "TCS"
    assert data["status"] == "SUCCESS"
    assert len(data["citations"]) >= 3
