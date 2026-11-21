"""
MarketScope.io — Canonical News & Trust Intelligence Domain Model
Defines immutable data contracts, credibility tiers, verification statuses,
evidence lineages, story clusters, and correction audit models.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Sequence
from pydantic import BaseModel, Field, HttpUrl


class SourceCredibilityTier(str, Enum):
    TIER_1_PRIMARY_OFFICIAL = "TIER_1_PRIMARY_OFFICIAL"          # Regulatory filings, exchange notices, central banks, gov
    TIER_2_ESTABLISHED_JOURNALISM = "TIER_2_ESTABLISHED_JOURNALISM"  # Reputable financial journalism (Reuters, Mint, FT, etc.)
    TIER_3_SECONDARY_INDUSTRY = "TIER_3_SECONDARY_INDUSTRY"      # Industry trade associations & specialist research
    TIER_4_UNVERIFIED = "TIER_4_UNVERIFIED"                      # Social media, unverified rumors (excluded from feed)


class VerificationStatus(str, Enum):
    PRIMARY_SOURCE_CONFIRMED = "PRIMARY_SOURCE_CONFIRMED"  # Supported by official filing / gazette
    MULTIPLE_SOURCES_REPORTED = "MULTIPLE_SOURCES_REPORTED" # Independently reported by >= 2 Tier 2 publishers
    SINGLE_CREDIBLE_SOURCE = "SINGLE_CREDIBLE_SOURCE"      # Reported by 1 Tier 2 publisher without independent confirmation
    DEVELOPING_STORY = "DEVELOPING_STORY"                  # Information still emerging
    DISPUTED = "DISPUTED"                                  # Credible sources materially disagree
    UNVERIFIED = "UNVERIFIED"                              # Evidence insufficient
    CORRECTED = "CORRECTED"                                # Publisher issued formal correction
    RETRACTED = "RETRACTED"                                # Publisher formally withdrew story


class FreshnessState(str, Enum):
    JUST_PUBLISHED = "JUST_PUBLISHED"  # < 30m
    RECENT = "RECENT"                  # < 4h
    DEVELOPING = "DEVELOPING"          # Actively updating
    UPDATED = "UPDATED"                # Amended with new facts
    OLDER_REPORT = "OLDER_REPORT"      # > 24h
    STALE_SOURCE = "STALE_SOURCE"      # Upstream feed unresponsive
    UNAVAILABLE = "UNAVAILABLE"        # Publication timestamp missing


class LicenseStatus(str, Enum):
    APPROVED_FOR_PRODUCTION = "APPROVED_FOR_PRODUCTION"
    APPROVED_WITH_RESTRICTIONS = "APPROVED_WITH_RESTRICTIONS"
    FREE_NONCOMMERCIAL_ONLY = "FREE_NONCOMMERCIAL_ONLY"
    COMMERCIAL_LICENCE_REQUIRED = "COMMERCIAL_LICENCE_REQUIRED"
    ATTRIBUTION_REQUIRED = "ATTRIBUTION_REQUIRED"
    LICENCE_UNVERIFIED = "LICENCE_UNVERIFIED"
    DISABLED = "DISABLED"


class NewsEntity(BaseModel):
    type: str  # "company", "index", "commodity", "currency", "person", "institution"
    name: str
    symbol: str | None = None
    exchange: str | None = None
    isin: str | None = None
    relevance_pct: int = 100


class NewsEvidence(BaseModel):
    evidence_id: str
    evidence_type: str  # "REGULATORY_FILING", "EXCHANGE_NOTICE", "GOVERNMENT_GAZETTE", "INDEPENDENT_REPORT"
    title: str
    url: str
    publisher_or_authority: str
    document_timestamp: datetime
    document_hash: str | None = None
    verified_by_engine: bool = True


class NewsCorrection(BaseModel):
    correction_id: str
    article_id: str
    corrected_at: datetime
    correction_type: str  # "CORRECTION", "CLARIFICATION", "RETRACTION"
    original_text: str
    corrected_text: str
    publisher_notice_url: str | None = None
    reason: str


class MarketTransmissionChannel(BaseModel):
    channel: str
    description: str
    impact_type: str  # "confirmed" vs "implication"
    affected_instruments: list[str] = Field(default_factory=list)
    affected_sectors: list[str] = Field(default_factory=list)


class MarketImpactAnalysis(BaseModel):
    headline_implication: str
    direct_reported_impact: str
    transmission_channels: list[MarketTransmissionChannel] = Field(default_factory=list)
    historical_precedent: str | None = None
    uncertainty_qualification: str = "Analysis based on historical market correlations; does not constitute investment advice."


class CanonicalNewsArticle(BaseModel):
    id: str
    headline: str
    summary: str
    publisher_name: str
    publisher_id: str
    original_url: str
    author: str | None = None
    published_at: datetime
    published_timezone: str = "UTC"
    publication_time_verified: bool = True
    first_detected_at: datetime
    last_updated_at: datetime | None = None
    source_tier: SourceCredibilityTier
    verification_status: VerificationStatus
    freshness_state: FreshnessState
    license_status: LicenseStatus
    category: str  # "Economy & Central Banks", "Company News", "Financial Markets", "Geopolitics", "Industry & Sectors"
    secondary_categories: list[str] = Field(default_factory=list)
    country: str  # "India", "US", "Global", "Europe", "Asia"
    market: str   # "DOMESTIC_INDIA", "INTERNATIONAL", "GLOBAL_MACRO"
    asset_classes: list[str] = Field(default_factory=list)
    related_entities: list[NewsEntity] = Field(default_factory=list)
    key_facts: list[str] = Field(default_factory=list)
    evidence_items: list[NewsEvidence] = Field(default_factory=list)
    corroborating_sources: list[str] = Field(default_factory=list)
    cluster_id: str | None = None
    is_disputed: bool = False
    dispute_details: str | None = None
    correction_history: list[NewsCorrection] = Field(default_factory=list)
    relevance_score: int = 75  # 0 - 100
    ranking_explanation: str = "Scored based on source credibility, recency, and verified evidence."
    market_impact: MarketImpactAnalysis | None = None

    # Backward compatibility helper fields for legacy frontend views
    title: str | None = None
    publisher: str | None = None
    url: str | None = None
    impact_level: str = "MEDIUM"
    priority: str = "GENERAL"
    entities: list[NewsEntity] = Field(default_factory=list)
    transmission_channels: list[MarketTransmissionChannel] = Field(default_factory=list)
    affected_instruments: list[str] = Field(default_factory=list)
    affected_sectors: list[str] = Field(default_factory=list)

    def model_post_init(self, __context: Any) -> None:
        if self.title is None:
            self.title = self.headline
        if self.publisher is None:
            self.publisher = self.publisher_name
        if self.url is None:
            self.url = self.original_url
        if not self.entities and self.related_entities:
            self.entities = list(self.related_entities)
        if self.relevance_score >= 85:
            self.impact_level = "HIGH"
            self.priority = "BREAKING"
        elif self.relevance_score >= 70:
            self.impact_level = "MEDIUM"
            self.priority = "HIGH"
        else:
            self.impact_level = "LOW"
            self.priority = "GENERAL"

        if self.market_impact:
            if not self.transmission_channels and self.market_impact.transmission_channels:
                self.transmission_channels = list(self.market_impact.transmission_channels)
            for ch in self.market_impact.transmission_channels:
                for inst in ch.affected_instruments:
                    if inst not in self.affected_instruments:
                        self.affected_instruments.append(inst)
                for sec in ch.affected_sectors:
                    if sec not in self.affected_sectors:
                        self.affected_sectors.append(sec)




class NewsStoryCluster(BaseModel):
    cluster_id: str
    primary_headline: str
    lead_article_id: str
    created_at: datetime
    updated_at: datetime
    article_ids: list[str] = Field(default_factory=list)
    publishers: list[str] = Field(default_factory=list)
    publishers_count: int = 1
    has_primary_evidence: bool = False
    verification_level: VerificationStatus = VerificationStatus.SINGLE_CREDIBLE_SOURCE


class NewsSourceRegistryItem(BaseModel):
    source_id: str
    name: str
    tier: SourceCredibilityTier
    category: str
    country: str
    official_website: str
    feed_url: str | None = None
    license_status: LicenseStatus
    is_active: bool = True
    status: str = "HEALTHY"
    latency_ms: float = 120.0
    last_successful_fetch: datetime | None = None
    articles_ingested_24h: int = 0


class UserDisputeReport(BaseModel):
    report_id: str
    article_id: str
    submitted_at: datetime
    report_category: str  # "INCORRECT_FIGURE", "MISATTRIBUTED_ENTITY", "BROKEN_LINK", "MISSING_CORRECTION"
    description: str
    evidence_url: str | None = None
    status: str = "PENDING_INVESTIGATION"  # "PENDING_INVESTIGATION", "VERIFIED_AND_CORRECTED", "DISMISSED"


class NewsAdminMonitorStats(BaseModel):
    active_sources_count: int
    disabled_sources_count: int
    total_articles_ingested_24h: int
    primary_source_confirmed_pct: float
    disputed_articles_count: int
    unresolved_user_reports: int
    circuit_breakers_tripped: int
    pipeline_health: str = "HEALTHY"
    timestamp: datetime
