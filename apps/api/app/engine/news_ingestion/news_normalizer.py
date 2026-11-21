"""
MarketScope.io — News Normalization & Timestamp Integrity Engine
Transforms heterogeneous payloads into CanonicalNewsArticle records.
STRICT RULE: Never replaces an unavailable publication timestamp with the ingestion time.
"""

import hashlib
import uuid
import re
from datetime import datetime, timezone
from typing import Any

from app.domain.canonical_news import (
    CanonicalNewsArticle,
    SourceCredibilityTier,
    VerificationStatus,
    FreshnessState,
    LicenseStatus,
    NewsEvidence,
    NewsEntity,
)


class NewsNormalizer:
    @staticmethod
    def compute_document_hash(title: str, publisher: str, published_at: datetime) -> str:
        raw = f"{title.strip().lower()}|{publisher.strip().lower()}|{published_at.isoformat()}".encode("utf-8")
        return hashlib.sha256(raw).hexdigest()

    @staticmethod
    def calculate_freshness(published_at: datetime, publication_time_verified: bool) -> FreshnessState:
        if not publication_time_verified:
            return FreshnessState.UNAVAILABLE
        now = datetime.now(timezone.utc)
        diff_hours = (now - published_at).total_seconds() / 3600.0

        if diff_hours < 0.5:
            return FreshnessState.JUST_PUBLISHED
        if diff_hours < 4.0:
            return FreshnessState.RECENT
        if diff_hours < 24.0:
            return FreshnessState.DEVELOPING
        return FreshnessState.OLDER_REPORT

    @classmethod
    def normalize_article(
        cls,
        raw: dict[str, Any],
        source_id: str,
        publisher_name: str,
        source_tier: SourceCredibilityTier,
        license_status: LicenseStatus,
        default_category: str = "Financial Markets",
        default_country: str = "India",
    ) -> CanonicalNewsArticle:
        # Extract title
        title = raw.get("title") or raw.get("headline") or "Untitled Financial Report"
        title = re.sub(r"\s+", " ", title).strip()

        # Extract url
        url = raw.get("url") or raw.get("link") or f"https://marketscope.io/archive/{uuid.uuid4().hex[:8]}"

        # Extract or verify timestamp
        published_at_raw = raw.get("published_at") or raw.get("pubDate") or raw.get("date")
        published_at: datetime
        publication_time_verified = True

        if isinstance(published_at_raw, datetime):
            published_at = published_at_raw
            if published_at.tzinfo is None:
                published_at = published_at.replace(tzinfo=timezone.utc)
        elif isinstance(published_at_raw, str):
            try:
                # Attempt standard ISO and RFC-822 formats
                from email.utils import parsedate_to_datetime
                try:
                    published_at = parsedate_to_datetime(published_at_raw)
                except Exception:
                    published_at = datetime.fromisoformat(published_at_raw.replace("Z", "+00:00"))
                if published_at.tzinfo is None:
                    published_at = published_at.replace(tzinfo=timezone.utc)
            except Exception:
                # UNVERIFIED TIMESTAMP: DO NOT INVENT CURRENT TIME
                published_at = datetime(2026, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
                publication_time_verified = False
        else:
            published_at = datetime(2026, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
            publication_time_verified = False

        now = datetime.now(timezone.utc)
        doc_hash = cls.compute_document_hash(title, publisher_name, published_at)
        freshness = cls.calculate_freshness(published_at, publication_time_verified)

        # Initial verification status by tier
        if source_tier == SourceCredibilityTier.TIER_1_PRIMARY_OFFICIAL:
            verif = VerificationStatus.PRIMARY_SOURCE_CONFIRMED
        elif source_tier == SourceCredibilityTier.TIER_2_ESTABLISHED_JOURNALISM:
            verif = VerificationStatus.SINGLE_CREDIBLE_SOURCE
        else:
            verif = VerificationStatus.UNVERIFIED

        # Build initial evidence item
        evidence_items = []
        if url.startswith("http"):
            evidence_items.append(
                NewsEvidence(
                    evidence_id=f"evid_{doc_hash[:12]}",
                    evidence_type="REGULATORY_FILING" if source_tier == SourceCredibilityTier.TIER_1_PRIMARY_OFFICIAL else "INDEPENDENT_REPORT",
                    title=f"{publisher_name} Notice / Report",
                    url=url,
                    publisher_or_authority=publisher_name,
                    document_timestamp=published_at,
                    document_hash=doc_hash,
                    verified_by_engine=True,
                )
            )

        summary = raw.get("summary") or raw.get("description") or title

        return CanonicalNewsArticle(
            id=f"news_art_{doc_hash[:16]}",
            headline=title,
            summary=re.sub(r"<[^>]+>", "", summary).strip()[:400],
            publisher_name=publisher_name,
            publisher_id=source_id,
            original_url=url,
            author=raw.get("author"),
            published_at=published_at,
            published_timezone="UTC",
            publication_time_verified=publication_time_verified,
            first_detected_at=now,
            last_updated_at=now,
            source_tier=source_tier,
            verification_status=verif,
            freshness_state=freshness,
            license_status=license_status,
            category=raw.get("category") or default_category,
            country=raw.get("country") or default_country,
            market="DOMESTIC_INDIA" if default_country == "India" else "INTERNATIONAL",
            key_facts=raw.get("key_facts", []),
            evidence_items=evidence_items,
            corroborating_sources=[publisher_name],
        )
