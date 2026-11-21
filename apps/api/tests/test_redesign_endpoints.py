import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_market_ticker_endpoint():
    """Verify global ticker returns Indian, global, commodity, and currency items."""
    response = client.get("/api/v1/market/ticker")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 15
    symbols = [item["symbol"] for item in data]
    assert "NIFTY 50" in symbols
    assert "SENSEX" in symbols
    assert "NASDAQ 100" in symbols
    assert "BRENT CRUDE" in symbols
    assert "USD/INR" in symbols


def test_market_overview_endpoint():
    """Verify market overview provides breadth, mood, movers, and top companies."""
    response = client.get("/api/v1/market/overview")
    assert response.status_code == 200
    data = response.json()
    assert "market_breadth" in data
    assert "market_mood" in data
    assert "top_companies" in data
    assert "movers" in data
    assert "sector_performance" in data
    assert data["market_breadth"]["advances"] > 0
    assert "Greed" in data["market_mood"]["label"] or "Fear" in data["market_mood"]["label"]
    assert len(data["top_companies"]) >= 8


def test_market_heatmap_endpoint():
    """Verify market heatmap returns sector-grouped items."""
    response = client.get("/api/v1/market/heatmap?universe=all")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 8
    sectors = {item["sector"] for item in data}
    assert len(sectors) >= 3


def test_news_feed_and_search():
    """Verify news feed returns categorized stories and supports entity/symbol filters."""
    response = client.get("/api/v1/news")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    first = data[0]
    assert "title" in first
    assert "priority" in first
    assert "relevance_score" in first
    assert "entities" in first

    # Filter by symbol
    rel_response = client.get("/api/v1/news?symbol=RELIANCE")
    assert rel_response.status_code == 200
    rel_data = rel_response.json()
    assert len(rel_data) >= 1

    # Filter by category
    econ_response = client.get("/api/v1/news?category=Economy%20%26%20Central%20Banks")
    assert econ_response.status_code == 200
    econ_data = econ_response.json()
    assert len(econ_data) >= 1


def test_news_detail_transmission_channels():
    """Verify news detail endpoint returns causal transmission channels."""
    response = client.get("/api/v1/news/news-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "news-001"
    assert "transmission_channels" in data
    assert len(data["transmission_channels"]) >= 2
    assert "affected_instruments" in data


def test_calendar_events_endpoint():
    """Verify calendar events returns scheduled macro and earnings events."""
    response = client.get("/api/v1/calendar/events")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    event_types = {e["event_type"] for e in data}
    assert "MACRO" in event_types
    assert "EARNINGS" in event_types
