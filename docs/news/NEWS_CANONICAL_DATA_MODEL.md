# MarketScope.io — Canonical News Data Model Specification

## 1. Specification Overview

The Canonical News Data Model defines the complete immutable schema for all news stories, evidence records, story clusters, and corrections across MarketScope.io. Implemented in `apps/api/app/domain/canonical_news.py`, this contract guarantees structural integrity, source transparency, and auditability.

---

## 2. Core Entities

### 2.1 CanonicalNewsArticle

```python
class CanonicalNewsArticle(BaseModel):
    id: str                                  # Unique internal ID: "news_art_{uuid}"
    headline: str                            # Original, unmodified headline
    summary: str                             # Grounded factual summary (<= 80 words)
    publisher_name: str                      # Official publisher name
    publisher_id: str                        # Internal source ID: "src_in_rbi"
    original_url: str                        # Canonical link to original article
    author: str | None = None                # Named journalist or regulatory desk
    published_at: datetime                   # Official publication timestamp (UTC)
    published_timezone: str = "UTC"          # Original timezone (e.g., "Asia/Kolkata")
    publication_time_verified: bool = True   # False if timestamp was estimated
    first_detected_at: datetime              # Timestamp when MarketScope first ingested
    last_updated_at: datetime | None = None  # Last modification timestamp
    source_tier: SourceCredibilityTier       # TIER_1_PRIMARY, TIER_2_JOURNALISM, etc.
    verification_status: VerificationStatus  # PRIMARY_SOURCE_CONFIRMED, etc.
    freshness_state: FreshnessState          # JUST_PUBLISHED, RECENT, DEVELOPING, etc.
    license_status: LicenseStatus            # APPROVED_FOR_PRODUCTION, etc.
    category: str                            # Primary category from standard taxonomy
    secondary_categories: list[str] = []     # Multi-tag categories
    country: str                             # "India", "United States", "Global", etc.
    market: str                              # "DOMESTIC_INDIA", "INTERNATIONAL", etc.
    asset_classes: list[str] = []            # ["EQUITY", "COMMODITY", "CURRENCY"]
    related_entities: list[NewsEntity] = []  # Mapped company/index/macro entities
    key_facts: list[str] = []                # Bulleted verified facts directly in text
    evidence_items: list[NewsEvidence] = []  # Traceable evidence documents and links
    cluster_id: str | None = None            # Associated story cluster identifier
    is_disputed: bool = False                # Flagged if credible sources disagree
    correction_history: list[NewsCorrection] = []  # Full audit trail of corrections
    relevance_score: int                     # 0 - 100 explainable score
    market_impact: MarketImpactAnalysis | None = None
```

### 2.2 NewsEvidence

```python
class NewsEvidence(BaseModel):
    evidence_id: str                         # "evid_{uuid}"
    evidence_type: str                       # "REGULATORY_FILING", "EXCHANGE_NOTICE", etc.
    title: str                               # "BSE Filing Ref No. 2026/11/4891"
    url: str                                 # Direct clickable link to source document
    publisher_or_authority: str             # "BSE India", "SEBI", "RBI"
    document_timestamp: datetime             # Document publication time
    verified_by_engine: bool = True          # Verified against official public feed
```

### 2.3 NewsStoryCluster

```python
class NewsStoryCluster(BaseModel):
    cluster_id: str                          # "cluster_{slug}_{date}"
    primary_headline: str                    # Lead representative headline
    created_at: datetime
    updated_at: datetime
    article_ids: list[str]                   # All member article IDs
    publishers_count: int                    # Number of distinct reporting publishers
    has_primary_evidence: bool               # True if Tier 1 document exists
    verification_level: VerificationStatus
```

### 2.4 NewsCorrection

```python
class NewsCorrection(BaseModel):
    correction_id: str
    article_id: str
    corrected_at: datetime
    correction_type: str                     # "CORRECTION", "CLARIFICATION", "RETRACTION"
    original_text: str                       # Prior statement
    corrected_text: str                      # Amended statement
    publisher_notice_url: str | None = None  # Link to publisher's correction note
    reason: str
```

---

## 3. Enumerations

```python
class SourceCredibilityTier(str, Enum):
    TIER_1_PRIMARY_OFFICIAL = "TIER_1_PRIMARY_OFFICIAL"
    TIER_2_ESTABLISHED_JOURNALISM = "TIER_2_ESTABLISHED_JOURNALISM"
    TIER_3_SECONDARY_INDUSTRY = "TIER_3_SECONDARY_INDUSTRY"
    TIER_4_UNVERIFIED = "TIER_4_UNVERIFIED"

class VerificationStatus(str, Enum):
    PRIMARY_SOURCE_CONFIRMED = "PRIMARY_SOURCE_CONFIRMED"
    MULTIPLE_SOURCES_REPORTED = "MULTIPLE_SOURCES_REPORTED"
    SINGLE_CREDIBLE_SOURCE = "SINGLE_CREDIBLE_SOURCE"
    DEVELOPING_STORY = "DEVELOPING_STORY"
    DISPUTED = "DISPUTED"
    UNVERIFIED = "UNVERIFIED"
    CORRECTED = "CORRECTED"
    RETRACTED = "RETRACTED"

class FreshnessState(str, Enum):
    JUST_PUBLISHED = "JUST_PUBLISHED"        # < 30 minutes old
    RECENT = "RECENT"                        # < 4 hours old
    DEVELOPING = "DEVELOPING"                # Actively updating story
    UPDATED = "UPDATED"                      # Amended with new facts
    OLDER_REPORT = "OLDER_REPORT"            # > 24 hours old
    STALE_SOURCE = "STALE_SOURCE"            # Unresponsive feed
    UNAVAILABLE = "UNAVAILABLE"              # Publication timestamp missing
```
