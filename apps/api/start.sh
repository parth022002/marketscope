#!/usr/bin/env bash
set -e

PORT="${PORT:-8000}"
echo "Starting MarketScope.io API on 0.0.0.0:${PORT}..."
if [ -d "apps/api" ]; then
    export PYTHONPATH="${PYTHONPATH}:$(pwd)/apps/api:$(pwd)"
    exec uvicorn app.main:app --app-dir apps/api --host 0.0.0.0 --port "${PORT}" --workers 2
else
    export PYTHONPATH="${PYTHONPATH}:$(pwd)"
    exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}" --workers 2
fi
