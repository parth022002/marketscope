# MarketScope.io — Dockerfile Configuration Guide

## 1. Overview & Multi-Stage Architecture

The MarketScope.io backend utilizes an optimized multi-stage Docker build targeting **Python 3.12-slim**:
- **Stage 1 (`builder`):** Compiles virtual environment, installs build dependencies (`gcc`, `libpq-dev`, `curl`), and installs pip packages without caching wheels in the final image.
- **Stage 2 (`runner`):** Minimal runtime container containing only runtime shared libraries (`libpq5`, `curl`), an unprivileged system user (`appuser:1001`), and the pre-built virtual environment from Stage 1.

---

## 2. Corrected Dockerfile Specification

```dockerfile
# MarketScope.io — Production Backend Dockerfile (FastAPI)
FROM python:3.12-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy dependency manifest
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Final Runtime Image
FROM python:3.12-slim AS runner

WORKDIR /app

ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH="/app:/app/apps/api" \
    PORT=8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged service user
RUN groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -s /bin/sh appuser

# Copy virtual environment and app code with proper ownership in single layers
COPY --chown=appuser:appgroup --from=builder /opt/venv /opt/venv
COPY --chown=appuser:appgroup . /app

USER appuser

EXPOSE 8000 10000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

CMD ["sh", "-c", "if [ -d 'apps/api' ]; then exec uvicorn app.main:app --app-dir apps/api --host 0.0.0.0 --port ${PORT:-8000} --workers 1; else exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1; fi"]
```

---

## 3. Key Improvements & Hardening

1. **Deterministic Dependency Copy:** `COPY requirements.txt ./` eliminates failed directory lookups regardless of whether the build context is `apps/api` or `.`.
2. **Lean Worker Allocation:** Changed default from 2 workers to `--workers 1`. This prevents Out-Of-Memory (OOM) crashes on Render Free/Starter tiers (512MB RAM) and avoids duplicate background scheduler instances.
3. **Dual-Context Startup Adaptability:**
   - If `/app/apps/api` exists (root build context), Uvicorn runs with `--app-dir apps/api`.
   - If `/app/apps/api` does not exist (subdirectory context), Uvicorn runs directly against `app.main:app`.
4. **Non-Root Execution:** The application executes under `appuser` (UID 1001), adhering to container security best practices.
5. **No Secret Ingestion:** `.dockerignore` excludes `.env*`, `.git`, `.venv`, ensuring zero credential leakage into Docker image layers.
