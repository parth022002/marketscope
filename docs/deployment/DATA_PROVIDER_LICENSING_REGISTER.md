# MarketScope.io — Data Provider Licensing & Entitlements Register

## 1. Overview & Regulatory Compliance

MarketScope.io aggregates, processes, and displays financial quotes, macroeconomic metrics, corporate fundamentals, regulatory filings, and market news. Each upstream provider carries specific licensing tiers, redistribution restrictions, attribution mandates, and API rate limits.

---

## 2. Upstream Data Provider Matrix

| Provider | Data Domain | Current Tier | Redistribution Rights | Mandatory Attribution / Disclaimer |
| :--- | :--- | :--- | :--- | :--- |
| **Twelve Data** | Real-time & intraday equity, forex, crypto quotes | Verified API Tier (8 req/min) | Display-only; non-exclusive; internal analytical usage | "Market data provided by Twelve Data. Delayed by 15 mins where required." |
| **Financial Modeling Prep (FMP)** | Financial statements, balance sheets, ratios | Free / Starter Tier (HTTP 429 encountered) | End-user viewing only; raw bulk redistribution prohibited | "Financial metrics powered by Financial Modeling Prep." |
| **SEC EDGAR** | US 10-K, 10-Q, 8-K regulatory filings | Public Domain (US Gov) | Full public access; must supply declared User-Agent | User-Agent: `MarketScope.io admin@marketscope.io` |
| **FRED (St. Louis Fed)** | US Treasury yields, inflation, GDP macro series | Open Access (API Key) | Non-commercial & commercial research permitted | "Data source: Federal Reserve Bank of St. Louis." |
| **Open-Meteo** | Weather & environmental commodity indices | Free Open Source (CC BY 4.0) | Permissive open data | "Weather data by Open-Meteo.com." |
| **RSS Financial Feeds** | Real-time global financial news headlines | Open RSS / Fair Use | Headlines & snippets with direct canonical links | Direct outbound link to original publisher required. |

---

## 3. Commercial Upgrades Required for Scale

To support unconstrained enterprise multi-user trading or sub-second live streaming:

1. **Twelve Data Commercial Stream Tier:**
   - Upgrade from 8 req/min free plan to **Grow** ($79/mo) or **Pro** ($199/mo) plan for WebSocket streaming and 55+ concurrent symbols.
2. **Financial Modeling Prep Professional:**
   - Upgrade from Free tier to **Starter** ($19/mo) or **Professional** ($49/mo) to eliminate HTTP 429 rate limit errors and unlock 30 years of historical statements.
3. **Institutional Feeds (Alpha Vantage / Finnhub / Polygon.io):**
   - Retain connectors in `apps/api/app/core/environment_validator.py` under `LICENCE_PENDING` status.
   - Activate upon contractual execution of exchange redistribute licensing (NASDAQ, NYSE, LSE).

---

## 4. User-Facing Disclaimers & Legal Notice

MarketScope.io enforces the following disclaimer across the application footer and research views:
> **Regulatory Disclaimer:** *MarketScope.io is a financial research and decision intelligence tool. It does not provide personalized investment advice, brokerage services, or portfolio management. Past performance does not guarantee future results. All quantitative scores, factor weights, and algorithmic ratings are generated for informational and educational purposes only.*
