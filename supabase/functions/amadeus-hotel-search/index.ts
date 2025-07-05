
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
  radius?: number;
  priceRange?: string;
  hotelName?: string;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAmadeusToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = Deno.env.get('AMADEUS_API_KEY');
  const clientSecret = Deno.env.get('AMADEUS_API_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus API credentials not configured');
  }

  const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Amadeus token: ${response.statusText}`);
  }

  const data: AmadeusTokenResponse = await response.json();
  cachedToken = data.access_token;
  // Set expiry to 5 minutes before actual expiry for safety
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  return cachedToken;
}

async function searchHotels(params: HotelSearchParams) {
  const token = await getAmadeusToken();
  
  const url = new URL('https://test.api.amadeus.com/v3/shopping/hotel-offers');
  
  // Add required parameters
  url.searchParams.append('cityCode', params.cityCode);
  url.searchParams.append('checkInDate', params.checkInDate);
  url.searchParams.append('checkOutDate', params.checkOutDate);
  url.searchParams.append('adults', params.adults.toString());
  
  // Add optional parameters
  if (params.roomQuantity) {
    url.searchParams.append('roomQuantity', params.roomQuantity.toString());
  }
  if (params.radius) {
    url.searchParams.append('radius', params.radius.toString());
  }
  if (params.hotelName) {
    url.searchParams.append('hotelName', params.hotelName);
  }

  console.log('Hotel search URL:', url.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Hotel search error:', errorText);
    throw new Error(`Hotel search failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: HotelSearchParams = await req.json();
    
    console.log('Hotel search params:', params);
    
    // Validate required parameters
    if (!params.cityCode || !params.checkInDate || !params.checkOutDate || !params.adults) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: cityCode, checkInDate, checkOutDate, adults' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const hotelData = await searchHotels(params);

    return new Response(JSON.stringify(hotelData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in hotel search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: 'Hotel search failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
