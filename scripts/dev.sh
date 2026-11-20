#!/usr/bin/env bash
set -euo pipefail
docker compose up -d db redis
echo "Infrastructure started. Start API and web in separate terminals; see README.md."
