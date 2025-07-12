# PowerShell script to test the amadeus-airport-suggest Supabase Edge Function

# Load anon key from .env if not already loaded
if (-not $env:SUPABASE_ANON_KEY) {
    $envVars = Get-Content .env | Where-Object { $_ -match '=' }
    foreach ($line in $envVars) {
        $parts = $line -split '=', 2
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        if ($key -eq 'SUPABASE_ANON_KEY') {
            $env:SUPABASE_ANON_KEY = $value
        }
    }
}
$anonKey = $env:SUPABASE_ANON_KEY

$response = Invoke-RestMethod -Uri "https://rjyhoikoqhephrkjgebo.supabase.co/functions/v1/amadeus-airport-suggest" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ "apikey" = $anonKey } `
    -Body '{"keyword": "delhi", "subType": "AIRPORT,CITY"}' `
    -ErrorAction SilentlyContinue

if ($response) {
    $response | ConvertTo-Json -Depth 5 | Write-Host
} else {
    Write-Host "No response or error from function."
} 