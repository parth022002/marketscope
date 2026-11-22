# MarketScope.io — RAG Architecture & Ingestion Design

## 1. Multi-Modal Financial Document Processing
MarketScope.io processes three distinct streams of unstructured financial text:
1. **Regulatory Filings (SEC EDGAR)**: Structured XBRL and HTML 10-K, 10-Q, and 8-K filings.
2. **Verified Financial News**: Real-time RSS feeds and REST APIs from tier-1 publishers.
3. **Exchange Disclosures & Corporate Catalysts**: Earnings conference transcripts and dividend schedules.

---

## 2. Vector Store & Index Partitioning
- **Partitioning Strategy**: Document indices are logically partitioned by `Symbol` and `FiscalYear` to eliminate cross-entity leakage during similarity searches.
- **Embedding Refresh Cadence**:
  - SEC Filings: Ingested upon filing release.
  - News Articles: Rolling index with 30-day retention for vector lookups; aged out to cold storage.
  - Quantitative Factor Models: In-memory vector representation refreshed after daily market close.

---

## 3. Query Expansion & Financial Domain Rewriting
Before executing vector searches, user and agent queries pass through a Financial Query Expander:
- Maps ticker aliases (e.g., "Google" -> "GOOGL", "AAPL" -> "Apple Inc.").
- Translates informal concepts to GAAP line items (e.g., "how much cash they have" -> "Cash, cash equivalents, and marketable securities").
- Filters out temporal ambiguity by appending the active fiscal calendar context.
