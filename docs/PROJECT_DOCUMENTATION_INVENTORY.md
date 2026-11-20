# MarketScope.io — Project Documentation Inventory & Authority Register

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Status:** Approved Engineering Baseline — Phase 0 Discovery Complete  
**Product Name:** MarketScope.io (Official and Sole Product Name)

---

## 1. Executive Summary & Document Hierarchy

This register catalogs all uploaded specifications, design standards, brand assets, security policies, and architectural references for **MarketScope.io**.

MarketScope.io is an **India-first, research-first financial intelligence workspace**. It enables retail and institutional researchers, analysts, students, and investors to discover listed companies, inspect canonical financial statements, understand metric calculations, trace source evidence, compare peers, and capture reproducible, immutable research snapshots.

### Authoritative Document Hierarchy (Precedence Order)

Where requirements or terminology differ between documents, the following strict order of precedence applies:

1. **MarketScope.io Product Development Requirements Document (PRD) v1.0 (14 Nov 2026)**  
   *Authority: Level 1 (Supreme)* — Authoritative product scope, release milestones, functional workflows, data models, metric formulas, and acceptance criteria.
2. **MarketScope.io Security, Privacy and Safety Requirements v1.0 (14 Nov 2026)**  
   *Authority: Level 1 (Co-equal in Security Domain)* — Authoritative standard for authentication, authorization, tenant isolation, DPDP Act compliance, cryptography, and audit.
3. **MarketScope.io Brand Guidelines & Development Standards v1.0 (14 Nov 2026)**  
   *Authority: Level 2* — Visual identity, UI design tokens, color palette, logo assets, typography, and accessibility (WCAG 2.2 AA).
4. **MarketScope.io Competitive Website Analysis & Product Design Reference v1.0 (14 Nov 2026)**  
   *Authority: Level 2* — Benchmarks (Screener.in, TradingView, Zerodha, Groww, Tickertape, NSE India) and UX heuristics.
5. **MarketScope.io Website & Research Reference Register v1.0 (14 Nov 2026)**  
   *Authority: Level 3* — Regulatory references (SEBI, RBI, MCA), exchange infrastructure (NSE, BSE), and vendor API evaluation criteria.
6. **MarketScope.io System Architecture & User Journey Maps v1.0 (14 Nov 2026) [Diagrams]**  
   *Authority: Level 1 (Visual Architecture)* — Logical component boundaries, modular monolith design, and end-to-end user journeys.
7. **TradeFlow.io V8.0 Final Master Development Specification (14 Nov 2026) [Predecessor Specification]**  
   *Authority: Level 4 (Historical Predecessor / Reference Only)* — Technical predecessor. Retained for deep architectural patterns (canonical fact models, snapshot immutability, metric contracts). **Superseded** on all product naming, trading features, brokerage links, and algorithmic trading rules.
8. **TradeFlow.io Risk Disclosure Document (25 Feb 2026) [Superseded / Legacy]**  
   *Authority: Deprecated / Archived* — Pertained to algorithmic trading execution. Deprecated because MarketScope.io is strictly a read-only research platform and does not execute trades or provide financial advice.

---

## 2. Complete Document Inventory

| Document Name | File Path | Version / Date | Authority Status | Core Scope & Purpose |
|---|---|---|---|---|
| **MarketScope Product Development Requirements** | `Uploads/MarketScope_Product_Development_Requirements_v1.0.docx` | v1.0 (14 Nov 2026) | **Authoritative (PRD)** | Master product requirements, MVP definition, 20 functional modules, metric definitions, data contracts, API specifications, and sprint plans. |
| **MarketScope Security, Privacy and Safety Requirements** | `Uploads/MarketScope_Security_Privacy_and_Safety_Requirements_v1.0.docx` | v1.0 (14 Nov 2026) | **Authoritative (Security)** | Security architecture, OIDC auth, tenant isolation, database RLS, data retention, DPDP Act compliance, audit trails, and vulnerability testing. |
| **MarketScope Brand Guidelines & Development Standards** | `Uploads/MarketScope_Brand_Guidelines_and_Development_Standards.docx` | v1.0 (14 Nov 2026) | **Authoritative (Brand/UI)** | Design tokens, Midnight canvas (`#07152B`, `#0B1D38`), Blue (`#087BEE`), Cyan (`#16C8D5`), Green (`#39E85B`), Negative (`#F06464`), Inter typography, logo guidelines. |
| **MarketScope Competitive Website Analysis & Design Reference** | `Uploads/MarketScope_Competitive_Website_Analysis_and_Design_Reference_v1.0.docx` | v1.0 (14 Nov 2026) | **Authoritative (UX/Benchmarking)** | UX/UI analysis of 8 market benchmarks (Screener.in, TradingView, Groww, Zerodha, Tickertape, NSE India, Moneycontrol, VerquoAI) and design requirements. |
| **MarketScope.io Website Research Reference Register** | `Uploads/MarketScope.io_Website_Research_Reference_Register_v1.0.docx` | v1.0 (14 Nov 2026) | **Authoritative (Data Governance)** | Curated registry of regulatory, exchange, government, corporate disclosure, and vendor data sources with licensing and evaluation checklists. |
| **Logical Project Architecture Map** | `Uploads/MarketScope_Project_Architecture_v1.0.png` | v1.0 (14 Nov 2026) | **Authoritative (Architecture Map)** | High-level system design diagram: Next.js frontend, FastAPI modular monolith, PostgreSQL/Neon, Redis/Upstash, Cloudflare R2, and Gated AI. |
| **End-to-End User Journey Map** | `Uploads/MarketScope_User_Journey_v1.0.png` | v1.0 (14 Nov 2026) | **Authoritative (UX Journey)** | Complete visual user experience map: Discovery -> Disambiguation & Resolution -> Analysis & Evidence -> Save & Snapshot. |
| **Brand Identity Master Artwork** | `Uploads/Favicon.png`, `Uploads/Icon.png`, Logo screenshot | v1.0 (14 Nov 2026) | **Authoritative (Assets)** | Official app icon ('M' dynamic chart glyph) and logotype lockup banner ("MarketScope.io — FINANCIAL RESEARCH & INTELLIGENCE"). |
| **TradeFlow.io V8.0 Final Master Specification** | `Uploads/TradeFlow.io_V8.0_Final_Master_Development_Specification.docx` | v8.0 (14 Nov 2026) | **Reference Only (Predecessor)** | Predecessor architectural draft. Valuable for canonical schemas, golden test specifications, and metric lifecycle details. Superseded where conflicting. |
| **TradeFlow.io Risk Disclosure Document** | `Uploads/TradeFlow.io_Risk Disclosure_document.docx` | Legacy (25 Feb 2026) | **Archived / Deprecated** | Legacy trading disclaimer. Replaced by MarketScope's research-only, non-advisory, non-brokerage disclaimer framework. |

---

## 3. Key Requirements Extracted

### 3.1 Functional Scope (MVP 1.0)
1. **Instrument Discovery & Canonical Resolution:** Fast search across symbols, NSE/BSE tickers, company names, and ISINs. Explicit disambiguation interface for multiple listings or share classes. Never auto-guess ambiguous instruments.
2. **Company Research Dossier:** Structured overview covering corporate identity, industry/sector classification, key executives, listing metadata, and data coverage indicators.
3. **Canonical Financial Statements:** Standardized Balance Sheet, Income Statement (P&L), and Cash Flow statement supporting annual and quarterly intervals, consolidated vs. standalone views.
4. **Deterministic Metric Engine:** Documented formulas, input variables, units, reporting periods, and calculation timestamps for every ratio (e.g., P/E, EV/EBITDA, ROE, ROCE, Debt/Equity, Free Cash Flow Yield). Zero black-box calculations.
5. **Evidence Inspector & Provenance Tracking:** Point-in-time traceability linking every displayed metric to raw financial facts, filing documents, publication timestamps, retrieval methods, and source providers.
6. **Research Notes:** Workspace-isolated note-taking environment allowing researchers to attach observations, theses, and counter-evidence directly to companies, metrics, and filings.
7. **Reproducible Research Snapshots:** Immutable, cryptographically hashable snapshots freezing fact versions, formulas, and context as of a specific date, enabling reproducible research re-evaluation.
8. **Watchlists & Screener:** Workspace-scoped custom watchlists and multi-parameter quantitative filtering across fundamental metrics.
9. **Data Quality & Freshness Indicators:** Clear badges and warnings indicating data state: `VERIFIED`, `ESTIMATED`, `STALE`, `RESTRICTED`, or `SYNTHETIC_DEMO`.

### 3.2 Explicit Exclusions (Out of Scope for MVP)
- Brokerage execution or trading integrations.
- Order placement, routing, or real-time tick streaming.
- Custody or movement of customer funds.
- Automated Buy / Sell / Hold recommendations or price targets.
- Guaranteed return predictions or speculative algorithmic signals.
- Unlicensed scraping or redistribution of commercial feeds.
- Ungated or autonomous AI generation over unverified data.

### 3.3 Non-Functional & Security Requirements
- **Tenant Isolation:** Workspace-level data segregation enforced in database queries and API middleware; automated cross-tenant security regression tests.
- **Authentication & Identity:** Managed OIDC (Clerk or approved provider), secure HTTP-only cookies, automated session revocation, MFA for administrators.
- **Data Protection & Privacy:** Full compliance with the Digital Personal Data Protection (DPDP) Act; automated data retention and deletion pipelines; no personal data logged in application telemetry.
- **Audit Trails:** Append-only, tamper-resistant audit log capturing all security, workspace mutation, and entitlement events.
- **Accessibility & UX:** WCAG 2.2 AA compliance, responsive desktop/tablet layouts, tabular numerals for financial figures, distinct semantic red (`#F06464`) for losses, and never using color alone to convey status.

---

## 4. Conflict Resolution & Requirement Harmonization

1. **Product Name & Branding:**  
   *Conflict:* Predecessor documents used "TradeFlow.io".  
   *Harmonization:* The product name is universally formalized as **MarketScope.io**. All user-facing copy, code namespaces, documentation, and database schemas use MarketScope.io.
2. **Product Category & Boundaries:**  
   *Conflict:* Legacy documents mentioned algorithmic trading, SEBI Algorithmic Trading Framework, broker integrations, and crypto assets.  
   *Harmonization:* MarketScope.io is strictly a **financial research and intelligence platform**. All trading, order placement, brokerage, and advisory mechanisms are eliminated from product scope.
3. **Visual Design & Palette:**  
   *Conflict:* Early code scaffold used light-teal tones (`#167c80`, DM Sans font).  
   *Harmonization:* Reconciled strictly to the authoritative Brand Guidelines v1.0: Midnight canvas (`#07152B`, `#0B1D38`), Blue (`#087BEE`), Cyan (`#16C8D5`), Green (`#39E85B`), Negative (`#F06464`), and Inter font with tabular numerals.
4. **Data Sourcing Policy:**  
   *Conflict:* Unverified external APIs or web scraping references.  
   *Harmonization:* Strictly enforced data rights register. Development begins with an internal `MockProvider` generating realistic synthetic Indian equity fixtures. Live external feeds require formal commercial data rights review before ingestion.
