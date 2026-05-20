param(
  [int]$Port = 5173
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$url = "http://127.0.0.1:$Port"

Set-Location $repoRoot

if (-not (Test-Path "node_modules")) {
  npm install
}

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
foreach ($connection in $connections) {
  $processId = $connection.OwningProcess
  if ($processId -and $processId -ne 0) {
    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $processId" -ErrorAction SilentlyContinue
    if ($process -and $process.CommandLine -like "*microsoft-ai-security-navigator*") {
      Stop-Process -Id $processId -Force
    }
  }
}

$env:VITE_BASE_PATH = "/"
npm run build

Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "preview", "--", "--host", "127.0.0.1", "--port", "$Port") -WorkingDirectory $repoRoot

$ready = $false
$lastError = $null
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Milliseconds 500
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
      $ready = $true
      break
    }
  }
  catch {
    $lastError = $_.Exception.Message
  }
}

if (-not $ready) {
  throw "The local preview server did not start at $url. Last error: $lastError"
}

Start-Process $url
Write-Host "Microsoft AI Security Navigator is running at $url"
