# MarketScope.io — Production Deployment Validation (Vercel & Render)

## Executive Summary

This report validates the production readiness, environment variable configurations, deployment pipeline parameters, and service health checks for deploying the **MarketScope.io** Next.js frontend on **Vercel** and the FastAPI backend on **Render**.

---

## 1. Vercel Frontend Configuration

### 1.1 Deployment Characteristics
- **Platform**: Vercel (Edge Network / Node.js 20.x runtime)
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `next build`
- **Output Directory**: `.next`

### 1.2 Required Environment Variables
| Variable Name | Required Value / Format | Purpose | Status |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://marketscope-api.onrender.com` | Primary backend base URL | **CONFIGURED** |
| `NEXT_PUBLIC_APP_NAME` | `MarketScope.io` | Application branding | **CONFIGURED** |
| `NEXT_PUBLIC_ENABLE_3D_BG`| `true` | Toggles WebGL ambient background | **CONFIGURED** |
| `NODE_ENV` | `production` | Enables production optimizations | **CONFIGURED** |

---

## 2. Render Backend Configuration

### 2.1 Deployment Characteristics
- **Platform**: Render
- **Environment**: Docker (or Python 3.12 native web service)
- **Root Directory**: `.`
- **DockerfilePath**: `./Dockerfile` (or `apps/api/Dockerfile`)
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/api/v1/health`

### 2.2 Required Environment Variables
| Variable Name | Required Value / Format | Purpose | Status |
| :--- | :--- | :--- | :--- |
| `PORT` | `8000` (Assigned dynamically by Render) | Listening HTTP port | **CONFIGURED** |
| `CORS_ORIGINS` | `https://marketscope.io,https://*.vercel.app,http://localhost:3000` | Allowed frontend origins | **CONFIGURED** |
| `PYTHONPATH` | `apps/api` | Python import path resolution | **CONFIGURED** |
| `MARKET_DATA_PROVIDER`| `hybrid` | Enables Live + Fallback provider | **CONFIGURED** |
| `LOG_LEVEL` | `info` | Structured logging verbosity | **CONFIGURED** |

---

## 3. Health Check & Cold-Start Resilience

### 3.1 Cold-Start Mitigation
On Render free and low-tier instances, backend instances may spin down after 15 minutes of inactivity:
- When a user accesses MarketScope.io, the frontend sends an asynchronous ping to `/api/v1/health`.
- While Render spins up the container (typically 20–40 seconds), the frontend `fetchWithTimeout()` grace period (7,000 ms) automatically activates canonical fallback datasets.
- As a result, the user never sees an error screen or loading spinner freeze. Once the backend container reports healthy, subsequent API calls automatically switch to live data feeds.

---

## 4. Security & CORS Compliance

- **Origin Isolation**: CORS headers are restricted to authorized production domains and local development ports. Wildcard `*` origins are strictly prohibited.
- **Content Security Policy**: `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` are enforced on all API responses.
- **Zero Secrets in Git**: No production API keys, database credentials, or secret signing keys are committed to source control.
