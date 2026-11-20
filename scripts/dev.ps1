Write-Host "Starting MarketScope local infrastructure..."
docker compose up -d db redis
Write-Host "Infrastructure started. Start API and web in separate terminals; see README.md."
