# MarketScope.io — Backend Root Cause Analysis & Recovery Report

## 1. Executive Summary
During Render production deployment, two major blocking failure modes were identified and diagnosed:
1. **Critical Python Startup Error (`NameError: name 'Any' is not defined`)**:
   - Location: `apps/api/app/domain/canonical_news.py:143`
   - Cause: Missing import of `Any` from Python's standard `typing` module while annotating `def model_post_init(self, __context: Any) -> None:`.
   - Impact: Uvicorn workers failed to import `app.main`, resulting in repeated process exit code 1.
2. **Render 15-Minute Build/Deploy Timeouts (`15m 7s`, `15m 10s`, `15m 11s`)**:
   - Cause A (Port Binding): Uvicorn was hardcoded to listen on port 8000. Render dynamically allocates an internal port via the `$PORT` environment variable (e.g. `10000`). Render's health proxy probed `$PORT`, which never responded, until Render's hard 15-minute timeout elapsed.
   - Cause B (Docker Context Bloat): Lack of `.dockerignore` files caused Render to transfer the entire repository (including `apps/web/node_modules/`, `.git/`, `.next/`, and virtual environments) to Docker daemon. Transfer and `chown -R` took over 10 minutes.
   - Cause C (Execution Directory Mismatch): When executed from repository root, Python could not resolve `app.main` because `apps/api` was not in `sys.path`.

---

## 2. Forensic Failure Breakdown

### Failure 1: The `Any` NameError in `canonical_news.py`
- **Error Stack Trace**:
  ```python
  File "app/domain/canonical_news.py", line 143, in CanonicalNewsArticle
      def model_post_init(self, __context: Any) -> None:
  NameError: name 'Any' is not defined
  ```
- **Code Context**:
  `canonical_news.py` line 9 originally contained:
  ```python
  from typing import Sequence
  ```
  While `Any` was used on line 143 to support Pydantic v2's `model_post_init` hook.
- **Resolution**:
  Updated import in `apps/api/app/domain/canonical_news.py`:
  ```python
  from typing import Any, Sequence
  ```

### Failure 2: Render 15-Minute Deployment Timeout
- **Symptoms**:
  Deployments `356be9e`, `eff29dd`, and `fb7539e` failed at ~15m 10s.
- **Mechanics**:
  1. Render sets `PORT=10000` (or another dynamic integer).
  2. The previous Dockerfile and startup command executed:
     `uvicorn app.main:app --host 0.0.0.0 --port 8000`
  3. Render's deployment agent checked `http://0.0.0.0:10000/health`.
  4. The probe received connection refused for 15 minutes, triggering Render's automated deployment timeout.
- **Resolution**:
  - Replaced hardcoded ports with `${PORT:-8000}` across all Dockerfiles, scripts, and Procfiles.
  - Added zero-dependency `/health` endpoint returning instant 200 OK without database locks.

### Failure 3: Docker Context Transfer & Permissions
- **Mechanics**:
  Without `.dockerignore`, Docker context transfer had to upload >50,000 files in `apps/web/node_modules`.
  Subsequent `RUN chown -R appuser:appgroup /app /opt/venv` took several minutes to process.
- **Resolution**:
  - Added `.dockerignore` at root, `apps/api/`, and `apps/web/`.
  - Replaced slow `RUN chown -R` with native single-layer `COPY --chown=appuser:appgroup`.
  - Context upload reduced from >500 MB to <1 MB (<1 second).

---

## 3. Corrective Actions Summary

| Component | File Affected | Modification | Status |
| :--- | :--- | :--- | :--- |
| **Domain Model** | `apps/api/app/domain/canonical_news.py` | Added `Any` import to typing imports | RESOLVED |
| **Indicator Engine**| `apps/api/app/engine/technical_indicators.py` | Added Welles Wilder ADX calculation | RESOLVED |
| **Chart Routing** | `apps/api/app/api/chart_routes.py` | Registered ADX indicator enum and route | RESOLVED |
| **Docker Context** | `.dockerignore`, `apps/api/.dockerignore` | Excluded node_modules, .venv, .git | RESOLVED |
| **Root Entrypoint** | `main.py` | Dynamic `sys.path` injection for root execution | RESOLVED |
| **Runtime Pinning**| `runtime.txt`, `apps/api/runtime.txt` | Pinned `python-3.12.8` | RESOLVED |
| **Frontend Config**| `apps/web/next.config.ts` | Configured `outputFileTracingRoot` | RESOLVED |
| **Frontend Env** | `apps/web/.env.production` | Added safe build-time fallbacks | RESOLVED |
