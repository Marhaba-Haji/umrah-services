import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Plane, Clock, Plus, Minus, ArrowRightLeft, User, MapPin, Briefcase, Loader2 } from 'lucide-react';
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
  initialGroupSize?: {
    adults: number;
    children: number;
    infants: number;
  };
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
  loading,
  ...rest
}: any) {
  const [departurePopoverOpen, setDeparturePopoverOpen] = useState(false);
  const [returnPopoverOpen, setReturnPopoverOpen] = useState(false);
  const fromInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-3 py-4 md:px-6 md:py-6">
      <form className="flex flex-col gap-4">
        {/* Row 1: Trip Type, Passengers, Class */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Trip Type</label>
            <Select value={searchParams.tripType} onValueChange={(value) => setSearchParams(prev => ({ ...prev, tripType: value }))}>
              <SelectTrigger className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium">
                <ArrowRightLeft className="w-4 h-4 mr-2 text-gray-500" />
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
            <label className="text-xs font-medium text-gray-700 mb-2 block">Passengers</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center gap-2 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium justify-start">
                  <User className="w-4 h-4 text-gray-500" />
                  {getTotalPassengers()} passenger{getTotalPassengers() !== 1 ? 's' : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium w-16">Adults</span>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} disabled={searchParams.adults <= 1}><Minus className="w-4 h-4" /></Button>
                    <span className="w-8 text-center text-sm font-medium">{searchParams.adults}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, adults: Math.min(9, prev.adults + 1) }))} disabled={searchParams.adults >= 9}><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium w-16">Children</span>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} disabled={searchParams.children <= 0}><Minus className="w-4 h-4" /></Button>
                    <span className="w-8 text-center text-sm font-medium">{searchParams.children}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, children: Math.min(9, prev.children + 1) }))} disabled={searchParams.children >= 9}><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium w-16">Infants</span>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, infants: Math.max(0, prev.infants - 1) }))} disabled={searchParams.infants <= 0}><Minus className="w-4 h-4" /></Button>
                    <span className="w-8 text-center text-sm font-medium">{searchParams.infants}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setSearchParams(prev => ({ ...prev, infants: Math.min(prev.adults, prev.infants + 1) }))} disabled={searchParams.infants >= searchParams.adults}><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Class</label>
            <Select value={searchParams.travelClass} onValueChange={(value) => setSearchParams(prev => ({ ...prev, travelClass: value }))}>
              <SelectTrigger className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium">
                <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
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

        {/* Row 2: From and To with minimal gap */}
        <div className="grid grid-cols-5 gap-2 items-end">
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-700 mb-2 block">From</label>
            <Popover open={fromPopoverOpen} onOpenChange={setFromPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    ref={fromInputRef}
                    type="text"
                    value={fromQuery}
                    onChange={e => setFromQuery(e.target.value)}
                    placeholder="From"
                    className="h-11 rounded-xl px-4 pl-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                    autoComplete="off"
                    tabIndex={0}
                  />
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
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
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 focus:bg-emerald-100 focus:outline-none"
                        onClick={() => {
                          setSearchParams(prev => ({ ...prev, originLocationCode: a.code }));
                          setFromQuery(`${a.city} (${a.code})`);
                          setFromPopoverOpen(false);
                        }}
                        type="button"
                        aria-label={`Select ${a.city} (${a.code})`}
                      >
                        <div className="font-semibold text-sm">{a.code}</div>
                        <div className="text-xs text-gray-600">{a.city}, {a.country}</div>
                        <div className="text-xs text-gray-400">{a.name}</div>
                      </button>
                    ))
                  )}
                </PopoverContent>
              )}
            </Popover>
          </div>
          
          <div className="flex justify-center mb-2">
            <Button type="button" variant="ghost" size="icon" onClick={rest.swapLocations} className="h-10 w-10 rounded-full bg-emerald-50 hover:bg-emerald-100" aria-label="Swap locations">
              <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
            </Button>
          </div>
          
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-700 mb-2 block">To</label>
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
              <SelectTrigger className="w-full h-11 rounded-xl px-4 pl-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            <label className="text-xs font-medium text-gray-700 mb-2 block">Departure Date</label>
            <Popover open={departurePopoverOpen} onOpenChange={setDeparturePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("h-11 w-full justify-start text-left font-normal text-sm px-4", !searchParams.departureDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
          {searchParams.tripType === 'ROUND_TRIP' && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Return Date</label>
              <Popover open={returnPopoverOpen} onOpenChange={setReturnPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("h-11 w-full justify-start text-left font-normal text-sm px-4", !searchParams.returnDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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

        {/* Row 4: Search Button */}
        <div className="flex flex-col md:flex-row md:justify-end mt-4">
          <Button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="h-12 w-full md:w-auto px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search Flights</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
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

const FlightSearch: React.FC<FlightSearchProps> = ({ onFlightSelect, className, initialGroupSize }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    originLocationCode: '',
    destinationLocationCode: 'JED',
    departureDate: undefined,
    returnDate: undefined,
    adults: initialGroupSize?.adults || 1,
    children: initialGroupSize?.children || 0,
    infants: initialGroupSize?.infants || 0,
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
  const [toQuery, setToQuery] = useState('Jeddah (JED)');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  const [fromLoading, setFromLoading] = useState(false);
  const [fromError, setFromError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'best' | 'cheapest' | 'fastest'>('best');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
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
        })
        .catch(err => {
          if (!active) return;
          setFromError('Error loading airports');
          setFromSuggestions([]);
        })
        .finally(() => {
          if (active) setFromLoading(false);
        });
    } else {
      setFromSuggestions([]);
      setFromError(null);
    }
    return () => { active = false; };
  }, [fromQuery]);

  useEffect(() => {
    if (initialGroupSize) {
      setSearchParams(prev => ({
        ...prev,
        adults: initialGroupSize.adults,
        children: initialGroupSize.children,
        infants: initialGroupSize.infants
      }));
    }
  }, [initialGroupSize]);

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
        max: 10
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
    const tempQuery = fromQuery;
    setFromQuery(toQuery);
    setToQuery(tempQuery);
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
          <div className="flex justify-between items-center mb-6">
            <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 py-2 font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  Modify Search
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  loading={loading}
                />
              </DialogContent>
            </Dialog>
            {/* Sorting dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <Select value={sortOption} onValueChange={v => setSortOption(v as any)}>
                <SelectTrigger className="w-[120px] h-9 rounded-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm">
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
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative flex flex-col items-center">
                <div className="animate-bounce">
                  <Plane className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300 rounded-full mt-4 animate-pulse" />
                <span className="mt-6 text-emerald-700 font-semibold text-lg">Searching for flights...</span>
                <span className="mt-2 text-sm text-gray-500">This may take a few moments</span>
              </div>
            </div>
          ) : flightResults.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-600 mb-2">No flights found</p>
              <p className="text-sm text-gray-400">Try adjusting your search parameters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFlights.map((flight) => {
                const isExpanded = expandedFlightId === flight.id;
                const priceInr = currencyToInr(flight.price.total, flight.price.currency);
                return (
                  <Card
                    key={flight.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                              <Plane className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">{flight.airline}</h4>
                              <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                              {flight.aircraft && (
                                <p className="text-xs text-gray-500">{flight.aircraft}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">₹{priceInr.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">per person</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-4 px-2">
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">{formatTime(flight.departure.at)}</div>
                            <div className="text-sm font-medium text-gray-600">{flight.departure.iataCode}</div>
                            {flight.departure.terminal && (
                              <div className="text-xs text-gray-400">Terminal {flight.departure.terminal}</div>
                            )}
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="text-center mb-2">
                              <div className="text-sm font-medium text-gray-600">{formatDuration(flight.duration)}</div>
                              <div className="text-xs text-gray-400">
                                {flight.stops === 0 ? 'Direct flight' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="h-1 bg-emerald-300 flex-1 rounded-l-full"></div>
                              <div className="w-3 h-3 bg-emerald-500 rounded-full mx-1"></div>
                              <div className="h-1 bg-emerald-300 flex-1 rounded-r-full"></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">{formatTime(flight.arrival.at)}</div>
                            <div className="text-sm font-medium text-gray-600">{flight.arrival.iataCode}</div>
                            {flight.arrival.terminal && (
                              <div className="text-xs text-gray-400">Terminal {flight.arrival.terminal}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                              {flight.cabin}
                            </Badge>
                            {flight.stops === 0 && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                Direct
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                              className="text-xs"
                            >
                              {isExpanded ? 'Hide Details' : 'View Details'}
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => onFlightSelect(flight, searchParams)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                            >
                              Select Flight
                            </Button>
                          </div>
                        </div>

                        {/* Collapsible details */}
                        <div
                          className={cn(
                            'transition-all duration-300 overflow-hidden',
                            isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                          )}
                        >
                          {isExpanded && (
                            <div className="pt-4 border-t border-gray-100">
                              <FlightDetails offer={flight.rawOffer} />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      ) : (
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
          loading={loading}
        />
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
