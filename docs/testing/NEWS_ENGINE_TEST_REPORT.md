# Global News Engine Test Report

## 1. Test Summary
- **Test File**: `apps/api/tests/test_global_news_intelligence.py`
- **Execution Engine**: Pytest with FastAPI TestClient
- **Total Tests**: 7 test suites
- **Passed**: 7/7 (100%)
- **Execution Duration**: < 0.6s

## 2. Test Cases Executed & Validated
1. `test_news_feed_retrieval`: Validated canonical news feed retrieval with pagination and mandatory publisher fields.
2. `test_news_7_canonical_categories`: Verified filtering and classification across the 7 mandatory categories: Banking, Company, Sectors, Macro, Global Markets, Commodities/Forex, and Regulatory/Policy.
3. `test_news_source_tiers`: Verified source credibility classification across Tier 1 Primary Official, Tier 2 Journalism, and Tier 3 Industry sources.
4. `test_news_search_query`: Validated free-text search across tickers, company names, and macroeconomic keywords.
5. `test_news_article_dossier_and_ai_analysis`: Verified complete article dossier retrieval including the 8-point AI structured impact analysis.
6. `test_news_entity_mapping`: Verified that articles referencing companies contain structured entity metadata with exchange tickers and sectors.
7. `test_news_publisher_attribution`: Verified that every article provides clickable original URLs and verified publication timestamps.
