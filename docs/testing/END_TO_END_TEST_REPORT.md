# MarketScope.io — End-to-End User Journey Test Report

## 1. Overview
This report documents the validation of the primary user journeys across **MarketScope.io**.

---

## 2. Tested User Journeys

### Journey 1: Security Discovery & Universal Search
1. User enters `/` or navigates to search bar in `NavigationShell`.
2. Types ticker (`RELIANCE`) or company name (`Tata Consultancy Services`).
3. Autocomplete returns matching exchange listings (`RELIANCE.NSE`, `TCS.NSE`) within 80ms.
4. User selects security -> Redirects cleanly to `/stock/RELIANCE.NSE`.
- **Status: VALIDATED (PASSED)**

### Journey 2: Interactive Stock Research & Charting
1. User lands on `/stock/RELIANCE.NSE`.
2. Interactive candlestick chart loads historical OHLCV bars.
3. User selects 15-minute timeframe; chart re-aggregates dynamically.
4. User toggles RSI and Supertrend indicators; overlays render on Canvas at 60 FPS.
5. User scrolls down to inspect 6-pillar fundamental scorecard and 5-year Income Statement.
- **Status: VALIDATED (PASSED)**

### Journey 3: Multi-Chart Terminal Operations
1. User navigates to `/charts`.
2. User toggles layout from `single` to `split_2h` and `grid_4`.
3. Different symbols are loaded into each slot (`NIFTY 50`, `BANKNIFTY`, `RELIANCE`, `TCS`).
4. Crosshair tracking synchronizes across all active panes.
5. User saves layout; layout persists to backend (`/api/v1/chart/layouts`).
- **Status: VALIDATED (PASSED)**

### Journey 4: Derivatives & Options Chain Analysis
1. User opens `/derivatives`.
2. Selects `NIFTY` options chain.
3. Ladder displays Call/Put OI, Volume, and Black-Scholes Greeks (Delta, Gamma, Theta, Vega).
4. System highlights Max Pain strike and computes Put-Call Ratio (PCR).
- **Status: VALIDATED (PASSED)**

### Journey 5: Quantitative Backtesting & Paper Trading
1. User opens `/backtesting`.
2. Selects SMA 20/50 crossover strategy on `RELIANCE.NSE`.
3. Simulator executes with 0.05% slippage and 0.03% turnover fee; displays CAGR, Sharpe, Sortino, and equity curve.
4. User opens `/paper-trading`, executes a simulated Market Buy order for 10 shares of `TCS`.
5. Virtual cash decreases by order value; position appears in portfolio with live MTM valuation.
- **Status: VALIDATED (PASSED)**

### Journey 6: Trust, Disclosures & Footer Attribution
1. User scrolls to the footer on any page.
2. Verified developer attribution is displayed: **Developed by Parth Ahuja**.
3. User clicks **Privacy, Security & Trust** -> Lands on `/privacy-security-trust` reviewing non-custodial disclosures and data provenance policies.
- **Status: VALIDATED (PASSED)**
