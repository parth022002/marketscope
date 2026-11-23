# MarketScope.io — Page Route Functionality Matrix

This document provides a comprehensive operational matrix of all 12 primary page routes and workstations across the **MarketScope.io** platform.

| Route Path | Page Title / Component | Backend API Endpoints | Fallback Dataset | Interactivity & Controls | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` & `/overview` | Executive Overview Hub<br>`OverviewPage` | `/api/v1/market/ticker`<br>`/api/v1/market/overview`<br>`/api/v1/news/verified` | `FALLBACK_TICKERS`<br>`FALLBACK_NEWS` | Timeframe toggle (1D, 1W, 1M, 1Y, ALL), Chart crosshair, Sector breadth bars, Quick stock link | **ACTIVE & TESTED** |
| `/markets` | Global Markets Dashboard<br>`MarketsPage` | `/api/v1/market/ticker`<br>`/api/v1/market/derivatives`<br>`/api/v1/market/fixed-income`<br>`/api/v1/market/funds`<br>`/api/v1/market/commodities`<br>`/api/v1/market/currencies` | `FALLBACK_TICKERS`<br>`FALLBACK_DERIVATIVES`<br>`FALLBACK_FIXED_INCOME`<br>`FALLBACK_FUNDS`<br>`FALLBACK_COMMODITIES`<br>`FALLBACK_CURRENCIES` | 7 Category Tabs, Asset class filters, Advance/Decline breadth gauge, Real-time sorting | **ACTIVE & TESTED** |
| `/discover` | Universal Discovery & Screener<br>`DiscoverPage` | `/api/v1/instruments/search`<br>`/api/v1/instruments/all` | Local Curated Instrument Index (NSE, BSE, NASDAQ) | Live debounced search input, Market Cap filter (Large/Mid/Small), Sector dropdown, 5 Screener tabs | **ACTIVE & TESTED** |
| `/watchlists` | Multi-List Watchlist Manager<br>`WatchlistsPage` | `/api/v1/watchlists`<br>`/api/v1/watchlists/{id}/items` | `STARTER_WATCHLISTS`<br>Local Storage Persistence | Create Watchlist modal, Add Symbol popup, Delete Watchlist, Delete Item, Price change metrics | **ACTIVE & TESTED** |
| `/portfolio` | Portfolio & Risk Station<br>`PortfolioPage` | `/api/v1/portfolio`<br>`/api/v1/market/quote/{sym}` | Local Storage Portfolio State & Curated Starter Portfolio | Add Virtual Position modal (Symbol, Shares, Buy Price), Real-time P&L calculation, VaR & Beta risk meters | **ACTIVE & TESTED** |
| `/research` | Quantitative Research Engine<br>`ResearchPage` | `/api/v1/research/scorecard/{sym}`<br>`/api/v1/research/regime` | `DEFAULT_REGIME`<br>`getFallbackScorecard()` | Instant symbol switcher, Factor score radar (0-100), Valuation DCF bounds, Strengths/Risks breakdown | **ACTIVE & TESTED** |
| `/charts` | Interactive Charts Terminal<br>`ChartsTerminalPage` | `/api/v1/charts/layouts`<br>`/api/v1/market/historical/{sym}` | Built-in High-Density Historical Canvas Engine | Single, 2-Vertical, 2-Horizontal, and 4-Grid multi-chart layouts, Indicator overlay toggles, Save layout | **ACTIVE & TESTED** |
| `/intelligence` | Multi-Model AI Intelligence<br>`UnifiedIntelligencePage` | `/api/v1/research/multi-model/{sym}`<br>`/api/v1/news/intelligence` | Pre-computed institutional dossiers for Bluechips | 8 Accordion deep-dive panels, Model switcher, Confidence ratings, Regime indicators | **ACTIVE & TESTED** |
| `/alerts` | Price & Breakout Alert Centre<br>`AlertsPage` | `/api/v1/alerts`<br>`/api/v1/alerts/create` | Local Storage Alert State (`ACTIVE`, `TRIGGERED`) | Create Alert modal (Symbol, Condition, Target Price), Delete alert, Status badges | **ACTIVE & TESTED** |
| `/help` | Help Centre & Platform Guide<br>`HelpPage` | Static Documentation & Provenance Catalog | Embedded Financial Formula Engine | Global keyboard shortcut reference table, 15 Golden financial metrics glossary, Security links | **ACTIVE & TESTED** |
| `/settings` | Platform Preferences<br>`SettingsPage` | Local Preference Storage (`localStorage`) | Default Settings Schema | Dark/Light theme toggle, Default primary exchange select, Display currency select, Alert toggles | **ACTIVE & TESTED** |
| `/company/[symbol]` | Company Research Dossier<br>`CompanyDossierPage` | `/api/v1/company/{symbol}/overview`<br>`/api/v1/company/{symbol}/financials` | Universal Instrument Profile Engine | Historical financials table, Peer comparison matrix, Shareholding pattern chart, DCF calculator | **ACTIVE & TESTED** |

---

## Route Health & Rendering Verification

All routes above have been verified under three operating environments:
1. **Standard Online Mode**: Backend active, serving real-time and delayed exchange feeds.
2. **Cold-Start / High Latency Mode**: Backend spinning up; frontend gracefully surfaces loading skeletons followed by deterministic fallback data.
3. **Full Disconnect / Air-Gapped Mode**: Frontend network requests abort cleanly after 7,000ms; UI remains fully responsive and navigable without white-screen or script crashes.
