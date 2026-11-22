# MarketScope.io — New Information Architecture Specification

## 1. Executive Summary
The MarketScope.io Information Architecture has been restructured to enforce clean progressive disclosure. The previous 18-item flat sidebar has been replaced by an 8-item primary desktop navigation, off-loading secondary features into contextual hub landing pages, sub-tabs, and a unified `Cmd+K` command palette.

---

## 2. Navigation Hierarchy

```
[Global Header]
  ├── Brand Logo
  ├── Global Search Bar (with Cmd+K trigger)
  ├── Real-time Session Status Pill (NSE/BSE Active / Market Closed)
  ├── Quick Chart Shortcut
  ├── Theme Switcher (Dark / Light)
  └── Clerk Authentication (Sign In / UserButton)

[Primary Fixed Sidebar (Non-Scrollable, 256px / 72px)]
  ├── 1. Overview (/) ── Executive Market Intelligence Dashboard
  ├── 2. Markets (/markets) ── Indian & Global Multi-Asset Hub
  ├── 3. Discover (/discover) ── Screener Hub, ETFs, IPOs, Volume Outliers
  ├── 4. Watchlists (/watchlists) ── Multi-Watchlist Workspace
  ├── 5. Portfolio (/portfolio) ── Virtual Desk & Risk Analytics
  ├── 6. Research (/research) ── Company Dossier & Financial Statements
  ├── 7. Charts (/charts) ── TradingView Lightweight Charts Pro Workspace
  │
  ├── [Intelligence Segment]
  └── 8. AI Research (/intelligence) ── Unified Multi-Model Intelligence
  │
  └── [Bottom Segment]
        ├── Alerts (/alerts) ── Price & Technical Indicator Trigger Center
        ├── Help & Docs (/help) ── Platform Guide, Shortcuts & Glossary
        ├── Settings (/settings) ── Theme, Currency & Market Preferences
        └── Workspace (/workspace) ── User Profile & Research Snapshots
```

---

## 3. Secondary Navigation Mappings

- **Markets**: Sub-views for Indian Benchmarks (NIFTY, SENSEX, BANKNIFTY), Global Equities (NASDAQ, NYSE), Commodities (Gold, Brent Crude), Currencies (USD/INR), and Sector Heatmap.
- **Discover**: Integrated tabs for Stock Screener, ETF Screener, Mutual Funds, IPO Center, and Unusual Volume.
- **Research**: Direct links to individual Company Research Dossiers (`/company/[symbol]`), Financial Statement Explorers, and Peer Comparisons (`/compare`).
- **Charts**: Top toolbar switcher for 18 indicators, 5 chart series types, multi-timeframe resolution (1m to 1Y), and vector drawing tools.
