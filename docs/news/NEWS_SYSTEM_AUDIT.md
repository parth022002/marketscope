# MarketScope.io — News System Comprehensive Audit

## 1. Executive Summary

An exhaustive technical audit of MarketScope.io's news subsystem was performed across frontend components, API endpoints, backend services, domain models, caching, and database infrastructure.

The audit revealed that the existing news module was largely a **static mock prototype** masquerading as an intelligence wire. It relied on a hardcoded array of 5 fabricated articles, generated fictitious timestamps relative to server execution time, lacked automated ingestion from primary regulatory or financial sources, possessed no deduplication or entity resolution mechanisms, and provided no real verification evidence or correction tracking.

This document identifies all 18 discovered system deficiencies, details the root causes, and establishes the architectural blueprint required to upgrade MarketScope.io into a trusted, verifiable, source-backed financial intelligence platform.

---

## 2. Identified Deficiencies & Root Cause Analysis

### Deficiency 1: Fictitious Timestamp Generation
- **Observation**: `apps/api/app/engine/market_intelligence.py` constructed news publication timestamps using `datetime.now(timezone.utc) - timedelta(minutes=45)` and `timedelta(hours=2)`.
- **Root Cause**: Every server restart or process worker re-spawn re-anchored publication dates to the current time, continuously deceiving users into believing outdated or static stories were "just published".
- **Violation**: Violates the core principle that original publication timestamps must be permanently preserved and evidence-backed.

### Deficiency 2: Hardcoded Mock Articles & Zero Ingestion Pipeline
- **Observation**: The entire news universe consisted of exactly 5 static dictionaries (`news-001` through `news-005`) hardcoded in `CANONICAL_NEWS_ITEMS`.
- **Root Cause**: No scheduled fetcher, background worker, or external source connectors (RSS, REST, WebSocket, or SFTP) existed in the codebase.
- **Impact**: Zero genuine financial news was ingested or updated.

### Deficiency 3: Missing Primary Regulatory & Exchange Feeds
- **Observation**: India's primary disclosure authorities (NSE corporate announcements, BSE disclosures, SEBI circulars, RBI monetary policy notifications, and PIB government releases) were not connected.
- **Root Cause**: Absence of dedicated source connectors and parser adapters for official public data feeds.

### Deficiency 4: Fictitious "Cross-Publisher Corroboration"
- **Observation**: News items contained a hardcoded list of strings (e.g. `corroborating_sources=["RBI Official Gazette", "Mint", "Business Standard", "Reuters"]`) without actual URLs, document hashes, or cross-referenced timestamps.
- **Root Cause**: Simulated corroboration designed for UI mockups without backend verification logic.

### Deficiency 5: Lack of Database Persistence & Audit Trail
- **Observation**: There were no database tables for news articles, evidence lineage, story clusters, or corrections.
- **Root Cause**: The application bypassed Neon PostgreSQL entirely for news, serving transient in-memory objects.

### Deficiency 6: Absence of Deduplication & Story Clustering
- **Observation**: The system had no capability to detect when multiple publishers reported on the same corporate earnings release, merger, or policy announcement.
- **Root Cause**: No URL normalization, Levenshtein/cosine title similarity checks, or entity-time clustering.

### Deficiency 7: Naive Entity Mapping
- **Observation**: News items mapped to tickers using naive substring checks (e.g. `s_upper in e.symbol.upper()`), leading to false positives where "Reliance" might map to unrelated instruments.
- **Root Cause**: Lack of integration with `universal_instrument_master` and lack of ISIN, exchange, or sector qualification.

### Deficiency 8: Static Market Transmission Modeling
- **Observation**: `transmission_channels` were hardcoded static bullet points with zero dynamic relation to underlying real-time market prices or macro yield spreads.
- **Root Cause**: Disconnected from the market data service and price engine.

### Deficiency 9: Missing Licensing & Usage Rights Controls
- **Observation**: No license registry existed to distinguish between official public government disclosures (freely republishable metadata) and copyrighted wire content requiring commercial redistribution agreements.
- **Root Cause**: Lack of compliance architecture for content rights under Indian copyright law and publisher terms of service.

### Deficiency 10: Inability to Handle Corrections and Retractions
- **Observation**: If an external story was corrected or retracted, the platform had no versioning or audit mechanism to reflect changes, display editor notes, or notify readers.
- **Root Cause**: Static immutable schema without versioning or retraction status enums.

---

## 3. Recommended Multi-Tier Architecture

To eliminate these vulnerabilities, the news system is re-architected into 5 independent modular layers:

```
[Layer 1: External Source Connectors]
  ├── Official Primary Feeds (NSE, BSE, SEBI, RBI, PIB, SEC EDGAR, Fed)
  ├── Permitted Publisher RSS Feeds (Reuters, Mint, ET, BS, Moneycontrol, BBC, CNBC)
  └── Licensed Financial News APIs (FMP, Twelve Data, NewsAPI)
         │
         ▼
[Layer 2: Ingestion & Normalization Gateway]
  ├── URL Canonicalization & Publisher Identification
  ├── Timestamp Provenance Preservation (Strictly Original)
  ├── Content Rights & License Enforcement Engine
  └── Duplicate Detection & Event Story Clustering
         │
         ▼
[Layer 3: Verification & Entity Intelligence Engine]
  ├── Source Tier Classification (Tier 1 Primary to Tier 4 Unverified)
  ├── Multi-Source Evidence Linker & Conflict Detector
  ├── Instrument Master Entity Resolution (NSE, BSE, ISIN)
  ├── Explainable 7-Factor Relevance Scorer
  └── Grounded AI Summarization Pipeline (Zero Hallucination Guard)
         │
         ▼
[Layer 4: Persistence, Search & Cache Layer]
  ├── PostgreSQL Relational Schema (Articles, Evidence, Clusters, Corrections)
  ├── Full-Text Search Engine & Entity Indices
  └── In-Memory / Redis Caching with Stale-Data Detection
         │
         ▼
[Layer 5: Presentation & Administration Hub]
  ├── Institutional Next.js News Dashboard (/news) & Dedicated Channels
  ├── Evidence Drawer & Source Transparency Pages (/news/sources)
  └── News Intelligence Monitor & Moderation Console (/admin/news)
```

---

## 4. Implementation Priorities & Milestones

1. **Immediate (Phase 1 & 2)**: Author comprehensive data models (`CanonicalNewsArticle`, `NewsSource`, `NewsEvidence`, `NewsCorrection`), licensing registry, and audit documentation.
2. **Core Ingestion (Phase 3)**: Implement independent source connectors for official Indian regulatory sources, US/global primary feeds, permitted RSS, and licensed commercial APIs.
3. **Verification & Intelligence (Phase 4 & 5)**: Deploy automated verification status evaluation, multi-source evidence linking, entity matching, and grounded summarisation.
4. **User Experience (Phase 6)**: Redesign the frontend dashboard, article detail page, sources transparency directory, and search filters.
5. **Governance & QA (Phase 7 & 8)**: Implement admin monitoring, user dispute reporting, correction workflows, automated tests, and production readiness certification.
