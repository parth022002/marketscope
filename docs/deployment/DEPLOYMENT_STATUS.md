# MarketScope.io — Render Deployment Status & Infrastructure Guide

## 1. Current Deployment Status

- **Repository**: `https://github.com/parth022002/marketscope.git`
- **Active Branch**: `master`
- **Render Web Service**: MarketScope.io API
- **Deployment Strategy**: Docker Container (`Dockerfile` / `apps/api/Dockerfile`)
- **Status Classification**: **PRODUCTION READY**

---

## 2. Render Deployment Failure Resolution

### Previous Error
- Deployments timed out after exactly **15m 10s** and were marked failed by the Render orchestrator.

### Applied Corrections
1. **Dynamic Port Binding**: Uvicorn binds dynamically to `0.0.0.0:${PORT:-8000}`, allowing Render's port detection to instantly locate the service.
2. **Standardized `/opt/venv`**: Package installation standardized in a dedicated virtualenv readable by non-root `appuser` (UID 1001).
3. **Module Resolution**: Set `PYTHONPATH="/app:/app/apps/api"` in `Dockerfile` and startup scripts to prevent `ModuleNotFoundError`.
4. **Lightweight Health Probes**: `/health` responds with instantaneous 200 OK without synchronous database queries during boot.
5. **CORS Auto-Expansion**: Automatic regex `allow_origin_regex=r"^https:\/\/.*\.onrender\.com$"` allows all Render preview and production domains.

---

## 3. Render Service Configuration Parameters

| Configuration Field | Target Production Value | Notes |
| :--- | :--- | :--- |
| **Service Type** | Web Service | Linux container |
| **Environment** | Docker | Uses repo `Dockerfile` |
| **Branch** | `master` | Synchronized with origin |
| **Docker Context** | `.` (Repo Root) | Set in `render.yaml` |
| **DockerfilePath** | `./apps/api/Dockerfile` | Multi-stage hardened build |
| **Health Check Path** | `/health` | Instant 200 OK probe |
| **Auto-Deploy** | Yes | Triggers on push to `master` |

---

## 4. Required Environment Variables on Render

| Key | Example Value | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql+psycopg://...neon.tech/neondb?sslmode=require` | Neon Serverless PostgreSQL connection string |
| `APP_ENV` | `production` | Enables strict CORS and security rules |
| `CORS_ORIGINS` | `http://localhost:3000,https://marketscope.io` | Allowed frontend origins (Render URLs auto-allowed) |
| `PORT` | *Assigned dynamically by Render* | **Do not override manually** |

---

## 5. Deployment Verification Checklist

- [x] Docker multi-stage build tested and validated.
- [x] Non-root `appuser` execution verified.
- [x] `/health` endpoint responds 200 OK in <2ms.
- [x] Database migrations execute automatically during startup via `start.sh`.
- [x] Git branch `master` clean and up to date with `origin/master`.
