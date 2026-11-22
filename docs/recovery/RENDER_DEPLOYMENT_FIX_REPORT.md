# MarketScope.io — Render Deployment Fix Report

## 1. Overview
This report documents the end-to-end hardening and recovery of the Render deployment architecture for MarketScope.io.

---

## 2. Configuration Matrix

| Aspect | Previous State | Hardened State |
| :--- | :--- | :--- |
| **Environment Variable** | `PORT` ignored; hardcoded 8000 | Dynamic `${PORT:-8000}` respected everywhere |
| **Docker Build Context** | Whole repo (>500 MB) sent to daemon | Cleaned via `.dockerignore` (<1 MB) |
| **Layer Permissions** | Slow recursive `RUN chown -R` | Single-step `COPY --chown=appuser:appgroup` |
| **Root Execution** | `ModuleNotFoundError: No module named 'app'` | `main.py` root proxy auto-adds `apps/api` |
| **Python Runtime** | Unpinned (variable default) | Explicitly pinned to `python-3.12.8` via `runtime.txt` |
| **Health Check** | Probed port 8000 (failed) | Render probes `/health` on `$PORT` |
| **Frontend Start** | Next.js `-p ${PORT:-3000}` shell parsing | Clean `next start` natively reading `process.env.PORT` |

---

## 3. Step-by-Step Render Deployment Guide

### Option 1: One-Click Deploy via Render Blueprint (`render.yaml`)
1. In the [Render Dashboard](https://dashboard.render.com), navigate to **Blueprints**.
2. Connect the `MarketScope.io` repository on branch `master`.
3. Render automatically discovers both services:
   - `marketscope-api`: FastAPI backend service.
   - `marketscope-web`: Next.js 15 frontend web service.
4. Provide the following environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (e.g. from Neon serverless: `postgresql+psycopg://user:pass@host/dbname?sslmode=require`).
   - `CLERK_SECRET_KEY` & `CLERK_PUBLISHABLE_KEY`: From Clerk dashboard.
   - `TWELVEDATA_API_KEY`: TwelveData financial market data key.
   - `FMP_API_KEY`: Financial Modeling Prep key.
5. Click **Apply**.

### Option 2: Deploying via Existing Manual Service
If your service was set up manually in the Render Dashboard:
1. Open service **marketscope-api**.
2. Click **Manual Deploy** in the top right.
3. Select **Clear build cache & deploy** (or **Deploy latest commit**).
4. Verify deployment logs:
   ```
   ==> Building Docker image...
   ==> Sending build context to Docker daemon... 840kB (instant)
   ==> Step 1/15: FROM python:3.12-slim AS builder
   ==> Successfully built image
   ==> Starting service with 'uvicorn app.main:app --app-dir apps/api --host 0.0.0.0 --port 10000 --workers 2'
   ==> Uvicorn running on http://0.0.0.0:10000
   ==> Health check passed on /health!
   ==> Deployment live.
   ```
