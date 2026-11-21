"""
MarketScope.io — Explainable 7-Factor Relevance Scorer
Scores news items (0-100) based on source credibility, recency decay,
evidence strength, financial significance, and entity relevance.
"""

import math
from datetime import datetime, timezone
from app.domain.canonical_news import CanonicalNewsArticle, SourceCredibilityTier, VerificationStatus


class NewsRelevanceScorer:
    @classmethod
    def score_article(
        cls,
        article: CanonicalNewsArticle,
        target_symbol: str | None = None,
        target_sector: str | None = None,
    ) -> tuple[int, str]:
        reasons = []

        # 1. Source Tier (weight: 25)
        if article.source_tier == SourceCredibilityTier.TIER_1_PRIMARY_OFFICIAL:
            s_tier = 25
            reasons.append("Tier 1 official primary disclosure (+25)")
        elif article.source_tier == SourceCredibilityTier.TIER_2_ESTABLISHED_JOURNALISM:
            s_tier = 21
            reasons.append("Tier 2 established journalism (+21)")
        elif article.source_tier == SourceCredibilityTier.TIER_3_SECONDARY_INDUSTRY:
            s_tier = 15
        else:
            s_tier = 0

        # 2. Evidence Strength (weight: 20)
        if article.verification_status == VerificationStatus.PRIMARY_SOURCE_CONFIRMED:
            s_evid = 20
            reasons.append("Official regulatory filing verified (+20)")
        elif article.verification_status == VerificationStatus.MULTIPLE_SOURCES_REPORTED:
            s_evid = 16
            reasons.append("Corroborated across multiple independent publishers (+16)")
        elif article.verification_status == VerificationStatus.SINGLE_CREDIBLE_SOURCE:
            s_evid = 10
        else:
            s_evid = 5

        # 3. Financial Significance (weight: 15)
        cat_lower = article.category.lower()
        if "economy" in cat_lower or "central banks" in cat_lower:
            s_impact = 15
            reasons.append("Macroeconomic monetary/fiscal policy significance (+15)")
        elif "company" in cat_lower or "corporate" in cat_lower:
            s_impact = 13
        else:
            s_impact = 10

        # 4. Recency Decay (weight: 15)
        now = datetime.now(timezone.utc)
        diff_hours = max(0.0, (now - article.published_at).total_seconds() / 3600.0)
        # 6-hour half-life exponential decay
        decay_factor = math.exp(-0.1155 * diff_hours)
        s_time = round(15 * decay_factor)
        if diff_hours < 2:
            reasons.append("Published within last 2 hours (+15)")

        # 5. Entity Specificity (weight: 10)
        s_entity = 5
        if target_symbol:
            match = any(e.symbol and target_symbol.upper() in e.symbol.upper() for e in article.related_entities)
            if match:
                s_entity = 10
                reasons.append(f"Direct match for entity '{target_symbol.upper()}' (+10)")

        # 6. Cross-Publisher Corroboration (weight: 10)
        c_count = len(article.corroborating_sources)
        s_corrob = min(10, c_count * 3)

        # 7. Structured Metadata Quality (weight: 5)
        s_qual = 5 if (article.key_facts and article.market_impact) else 3

        # Compute raw sum
        total_score = s_tier + s_evid + s_impact + s_time + s_entity + s_corrob + s_qual

        # Deductions
        if article.is_disputed:
            total_score = min(70, total_score - 20)
            reasons.append("Disputed factual claims penalty (-20)")

        final_score = max(10, min(100, total_score))
        explanation = "; ".join(reasons) if reasons else "Standard automated scoring based on publication baseline."

        return final_score, explanation

    @classmethod
    def score_and_rank(cls, articles: list[CanonicalNewsArticle]) -> list[CanonicalNewsArticle]:
        """Calculates 7-factor scores for each article and sorts by relevance descending."""
        for a in articles:
            score, explanation = cls.score_article(a)
            a.relevance_score = score
            a.ranking_explanation = explanation
        articles.sort(key=lambda a: (a.relevance_score, a.published_at), reverse=True)
        return articles

