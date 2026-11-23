# MarketScope.io — Definitive Render Environment Variable Register

**Platform:** Render Web Service (Docker / Native Python)  
**Target Application:** FastAPI Backend Modular Monolith (`apps/api`)  
**Deployment Service:** `marketscope-api`  
**Production URL:** `https://marketscope-api.onrender.com`

---

## 1. Environment Variable Inventory & Classification

| Variable Name | Required | Secret / Public | Service / Layer | Code Reference | Value Format / Description |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `PORT` | **YES** | Render Runtime | Web Service Gateway | `Dockerfile#L32`, `L54` | Render automatically injects `PORT=10000` (service binds to `0.0.0.0:${PORT}`) |
| `APP_ENV` | **YES** | Configuration | FastAPI Runtime | `app/core/config.py#L7` | Set to `production` in Render dashboard |
| `APP_DEBUG` | **YES** | Configuration | FastAPI Runtime | `app/core/config.py#L8` | Set to `false` in production |
| `SECRET_KEY` | **YES** | **Secret** | Cryptographic Signing | `app/core/config.py#L9` | High-entropy random string (>= 32 characters) |
| `SNAPSHOT_SIGNING_SALT` | Optional | **Secret** | DPDP Compliance / Audit | `app/core/config.py#L10` | Cryptographic salt for data snapshot verification |
| `DATABASE_URL` | **YES** | **Secret** | Neon PostgreSQL Serverless | `app/core/database.py#L6` | `postgresql+psycopg://neondb_owner:npg_...aws.neon.tech/neondb?sslmode=require` |
| `DATABASE_POOL_URL` | Optional | **Secret** | Connection Pooling | `app/core/database.py#L6` | Optional PgBouncer pooler URL for high concurrency |
| `REDIS_URL` | Optional | **Secret** | L2 Quote Caching | `app/core/config.py#L15` | `redis://default:...@...render.com:6379` or Upstash Redis |
| `CORS_ORIGINS` | **YES** | Configuration | Security Middleware | `app/core/config.py#L35` | `https://marketscope.io,https://marketscope-web.vercel.app` |
| `TWELVEDATA_API_KEY` | **YES** | **Secret** | Commercial Market Feeds | `app/providers/market_data/twelvedata_provider.py` | TwelveData API Key for real-time US equities, FX, & commodities |
| `FMP_API_KEY` | **YES** | **Secret** | Financials & Fundamentals | `app/providers/market_data/fmp_provider.py` | Financial Modeling Prep API Key for balance sheets, cashflows, and ratios |
| `MOCK_AUTH_ENABLED` | **YES** | Configuration | Auth Middleware | `app/core/config.py#L17` | `false` in production |
| `CLERK_SECRET_KEY` | Optional | **Secret** | Identity Verification | `app/core/config.py#L18` | `sk_live_...` for production user authentication |
| `CLERK_PUBLISHABLE_KEY`| Optional | Configuration | Auth Verification | `app/core/config.py#L19` | `pk_live_...` |
| `AI_ENABLED` | Optional | Configuration | AI Synthesis Engine | `app/core/config.py#L26` | Default: `true` |
| `GEMINI_API_KEY` | Optional | **Secret** | Google Gemini LLM | `app/core/config.py#L29` | Gemini 2.5 Flash / Pro reasoning integration |
| `OPENROUTER_API_KEY` | Optional | **Secret** | Multi-Model Routing | `app/core/config.py#L27` | DeepSeek / Claude multi-agent inference routing |
| `GROQ_API_KEY` | Optional | **Secret** | Ultra Low-Latency LLM | `app/core/config.py#L28` | Llama-3 70B financial dossier generation |
| `SENTRY_DSN` | Optional | **Secret** | Error Telemetry | `app/main.py#L23` | Sentry DSN for backend exception tracking |

---

## 2. Render Deployment Settings Checklist

- **Environment:** Docker
- **Docker Command / Context:**
  - **Dockerfile Path:** `./Dockerfile`
  - **Docker Context Directory:** `.` (Repository root)
- **Health Check Path:** `/health`
- **Instance Type:** Starter or Standard (Web Service)
- **Auto-Deploy:** Yes (Branch: `master`)

---

## 3. Operational Verification on Render

To verify Render backend health and live data ingestion after environment variables are entered:
```bash
# 1. Probe readiness endpoint
curl -s https://marketscope-api.onrender.com/health/ready

# 2. Verify PostgreSQL live quotes database records
curl -s https://marketscope-api.onrender.com/api/v1/market/db-quotes

# 3. Trigger manual sync to database
curl -s https://marketscope-api.onrender.com/api/v1/market/sync-live
```
