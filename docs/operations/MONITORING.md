# MarketScope.io — Monitoring & Observability Guide

## 1. Health Checks
- **Endpoint**: `GET /health`
- **Cadence**: Probed every 15 seconds by Render or container orchestrators.
- **Expected Payload**:
  ```json
  {
    "status": "ok",
    "service": "marketscope-api",
    "environment": "production",
    "database": "neon-postgresql"
  }
  ```

## 2. Error Telemetry (Sentry Integration)
- If `SENTRY_DSN` is configured in environment variables, the backend automatically initializes Sentry telemetry:
  - Error capture with sanitized stack traces (excluding secret environment variables).
  - Performance transaction tracing (20% sample rate in production).
- Uncaught exceptions in route handlers are automatically captured and logged with correlated request IDs.
