import { supabase } from "@/integrations/supabase/client";

export interface FlightSearchRequest {
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

export interface AmadeusFlightOffer {
  id: string;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags: {
        quantity: number;
      };
    }>;
  }>;
}

export interface AmadeusFlightSearchResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: AmadeusFlightOffer[];
  dictionaries: {
    locations: Record<
      string,
      {
        cityCode: string;
        countryCode: string;
      }
    >;
    aircraft: Record<string, string>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
}

interface TTSFlightSearchBody {
  UserIp: string;
  Adult: number;
  Child: number;
  Infant: number;
  DirectFlight: boolean;
  JourneyType: number;
  PreferredCarriers: string[];
  CabinClass: number;
  SeriesFare: null;
  AirSegments: Array<{
    Origin: string;
    Destination: string;
    PreferredTime: string;
  }>;
}

// TTS API flight search for PackageDetailDynamic only
export const searchFlights = async (
  params: FlightSearchRequest,
): Promise<unknown> => {
  // Map the params to TTS API expected payload
  const TTS_BASEURL = "https://www.stagingapi.bdsd.technology/api";
  const USERNAME = "TTS";
  const PASSWORD = "Tts@001";

  // Build AirSegments array
  const AirSegments = [
    {
      Origin: params.originLocationCode,
      Destination: params.destinationLocationCode,
      PreferredTime: params.departureDate + "T00:00:00",
    },
  ];

  const body: TTSFlightSearchBody = {
    UserIp: "122.161.64.143", // You may want to dynamically get the user's IP
    Adult: params.adults,
    Child: params.children || 0,
    Infant: params.infants || 0,
    DirectFlight: params.nonStop || false,
    JourneyType: params.returnDate ? 2 : 1, // 1: oneway, 2: roundtrip
    PreferredCarriers: [],
    CabinClass: params.travelClass === "BUSINESS" ? 2 : 1, // 1: Economy, 2: Business, 3: First
    SeriesFare: null,
    AirSegments,
  };

  // If roundtrip, add return segment
  if (params.returnDate) {
    body.AirSegments.push({
      Origin: params.destinationLocationCode,
      Destination: params.originLocationCode,
      PreferredTime: params.returnDate + "T00:00:00",
    });
  }

  const response = await fetch(`${TTS_BASEURL}/airservice/rest/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Username: USERNAME,
      Password: PASSWORD,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `TTS Flight search failed: ${response.status} ${errorText}`,
    );
  }

  const data = await response.json();
  return data;
};
