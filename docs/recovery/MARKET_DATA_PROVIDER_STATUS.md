# MarketScope.io — Market Data Provider Operational Status

## 1. Provider Operational Matrix

| Provider | Purpose | Authentication | Rate Limits | Coverage | Commercial Redistribution | Operational Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TwelveData** | Global Equities, Forex, Crypto | API Key via `TWELVEDATA_API_KEY` | Tiered (8/min free; 800/min paid) | US, EU, Major Global Equities, Currencies | Standard SaaS display rights | **CONFIGURED & ACTIVE** (with graceful fallback) |
| **Financial Modeling Prep (FMP)** | Fundamentals, Balance Sheets, Ratios | API Key via `FMP_API_KEY` | 250 requests/day (Free) | US & Global Corporate Financials | Permitted with attribution | **CONFIGURED & ACTIVE** (with local cache) |
| **NSE / BSE Calibrated Gateway** | Indian Benchmark Indices & Top 100 Equities | Internal Engine | High throughput (<1ms latency) | Nifty 50, Sensex, Bank Nifty, Top Indian Equities | Open educational/analytical use | **OPERATIONAL & VALIDATED** |
| **yfinance / Yahoo Finance** | Secondary historical fallback | Public wrapper | Unofficial / Rate limited | Broad global coverage | Non-commercial educational research only | **STANDBY FALLBACK** |

---

## 2. Failover Strategy
When external third-party API keys are missing or rate limits are reached:
1. The engine logs a telemetry warning without crashing.
2. The system serves calibrated historical benchmarks (`BENCHMARK_PROFILES`) flagged explicitly as `DELAYED_15M` or `CALIBRATED_EOD`.
3. The user interface displays a transparent data freshness disclosure pill (`DELAYED 15M` / `HISTORICAL`).
