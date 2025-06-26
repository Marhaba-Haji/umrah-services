import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Plane, Clock, Plus, Minus, ArrowRightLeft, User, MapPin, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { searchFlights, AmadeusFlightOffer } from '@/services/flightService';
import airportsData from '../../public/airports.json';
import { AmadeusAPI } from '@/utils/amadeusApi';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: Date | undefined;
  returnDate?: Date | undefined;
  adults: number;
  children: number;
  infants: number;
  travelClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  tripType: 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';
  nonStop: boolean;
}

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
  price: {
    total: string;
    currency: string;
  };
  cabin: string;
  aircraft?: string;
}

interface FlightSearchProps {
  onFlightSelect: (flight: FlightOffer) => void;
  className?: string;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onFlightSelect, className }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: undefined,
    returnDate: undefined,
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'ECONOMY',
    tripType: 'ROUND_TRIP',
    nonStop: false
  });

  const [flightResults, setFlightResults] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { toast } = useToast();

  const [airports, setAirports] = useState([]);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Add state for calendar popovers
  const [departurePopoverOpen, setDeparturePopoverOpen] = useState(false);
  const [returnPopoverOpen, setReturnPopoverOpen] = useState(false);

  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);

  const [fromLoading, setFromLoading] = useState(false);
  const [fromError, setFromError] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<'best' | 'cheapest' | 'fastest'>('best');

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const amadeus = new AmadeusAPI(import.meta.env.VITE_AMADEUS_API_KEY, import.meta.env.VITE_AMADEUS_API_SECRET);

  useEffect(() => {
    setAirports(airportsData);
  }, []);

  useEffect(() => {
    let active = true;
    if (fromQuery.length >= 2) {
      setFromLoading(true);
      setFromError(null);
      amadeus.getAirportInfo(fromQuery)
        .then(data => {
          if (!active) return;
          setFromSuggestions(
            (data.data || []).map((a: any) => ({
              code: a.iataCode,
              city: a.address?.cityName || '',
              country: a.address?.countryName || '',
              name: a.name || ''
            }))
          );
          setShowFromSuggestions(true);
        })
        .catch(err => {
          if (!active) return;
          setFromError('Error loading airports');
          setFromSuggestions([]);
          setShowFromSuggestions(false);
        })
        .finally(() => {
          if (active) setFromLoading(false);
        });
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
      setFromError(null);
    }
    return () => { active = false; };
  }, [fromQuery]);

  useEffect(() => {
    if (toQuery.length >= 2) {
      const q = toQuery.toLowerCase();
      setToSuggestions(
        airports.filter(a =>
          a.code.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q)
        ).slice(0, 8)
      );
      setShowToSuggestions(true);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  }, [toQuery, airports]);

  const transformAmadeusToFlightOffer = (amadeusOffer: AmadeusFlightOffer, carriers: Record<string, string>, aircraft: Record<string, string>): FlightOffer => {
    const firstSegment = amadeusOffer.itineraries[0].segments[0];
    const lastSegment = amadeusOffer.itineraries[0].segments[amadeusOffer.itineraries[0].segments.length - 1];
    
    const carrierCode = firstSegment.carrierCode;
    const airlineName = carriers[carrierCode] || carrierCode;
    
    const aircraftCode = firstSegment.aircraft.code;
    const aircraftName = aircraft[aircraftCode] || aircraftCode;
    
    const stops = amadeusOffer.itineraries[0].segments.length - 1;
    
    // Get cabin class from traveler pricing
    const cabin = amadeusOffer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY';

    return {
      id: amadeusOffer.id,
      airline: airlineName,
      flightNumber: `${carrierCode} ${firstSegment.number}`,
      departure: {
        iataCode: firstSegment.departure.iataCode,
        terminal: firstSegment.departure.terminal,
        at: firstSegment.departure.at
      },
      arrival: {
        iataCode: lastSegment.arrival.iataCode,
        terminal: lastSegment.arrival.terminal,
        at: lastSegment.arrival.at
      },
      duration: amadeusOffer.itineraries[0].duration,
      stops: stops,
      price: {
        total: amadeusOffer.price.total,
        currency: amadeusOffer.price.currency
      },
      cabin: cabin,
      aircraft: aircraftName
    };
  };

  const handleSearch = async () => {
    if (!searchParams.originLocationCode || !searchParams.destinationLocationCode || !searchParams.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in departure city, destination city, and departure date.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const searchRequest = {
        originLocationCode: searchParams.originLocationCode,
        destinationLocationCode: searchParams.destinationLocationCode,
        departureDate: format(searchParams.departureDate, "yyyy-MM-dd"),
        returnDate: searchParams.returnDate ? format(searchParams.returnDate, "yyyy-MM-dd") : undefined,
        adults: searchParams.adults,
        children: searchParams.children > 0 ? searchParams.children : undefined,
        infants: searchParams.infants > 0 ? searchParams.infants : undefined,
        travelClass: searchParams.travelClass,
        nonStop: searchParams.nonStop,
        max: 10 // Limit results to 10 for better performance
      };

      console.log('Searching flights with request:', searchRequest);
      const response = await searchFlights(searchRequest);
      console.log('Flight search response:', response);

      if (response.data && response.data.length > 0) {
        const transformedFlights = response.data.map(offer => 
          transformAmadeusToFlightOffer(offer, response.dictionaries.carriers, response.dictionaries.aircraft)
        );
        
        setFlightResults(transformedFlights);
        
        toast({
          title: "Search Complete",
          description: `Found ${transformedFlights.length} flights for your search.`,
        });
      } else {
        setFlightResults([]);
        toast({
          title: "No Flights Found",
          description: "No flights found for your search criteria. Try adjusting your search parameters.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Flight search error:', error);
      setFlightResults([]);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Unable to search flights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration: string) => {
    // Convert PT6H30M to "6h 30m"
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? match[1].replace('H', 'h ') : '';
    const minutes = match[2] ? match[2].replace('M', 'm') : '';
    return `${hours}${minutes}`.trim();
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      originLocationCode: prev.destinationLocationCode,
      destinationLocationCode: prev.originLocationCode
    }));
  };

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', change: number) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change)
    }));
  };

  const getTotalPassengers = () => {
    return searchParams.adults + searchParams.children + searchParams.infants;
  };

  // Add INR conversion utility
  const currencyToInr = (amount: string, currency: string) => {
    const n = parseFloat(amount);
    switch (currency) {
      case 'USD': return Math.round(n * 83.5);
      case 'SAR': return Math.round(n * 22.3);
      case 'EUR': return Math.round(n * 90);
      case 'INR': return Math.round(n);
      default: return Math.round(n); // fallback
    }
  };

  // Helper to get duration in minutes from ISO duration string
  const getDurationMinutes = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  };

  // AI-like 'best' sort: normalize price and duration, weight price 60%, duration 40%
  const sortedFlights = useMemo(() => {
    if (!flightResults.length) return [];
    if (sortOption === 'cheapest') {
      return [...flightResults].sort((a, b) => currencyToInr(a.price.total, a.price.currency) - currencyToInr(b.price.total, b.price.currency));
    }
    if (sortOption === 'fastest') {
      return [...flightResults].sort((a, b) => getDurationMinutes(a.duration) - getDurationMinutes(b.duration));
    }
    // Best: AI-like balance
    const prices = flightResults.map(f => currencyToInr(f.price.total, f.price.currency));
    const durations = flightResults.map(f => getDurationMinutes(f.duration));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minDur = Math.min(...durations);
    const maxDur = Math.max(...durations);
    return [...flightResults].sort((a, b) => {
      const aPriceNorm = (currencyToInr(a.price.total, a.price.currency) - minPrice) / (maxPrice - minPrice || 1);
      const bPriceNorm = (currencyToInr(b.price.total, b.price.currency) - minPrice) / (maxPrice - minPrice || 1);
      const aDurNorm = (getDurationMinutes(a.duration) - minDur) / (maxDur - minDur || 1);
      const bDurNorm = (getDurationMinutes(b.duration) - minDur) / (maxDur - minDur || 1);
      const aScore = aPriceNorm * 0.6 + aDurNorm * 0.4;
      const bScore = bPriceNorm * 0.6 + bDurNorm * 0.4;
      return aScore - bScore;
    });
  }, [flightResults, sortOption]);

  // Extract the search form as a component
  function SearchForm({
    searchParams,
    setSearchParams,
    handleSearch,
    fromQuery,
    setFromQuery,
    fromSuggestions,
    fromLoading,
    fromError,
    onFromSelect,
    toQuery,
    setToQuery,
    ...rest
  }: any) {
    // ...copy the JSX for the search form fields here, using the passed props...
    // For brevity, you can reuse the existing JSX for the form fields
    // The search button should call handleSearch
    return (
      <div className="flex flex-col gap-4">
        {/* Top row: Trip Type, Passengers, Class */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full mb-2">
          <Select value={searchParams.tripType} onValueChange={(value) => setSearchParams(prev => ({ ...prev, tripType: value }))}>
            <SelectTrigger className="flex items-center gap-1 px-3 h-12 rounded-xl border border-gray-200 bg-gray-50 min-w-[180px] text-base font-medium">
              <ArrowRightLeft className="w-5 h-5 mr-1 text-gray-500" />
              <SelectValue placeholder="Trip Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ROUND_TRIP">Round trip</SelectItem>
              <SelectItem value="ONE_WAY">One way</SelectItem>
              <SelectItem value="MULTI_CITY">Multi city</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 px-3 h-12 rounded-xl border border-gray-200 bg-gray-50 min-w-[80px] text-base font-medium">
                <User className="w-5 h-5 mr-1 text-gray-500" />
                {getTotalPassengers()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="w-16">Adults</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updatePassengerCount('adults', -1)} disabled={searchParams.adults <= 1}><Minus /></Button>
                <span className="w-6 text-center">{searchParams.adults}</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updatePassengerCount('adults', 1)} disabled={searchParams.adults >= 9}><Plus /></Button>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16">Children</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updatePassengerCount('children', -1)} disabled={searchParams.children <= 0}><Minus /></Button>
                <span className="w-6 text-center">{searchParams.children}</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updatePassengerCount('children', 1)} disabled={searchParams.children >= 9}><Plus /></Button>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16">Infants</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updatePassengerCount('infants', -1)} disabled={searchParams.infants <= 0}><Minus /></Button>
                <span className="w-6 text-center">{searchParams.infants}</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updatePassengerCount('infants', 1)} disabled={searchParams.infants >= searchParams.adults}><Plus /></Button>
              </div>
            </PopoverContent>
          </Popover>
          <Select value={searchParams.travelClass} onValueChange={(value) => setSearchParams(prev => ({ ...prev, travelClass: value }))}>
            <SelectTrigger className="flex items-center gap-1 px-3 h-12 rounded-xl border border-gray-200 bg-gray-50 min-w-[110px] text-base font-medium">
              <Briefcase className="w-5 h-5 mr-1 text-gray-500" />
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECONOMY">Economy</SelectItem>
              <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
              <SelectItem value="FIRST">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Second row: From, Swap, To, Dates */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
          {/* From */}
          <div className="flex flex-col flex-1 min-w-[160px] max-w-[240px]">
            <label className="text-xs font-medium text-gray-700 mb-1">From</label>
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  type="text"
                  value={fromQuery}
                  onChange={e => setFromQuery(e.target.value)}
                  placeholder="From"
                  className="h-14 rounded-full px-4 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  autoComplete="off"
                  tabIndex={0}
                />
              </PopoverTrigger>
              {(fromLoading || fromError || (fromSuggestions.length > 0 && fromQuery.length >= 2)) && (
                <PopoverContent className="w-[320px] p-0 max-h-72 overflow-auto">
                  {fromLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : fromError ? (
                    <div className="p-4 text-center text-red-500">{fromError}</div>
                  ) : fromSuggestions.length === 0 && fromQuery.length >= 2 ? (
                    <div className="p-4 text-center text-gray-500">No airports found</div>
                  ) : (
                    fromSuggestions.map((a, idx) => (
                      <button
                        key={a.code + idx}
                        className="w-full text-left px-4 py-2 hover:bg-emerald-50 focus:bg-emerald-100 focus:outline-none"
                        onClick={() => {
                          setSearchParams(prev => ({ ...prev, originLocationCode: a.code }));
                          setFromQuery(`${a.city} (${a.code})`);
                        }}
                        type="button"
                        aria-label={`Select ${a.city} (${a.code})`}
                      >
                        <span className="font-semibold">{a.code}</span> - {a.city}, {a.country} <span className="block text-gray-500 text-[10px]">{a.name}</span>
                      </button>
                    ))
                  )}
                </PopoverContent>
              )}
            </Popover>
          </div>
          {/* Swap */}
          <Button type="button" variant="ghost" size="icon" onClick={swapLocations} className="h-14 w-14 p-0 rounded-full mx-1 mt-6 md:mt-0" aria-label="Swap locations">
            <ArrowRightLeft className="w-6 h-6 text-gray-400" />
          </Button>
          {/* To */}
          <div className="flex flex-col flex-1 min-w-[160px] max-w-[240px]">
            <label className="text-xs font-medium text-gray-700 mb-1">To</label>
            <Select
              value={searchParams.destinationLocationCode}
              onValueChange={val => {
                setSearchParams(prev => ({ ...prev, destinationLocationCode: val }));
                setToQuery(val === 'JED' ? 'Jeddah (JED)' : 'Madinah (MED)');
              }}
            >
              <SelectTrigger className="h-14 rounded-full px-4 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JED">Jeddah (JED)</SelectItem>
                <SelectItem value="MED">Madinah (MED)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Departure Date */}
          <div className="flex flex-col min-w-[180px] max-w-[220px]">
            <label className="text-xs font-medium text-gray-700 mb-1">Departure Date</label>
            <Popover open={departurePopoverOpen} onOpenChange={setDeparturePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("h-14 w-full justify-start text-left font-normal text-base px-4", !searchParams.departureDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {searchParams.departureDate ? format(searchParams.departureDate, 'EEE, MMM d') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchParams.departureDate}
                  onSelect={date => {
                    setSearchParams(prev => ({ ...prev, departureDate: date }));
                    setDeparturePopoverOpen(false);
                  }}
                  disabled={date => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Return Date (if round trip) */}
          {searchParams.tripType === 'ROUND_TRIP' && (
            <div className="flex flex-col min-w-[180px] max-w-[220px]">
              <label className="text-xs font-medium text-gray-700 mb-1">Return Date</label>
              <Popover open={returnPopoverOpen} onOpenChange={setReturnPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("h-14 w-full justify-start text-left font-normal text-base px-4", !searchParams.returnDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {searchParams.returnDate ? format(searchParams.returnDate, 'EEE, MMM d') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchParams.returnDate}
                    onSelect={date => {
                      setSearchParams(prev => ({ ...prev, returnDate: date }));
                      setReturnPopoverOpen(false);
                    }}
                    disabled={date => date < new Date() || (searchParams.departureDate && date <= searchParams.departureDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-2">
          <Button
            onClick={handleSearch}
            className="h-14 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg flex items-center gap-2 shadow-md"
          >
            <Search className="w-5 h-5" />
            <span>Search Flights</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {searchPerformed && flightResults.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 py-2 font-semibold">Modify Search</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full">
                <div className="mb-4 text-lg font-semibold">Modify Search</div>
                <SearchForm
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  handleSearch={() => { handleSearch(); setSearchDialogOpen(false); }}
                  fromQuery={fromQuery}
                  setFromQuery={setFromQuery}
                  fromSuggestions={fromSuggestions}
                  fromLoading={fromLoading}
                  fromError={fromError}
                  onFromSelect={(code: string, label: string) => {
                    setSearchParams((prev: any) => ({ ...prev, originLocationCode: code }));
                    setFromQuery(label);
                  }}
                  toQuery={toQuery}
                  setToQuery={setToQuery}
                />
              </DialogContent>
            </Dialog>
            {/* Sorting dropdown */}
            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
              <Select value={sortOption} onValueChange={v => setSortOption(v as any)}>
                <SelectTrigger className="w-[140px] h-10 rounded-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">Best</SelectItem>
                  <SelectItem value="cheapest">Cheapest</SelectItem>
                  <SelectItem value="fastest">Fastest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Flight Results Section */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : flightResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Plane className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No flights found for your search criteria</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search parameters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFlights.map((flight) => {
                const isExpanded = expandedFlightId === flight.id;
                return (
                  <div
                    key={flight.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isExpanded}
                  >
                    <div
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Plane className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{flight.airline}</h4>
                          <p className="text-gray-600">{flight.flightNumber}</p>
                          {flight.aircraft && (
                            <p className="text-sm text-gray-500">{flight.aircraft}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-center gap-4">
                        <div className="text-center">
                          <div className="font-semibold">{formatTime(flight.departure.at)}</div>
                          <div className="text-sm text-gray-500">{flight.departure.iataCode}</div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="text-sm text-gray-500">{formatDuration(flight.duration)}</div>
                          <div className="flex items-center justify-center mt-1">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <Clock className="w-3 h-3 mx-2 text-gray-400" />
                            <div className="h-px bg-gray-300 flex-1"></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{formatTime(flight.arrival.at)}</div>
                          <div className="text-sm text-gray-500">{flight.arrival.iataCode}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xl font-bold text-emerald-600">₹ {currencyToInr(flight.price.total, flight.price.currency).toLocaleString()}</div>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="default" onClick={e => { e.stopPropagation(); onFlightSelect(flight); }}>Book Now</Button>
                          <Button size="sm" variant="outline" onClick={e => {
                            e.stopPropagation();
                            // Show notification
                            if (typeof window !== 'undefined' && window.toast) {
                              window.toast({
                                title: 'Notice',
                                description: 'Flight price and availability may change until booking is confirmed.',
                                variant: 'warning',
                              });
                            } else if (typeof toast === 'function') {
                              toast({
                                title: 'Notice',
                                description: 'Flight price and availability may change until booking is confirmed.',
                                variant: 'warning',
                              });
                            }
                            // Optionally, call a prop or add to package logic here
                          }}>Add to Package</Button>
                        </div>
                      </div>
                    </div>
                    {/* Collapsible details */}
                    {isExpanded && (
                      <div className="mt-4 bg-white border-t pt-4 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-6">
                          <div>
                            <div className="font-semibold mb-1">Cabin</div>
                            <div>{flight.cabin.replace('_', ' ')}</div>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">Aircraft</div>
                            <div>{flight.aircraft || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">Departure</div>
                            <div>{flight.departure.iataCode} {flight.departure.terminal ? `Terminal ${flight.departure.terminal}` : ''}</div>
                            <div>{formatTime(flight.departure.at)}</div>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">Arrival</div>
                            <div>{flight.arrival.iataCode} {flight.arrival.terminal ? `Terminal ${flight.arrival.terminal}` : ''}</div>
                            <div>{formatTime(flight.arrival.at)}</div>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">Duration</div>
                            <div>{formatDuration(flight.duration)}</div>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">Stops</div>
                            <div>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-4 flex flex-col gap-4">
          <SearchForm
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            handleSearch={handleSearch}
            fromQuery={fromQuery}
            setFromQuery={setFromQuery}
            fromSuggestions={fromSuggestions}
            fromLoading={fromLoading}
            fromError={fromError}
            onFromSelect={(code: string, label: string) => {
              setSearchParams((prev: any) => ({ ...prev, originLocationCode: code }));
              setFromQuery(label);
            }}
            toQuery={toQuery}
            setToQuery={setToQuery}
          />
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
