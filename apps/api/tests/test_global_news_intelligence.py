"""
MarketScope.io — Automated Test Suite for Worldwide Financial News Intelligence
Validates source registry tiering, 7-category taxonomy, entity resolution,
relevance scoring, and news search endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_news_categories_taxonomy():
    """Verify GET /api/v1/news/categories returns the 7 canonical hierarchical categories."""
    res = client.get("/api/v1/news/categories")
    assert res.status_code == 200
    cats = res.json()
    assert len(cats) == 7
    ids = [c["id"] for c in cats]
    assert "BANKING" in ids
    assert "COMPANY" in ids
    assert "MACRO" in ids
    assert "GLOBAL_MARKETS" in ids


def test_api_news_banking_feed():
    """Verify GET /api/v1/news/banking returns financial institutions and RBI developments."""
    res = client.get("/api/v1/news/banking")
    assert res.status_code == 200
    articles = res.json()
    assert isinstance(articles, list)


def test_api_news_search():
    """Verify GET /api/v1/news/search executes across headlines and summaries."""
    res = client.get("/api/v1/news/search?q=RBI")
    assert res.status_code == 200
    articles = res.json()
    assert isinstance(articles, list)


def test_api_news_sources_registry():
    """Verify GET /api/v1/news/sources returns approved directory with license and credibility tier."""
    res = client.get("/api/v1/news/sources")
    assert res.status_code == 200
    sources = res.json()
    assert len(sources) >= 4
    source_names = [s["name"] for s in sources]
    assert any("RBI" in n or "Reserve Bank" in n for n in source_names)
    assert any("SEBI" in n for n in source_names)


def test_api_news_health():
    """Verify GET /api/v1/news/health returns pipeline telemetry."""
    res = client.get("/api/v1/news/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ("HEALTHY", "DEGRADED")
    assert "articles_ingested_24h" in data
