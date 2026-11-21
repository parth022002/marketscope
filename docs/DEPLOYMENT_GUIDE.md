# MarketScope.io — Cloud Deployment & Operations Guide

**Document Version:** 2.0  
**Current Date:** 21 November 2026  
**Status:** Ready for Cloud Deployment (Vercel & Render)  
**Target Environments:** Vercel (Frontend), Render (Backend API), Neon Serverless PostgreSQL (Singapore)

---

## 1. Architecture Overview

MarketScope.io is structured as a decoupled production architecture:
1. **Frontend (Vercel):** Next.js 15 App Router deployed on Vercel Edge/Serverless platform.
2. **Backend API (Render):** FastAPI modular monolith containerized via multi-stage Dockerfile (`apps/api/Dockerfile`) deployed on Render (AWS Singapore region: `ap-southeast-1` to match Neon DB latency).
3. **Database (Neon Serverless PostgreSQL):** Managed PostgreSQL 18.7 instance running in AWS Singapore.
4. **Authentication (Clerk):** Managed Clerk OIDC instance (`MarketScope` app).
5. **AI Synthesis (Groq & Gemini):** Gated server-side research synthesis with fallback.

---

## 2. Deploying Backend API to Render

You can deploy the backend using Render's Blueprint (`render.yaml`) or as an individual Docker Web Service.

### Option A: Via Render Blueprint (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `https://github.com/parth022002/marketscope.git`.
4. Render will parse [`render.yaml`](../render.yaml) automatically and detect `marketscope-api`.
5. Enter the required environment variable values (see below).
6. Click **Apply**.

### Option B: As a Manual Web Service
1. Click **New +** > **Web Service**.
2. Select repository `parth022002/marketscope`.
3. Set **Runtime** to `Docker`.
4. Set **Root Directory** to `apps/api`.
5. Set **Region** to `Singapore (Southeast Asia)`.
6. Set **Instance Type** to `Starter` or `Standard`.
7. Set **Health Check Path** to `/health`.
8. Add the following **Environment Variables**:

| Variable Name | Value / Description |
|---|---|
| `PORT` | `8000` |
| `APP_ENV` | `production` |
| `APP_NAME` | `MarketScope.io API` |
| `APP_DEBUG` | `false` |
| `API_CORS_ORIGINS` | `https://<your-vercel-domain>.vercel.app,https://marketscope.io` |
| `DATABASE_URL` | Neon direct connection string (`postgresql+psycopg://...`) |
| `DATABASE_POOL_URL` | Neon pooled connection string (`postgresql+psycopg://...-pooler...`) |
| `SECRET_KEY` | Long random 32+ character string |
| `SNAPSHOT_SIGNING_SALT` | Random string for HMAC-SHA256 checksums |
| `MOCK_AUTH_ENABLED` | `false` |
| `CLERK_SECRET_KEY` | `sk_test_...` (from Clerk Dashboard) |
| `CLERK_PUBLISHABLE_KEY`| `pk_test_...` (from Clerk Dashboard) |
| `MARKET_DATA_PROVIDER`| `hybrid` |
| `FMP_API_KEY` | `s8nLoZs9t2xAj9zG2c1Yif1CFVq0y5eM` |
| `TWELVEDATA_API_KEY` | `33327d6b467444618dd21e99671f0a3c` |
| `AI_ENABLED` | `true` |
| `GROQ_API_KEY` | `gsk_...` |
| `GEMINI_API_KEY` | `AQ....` |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` |

Once deployed, copy your Render service URL (e.g., `https://marketscope-api.onrender.com`).

---

## 3. Deploying Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Import the GitHub repository: `parth022002/marketscope`.
4. Configure the project settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and choose `apps/web`.
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)
5. Under **Environment Variables**, add:

| Variable Name | Value |
|---|---|
| `NEXT_PUBLIC_APP_NAME` | `MarketScope.io` |
| `NEXT_PUBLIC_APP_TAGLINE` | `Financial Research & Intelligence` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://marketscope-api.onrender.com` (Your Render backend URL) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_c2luZ3VsYXItamVubmV0LTUwMzEuY2xlcmsuYWNjb3VudHMuZGV2JA` |
| `CLERK_SECRET_KEY` | `sk_test_Hbx0Vx46E7bXlCjV3yrPZat35RKY4fhJxp2oIFuKNT` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/workspace` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/workspace` |
| `NEXT_PUBLIC_AI_ENABLED` | `true` |

6. Click **Deploy**.
7. Once deployed on Vercel, copy your Vercel URL (e.g. `https://marketscope.vercel.app`) and update `API_CORS_ORIGINS` in your Render backend settings to allow requests from that domain.

---

## 4. Post-Deployment Verification Checklist

1. [ ] **Backend Health Check:** Visit `https://marketscope-api.onrender.com/health` & `https://marketscope-api.onrender.com/api/v1/health/deep`. Status should be `HEALTHY` or `ok`.
2. [ ] **Swagger API Docs:** Visit `https://marketscope-api.onrender.com/docs` to test endpoints.
3. [ ] **Frontend Home:** Visit your Vercel domain; verify live quotes, featured cards, and navbar.
4. [ ] **Clerk Sign-In / Sign-Up:** Click "Sign In" or "Create Account" modal and authenticate.
5. [ ] **Company Dossier:** Open `/company/reliance` or `/company/tcs` and verify financial statements and ratios.
6. [ ] **Gated AI Research:** In company dossier, switch to **AI Research Synthesis** tab and generate grounded intelligence.
7. [ ] **Compliance & Legal:** Verify footer links navigate to `/terms`, `/privacy`, and `/disclaimer`.
