
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
    console.log('Using cached token');
    return cachedToken;
  }

  const clientId = Deno.env.get('AMADEUS_API_KEY');
  const clientSecret = Deno.env.get('AMADEUS_API_SECRET');

  console.log('Amadeus credentials check:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdLength: clientId?.length || 0
  });

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus API credentials not configured');
  }

  const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  
  console.log('Requesting new token from:', tokenUrl);
  
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
    const errorText = await response.text();
    console.error('Token request failed:', response.status, errorText);
    throw new Error(`Failed to get Amadeus token: ${response.status} ${response.statusText}`);
  }

  const data: AmadeusTokenResponse = await response.json();
  console.log('Token received successfully, expires in:', data.expires_in, 'seconds');
  
  cachedToken = data.access_token;
  // Set expiry to 5 minutes before actual expiry for safety
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  return cachedToken;
}

async function searchHotels(params: HotelSearchParams) {
  console.log('Getting Amadeus token...');
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
  console.log('Request headers will include Authorization: Bearer [token]');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Hotel search API error:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: errorText
    });
    throw new Error(`Hotel search failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Hotel search response received:', {
    dataKeys: Object.keys(data),
    dataCount: data.data?.length || 0,
    hasWarnings: !!data.warnings,
    warnings: data.warnings
  });
  
  return data;
}

serve(async (req) => {
  console.log('Hotel search function called:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const params: HotelSearchParams = await req.json();
    
    console.log('Hotel search params received:', params);
    
    // Validate required parameters
    if (!params.cityCode || !params.checkInDate || !params.checkOutDate || !params.adults) {
      const error = 'Missing required parameters: cityCode, checkInDate, checkOutDate, adults';
      console.error('Validation error:', error, { received: params });
      return new Response(
        JSON.stringify({ error }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate date format and ensure checkout is after checkin
    const checkIn = new Date(params.checkInDate);
    const checkOut = new Date(params.checkOutDate);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      const error = 'Invalid date format. Use YYYY-MM-DD format.';
      console.error('Date validation error:', error, { checkIn: params.checkInDate, checkOut: params.checkOutDate });
      return new Response(
        JSON.stringify({ error }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (checkOut <= checkIn) {
      const error = 'Check-out date must be after check-in date';
      console.error('Date logic error:', error, { checkIn, checkOut });
      return new Response(
        JSON.stringify({ error }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('All validations passed, calling hotel search...');
    const hotelData = await searchHotels(params);

    console.log('Hotel search completed successfully');
    return new Response(JSON.stringify(hotelData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in hotel search function:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific error types
      if (error.message.includes('credentials not configured')) {
        statusCode = 503;
        errorMessage = 'Service temporarily unavailable - API credentials not configured';
      } else if (error.message.includes('Hotel search failed')) {
        statusCode = 502;
        errorMessage = 'External API error - ' + error.message;
      } else if (error.message.includes('Failed to get Amadeus token')) {
        statusCode = 503;
        errorMessage = 'Authentication service unavailable';
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Hotel search failed',
        timestamp: new Date().toISOString()
      }),
      { 
        status: statusCode, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
