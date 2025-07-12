# Amadeus Edge Function Healthcheck Script
# 1. Check for required secrets
# 2. Deploy the function
# 3. Test the endpoint
# 4. Show logs if error

# Check for required secrets
Write-Host "Checking for required Supabase secrets..."
$secrets = supabase secrets list | Out-String
if ($secrets -notmatch "AMADEUS_API_KEY" -or $secrets -notmatch "AMADEUS_API_SECRET") {
    Write-Host "❌ AMADEUS_API_KEY or AMADEUS_API_SECRET is missing in Supabase secrets!" -ForegroundColor Red
    Write-Host "Set them in the Supabase dashboard or with:"
    Write-Host "supabase secrets set AMADEUS_API_KEY=... AMADEUS_API_SECRET=..."
    exit 1
} else {
    Write-Host "✅ Required secrets are set."
}

# Deploy the function
Write-Host "\nDeploying amadeus-airport-suggest function..."
supabase functions deploy amadeus-airport-suggest

# Wait a few seconds for deployment to propagate
Start-Sleep -Seconds 5

# Test the deployed endpoint
Write-Host "\nTesting the deployed function with a sample request..."
$testBody = '{"keyword": "delhi", "subType": "AIRPORT,CITY"}'
$response = Invoke-RestMethod -Uri "https://rjyhoikoqhephrkjgebo.supabase.co/functions/v1/amadeus-airport-suggest" `
    -Method POST `
    -ContentType "application/json" `
    -Body $testBody `
    -ErrorAction SilentlyContinue

if ($response.data) {
    Write-Host "\n✅ Function is returning data! Sample result:"
    $response.data | ConvertTo-Json -Depth 3 | Write-Host
} elseif ($response.error) {
    Write-Host "\n❌ Function returned an error:"
    $response | ConvertTo-Json -Depth 3 | Write-Host
    Write-Host "\nFetching recent function logs for troubleshooting..."
    supabase functions logs amadeus-airport-suggest
} else {
    Write-Host "\n❌ No data or error returned. Check function logs for details."
    supabase functions logs amadeus-airport-suggest
}

Write-Host "\n🚦 Healthcheck complete!" 