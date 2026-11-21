"""
MarketScope.io — Story Clustering & Deduplication Engine
Clusters related reporting from multiple publishers into unified stories
while preserving distinct publisher perspectives and avoiding feed clutter.
"""

import re
from datetime import datetime, timezone
from app.domain.canonical_news import CanonicalNewsArticle, NewsStoryCluster, VerificationStatus


class NewsDeduplicator:
    @staticmethod
    def tokenize(text: str) -> set[str]:
        # Lowercase, clean punctuation, filter stop words
        words = re.findall(r"\b[a-z0-9]{3,}\b", text.lower())
        stop_words = {
            "the", "and", "for", "with", "that", "this", "from", "after", "over", "under",
            "more", "says", "said", "will", "have", "been", "amid", "into", "ahead"
        }
        return {w for w in words if w not in stop_words}

    @classmethod
    def calculate_similarity(cls, text_a: str, text_b: str) -> float:
        tokens_a = cls.tokenize(text_a)
        tokens_b = cls.tokenize(text_b)
        if not tokens_a or not tokens_b:
            return 0.0
        intersection = tokens_a.intersection(tokens_b)
        union = tokens_a.union(tokens_b)
        return len(intersection) / len(union)

    @classmethod
    def cluster_articles(
        cls, articles: list[CanonicalNewsArticle]
    ) -> tuple[list[CanonicalNewsArticle], dict[str, NewsStoryCluster]]:
        """
        Groups articles into clusters. Returns updated articles (with cluster_id)
        and the cluster dictionary.
        """
        clusters: dict[str, NewsStoryCluster] = {}
        now = datetime.now(timezone.utc)

        for art in articles:
            matched_cluster_id = None

            # Check if matches existing cluster
            for c_id, cluster in clusters.items():
                sim = cls.calculate_similarity(art.headline, cluster.primary_headline)
                if sim > 0.40:
                    matched_cluster_id = c_id
                    break

            if matched_cluster_id:
                cluster = clusters[matched_cluster_id]
                cluster.article_ids.append(art.id)
                if art.publisher_name not in cluster.publishers:
                    cluster.publishers.append(art.publisher_name)
                cluster.publishers_count = len(cluster.publishers)
                cluster.updated_at = max(cluster.updated_at, art.published_at)
                if art.source_tier == "TIER_1_PRIMARY_OFFICIAL":
                    cluster.has_primary_evidence = True
                    cluster.verification_level = VerificationStatus.PRIMARY_SOURCE_CONFIRMED
                elif cluster.publishers_count >= 2 and not cluster.has_primary_evidence:
                    cluster.verification_level = VerificationStatus.MULTIPLE_SOURCES_REPORTED

                art.cluster_id = matched_cluster_id
            else:
                new_c_id = f"cluster_{art.id.replace('news_art_', '')}"
                clusters[new_c_id] = NewsStoryCluster(
                    cluster_id=new_c_id,
                    primary_headline=art.headline,
                    lead_article_id=art.id,
                    created_at=art.published_at,
                    updated_at=art.published_at,
                    article_ids=[art.id],
                    publishers=[art.publisher_name],
                    publishers_count=1,
                    has_primary_evidence=(art.source_tier == "TIER_1_PRIMARY_OFFICIAL"),
                    verification_level=(
                        VerificationStatus.PRIMARY_SOURCE_CONFIRMED
                        if art.source_tier == "TIER_1_PRIMARY_OFFICIAL"
                        else VerificationStatus.SINGLE_CREDIBLE_SOURCE
                    ),
                )
                art.cluster_id = new_c_id

        return articles, clusters
