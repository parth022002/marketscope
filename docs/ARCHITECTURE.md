# MarketScope.io — Logical System Architecture Specification

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Status:** Approved Architectural Blueprint  
**System Reference:** System Design Map v1.0 (`MarketScope_Project_Architecture_v1.0.png`)

---

## 1. Architectural Principles & Overview

MarketScope.io is designed as a **Modular Monolith** prioritizing transactional consistency, multi-tenant workspace isolation, source data provenance, and reproducible research artifacts. It is intentionally engineered without microservices to minimize distributed operational complexity while maintaining strict domain modularity.

```
+---------------------------------------------------------------------------------------------------+
|                                       EXPERIENCE LAYER (Next.js)                                  |
|   +---------------------------------------+   +-----------------------------------------------+   |
|   |         Public Marketing & Landing    |   |         Authenticated Research Workspace      |   |
|   | - Value Proposition & Disclosures     |   | - Company Search & Resolution                 |   |
|   | - Methodology & Metric Dictionary     |   | - Research Dossier & Financial Statements     |   |
|   | - Legal, Terms & DPDP Privacy Notices |   | - Evidence Inspector & Source Lineage         |   |
|   +---------------------------------------+   | - Peer Comparison & Screener                  |   |
|                                               | - Workspace Notes & Immutable Snapshots       |   |
|                                               +-----------------------------------------------+   |
+---------------------------------------------------------------------------------------------------+
                                                  │ HTTPS / JSON / Session JWT
                                                  ▼
+---------------------------------------------------------------------------------------------------+
|                               APPLICATION / DOMAIN LAYER (FastAPI Monolith)                       |
|   +──────────────────────────────+   +──────────────────────────────+   +─────────────────────+   |
|   | Identity, Workspace & RBAC   |   | Instrument Registry & Search |   | Provider Rights     |   |
|   | - OIDC Validation / MockAuth |   | - Canonical ID Resolution    |   | - Entitlement Rules |   |
|   | - Workspace-scoped tenancy   |   | - Ticker Collision Handling  |   | - Provider Adapters |   |
|   +──────────────────────────────+   +──────────────────────────────+   +─────────────────────+   |
|   +──────────────────────────────+   +──────────────────────────────+   +─────────────────────+   |
|   | Financial Facts & Metrics    |   | Dossier & Evidence Lineage   |   | Valuation & Risk    |   |
|   | - Canonical Balance Sheet/P&L|   | - Point-in-Time Fact Trace   |   | - P/E, EV/EBITDA    |   |
|   | - Deterministic Formula Exec |   | - Counter-Evidence Tracking  |   | - Financial Health  |   |
|   +──────────────────────────────+   +──────────────────────────────+   +─────────────────────+   |
|   +──────────────────────────────+   +──────────────────────────────+   +─────────────────────+   |
|   | Notes, Watchlists & Snapshots|   | Admin, Audit & Operations    |   | Gated AI (Phase 5)  |   |
|   | - User Research Workspace    |   | - Append-only Audit Log      |   | - Strict RAG        |   |
|   | - SHA-256 Snapshot Freezing  |   | - Rate Limits & Healthchecks |   | - Mandated Citation |   |
|   +──────────────────────────────+   +──────────────────────────────+   +─────────────────────+   |
+---------------------------------------------------------------------------------------------------+
                                                  │ Connection Pool / Redis / Storage
                                                  ▼
+---------------------------------------------------------------------------------------------------+
|                                    DATA & INFRASTRUCTURE LAYER                                     |
|   +──────────────────────────────+   +──────────────────────────────+   +─────────────────────+   |
|   | PostgreSQL 16+ (Neon)        |   | Redis (Upstash / Local)      |   | Private Storage     |   |
|   | - System of Record           |   | - Rate Limit Counters        |   | - Cloudflare R2     |   |
|   | - Normalized Facts & Metrics |   | - Cache & Deduplication      |   | - Filing PDF Blocs  |   |
|   | - Workspaces, Notes, Audits  |   | - Queue State Coordination   |   | - Snapshot Exports  |   |
|   +──────────────────────────────+   +──────────────────────────────+   +─────────────────────+   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Logical Component Breakdown

### 2.1 Web Experience Layer (`apps/web`)
- **Technology:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons.
- **Visual Design System:** MarketScope Midnight Palette (`#07152B`, `#0B1D38`, `#087BEE`, `#16C8D5`, `#39E85B`, `#F06464`), Inter font with tabular numerals.
- **Experience States:** Every UI view implements explicit Loading, Empty, Error, Stale Data, and Unauthorized states.
- **Core Route Structure:**
  - `/(public)`: Landing page, product boundary disclosures, data methodology, and sign-in.
  - `/(workspace)/search`: Interactive ticker and company search with candidate disambiguation.
  - `/(workspace)/company/[symbol]`: Comprehensive research dossier with financials and metric drilldowns.
  - `/(workspace)/company/[symbol]/evidence`: Evidence inspector drawer linking metrics to filing sources.
  - `/(workspace)/notes`: Workspace-isolated research note editor.
  - `/(workspace)/snapshots`: Immutable research snapshot viewer and historical reproduction comparison.

### 2.2 Backend Domain Layer (`apps/api`)
- **Technology:** Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0.
- **Core Modules & Boundaries:**
  - `app/api`: Clean REST routes grouped by resource (`/auth`, `/instruments`, `/dossier`, `/metrics`, `/evidence`, `/notes`, `/snapshots`).
  - `app/core`: Configuration validation (Pydantic Settings), security middlewares, CORS enforcement, and database engine lifecycle.
  - `app/domain`: Domain entities, value objects, and typed request/response schemas.
  - `app/engine`: Deterministic financial metric calculation engine and snapshot hashing service.
  - `app/providers`: Abstract `BaseProvider` interface and concrete adapters (`MockProvider` initially; vendor adapters in Phase 4).
  - `app/services`: Workspace isolation service, note repository, audit logger, and rights verification.

### 2.3 Data & Storage Layer
- **System of Record (PostgreSQL 16+):** Relational storage for all persistent entities. Relational foreign keys and workspace scoping ensure multi-tenant boundary integrity.
- **Cache & Rate Limiting (Redis / Upstash):** In-memory cache for fast ticker search queries and sliding-window rate limit counters to protect API endpoints from abuse.
- **Private Object Storage (Cloudflare R2):** S3-compatible, access-controlled bucket for source filing PDFs and generated snapshot export archives.

---

## 3. Core Data Flows

### Flow 1: Instrument Search & Canonical Resolution
1. User types query (e.g. `"TCS"`) in web search bar.
2. Web client calls `GET /api/v1/instruments/search?q=TCS`.
3. API queries instrument registry (Redis cached or PostgreSQL).
4. If exact unique match: Returns canonical instrument ID (`in-nse-tcs`).
5. If collision/ambiguous (e.g. multiple share classes or BSE vs NSE listing): Returns candidate list with explicit exchange and listing metadata. User explicitly selects listing before dossier opens.

### Flow 2: Metric Drill-Down & Evidence Lineage
1. Researcher inspects Return on Equity (`ROE = 9.8%`) on company dossier.
2. User clicks "Inspect Evidence" on the metric card.
3. API retrieves the metric definition (`roe` formula: `Net Income / Total Shareholders Equity`) and input facts from `financial_facts`.
4. API fetches `evidence_items` linking each fact to filing source, filing date, reporting period (FY2025 Consolidated), and filing document URL.
5. Web interface displays the complete derivation tree in the Evidence Inspector drawer.

### Flow 3: Immutable Snapshot Creation
1. Researcher clicks "Save Research Snapshot" on the active dossier.
2. API gathers current instrument state, selected metrics, underlying facts, evidence links, and user's research note.
3. API serializes the complete payload into deterministic canonical JSON.
4. API computes SHA-256 hash using `SNAPSHOT_SIGNING_SALT` and persists record in `research_snapshots`.
5. The snapshot is marked read-only and immutable. When reopened in the future, the recorded data is loaded exactly as it existed, allowing side-by-side comparison with current live data.

---

## 4. Trust, Security & Operational Controls
- **Zero Client-Side Authorization:** All permission checks, workspace scoping, and entitlement verifications occur server-side.
- **Provider Rights Engine:** Every financial fact is checked against the provider's active entitlements table before being returned to the client.
- **Tamper-Resistant Auditing:** All workspace modifications, note deletions, snapshot exports, and administrative actions trigger append-only records in `audit_events`.
- **Gated AI Pipeline:** Disabled by default. When enabled in Phase 5, strictly operates as a citation-enforced RAG over verified filing passages.
