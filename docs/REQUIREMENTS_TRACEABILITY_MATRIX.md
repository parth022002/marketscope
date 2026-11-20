# MarketScope.io — Requirements Traceability Matrix (RTM)

**Document Version:** 2.0  
**Date:** 20 November 2026  
**Status:** Baseline Active  
**Authoritative Baseline:** PRD v1.0 & Security Requirements v1.0

---

## 1. Traceability Overview

This matrix maps every functional requirement, non-functional standard, and security control from the approved PRD and Security Specification to implementation modules, sprint phases, acceptance criteria, and automated verification tests.

### Traceability Codes:
- **REQ-FN-xx**: Functional Requirement
- **REQ-SEC-xx**: Security & Privacy Requirement
- **REQ-UX-xx**: Design & Usability Requirement
- **MS-xxx**: Backlog Task Identifier

---

## 2. Core Functional Requirements Traceability

| Req ID | PRD Section | Module / Capability | Backlog Ticket | Implementation Layer | Target Phase | Acceptance Criteria | Test Reference | Current Status |
|---|---|---|---|---|---|---|---|---|
| **REQ-FN-01** | §4.1, §8.1 | Company & Ticker Search | MS-005 | Web / API (`/search`) | Phase 1 (Slice) | Typeahead query by symbol, company name, ISIN. Sub-50ms response. Returns canonical candidates. | `tests/api/test_search.py` | 🟢 Complete (Phase 1) |
| **REQ-FN-02** | §4.1, §8.1 | Instrument Canonical Resolution | MS-004, MS-005 | API (`/resolve`) / DB (`instruments`) | Phase 1 (Slice) | Disambiguates ticker collisions across exchanges (NSE/BSE) or multiple classes; never auto-guesses. | `tests/api/test_resolution.py` | 🟢 Complete (Phase 1) |
| **REQ-FN-03** | §4.1, §5.1 | Company Research Dossier | MS-006 | Web (`/company/[symbol]`) / API (`/dossier`) | Phase 1 (Slice) | Displays company overview, classification, listing details, and explicit data status badges. | `tests/api/test_dossier.py` | 🟢 Complete (Phase 1) |
| **REQ-FN-04** | §4.1, §10.1 | Canonical Financial Facts | MS-007 | DB (`financial_facts`) / API | Phase 1 & 2 | Persists reporting period, currency (INR), scale, filing date, and audit/filing status. | `tests/test_phase2_phase3.py` | 🟢 Complete (Phase 2) |
| **REQ-FN-05** | §4.1, §10.2 | Deterministic Metric Engine | MS-008 | API (`app/engine/calculations.py`) | Phase 2 | Computes ratio from inputs with documented formula, period matching, and versioned formula ID. | `tests/test_phase2_phase3.py` | 🟢 Complete (Phase 2) |
| **REQ-FN-06** | §4.1, §9.0 | Evidence Inspector & Lineage | MS-009 | Web (Drawer) / API (`/evidence`) | Phase 1 (Slice) | Every metric links back to its underlying filing facts, source name, and retrieval timestamp. | `tests/api/test_evidence.py` | 🟢 Complete (Phase 1) |
| **REQ-FN-07** | §4.1, §8.3 | Workspace Research Notes | MS-010 | Web (`/notes`) / API / DB (`research_notes`) | Phase 1 (Slice) | Users can create/update notes tagged to companies, facts, and metrics. Scoped to workspace. | `tests/api/test_notes.py` | 🟢 Complete (Phase 1) |
| **REQ-FN-08** | §4.1, §8.3 | Immutable Research Snapshots | MS-011 | API / DB (`research_snapshots`) | Phase 3 | Freezes complete dossier state, formulas, and inputs as of snapshot time. Hash verified via HMAC-SHA256. | `tests/test_phase2_phase3.py` | 🟢 Complete (Phase 3) |
| **REQ-FN-09** | §12.1, §12.2 | Provider Rights & Adapter Core | MS-012 | API (`app/providers`) / DB | Phase 1 (Slice) | MockProvider cleanly decoupled via BaseProvider; machine-enforced entitlement checks. | `tests/providers/test_rights.py` | 🟢 Complete (Phase 1) |
| **REQ-FN-10** | §10.1, §10.4 | Full Financial Statements | MS-013 | Web (`FinancialStatementsExplorer`) / API | Phase 2 | Standardized Balance Sheet, P&L, Cash Flow. Annual & Quarterly, Consolidated & Standalone. | `tests/test_phase2_phase3.py` | 🟢 Complete (Phase 2) |
| **REQ-FN-11** | §11.1, §11.2 | Valuation & Risk Analytics | MS-016 | API (`app/engine/calculations.py`) | Phase 2 | Trailing P/E, EV/EBITDA, P/B, FCF yield, debt coverage, interest coverage ratios. | `tests/test_phase2_phase3.py` | 🟢 Complete (Phase 2) |
| **REQ-FN-12** | §5.1, §14.0 | Peer Comparison Workspace | MS-014 | Web (`/compare`) / API | Phase 3 | Side-by-side metric comparison across industry peers with period/basis alignment warnings. | `tests/test_phase2_phase3.py` | 🟢 Complete (Phase 3) |
| **REQ-FN-13** | §5.1, §14.0 | Watchlists & Fundamental Screener | MS-015 | Web (`/screener`, `/watchlists`) / API | Phase 3 | Multi-metric filtering (e.g. ROE > 15%, Debt/Equity < 0.5), custom columns, saved views. | `tests/test_phase2_phase3.py` | 🟢 Complete (Phase 3) |
| **REQ-FN-14** | §16.0 | Gated AI Research Synthesis | MS-022 | API (`app/services/ai_gated`) | Phase 5 (Gated) | Strict RAG synthesis with mandatory citations; abstains on insufficient evidence. | `tests/ai/test_gated_rag.py` | Gated / Future |

---

## 3. Security, Privacy & Compliance Traceability

| Req ID | Security Section | Control Category | Backlog Ticket | Implementation Mechanism | Target Phase | Verification Method | Current Status |
|---|---|---|---|---|---|---|---|
| **REQ-SEC-01**| §4.0 | Managed OIDC Authentication | MS-003 | Clerk / OIDC provider integration | Phase 1 | Token signature, issuer, expiry, and audience validation on all protected routes. | Automated Auth Suite | 🟢 Complete (Phase 1) — Clerk Core 3 SDK & routes active |
| **REQ-SEC-02**| §5.0 | Multi-Tenant Workspace Isolation | MS-003 | SQL query tenancy scoping + RLS | Phase 1 | Zero cross-tenant data leakage between workspace A and workspace B. | Cross-tenant test matrix (`test_tenancy.py`) | 🟢 Verified in Notes & Watchlists |
| **REQ-SEC-03**| §6.0 | API Request Validation & Security | MS-001 | FastAPI + Pydantic v2 schemas | Phase 1 | Strict typing, bounds checking, parameter sanitization, secure HTTP error envelopes. | Schema fuzzing tests | 🟢 Active in all routes |
| **REQ-SEC-04**| §6.1 | Rate Limiting & Throttling | MS-001 | Redis-backed sliding window rate limiter | Phase 1 | Throttles excessive endpoint requests per IP/workspace; emits standard HTTP 429. | Rate-limit load test | Architecture defined |
| **REQ-SEC-05**| §13.0 | Tamper-Resistant Audit Trail | MS-002 | PostgreSQL `audit_events` table | Phase 1 | Append-only logging of user actions, workspace mutations, and data rights checks. | Audit immutability test | Schema defined |
| **REQ-SEC-06**| §19.1 | DPDP Act Privacy & Deletion | MS-020 | Workspace & User Deletion pipelines | Phase 4 | Full cascade deletion of user notes, snapshots, and personal data upon request. | Deletion pipeline test | Requirements specified |
| **REQ-SEC-07**| §12.3 | Commercial Data Rights Enforcement | MS-012 | Provider Entitlements engine | Phase 1 | Blocks display or API export of fields if license does not explicitly grant entitlement. | Entitlement unit tests | Schema defined |

---

## 4. UI/UX & Brand Design Traceability

| Req ID | Brand / Design Section | Design Standard | Implementation Mechanism | Target Phase | Verification Method | Current Status |
|---|---|---|---|---|---|---|
| **REQ-UX-01** | Brand §4.0 | Color System & Midnight Theme | Tailwind CSS tokens: `#07152B`, `#0B1D38`, `#087BEE`, `#16C8D5`, `#39E85B` | Phase 1 | Visual inspection, CSS token audit | 🟢 Complete (Phase 1) — Midnight palette active |
| **REQ-UX-02** | Brand §4.0 | Semantic Negative Color | Red `#F06464` used for losses/negative financial changes (never brand green) | Phase 1 | Financial table UI test | 🟢 Complete — Formatted negative values in red |
| **REQ-UX-03** | Brand §5.0 | Typography & Tabular Numerals | Inter font family with CSS `font-variant-numeric: tabular-nums` | Phase 1 | Font loading & layout inspection | 🟢 Complete — `tabular-nums` on all financial tables |
| **REQ-UX-04** | Brand §7.0, Comp §7 | Experience States | Every view must support: Loading, Empty, Error, Stale Data, and Restricted states | Phase 1 | Component state regression tests | 🟢 Implemented across all 8 routes |
| **REQ-UX-05** | Brand §8.0 | Data Status Badging | Explicit badges for `VERIFIED`, `ESTIMATED`, `STALE`, `MISSING`, `SYNTHETIC_DEMO` | Phase 1 | Dossier header component test | 🟢 Active in MockProvider & UI |
| **REQ-UX-06** | Brand §8.0 | Accessibility Standards | WCAG 2.2 AA contrast compliance; color is never the sole communicator of status | Phase 1 | Axe-core accessibility audit | 🟢 Design guidelines codified |

---

## 5. Milestone Release Gates

- **Sprint 0 Gate (Phase 0):** Architecture Decision Records (ADRs) recorded, Project Documentation Inventory approved, User Input & Configuration Guide delivered, repository audited, initial database schema and mock provider mapped. **[STATUS: COMPLETE]**
- **Sprint 1 Gate (Phase 1):** First end-to-end vertical slice (Search -> Resolve -> Dossier -> Financial Fact -> Metric -> Evidence Inspector -> Save Note) functioning with synthetic fixtures. **[STATUS: COMPLETE]**
- **Sprint 2 Gate (Phase 2):** Canonical financial statements (P&L, Balance Sheet, Cash Flow), period alignment, golden calculation test suite passing with 100% determinism. **[STATUS: COMPLETE]**
- **Sprint 3 Gate (Phase 3):** Full research workspace: Watchlists, Screener, Peer Comparisons, and Immutable Snapshots with HMAC-SHA256 verification. **[STATUS: COMPLETE]**
- **Sprint 4 Gate (Phase 4):** External data provider adapters, commercial licensing clearance, data freshness monitoring, and reconciliation pipelines. **[STATUS: READY TO COMMENCE]**
- **Sprint 5 Gate (Phase 5):** Gated AI research intelligence (RAG over verified filings with mandatory citations and abstention mechanism).
- **Sprint 6 Gate (Phase 6):** Production hardening: End-to-end testing, security penetration audit, performance load tests, operational runbooks, and final launch readiness review.
