# Wave - Single-Click Startup Script
# Starts database init, backend, and frontend in one go
param (
    [switch]$BuildAPK
)

if ($BuildAPK) {
    Write-Host ""
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host "   WAVE - Building APK...     " -ForegroundColor Cyan
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host ""

    $env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
    $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

    Write-Host "[1/3] Building Web Frontend..." -ForegroundColor Yellow
    Push-Location "$PSScriptRoot\frontend"
    npm run build
    Pop-Location

    Write-Host "[2/3] Syncing Capacitor..." -ForegroundColor Yellow
    Push-Location "$PSScriptRoot\frontend"
    npx cap sync android
    Pop-Location

    Write-Host "[3/3] Building Android APK (Debug)..." -ForegroundColor Yellow
    Push-Location "$PSScriptRoot\frontend\android"
    # Stop existing daemons to avoid cache issues
    ./gradlew --stop
    ./gradlew assembleDebug
    Pop-Location

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! APK is ready at:" -ForegroundColor Green
        Write-Host "$PSScriptRoot\frontend\android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "ERROR: Build failed. Check logs above." -ForegroundColor Red
    }
    exit
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "   WAVE - Starting Up...      " -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$VENV_PYTHON = "$PSScriptRoot\backend\venv\Scripts\python.exe"
if (-not (Test-Path $VENV_PYTHON)) {
    Write-Host "ERROR: Virtual environment not found at $VENV_PYTHON" -ForegroundColor Red
    Write-Host "Please create it first: cd backend; python -m venv venv" -ForegroundColor Gray
    exit 1
}

# --- Step 1: Initialize Database ---
Write-Host "[1/4] Checking database..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\backend"
& $VENV_PYTHON db_init.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "  WARNING: Database init had issues (may already exist). Continuing..." -ForegroundColor DarkYellow
}
Pop-Location
Write-Host "  Database ready." -ForegroundColor Green
Write-Host ""

# --- Step 2: Start Backend ---
Write-Host "[2/4] Starting Flask backend on http://localhost:5000 ..." -ForegroundColor Yellow
$backend = Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; & '$VENV_PYTHON' app.py" -PassThru
Write-Host "  Backend started (PID: $($backend.Id))." -ForegroundColor Green
Write-Host ""

# --- Step 3: Start JioSaavn API Microservice ---
Write-Host "[3/4] Starting JioSaavn API on http://localhost:3001 ..." -ForegroundColor Yellow
$saavn = Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "cd '$PSScriptRoot\jiosaavn-api'; node serve.mjs" -PassThru
Write-Host "  JioSaavn API started (PID: $($saavn.Id))." -ForegroundColor Green
Write-Host ""

# --- Step 4: Start Frontend ---
Write-Host "[4/4] Starting Vite frontend dev server..." -ForegroundColor Yellow
$frontend = Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -PassThru
Write-Host "  Frontend started (PID: $($frontend.Id))." -ForegroundColor Green
Write-Host ""

# --- Step 5: Setup Emulator Connection (Optional) ---
$ADB = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
if (Test-Path $ADB) {
    $devices = & $ADB devices | Select-String "device$"
    if ($devices) {
        Write-Host "[5/5] Mapping emulator ports..." -ForegroundColor Yellow
        & $ADB reverse tcp:5000 tcp:5000
        & $ADB reverse tcp:3001 tcp:3001
        Write-Host "  Emulator connected to Backend & JioSaavn API." -ForegroundColor Green
    }
}

Write-Host "==============================" -ForegroundColor Cyan
Write-Host "   WAVE is running!           " -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "  JioSaavn:  http://localhost:3001" -ForegroundColor White
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "  Close the spawned terminal windows to stop the servers." -ForegroundColor DarkGray
Write-Host ""
