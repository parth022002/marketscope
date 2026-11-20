# MarketScope.io — Technical Decisions & Architecture Decision Records (ADRs)

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Status:** Approved Technical Baseline

---

## ADR-001: Modular Monolith Architecture over Microservices

### Context
MarketScope.io requires rapid iteration, strict data consistency, high transactional integrity, and strong multi-tenant workspace isolation. Distributed microservices introduce significant operational complexity, network latency, distributed transaction overhead, and difficult cross-service debugging.

### Decision
We adopt a **Modular Monolith** architecture for the backend application layer using Python (FastAPI). 
- All domain modules (Identity & Workspace, Instrument Registry, Financial Facts & Metrics, Evidence Lineage, Research Notes, Snapshots, and Provider Adapters) reside within a single codebase.
- Modules communicate exclusively through clean Python service interfaces and typed Pydantic contracts.
- The monorepo layout cleanly separates the frontend application (`apps/web`), backend API (`apps/api`), database migrations (`database/schema`), shared configurations (`config/`), and engineering documentation (`docs/`).

### Consequences
- **Positive:** Simplified deployments, single database transaction boundaries, zero network serialization cost between internal domain services, straightforward local development via Docker Compose or native virtualenvs.
- **Negative:** Requires disciplined code review to prevent tight cross-module coupling. Boundaries are enforced through explicit schemas and interface files.

---

## ADR-002: Frontend Experience Layer with Next.js App Router & TypeScript

### Context
The platform requires both public discovery surfaces (marketing, legal disclosures, landing) and high-performance, authenticated data-dense workspaces (dossiers, multi-period financial tables, evidence drawers, screener grids).

### Decision
We use **Next.js 15+ (App Router)** with **React 19**, **TypeScript**, and **Tailwind CSS**.
- Public pages and authenticated workspaces are separated into distinct route groups (`(public)` and `(workspace)`).
- Server Components handle initial data fetching, layout streaming, and SEO/metadata.
- Client Components handle interactive search typeahead, evidence drawers, metric drill-downs, dynamic filtering, and note-taking interfaces.
- Component styling strictly implements the **MarketScope Midnight Theme** (`#07152B`, `#0B1D38`, `#087BEE`, `#16C8D5`, `#39E85B`, `#F06464`) with the **Inter** font family and tabular numerals.

### Consequences
- High rendering performance, excellent developer ergonomics, typed end-to-end contracts, and compliance with WCAG 2.2 AA contrast standards.

---

## ADR-003: PostgreSQL (Neon) as Primary System of Record

### Context
Financial research requires ACID transactional guarantees, relational integrity, point-in-time snapshot preservation, and complex querying (joins across issuers, listings, facts, metrics, and evidence).

### Decision
We adopt **PostgreSQL 16+** (hosted on **Neon** for cloud deployments; local PostgreSQL for development and Docker).
- Database migrations are strictly version-controlled and reversible.
- JSONB columns are used selectively for semi-structured filing metadata and immutable snapshot payload freezes, while core financial facts and metric observations remain strictly normalized.
- Workspace-level multi-tenancy is enforced in all relational queries via `workspace_id` foreign keys and Row-Level Security (RLS) policies.

### Consequences
- Uncompromising data consistency, robust JSON querying capabilities, branchable database environments via Neon for staging/testing, and standard SQL tooling.

---

## ADR-004: Managed OIDC Authentication (Clerk) with Local Mock Bypass

### Context
Building custom authentication (password hashing, MFA, email verification, session rotation) from scratch is error-prone, insecure, and diverts resources from core financial intelligence features.

### Decision
We adopt **Clerk** (or an approved managed OIDC provider) for production and staging identity management.
- For local development and automated CI testing, the API includes a local authentication bypass mode (`MOCK_AUTH_ENABLED=true`) that injects a synthetic developer identity and workspace context without requiring active third-party cloud credentials.
- All protected API routes validate the OIDC bearer token (issuer, audience, signature, expiration) via FastAPI dependency injection.

### Consequences
- Enterprise-grade authentication, MFA, and session security in staging/production, while developers can build and run tests completely offline with zero credentials.

---

## ADR-005: Decoupled Provider Adapter Pattern & MockProvider First

### Context
Commercial financial data feeds from Indian exchanges and vendors (NSE, BSE, MCA, CMIE, Refinitiv) have strict licensing requirements, variable rate limits, and significant lead times for contract execution. Development must not stall waiting for external API keys.

### Decision
We implement a **Provider Adapter Interface** (`BaseProvider`) with an initial **MockProvider**.
- `MockProvider` generates realistic, high-fidelity synthetic Indian listed company data (Reliance, TCS, Infosys, etc.) with explicit `SYNTHETIC_DEMO` status tags.
- The API domain layer consumes `BaseProvider` and has zero awareness of whether data originates from synthetic fixtures or future licensed feeds.
- Live vendor integrations require formal data rights approval and will be implemented as pluggable adapters implementing `BaseProvider`.

### Consequences
- Immediate unblocked development of the full platform, zero licensing liability during initial sprints, and clean architectural decoupling.

---

## ADR-006: Deterministic Metric Engine & Canonical Financial Fact Model

### Context
Financial researchers must understand exactly how every metric (e.g., P/E ratio, ROE, Debt/Equity) was calculated. Black-box metrics or unverified third-party calculations destroy user trust.

### Decision
We separate **Raw Financial Facts** from **Calculated Metrics**:
1. `financial_facts`: Represents reported figures directly extracted from filings (e.g. Net Profit, Total Debt, Equity Share Capital) with currency, scale, reporting period, consolidated/standalone tag, and filing source.
2. `metric_definitions`: Versioned catalog storing the mathematical formula, plain-English explanation, input variable bindings, and unit of measurement.
3. `metric_observations`: Deterministically calculated values resulting from executing the metric definition over canonical facts.
4. Calculations are 100% deterministic, reproducible, and accompanied by automated golden tests.

### Consequences
- Complete transparency: clicking any metric in the UI displays its exact formula, inputs, and filing evidence lineage.

---

## ADR-007: Cryptographically Hashable Immutable Research Snapshots

### Context
Financial analysis is temporal. A researcher's thesis at a specific point in time must be verifiable against what was known then, even if company restatements or market prices change later.

### Decision
We implement **Immutable Research Snapshots**:
- A snapshot serializes the exact state of a company dossier (selected metrics, underlying facts, evidence links, user notes, and metadata) as an immutable JSON structure.
- A cryptographic SHA-256 hash is computed over the serialized payload and recorded upon creation.
- Once created, snapshots cannot be updated or overwritten; any modifications generate a new version.

### Consequences
- Guarantees research auditability and reproducibility, fulfilling a core product principle of MarketScope.io.

---

## ADR-008: Multi-Tenant Workspace Isolation & DPDP Act Compliance

### Context
Users' personal notes, custom watchlists, saved screeners, and research theses are private and confidential. India's Digital Personal Data Protection (DPDP) Act mandates strict consent, purpose limitation, and deletion rights.

### Decision
- All user-created assets (notes, watchlists, snapshots) are strictly keyed to a `workspace_id`.
- The API enforces workspace isolation at the service layer and database layer. Automated cross-tenant penetration tests verify that user A cannot view, query, or delete user B's workspace assets.
- Complete workspace deletion endpoints ensure that all associated notes, snapshots, and personal data can be permanently erased upon user request.

### Consequences
- Full privacy compliance and architectural readiness for multi-user enterprise workspaces.

---

## ADR-009: Strict Gating for AI Research Intelligence

### Context
Large Language Models (LLMs) frequently hallucinate financial figures, invent quotes, and lack source attribution when ungated.

### Decision
- **AI capabilities are strictly DISABLED** in Phase 0, Phase 1, Phase 2, and Phase 3.
- When enabled in Phase 5, AI is constrained to a **Strict Retrieval-Augmented Generation (RAG)** pipeline:
  1. AI can only answer questions using verified, retrieved company filing passages and canonical database facts.
  2. Every generated claim must carry an inline citation linking to the specific filing paragraph or table.
  3. If evidence is insufficient, contradictory, or absent, the model is instructed to explicitly abstain from answering.
  4. AI is never permitted to offer investment advice, buy/sell recommendations, or price predictions.

### Consequences
- Eliminates hallucination risks and maintains strict alignment with SEBI regulatory expectations and professional research standards.

---

## ADR-010: Standardized Visual Identity & WCAG 2.2 AA Accessibility

### Context
Financial dashboards often suffer from overwhelming visual clutter, unreadable tiny fonts, and inaccessible red/green indicators that fail colorblind users.

### Decision
- We strictly implement the **MarketScope Brand Guidelines v1.0**:
  - Background Canvas: Midnight (`#07152B`) and Dark Navy (`#0B1D38`).
  - Brand Accents: Electric Blue (`#087BEE`) and Bright Cyan (`#16C8D5`).
  - Positive Indicator: Green (`#39E85B`).
  - Negative Indicator: Semantic Coral Red (`#F06464`) — distinct from brand green and meeting contrast ratios.
  - Typography: **Inter** with tabular numerals (`font-variant-numeric: tabular-nums`) for perfect alignment in data tables.
  - Accessible State Badging: Color is never used alone; all statuses include explicit text labels (e.g. `[VERIFIED]`, `[ESTIMATED]`, `[STALE]`).

### Consequences
- A cohesive, premium, high-trust user interface that rivals institutional research terminals while remaining modern, responsive, and fully accessible.
