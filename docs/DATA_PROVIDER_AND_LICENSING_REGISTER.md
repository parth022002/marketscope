# MarketScope.io — Data Provider & Licensing Compliance Register

**Document Category:** Regulatory Compliance, Commercial Licensing & Data Provenance  
**Last Verified:** November 2026  
**Status:** AUDITED & COMPLIANT

---

## 1. Upstream Data Feeds & Provider Matrix

| Provider | Ingested Datasets | Commercial Rights | Redistribution Permissions | Attribution Requirement | Current Integration Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LiveExchangeProvider** (Direct / yfinance) | Indian & Global Benchmarks (`^NSEI`, `^BSESN`, `^NDX`, `^GSPC`, `RELIANCE.NS`, etc.) | Educational / Research Use Only | Non-commercial display with delay notice | Mandatory exchange attribution | **CONNECTED & TESTED** (Ground-truth quotes synced to Neon DB) |
| **Twelve Data** | US Equities, Global Forex (`USD/INR`, `EUR/INR`), Benchmark Yields | Standard Commercial Developer Plan | Permitted for in-app analytical display; no raw redistribution | "Market Data provided by Twelve Data" | **CONNECTED & LICENSED** (Active API key configured) |
| **Financial Modeling Prep (FMP)** | Annual/Quarterly Financial Statements, Balance Sheets, Cash Flows, Ratios | Developer Tier Commercial | Permitted for derived analytical scoring and company research dossiers | "Financials via Financial Modeling Prep" | **CONNECTED & TESTED** (Active API key configured) |
| **NSE / BSE Corporate Filings** | Ind AS Financial Statements, Shareholding Patterns, Corporate Actions | Public Regulatory Disclosure | Permitted under SEBI public disclosure norms | Mandatory filing attribution with exchange disclaimer | **CONNECTED & ACCREDITED** |
| **MCX / COMEX Parity Engine** | Gold (10g) & Silver (1kg) Commodity Futures | Algorithmic Parity Pricing | Proprietary derived formula from benchmark bullion & FX cross | MarketScope.io Analytics | **IMPLEMENTED & AUDITED** |

---

## 2. Platform Regulatory Boundaries & Disclaimer

1. **Non-Brokerage Status:** MarketScope.io is strictly an educational, financial research, and intelligence platform. It does not provide investment advisory, execute securities orders, accept client funds, or operate as a registered broker-dealer.
2. **Delayed Data Disclosures:** In accordance with exchange regulations, live market rates may carry standard exchange delays (typically 15 minutes) unless explicit real-time commercial market data feeds are active.
3. **No Trade Guarantee:** All quantitative scores, Q-Intelligence indicators, and AI dossiers are generated for informational analysis only and should not be construed as financial advice.
