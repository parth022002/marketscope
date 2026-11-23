# MarketScope.io — Master Environment Variable & Secret Register

This document serves as the authoritative, single-source-of-truth register for all runtime environment variables, secrets, and connection strings across MarketScope.io's distributed architecture:
- **Frontend:** Vercel Edge Cloud
- **Backend:** Render Managed Web Services
- **Database:** Neon Serverless PostgreSQL
- **Cache:** Redis In-Memory Store

---

## 1. Quick Setup Reference

### Vercel (Frontend Project Settings)
```env
NEXT_PUBLIC_API_BASE_URL=https://marketscope-api.onrender.com
NEXT_PUBLIC_APP_URL=https://marketscope.io
NEXT_PUBLIC_APP_NAME=MarketScope.io
NEXT_PUBLIC_WS_HOST=marketscope-api.onrender.com
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_DEVELOPER_NAME=Parth
NEXT_PUBLIC_CONTACT_EMAIL=support@marketscope.io
```

### Render (Backend Web Service Settings)
```env
APP_ENV=production
APP_DEBUG=false
PORT=10000
SECRET_KEY=marketscope_production_master_secret_key_minimum_32_characters_123456
SNAPSHOT_SIGNING_SALT=marketscope_snapshot_signing_salt_production
DATABASE_URL=postgresql+psycopg://neondb_owner:npg_ec0Ak5JqHUGR@ep-young-waterfall-bitep0rn.c-5.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
CORS_ORIGINS=https://marketscope.io,https://www.marketscope.io,https://marketscope-web.vercel.app
TWELVEDATA_API_KEY=33327d6b467444618dd21e99671f0a3c
FMP_API_KEY=s8nLoZs9t2xAj9zG2c1Yif1CFVq0y5eM
MOCK_AUTH_ENABLED=false
AI_ENABLED=true
```

---

## 2. Comprehensive Variable Matrix

| Scope | Variable | Purpose | Classification | Default Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | `NEXT_PUBLIC_API_BASE_URL` | Directs client REST and WebSocket requests to FastAPI | Public Config | `http://localhost:8000` |
| **Frontend** | `NEXT_PUBLIC_APP_URL` | Canonical URL for metadata and OpenGraph social cards | Public Config | `https://marketscope.io` |
| **Frontend** | `NEXT_PUBLIC_WS_HOST` | Hostname for streaming WebSocket connections | Public Config | Derived from API Base |
| **Frontend** | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key for Clerk browser login components | Public Config | Optional in mock mode |
| **Frontend** | `CLERK_SECRET_KEY` | Server-side Clerk token verification | Secret | None |
| **Backend** | `DATABASE_URL` | Primary connection string for Neon Serverless PostgreSQL | **Critical Secret** | None (fails to in-memory SQLite if unset) |
| **Backend** | `REDIS_URL` | L2 distributed cache for quotes and session tokens | Secret | `redis://localhost:6379/0` |
| **Backend** | `SECRET_KEY` | Cryptographic secret for session signing and auth | **Critical Secret** | Generated mock |
| **Backend** | `CORS_ORIGINS` | Comma-delimited list of allowed origin domains | Security Config | Localhost and production domains |
| **Backend** | `TWELVEDATA_API_KEY` | Commercial market feed key for international equities | **Secret** | Available in `.env` |
| **Backend** | `FMP_API_KEY` | Financial Modeling Prep fundamentals key | **Secret** | Available in `.env` |
| **Backend** | `GEMINI_API_KEY` | Google Gemini AI synthesis and research assistant | **Secret** | Optional |
| **Backend** | `SENTRY_DSN` | Telemetry for backend exception capturing | Secret | Disabled if omitted |

---

## 3. Secret Management & Compliance Guardrails

1. **No Committed Secrets:** Repository `.gitignore` strictly blocks all variations of `.env`, `.env.local`, `.env.production`, and credential bundles.
2. **Key Rotation Protocol:** In the event of an API key rotation, update Render's environment dashboard first, then trigger a manual reload (`curl -s -X POST https://api.render.com/v1/services/.../deploys`).
3. **Database Security:** Always enforce `sslmode=require` when communicating with Neon PostgreSQL across cloud providers.
