# PowerShell script to automate setting Amadeus secrets and deploying the Supabase function

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
    }
}

# Set secrets in Supabase
Write-Host "Setting Supabase Edge Function secrets..."
supabase secrets set AMADEUS_API_KEY=$env:AMADEUS_API_KEY AMADEUS_API_SECRET=$env:AMADEUS_API_SECRET

# Deploy the function
Write-Host "Deploying amadeus-airport-suggest function..."
supabase functions deploy amadeus-airport-suggest

Write-Host "✅ Deployment complete!" 