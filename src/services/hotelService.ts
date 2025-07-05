
import { supabase } from "@/integrations/supabase/client";

export interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
  radius?: number;
  priceRange?: string;
  hotelName?: string;
}

export interface AmadeusHotelOffer {
  id: string;
  hotel: {
    hotelId: string;
    name: string;
    cityCode: string;
    latitude?: number;
    longitude?: number;
    address?: {
      lines?: string[];
      postalCode?: string;
      cityName?: string;
      countryCode?: string;
    };
    contact?: {
      phone?: string;
      fax?: string;
    };
    description?: {
      text?: string;
      lang?: string;
    };
    amenities?: string[];
    media?: Array<{
      uri: string;
      category: string;
    }>;
    rating?: number;
  };
  offers: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    rateCode?: string;
    rateFamilyEstimated?: {
      code: string;
      type: string;
    };
    room: {
      type: string;
      typeEstimated?: {
        category: string;
        beds: number;
        bedType: string;
      };
      description?: {
        text: string;
        lang: string;
      };
    };
    guests: {
      adults: number;
    };
    price: {
      currency: string;
      total: string;
      base?: string;
      taxes?: Array<{
        code: string;
        amount: string;
        currency: string;
        description?: string;
      }>;
      variations?: {
        average?: {
          base: string;
        };
        changes?: Array<{
          startDate: string;
          endDate: string;
          base: string;
        }>;
      };
    };
    policies?: {
      paymentType?: string;
      cancellation?: {
        type: string;
        amount?: string;
        numberOfNights?: number;
        deadline?: string;
      };
    };
  }>;
  self?: string;
}

export interface HotelSearchResponse {
  data: AmadeusHotelOffer[];
  meta?: {
    count: number;
    links?: {
      self: string;
    };
  };
  warnings?: Array<{
    code: number;
    title: string;
    detail: string;
    source?: {
      pointer: string;
      parameter: string;
    };
  }>;
}

export const searchHotels = async (params: HotelSearchParams): Promise<HotelSearchResponse> => {
  try {
    console.log('Searching hotels with params:', params);
    
    const { data, error } = await supabase.functions.invoke('amadeus-hotel-search', {
      body: params,
    });

    if (error) {
      console.error('Hotel search error:', error);
      throw new Error(error.message || 'Hotel search failed');
    }

    if (!data) {
      throw new Error('No hotel data returned');
    }

    return data;
  } catch (error) {
    console.error('Hotel search service error:', error);
    throw error;
  }
};

// Updated city codes for Saudi Arabia - using correct IATA codes
export const CITY_CODES = {
  // Try multiple approaches for Makkah/Mecca
  MAKKAH: 'JED', // Use Jeddah as closest major airport/city to Makkah
  MADINAH: 'MED', // Madinah
  JEDDAH: 'JED',  // Jeddah (King Abdulaziz International Airport)
  RIYADH: 'RUH',  // Riyadh
  // Alternative approach - try coordinates for Makkah
  MAKKAH_ALT: 'MAC' // Keep as backup
} as const;

export type CityCode = typeof CITY_CODES[keyof typeof CITY_CODES];
