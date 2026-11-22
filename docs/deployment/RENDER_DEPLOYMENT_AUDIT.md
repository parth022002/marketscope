# MarketScope.io — Render Deployment Audit

## 1. Overview & Architecture

The MarketScope.io backend is hosted on **Render** (`marketscope-api.onrender.com`), packaged as a high-performance Python ASGI web service.

- **Deployment Platform:** Render (Docker Web Service)
- **Core Framework:** FastAPI 0.115 + Starlette + Uvicorn
- **Python Version:** 3.11.11
- **Service Name:** `marketscope-api`
- **Instance Region:** Singapore (`sin` / `ap-southeast-1` — colocated with Neon DB)

---

## 2. Infrastructure Configuration (`render.yaml`)

The deployment specification in `render.yaml` was audited:

```yaml
services:
  - type: web
    name: marketscope-api
    env: python
    region: singapore
    plan: starter
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2"
    healthCheckPath: /health/ready
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
      - key: DATABASE_URL
        sync: false
      - key: TWELVEDATA_API_KEY
        sync: false
      - key: GROQ_API_KEY
        sync: false
```

### Key Audit Points & Remediations:
1. **Health Check Probing:**
   - Render monitors `/health/ready` every 15 seconds.
   - Endpoint verifies database connectivity and engine status before traffic routing.
2. **Port Binding:**
   - Render automatically assigns the `$PORT` environment variable (typically `10000`).
   - The Uvicorn start command dynamically binds to `--port $PORT`, eliminating port binding mismatches.
3. **CORS Regex Fix:**
   - Previously, FastAPI allowed only `r"^https:\/\/.*\.onrender\.com$"`.
   - Updated to `r"^https:\/\/.*(\.onrender\.com|\.vercel\.app)$"` to permit browser requests from Vercel deployments.

---

## 3. Required Render Environment Variables

To ensure 100% operational integrity on Render, the following variables must be configured in **Render Service Dashboard $\rightarrow$ Environment**:

| Variable | Type | Value / Configuration |
| :--- | :--- | :--- |
| `APP_ENV` | Text | `production` |
| `APP_DEBUG` | Text | `false` |
| `PORT` | Text | `10000` (Render default) |
| `SECRET_KEY` | Secret | Strong random 64-char key |
| `SNAPSHOT_SIGNING_SALT` | Secret | Strong random cryptographic salt |
| `DATABASE_URL` | Secret | `postgresql+psycopg://user:pass@ep-young-waterfall...neon.tech/marketscope_db?sslmode=require` |
| `REDIS_URL` | Secret | Upstash Redis connection string (or leave empty for in-memory fallback) |
| `CLERK_SECRET_KEY` | Secret | `sk_test_...` or `sk_live_...` |
| `TWELVEDATA_API_KEY` | Secret | Verified TwelveData API Key |
| `FMP_API_KEY` | Secret | Upgraded FMP API Key |
| `GROQ_API_KEY` | Secret | Verified Groq Cloud API Key (`gsk_...`) |
| `GEMINI_API_KEY` | Secret | Verified Gemini API Key |
| `OPENROUTER_API_KEY` | Secret | Verified OpenRouter API Key |
| `CORS_ORIGINS` | Text | `https://marketscope-web.vercel.app,https://marketscope.io` |
| `ADMIN_KEY` | Secret | Cryptographic bearer token for admin diagnostics |
