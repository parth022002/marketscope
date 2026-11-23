# MarketScope.io — Known Data Coverage & Upstream API Limitations

## Executive Summary

To maintain institutional compliance and complete transparency regarding financial data provenance, this document outlines the operational boundaries, rate limitations, and provider coverage characteristics across the **MarketScope.io** platform.

---

## 1. Upstream Provider Landscape & Rate Limits

| Provider / Feed | Asset Class Covered | Delay / Freshness | Known Upstream Limitations | Fallback Protocol |
| :--- | :--- | :--- | :--- | :--- |
| **Yahoo Finance API (yfinance)** | Global Equities, Forex, Commodities | 15-minute delay | Anti-scraping HTTP 403 blocks triggered during high-frequency parallel requests. | 90s Circuit-Breaker redirects to `FallbackDevProvider` in < 1ms. |
| **National Stock Exchange (NSE)** | Indian Equities & Indices | 15-minute delayed gateway | Off-market hours (weekends and evenings) report closing session prices. | Serves last verified official closing session quotes. |
| **Reserve Bank of India (RBI)** | Sovereign Yields & Money Market | End-of-Day (EOD) verified | Updated once daily at close of business. | `FALLBACK_FIXED_INCOME` benchmark quotes. |
| **Association of Mutual Funds in India (AMFI)**| Indian Mutual Funds | Daily NAV (EOD) | NAVs updated after 9:00 PM IST on trading days. | `FALLBACK_FUNDS` curated historical NAV matrix. |

---

## 2. Data Provenance & Freshness Badging

1. **Delayed Market Feeds**: In accordance with exchange licensing requirements, public exchange feeds are delayed by 15 minutes during active market sessions. All related UI cards prominently display the `DELAYED 15M` badge.
2. **End-of-Day (EOD) Datasets**: Financial statement metrics (Balance Sheets, Income Statements, Cash Flow Statements) and regulatory filings are refreshed upon official disclosure and audited quarterly.
3. **No Financial Advisory Liability**: MarketScope.io is an analytical research and intelligence platform. Data presented is for informational and educational purposes only and does not constitute SEBI/SEC-registered investment advice.

---

## 3. Coverage Boundaries by Asset Class

### 3.1 Equities
- Complete financial dossiers, valuations, and quantitative scorecards are supported for all top 500 Indian equities (Nifty 50, Nifty Next 50, Nifty Midcap 150) and top US equities (S&P 500, Nasdaq 100).
- Micro-cap stocks with market capitalizations under ₹100 Crore ($12M) may display limited fundamental ratios due to regulatory reporting exemptions.

### 3.2 Derivatives & Options Chains
- Active options Greeks, PCR, and Straddle implied volatilities are computed for high-liquidity index contracts (`NIFTY`, `BANKNIFTY`, `FINNIFTY`) and active stock futures. Illiquid deep out-of-the-money strikes are excluded to prevent distorted volatility surfaces.
