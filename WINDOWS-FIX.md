# Troubleshooting: SWC Binary Loading Error on Windows

If you encounter the error "Failed to load SWC binary for win32/x64", follow these steps:

## Solution 1: Reinstall Dependencies

```bash
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

## Solution 2: Install Wasm Fallback (Recommended for Windows)

If Solution 1 doesn't work, install the WebAssembly fallback:

```bash
npm install --save-dev @next/swc-wasm-nodejs
```

Then try running the dev server again:

```bash
npm run dev
```

## Solution 3: Check Node.js Version

Ensure you're using Node.js 18 or later:

```bash
node --version
```

If your version is older, download and install the latest LTS version from [nodejs.org](https://nodejs.org/)

## Solution 4: Use Windows-Specific Commands

```powershell
# PowerShell commands
Remove-Item -Recurse -Force .\node_modules\
Remove-Item .\package-lock.json
npm cache clean --force
npm install
npm install --save-dev @next/swc-wasm-nodejs
npm run dev
```

## Additional Notes

- The SWC binary is used for faster compilation
- The wasm fallback will work but may be slightly slower
- This is a known issue on some Windows systems
- Make sure you have the latest Visual C++ Redistributables installed

## Quick Fix Script

Create a file named `fix-windows.ps1`:

```powershell
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .\node_modules\ -ErrorAction SilentlyContinue
Remove-Item .\package-lock.json -ErrorAction SilentlyContinue

Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Installing WebAssembly fallback..." -ForegroundColor Yellow
npm install --save-dev @next/swc-wasm-nodejs

Write-Host "Done! Try running 'npm run dev' now" -ForegroundColor Green
```

Run it with:
```powershell
.\fix-windows.ps1
```
