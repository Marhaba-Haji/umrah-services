# Amadeus API Setup for Airport Autosuggest

## Overview
The flight search functionality uses the Amadeus API to provide airport and city autosuggestions. If the API is not properly configured, the system will fall back to mock data.

## Current Status
- ✅ Mock data fallback is implemented
- ✅ Visual indicator shows when API is not available
- ❌ Amadeus API credentials need to be configured

## Setup Instructions

### 1. Get Amadeus API Credentials
1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Create an account and log in
3. Create a new application
4. Get your API Key and API Secret

### 2. Configure Supabase Environment Variables
You need to set the following environment variables in your Supabase project:

```bash
AMADEUS_API_KEY=your_amadeus_api_key_here
AMADEUS_API_SECRET=your_amadeus_api_secret_here
```

### 3. Set Environment Variables in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Go to the "Environment Variables" section
4. Add the following variables:
   - `AMADEUS_API_KEY`: Your Amadeus API key
   - `AMADEUS_API_SECRET`: Your Amadeus API secret

### 4. Redeploy the Function
After setting the environment variables, redeploy the Supabase function:

```bash
supabase functions deploy amadeus-airport-suggest
```

## Testing the API
1. Open the browser console
2. Navigate to the flight search page
3. Type in an airport or city name (e.g., "delhi", "mumbai", "jeddah")
4. Check the console for API test results

## Expected Behavior
- ✅ API working: Real airport/city suggestions from Amadeus
- ❌ API not working: Mock data with yellow warning indicator

## Mock Data Included
The fallback includes common airports and cities:
- **India**: DEL (Delhi), BOM (Mumbai), BLR (Bangalore), MAA (Chennai)
- **Saudi Arabia**: JED (Jeddah), RUH (Riyadh), DMM (Dammam)

## Troubleshooting
1. Check Supabase function logs for errors
2. Verify environment variables are set correctly
3. Ensure Amadeus API credentials are valid
4. Check network connectivity to Amadeus API

## API Endpoint
The function is deployed at:
```
https://rjyhoikoqhephrkjgebo.supabase.co/functions/v1/amadeus-airport-suggest
```

## Function Code Location
```
supabase/functions/amadeus-airport-suggest/index.ts
``` 