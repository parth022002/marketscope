# MarketScope.io — User Input & Provider Requirements Checklist

This document details the exact credentials, subscriptions, permissions, and configurations required from the operator or client to transition the market data infrastructure to enterprise production tier.

---

## 1. Provider Credentials Checklist

### 1. Twelve Data (Global Indices, US Equities, Commodities, Forex)
- **Current Status**: Configured with development key in `.env`.
- **Target Production Tier**: Twelve Data Pro or Enterprise Plan.
- **Required Action from Operator**:
  1. Upgrade to Twelve Data Pro tier (allows up to 800 requests/minute and WebSocket streaming).
  2. Whitelist production server IP addresses if required.
  3. Update `TWELVEDATA_API_KEY` in production environment settings.
- **Enables**: Real-time un-delayed ticks for NASDAQ, S&P 500, Brent, Gold, and global forex pairs.

### 2. Financial Modeling Prep (FMP) (Financial Statements & Fundamentals)
- **Current Status**: Configured with starter key in `.env`.
- **Target Production Tier**: FMP Professional / Enterprise Plan.
- **Required Action from Operator**:
  1. Verify active status of `FMP_API_KEY`.
  2. Confirm access to `/stable/profile`, `/api/v3/financial-statements`, and `/api/v3/ratios`.
- **Enables**: Automated quarterly and annual income statement, balance sheet, and cash flow statement ingestion.

### 3. TrueData / Licensed Indian Market Data Vendor
- **Current Status**: Missing credentials; currently operating on Twelve Data index feeds and deterministic fallback.
- **Target Production Tier**: TrueData REST + WebSocket L1 Redistribution Feed.
- **Required Action from Operator**:
  1. Complete TrueData Corporate Agreement or NSE Data & Analytics Redistribution License.
  2. Obtain `TRUEDATA_API_USER` and `TRUEDATA_API_PASSWORD`.
  3. Add credentials to backend `.env`.
- **Enables**: Real-time tick-by-tick NSE/BSE cash equities (`RELIANCE`, `TCS`, `HDFCBANK`) and real-time NIFTY/SENSEX feeds.

---

## 2. Infrastructure Configuration Checklist

| Service | Environment Variable | Recommended Production Setting | Purpose |
|---|---|---|---|
| **FastAPI Backend** | `APP_ENV` | `production` | Disables debug logs and strict error tracing. |
| **CORS Policy** | `API_CORS_ORIGINS` | `https://marketscope.io,https://app.marketscope.io` | Restricts API access to authorized domains. |
| **WebSocket Host** | `NEXT_PUBLIC_WS_HOST` | `api.marketscope.io` | Directs client browsers to the WebSocket cluster. |
| **Redis Cache** | `REDIS_URL` | `rediss://default:<pw>@<upstash/redis-host>:6379/0` | Enables shared L2 quote caching across instances. |
| **Database Pool** | `DATABASE_POOL_URL` | Neon pooled connection string | Handles serverless connection spikes. |
