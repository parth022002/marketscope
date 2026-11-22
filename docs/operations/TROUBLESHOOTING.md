# MarketScope.io — Troubleshooting Guide

## 1. Render Deployment Timeout (15m build error)
- **Symptom**: Render build or deploy fails with red cross and `Duration: 15m 10s`.
- **Root Cause**:
  1. Render default port binding hung waiting for service to bind to `$PORT` on `0.0.0.0`.
  2. Database connection attempt hung without a connection timeout during startup.
- **Solution**:
  1. Ensure start command includes `--host 0.0.0.0 --port ${PORT:-8000}`.
  2. Ensure `connect_args={"connect_timeout": 5}` is set in SQLAlchemy engine creation (already implemented in `apps/api/app/core/database.py`).
  3. Ensure `/health` route is accessible without requiring database locks.

## 2. PostgreSQL Connection Failures (Neon Serverless)
- **Symptom**: `OperationalError: could not connect to server: Connection refused`.
- **Solution**:
  1. Verify connection string uses `postgresql+psycopg://` (not legacy `psycopg2`).
  2. Verify query parameter includes `sslmode=require`.
  3. Ensure `pool_pre_ping=True` is enabled in SQLAlchemy engine.

## 3. Next.js Static Build TypeScript Errors
- **Symptom**: `npm run build` fails during `Type checking and linting`.
- **Solution**:
  1. Run `npm run typecheck` locally to inspect exact file and line number.
  2. Ensure all types imported from `@/lib/api` are synchronized with backend Pydantic models.
