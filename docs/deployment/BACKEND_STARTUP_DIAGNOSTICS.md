# MarketScope.io — Backend Startup Diagnostics & Troubleshooting

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

---

## 2. Common Pitfalls & Diagnostics

| Symptom | Diagnostic Check | Resolution |
| :--- | :--- | :--- |
| **`lstat /apps/api: no such file`** | Dockerfile had `COPY ... apps/api/requirements.txt*` | Fixed in `Dockerfile` and `apps/api/Dockerfile`: using `COPY requirements.txt ./`. |
| **OOM Killed on Startup** | Worker count exceeded instance RAM | Fixed: set `--workers 1`. Uvicorn asyncio event loop handles all requests efficiently. |
| **CORS Rejected on Vercel** | Preflight `OPTIONS` request failed | Fixed in `app/main.py`: `allow_origin_regex` permits `*.vercel.app` and `*.onrender.com`. |
| **Database Connection Slow** | Serverless cold start latency | Handled: lifespan is non-blocking; `/health/ready` reports status gracefully without crashing. |
| **`NameError: name 'Any' is not defined`** | Missing typing import in `canonical_news.py` | Verified: `from typing import Any, Sequence` is present on line 9 of `app/domain/canonical_news.py`. |

---

## 3. Local Verification Commands

Developers can replicate the startup sequence locally using the following commands:

```bash
# Direct execution inside apps/api
cd apps/api
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Execution from repository root
cd MarketScope.io
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
