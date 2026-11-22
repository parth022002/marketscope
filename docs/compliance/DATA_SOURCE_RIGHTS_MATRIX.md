# MarketScope.io — Data Source Rights & Permitted Usage Matrix

## 1. Scope & Objective
MarketScope.io aggregates financial news, economic calendars, SEC filings, and market reference data. This Rights Matrix outlines each data provider, data type, licensing tier, attribution mandate, and prohibited uses.

---

## 2. Data Provider Rights Matrix

| Provider / Feed | Data Type | Licence / Agreement | Attribution Requirement | Redistribution Permitted | Caching Policy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC EDGAR** | 10-K, 10-Q, 8-K, Form 4 Filings | US Public Domain (Government Work) | Cites "Source: SEC EDGAR" with filing link | Yes (Raw & Synthesized) | Permanent archive permitted; User-Agent header declared |
| **Yahoo Finance / Public Feeds** | Delayed Market Quotes, Historical OHLCV | Educational / Evaluation Only | "Market data is delayed at least 15 min. Educational only." | No (Raw redistribution forbidden; Derived analytical scores permitted) | Memory cache: 60s; EOD Bars: 30 days |
| **RSS Wire News (CNBC, Reuters, WSJ public feeds)** | News Headlines, Publication Timestamps, Excerpts | Fair Use / Standard Web RSS Terms | Explicit link to original publisher URL, publisher name, and timestamp | No (Full text scraping forbidden; Title + Excerpt + Outbound link only) | 30-day rolling index |
| **Federal Reserve Economic Data (FRED)** | Macroeconomic Indicators, Yield Curves, CPI, Unemployment | Public Domain (US Govt) / Free Terms | Cites "Source: Federal Reserve Bank of St. Louis" | Yes | 24-hour cache |
| **Internal Synthetic Engines** | Q-Score, Risk Metrics, Regime Classifications, Anomalies | Proprietary to MarketScope.io | "MarketScope Proprietary Analytics" | Yes (Platform users & API subscribers) | Deterministic re-computation on demand |

---

## 3. Strict Prohibitions & Protective Guardrails
1. **No Real-Time Exchange Redistribution**: MarketScope.io does not redistribute non-delayed L1/L2 real-time order books without direct exchange agreements (NYSE/Nasdaq/BSE/NSE).
2. **Delayed Data Watermark**: All unauthenticated or standard tier quotes are clearly designated: `[DELAYED 15-MIN]`.
3. **No Direct Derivative Resale**: Downstream users are prohibited from scraping MarketScope raw feeds to resell ticker feeds.
