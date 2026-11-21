# Redesign Page Specifications — MarketScope.io
**Document Reference:** `docs/design/REDESIGN_PAGE_SPECIFICATIONS.md`  
**Version:** 2.0 (Complete System Redesign)  
**Date:** 21 November 2026  
**Auditor:** Senior Product Designer & UI/UX Architect  

---

## 1. Overview & Architectural Standards

This document establishes the UI/UX specifications, component hierarchies, data dependencies, and interaction models for every page across the redesigned **MarketScope.io** platform. All pages inherit the **Midnight Financial Terminal** design system (`#07152B` / `#0B1D38`), 1px structural borders (`#132B4F`), tabular numerical alignment, and continuous visibility of the **Global Multi-Asset Ticker**.

---

## 2. Specification: Dashboard (`/` or `/dashboard`)

### 2.1 Purpose & User Goal
The primary landing hub for authenticated users answering the core question: **"What is happening in financial markets right now?"** Combines real-time market pulse, market breadth, top corporate leaders, market movers, breaking news wire, and personal watchlist highlights.

### 2.2 Wireframe Hierarchy
```
+----------------------------------------------------------------------------------------------------+
|  Top Bar: Brand Logo | Global Search Command Palette | Market Status | User Profile               |
+----------------------------------------------------------------------------------------------------+
|  Global Multi-Asset Ticker: NIFTY | SENSEX | NASDAQ | S&P500 | BRENT | GOLD | USD/INR | US 10Y     |
+----------------------------------------------------------------------------------------------------+
|  Breaking News Wire: [BREAKING] RBI Keeps Repo Rate Unchanged at 6.50%; Stance Neutral           |
+----------------------------------------------------------------------------------------------------+
|  MAIN GRID:                                                                                        |
|  [Left Column - 65% Width]                         | [Right Column - 35% Width]                    |
|  - Market Snapshot & Macro Breadth                  | - Market Sentiment & Mood Gauge (MMI)         |
|  - Top Indian & Global Companies (Grid / Cards)    | - Market Movers (Gainers, Losers, Active)     |
|  - Sector Performance Mini-Heatmap                 | - Quick Watchlist Watcher                     |
|  - Recent Research Dossier Activity                | - Upcoming Calendar Events (Earnings/Macro)   |
+----------------------------------------------------------------------------------------------------+
|  Footer: Regulatory Disclaimers | DPDP Act Statement | Lineage Links                               |
+----------------------------------------------------------------------------------------------------+
```

### 2.3 Modules & Interactive Elements
1. **Market Snapshot:** Quick-scan cards for NIFTY 50, SENSEX, NIFTY Bank, NASDAQ 100, and S&P 500 with absolute points, percentage change tags, and mini 1D sparklines.
2. **Market Breadth Indicator:** Advance/Decline ratio bar (e.g., 34 Advances / 16 Declines in NIFTY 50), total market turnover volume, and NSE/BSE operating status pill.
3. **Top Companies Section:** Indian leaders (Reliance, HDFC Bank, ICICI Bank, TCS, Infosys, Bharti Airtel, L&T, SBI) and Global leaders (NVIDIA, Apple, Microsoft, Alphabet, Amazon). Toggle between "Most Tracked", "Largest Market Cap", and "Active Today".
4. **Market Movers Tabs:** Instant 1-click tab switching between **Top Gainers**, **Top Losers**, **Most Active (Volume)**, and **52-Week Highs/Lows**.
5. **Breaking News Marquee:** Highlights stories flagged as `Breaking` or `Critical` with direct links to story cluster views.

---

## 3. Specification: Markets Hub (`/markets`)

### 3.1 Purpose & User Goal
Comprehensive multi-asset intelligence center enabling users to drill down into domestic Indian indices, international benchmarks, physical commodities, foreign exchange pairs, and sovereign bond yields.

### 3.2 Layout & Sections
1. **Index Matrix:**
   - **Indian Equities:** NIFTY 50, NIFTY Next 50, NIFTY Bank, NIFTY IT, NIFTY Midcap 100, NIFTY Smallcap 100, SENSEX, BSE 100, BSE 500, BSE Bankex.
   - **US & Global Benchmarks:** NASDAQ Composite, NASDAQ 100, S&P 500, Dow Jones, Russell 2000, FTSE 100 (UK), DAX (Germany), CAC 40 (France), Nikkei 225 (Japan), Hang Seng (Hong Kong).
2. **Commodities & Energy:**
   - International & MCX quotes: Brent Crude, WTI Crude, Gold Spot, Gold MCX, Silver, Natural Gas, Copper, Aluminium.
3. **Currencies & Sovereign Yields:**
   - USD/INR, EUR/INR, GBP/INR, JPY/INR, EUR/USD, GBP/USD, US Dollar Index (DXY), US 10-Year Treasury Yield, US 2-Year Treasury Yield, India 10-Year G-Sec Yield.
4. **Interactive Sector Heatmap:**
   - Full-width SVG/Canvas tree-map grouping equities by sector (Financial Services, IT, Oil & Gas, Automobile, Healthcare, FMCG). Tile size scaled by Market Capitalization; tile color gradient scaled by daily percentage change (+3% Emerald Green to -3% Crimson Red). Filterable by NSE, BSE, or US indices.

---

## 4. Specification: Stocks Discovery (`/stocks`)

### 4.1 Purpose & User Goal
Equities discovery directory designed to help users identify leading companies, emerging sector movers, and trending market ideas.

### 4.2 Layout & Sections
1. **Trending Equities:** Fast-moving companies based on trading volume spikes, news mentions, and earnings disclosures.
2. **52-Week Extreme Radar:** Companies trading within 3% of their 52-week highs (breakout candidates) and 52-week lows (potential value opportunities).
3. **Sector Breakdown Cards:** Sector-by-sector cards displaying daily average performance, market weight, leading stock, and lagging stock.
4. **Exchange Filtering:** Seamless toggle buttons for **NSE**, **BSE**, and **US Markets**.

---

## 5. Specification: News Intelligence Centre (`/news`) & Detail (`/news/[id]`)

### 5.1 Purpose & User Goal
Structured news aggregation, entity-tagging, relevance-scoring, and market-impact analysis system. Connects global geopolitical and economic developments directly to affected tickers and sectors.

### 5.2 Layout & Components (`/news`)
1. **Breaking News Marquee:** Instant visual indicator for fast-breaking macroeconomic shocks and policy decisions.
2. **Multi-Faceted News Filters:** Filter by Category (Financial Markets, Company News, Central Banks, Geopolitics, Sector-specific), Country/Region (India, US, Europe, Asia), Priority (Breaking, Critical, High, General), and Publication Date Range.
3. **Universal News Search Bar:** Instant entity-aware search by company ("Reliance"), executive ("Jerome Powell"), country ("India"), or topic ("Semiconductors").
4. **News Article Card Architecture:**
   - Priority Tag (Breaking, Critical, High Importance).
   - Publisher badge & verified publication timestamp.
   - Headline and 2-sentence executive summary.
   - Ticker tags (e.g. `$RELIANCE`, `$BRENT`, `$USDINR`) linking directly to dossiers.
   - Relevance Score badge (e.g., `Relevance: 94/100 · High Market Impact`).
   - Publisher source count (e.g., "Corroborated across 3 sources: Reuters, Bloomberg, Mint").

### 5.3 News Detail Page (`/news/[id]`)
- Full headline, publisher attribution, and original article link.
- **Key Facts Bulletins:** 3–4 bulleted verified facts.
- **Market Impact Analysis Card:**
  - Potentially affected companies, commodities, currencies, and sectors.
  - Transmission Channel Explanation (e.g., "Rising crude prices increase input costs for OMCs while putting depreciation pressure on the Indian Rupee").
  - Confirmed impacts distinguished from speculative implications.
- **Corroborating Sources:** List of all publishers covering the event with timestamps.

---

## 6. Specification: Fundamental Screener (`/screener`)

### 6.1 Purpose & User Goal
Quantitative fundamental screening tool enabling investors to filter stocks across canonical financial criteria.

### 6.2 Pre-Built Thematic Presets
- **Quality Compounders:** ROE > 18%, ROCE > 20%, Debt/Equity < 0.5, 3Y Sales Growth > 12%.
- **Low-Valuation Value:** P/E < 18, P/B < 2.5, Dividend Yield > 2.0%, Positive Free Cash Flow.
- **Debt-Free Growth:** Total Debt = 0, Operating Margin > 15%, Revenue Growth > 15%.
- **High-Margin Tech:** Operating Margin > 22%, ROE > 20%, Cash / Assets > 25%.

### 6.3 Interactive Metric Sliders & Table
- Range sliders for Market Cap, P/E, P/B, ROE, ROCE, Debt/Equity, Operating Margin, Current Ratio, and Free Cash Flow.
- Dynamic table with sortable columns, CSV/JSON export buttons, and a **"Switch to Heatmap View"** button.

---

## 7. Specification: Company Research Dossier (`/company/[symbol]`)

### 7.1 Purpose & User Goal
The core deep-dive research vehicle combining market price history, 5-pillar fundamental scorecards, canonical financial statements, deterministic golden ratios, Evidence Drawer verification, corporate actions, and company news.

### 7.2 Tab Architecture
1. **Overview Tab:**
   - Interactive price chart (1D, 1W, 1M, 1Y, 5Y, Max) with volume bars.
   - 5-Pillar Scorecard (Valuation, Profitability, Growth, Solvency, Red Flags).
   - Core metrics: Market Cap, Enterprise Value, P/E, P/B, EV/EBITDA, Dividend Yield.
   - Company description, sector, ISIN, listing exchange, and data status badge.
2. **Financial Statements Tab:**
   - Tabular explorer supporting Income Statement, Balance Sheet, and Cash Flow.
   - Annual vs. Quarterly period toggles with common-size percentages.
3. **Valuation & Golden Ratios Tab:**
   - 15 canonical golden ratios grouped into Valuation, Profitability, Solvency, and Efficiency.
   - Every single metric is clickable to open the **Evidence Drawer**.
4. **Corporate Actions & News Tab:**
   - Historical dividend announcements, stock splits, bonus issues, board meetings.
   - Real-time filtered news stream mentioning the specific company ticker.
5. **Research Notes & Snapshots Tab:**
   - Personal investment thesis, counterpoints, and open research questions.
   - Cryptographically signed (SHA-256) immutable snapshot capture button.
6. **AI Research Synthesis Tab:**
   - Grounded multi-perspective synthesis with thesis stress-testing and downside risk exposure mapping.

---

## 8. Specification: Peer Comparison (`/compare`)

### 8.1 Purpose & User Goal
Side-by-side benchmarking of direct industry competitors across valuation multiples, capital efficiency, and leverage.

### 8.2 Layout & Components
- Symbol adder input with instant autocomplete.
- Quick peer sets (e.g., IT Majors: TCS vs. INFY; Automobile: TATAMOTORS vs. M&M; Banking: HDFCBANK vs. ICICIBANK).
- Comprehensive comparison table comparing 15 golden ratios.
- Visual valuation radar chart comparing P/E, P/B, ROE, ROCE, and Operating Margins.

---

## 9. Specification: Watchlists (`/watchlists`)

### 9.1 Purpose & User Goal
Personalized multi-tenant portfolio monitoring with real-time price updates and contextual news alerts.

### 9.2 Layout & Components
- Watchlist switcher dropdown and "Create Watchlist" modal.
- Active holdings table with live price, day change, 52W range progress bar, and 1-click dossier navigation.
- Portfolio aggregate metrics (Average P/E, Average ROE, Sector Allocation breakdown pie/bar).
- Contextual News Feed: Only shows news articles tagged with instruments currently saved in the active watchlist.

---

## 10. Specification: Calendar & Events (`/calendar`)

### 10.1 Purpose & User Goal
Forward-looking schedule of market-moving macroeconomic events and corporate actions.

### 10.2 Layout & Components
- Filter by Event Type: **Macroeconomic Indicators** (RBI Policy, Fed Rate Decision, GDP, CPI Inflation), **Corporate Earnings** (Q1, Q2, Q3, Q4 financial results), and **Corporate Actions** (Dividends, Splits, AGMs).
- Filter by Country: India, United States, Global.
- Importance Level indicator: High (Red), Medium (Amber), Low (Blue).
- Date picker and weekly calendar view.

---

## 11. Specification: Workspace & Privacy (`/workspace`) & Settings (`/settings`)

### 11.1 Purpose & User Goal
Empower users with complete data ownership under the Digital Personal Data Protection (DPDP) Act 2023 and configure personalized terminal preferences.

### 11.2 Capabilities
- **DPDP Section 11/12 Dashboard:** Displays active tenant ID, notes count, snapshot count, and watchlist count.
- **Data Portability:** Instant 1-click JSON package export containing all user research notes, watchlists, and snapshots.
- **Right to Erasure (Permanent Purge):** Safeguarded irreversible deletion requiring exact confirmation phrase `PURGE_ALL_DATA`.
- **User Preferences:** Select default currency (INR ₹ / USD $), default exchange (NSE / BSE / NASDAQ), ticker auto-scroll speed, and notification frequencies.
