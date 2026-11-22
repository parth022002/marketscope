#!/usr/bin/env bash
set -e

PORT="${PORT:-8000}"
echo "Starting MarketScope.io Backend API on 0.0.0.0:${PORT}..."
if [ -d "apps/api" ]; then
    exec uvicorn app.main:app --app-dir apps/api --host 0.0.0.0 --port "${PORT}" --workers 2
else
    exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}" --workers 2
fi
