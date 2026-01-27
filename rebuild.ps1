#!/usr/bin/env pwsh
# Rebuild and restart Docker containers with latest code

Write-Host "Stopping containers..." -ForegroundColor Yellow
docker compose down

Write-Host "Rebuilding image and starting containers..." -ForegroundColor Yellow
docker compose up --build -d

Write-Host "Waiting for app to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Done! App is running at http://localhost:8888" -ForegroundColor Green
docker compose logs -f app
