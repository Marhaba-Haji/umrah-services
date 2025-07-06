import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { supabase } from "@/integrations/supabase/client";
import { Search } from 'lucide-react';

interface FlightSearchParams {
  tripType: "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY";
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: Date;
  returnDate?: Date;
  adults: number;
  children: number;
  infants: number;
  travelClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  nonStop: boolean;
}

interface Airport {
  iataCode: string;
  name: string;
  address: {
    cityName: string;
    countryCode: string;
  };
}

interface AmadeusFlightOffer {
  id: string;
  itineraries: any[];
  price: {
    total: string;
    currency: string;
  };
  dictionaries?: {
    locations: { [key: string]: any };
    aircraft: { [key: string]: any };
  };
}

const FlightSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    tripType: "ROUND_TRIP",
    originLocationCode: "",
    destinationLocationCode: "",
    departureDate: new Date(),
    returnDate: new Date(),
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: "ECONOMY",
    nonStop: false,
  });

  const [airports, setAirports] = useState<Airport[]>([]);
  const [originAirports, setOriginAirports] = useState<Airport[]>([]);
  const [destinationAirports, setDestinationAirports] = useState<Airport[]>([]);
  const [isOriginDropdownOpen, setIsOriginDropdownOpen] = useState(false);
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] = useState(false);
  const [flightOffers, setFlightOffers] = useState<AmadeusFlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const { data, error } = await supabase
          .from('airports')
          .select(`
            iataCode,
            name,
            address
          `);

        if (error) throw error;
        setAirports(data as Airport[]);
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    };

    fetchAirports();
  }, []);

  const handleOriginChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      originLocationCode: value
    }));
    setOriginAirports(
      airports.filter(airport => airport.name.toLowerCase().includes(value.toLowerCase()))
    );
    setIsOriginDropdownOpen(true);
  };

  const handleDestinationChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      destinationLocationCode: value
    }));
    setDestinationAirports(
      airports.filter(airport => airport.name.toLowerCase().includes(value.toLowerCase()))
    );
    setIsDestinationDropdownOpen(true);
  };

  const handleDepartureDateChange = (date: Date | undefined) => {
    if (date) {
      setSearchParams(prev => ({
        ...prev,
        departureDate: date
      }));
    }
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    if (date) {
      setSearchParams(prev => ({
        ...prev,
        returnDate: date
      }));
    }
  };

  const handleAdultsChange = (value: number) => {
    setSearchParams(prev => ({
      ...prev,
      adults: value
    }));
  };

  const handleChildrenChange = (value: number) => {
    setSearchParams(prev => ({
      ...prev,
      children: value
    }));
  };

  const handleInfantsChange = (value: number) => {
    setSearchParams(prev => ({
      ...prev,
      infants: value
    }));
  };

  const handleTripTypeChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      tripType: value as "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY"
    }));
  };

  const handleNonStopChange = (value: boolean) => {
    setSearchParams(prev => ({
      ...prev,
      nonStop: value
    }));
  };

  const handleTravelClassChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      travelClass: value as "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST"
    }));
  };

  const handleAirportSelection = (airport: Airport, type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setSearchParams(prev => ({
        ...prev,
        originLocationCode: airport.iataCode
      }));
      setIsOriginDropdownOpen(false);
    } else {
      setSearchParams(prev => ({
        ...prev,
        destinationLocationCode: airport.iataCode
      }));
      setIsDestinationDropdownOpen(false);
    }
  };

  const handleSearchFlights = async () => {
    setIsLoading(true);
    try {
      const formattedDepartureDate = searchParams.departureDate.toISOString().split('T')[0];
      const formattedReturnDate = searchParams.returnDate?.toISOString().split('T')[0];

      const { data, error } = await supabase.functions.invoke('amadeus-flight-offers', {
        body: {
          ...searchParams,
          departureDate: formattedDepartureDate,
          returnDate: formattedReturnDate,
        }
      });

      if (error) {
        console.error('Error fetching flight offers:', error);
      } else {
        setFlightOffers(data);
      }
    } catch (error) {
      console.error('Error during flight search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAirportOption = (airport: Airport) => (
    <div key={airport.iataCode} className="flex items-center space-x-3 p-2 hover:bg-gray-50 cursor-pointer" onClick={() => handleAirportSelection(airport, originAirports.includes(airport) ? 'origin' : 'destination')}>
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-xs font-semibold text-blue-700">{airport.iataCode}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{airport.name}</p>
        <p className="text-xs text-gray-500">{airport.address?.cityName}, {airport.address?.countryCode}</p>
      </div>
    </div>
  );

  const getLocationName = (locationCode: string, offer: AmadeusFlightOffer) => {
    if (offer.dictionaries?.locations && offer.dictionaries.locations[locationCode]) {
      return offer.dictionaries.locations[locationCode].name || locationCode;
    }
    return locationCode;
  };

  const getAircraftName = (aircraftCode: string, offer: AmadeusFlightOffer) => {
    if (offer.dictionaries?.aircraft && offer.dictionaries.aircraft[aircraftCode]) {
      return offer.dictionaries.aircraft[aircraftCode] || aircraftCode;
    }
    return aircraftCode;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Flights</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Origin */}
        <div>
          <Label htmlFor="origin">Origin</Label>
          <Input
            type="text"
            id="origin"
            placeholder="Enter origin airport"
            value={searchParams.originLocationCode}
            onChange={(e) => handleOriginChange(e.target.value)}
            onFocus={() => setIsOriginDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsOriginDropdownOpen(false), 100)}
          />
          {isOriginDropdownOpen && (
            <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full">
              {originAirports.map(renderAirportOption)}
            </div>
          )}
        </div>

        {/* Destination */}
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input
            type="text"
            id="destination"
            placeholder="Enter destination airport"
            value={searchParams.destinationLocationCode}
            onChange={(e) => handleDestinationChange(e.target.value)}
            onFocus={() => setIsDestinationDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDestinationDropdownOpen(false), 100)}
          />
          {isDestinationDropdownOpen && (
            <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full">
              {destinationAirports.map(renderAirportOption)}
            </div>
          )}
        </div>

        {/* Dates */}
        <div>
          <Label>Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !searchParams.departureDate ? "text-muted-foreground" : undefined
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchParams.departureDate ? (
                  searchParams.departureDate.toLocaleDateString()
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={searchParams.departureDate}
                onSelect={handleDepartureDateChange}
                disabled={(date) =>
                  date < new Date()
                }
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {searchParams.tripType === "ROUND_TRIP" && (
          <div>
            <Label>Return Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !searchParams.returnDate ? "text-muted-foreground" : undefined
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchParams.returnDate ? (
                    searchParams.returnDate.toLocaleDateString()
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={searchParams.returnDate}
                  onSelect={handleReturnDateChange}
                  disabled={(date) =>
                    date < new Date() || date < searchParams.departureDate
                  }
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Passengers */}
        <div>
          <Label>Adults</Label>
          <Input
            type="number"
            id="adults"
            value={searchParams.adults}
            onChange={(e) => handleAdultsChange(parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label>Children</Label>
          <Input
            type="number"
            id="children"
            value={searchParams.children}
            onChange={(e) => handleChildrenChange(parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label>Infants</Label>
          <Input
            type="number"
            id="infants"
            value={searchParams.infants}
            onChange={(e) => handleInfantsChange(parseInt(e.target.value))}
          />
        </div>

        {/* Trip Type */}
        <div>
          <Label>Trip Type</Label>
          <Select onValueChange={handleTripTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select trip type" defaultValue={searchParams.tripType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONE_WAY">One Way</SelectItem>
              <SelectItem value="ROUND_TRIP">Round Trip</SelectItem>
              {/* <SelectItem value="MULTI_CITY">Multi City</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Travel Class */}
        <div>
          <Label>Travel Class</Label>
          <Select onValueChange={handleTravelClassChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select travel class" defaultValue={searchParams.travelClass} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECONOMY">Economy</SelectItem>
              <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
              <SelectItem value="FIRST">First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Non-Stop */}
        <div>
          <Label>Non-Stop</Label>
          <Input
            type="checkbox"
            id="nonStop"
            checked={searchParams.nonStop}
            onChange={(e) => handleNonStopChange(e.target.checked)}
          />
        </div>
      </div>

      <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSearchFlights} disabled={isLoading}>
        {isLoading ? (
          <>
            <Search className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search Flights
          </>
        )}
      </Button>

      {flightOffers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Flight Offers</h2>
          {flightOffers.map(offer => (
            <div key={offer.id} className="border rounded p-4 mb-4">
              {offer.itineraries.map((itinerary: any, index: number) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold">Itinerary {index + 1}</h3>
                  {itinerary.segments.map((segment: any, segmentIndex: number) => (
                    <div key={segmentIndex} className="mb-2">
                      <p>
                        {getLocationName(segment.departure.iataCode, offer)} ({segment.departure.iataCode})
                        {' '}→{' '}
                        {getLocationName(segment.arrival.iataCode, offer)} ({segment.arrival.iataCode})
                      </p>
                      <p>
                        {new Date(segment.departure.at).toLocaleString()} - {new Date(segment.arrival.at).toLocaleString()}
                      </p>
                      <p>Carrier: {segment.carrierCode}</p>
                      <p>Flight Number: {segment.number}</p>
                      {/* <p>Aircraft: {getAircraftName(segment.aircraft.code, offer)}</p> */}
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-2">
                <p className="font-bold">Total Price: {offer.price.total} {offer.price.currency}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
