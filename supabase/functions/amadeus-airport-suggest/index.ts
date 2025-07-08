import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
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
      ? "https://api.amadeus.com"
      : "https://test.api.amadeus.com";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const tokenUrl = `${this.baseUrl}/v1/security/oauth2/token`;

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get access token: ${response.statusText} - ${errorText}`,
      );
    }

    const data: AmadeusTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    return this.accessToken;
  }

  async getAirportSuggestions(keyword: string, subType: string = "AIRPORT") {
    const token = await this.getAccessToken();
    const url = new URL(`${this.baseUrl}/v1/reference-data/locations`);
    url.searchParams.append("keyword", keyword);
    url.searchParams.append("subType", subType);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Airport suggest failed: ${response.statusText} - ${errorText}`,
      );
    }
    const data = await response.json();
    return data;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword, subType } = await req.json();
    if (!keyword || typeof keyword !== "string" || keyword.length < 2) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'keyword' (min 2 chars)" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }
    const clientId = Deno.env.get("AMADEUS_API_KEY");
    const clientSecret = Deno.env.get("AMADEUS_API_SECRET");
    if (!clientId || !clientSecret) {
      throw new Error("Amadeus API credentials not configured");
    }
    const amadeus = new AmadeusAPI(clientId, clientSecret, false);
    const results = await amadeus.getAirportSuggestions(keyword, subType);
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in amadeus-airport-suggest function:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        details: "Check the function logs for more details",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
