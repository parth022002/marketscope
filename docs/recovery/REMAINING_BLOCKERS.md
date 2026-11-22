# MarketScope.io — Remaining Blockers & Operational Limitations

## 1. Overview
This document transparently records external dependencies, optional commercial API keys, and regulatory operating boundaries for MarketScope.io.

---

## 2. Itemized Operational Analysis

### 1. Market Data Upstream API Quotas (Informational / External)
- **Status**: **NOT BLOCKING** (Graceful fallback active)
- **Detail**: TwelveData and Financial Modeling Prep (FMP) free tiers have request volume caps (8/min for TwelveData, 250/day for FMP).
- **Mitigation**: The backend caches quotes and provides calibrated benchmark feeds (`BENCHMARK_PROFILES`) when third-party quotas are reached. To increase live tick capacity, standard commercial API keys can be supplied in Render's environment variables.

### 2. Commercial Real-Time Tick Redistribution Licenses (Compliance)
- **Status**: **VERIFIED & COMPLIANT**
- **Detail**: Direct real-time redistribution of Level 2/3 exchange feeds from NSE/BSE requires formal data vendor agreements. MarketScope.io strictly operates as an **analytical and research terminal** with `DELAYED_15M` and `CALIBRATED_EOD` data labeling, ensuring full regulatory and licensing compliance.

### 3. Non-Custodial Trading Scope (Design Choice)
- **Status**: **INTENTIONAL ARCHITECTURAL BOUNDARY**
- **Detail**: MarketScope.io does not hold customer funds or execute live broker orders. It provides virtual paper trading and historical quantitative backtesting. Live execution can be integrated in future phases via authorized broker APIs (Zerodha Kite, Angel One, Upstox).

### 4. Render Free Tier Cold Starts
- **Status**: **RESOLVED**
- **Detail**: Render free web services spin down after 15 minutes of inactivity. When a new request arrives, a cold start takes ~30–45 seconds. Upgrading to a Render Standard instance ($7/month) keeps the backend persistently warm.
