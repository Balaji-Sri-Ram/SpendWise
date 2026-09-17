$ErrorActionPreference = "Continue"

$envFile = "$PSScriptRoot\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "SpendWise configuration error: .env file not found at $envFile" -ForegroundColor Red
    exit 1
}

# 1. Parse .env safely, ignore blanks and comments, remove quotes, export to current process space
Get-Content $envFile | Where-Object { $_.Trim() -ne "" -and -not $_.Trim().StartsWith("#") } | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            if ($value.Length -ge 2) {
                $value = $value.Substring(1, $value.Length - 2)
            }
        }
        Set-Item -Path "env:\$name" -Value $value
    }
}

# 2. Validate required variables exist
if (-not $env:JWT_SECRET) {
    Write-Host "SpendWise configuration error: JWT_SECRET is missing from .env." -ForegroundColor Red
    exit 1
}

$requiredVars = @("DB_URL", "DB_USERNAME", "DB_PASSWORD", "JWT_ACCESS_EXPIRATION", "JWT_REFRESH_EXPIRATION")
foreach ($var in $requiredVars) {
    if (-not (Get-Item -Path "env:\$var" -ErrorAction SilentlyContinue)) {
        Write-Host "SpendWise configuration error: $var is missing from .env." -ForegroundColor Red
        exit 1
    }
}

# 3. Check DB_URL format and Neon connectivity
$dbUrl = $env:DB_URL
if (-not $dbUrl.StartsWith("jdbc:postgresql://")) {
    Write-Host "SpendWise configuration error: DB_URL must begin with 'jdbc:postgresql://'." -ForegroundColor Red
    exit 1
}

$dbHost = $dbUrl.Substring(18) -replace '/.*$', '' -replace '\?.*$', '' -replace ':.*$', ''

Write-Host "Checking connectivity to PostgreSQL at $dbHost..."
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $result = $tcpClient.BeginConnect($dbHost, 5432, $null, $null)
    $success = $result.AsyncWaitHandle.WaitOne(3000, $false)
    if (-not $success) {
        Write-Host "SpendWise backend could not connect to PostgreSQL." -ForegroundColor Red
        exit 1
    }
    $tcpClient.EndConnect($result)
    $tcpClient.Close()
    Write-Host "Successfully connected to PostgreSQL."
} catch {
    Write-Host "SpendWise backend could not connect to PostgreSQL." -ForegroundColor Red
    exit 1
}

# 4. Handle Port 8081 and old SpendWise processes safely
$port = 8081
$listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
    Write-Host "Port $port is currently in use. Checking process..."
    $process = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
    if ($process -and $process.ProcessName -match "java") {
        Write-Host "Stopping existing SpendWise Java process (ID: $($process.Id))..."
        $process | Stop-Process -Force
        Start-Sleep -Seconds 2
    } else {
        Write-Host "Port $port belongs to another application ($($process.ProcessName)). Please close it manually." -ForegroundColor Red
        exit 1
    }
}

$maxWait = 10
$sw = [Diagnostics.Stopwatch]::StartNew()
while ((Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) -and ($sw.Elapsed.TotalSeconds -lt $maxWait)) {
    Start-Sleep -Seconds 1
}
if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
    Write-Host "Port $port is still in use after waiting. Cannot start backend." -ForegroundColor Red
    exit 1
}

Write-Host "Starting SpendWise backend (Spring Boot)..."
# 5. Use call operator to ensure we're executing in current process space and passing environment variables.
# We redirect stderr to stdout so we can catch start failures while still allowing color/native output.
try {
    & .\mvnw.cmd spring-boot:run
} catch {
    Write-Host "`n[ERROR] Spring Boot failed to start." -ForegroundColor Red
    Write-Host $_ -ForegroundColor Yellow
    exit 1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] Spring Boot failed to start. (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
    exit 1
}
