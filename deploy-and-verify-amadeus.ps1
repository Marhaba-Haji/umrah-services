# PowerShell script to automate setting Amadeus secrets, deploying, and verifying the Supabase function

# Load .env variables
$envVars = Get-Content .env | Where-Object { $_ -match '=' }
foreach ($line in $envVars) {
    $parts = $line -split '=', 2
    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    if ($key -eq 'AMADEUS_API_KEY') {
        $env:AMADEUS_API_KEY = $value
    } elseif ($key -eq 'AMADEUS_API_SECRET') {
        $env:AMADEUS_API_SECRET = $value
    } elseif ($key -eq 'SUPABASE_ANON_KEY') {
        $env:SUPABASE_ANON_KEY = $value
    }
}

# Set secrets in Supabase
Write-Host "`nSetting Supabase Edge Function secrets..."
supabase secrets set AMADEUS_API_KEY=$env:AMADEUS_API_KEY AMADEUS_API_SECRET=$env:AMADEUS_API_SECRET

# Deploy the function
Write-Host "`nDeploying amadeus-airport-suggest function..."
supabase functions deploy amadeus-airport-suggest

# Wait a few seconds for deployment to propagate
Start-Sleep -Seconds 5

# Test the function with a sample request
Write-Host "`nTesting the deployed function with a sample request..."
$anonKey = $env:SUPABASE_ANON_KEY
$response = Invoke-RestMethod -Uri "https://rjyhoikoqhephrkjgebo.supabase.co/functions/v1/amadeus-airport-suggest" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ "apikey" = $anonKey } `
    -Body '{"keyword": "delhi", "subType": "AIRPORT,CITY"}' `
    -ErrorAction SilentlyContinue

if ($response.data) {
    Write-Host "`n✅ Function is returning data! Sample result:"
    $response.data | ConvertTo-Json -Depth 3 | Write-Host
} elseif ($response.error) {
    Write-Host "`n❌ Function returned an error:"
    $response | ConvertTo-Json -Depth 3 | Write-Host
    Write-Host "`nFetching recent function logs for troubleshooting..."
    supabase functions logs amadeus-airport-suggest
} else {
    Write-Host "`n❌ No data or error returned. Check function logs for details."
    supabase functions logs amadeus-airport-suggest
}

Write-Host "`n🚀 Automation complete!" 