# MarketScope.io — Backend Startup Diagnostics & Troubleshooting

> Canonical report located at: [`docs/deployment/BACKEND_STARTUP_DIAGNOSTICS.md`](docs/deployment/BACKEND_STARTUP_DIAGNOSTICS.md)

## 1. Startup Process Flow

The MarketScope.io backend boots through the following lifecycle stages:

```text
1. Render provisions Linux container on port $PORT (typically 10000).
2. CMD executes:
   if [ -d 'apps/api' ]; then
       exec uvicorn app.main:app --app-dir apps/api --host 0.0.0.0 --port ${PORT:-8000} --workers 1
   else
       exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
   fi
3. Python loads settings from environment variables with safe defaults.
4. FastAPI lifespan context executes:
   - Database connection attempt to Neon PostgreSQL.
   - Non-blocking seed execution.
5. Uvicorn begins listening on 0.0.0.0:10000.
6. Render polls /health -> Receives HTTP 200 -> Marks service LIVE.
```
