# MarketScope.io — Render Backend Deployment Troubleshooting

## 1. Executive Summary & Root Cause Analysis

### The Failure Symptom
In Render deployments, builds or services failed after **15 minutes and 10 seconds** (`Duration: 15m 10s`) with a red X error.

### Root Cause Identification
1. **Render 15-Minute Timeout Limit**: On Render, the build and initial health check probe has a hard 15-minute timeout. When a service fails to bind to Render's allocated `$PORT` or fails to answer the configured `healthCheckPath`, Render continues polling until the 15-minute timer expires, then marks the deploy as failed.
2. **Hardcoded Port 8000 Binding**: Earlier Dockerfile and startup scripts hardcoded `uvicorn app.main:app --port 8000` instead of reading Render's dynamically assigned `$PORT` environment variable (Render uses port 10000). Render's load balancer was probing port 10000 while the container listened exclusively on 8000.
3. **Missing Health Endpoints**: The service lacked `/health/live` and `/health/ready` probes, and `/health` relied on synchronous DB initialization that could hang if the database connection hung without a timeout.
4. **Monorepo Directory Mismatch**: When deploying from a monorepo, depending on whether Render's Root Directory was set to `apps/api` or left blank (root), Uvicorn commands failed with `ModuleNotFoundError: No module named 'app'` unless `--app-dir apps/api` was conditionally supplied.
5. **Docker Multi-Stage PATH Loss**: In the multi-stage Docker build, pip installed dependencies into `/root/.local`, but the runner image ran as non-root `appuser` (UID 1001) without `PYTHONPATH` or `PYTHONUSERBASE`, causing missing dependency errors.

---

## 2. Corrections Implemented

### A. Dynamic `$PORT` Binding & Directory Autodetection
In [`start.sh`](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/start.sh) and [`apps/api/start.sh`](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/apps/api/start.sh):
```bash
PORT="${PORT:-8000}"
if [ -d "apps/api" ]; then
    exec uvicorn app.main:app --app-dir apps/api --host 0.0.0.0 --port "${PORT}" --workers 2
else
    exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}" --workers 2
fi
```
This guarantees that regardless of whether the service runs from the root or inside `apps/api`, it detects the path, binds to `0.0.0.0`, and uses Render's assigned `$PORT`.

### B. Self-Contained Virtual Environment in Docker
In [`apps/api/Dockerfile`](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/apps/api/Dockerfile) and [`Dockerfile`](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/Dockerfile):
```dockerfile
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" PYTHONPATH="/app:/app/apps/api"
```
Eliminated user-space path conflicts. Dependencies installed in `/opt/venv` are globally accessible to the unprivileged `appuser`.

### C. Zero-Dependency Health & Readiness Probes
Implemented three explicit probes in [`main.py`](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/apps/api/app/main.py):
- `GET /health`: Instant 200 OK liveness check.
- `GET /health/live`: Process liveness check.
- `GET /health/ready`: Dependency readiness check with active DB ping and latency measurement in ms.

### D. CORS Regex for Render Staging URLs
In [`main.py`](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/apps/api/app/main.py):
```python
allow_origin_regex=r"^https:\/\/.*\.onrender\.com$"
```
Prevents cross-origin failures between `marketscope-web.onrender.com` and `marketscope-api.onrender.com`.

---

## 3. Deployment Failure Classification Matrix

| Category | Specific Issue | Root Cause | Status | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Port Binding** | 15m deployment timeout | Port 8000 hardcoded; Render expected port 10000 | **FIXED** | Dynamic `${PORT:-8000}` binding on `0.0.0.0`. |
| **Directory Path** | `ModuleNotFoundError: app` | Working directory difference between root & `apps/api` | **FIXED** | Auto-detection of `apps/api` directory in `start.sh`. |
| **Container User** | Missing site-packages | `appuser` cannot access `/root/.local` | **FIXED** | Standardized `/opt/venv` copied with ownership. |
| **Database** | Cold start freeze on idle DB | Unbounded connection wait without timeout | **FIXED** | `connect_timeout=5` and `pool_pre_ping=True` in engine. |
| **CORS** | Browser blocks API calls | Render web hostname not in allowed origins | **FIXED** | Added `allow_origin_regex` for `*.onrender.com`. |
