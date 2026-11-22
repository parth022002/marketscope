# MarketScope.io — Render Deployment Configuration Guide

## 1. Render Infrastructure Specification

The MarketScope.io backend is declared in `render.yaml` as a Docker web service:

```yaml
services:
  # ─── MarketScope.io Backend API (FastAPI) ───
  - type: web
    name: marketscope-api
    env: docker
    rootDir: apps/api
    dockerfilePath: Dockerfile
    dockerContext: .
    plan: free
    region: singapore
    healthCheckPath: /health
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: "false"
      - key: DATABASE_URL
        sync: false
      - key: SECRET_KEY
        generateValue: true
      - key: SNAPSHOT_SIGNING_SALT
        generateValue: true
```

---

## 2. Render Web Dashboard Configuration (Recommended)

When deploying or editing the Web Service in the Render Dashboard:

| Configuration Field | Correct Setting | Description |
| :--- | :--- | :--- |
| **Name** | `marketscope-api` | Unique service identifier |
| **Region** | `Singapore` | Colocated with Neon DB (`ap-southeast-1`) |
| **Branch** | `master` | Production deployment branch |
| **Root Directory** | `apps/api` | Restricts build context to backend subdirectory |
| **Runtime** | `Docker` | Uses containerized runtime |
| **Dockerfile Path** | `Dockerfile` | Relative to Root Directory (`apps/api/Dockerfile`) |
| **Docker Build Context** | `.` | Context is `apps/api/` |
| **Health Check Path** | `/health` | Liveness verification (returns HTTP 200) |
| **Auto-Deploy** | `Yes` | Automatic rebuild on git push |

---

## 3. Alternative: Repository Root Build Configuration

If you prefer to leave **Root Directory** empty in the Render Dashboard:
- **Root Directory:** *(empty)*
- **Dockerfile Path:** `Dockerfile` (or `apps/api/Dockerfile`)
- **Docker Build Context:** `.`

Both configurations now succeed identically due to the standardized `COPY requirements.txt ./` instruction present in both root and subdirectory Dockerfiles.
