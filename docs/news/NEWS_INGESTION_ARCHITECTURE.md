# MarketScope.io — Central News Ingestion Engine Architecture

## 1. Architectural Philosophy

The MarketScope.io News Ingestion Engine is constructed on a decoupled, asynchronous, event-driven pipeline designed for resilience, strict data hygiene, and end-to-end provenance tracking.

Failure of any individual upstream provider or connector never halts ingestion from other sources. Every step of the pipeline—from raw HTTP/RSS fetching to deduplication, entity resolution, and database persistence—is fully isolated and auditable.

---

## 2. Pipeline Flow Diagram

```
[External Sources: Tier 1 Regulators, Tier 2 Publishers, Tier 3 APIs]
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │  Source Connectors Layer  │
                    │ (Independent Adapters)    │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │  Fetch Scheduler & Queue  │
                    │  (Rate-Limited, Backoff)  │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │   Normalization Engine    │
                    │(Preserves Real Timestamps)│
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │   Validation & Hygiene    │
                    │(Rejects Fabricated Ticks) │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │   Deduplication Engine    │
                    │ (Canonical URL & Cosine)  │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Entity Recognition Engine │
                    │(Maps to Universal Master) │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │  Trust & Verification     │
                    │ (Tier & Evidence Linker)  │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Grounded AI Summarizer    │
                    │(Zero-Hallucination Guard) │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │  Market Impact Engine     │
                    │ (Transmission Channels)   │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
      ┌───────────────────────────┴───────────────────────────┐
      ▼                                                       ▼
[Neon PostgreSQL Storage]                            [In-Memory & Redis Cache]
(news_articles, news_evidence,                      (Active Story Feed & Search)
 news_clusters, news_corrections)                             │
                                                              ▼
                                                   [FastAPI REST & WebSockets]
                                                              │
                                                              ▼
                                                   [Next.js Institutional UI]
```

---

## 3. Component Specifications

### 3.1 Source Connectors (`apps/api/app/engine/news_ingestion/`)
- **`OfficialSourcesConnector`**: Connects to NSE Announcements, BSE Disclosures, SEBI Circulars, RBI Notifications, and SEC EDGAR RSS.
- **`PublisherRSSConnector`**: Connects to permitted public RSS feeds (Reuters, Mint, Business Standard, Economic Times, Moneycontrol, BBC, CNBC) with rate limiting and non-full-text summary extraction.
- **`CommercialAPIConnector`**: Authenticates against FMP and Twelve Data commercial APIs with quota tracking and circuit breaker monitoring.

### 3.2 Ingestion Scheduler & Circuit Breakers
- Concurrency bounded via `asyncio.Semaphore(10)`.
- Request timeouts strictly enforced at $3.0\text{ seconds}$.
- Exponential backoff with jitter: $1\text{s}, 2\text{s}, 4\text{s}, 8\text{s}$ up to 3 retries.
- Consecutive failures ($> 3$) trip provider circuit breaker for $120\text{ seconds}$.

### 3.3 Normalization Engine
- Reconstructs raw heterogeneous payloads into `CanonicalNewsArticle`.
- **Absolute Rule**: Never replace an unavailable original publication timestamp with ingestion time. If unsupported, the record explicitly states `publication_time_unavailable=True`.
