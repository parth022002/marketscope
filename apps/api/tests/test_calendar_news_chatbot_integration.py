"""
MarketScope.io — Automated Integration Tests for Calendar, News, and Chatbot
Validates cross-module interactions:
- Chatbot retrieves real-time calendar status.
- Chatbot retrieves verified news articles with URLs.
- Calendar events link to news catalysts.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_cross_module_chatbot_and_calendar():
    """Verify chatbot query about market status uses market_calendar engine output."""
    # 1. Query market calendar
    cal_res = client.get("/api/v1/calendar/markets/NSE")
    assert cal_res.status_code == 200
    cal_data = cal_res.json()
    expected_status = cal_data["status"]

    # 2. Query chatbot
    chat_res = client.post(
        "/api/v1/assistant/chat",
        json={"message": "What is the current status of NSE?"},
    )
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert expected_status in chat_data["content"]
    assert any("/calendar" in c["url"] for c in chat_data["citations"])


def test_cross_module_chatbot_and_news():
    """Verify chatbot query about banking news retrieves news from the news intelligence service."""
    # 1. Fetch news articles
    news_res = client.get("/api/v1/news?limit=2")
    assert news_res.status_code == 200

    # 2. Query chatbot for latest news
    chat_res = client.post(
        "/api/v1/assistant/chat",
        json={"message": "Give me the latest news headline and tell me why it matters."},
    )
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert chat_data["intent"] == "NEWS_ANALYSIS"
    assert len(chat_data["citations"]) >= 1


def test_cross_module_calendar_events_and_catalysts():
    """Verify calendar events endpoint returns actionable corporate events for major symbols."""
    res = client.get("/api/v1/calendar/events?symbol=NSE:RELIANCE")
    assert res.status_code == 200
    events = res.json()
    assert len(events) >= 1
    assert "Reliance" in events[0]["title"]
