import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, Plane, MapPin, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

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
  id: string;
  iataCode: string;
  name: string;
  address?: {
    cityName?: string;
    countryName?: string;
  };
  subType?: string;
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

const ADULT_MIN = 1,
  ADULT_MAX = 9,
  CHILD_MIN = 0,
  CHILD_MAX = 8,
  INFANT_MIN = 0,
  INFANT_MAX = 4;

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

  // Separate state for display values
  const [originDisplayValue, setOriginDisplayValue] = useState("");
  const [destDisplayValue, setDestDisplayValue] = useState("");

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
  const [originError, setOriginError] = useState<string | null>(null);
  const [destError, setDestError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [passengerModalOpen, setPassengerModalOpen] = useState(false);
  const [departurePopoverOpen, setDeparturePopoverOpen] = useState(false);
  const [returnPopoverOpen, setReturnPopoverOpen] = useState(false);

  const passengerSummary = () => {
    const { adults, children, infants } = searchParams;
    const parts = [];
    if (adults) parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
    if (children) parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
    if (infants) parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);
    return parts.length ? parts.join(", ") : "Select passengers";
  };

  const fetchOriginSuggestions = debounce(async (val: string) => {
    if (!val || val.length < 2) {
      setOriginSuggestions([]);
      setOriginError(null);
      return;
    }
    setOriginLoading(true);
    setOriginError(null);
    try {
      console.log("Fetching origin suggestions for:", val);
      const { data, error } = await supabase.functions.invoke('amadeus-airport-suggest', {
        body: { keyword: val, subType: "AIRPORT,CITY" }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("API response data:", data);

      // Ensure we have the correct data structure and filter/sort for better accuracy
      let suggestions = data.data || data || [];
      
      // Sort suggestions: exact IATA code matches first, then by relevance
      suggestions = suggestions.sort((a: AirportSuggestion, b: AirportSuggestion) => {
        const aExact = a.iataCode?.toLowerCase() === val.toLowerCase();
        const bExact = b.iataCode?.toLowerCase() === val.toLowerCase();
        const aStart = a.iataCode?.toLowerCase().startsWith(val.toLowerCase());
        const bStart = b.iataCode?.toLowerCase().startsWith(val.toLowerCase());
        const aNameStart = a.name?.toLowerCase().startsWith(val.toLowerCase());
        const bNameStart = b.name?.toLowerCase().startsWith(val.toLowerCase());
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        if (aNameStart && !bNameStart) return -1;
        if (!aNameStart && bNameStart) return 1;
        
        return 0;
      });
      
      console.log("Processed suggestions:", suggestions);
      setOriginSuggestions(suggestions);
      setApiAvailable(true);
    } catch (e) {
      console.error("Error fetching origin suggestions:", e);
      setOriginError(
        `Failed to load suggestions: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
      setOriginSuggestions([]);
      setApiAvailable(false);
    }
    setOriginLoading(false);
  }, 300);

  const fetchDestSuggestions = debounce(async (val: string) => {
    if (!val || val.length < 2) {
      setDestSuggestions([]);
      setDestError(null);
      return;
    }
    setDestLoading(true);
    setDestError(null);
    try {
      console.log("Fetching destination suggestions for:", val);
      const { data, error } = await supabase.functions.invoke('amadeus-airport-suggest', {
        body: { keyword: val, subType: "AIRPORT,CITY" }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("API response data:", data);

      // Ensure we have the correct data structure and filter/sort for better accuracy
      let suggestions = data.data || data || [];
      
      // Sort suggestions: exact IATA code matches first, then by relevance
      suggestions = suggestions.sort((a: AirportSuggestion, b: AirportSuggestion) => {
        const aExact = a.iataCode?.toLowerCase() === val.toLowerCase();
        const bExact = b.iataCode?.toLowerCase() === val.toLowerCase();
        const aStart = a.iataCode?.toLowerCase().startsWith(val.toLowerCase());
        const bStart = b.iataCode?.toLowerCase().startsWith(val.toLowerCase());
        const aNameStart = a.name?.toLowerCase().startsWith(val.toLowerCase());
        const bNameStart = b.name?.toLowerCase().startsWith(val.toLowerCase());
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        if (aNameStart && !bNameStart) return -1;
        if (!aNameStart && bNameStart) return 1;
        
        return 0;
      });
      
      console.log("Processed suggestions:", suggestions);
      setDestSuggestions(suggestions);
      setApiAvailable(true);
    } catch (e) {
      console.error("Error fetching destination suggestions:", e);
      setDestError(
        `Failed to load suggestions: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
      setDestSuggestions([]);
      setApiAvailable(false);
    }
    setDestLoading(false);
  }, 300);

  // Test function to check API status
  const testAPI = async () => {
    try {
      console.log("Testing Amadeus API...");
      const { data, error } = await supabase.functions.invoke('amadeus-airport-suggest', {
        body: { keyword: "delhi", subType: "AIRPORT,CITY" }
      });

      if (error) {
        console.log("❌ API is not working. Error:", error.message);
        setApiAvailable(false);
      } else {
        console.log("✅ API is working correctly");
        console.log("API Test Response:", data);
        setApiAvailable(true);
      }
    } catch (error) {
      console.error("❌ API test failed:", error);
      setApiAvailable(false);
    }
  };

  // Test API on component mount
  useEffect(() => {
    testAPI();
  }, []);

  useEffect(() => {
    // On initial load or when departure date changes, ensure return date is not before departure date
    setSearchParams((prev) => {
      if (prev.returnDate && prev.returnDate < prev.departureDate) {
        return { ...prev, returnDate: prev.departureDate };
      }
      return prev;
    });
  }, [searchParams.departureDate]);

  const formatSuggestion = (suggestion: AirportSuggestion) => {
    const cityName = suggestion.address?.cityName || suggestion.name;
    const countryName = suggestion.address?.countryName;
    const type = suggestion.subType === "CITY" ? "City" : "Airport";

    return {
      display: `${suggestion.iataCode} - ${cityName}${countryName ? `, ${countryName}` : ""}`,
      subtitle: type,
      iataCode: suggestion.iataCode,
      name: suggestion.name,
      cityName,
      countryName,
      type,
    };
  };

  const handleDepartureDateChange = (date: Date | undefined) => {
    if (date) {
      setSearchParams((prev) => {
        let newReturn = prev.returnDate;
        if (!newReturn || newReturn < date) {
          newReturn = date;
        }
        return {
          ...prev,
          departureDate: date,
          returnDate: newReturn,
        };
      });
      setDeparturePopoverOpen(false);
    }
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    if (date) {
      setSearchParams((prev) => ({
        ...prev,
        returnDate: date,
      }));
      setReturnPopoverOpen(false);
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

  // Update handleSearchFlights to call the Amadeus API for flight offers using the form values
  const handleSearchFlights = async () => {
    if (!searchParams.originLocationCode || !searchParams.destinationLocationCode) {
      console.error("Origin and destination are required");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Searching flights with params:", searchParams);
      
      // Format dates for the API call
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      const requestBody = {
        originLocationCode: searchParams.originLocationCode,
        destinationLocationCode: searchParams.destinationLocationCode,
        departureDate: formatDate(searchParams.departureDate),
        ...(searchParams.tripType === "ROUND_TRIP" && searchParams.returnDate && {
          returnDate: formatDate(searchParams.returnDate)
        }),
        adults: searchParams.adults,
        ...(searchParams.children > 0 && { children: searchParams.children }),
        ...(searchParams.infants > 0 && { infants: searchParams.infants }),
        travelClass: searchParams.travelClass,
        max: 10 // Limit results for better performance
      };

      console.log("Flight search request body:", requestBody);

      const { data, error } = await supabase.functions.invoke('amadeus-flight-search', {
        body: requestBody
      });

      if (error) {
        console.error("Flight search error:", error);
        throw new Error(error.message);
      }

      console.log("Flight search response:", data);
      const flights = data.data || [];
      console.log("Flight offers received:", flights.length);
      
      // Transform Amadeus API response to expected FlightOffer format
      const transformedFlights = flights.map((offer: any, index: number) => {
        console.log("Processing flight offer:", index, offer);
        
        // Get the first itinerary and first segment for simplicity
        const itinerary = offer.itineraries?.[0];
        const firstSegment = itinerary?.segments?.[0];
        const lastSegment = itinerary?.segments?.[itinerary.segments.length - 1];
        
        if (!firstSegment || !lastSegment) {
          console.warn("Invalid flight data structure for offer:", index, offer);
          return null;
        }
        
        return {
          id: offer.id || `flight-${index}`,
          airline: firstSegment.carrierCode || "Unknown",
          flightNumber: firstSegment.number || "Unknown",
          departure: {
            iataCode: firstSegment.departure?.iataCode || "Unknown",
            terminal: firstSegment.departure?.terminal,
            at: firstSegment.departure?.at || new Date().toISOString()
          },
          arrival: {
            iataCode: lastSegment.arrival?.iataCode || "Unknown", 
            terminal: lastSegment.arrival?.terminal,
            at: lastSegment.arrival?.at || new Date().toISOString()
          },
          duration: itinerary?.duration || "Unknown",
          stops: (itinerary?.segments?.length || 1) - 1,
          cabin: firstSegment.cabin || "ECONOMY",
          aircraft: firstSegment.aircraft?.code,
          price: {
            total: offer.price?.total || "0",
            currency: offer.price?.currency || "EUR"
          },
          rawOffer: offer // Keep raw data for detailed processing
        };
      }).filter(Boolean); // Remove null entries
      
      console.log("Transformed flights:", transformedFlights);
      setFlightOffers(transformedFlights);
      
      // Show user feedback if no flights found
      if (flights.length === 0) {
        console.log("No flights found - showing user message");
      }
    } catch (error) {
      console.error("Error during flight search:", error);
      setFlightOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Flights</h1>

      {apiAvailable === false && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-800">
              Using demo data - Amadeus API not configured. Contact
              administrator to set up API credentials.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Trip Type</Label>
          <Select
            value={searchParams.tripType}
            onValueChange={handleTripTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select trip type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONE_WAY">One Way</SelectItem>
              <SelectItem value="ROUND_TRIP">Round Trip</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Travel Class</Label>
          <Select
            value={searchParams.travelClass}
            onValueChange={handleTravelClassChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select travel class" />
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
      {/* Dates and Passengers in the same row, as the last row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Departure Date</Label>
          <Popover
            open={departurePopoverOpen}
            onOpenChange={setDeparturePopoverOpen}
          >
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
            <Popover
              open={returnPopoverOpen}
              onOpenChange={setReturnPopoverOpen}
            >
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
          <Label>Passengers</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full text-left"
            onClick={() => setPassengerModalOpen(true)}
          >
            {passengerSummary()}
          </Button>
          <Dialog
            open={passengerModalOpen}
            onOpenChange={setPassengerModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Passengers</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>
                    Adults{" "}
                    <span className="text-xs text-gray-500">(12+ yrs)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={searchParams.adults <= ADULT_MIN}
                      onClick={() =>
                        setSearchParams((p) => ({
                          ...p,
                          adults: Math.max(ADULT_MIN, p.adults - 1),
                        }))
                      }
                    >
                      -
                    </Button>
                    <span>{searchParams.adults}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={searchParams.adults >= ADULT_MAX}
                      onClick={() =>
                        setSearchParams((p) => ({
                          ...p,
                          adults: Math.min(ADULT_MAX, p.adults + 1),
                        }))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    Children{" "}
                    <span className="text-xs text-gray-500">(2-11 yrs)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={searchParams.children <= CHILD_MIN}
                      onClick={() =>
                        setSearchParams((p) => ({
                          ...p,
                          children: Math.max(CHILD_MIN, p.children - 1),
                        }))
                      }
                    >
                      -
                    </Button>
                    <span>{searchParams.children}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={searchParams.children >= CHILD_MAX}
                      onClick={() =>
                        setSearchParams((p) => ({
                          ...p,
                          children: Math.min(CHILD_MAX, p.children + 1),
                        }))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    Infants{" "}
                    <span className="text-xs text-gray-500">(&lt;2 yrs)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={searchParams.infants <= INFANT_MIN}
                      onClick={() =>
                        setSearchParams((p) => ({
                          ...p,
                          infants: Math.max(INFANT_MIN, p.infants - 1),
                        }))
                      }
                    >
                      -
                    </Button>
                    <span>{searchParams.infants}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={searchParams.infants >= INFANT_MAX}
                      onClick={() =>
                        setSearchParams((p) => ({
                          ...p,
                          infants: Math.min(INFANT_MAX, p.infants + 1),
                        }))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setPassengerModalOpen(false)}
                >
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="origin">Origin</Label>
          <div className="relative">
            <Input
              type="text"
              id="origin"
              placeholder="Enter origin airport or city"
              value={originDisplayValue || searchParams.originLocationCode}
              autoComplete="off"
              onFocus={() => setShowOriginDropdown(true)}
              onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setOriginDisplayValue(val);
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
                <div className="absolute left-0 right-0 z-50 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto mt-1">
                  {originLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  ) : originError ? (
                    <div className="p-4 text-center text-red-500 text-sm">
                      {originError}
                    </div>
                  ) : originSuggestions.length > 0 ? (
                    originSuggestions.map((suggestion) => {
                      const formatted = formatSuggestion(suggestion);
                      return (
                        <div
                          key={suggestion.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onMouseDown={() => {
                            setSearchParams((prev) => ({
                              ...prev,
                              originLocationCode: formatted.iataCode,
                            }));
                            setOriginDisplayValue(formatted.display);
                            setShowOriginDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {formatted.type === "City" ? (
                                <MapPin className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Plane className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">
                                {formatted.iataCode}
                              </div>
                              <div className="text-sm text-gray-600 truncate">
                                {formatted.display}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatted.subtitle}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
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
              placeholder="Enter destination airport or city"
              value={destDisplayValue || searchParams.destinationLocationCode}
              autoComplete="off"
              onFocus={() => setShowDestDropdown(true)}
              onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setDestDisplayValue(val);
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
                <div className="absolute left-0 right-0 z-50 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto mt-1">
                  {destLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  ) : destError ? (
                    <div className="p-4 text-center text-red-500 text-sm">
                      {destError}
                    </div>
                  ) : destSuggestions.length > 0 ? (
                    destSuggestions.map((suggestion) => {
                      const formatted = formatSuggestion(suggestion);
                      return (
                        <div
                          key={suggestion.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onMouseDown={() => {
                            setSearchParams((prev) => ({
                              ...prev,
                              destinationLocationCode: formatted.iataCode,
                            }));
                            setDestDisplayValue(formatted.display);
                            setShowDestDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {formatted.type === "City" ? (
                                <MapPin className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Plane className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">
                                {formatted.iataCode}
                              </div>
                              <div className="text-sm text-gray-600 truncate">
                                {formatted.display}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatted.subtitle}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  )}
                </div>
              )}
          </div>
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

      {/* Flight Results Section */}
      {!isLoading && searchParams.originLocationCode && searchParams.destinationLocationCode && (
        <div className="mt-8">
          {flightOffers.length > 0 ? (
            <>
              <h2 className="text-xl font-bold mb-4">Flight Offers ({flightOffers.length} found)</h2>
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
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4">
                <Plane className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We couldn't find any flights for your search criteria.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">Try adjusting your search:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check if airport codes are correct (e.g., BLR for Bangalore, BOM for Mumbai)</li>
                  <li>• Try different dates (some routes may not be available on all dates)</li>
                  <li>• Consider nearby airports or cities</li>
                  <li>• Try reducing the number of passengers</li>
                  <li>• Switch between one-way and round-trip options</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
