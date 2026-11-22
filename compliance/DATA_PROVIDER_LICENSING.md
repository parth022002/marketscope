# MarketScope.io — Data Provider & Financial Information Licensing Register

## 1. Compliance Principles for Financial Information

Financial market data is subject to strict exchange proprietary rights and intellectual property terms. MarketScope.io adheres to the following principles:
1. **Explicit Data Freshness & Provenance**: Every quote, index value, and OHLC candle must carry an explicit status tag (`LIVE`, `DELAYED_15M`, `CALIBRATED_EOD`).
2. **Zero Synthetic Disguise**: Development or fallback calibrated data must never be deceptively labeled as real-time market data.
3. **No Unauthorized Scraping**: MarketScope.io does not perform automated scraping of authenticated exchange member portals.
4. **Non-Custodial Research Boundary**: All data is displayed strictly for educational, analytical, and research decision support with zero real order execution.

---

## 2. Comprehensive Data Source Register

| Data Source / Provider | Market / Data Category | Commercial Use | Redistribution Rights | Licensing Status | Attribution Requirement |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **National Stock Exchange (NSE)** | Indian Equities & Indices | Limited / Delayed | 15-Min Delayed Only | `EXCHANGE_LICENCE_REQUIRED` (Real-Time) / `FREE_WITH_RESTRICTIONS` (Delayed) | "Data delayed 15 minutes. Source: NSE India." |
| **BSE Limited (BSE)** | Indian Equities & SENSEX | Limited / Delayed | 15-Min Delayed Only | `EXCHANGE_LICENCE_REQUIRED` (Real-Time) / `FREE_WITH_RESTRICTIONS` (Delayed) | "Data delayed 15 minutes. Source: BSE India." |
| **Multi Commodity Exchange (MCX)** | Gold & Silver Bullion | Limited / Delayed | Delayed Spot Reference | `EXCHANGE_LICENCE_REQUIRED` (Real-Time) / `FREE_WITH_RESTRICTIONS` (Delayed) | "Bullion quotes referenced for spot research." |
| **Federal Reserve Bank (FRED)** | US Macroeconomic Metrics | Yes | Public Data Terms | `FREE_WITH_ATTRIBUTION` | "Source: Federal Reserve Bank of St. Louis (FRED)." |
| **Reserve Bank of India (RBI)** | Sovereign Yields & Policy Rates | Yes | Public Official Release | `FREE_PUBLIC_USE_VERIFIED` | "Official reference data from Reserve Bank of India." |
| **SEBI / MCA Filings** | Corporate Disclosures & Financials | Yes | Public Regulatory Filing | `FREE_PUBLIC_USE_VERIFIED` | "Audited ratios calculated directly from statutory filings." |
| **Yahoo Finance API (yfinance)** | Global Equities & Forex | Non-Commercial Only | Research / Development | `FREE_NONCOMMERCIAL_ONLY` / `COMMERCIAL_SUBSCRIPTION_REQUIRED` | "Quotes delayed. For commercial redistribution, vendor licensing is required." |
| **CCIL (Clearing Corp of India)** | Money Market & G-Sec Rates | Informational | Public Domain Releases | `FREE_PUBLIC_USE_VERIFIED` | "Benchmark yields compiled from public CCIL disclosures." |
| **World Bank Open Data** | Global GDP & Inflation | Yes | Open Data Terms | `FREE_WITH_ATTRIBUTION` | "World Bank Open Data." |

---

## 3. Transition Plan to Commercial Enterprise Data Feeds

To transition from non-commercial/delayed feeds to enterprise commercial real-time data dissemination:
1. **Exchange Level Agreements**: Obtain official Data Vendor Agreements with NSE Data & Analytics Ltd and BSE Data Services.
2. **Authorized Data Vendor Gateway**: Integrate licensed enterprise market-data feeds (e.g. Refinitiv, Bloomberg B-PIPE, FactSet, or TruData/GlobalDataFeeds in India).
3. **Pluggable Architecture**: MarketScope.io's `MarketDataService` uses an abstract adapter architecture (`BaseMarketDataProvider`), allowing enterprise vendor APIs to be activated via environment variables with zero frontend code changes.
