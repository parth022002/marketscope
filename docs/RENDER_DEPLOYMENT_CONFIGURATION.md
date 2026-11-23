# MarketScope.io — Render Deployment Configuration

**Platform:** Render Cloud Infrastructure  
**Target:** Backend Microservice (`marketscope-api`)  
**Runtime:** Docker Multi-Stage Container  
**Host Binding:** `0.0.0.0`  
**Container Port:** `10000` (Injected via `${PORT}`)  

---

## 1. Web Service Specifications

| Configuration Field | Target Value | Notes |
| :--- | :--- | :--- |
| **Service Type** | Web Service | Long-running asynchronous ASGI process |
| **Environment** | `Docker` | Containerized build ensures identical runtime dependencies |
| **Root Directory** | `.` (Root) | Context includes `apps/api/` and shared files |
| **Dockerfile Path** | `./Dockerfile` | Multi-stage production container build |
| **Instance Type** | Starter or Standard | 1+ CPU, 1GB+ RAM recommended for background ingestion |
| **Health Check Path** | `/api/v1/health` | Monitored by Render to guarantee zero-downtime rolling deploys |
| **Auto-Deploy** | `Yes` | Triggered automatically on push to `master` branch |

---

## 2. Environment Variables Register for Render

Configure these under **Render Dashboard → Web Service (`marketscope-api`) → Environment**:

| Variable Name | Required | Recommended Production Value | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | **YES** | `10000` | Port injected by Render; backend binds to `0.0.0.0:${PORT}`. |
| `APP_ENV` | **YES** | `production` | Production environment flag. |
| `APP_DEBUG` | **YES** | `false` | Disables debug stack traces on HTTP exceptions. |
| `SECRET_KEY` | **YES** | `marketscope_production_master_secret_key_minimum_32_characters_123456` | Master cryptographic key for session tokens and signatures. |
| `SNAPSHOT_SIGNING_SALT` | **YES** | `marketscope_snapshot_signing_salt_production` | Cryptographic salt for data export signing. |
| `DATABASE_URL` | **YES** | `postgresql+psycopg://neondb_owner:npg_ec0Ak5JqHUGR@ep-young-waterfall-bitep0rn.c-5.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` | Neon Serverless PostgreSQL connection URL. |
| `CORS_ORIGINS` | **YES** | `https://marketscope.io,https://www.marketscope.io,https://marketscope-web.vercel.app` | Whitelist of permitted frontend domains. |
| `TWELVEDATA_API_KEY` | **YES** | `33327d6b467444618dd21e99671f0a3c` | TwelveData API credential for live exchange feeds. |
| `FMP_API_KEY` | **YES** | `s8nLoZs9t2xAj9zG2c1Yif1CFVq0y5eM` | Financial Modeling Prep credential for audited financial statements. |
| `MOCK_AUTH_ENABLED` | No | `false` | Enforces production authentication token verification. |
| `AI_ENABLED` | No | `true` | Enables AI research copilot backend endpoints. |
| `GEMINI_API_KEY` | No | `[Your Google Gemini API Key]` | For Google Gemini AI research engine. |
| `OPENROUTER_API_KEY` | No | `[Your OpenRouter API Key]` | Fallback LLM provider for conversational financial reasoning. |
| `REDIS_URL` | No | `redis://...` | Optional Redis URL for high-frequency price caching. |

---

## 3. Deployment Health Verification

After deployment, confirm backend operational status:
```bash
curl -I https://marketscope-api.onrender.com/api/v1/health
```
Expected response:
```http
HTTP/2 200
content-type: application/json
{
  "status": "healthy",
  "version": "2.0.0",
  "database": "connected"
}
```
