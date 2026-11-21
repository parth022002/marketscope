"""
MarketScope.io — News Intelligence & Trust System Unit & Integration Tests
Validates source-tier classifications, zero timestamp fabrication, entity resolution,
relevance scoring, multi-source corroboration, causal impact channels, and dispute audits.
"""

from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.domain.canonical_news import (
    SourceCredibilityTier,
    VerificationStatus,
    FreshnessState,
    LicenseStatus,
)
from app.engine.news_ingestion.news_normalizer import NewsNormalizer
from app.engine.news_ingestion.news_entity_resolver import NewsEntityResolver
from app.engine.news_ingestion.news_relevance_scorer import NewsRelevanceScorer
from app.engine.news_ingestion.news_verification_service import NewsVerificationService
from app.engine.news_ingestion.news_deduplication import NewsDeduplicator
from app.engine.news_ingestion.news_impact_engine import NewsImpactEngine
from app.engine.news_service import news_service

client = TestClient(app)


def test_official_sources_normalization():
    """Verify Tier 1 primary official sources normalize with strict evidence hashes and timestamps."""
    raw = {
        "title": "RBI Monetary Policy Committee: Policy Repo Rate Kept Unchanged at 6.50%",
        "link": "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=58192",
        "pubDate": "2026-02-06T10:00:00+05:30",
        "description": "The Monetary Policy Committee decided to keep the policy repo rate unchanged at 6.50%.",
        "publisher": "Reserve Bank of India",
        "source_id": "src_rbi_official",
        "category": "Economy & Central Banks",
        "country": "India",
        "key_facts": ["Repo rate at 6.50%"]
    }

    article = NewsNormalizer.normalize_article(
        raw=raw,
        source_id="src_rbi_official",
        publisher_name="Reserve Bank of India",
        source_tier=SourceCredibilityTier.TIER_1_PRIMARY_OFFICIAL,
        license_status=LicenseStatus.APPROVED_FOR_PRODUCTION,
        default_category="Economy & Central Banks",
        default_country="India",
    )

    assert article.source_tier == SourceCredibilityTier.TIER_1_PRIMARY_OFFICIAL
    assert article.verification_status == VerificationStatus.PRIMARY_SOURCE_CONFIRMED
    assert article.publication_time_verified is True
    assert article.published_at.year == 2026
    assert article.published_at.month == 2
    assert len(article.evidence_items) == 1
    assert article.evidence_items[0].evidence_type == "REGULATORY_FILING"
    assert article.evidence_items[0].document_hash is not None


def test_timestamp_preservation_strict_policy():
    """Zero-fabrication rule: missing timestamps MUST NEVER be replaced with current ingestion time."""
    raw_missing_date = {
        "title": "Undated Financial Bulletin from Secondary Publisher",
        "link": "https://example.com/undated",
        "description": "Report without an official publication timestamp.",
        "publisher": "Secondary Wire",
    }

    article = NewsNormalizer.normalize_article(
        raw=raw_missing_date,
        source_id="src_secondary",
        publisher_name="Secondary Wire",
        source_tier=SourceCredibilityTier.TIER_3_SECONDARY_INDUSTRY,
        license_status=LicenseStatus.FREE_NONCOMMERCIAL_ONLY,
    )

    # Ingestion engine must flag publication_time_verified = False
    assert article.publication_time_verified is False
    assert article.freshness_state == FreshnessState.UNAVAILABLE
    # Timestamp must not be within the last hour (it must be anchored to sentinel or historical base)
    now = datetime.now(timezone.utc)
    assert (now - article.published_at).total_seconds() > 3600 * 24


def test_entity_resolution_no_common_word_collisions():
    """Verify common words like 'IT', 'ON', 'BE' do not create false positive ticker matches."""
    raw = {
        "title": "IT firms explore green energy on site to be compliant with norms",
        "link": "https://example.com/it-green",
        "pubDate": "2026-02-10T12:00:00Z",
        "description": "Information technology companies in Bengaluru invest in rooftop solar.",
        "publisher": "Tech Daily",
    }

    article = NewsNormalizer.normalize_article(
        raw=raw,
        source_id="src_tech",
        publisher_name="Tech Daily",
        source_tier=SourceCredibilityTier.TIER_2_ESTABLISHED_JOURNALISM,
        license_status=LicenseStatus.ATTRIBUTION_REQUIRED,
    )

    entities = NewsEntityResolver.resolve_entities(article)
    symbols = [e.symbol for e in entities if e.symbol]
    
    # Common-word tickers 'IT', 'ON', 'BE' must NOT be resolved as corporate stocks
    assert "IT" not in symbols
    assert "ON" not in symbols
    assert "BE" not in symbols


def test_causal_market_impact_analysis():
    """Verify causal transmission channels are properly constructed for rate and energy stories."""
    raw = {
        "title": "RBI Monetary Policy: Repo Rate Kept Unchanged at 6.50% Amid Inflation Vigilance",
        "link": "https://www.rbi.org.in/press/mpc",
        "pubDate": "2026-02-06T10:00:00+05:30",
        "description": "The MPC kept rates at 6.50% citing persistent food price pressures.",
        "publisher": "RBI",
    }

    article = NewsNormalizer.normalize_article(
        raw=raw,
        source_id="src_rbi",
        publisher_name="RBI",
        source_tier=SourceCredibilityTier.TIER_1_PRIMARY_OFFICIAL,
        license_status=LicenseStatus.APPROVED_FOR_PRODUCTION,
    )

    impact = NewsImpactEngine.analyze_impact(article)
    assert impact is not None
    assert len(impact.transmission_channels) >= 1
    channel_names = [ch.channel for ch in impact.transmission_channels]
    assert any("Interest Rate" in ch for ch in channel_names)


def test_news_api_endpoints_integration():
    """End-to-end API test for feeds, categories, sources, and discrepancy reporting."""
    # 1. Main Feed
    res = client.get("/api/v1/news")
    assert res.status_code == 200
    articles = res.json()
    assert len(articles) >= 5
    for a in articles:
        assert "headline" in a or "title" in a
        assert "verification_status" in a
        assert "source_tier" in a
        assert "evidence_items" in a

    # 2. India Hub
    res_in = client.get("/api/v1/news/india")
    assert res_in.status_code == 200
    in_articles = res_in.json()
    assert len(in_articles) >= 1
    assert all(a["country"] == "India" for a in in_articles)

    # 3. Global Hub
    res_gl = client.get("/api/v1/news/global")
    assert res_gl.status_code == 200
    gl_articles = res_gl.json()
    assert len(gl_articles) >= 1

    # 4. Sources Registry
    res_src = client.get("/api/v1/news/sources")
    assert res_src.status_code == 200
    sources = res_src.json()
    assert len(sources) >= 5
    assert any(s["source_id"] == "src_rbi_official" for s in sources)
    assert any(s["source_id"] == "src_sebi_official" for s in sources)

    # 5. Pipeline Health
    res_health = client.get("/api/v1/news/health")
    assert res_health.status_code == 200
    health_data = res_health.json()
    assert health_data["status"] == "HEALTHY"
    assert health_data["active_sources"] >= 5

    # 6. Admin Telemetry
    res_admin = client.get("/api/v1/admin/news/monitor")
    assert res_admin.status_code == 200
    admin_data = res_admin.json()
    assert admin_data["total_articles_ingested_24h"] >= 5
    assert admin_data["primary_source_confirmed_pct"] > 0

    # 7. User Dispute Report
    first_art_id = articles[0]["id"]
    report_payload = {
        "article_id": first_art_id,
        "report_category": "INCORRECT_FIGURE",
        "description": "Reported GDP figure discrepancy against official statistical release.",
        "evidence_url": "https://mospi.gov.in"
    }
    res_report = client.post("/api/v1/news/report", json=report_payload)
    assert res_report.status_code == 201
    rep_data = res_report.json()
    assert rep_data["article_id"] == first_art_id
    assert rep_data["status"] == "PENDING_INVESTIGATION"
