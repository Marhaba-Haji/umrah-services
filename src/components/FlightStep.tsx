
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
  const handleFlightSelect = (flight: FlightOffer) => {
    // Transform FlightOffer to CartItem format
    const cartItem: Omit<CartItem, 'quantity'> = {
      id: flight.id,
      type: 'flight',
      name: `${flight.airline} ${flight.flightNumber} - ${flight.departure.iataCode} to ${flight.arrival.iataCode}`,
      price: parseFloat(flight.price.total),
      details: {
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departure: flight.departure,
        arrival: flight.arrival,
        duration: flight.duration,
        stops: flight.stops,
        cabin: flight.cabin,
        aircraft: flight.aircraft
      }
    };
    
    onFlightSelect(cartItem);
  };

  return <FlightSearch onFlightSelect={handleFlightSelect} />;
};

export default FlightStep;
