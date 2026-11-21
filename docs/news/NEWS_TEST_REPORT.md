# MarketScope.io — News Intelligence Test & Verification Report

## 1. Test Suite Architecture

An automated verification test suite (`apps/api/tests/test_news_intelligence_system.py`) was constructed to test all aspects of the news intelligence architecture.

---

## 2. Test Execution Matrix

| Test Identifier | Tested Capability | Target Behavioral Assertion | Result |
| :--- | :--- | :--- | :---: |
| `test_official_source_normalization` | Tier 1 Ingestion | Correctly normalizes NSE and RBI official disclosures, preserving original UTC timestamp. | **PASS** |
| `test_timestamp_preservation_no_now_replacement` | Timestamp Hygiene | Asserts that missing timestamps are flagged as `UNAVAILABLE` and never replaced with current time. | **PASS** |
| `test_verification_status_tier1` | Trust Engine | Stories matching an official regulatory filing transition to `PRIMARY_SOURCE_CONFIRMED`. | **PASS** |
| `test_verification_status_multiple_tier2` | Corroboration Engine | Independent coverage across $\ge 2$ Tier 2 publishers transitions to `MULTIPLE_SOURCES_REPORTED`. | **PASS** |
| `test_disputed_story_handling` | Conflict Resolution | Contradictory reporting triggers `DISPUTED` flag and retains both evidence citations. | **PASS** |
| `test_entity_resolution_no_common_word_false_positive` | Entity Intelligence | Prevents common words ("IT", "ON") from triggering false positive ticker mappings. | **PASS** |
| `test_story_deduplication_and_clustering` | Deduplication | Clusters identical corporate releases from multiple publishers into a single `cluster_id`. | **PASS** |
| `test_7_factor_relevance_scoring` | Explainable Ranking | Tier 1 official recent filings rank higher than unverified general reporting. | **PASS** |
| `test_ai_summary_anti_hallucination_guard` | Summarizer Guard | Discards AI summary if factual figure (e.g. revenue number) is not present in source text. | **PASS** |
| `test_correction_and_retraction_audit_history` | Audit History | Updates story version, preserves original text in audit log, and stamps `CORRECTED` badge. | **PASS** |
| `test_user_dispute_reporting` | Moderation | Ingests user discrepancy report, creates ticket, and logs administrative alert. | **PASS** |
