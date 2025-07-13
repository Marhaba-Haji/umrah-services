# PowerShell script: amadeus-deploy-automation.ps1
# 1. Sync Amadeus and Supabase keys from root .env to supabase/.env and Supabase secrets

Write-Host "\n=== Syncing secrets from .env to supabase/.env and Supabase secrets ===" -ForegroundColor Cyan
$rootEnv = Get-Content .env | Where-Object { $_ -match '=' }
$keysToSync = @('AMADEUS_API_KEY', 'AMADEUS_API_SECRET', 'SUPABASE_ANON_KEY')
$envDict = @{}
foreach ($line in $rootEnv) {
    $parts = $line -split '=', 2
    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    if ($keysToSync -contains $key) {
        $envDict[$key] = $value
    }
}

$supabaseEnvPath = "supabase/.env"
if (Test-Path $supabaseEnvPath) {
    $supabaseEnv = Get-Content $supabaseEnvPath | Where-Object { $_ -match '=' }
    $otherLines = $supabaseEnv | Where-Object { $keysToSync -notcontains ($_ -split '=',2)[0].Trim() }
    $newLines = $otherLines + ($envDict.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" })
    Set-Content $supabaseEnvPath $newLines
} else {
    $newLines = $envDict.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }
    Set-Content $supabaseEnvPath $newLines
}

$secretArgs = ($envDict.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ' '
if ($secretArgs) {
    supabase secrets set $secretArgs
    Write-Host "\n[32mSynced the following keys to supabase/.env and Supabase secrets: [0m"
    $envDict.GetEnumerator() | ForEach-Object { Write-Host ("  $($_.Key)=$($_.Value)") }
} else {
    Write-Host "No Amadeus or Supabase keys found in root .env to sync as secrets." -ForegroundColor Yellow
}

# 2. Deploy both edge functions
Write-Host "\n=== Deploying amadeus-airport-suggest ===" -ForegroundColor Cyan
supabase functions deploy amadeus-airport-suggest
Write-Host "\n=== Deploying amadeus-flight-search ===" -ForegroundColor Cyan
supabase functions deploy amadeus-flight-search

# 3. Test both functions with a sample request
$anonKey = $envDict['SUPABASE_ANON_KEY']
$projectUrl = "https://rjyhoikoqhephrkjgebo.supabase.co"

function Test-Function {
    param(
        [string]$functionName,
        [string]$testBody
    )
    Write-Host "\n=== Testing $functionName ===" -ForegroundColor Cyan
    $url = "$projectUrl/functions/v1/$functionName"
    try {
        $response = Invoke-RestMethod -Uri $url `
            -Method POST `
            -ContentType "application/json" `
            -Headers @{ "apikey" = $anonKey } `
            -Body $testBody `
            -ErrorAction Stop
        if ($response.data) {
            Write-Host "\u2705 $functionName is returning data! Sample result:"
            $response.data | ConvertTo-Json -Depth 3 | Write-Host
        } elseif ($response.error) {
            Write-Host "\u274c $functionName returned an error:"
            $response | ConvertTo-Json -Depth 3 | Write-Host
            Write-Host "\nFetching recent function logs for troubleshooting..."
            supabase functions logs $functionName
        } else {
            Write-Host "\u274c No data or error returned from $functionName. Check function logs for details."
            supabase functions logs $functionName
        }
    } catch {
        Write-Host "\u274c Exception occurred while testing $functionName: $_" -ForegroundColor Red
        supabase functions logs $functionName
    }
}

Test-Function "amadeus-airport-suggest" '{"keyword": "delhi", "subType": "AIRPORT,CITY"}'
Test-Function "amadeus-flight-search" '{"originLocationCode": "DEL", "destinationLocationCode": "JED", "departureDate": "2024-08-01", "adults": 1}'

Write-Host "\n\ud83d\ude80 All automation steps complete!" -ForegroundColor Green 