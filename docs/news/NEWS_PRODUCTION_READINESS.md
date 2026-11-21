# MarketScope.io — News Module Production Readiness & Compliance Checklist

## 1. Readiness Audit Matrix

| Domain | Readiness Status | Operational Audit Findings |
| :--- | :---: | :--- |
| **Trust & Provenance** | **READY** | Zero fabricated headlines or timestamps. All displayed news items possess traceable evidence documents. |
| **Source Tiering** | **READY** | 4-tier source classification deployed: Tier 1 (Official), Tier 2 (Journalism), Tier 3 (Secondary), Tier 4 (Excluded). |
| **Verification Engine** | **READY** | Evidence linking engine assigns 8 distinct statuses (`PRIMARY_SOURCE_CONFIRMED`, `MULTIPLE_SOURCES_REPORTED`, etc.). |
| **Content Rights** | **READY** | Licensing registry strictly enforced. Full copyrighted text never republished; fair dealing compliant. |
| **Entity Resolution** | **READY** | Integrated with `universal_instrument_master`. Common-word false positives strictly eliminated. |
| **Explainable Ranking** | **READY** | 7-factor mathematical score with user-facing explainability tooltips. |
| **Summarization Guard** | **READY** | Anti-hallucination fact verification checks generated summaries against source text before display. |
| **Corrections & Retractions**| **READY** | Full audit trail with version diffing and retraction notices. |
| **Frontend Experience** | **READY** | Redesigned dashboard (`/news`), dedicated channel routes, evidence drawer, sources directory, and admin monitor. |
| **API Architecture** | **READY** | REST endpoints with pagination, full-text search, filtering, and rate-limiting. |

---

## 2. Production Deployment Instructions

1. Configure environment keys: `FMP_API_KEY`, `TWELVEDATA_API_KEY`, `DATABASE_URL`.
2. Review source licensing status in `config/news-sources.yaml`.
3. In production, run the background worker via Celery/Redis or APScheduler:
   `python -m app.engine.news_ingestion.worker`
