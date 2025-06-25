
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean;
  max?: number;
}

class AmadeusAPI {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(clientId: string, clientSecret: string, isProduction = false) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = isProduction 
      ? 'https://api.amadeus.com' 
      : 'https://test.api.amadeus.com';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const tokenUrl = `${this.baseUrl}/v1/security/oauth2/token`;
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.statusText} - ${errorText}`);
    }

    const data: AmadeusTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
    
    return this.accessToken;
  }

  async searchFlights(params: FlightSearchParams) {
    const token = await this.getAccessToken();
    
    const url = new URL(`${this.baseUrl}/v2/shopping/flight-offers`);
    
    url.searchParams.append('originLocationCode', params.originLocationCode);
    url.searchParams.append('destinationLocationCode', params.destinationLocationCode);
    url.searchParams.append('departureDate', params.departureDate);
    url.searchParams.append('adults', params.adults.toString());
    
    if (params.returnDate) {
      url.searchParams.append('returnDate', params.returnDate);
    }
    if (params.children && params.children > 0) {
      url.searchParams.append('children', params.children.toString());
    }
    if (params.infants && params.infants > 0) {
      url.searchParams.append('infants', params.infants.toString());
    }
    if (params.travelClass) {
      url.searchParams.append('travelClass', params.travelClass);
    }
    if (params.nonStop) {
      url.searchParams.append('nonStop', 'true');
    }
    if (params.max) {
      url.searchParams.append('max', params.max.toString());
    }

    console.log('Making request to:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Flight search failed:', response.statusText, errorData);
      throw new Error(`Flight search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const searchParams: FlightSearchParams = await req.json();
    
    const clientId = Deno.env.get('AMADEUS_API_KEY');
    const clientSecret = Deno.env.get('AMADEUS_API_SECRET');
    
    if (!clientId || !clientSecret) {
      throw new Error('Amadeus API credentials not configured');
    }

    const amadeus = new AmadeusAPI(clientId, clientSecret, false); // Use test environment
    
    console.log('Searching flights with params:', searchParams);
    const results = await amadeus.searchFlights(searchParams);
    
    console.log('Flight search successful, found:', results.data?.length || 0, 'offers');
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error in amadeus-flight-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more details'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
