interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AmadeusFlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  nonStop?: boolean;
  max?: number;
}

interface AmadeusHotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
  radius?: number;
  hotelName?: string;
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
    // Check if we have a valid token
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
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data: AmadeusTokenResponse = await response.json();
    this.accessToken = data.access_token;
    // Set expiry to 5 minutes before actual expiry for safety
    this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    return this.accessToken;
  }

  async searchFlights(params: AmadeusFlightSearchParams) {
    const token = await this.getAccessToken();

    const url = new URL(`${this.baseUrl}/v2/shopping/flight-offers`);

    // Add required parameters
    url.searchParams.append("originLocationCode", params.originLocationCode);
    url.searchParams.append(
      "destinationLocationCode",
      params.destinationLocationCode,
    );
    url.searchParams.append("departureDate", params.departureDate);
    url.searchParams.append("adults", params.adults.toString());

    // Add optional parameters
    if (params.returnDate) {
      url.searchParams.append("returnDate", params.returnDate);
    }
    if (params.children && params.children > 0) {
      url.searchParams.append("children", params.children.toString());
    }
    if (params.infants && params.infants > 0) {
      url.searchParams.append("infants", params.infants.toString());
    }
    if (params.travelClass) {
      url.searchParams.append("travelClass", params.travelClass);
    }
    if (params.nonStop) {
      url.searchParams.append("nonStop", "true");
    }
    if (params.max) {
      url.searchParams.append("max", params.max.toString());
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Flight search failed: ${response.statusText} - ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();
    return data;
  }

  async getAirportInfo(keyword: string) {
    const token = await this.getAccessToken();

    const url = new URL(`${this.baseUrl}/v1/reference-data/locations`);
    url.searchParams.append("subType", "AIRPORT");
    url.searchParams.append("keyword", keyword);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Airport search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async searchHotels(params: AmadeusHotelSearchParams) {
    const token = await this.getAccessToken();
    const url = new URL(`${this.baseUrl}/v3/shopping/hotel-offers`);
    url.searchParams.append("cityCode", params.cityCode);
    url.searchParams.append("checkInDate", params.checkInDate);
    url.searchParams.append("checkOutDate", params.checkOutDate);
    url.searchParams.append("adults", params.adults.toString());
    if (params.roomQuantity)
      url.searchParams.append("roomQuantity", params.roomQuantity.toString());
    if (params.radius)
      url.searchParams.append("radius", params.radius.toString());
    if (params.hotelName)
      url.searchParams.append("hotelName", params.hotelName);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Hotel search failed: ${response.statusText} - ${JSON.stringify(errorData)}`,
      );
    }
    const data = await response.json();
    return data;
  }

  async getHotelIdsByCity(cityCode: string): Promise<string[]> {
    const token = await this.getAccessToken();
    const url = new URL(
      `${this.baseUrl}/v1/reference-data/locations/hotels/by-city`,
    );
    url.searchParams.append("cityCode", cityCode);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Hotel ID fetch failed: ${response.statusText} - ${JSON.stringify(errorData)}`,
      );
    }
    const data = await response.json();
    return (data.data || []).map(
      (hotel: unknown) => (hotel as { hotelId: string }).hotelId,
    );
  }
}

export { AmadeusAPI };
export type { AmadeusFlightSearchParams, AmadeusHotelSearchParams };
