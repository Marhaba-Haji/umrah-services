import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
  rawOffer: AmadeusFlightOffer;
}

interface FlightSearchProps {
  onFlightSelect: (flight: FlightOffer, searchParams: FlightSearchParams) => void;
  className?: string;
}

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
  fromPopoverOpen,
  setFromPopoverOpen,
  getTotalPassengers,
  ...rest
}: any) {
  return (
    <form className="flex flex-col gap-6 px-2 py-2 md:px-4 md:py-4">
      {/* Row 1: Trip Type, Passengers, Class */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Trip Type</label>
          <Select value={searchParams.tripType} onValueChange={(value) => setSearchParams(prev => ({ ...prev, tripType: value }))}>
            <SelectTrigger className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 text-base font-medium">
              <ArrowRightLeft className="w-5 h-5 mr-1 text-gray-500" />
              <SelectValue placeholder="Trip Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ROUND_TRIP">Round trip</SelectItem>
              <SelectItem value="ONE_WAY">One way</SelectItem>
              <SelectItem value="MULTI_CITY">Multi city</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Passengers</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center gap-1 h-12 rounded-xl border border-gray-200 bg-gray-50 text-base font-medium">
                <User className="w-5 h-5 mr-1 text-gray-500" />
                {getTotalPassengers()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="w-16">Adults</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} disabled={searchParams.adults <= 1}><Minus /></Button>
                <span className="w-6 text-center">{searchParams.adults}</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, adults: Math.min(9, prev.adults + 1) }))} disabled={searchParams.adults >= 9}><Plus /></Button>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16">Children</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} disabled={searchParams.children <= 0}><Minus /></Button>
                <span className="w-6 text-center">{searchParams.children}</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, children: Math.min(9, prev.children + 1) }))} disabled={searchParams.children >= 9}><Plus /></Button>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16">Infants</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, infants: Math.max(0, prev.infants - 1) }))} disabled={searchParams.infants <= 0}><Minus /></Button>
                <span className="w-6 text-center">{searchParams.infants}</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, infants: Math.min(prev.adults, prev.infants + 1) }))} disabled={searchParams.infants >= searchParams.adults}><Plus /></Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Class</label>
          <Select value={searchParams.travelClass} onValueChange={(value) => setSearchParams(prev => ({ ...prev, travelClass: value }))}>
            <SelectTrigger className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 text-base font-medium">
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
      </div>
      {/* Row 2: From, Swap, To */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">From</label>
          <Popover open={fromPopoverOpen} onOpenChange={setFromPopoverOpen}>
            <PopoverTrigger asChild>
              <Input
                type="text"
                value={fromQuery}
                onChange={e => setFromQuery(e.target.value)}
                placeholder="From"
                className="h-12 rounded-xl px-4 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
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
                        setFromPopoverOpen(false);
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
        <div className="flex justify-center md:justify-center mb-2 md:mb-0">
          <Button type="button" variant="ghost" size="icon" onClick={rest.swapLocations} className="h-12 w-12 p-0 rounded-full mx-1 mt-6 md:mt-0" aria-label="Swap locations">
            <ArrowRightLeft className="w-6 h-6 text-gray-400" />
          </Button>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">To</label>
          <Select
            value={searchParams.destinationLocationCode}
            onValueChange={val => {
              setSearchParams(prev => ({ ...prev, destinationLocationCode: val }));
              let label = '';
              switch(val) {
                case 'JED': label = 'Jeddah (JED)'; break;
                case 'MED': label = 'Madinah (MED)'; break;
                case 'RUH': label = 'Riyadh (RUH)'; break;
                case 'DMM': label = 'Dammam (DMM)'; break;
                case 'TIF': label = 'Taif (TIF)'; break;
                default: label = val;
              }
              setToQuery(label);
            }}
          >
            <SelectTrigger className="w-full h-12 rounded-xl px-4 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JED">Jeddah (JED)</SelectItem>
              <SelectItem value="MED">Madinah (MED)</SelectItem>
              <SelectItem value="RUH">Riyadh (RUH)</SelectItem>
              <SelectItem value="DMM">Dammam (DMM)</SelectItem>
              <SelectItem value="TIF">Taif (TIF)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Row 3: Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Departure Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("h-12 w-full justify-start text-left font-normal text-base px-4", !searchParams.departureDate && "text-muted-foreground")}
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
                }}
                disabled={date => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {searchParams.tripType === 'ROUND_TRIP' && (
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Return Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("h-12 w-full justify-start text-left font-normal text-base px-4", !searchParams.returnDate && "text-muted-foreground")}
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
                  }}
                  disabled={date => date < new Date() || (searchParams.departureDate && date <= searchParams.departureDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      {/* Row 4: Search Button */}
      <div className="flex flex-col md:flex-row md:justify-end mt-2">
        <Button
          type="button"
          onClick={handleSearch}
          className="h-14 w-full md:w-auto px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg flex items-center gap-2 shadow-md"
        >
          <Search className="w-5 h-5" />
          <span>Search Flights</span>
        </Button>
      </div>
    </form>
  );
}

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

  const [minLoaderVisible, setMinLoaderVisible] = useState(false);

  const [fromPopoverOpen, setFromPopoverOpen] = useState(false);

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

  useEffect(() => {
    if (fromQuery.length >= 2) {
      setFromPopoverOpen(true);
    } else {
      setFromPopoverOpen(false);
    }
  }, [fromQuery]);

  useEffect(() => {
    if (!searchParams.destinationLocationCode) {
      setSearchParams(prev => ({ ...prev, destinationLocationCode: 'JED' }));
      setToQuery('Jeddah (JED)');
    }
  }, []);

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
      aircraft: aircraftName,
      rawOffer: amadeusOffer
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
    setMinLoaderVisible(true);
    setTimeout(() => setMinLoaderVisible(false), 500);
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

  // Memoize dialog search handler to avoid remounting SearchForm
  const handleDialogSearch = useCallback(() => {
    handleSearch();
    setSearchDialogOpen(false);
  }, [handleSearch, setSearchDialogOpen]);

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
                  handleSearch={handleDialogSearch}
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
                  fromPopoverOpen={fromPopoverOpen}
                  setFromPopoverOpen={setFromPopoverOpen}
                  getTotalPassengers={getTotalPassengers}
                  swapLocations={swapLocations}
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
          {(loading || minLoaderVisible) ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative flex flex-col items-center">
                <span className="animate-bounce-slow">
                  <Plane className="w-16 h-16 text-emerald-600 drop-shadow-lg" />
                </span>
                <div className="w-32 h-2 bg-gradient-to-r from-emerald-300 via-white to-emerald-300 rounded-full mt-2 opacity-70 animate-pulse" />
                <span className="mt-4 text-emerald-700 font-semibold text-lg animate-pulse">Searching for the best flights...</span>
              </div>
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
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                    tabIndex={0}
                    role="region"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                          <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); onFlightSelect(flight, searchParams); }}>Add to Package</Button>
                        </div>
                        <button
                          className="text-xs text-emerald-700 underline mt-2 focus:outline-none"
                          onClick={e => { e.stopPropagation(); setExpandedFlightId(isExpanded ? null : flight.id); }}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                    {/* Collapsible details */}
                    <div
                      className={cn(
                        'transition-all duration-300 overflow-hidden',
                        isExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                      )}
                      style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
                    >
                    {isExpanded && (
                        <FlightDetails offer={flight.rawOffer} />
                      )}
                      </div>
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
            fromPopoverOpen={fromPopoverOpen}
            setFromPopoverOpen={setFromPopoverOpen}
            getTotalPassengers={getTotalPassengers}
            swapLocations={swapLocations}
          />
        </div>
      )}
    </div>
  );
};

const FlightDetails = ({ offer }: { offer: any }) => {
  if (!offer) return <div className="text-gray-500">Details not available.</div>;

  // Pricing by traveler type
  const getPrice = (type: string) => {
    const pricing = offer.travelerPricings?.find((p: any) => p.travelerType === type);
    return pricing ? `${pricing.price.currency} ${parseFloat(pricing.price.total).toLocaleString()}` : 'N/A';
  };

  // Baggage info for all segments
  const getBaggage = (segments: any[]) => {
    return segments.map((seg, idx) => {
      const bag = seg.includedCheckedBags?.quantity;
      return (
        <div key={idx} className="mb-2">
          <span className="font-semibold">{seg.departure.iataCode} → {seg.arrival.iataCode}:</span> {bag ? `${bag} checked bag${bag > 1 ? 's' : ''}` : 'N/A'}
        </div>
      );
    });
  };

  // Segments
  const onwardSegments = offer.itineraries[0]?.segments || [];
  const returnSegments = offer.itineraries[1]?.segments || [];

  // Layover calculation
  const getLayover = (prev: any, next: any) => {
    if (!prev || !next) return null;
    const prevArrival = new Date(prev.arrival.at);
    const nextDeparture = new Date(next.departure.at);
    const diffMs = nextDeparture.getTime() - prevArrival.getTime();
    if (diffMs <= 0) return null;
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return `${hours ? hours + 'h ' : ''}${mins}m layover`;
  };

  return (
    <Tabs defaultValue="onward" className="w-full mt-2">
      <TabsList className="mb-4">
        <TabsTrigger value="onward">Onward Segments</TabsTrigger>
        {returnSegments.length > 0 && <TabsTrigger value="return">Return Segments</TabsTrigger>}
        <TabsTrigger value="price">Price</TabsTrigger>
        <TabsTrigger value="baggage">Baggage</TabsTrigger>
      </TabsList>
      <TabsContent value="onward">
        <div className="mb-2 font-semibold text-gray-800">Onward Segments</div>
        <div className="space-y-3">
          {onwardSegments.map((seg: any, idx: number) => (
            <div key={seg.id} className="border rounded p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <span className="font-semibold text-emerald-700">{seg.carrierCode} {seg.number}</span>
                <span className="text-xs text-gray-500">{offer.dictionaries?.carriers?.[seg.carrierCode] || ''}</span>
                <span className="text-xs text-gray-500">Aircraft: {offer.dictionaries?.aircraft?.[seg.aircraft.code] || seg.aircraft.code}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-700">
                <div>
                  <span className="font-semibold">From:</span> {seg.departure.iataCode} {seg.departure.terminal ? `T${seg.departure.terminal}` : ''} <span className="text-gray-400">({new Date(seg.departure.at).toLocaleString()})</span>
                </div>
                <div>
                  <span className="font-semibold">To:</span> {seg.arrival.iataCode} {seg.arrival.terminal ? `T${seg.arrival.terminal}` : ''} <span className="text-gray-400">({new Date(seg.arrival.at).toLocaleString()})</span>
                </div>
                <div>
                  <span className="font-semibold">Duration:</span> {seg.duration.replace('PT', '').toLowerCase()}
                </div>
              </div>
              {idx > 0 && (
                <div className="text-xs text-blue-600 mt-1">{getLayover(onwardSegments[idx - 1], seg)}</div>
              )}
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="return">
        <div className="mb-2 font-semibold text-gray-800">Return Segments</div>
        <div className="space-y-3">
          {returnSegments.map((seg: any, idx: number) => (
            <div key={seg.id} className="border rounded p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <span className="font-semibold text-emerald-700">{seg.carrierCode} {seg.number}</span>
                <span className="text-xs text-gray-500">{offer.dictionaries?.carriers?.[seg.carrierCode] || ''}</span>
                <span className="text-xs text-gray-500">Aircraft: {offer.dictionaries?.aircraft?.[seg.aircraft.code] || seg.aircraft.code}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-700">
                <div>
                  <span className="font-semibold">From:</span> {seg.departure.iataCode} {seg.departure.terminal ? `T${seg.departure.terminal}` : ''} <span className="text-gray-400">({new Date(seg.departure.at).toLocaleString()})</span>
                </div>
                <div>
                  <span className="font-semibold">To:</span> {seg.arrival.iataCode} {seg.arrival.terminal ? `T${seg.arrival.terminal}` : ''} <span className="text-gray-400">({new Date(seg.arrival.at).toLocaleString()})</span>
                </div>
                <div>
                  <span className="font-semibold">Duration:</span> {seg.duration.replace('PT', '').toLowerCase()}
                </div>
              </div>
              {idx > 0 && (
                <div className="text-xs text-blue-600 mt-1">{getLayover(returnSegments[idx - 1], seg)}</div>
              )}
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="price">
        <div className="mb-2 font-semibold text-gray-800">Price Breakdown</div>
        <div className="flex gap-6 mb-4">
          <div className="text-xs text-gray-600">Adult: <span className="font-medium text-gray-900">₹{offer.travelerPricings ? currencyToInr(offer.travelerPricings.find((p: any) => p.travelerType === 'ADULT')?.price.total || '0', offer.travelerPricings.find((p: any) => p.travelerType === 'ADULT')?.price.currency || 'INR').toLocaleString() : '-'}</span></div>
          <div className="text-xs text-gray-600">Child: <span className="font-medium text-gray-900">₹{offer.travelerPricings ? currencyToInr(offer.travelerPricings.find((p: any) => p.travelerType === 'CHILD')?.price.total || '0', offer.travelerPricings.find((p: any) => p.travelerType === 'CHILD')?.price.currency || 'INR').toLocaleString() : '-'}</span></div>
          <div className="text-xs text-gray-600">Infant: <span className="font-medium text-gray-900">₹{offer.travelerPricings ? currencyToInr((offer.travelerPricings.find((p: any) => p.travelerType === 'HELD_INFANT') || offer.travelerPricings.find((p: any) => p.travelerType === 'INFANT'))?.price.total || '0', (offer.travelerPricings.find((p: any) => p.travelerType === 'HELD_INFANT') || offer.travelerPricings.find((p: any) => p.travelerType === 'INFANT'))?.price.currency || 'INR').toLocaleString() : '-'}</span></div>
        </div>
      </TabsContent>
      <TabsContent value="baggage">
        <div className="mb-2 font-semibold text-gray-800">Baggage Information</div>
        <div>
          {getBaggage([...onwardSegments, ...returnSegments])}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default FlightSearch;
