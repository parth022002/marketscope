# Current Website Audit — MarketScope.io
**Document Reference:** `docs/design/CURRENT_WEBSITE_AUDIT.md`  
**Evaluation Date:** 21 November 2026  
**Auditor:** Senior Product Designer & UI/UX Architect  
**Platform Status:** Pre-Redesign Baseline  

---

## 1. Executive Summary

MarketScope.io was conceived as an evidence-backed, research-first financial intelligence workspace for Indian equities. While the foundational backend architecture incorporates rigorous deterministic financial formulas, cryptographic snapshot signing, and statutory DPDP Act 2023 compliance, the current frontend and user experience suffer from structural limitations that prevent it from functioning as a premier market intelligence terminal.

The current user interface is static, lacks a real-time global market pulse, contains no continuous ticker system, possesses zero news intelligence capabilities, and lacks interactive market heatmaps or macroeconomic context. This audit evaluates every existing page, identifies reusable architectural components, and diagnoses the design and functional deficiencies that necessitate a comprehensive redesign.

---

## 2. Technology Stack & Architectural Baseline

| Layer | Current Implementation | Status |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.5.29 (App Router) | Production-ready, SSR/SSG capable |
| **Styling** | Tailwind CSS + Custom CSS Variables (`globals.css`) | Functional but lacks modular design tokens |
| **Icons** | Lucide React | High quality, consistent stroke icons |
| **Authentication** | Clerk Managed OIDC (`@clerk/nextjs` 7.10.5) | Fully integrated with session & user controls |
| **Backend API** | FastAPI (Python 3.12 / 3.15) | Async, OpenAPI documented, modular routers |
| **Database** | PostgreSQL 16 (Neon Serverless) + SQLAlchemy ORM | Relational schema with multi-tenant isolation |
| **Cache & Limiter** | Redis 7 + Token Bucket Rate Limiting | Active in Docker/Render, fallbacks in dev |
| **Testing** | Pytest (27 unit/integration tests) + TypeScript typecheck | 100% passing test baseline |

---

## 3. Comprehensive Audit of Existing Pages & Routes

### 3.1 Route: `/` — Platform Overview & Landing
- **Purpose:** Serve as both the public landing page and the initial entry overview for authenticated users.
- **Current Layout:**
  - Left navigation sidebar (`.sidebar`) with basic links.
  - Topbar with system status indicators and Clerk auth buttons.
  - Hero statistics banner (Indexed Companies: 5, Golden Ratios: 15, Historical Quarters: 20).
  - Market index cards (NIFTY 50, SENSEX, NIFTY BANK) showing static price cards with basic change indicators.
  - Canonical coverage table with 5 sample companies (`RELIANCE`, `TCS`, `INFY`, `TATAMOTORS`, `TATAMTRDVR`).
- **Deficiencies:**
  - Lacks a dynamic, continuously scrolling market ticker bar.
  - Does not provide a global market perspective (no NASDAQ, S&P 500, FTSE, Nikkei, Gold, Brent Crude, USD/INR, or Bond Yields).
  - The hero section consumes excessive vertical space without providing analytical utility.
  - No market movers (top gainers, top losers, active volume, 52-week highs/lows).
  - No news highlights or geopolitical market impact alerts.

### 3.2 Route: `/company/[symbol]` — Company Dossier & Research Explorer
- **Purpose:** Comprehensive single-company deep-dive research page.
- **Current Layout:**
  - Header with company symbol, exchange badge, price, and status indicator.
  - Tab navigation: Overview, Financial Statements, Valuation Ratios, Research Notes, and AI Synthesis.
  - Tab 1 (Overview): Key ratio grid, company business summary, recent filing references.
  - Tab 2 (Financial Statements): Interactive statement explorer with Income Statement, Balance Sheet, Cash Flow, and Quarterly trends.
  - Tab 3 (Valuation Ratios): 15 canonical golden ratios grouped into Valuation, Profitability, Solvency, and Efficiency.
  - Tab 4 (Research Notes): User notes with thesis, counterpoints, and open questions.
  - Tab 5 (AI Synthesis): Grounded, citation-backed analytical synthesis with evidence drawer.
- **Strengths:**
  - Outstanding data provenance: clicking metrics opens the Evidence Drawer (`EvidenceDrawer.tsx`) showing raw MCA/BSE filing citations and exact mathematical formulas.
  - Interactive statement explorer is clean and supports period toggling (Annual vs. Quarterly).
- **Deficiencies:**
  - No interactive stock charts or historical price/volume time-series visualization.
  - Zero company-specific news or sentiment feed.
  - No corporate actions timeline (dividends, splits, board meetings, insider disclosures).
  - No shareholding pattern breakdown (Promoter, FII, DII, Public).
  - Missing peer comparison chart on the same screen.

### 3.3 Route: `/compare` — Peer Comparison Matrix
- **Purpose:** Multi-company fundamental comparison tool.
- **Current Layout:**
  - Quick-pick buttons for common peer sets (IT Majors: TCS vs INFY; Auto Majors: TATAMOTORS vs TATAMTRDVR).
  - Custom input field to add additional symbols.
  - Side-by-side comparison table across Market Cap, P/E, P/B, EV/EBITDA, ROE, ROCE, Operating Margin, Debt/Equity, and Current Ratio.
- **Deficiencies:**
  - Table is plain and lacks graphical indicators (radar charts, scatter plots, or mini-sparklines).
  - Limited to 5 seeded companies; lacks global peer benchmarking (e.g., comparing TCS/Infosys with Accenture or Cognizant).
  - No sector percentile rankings or visual leader/laggard indicators.

### 3.4 Route: `/screener` — Fundamental Screener
- **Purpose:** Quantitative stock filtering and discovery.
- **Current Layout:**
  - Preset screening filters (Quality Compounders, Low Valuation Value, Debt-Free High Return, High Margin Tech).
  - Interactive sliders and input fields for Market Cap, P/E, ROE, Debt/Equity, Operating Margin, and Free Cash Flow.
  - Results table with direct links to dossiers.
- **Deficiencies:**
  - Limited metric filter options (only 6 criteria; lacks P/B, Dividend Yield, Sales Growth, 52W High distance, RSI, Volume).
  - No Heatmap view mode (unlike TradingView or Tickertape).
  - Cannot save custom user screens to database.
  - Does not support international market universes.

### 3.5 Route: `/search` — Discover Companies
- **Purpose:** Canonical instrument resolution and lookup.
- **Current Layout:**
  - Instant search input with debounced API queries.
  - Query resolution cards distinguishing exact matches, disambiguation candidates, and search results.
- **Deficiencies:**
  - Search is strictly single-entity (equity ticker/symbol); cannot search news headlines, executive names, macroeconomic themes, commodities, currencies, or indices.
  - Results interface lacks mini-charts, current trading status, and sector grouping.

### 3.6 Route: `/watchlists` — Multi-Tenant Watchlists
- **Purpose:** User-curated portfolios of tracked instruments.
- **Current Layout:**
  - Watchlist selector and creation modal.
  - Table of tracked symbols with current price, day change, sector, and remove actions.
- **Deficiencies:**
  - Purely tabular; lacks aggregate portfolio performance metrics or market-weight charts.
  - Watchlist does not stream or update live price ticks.
  - Does not correlate watchlist holdings with breaking news or upcoming corporate earnings dates.

### 3.7 Route: `/workspace` — Workspace Settings & Privacy Governance
- **Purpose:** DPDP Act 2023 compliance dashboard, data export, and irreversible purge controls.
- **Current Layout:**
  - Statutory DPDP compliance summary box.
  - "Export All Data (JSON)" trigger for user data portability.
  - "Purge All Workspace Data" modal with strict confirmation phrase (`PURGE_ALL_DATA`).
- **Strengths:**
  - Industry-leading regulatory compliance and privacy engineering.
- **Deficiencies:**
  - Visual presentation is utilitarian; lacks user preference customization (e.g., default currency, default exchange, news frequency, theme settings).

### 3.8 Routes: `/terms`, `/privacy`, `/disclaimer` — Legal & Statutory Pages
- **Purpose:** Legal compliance, SEBI non-brokerage notices, DPDP data protection disclosures.
- **Current Layout:**
  - Clean markdown-based legal text with top branding and back navigation.
- **Strengths:**
  - Rigorous, explicit SEBI non-brokerage disclosures and statutory research disclaimers.

---

## 4. Visual Design System Audit

### 4.1 Current Color Palette
- **Backgrounds:** Primary `#07152B` (Midnight Navy), Surface `#0B1D38` (Deep Slate Navy), Border `#132B4F` (Steel Blue).
- **Accents:** Electric Blue `#087BEE`, Cyan `#16C8D5`, Emerald Green `#39E85B` (Positive), Coral Red `#F06464` (Negative), Amber `#F5A623` (Notice/Warning).
- **Typography:** System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Evaluation:** The palette is solid and conveys financial seriousness, but lacks micro-hierarchies, subtle contrast steps, and standardized design tokens for typography scales, padding grids, and border-radii.

### 4.2 Information Density & Layout Architecture
- **Desktop Density:** Moderate, but too much empty space in hero banners. Financial analysts require dense, high-utility data displays with clear visual grouping.
- **Mobile Responsiveness:** Existing sidebar collapses or wraps, but complex tables cause horizontal overflow on mobile viewports.
- **Navigation:** Fixed sidebar with 6 hardcoded links. As the platform expands into Markets, Stocks, News, Screeners, Companies, Research, Watchlists, Calendar, and Settings, the current navigation structure breaks down.

---

## 5. Architectural Assets & Reusable Components

The following components and modules are well-engineered and must be retained and elevated in the redesign:

1. **`BrandLogo.tsx`:** Standardized brand component supporting `"full"`, `"icon"`, and `"inline"` representations.
2. **`EvidenceDrawer.tsx`:** Unique competitive differentiator; provides raw source filing quotes and mathematical derivations for any financial metric.
3. **`FinancialStatementsExplorer.tsx`:** Interactive tabular component supporting multi-statement views and annual/quarterly toggling.
4. **`SnapshotModal.tsx`:** Cryptographically signed, immutable research snapshot creation.
5. **`Footer.tsx`:** Regulatory disclosures, DPDP compliance statements, and links.
6. **Backend Calculation Engine (`calculations.py`):** 15 golden ratios computed with mathematical purity and versioned metadata.
7. **DPDP Compliance Engine (`routes.py`):** Section 11/12 compliant data export and cascade purge endpoints.

---

## 6. Audit Conclusion & Redesign Imperatives

The current website serves as an operational prototype of an evidence-backed equity workspace. However, it falls significantly short of being a modern, cohesive financial market intelligence platform. The essential imperatives for the redesign are:

1. **Implement a Unified Global Ticker System:** A multi-asset continuous ticker spanning Indian indices, US/European/Asian benchmarks, key commodities, currencies, and sovereign yields.
2. **Re-architect the Information Architecture:** Implement a scalable primary navigation system (Dashboard, Markets, Stocks, News, Screeners, Companies, Research, Watchlists, Calendar, Settings).
3. **Build the News Intelligence Centre:** A structured news ingestion, entity-tagging, relevance-scoring, and market-impact analysis engine.
4. **Introduce Market Heatmaps & Visual Analytics:** Sector tree-maps and visual performance grids inspired by professional financial terminals.
5. **Expand Universe Coverage:** Elevate beyond 5 local equities to support top Indian and global blue-chip companies with clean synthetic/live provider abstraction.
