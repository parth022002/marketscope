# MarketScope.io — Render Docker Build Failure Root Cause Analysis

> Canonical report located at: [`docs/deployment/DOCKER_BUILD_FAILURE_ROOT_CAUSE.md`](docs/deployment/DOCKER_BUILD_FAILURE_ROOT_CAUSE.md)

## 1. Executive Summary & Confirmed Error

During Render deployment of the backend service `marketscope-api`, the Docker build failed at stage `[builder 5/6]` with the following error:

```text
#13 [builder 5/6] COPY requirements.txt* apps/api/requirements.txt* ./
#13 ERROR: lstat /apps/api: no such file or directory
------
 > [builder 5/6] COPY requirements.txt* apps/api/requirements.txt* ./:
------
Dockerfile:21
--------------------
  19 |     
  20 |     # Copy requirements from either context (root or apps/api)
  21 | >>> COPY requirements.txt* apps/api/requirements.txt* ./
  22 |     RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; \
  23 |         elif [ -f apps/api/requirements.txt ]; then pip install --no-cache-dir -r apps/api/requirements.txt; fi
--------------------
error: failed to solve: lstat /apps/api: no such file or directory
error: exit status 1
```

---

## 2. Technical Root Cause

### A. Docker Build Context vs. Path Assumption
The repository is structured as a monorepo:
```text
MarketScope.io/
├── apps/
│   ├── api/             ← Python FastAPI backend
│   │   ├── app/         ← Application source (main.py, api/, core/, etc.)
│   │   ├── Dockerfile   ← Backend Dockerfile
│   │   ├── requirements.txt
│   │   └── start.sh
│   └── web/             ← Next.js 15 frontend
├── Dockerfile           ← Root Dockerfile (identical fallback)
├── requirements.txt     ← Root dependency manifest
└── render.yaml          ← Render infrastructure specification
```

### B. The Render Deployment Mechanism
When Render builds the `marketscope-api` Web Service:
1. The user configured **Root Directory** as `apps/api` in the Render Dashboard (or via `render.yaml` with `rootDir: apps/api`).
2. Render isolates the build context to `apps/api/`.
3. Inside the Docker build context:
   - The root of the context (`.`) is `apps/api/`.
   - `requirements.txt` is located directly at `./requirements.txt`.
   - `app/` is located directly at `./app/`.
   - **There is NO directory named `apps/api` inside the build context.**

### C. BuildKit Wildcard Expansion Failure
The problematic instruction was:
```dockerfile
COPY requirements.txt* apps/api/requirements.txt* ./
```
In Docker BuildKit:
- When a `COPY` instruction specifies multiple source arguments, BuildKit attempts to resolve each argument path.
- When evaluating `apps/api/requirements.txt*`, BuildKit performs an `lstat` system call on `/apps/api` inside the context.
- Because `/apps/api` does not exist inside the context (which is already `apps/api`), BuildKit fails immediately with:
  `ERROR: lstat /apps/api: no such file or directory`.

---

## 3. The Resolution

Because `requirements.txt` exists at the root of the context in both configurations:
- **When Context is `apps/api`:** `./requirements.txt` is present.
- **When Context is repository root (`.`):** `./requirements.txt` is present.

The problematic instruction was replaced with a clean, direct, non-wildcard instruction:
```dockerfile
# Copy dependency manifest
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
```

This permanently eliminates the `lstat /apps/api` failure while maintaining 100% compatibility across both Render build context configurations.
