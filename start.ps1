# Wave - Single-Click Startup Script
# Starts database init, backend, and frontend in one go

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
