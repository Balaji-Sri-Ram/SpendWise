$ErrorActionPreference = "Stop"

$frontendDir = "$PSScriptRoot\frontend"
if (-not (Test-Path $frontendDir)) {
    Write-Error "Frontend directory not found at $frontendDir"
    exit 1
}

Set-Location $frontendDir

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed or not in PATH."
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is not installed or not in PATH."
    exit 1
}

# Handle existing frontend on port 5173
$port = 5173
$listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
    Write-Host "Port $port is currently in use. Checking process..."
    $process = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
    if ($process -and $process.ProcessName -match "node") {
        Write-Host "Stopping existing node process on port $port (ID: $($process.Id))..."
        $process | Stop-Process -Force
        Start-Sleep -Seconds 2
    } else {
        Write-Host "Port $port belongs to another application ($($process.ProcessName)). Vite will automatically pick another port, but proceeding anyway." -ForegroundColor Yellow
    }
}

Write-Host "Starting SpendWise frontend..."
npm run dev
