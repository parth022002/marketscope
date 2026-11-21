# MarketScope.io — Phase 7: Market Data Configuration & Operator Guide

## 1. Environment Variables & Key Provisioning

MarketScope.io utilizes a multi-vendor fallback architecture. The table below lists all configuration options for both backend (`apps/api/.env`) and frontend (`apps/web/.env.local`).

### 1.1 Backend Configuration (`apps/api/.env`)

```ini
# Core Environment
APP_NAME="MarketScope.io API"
APP_ENV="production"                      # "development", "staging", "production"
APP_DEBUG="false"
SECRET_KEY="<strong-secret-key-min-32-chars>"
SNAPSHOT_SIGNING_SALT="<strong-salt-for-immutable-snapshots>"

# CORS Allowed Origins
API_CORS_ORIGINS="https://marketscope.io,https://app.marketscope.io"

# Database & Cache
DATABASE_URL="postgresql+psycopg://<user>:<password>@<neon-host>/neondb?sslmode=require"
DATABASE_POOL_URL="postgresql+psycopg://<user>:<password>@<neon-pooler-host>/neondb?sslmode=require"
REDIS_URL="redis://localhost:6379/0"

# Commercial Market Data Vendors
MARKET_DATA_PROVIDER="hybrid"             # "twelvedata", "fmp", "hybrid", "synthetic"
TWELVEDATA_API_KEY="<twelve-data-api-key>" # Tier 1 Global quote & FX engine
FMP_API_KEY="<fmp-api-key>"               # Tier 1 US equities & financial statements
FINANCIAL_DATA_API_KEY="<fmp-api-key>"     # Alias for FMP

# Licensed Indian Data Provider (Phase 7 Production)
TRUEDATA_REALTIME_ENABLED="false"         # Set to "true" once TrueData feed licensed
TRUEDATA_API_USER=""
TRUEDATA_API_PASSWORD=""

# AI Synthesis Providers
AI_ENABLED="true"
GEMINI_API_KEY="<google-gemini-key>"
GROQ_API_KEY="<groq-api-key>"
OPENROUTER_API_KEY="<openrouter-key>"
```

### 1.2 Frontend Configuration (`apps/web/.env.local`)

```ini
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL="https://api.marketscope.io"

# Real-Time WebSocket Streaming Host (without ws:// scheme)
NEXT_PUBLIC_WS_HOST="api.marketscope.io"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

---

## 2. Setting Up Commercial API Keys

### 2.1 Twelve Data Setup (Global Indices, Forex, US Equities)
1. Sign up at [https://twelvedata.com/](https://twelvedata.com/).
2. Obtain your API Key from the Twelve Data Dashboard.
3. Configure `TWELVEDATA_API_KEY` in `.env`.
4. Run health check verification:
   ```bash
   curl -s http://localhost:8000/api/v1/data/quality | jq .
   ```
5. Note on rate limits: Free tier provides 8 requests/minute. The MarketDataService L1 cache absorbs repeated calls within 5 seconds during active market sessions, allowing up to 100 concurrent frontend users on a single API key without rate-limit exhaustion.

### 2.2 Financial Modeling Prep (FMP) Setup (Fundamentals & US Quotes)
1. Register at [https://financialmodelingprep.com/](https://financialmodelingprep.com/).
2. Obtain the Starter or Professional API Key.
3. Set `FMP_API_KEY` in `.env`.
4. FMP powers company financial statements (`/statements`), balance sheets, ratios, and secondary quote fallback.

---

## 3. Operational Fallback & Degraded Modes

If external APIs become unreachable or quota limits are exceeded:
1. **Automatic Failover**: `MarketDataService` attempts Twelve Data first. If timeout or non-200 occurs, it automatically calls FMP.
2. **Deterministic Fallback**: If all external keys are exhausted or offline, the engine activates `FallbackDevProvider`.
3. **Truth in Labeling**:
   - Fallback items are strictly tagged with `data_status="SYNTHETIC_DEVELOPMENT"`.
   - The frontend renders an unmistakable purple `DEV` badge.
   - Closed sessions render a slate `CLOSED` or cyan `EOD` badge.
   - Under no circumstances is simulated data disguised as live exchange ticks.

---

## 4. WebSocket Gateway Operations

- Endpoint: `ws://<host>:<port>/ws/v1/market-data`
- Protocol actions:
  - `{"action": "ping"}` -> Server replies `{"type": "pong"}`
  - `{"action": "subscribe", "symbols": ["NIFTY 50", "RELIANCE"]}` -> Server subscribes socket to symbol updates.
  - `{"action": "snapshot"}` -> Server returns immediate full snapshot of monitored tickers.
- Auto-reconnect: The frontend hook `useMarketWebSocket` performs exponential backoff (1s to 15s) upon disconnection.
