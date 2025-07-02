import React from 'react';
import FlightSearch, { FlightOffer } from './FlightSearch';
import { AmadeusFlightOffer } from '@/services/flightService';

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  details?: Record<string, unknown>;
}

interface FlightStepProps {
  onFlightSelect: (flight: Omit<CartItem, 'quantity'>) => void;
  initialAdults?: number;
  initialChildren?: number;
  initialInfants?: number;
}

// TravelerPricing type from AmadeusFlightOffer
interface TravelerPricing {
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
}

const FlightStep: React.FC<FlightStepProps> = ({ onFlightSelect, initialAdults = 1, initialChildren = 0, initialInfants = 0 }) => {
  return <FlightSearch 
    onFlightSelect={(flight, searchParams) => {
      // Extract per-traveler-type prices from rawOffer if available
      let adultPrice = 0, childPrice = 0, infantPrice = 0;
      if (flight.rawOffer && flight.rawOffer.travelerPricings) {
        const getInr = (p: TravelerPricing | undefined) => p ? Math.round(parseFloat(p.price.total) * (p.price.currency === 'INR' ? 1 : (p.price.currency === 'USD' ? 83.5 : 1))) : 0;
        const adult = flight.rawOffer.travelerPricings.find((p: TravelerPricing) => p.travelerType === 'ADULT');
        const child = flight.rawOffer.travelerPricings.find((p: TravelerPricing) => p.travelerType === 'CHILD');
        const infant = flight.rawOffer.travelerPricings.find((p: TravelerPricing) => p.travelerType === 'HELD_INFANT' || p.travelerType === 'INFANT');
        adultPrice = getInr(adult);
        childPrice = getInr(child);
        infantPrice = getInr(infant);
      }
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: flight.id,
        type: 'flight',
        name: `${flight.airline} ${flight.flightNumber} - ${flight.departure.iataCode} to ${flight.arrival.iataCode}`,
        price: parseFloat(flight.price.total), // will be recalculated in cart
        details: {
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          departure: flight.departure,
          arrival: flight.arrival,
          duration: flight.duration,
          stops: flight.stops,
          cabin: flight.cabin,
          aircraft: flight.aircraft,
          adultPrice,
          childPrice,
          infantPrice,
          adults: searchParams.adults,
          children: searchParams.children,
          infants: searchParams.infants
        }
      };
      onFlightSelect(cartItem);
    }}
    initialAdults={initialAdults}
    initialChildren={initialChildren}
    initialInfants={initialInfants}
  />;
};

export default FlightStep;
