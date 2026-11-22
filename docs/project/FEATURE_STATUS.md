# MarketScope.io — Feature Status Register

| Module / Page | Route | Backend API | Status | Provenance & Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Landing & Overview** | `/` | `GET /api/v1/market-overview` | Complete | Market pulse, index summary, top gainers/losers. |
| **Advanced Charting Terminal** | `/charts` | `GET /api/v1/chart/layouts`, `GET /api/v1/chart/bars` | Complete | Multi-chart terminal (1x, 2H, 2V, 4-grid), 14 indicators, layout persistence. |
| **Stock Detail & Deep Dive** | `/stock/[symbol]` | `GET /api/v1/instruments/{id}`, `GET /api/v1/company/{id}/dossier` | Complete | Unified stock hub with interactive chart, scorecard, statements, peer table. |
| **Universal Stock Screener** | `/screener` | `POST /api/v1/screener/query` | Complete | Filter by exchange, cap, P/E, P/B, Div Yield, RSI, 52W high breakout; CSV export. |
| **Derivatives & Options Chain** | `/derivatives` | `GET /api/v1/derivatives/options-chain`, `GET /api/v1/derivatives/futures-buildup` | Complete | Options ladder with Black-Scholes Greeks (Delta, Gamma, Theta, Vega), PCR, Max Pain. |
| **Market Intelligence & Flow** | `/market-intelligence` | `GET /api/v1/market-flow/pulse` | Complete | Advance/decline breadth, sector performance, Mansfield Relative Strength vs NIFTY. |
| **Strategy Backtesting** | `/backtesting` | `POST /api/v1/backtest/run` | Complete | Zero-lookahead simulator with SMA/EMA crossover, RSI mean reversion, Sharpe/Sortino/MDD. |
| **Virtual Paper Trading** | `/paper-trading` | `GET/POST /api/v1/paper-trading/*` | Complete | ₹10,00,000 cash account, simulated market/limit order fills, MTM portfolio revaluation. |
| **Verified Financial News** | `/news` | `GET /api/v1/news`, `GET /api/v1/news/{id}` | Complete | Verified financial news, primary sources, market impact scores, zero hallucination. |
| **Watchlists** | `/watchlist` | `GET/POST /api/v1/watchlist/*` | Complete | Multi-watchlist management, price alerts, real-time change tracking. |
| **Portfolio Analytics** | `/portfolio` | `GET/POST /api/v1/portfolio/*` | Complete | Holding tracking, asset allocation, sector exposure, dividend calendar. |
| **Sector Performance** | `/sectors` | `GET /api/v1/sectors` | Complete | 11 GICS sectors & Indian sectoral indices, momentum and breadth heatmap. |
| **Earnings Calendar** | `/earnings` | `GET /api/v1/earnings` | Complete | Upcoming earnings reports, consensus EPS, surprise tracking. |
| **IPO Center** | `/ipo` | `GET /api/v1/ipo` | Complete | Upcoming, active, and recently listed IPOs with GMP tracking and subscription status. |
| **Global Markets** | `/global-markets` | `GET /api/v1/global-markets` | Complete | Major world indices (US, Europe, Asia), FX rates, commodities (Gold, Crude, Silver). |
| **Economic Calendar** | `/economic-calendar` | `GET /api/v1/economic-calendar` | Complete | Global macroeconomic releases (CPI, GDP, Interest Rates, PMI) with impact tiers. |
| **Privacy, Security & Trust**| `/privacy-security-trust` | N/A (Static verified content) | Complete | Transparent disclosures, non-custodial boundaries, data provenance rules. |
| **User Settings & Profile** | `/settings` | `GET/PUT /api/v1/user/settings` | Complete | Theme toggles (dark/light), default exchange preference, currency selector. |
