# PowerShell script to sync Amadeus and Supabase keys from root .env to supabase/.env and Supabase secrets

# 1. Read root .env
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

# 2. Write to supabase/.env (overwrite or add only these keys)
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

# 3. Set as Supabase secrets
$secretArgs = ($envDict.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ' '
if ($secretArgs) {
    supabase secrets set $secretArgs
} else {
    Write-Host "No Amadeus or Supabase keys found in root .env to sync as secrets." -ForegroundColor Yellow
}

# 4. Print summary
Write-Host "\n✅ Synced the following keys to supabase/.env and Supabase secrets:" -ForegroundColor Green
$envDict.GetEnumerator() | ForEach-Object { Write-Host ("  " + $_.Key + "=" + $_.Value) } 