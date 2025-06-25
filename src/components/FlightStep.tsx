
import React from 'react';
import FlightSearch, { FlightOffer } from './FlightSearch';

interface FlightStepProps {
  onFlightSelect: (flight: FlightOffer) => void;
}

const FlightStep: React.FC<FlightStepProps> = ({ onFlightSelect }) => {
  const handleFlightSelect = (flight: FlightOffer) => {
    // Transform FlightOffer to CartItem format
    const cartItem = {
      id: flight.id,
      type: 'flight' as const,
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
    
    onFlightSelect(cartItem as any);
  };

  return <FlightSearch onFlightSelect={handleFlightSelect} />;
};

export default FlightStep;
