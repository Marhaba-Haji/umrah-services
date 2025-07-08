import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FlightOffer {
  id: string;
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
  price: {
    total: string;
    currency: string;
  };
  rawOffer?: unknown;
}

interface AirportSuggestion {
  iataCode: string;
  name: string;
  cityName?: string;
  countryName?: string;
  [key: string]: unknown;
}

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

interface FlightSearchProps {
  onFlightSelect?: (
    flight: FlightOffer,
    searchParams: FlightSearchParams,
  ) => void;
}

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onFlightSelect }) => {
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

  const [flightOffers, setFlightOffers] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [originSuggestions, setOriginSuggestions] = useState<
    AirportSuggestion[]
  >([]);
  const [destSuggestions, setDestSuggestions] = useState<AirportSuggestion[]>(
    [],
  );
  const [originLoading, setOriginLoading] = useState(false);
  const [destLoading, setDestLoading] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const fetchOriginSuggestions = debounce(async (val) => {
    if (!val || val.length < 2) {
      setOriginSuggestions([]);
      return;
    }
    setOriginLoading(true);
    try {
      const res = await fetch(
        "https://rjyhoikoqhephrkjgebo.supabase.co/functions/v1/amadeus-airport-suggest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: val, subType: "AIRPORT,CITY" }),
        },
      );
      const data = await res.json();
      setOriginSuggestions(data.data || []);
    } catch (e) {
      setOriginSuggestions([]);
    }
    setOriginLoading(false);
  }, 300);

  const fetchDestSuggestions = debounce(async (val) => {
    if (!val || val.length < 2) {
      setDestSuggestions([]);
      return;
    }
    setDestLoading(true);
    try {
      const res = await fetch(
        "https://rjyhoikoqhephrkjgebo.supabase.co/functions/v1/amadeus-airport-suggest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: val, subType: "AIRPORT,CITY" }),
        },
      );
      const data = await res.json();
      setDestSuggestions(data.data || []);
    } catch (e) {
      setDestSuggestions([]);
    }
    setDestLoading(false);
  }, 300);

  const handleDepartureDateChange = (date: Date | undefined) => {
    if (date) {
      setSearchParams((prev) => ({
        ...prev,
        departureDate: date,
      }));
    }
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    if (date) {
      setSearchParams((prev) => ({
        ...prev,
        returnDate: date,
      }));
    }
  };

  const handleAdultsChange = (value: number) => {
    setSearchParams((prev) => ({
      ...prev,
      adults: value,
    }));
  };

  const handleChildrenChange = (value: number) => {
    setSearchParams((prev) => ({
      ...prev,
      children: value,
    }));
  };

  const handleInfantsChange = (value: number) => {
    setSearchParams((prev) => ({
      ...prev,
      infants: value,
    }));
  };

  const handleTripTypeChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      tripType: value as "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY",
    }));
  };

  const handleTravelClassChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      travelClass: value as
        | "ECONOMY"
        | "PREMIUM_ECONOMY"
        | "BUSINESS"
        | "FIRST",
    }));
  };

  const handleSearchFlights = async () => {
    setIsLoading(true);
    try {
      // Mock flight search for now
      console.log("Searching flights with params:", searchParams);
      // You can implement actual flight search API call here
      setFlightOffers([]);
    } catch (error) {
      console.error("Error during flight search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Flights</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="origin">Origin</Label>
          <div className="relative">
            <Input
              type="text"
              id="origin"
              placeholder="Enter origin airport"
              value={searchParams.originLocationCode}
              autoComplete="off"
              onFocus={() => setShowOriginDropdown(true)}
              onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setSearchParams((prev) => ({
                  ...prev,
                  originLocationCode: val,
                }));
                fetchOriginSuggestions(val);
                setShowOriginDropdown(true);
              }}
            />
            {showOriginDropdown &&
              searchParams.originLocationCode.length >= 2 && (
                <div className="absolute left-0 right-0 z-10 bg-white border rounded shadow max-h-60 overflow-auto">
                  {originLoading ? (
                    <div className="p-2 text-gray-500">Loading...</div>
                  ) : originSuggestions.length > 0 ? (
                    originSuggestions.map((s) => (
                      <div
                        key={s.id}
                        className="p-2 hover:bg-accent cursor-pointer"
                        onMouseDown={() => {
                          setSearchParams((prev) => ({
                            ...prev,
                            originLocationCode: s.iataCode,
                          }));
                          setShowOriginDropdown(false);
                        }}
                      >
                        <span className="font-semibold">{s.iataCode}</span> -{" "}
                        {s.name} (
                        {s.address?.cityName || s.address?.countryName})
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No results found</div>
                  )}
                </div>
              )}
          </div>
        </div>

        <div>
          <Label htmlFor="destination">Destination</Label>
          <div className="relative">
            <Input
              type="text"
              id="destination"
              placeholder="Enter destination airport"
              value={searchParams.destinationLocationCode}
              autoComplete="off"
              onFocus={() => setShowDestDropdown(true)}
              onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setSearchParams((prev) => ({
                  ...prev,
                  destinationLocationCode: val,
                }));
                fetchDestSuggestions(val);
                setShowDestDropdown(true);
              }}
            />
            {showDestDropdown &&
              searchParams.destinationLocationCode.length >= 2 && (
                <div className="absolute left-0 right-0 z-10 bg-white border rounded shadow max-h-60 overflow-auto">
                  {destLoading ? (
                    <div className="p-2 text-gray-500">Loading...</div>
                  ) : destSuggestions.length > 0 ? (
                    destSuggestions.map((s) => (
                      <div
                        key={s.id}
                        className="p-2 hover:bg-accent cursor-pointer"
                        onMouseDown={() => {
                          setSearchParams((prev) => ({
                            ...prev,
                            destinationLocationCode: s.iataCode,
                          }));
                          setShowDestDropdown(false);
                        }}
                      >
                        <span className="font-semibold">{s.iataCode}</span> -{" "}
                        {s.name} (
                        {s.address?.cityName || s.address?.countryName})
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No results found</div>
                  )}
                </div>
              )}
          </div>
        </div>

        <div>
          <Label>Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !searchParams.departureDate
                    ? "text-muted-foreground"
                    : undefined,
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
                disabled={(date) => date < new Date()}
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
                    !searchParams.returnDate
                      ? "text-muted-foreground"
                      : undefined,
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
              <PopoverContent
                className="w-auto p-0"
                align="center"
                side="bottom"
              >
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

        <div>
          <Label>Trip Type</Label>
          <Select onValueChange={handleTripTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select trip type"
                defaultValue={searchParams.tripType}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONE_WAY">One Way</SelectItem>
              <SelectItem value="ROUND_TRIP">Round Trip</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Travel Class</Label>
          <Select onValueChange={handleTravelClassChange}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select travel class"
                defaultValue={searchParams.travelClass}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECONOMY">Economy</SelectItem>
              <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
              <SelectItem value="FIRST">First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={handleSearchFlights}
        disabled={isLoading}
      >
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
          {flightOffers.map((offer) => (
            <div key={offer.id} className="border rounded p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    {offer.airline} {offer.flightNumber}
                  </h3>
                  <p>
                    {offer.departure.iataCode} → {offer.arrival.iataCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {offer.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {offer.price.total} {offer.price.currency}
                  </p>
                  <Button
                    onClick={() => onFlightSelect?.(offer, searchParams)}
                    className="mt-2"
                  >
                    Select Flight
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
