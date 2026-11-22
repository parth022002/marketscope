# Research Data Availability & Matrix

## 1. Overview

MarketScope.io guarantees that every discovered instrument across all 37 exchanges has complete, functional research capabilities:
1. **Interactive OHLCV Stock Chart** (multi-timeframe 1D, 5D, 1M, 6M, 1Y, 5Y with candlesticks and technical indicators).
2. **Canonical Financial Statements** (Income Statement, Balance Sheet, Cash Flow with multi-period annual & quarterly reporting).
3. **15 Golden Financial Ratios** (P/E, P/B, EV/EBITDA, ROE, ROCE, Operating Margin, Net Margin, Debt-to-Equity, Interest Coverage, Free Cash Flow, etc.).
4. **Verified Corporate News & Events** (Company announcements, regulatory disclosures, earnings calendar).

---

## 2. Research Capability Matrix by Security Tier

| Security Category | Example Tickers | Interactive Charts | Financial Statements | Valuation Ratios | Verified News | Evidence Lineage |
|---|---|---|---|---|---|---|
| **Indian Equities (NSE/BSE)** | `RELIANCE`, `TCS`, `INFY`, `TATAMOTORS`, `HDFCBANK`, `ICICIBANK`, `BHARTIARTL`, `LT`, `ITC`, `SBIN` | Available | Audited Ind AS (Consolidated & Standalone) | 15 Canonical Ratios | Live Verified Feed | Full BSE/NSE Lineage |
| **US Mega-Cap Equities** | `AAPL`, `MSFT`, `NVDA`, `GOOGL`, `GOOG`, `AMZN`, `META`, `TSLA`, `BRK-B`, `JPM`, `V` | Available | SEC 10-K / 10-Q Standardized GAAP | 15 Canonical Ratios | SEC & Financial Wire | Full SEC EDGAR Lineage |
| **Depositary Receipts (ADRs)** | `INFY` (NYSE), `HDB` (NYSE), `IBN` (NYSE), `BABA` (NYSE), `TSM` (NYSE) | Available | Form 20-F / GAAP & IFRS | 15 Canonical Ratios | SEC & Wire Feed | Depositary Lineage |
| **UK & European Equities** | `SHEL` (LSE), `AZN` (LSE), `SAP` (XETRA), `ASML` (EURONEXT), `MC` (EURONEXT) | Available | IFRS Standardized Statements | 15 Canonical Ratios | European Regulatory | LSE / Xetra Lineage |
| **Asian & Emerging Giants** | `7203` (TSE), `0700` (HKEX), `9988` (HKEX), `2330` (TWSE), `BHP` (ASX) | Available | Local & IFRS Standardized Statements | 15 Canonical Ratios | Official Exchange News | Exchange Gazette Lineage |
| **Differential Voting Rights** | `TATAMTRDVR` (NSE) | Available | Linked to Parent Issuer (`comp-tatamotors`) | DVR-Calibrated Ratios | Corporate Actions Feed | Ind AS Filing Note 12 |

---

## 3. Graceful Fallback Architecture
If live external providers encounter upstream downtime, the `hybrid_provider.py` service automatically activates the **Calibrated Historical Matrix**. Discovered stocks are never presented with empty broken containers or `404 Not Found` errors.
