import React from "react";
import FlightSearch, { FlightOffer } from "./FlightSearch";
import { AmadeusFlightOffer } from "@/services/flightService";

interface FlightCartDetails {
  airline: string;
  flightNumber: string;
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
  duration: string;
  stops: number;
  cabin: string;
  aircraft?: string;
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  adults: number;
  children: number;
  infants: number;
}

interface CartItem {
  id: string;
  type: "hotel" | "flight" | "transport" | "visa" | "guide" | "ziarath";
  name: string;
  price: number;
  details?: FlightCartDetails;
}

interface FlightStepProps {
  onFlightSelect: (flight: FlightCartDetails) => void;
  results: FlightOffer[];
  setResults: (flights: FlightOffer[]) => void;
}

const FlightStep: React.FC<FlightStepProps> = ({
  onFlightSelect,
  results,
  setResults,
}) => {
  return (
    <FlightSearch
      onFlightSelect={(flight, searchParams) => {
    // Extract per-traveler-type prices from rawOffer if available
        let adultPrice = 0,
          childPrice = 0,
          infantPrice = 0;
        
        if (flight.rawOffer && typeof flight.rawOffer === 'object' && 'travelerPricings' in flight.rawOffer) {
          const rawOffer = flight.rawOffer as AmadeusFlightOffer;
          const getInr = (p: AmadeusFlightOffer["travelerPricings"][number]) =>
            p
              ? Math.round(
                  parseFloat(p.price.total) *
                    (p.price.currency === "INR"
                      ? 1
                      : p.price.currency === "USD"
                        ? 83.5
                        : 1),
                )
              : 0;
          const adult = rawOffer.travelerPricings.find(
            (p) => p.travelerType === "ADULT",
          );
          const child = rawOffer.travelerPricings.find(
            (p) => p.travelerType === "CHILD",
          );
          const infant = rawOffer.travelerPricings.find(
            (p) =>
              p.travelerType === "HELD_INFANT" || p.travelerType === "INFANT",
          );
          adultPrice = getInr(adult);
          childPrice = getInr(child);
          infantPrice = getInr(infant);
        }
        
        const flightDetails: FlightCartDetails = {
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
          infants: searchParams.infants,
        };
        
        onFlightSelect(flightDetails);
      }}
    />
  );
};

export default FlightStep;
