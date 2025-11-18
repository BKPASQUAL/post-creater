# Windows Fix Script for Next.js SWC Binary Issue
Write-Host "=== Next.js Windows Fix Script ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Cleaning up old installations..." -ForegroundColor Yellow
if (Test-Path ".\node_modules\") {
    Remove-Item -Recurse -Force .\node_modules\
    Write-Host "✓ Removed node_modules" -ForegroundColor Green
}

if (Test-Path ".\package-lock.json") {
    Remove-Item .\package-lock.json
    Write-Host "✓ Removed package-lock.json" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✓ Cache cleared" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Reinstalling dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install
Write-Host "✓ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Installing WebAssembly fallback for Windows..." -ForegroundColor Yellow
npm install --save-dev @next/swc-wasm-nodejs
Write-Host "✓ WebAssembly fallback installed" -ForegroundColor Green

Write-Host ""
Write-Host "=== All Done! ===" -ForegroundColor Cyan
Write-Host "You can now run: npm run dev" -ForegroundColor Green
Write-Host ""
