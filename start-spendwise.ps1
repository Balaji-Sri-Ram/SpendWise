# start-spendwise.ps1
$ErrorActionPreference = "Stop"

Write-Host "Starting SpendWise application..."

$backendScript = "$PSScriptRoot\start-backend.ps1"
$frontendScript = "$PSScriptRoot\start-frontend.ps1"

Write-Host "Starting backend in a new window..."
# Launch backend in a new process so we don't block
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$backendScript`""

Write-Host "Waiting for SpendWise backend to become healthy on port 8081..."
$maxWait = 120
$sw = [Diagnostics.Stopwatch]::StartNew()
$healthy = $false

while ($sw.Elapsed.TotalSeconds -lt $maxWait) {
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:8081/api/health" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($resp.StatusCode -eq 200) {
            $healthy = $true
            break
        }
    } catch {}
    
    # Check if a process is even listening yet
    if ($sw.Elapsed.TotalSeconds % 10 -eq 0) {
        Write-Host "Still waiting... ($([math]::Round($sw.Elapsed.TotalSeconds))s elapsed)"
    }
    
    Start-Sleep -Seconds 2
}

if (-not $healthy) {
    Write-Host "SpendWise backend did not become healthy within $maxWait seconds. Aborting frontend startup." -ForegroundColor Red
    exit 1
}

Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host " [SUCCESS] Backend health check passed! Backend is up." -ForegroundColor Green
Write-Host "=======================================================`n" -ForegroundColor Green

Write-Host "Starting frontend in a new window..."
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$frontendScript`""

Write-Host "SpendWise startup initiated successfully."
Write-Host "From now on, use '.\start-spendwise.ps1' as the ONE command to start the full application."
