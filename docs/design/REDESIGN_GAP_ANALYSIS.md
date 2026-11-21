# Redesign Gap Analysis — MarketScope.io
**Document Reference:** `docs/design/REDESIGN_GAP_ANALYSIS.md`  
**Evaluation Date:** 21 November 2026  
**Auditor:** Senior Product Designer & UI/UX Architect  
**Platform Target:** MarketScope.io Complete Redesign  

---

## 1. Executive Summary

This Gap Analysis compares the **Current Implementation Baseline** of MarketScope.io against the **Master Redesign Requirements** inspired by VerquoAI, TradingView, and Tickertape. It details every functional, visual, and architectural capability required to transform MarketScope into a world-class financial research and market intelligence workspace.

---

## 2. Comprehensive Capability Gap Matrix

| Product Domain | Current State (Baseline) | Target State (Redesigned) | Severity / Priority | Required Action |
| :--- | :--- | :--- | :--- | :--- |
| **Global Ticker System** | Completely absent. | Continuous, responsive multi-asset ticker bar below header (Indian & Global indices, Commodities, Currencies, Yields, delayed/live badge). | **CRITICAL (P0)** | Implement `MarketTicker.tsx` component with pause-on-hover, seamless loop, and multi-asset data feeds. |
| **Information Architecture** | 6 hardcoded sidebar links (`/`, `/search`, `/compare`, `/screener`, `/watchlists`, `/workspace`). | 9 primary navigation sections: Dashboard, Markets, Stocks, News, Screeners, Companies, Research, Watchlists, Calendar + Settings. | **CRITICAL (P0)** | Build flexible application shell with collapsible sidebar, active route indicators, and mobile drawer. |
| **Market Overview Dashboard** | Basic static hero stats + 3 index cards + 5-row table. | Dynamic terminal dashboard answering "What is happening right now?": Market Snapshot, Breadth, Movers, Top Companies, Heatmap preview, News alert banner. | **CRITICAL (P0)** | Redesign `/` and `/markets` into comprehensive market intelligence hubs. |
| **Top Companies & Movers** | Static table of 5 seeded Indian stocks (`RELIANCE`, `TCS`, etc.). | Configurable Top Indian & Global Companies with categories (Most Tracked, Largest Market Cap, Movers) + dedicated Movers module (Gainers, Losers, Active, 52W). | **HIGH (P1)** | Implement modular company ranking and mover cards with real-time percentage change pills. |
| **Market Heatmaps** | Completely absent. | Interactive sector tree-maps (size by Market Cap/Volume, color by performance % change, NSE/BSE/US filters, hover tooltips). | **HIGH (P1)** | Build interactive `MarketHeatmap.tsx` SVG/Canvas tree-map component with period toggles (1D, 1W, 1M, 1Y). |
| **News Intelligence Centre** | Non-existent (zero news coverage). | Dedicated News Intelligence Centre (`/news`) covering Financial Markets, Companies, Central Banks, Geopolitics, and Sectors. | **CRITICAL (P0)** | Build `/news` hub, article cards, news filters, search, and dedicated news detail views (`/news/[id]`). |
| **News Processing Pipeline** | None. | Ingestion, validation, entity extraction, category classification, deduplication, relevance scoring, and priority assignment pipeline. | **HIGH (P1)** | Implement backend news engine with deterministic relevance weights (25% market, 20% impact, 15% source, etc.). |
| **Market Impact Transmission** | None. | Explanatory analysis connecting major macro/geopolitical events to affected commodities, currencies, sectors, and equities with transmission channels. | **HIGH (P1)** | Build impact assessment cards with confirmed vs. possible effects and source citations. |
| **Global Market Coverage** | Strictly 5 Indian equities. | Comprehensive Indian coverage (NIFTY, SENSEX, Midcap, Smallcap) + International Indices (NASDAQ, S&P 500, FTSE, DAX, Nikkei) + Commodities & FX. | **HIGH (P1)** | Expand instrument universe in seed and provider layers with clean synthetic/live provider flags. |
| **Company Research Experience** | Dossier with statements, ratios, notes, and AI synthesis. | Enhanced dossier with interactive stock chart, 5-pillar fundamental scorecard, corporate actions timeline, and related news stream. | **HIGH (P1)** | Integrate lightweight price chart, corporate actions tab, and company-specific news tab in `/company/[symbol]`. |
| **Universal Search** | Single-field ticker/company resolver only. | Unified global search supporting companies, stock symbols, indices, commodities, currencies, news articles, people, and sectors with autocomplete. | **HIGH (P1)** | Expand search engine and modal into a multi-category command palette (`SearchModal.tsx`). |
| **Calendar & Events** | Non-existent. | Economic events calendar (RBI, Fed, GDP, CPI) + Corporate earnings calendar + Corporate actions (dividends, splits). | **MEDIUM (P2)** | Build `/calendar` page with filterable dates, importance levels, and country tags. |
| **Visual Design System** | Ad-hoc CSS variables in `globals.css`. | Formalized `MARKETSCOPE_DESIGN_SYSTEM.md` with standardized color tokens, spacing grids, typography scale, and reusable UI components. | **HIGH (P1)** | Establish unified tokens and refactor components into modular UI library. |
| **Data Provenance & Disclaimers** | Strong baseline (EvidenceDrawer, SEBI disclaimers). | Preserve and enhance line-item filing citations, versioned formulas, and clear labels (Live vs Delayed vs Synthetic). | **MUST PRESERVE** | Maintain all existing calculation integrity, test coverage, and DPDP compliance. |

---

## 3. Detailed Domain Gap Analysis

### 3.1 Global Ticker System (TradingView Benchmark)
- **Current Defect:** A user arriving at MarketScope has no visual cues about whether markets are currently open or closed, how the NIFTY or S&P 500 are performing today, or what the rupee or oil are doing.
- **Required Implementation:**
  - Continuous horizontal marquee ribbon with hardware-accelerated CSS transform.
  - Indian Instruments: NIFTY 50, NIFTY Bank, NIFTY IT, NIFTY Midcap, SENSEX, BSE 500.
  - Global Benchmarks: NASDAQ 100, S&P 500, Dow Jones, FTSE 100, DAX, Nikkei 225, Hang Seng.
  - Commodities & FX: Gold (MCX & Spot), Silver, Brent Crude, WTI Crude, Natural Gas, USD/INR, EUR/INR, US 10Y Yield.
  - Item details: Symbol, latest price, absolute change, percentage change badge, market status dot (green=open, red=closed), and delayed/live badge.
  - Pause-on-hover interaction with instant click navigation to instrument view.

### 3.2 Market Overview & Analytics (TradingView & Tickertape Benchmark)
- **Current Defect:** The existing `/` page is a landing page rather than a financial dashboard. It presents static numbers that feel disconnected from current market reality.
- **Required Implementation:**
  - **Market Snapshot:** Quick-scan cards for Indian and International markets with advance/decline ratios.
  - **Market Mood Index (MMI):** Visual sentiment meter (Extreme Fear to Extreme Greed) inspired by Tickertape to gauge market extremes.
  - **Top Companies Section:** Indian giants (Reliance, HDFC Bank, ICICI, TCS, Infosys, Bharti Airtel, L&T, SBI) and Global leaders (NVIDIA, Apple, Microsoft, Alphabet, Amazon, Meta, Tesla).
  - **Market Movers Tabbed Component:** Top Gainers, Top Losers, Most Active by Volume, and 52-Week Highs/Lows with NSE/BSE/US filters.
  - **Interactive Sector Heatmaps:** Sector-level visualization showing capital concentration and daily percentage swings.

### 3.3 News Intelligence Centre (New Architectural Pillar)
- **Current Defect:** The platform has zero news capability. An investor cannot correlate price movements with earnings surprises, geopolitical conflicts, or central bank decisions.
- **Required Implementation:**
  - Dedicated `/news` portal with Breaking News ticker, Featured Market Movers, and categorical feeds (Financial Markets, Company Disclosures, Central Banks & Economy, Geopolitics, and Industry).
  - **News Card Architecture:** Headline, source badge, timestamp, geographic tag, relevance score, associated ticker badges, priority level (Critical, Breaking, High, Medium, General), and summary.
  - **Story Clustering:** Group multiple reports on the same event into one parent developing story with publisher source list.
  - **Market Impact Modeling:** Structural impact cards showing transmission channels (e.g., how an oil supply disruption moves Brent, OMCs, airlines, and inflation).
  - **Universal Search by News Entity:** Find stories by company ("Reliance"), executive ("Elon Musk"), central bank ("RBI"), or topic ("Semiconductors").

### 3.4 Company Research & Stock Discovery
- **Current Defect:** The company page has strong financial statements and 15 golden ratios, but lacks price charts, shareholding breakdowns, corporate actions, and company news.
- **Required Implementation:**
  - Embed interactive price history charts (1D, 1W, 1M, 1Y, 5Y, All) with volume bars.
  - 5-Pillar Scorecard (Valuation, Profitability, Growth, Solvency, Red Flags) on overview tab.
  - Corporate actions timeline (dividends, splits, earnings calendar).
  - Dedicated company news feed pulling real-time articles tagged with that ticker.
  - Maintain the existing **Evidence Drawer** and **Immutable Snapshots** as core differentiators.

---

## 4. Execution Sequence & Prioritization

To ensure systematic, robust progress without breaking existing functionality, the implementation is organized into structured phases:

1. **Phase 1: Architecture & Design System Documentation**
   - Finalize product architecture, user journeys, page specifications, news algorithm, and design system.
2. **Phase 2: Global Ticker & Application Navigation Shell**
   - Implement the continuous multi-asset ticker system and responsive 9-section navigation.
3. **Phase 3: Market Overview Dashboard & Top Movers**
   - Build the comprehensive market snapshot, mover tabs, and sector heatmap.
4. **Phase 4: News Intelligence Centre & Filtering Engine**
   - Implement `/news`, news card components, entity taggers, filtering controls, and impact cards.
5. **Phase 5: Company Research & Discovery Expansion**
   - Enhance `/company/[symbol]` with price charts, scorecards, and contextual news tabs.
6. **Phase 6: Verification, Testing, & Integration**
   - Run end-to-end route validations, unit test suites, and compile Next.js production builds.
