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
}

const FlightStep: React.FC<FlightStepProps> = ({ onFlightSelect }) => {
  return <FlightSearch onFlightSelect={(flight, searchParams) => {
    // Extract per-traveler-type prices from rawOffer if available
    let adultPrice = 0, childPrice = 0, infantPrice = 0;
    if (flight.rawOffer && flight.rawOffer.travelerPricings) {
      const getInr = (p) => p ? Math.round(parseFloat(p.price.total) * (p.price.currency === 'INR' ? 1 : (p.price.currency === 'USD' ? 83.5 : 1))) : 0;
      const adult = flight.rawOffer.travelerPricings.find((p: any) => p.travelerType === 'ADULT');
      const child = flight.rawOffer.travelerPricings.find((p: any) => p.travelerType === 'CHILD');
      const infant = flight.rawOffer.travelerPricings.find((p: any) => p.travelerType === 'HELD_INFANT' || p.travelerType === 'INFANT');
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
  }} />;
};

export default FlightStep;
