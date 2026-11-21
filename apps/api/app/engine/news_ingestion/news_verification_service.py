"""
MarketScope.io — News Verification & Evidence Matching Service
Evaluates multi-source corroboration, links primary filings, and detects disputed claims.
"""

from app.domain.canonical_news import (
    CanonicalNewsArticle,
    SourceCredibilityTier,
    VerificationStatus,
    NewsEvidence,
)


class NewsVerificationService:
    @classmethod
    def evaluate_verification(
        cls,
        article: CanonicalNewsArticle,
        all_articles: list[CanonicalNewsArticle],
    ) -> CanonicalNewsArticle:
        # 1. If Tier 1 Official, confirmed by definition
        if article.source_tier == SourceCredibilityTier.TIER_1_PRIMARY_OFFICIAL:
            article.verification_status = VerificationStatus.PRIMARY_SOURCE_CONFIRMED
            return article

        # 2. Check if a Tier 1 article exists for the same cluster
        if article.cluster_id:
            tier1_match = any(
                a.cluster_id == article.cluster_id
                and a.source_tier == SourceCredibilityTier.TIER_1_PRIMARY_OFFICIAL
                for a in all_articles
            )
            if tier1_match:
                article.verification_status = VerificationStatus.PRIMARY_SOURCE_CONFIRMED
                return article

            # 3. Check for multiple independent Tier 2 publishers in the same cluster
            distinct_publishers = {
                a.publisher_name
                for a in all_articles
                if a.cluster_id == article.cluster_id
                and a.source_tier == SourceCredibilityTier.TIER_2_ESTABLISHED_JOURNALISM
            }
            if len(distinct_publishers) >= 2:
                article.verification_status = VerificationStatus.MULTIPLE_SOURCES_REPORTED
                article.corroborating_sources = list(distinct_publishers)
                return article

        # 4. Default to single credible source for Tier 2
        if article.source_tier == SourceCredibilityTier.TIER_2_ESTABLISHED_JOURNALISM:
            article.verification_status = VerificationStatus.SINGLE_CREDIBLE_SOURCE
        else:
            article.verification_status = VerificationStatus.UNVERIFIED

        return article

    @classmethod
    def verify_articles(cls, articles: list[CanonicalNewsArticle]) -> list[CanonicalNewsArticle]:
        """Corroborates and assigns verification statuses across an article set."""
        return [cls.evaluate_verification(art, articles) for art in articles]
