# MarketScope.io — Render Deployment Guide

## 1. Overview
This guide provides the official, verified deployment instructions for deploying the **MarketScope.io Backend API** and **Next.js Web Frontend** to **Render** (https://render.com).

The application is architected to support two deployment paths:
- **Option 1: Infrastructure-as-Code via Render Blueprint (`render.yaml`)** (Recommended)
- **Option 2: Manual Web Service Setup via Render Dashboard**

---

## 2. Option 1: One-Click Deploy via Render Blueprint

1. Fork or push your code to your GitHub repository.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint**.
3. Select your `MarketScope.io` repository.
4. Render will parse `render.yaml` and discover two web services:
   - `marketscope-api` (FastAPI Docker Backend)
   - `marketscope-web` (Next.js 15 Node.js Frontend)
5. Fill in the required environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g. from Neon serverless: `postgresql+psycopg://user:pass@host/dbname?sslmode=require`).
   - `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY`: From your Clerk Dashboard.
   - `TWELVEDATA_API_KEY`: TwelveData financial market data key.
   - `FMP_API_KEY`: Financial Modeling Prep key.
6. Click **Apply**. Render will automatically provision and deploy both services.

---

## 3. Option 2: Manual Dashboard Configuration

### A. Backend Web Service (`marketscope-api`)

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `marketscope-api` | Unique service name on Render |
| **Region** | `Singapore` (or closest to users) | Recommended: low latency to India/Asia |
| **Branch** | `master` (or your main branch) | Automatic deploys on git push |
| **Root Directory** | `apps/api` *(or leave blank)* | Both are fully supported |
| **Runtime** | `Docker` *(or Python 3)* | Docker recommended for identical runtime |
| **Dockerfile Path** | `./apps/api/Dockerfile` *(or `./Dockerfile`)* | Auto-detects `apps/api` folder |
| **Docker Context** | `.` (or `./apps/api`) | Fully supported |
| **Instance Type** | `Free` (or Standard) | Free tier 512MB RAM supported |
| **Health Check Path**| `/health` | Zero-dependency liveness check |

#### If using Native Python Runtime instead of Docker:
- **Root Directory**: `apps/api`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2`

---

### B. Frontend Web Service (`marketscope-web`)

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `marketscope-web` | Frontend UI service |
| **Region** | `Singapore` | Co-locate with backend API |
| **Branch** | `master` | |
| **Root Directory** | `apps/web` | Points to Next.js package root |
| **Runtime** | `Node` | Node.js 20+ / 22 LTS |
| **Build Command** | `npm ci && npm run build` | Clean production compilation |
| **Start Command** | `npm run start` | Binds to `$PORT` via `package.json` |
| **Health Check Path**| `/` | Next.js root route |

---

## 4. Post-Deployment Verification

1. **Verify Backend Health**:
   ```bash
   curl -I https://<your-backend>.onrender.com/health
   # Expected: HTTP/1.1 200 OK
   
   curl https://<your-backend>.onrender.com/health/ready
   # Expected: {"status":"ready","database":{"status":"connected",...}}
   ```
2. **Verify Frontend**:
   Open `https://<your-frontend>.onrender.com` in your browser. Verify the dashboard loads, charts display, and universal search operates with sub-second response times.
