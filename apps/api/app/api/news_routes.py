"""
MarketScope.io — Verified Financial News Intelligence API Routes
Full implementation of endpoints for news feed, category hubs, primary evidence,
source registry, user discrepancy reports, and administrative monitoring.
"""

from typing import Any
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.domain.canonical_news import (
    CanonicalNewsArticle,
    NewsEvidence,
    NewsCorrection,
    NewsSourceRegistryItem,
    UserDisputeReport,
    NewsAdminMonitorStats,
)
from app.engine.news_service import news_service

news_router = APIRouter(prefix="", tags=["News Intelligence & Trust"])


class DisputeReportRequest(BaseModel):
    article_id: str
    report_category: str  # "INCORRECT_FIGURE", "MISATTRIBUTED_ENTITY", "BROKEN_LINK", "MISSING_CORRECTION"
    description: str
    evidence_url: str | None = None


# ─────────────────────────────────────────────────────────────────────────────
# 1. Feed & Hub Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@news_router.get(
    "/news",
    response_model=list[CanonicalNewsArticle],
    summary="Verified Financial News Feed",
)
async def get_news_feed(
    category: str | None = Query(None, description="Category filter (e.g. Economy & Central Banks)"),
    country: str | None = Query(None, description="Country filter (e.g. India, US, Global)"),
    market: str | None = Query(None, description="Market filter (e.g. DOMESTIC_INDIA, INTERNATIONAL)"),
    priority: str | None = Query(None, description="Priority filter (e.g. BREAKING)"),
    symbol: str | None = Query(None, description="Ticker symbol filter (e.g. RELIANCE, TCS, AAPL)"),
    verification_status: str | None = Query(None, description="Verification status filter"),
    source_tier: str | None = Query(None, description="Source tier filter"),
    query: str | None = Query(None, description="Search term in headline, summary, or entities"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    page: int = Query(1, ge=1, description="Page number"),
):
    """Returns verified canonical news items filtered by multi-tier criteria."""
    return await news_service.get_articles(
        category=category,
        country=country,
        market=market,
        priority=priority,
        symbol=symbol,
        verification_status=verification_status,
        source_tier=source_tier,
        query=query,
        limit=limit,
        page=page,
    )


@news_router.get(
    "/news/latest",
    response_model=list[CanonicalNewsArticle],
    summary="Latest Verified Articles",
)
async def get_latest_news(limit: int = Query(10, ge=1, le=50)):
    """Returns the most recent verified news articles."""
    return await news_service.get_articles(limit=limit, page=1)


@news_router.get(
    "/news/breaking",
    response_model=list[CanonicalNewsArticle],
    summary="Breaking Financial Intelligence Wire",
)
async def get_breaking_news(limit: int = Query(5, ge=1, le=20)):
    """Returns high-relevance breaking wire items with verified evidence."""
    return await news_service.get_articles(priority="BREAKING", limit=limit, page=1)


@news_router.get(
    "/news/india",
    response_model=list[CanonicalNewsArticle],
    summary="Indian Financial & Regulatory News",
)
async def get_india_news(limit: int = Query(20, ge=1, le=50)):
    """Returns domestic Indian market, RBI, SEBI, and NSE/BSE news."""
    return await news_service.get_articles(country="India", limit=limit, page=1)


@news_router.get(
    "/news/global",
    response_model=list[CanonicalNewsArticle],
    summary="Global & International Financial News",
)
async def get_global_news(limit: int = Query(20, ge=1, le=50)):
    """Returns global macroeconomic, commodity, and international central bank news."""
    return await news_service.get_articles(market="INTERNATIONAL", limit=limit, page=1)


@news_router.get(
    "/news/markets",
    response_model=list[CanonicalNewsArticle],
    summary="Capital Markets & Equities News",
)
async def get_markets_news(limit: int = Query(20, ge=1, le=50)):
    """Returns financial markets, indices, and asset class developments."""
    return await news_service.get_articles(category="Financial Markets", limit=limit, page=1)


@news_router.get(
    "/news/banking",
    response_model=list[CanonicalNewsArticle],
    summary="Banking & Financial Institutions News",
)
async def get_banking_news(limit: int = Query(20, ge=1, le=50)):
    """Returns news specifically covering RBI, public & private sector banks, NBFCs, and credit growth."""
    return await news_service.get_articles(category="Banking & Financial Institutions", limit=limit, page=1)


@news_router.get(
    "/news/categories",
    summary="Canonical News Categories",
)
async def get_news_categories():
    """Returns the 7 canonical hierarchical news categories."""
    return [
        {"id": "BANKING", "label": "Banking & Financial Institutions", "description": "RBI decisions, bank earnings, credit growth, NPA updates"},
        {"id": "COMPANY", "label": "Company News", "description": "Quarterly earnings, M&A, management changes, corporate actions"},
        {"id": "SECTORS", "label": "Industry & Sectors", "description": "IT, Automotive, Pharma, Energy, Infrastructure, Metals"},
        {"id": "MACRO", "label": "Economy & Central Banks", "description": "Inflation, GDP, employment, monetary and fiscal policy"},
        {"id": "GLOBAL_MARKETS", "label": "Global Financial Markets", "description": "US, European, and Asian market indices and capital flows"},
        {"id": "COMMODITIES_FOREX", "label": "Commodities & Currencies", "description": "Crude oil, gold, silver, industrial metals, USD/INR"},
        {"id": "REGULATORY", "label": "Regulations & Geopolitics", "description": "SEBI, SEC, exchange notices, global trade policy"},
    ]


@news_router.get(
    "/news/sectors/{sector}",
    response_model=list[CanonicalNewsArticle],
    summary="Sector-Specific Verified News",
)
async def get_sector_news(sector: str, limit: int = Query(15, ge=1, le=50)):
    """Returns news developments affecting a specific industrial sector."""
    articles = await news_service.get_articles(limit=50, page=1)
    sec_lower = sector.lower()
    matched = [
        a for a in articles
        if any(sec_lower in s.lower() for s in a.affected_sectors)
        or sec_lower in a.category.lower()
    ]
    return matched[:limit]


@news_router.get(
    "/news/search",
    response_model=list[CanonicalNewsArticle],
    summary="Search Verified News",
)
async def search_news(
    q: str = Query(..., description="Query term across headline, summary, and entities"),
    limit: int = Query(20, ge=1, le=50),
):
    """Executes search across verified headlines, summaries, and related companies."""
    return await news_service.get_articles(query=q, limit=limit, page=1)


@news_router.get(
    "/news/companies/{symbol}",
    response_model=list[CanonicalNewsArticle],
    summary="Company-Specific Verified News",
)
async def get_company_news(symbol: str, limit: int = Query(15, ge=1, le=50)):
    """Returns news and regulatory filings tagged to a specific company symbol."""
    return await news_service.get_articles(symbol=symbol, limit=limit, page=1)


# ─────────────────────────────────────────────────────────────────────────────
# 2. Source Registry, Health & Auditing
# ─────────────────────────────────────────────────────────────────────────────

@news_router.get(
    "/news/sources",
    response_model=list[NewsSourceRegistryItem],
    summary="Registered News Sources Catalog",
)
async def get_sources_registry():
    """Returns the approved directory of news providers with tiers, license status, and latency."""
    return await news_service.get_registered_sources()


@news_router.get(
    "/news/health",
    summary="News Ingestion Pipeline Health",
)
async def get_news_health():
    """Returns live telemetry on the news ingestion connectors and circuit breakers."""
    stats = await news_service.get_admin_monitor_stats()
    return {
        "status": stats.pipeline_health,
        "active_sources": stats.active_sources_count,
        "articles_ingested_24h": stats.total_articles_ingested_24h,
        "primary_confirmed_pct": stats.primary_source_confirmed_pct,
        "circuit_breakers_tripped": stats.circuit_breakers_tripped,
        "timestamp": stats.timestamp.isoformat(),
    }


@news_router.post(
    "/news/report",
    response_model=UserDisputeReport,
    status_code=status.HTTP_201_CREATED,
    summary="Submit News Discrepancy or Dispute Report",
)
async def submit_discrepancy_report(payload: DisputeReportRequest):
    """Registers a user correction or discrepancy report for human and algorithmic review."""
    report = await news_service.submit_dispute_report(
        article_id=payload.article_id,
        report_category=payload.report_category,
        description=payload.description,
        evidence_url=payload.evidence_url,
    )
    return report


@news_router.get(
    "/admin/news/monitor",
    response_model=NewsAdminMonitorStats,
    summary="Administrative News Intelligence Dashboard",
)
async def get_admin_news_monitor():
    """Provides internal operations telemetry on news quality, pipeline latency, and disputes."""
    return await news_service.get_admin_monitor_stats()


# ─────────────────────────────────────────────────────────────────────────────
# 3. Individual Story Details & Lineage
# ─────────────────────────────────────────────────────────────────────────────

@news_router.get(
    "/news/{story_id}",
    response_model=CanonicalNewsArticle,
    summary="Canonical News Article Detail",
)
async def get_news_story_detail(story_id: str):
    """Returns full canonical article record with market transmission channels and verification evidence."""
    story = await news_service.get_article_by_id(story_id)
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"News article with ID '{story_id}' not found.",
        )
    return story


@news_router.get(
    "/news/{story_id}/evidence",
    response_model=list[NewsEvidence],
    summary="Primary Source Evidence Lineage",
)
async def get_news_story_evidence(story_id: str):
    """Returns primary source evidence items, document hashes, and filing URLs for a story."""
    story = await news_service.get_article_by_id(story_id)
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"News article with ID '{story_id}' not found.",
        )
    return story.evidence_items


@news_router.get(
    "/news/{story_id}/history",
    response_model=list[NewsCorrection],
    summary="Article Correction & Audit Trail",
)
async def get_news_story_history(story_id: str):
    """Returns formal correction history, amendments, and retraction notices."""
    story = await news_service.get_article_by_id(story_id)
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"News article with ID '{story_id}' not found.",
        )
    return story.correction_history
