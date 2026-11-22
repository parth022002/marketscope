# MarketScope.io — Environment Configuration Audit

## 1. Executive Summary

A comprehensive, end-to-end environment variable, secrets management, and cloud deployment configuration audit was conducted for the **MarketScope.io** platform. The system operates across a distributed architecture:
- **Frontend Web Application:** Deployed on **Vercel** (`marketscope-web.vercel.app`), powered by Next.js 15.2 (App Router & React 19).
- **Backend Core API Engine:** Deployed on **Render** (`marketscope-api.onrender.com`), powered by FastAPI 0.115, Uvicorn, and Python 3.11.
- **Relational Database:** Serverless PostgreSQL 18.7 hosted on **Neon** (`ep-young-waterfall-bitep0rn.c-5.ap-southeast-1.aws.neon.tech`).
- **Distributed Cache & Streaming:** Redis / Upstash with automatic in-memory fallback.

Every environment variable across `.env`, `.env.example`, `.env.local`, `.env.production`, `render.yaml`, `vercel.json`, and the codebase was scanned, categorized, and cross-referenced with live service integrations.

---

## 2. Audit Scope & Methodology

The audit inspected:
1. **Repository Configuration Files:**
   - `.env`, `.env.example`, `.env.production`, `.env.development.example`, `.env.production.example`, `.env.test.example`
   - `apps/api/.env`, `apps/web/.env.local`, `apps/web/.env.production`
   - `render.yaml`, `vercel.json`, `apps/web/Dockerfile`
2. **Codebase Access Patterns:**
   - Python Backend: `os.getenv`, `os.environ`, and `pydantic-settings` / `core.config.Settings`
   - TypeScript Frontend: `process.env.NEXT_PUBLIC_*` and server-side `process.env.*`
3. **Live Network Probes:**
   - Active TCP/HTTP/SSL handshake verification against Neon Postgres, Clerk, TwelveData, FMP, Groq Cloud, OpenRouter AI, and Google Gemini.

---

## 3. High-Level Audit Findings

| Category | Finding | Severity | Resolution / Status |
| :--- | :--- | :--- | :--- |
| **CORS Cross-Origin** | Render backend allowed only `*.onrender.com` regex; frontend requests from `*.vercel.app` encountered preflight CORS rejections. | **High** | **Resolved:** Updated `allow_origin_regex` in `apps/api/app/main.py` to `r"^https:\/\/.*(\.onrender\.com\|\.vercel\.app)$"`. |
| **Secret in Dockerfile** | `apps/web/Dockerfile` contained hardcoded `CLERK_SECRET_KEY="sk_test_..."` in `ENV`. | **Critical** | **Resolved:** Replaced hardcoded secret with `ARG CLERK_SECRET_KEY="sk_test_placeholder_for_build"`. |
| **FMP Rate Limits** | Financial Modeling Prep API key returned HTTP 429 (`Limit Reach`). | **Medium** | **Handled:** Canonical fallback engine activated; TwelveData designated as primary quote provider. |
| **Redis Offline** | Local Redis instance offline on `localhost:6379`. | **Low** | **Handled:** In-memory quote cache and in-process fallback activated automatically. |
| **Clerk Test Mode** | Clerk instance `ins_3MM9kPdA3x9kKbFM0GFURAnAjw0` is running in development/test mode. | **Info** | **Documented:** Recommended transition to `pk_live_` and `sk_live_` for production launch. |

---

## 4. Master Categorization Overview

All variables are mapped into 18 distinct architectural categories:
1. Application Core & Runtime Metadata
2. Networking, Routing & CORS
3. Database (PostgreSQL 16+ / Neon Serverless)
4. Cache & PubSub (Redis / Upstash)
5. Authentication & Identity (Clerk)
6. Primary Financial Market Data (Twelve Data)
7. Secondary Financial Data (Financial Modeling Prep - FMP)
8. Alternative / Institutional Data Providers (Licence Pending)
9. AI Synthesis — Groq Cloud (LLaMA-3.3 70B Versatile)
10. AI Synthesis — Google Gemini (Flash / Pro)
11. AI Synthesis — OpenRouter AI Gateway
12. Worldwide News & Sentiment Intelligence
13. Global Macroeconomic & Economic Calendar
14. Multi-Factor Quantitative Engine (Q-Intelligence)
15. Frontend Client Exposure (`NEXT_PUBLIC_*`)
16. Observability, Logging & Error Tracking
17. Security, Rate Limiting & Auditing
18. Deployment Target Specific Configuration

---

## 5. Automated Validation Endpoint

An administrative diagnostic endpoint was deployed at:
`GET /api/v1/admin/config-diagnostics`

This endpoint:
- Evaluates system configuration against the 18 categories.
- Returns comprehensive telemetry and status without exposing raw credentials.
- Masks all sensitive keys (e.g. `sk_t...uKNT`).
- Integrates directly into the Web Admin Dashboard at `/admin` under the **Environment & Cloud Deployments** tab.
