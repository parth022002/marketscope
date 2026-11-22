# MarketScope.io — Missing & Pending API Keys Report

## 1. Overview

This report identifies all required vs. optional third-party API credentials, their current configuration status, observed rate limit constraints, and explicit instructions on how to acquire production or commercial access.

---

## 2. API Key Status Summary

| Service / Provider | Environment Variable | Status | Tier / Constraint | Impact if Missing / Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| **Twelve Data** | `TWELVEDATA_API_KEY` | **CONFIGURED & VALIDATED** | Active (8 req/min) | Core market quote streaming. Verified working. |
| **Financial Modeling Prep** | `FMP_API_KEY` | **CONFIGURED (HTTP 429)** | Free Tier Rate Limit Reached | Fundamental ratios fallback to canonical multi-factor engine. |
| **Groq Cloud** | `GROQ_API_KEY` | **CONFIGURED & VALIDATED** | Active (LLaMA-3.3 70B) | High-speed analyst synthesis. Verified working. |
| **Google Gemini** | `GEMINI_API_KEY` | **CONFIGURED & VALIDATED** | Active (Gemini 1.5 Flash) | Multimodal financial reasoning. Verified working. |
| **OpenRouter AI** | `OPENROUTER_API_KEY` | **CONFIGURED & VALIDATED** | Active | Multi-model redundant failover. Verified working. |
| **Clerk Identity** | `CLERK_SECRET_KEY` | **CONFIGURED & VALIDATED** | Development Mode | User authentication active. Requires Live keys for prod. |
| **Neon PostgreSQL** | `DATABASE_URL` | **CONFIGURED & VALIDATED** | Serverless Tier | Relational persistence. Direct SSL connection verified. |
| **Redis / Upstash** | `REDIS_URL` | **OPTIONAL (OFFLINE)** | Local 6379 Offline | In-memory quote cache transparent fallback active. |
| **NewsAPI / GNews** | `NEWS_API_KEY` | **OPTIONAL / MISSING** | None configured | RSS feed financial crawler provides worldwide headlines. |
| **FRED (Fed Economic)** | `FRED_API_KEY` | **OPTIONAL / MISSING** | None configured | Macro yield curve uses canonical benchmark tables. |
| **Alpha Vantage** | `ALPHA_VANTAGE_API_KEY` | **LICENCE PENDING** | Optional institutional | Twelve Data and internal indicator engines fulfill data. |
| **Finnhub** | `FINNHUB_API_KEY` | **LICENCE PENDING** | Optional institutional | Alternative data tier. No user-facing breakage. |
| **Polygon.io** | `POLYGON_API_KEY` | **LICENCE PENDING** | Optional institutional | US high-frequency feeds. No user-facing breakage. |
| **Sentry** | `SENTRY_DSN` | **OPTIONAL / MISSING** | None configured | Python standard logging outputs to Render stdout. |

---

## 3. How to Acquire & Upgrade Required Keys

### A. Financial Modeling Prep (FMP) Upgrade
- **Issue:** Key `s8nLoZs9...` returns HTTP 429 (`Limit Reach`).
- **Acquisition URL:** `https://site.financialmodelingprep.com/developer/docs/pricing`
- **Recommended Tier:** Starter ($19/mo) or Professional ($49/mo) for commercial fundamentals API.
- **Action:**
  1. Register for an upgraded FMP subscription.
  2. Copy the upgraded API key.
  3. Update `FMP_API_KEY` in Render Environment Variables.

### B. Clerk Identity Production Live Keys
- **Issue:** Currently utilizing `pk_test_...` and `sk_test_...`.
- **Acquisition URL:** `https://dashboard.clerk.com`
- **Action:**
  1. Navigate to your Clerk application settings.
  2. Switch the environment toggle from **Development** to **Production**.
  3. Copy `pk_live_...` and `sk_live_...`.
  4. In Vercel Project Settings, add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
  5. In Render Web Service Environment, add `CLERK_SECRET_KEY`.

### C. Cloud Redis / Upstash (Optional Performance Boost)
- **Issue:** Local `localhost:6379` is offline.
- **Acquisition URL:** `https://upstash.com/` (Serverless Redis)
- **Action:**
  1. Create a free Upstash Redis database in region `ap-southeast-1` (same as Neon).
  2. Copy the `rediss://default:...@...upstash.io:6379` connection string.
  3. Set `REDIS_URL` in Render Environment Variables.

### D. FRED Federal Reserve Economic Data (Optional Macro Data)
- **Acquisition URL:** `https://fred.stlouisfed.org/docs/api/api_key.html`
- **Cost:** Free.
- **Action:**
  1. Create a free account at St. Louis Fed.
  2. Request an API key.
  3. Set `FRED_API_KEY` in Render Environment Variables.
