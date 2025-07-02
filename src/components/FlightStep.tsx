
import React from 'react';
import FlightSearch, { FlightOffer } from './FlightSearch';

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  details?: any;
}

interface FlightStepProps {
  onFlightSelect: (flight: Omit<CartItem, 'quantity'>) => void;
  groupSize?: {
    adults: number;
    children: number;
    infants: number;
  };
}

const FlightStep: React.FC<FlightStepProps> = ({ onFlightSelect, groupSize }) => {
  return <FlightSearch 
    onFlightSelect={(flight, searchParams) => {
      // Calculate total price based on passenger types and their respective prices
      let totalPrice = 0;
      const adults = searchParams.adults || groupSize?.adults || 1;
      const children = searchParams.children || groupSize?.children || 0;
      const infants = searchParams.infants || groupSize?.infants || 0;

      // Extract per-traveler-type prices from rawOffer if available
      if (flight.rawOffer && flight.rawOffer.travelerPricings) {
        const getInr = (p) => p ? Math.round(parseFloat(p.price.total) * (p.price.currency === 'INR' ? 1 : (p.price.currency === 'USD' ? 83.5 : 1))) : 0;
        const adultPricing = flight.rawOffer.travelerPricings.find((p: any) => p.travelerType === 'ADULT');
        const childPricing = flight.rawOffer.travelerPricings.find((p: any) => p.travelerType === 'CHILD');
        const infantPricing = flight.rawOffer.travelerPricings.find((p: any) => p.travelerType === 'HELD_INFANT' || p.travelerType === 'INFANT');
        
        const adultPrice = getInr(adultPricing);
        const childPrice = getInr(childPricing);
        const infantPrice = getInr(infantPricing);
        
        totalPrice = (adultPrice * adults) + (childPrice * children) + (infantPrice * infants);
      } else {
        // Fallback to base price multiplied by total passengers
        const basePrice = parseFloat(flight.price.total);
        const inrPrice = flight.price.currency === 'INR' ? basePrice : (flight.price.currency === 'USD' ? basePrice * 83.5 : basePrice);
        totalPrice = Math.round(inrPrice * (adults + children + infants));
      }

      const cartItem: Omit<CartItem, 'quantity'> = {
        id: flight.id,
        type: 'flight',
        name: `${flight.airline} ${flight.flightNumber} - ${flight.departure.iataCode} to ${flight.arrival.iataCode}`,
        price: totalPrice,
        details: {
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          departure: flight.departure,
          arrival: flight.arrival,
          duration: flight.duration,
          stops: flight.stops,
          cabin: flight.cabin,
          aircraft: flight.aircraft,
          adults,
          children,
          infants,
          rawOffer: flight.rawOffer
        }
      };
      onFlightSelect(cartItem);
    }} 
    initialPassengers={groupSize}
  />;
};

export default FlightStep;
