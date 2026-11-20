"""MarketScope.io — Phase 6 Test Suite: Production Hardening & Deep Health (MOD-01 / REQ-SEC-04)"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_deep_health_endpoint():
    """Verify deep health check assesses all core subsystems."""
    response = client.get("/api/v1/health/deep")
    assert response.status_code == 200
    data = response.json()

    assert data["status"] in ["HEALTHY", "DEGRADED"]
    assert data["service"] == "MarketScope.io Core API"
    assert len(data["components"]) >= 3

    component_names = [c["name"] for c in data["components"]]
    assert any("Database" in name for name in component_names)
    assert any("Rate Limiter" in name or "Redis" in name for name in component_names)
    assert any("Data Provider" in name for name in component_names)
    assert any("AI Research" in name for name in component_names)


def test_rate_limiter_allows_normal_traffic():
    """Verify rate limiter allows normal requests and functions smoothly."""
    for _ in range(5):
        response = client.get("/api/v1/instruments/RELIANCE/ai-synthesis")
        assert response.status_code == 200
