# MarketScope.io — Market Data Provider Coverage & Entitlement Matrix

**Document Reference:** MS-AUD-PROV-2026-04  
**Target:** Data Providers, Licensing Tiers, APIs & Reliability Benchmarks  
**Date:** November 22, 2026  
**Auditor:** Data Governance Specialist & Market Data Architect  

---

## 1. Provider Capabilities & Limitations Matrix

| Provider / Channel | Asset Classes | Geographic Scope | Live / Delayed | Reliability Rating | Primary Constraint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Yahoo Finance API (yfinance)** | Equities, ETFs, Indices, FX | Global (US, IN, EU, ASIA) | 15-min Delayed / EOD | **Low (Unstable)** | Aggressive HTTP 403 blocks against headless requests; rate-limited. |
| **SEC EDGAR (Direct XBRL)** | US Equities Filings (10-K, 10-Q) | United States | Static / Regulatory | **High (99.9%)** | Rate-limited to 10 req/sec; requires declared `User-Agent` header. |
| **FRED (St. Louis Fed)** | Macro Indicators, Rates, Inflation | US / Global Macro | Daily / Monthly | **Very High (99.9%)** | Macro only; no single-stock equity data. |
| **Exchange Public Feeds (NSE/BSE)** | Indian Equities, Corporate Actions | India | EOD / Delayed | **Medium (95.0%)** | Requires session cookies; periodic schema restructuring. |
| **RSS Wire Feeds (Reuters, CNBC)**| News, Corporate Announcements | Global | Real-time Stream | **High (99.0%)** | Headline + excerpt only; fair-use display terms. |
| **MarketScope Synthetic Engine** | Financial statements, DCF, Q-Score | Global Canonical Universe | Deterministic On-Demand| **Absolute (100%)** | Mathematical baseline when upstream providers degrade. |

---

## 2. Upstream Failover & Degradation Policy
When Yahoo Finance or external endpoints fail:
1. **Never return HTTP 500 or 404** for an instrument registered in the Canonical Master.
2. **Transition state** to `HISTORICAL_ONLY` or `PARTIAL_DATA_AVAILABLE`.
3. **Serve verified canonical profiles** with cached balance sheets, ratios, and risk metrics.
4. **Display data freshness timestamp** and provider status badge (`[DELAYED / CANONICAL_FALLBACK]`).
