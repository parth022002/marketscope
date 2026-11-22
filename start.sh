#!/usr/bin/env bash
set -e

PORT="${PORT:-8000}"
echo "Starting MarketScope.io API on 0.0.0.0:${PORT}..."
exec uvicorn app.main:app --app-dir apps/api --host 0.0.0.0 --port "${PORT}" --workers 2
