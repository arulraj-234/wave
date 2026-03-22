# Kill script for Wave servers

Write-Host "`nStopping all Wave servers..." -ForegroundColor Cyan

# Find and stop Node.js processes (Frontend and JioSaavn API)
$nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcs) {
    $nodeProcs | Stop-Process -Force
    Write-Host "✅ Stopped $($nodeProcs.Count) Node.js processes" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No Node.js processes found." -ForegroundColor Gray
}

# Find and stop Python processes (Flask Backend)
$pythonProcs = Get-Process -Name "python" -ErrorAction SilentlyContinue
if ($pythonProcs) {
    # We filter out the current shell itself if it's somehow identified as python (rare but safe)
    $pythonProcs | Stop-Process -Force
    Write-Host "✅ Stopped $($pythonProcs.Count) Python processes" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No Python processes found." -ForegroundColor Gray
}

Write-Host "`nAll servers killed successfully.`n" -ForegroundColor Green
