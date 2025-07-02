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

export interface AirportSuggestion {
  code: string;
  city: string;
  country: string;
  name: string;
  aliases?: string[];
  score?: number;
}

interface FlightSearchProps {
  onFlightSelect: (flight: FlightOffer, searchParams: FlightSearchParams) => void;
  className?: string;
  initialAdults?: number;
  initialChildren?: number;
  initialInfants?: number;
}

interface SearchFormProps {
  searchParams: FlightSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<FlightSearchParams>>;
  handleSearch: (e?: React.MouseEvent) => void;
  fromQuery: string;
  setFromQuery: React.Dispatch<React.SetStateAction<string>>;
  fromSuggestions: AirportSuggestion[];
  fromLoading: boolean;
  fromError: string | null;
  onFromSelect?: (code: string, label: string) => void;
  toQuery: string;
  setToQuery: React.Dispatch<React.SetStateAction<string>>;
  fromPopoverOpen: boolean;
  setFromPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getTotalPassengers: () => number;
  toPopoverOpen: boolean;
  setToPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toLoading: boolean;
  toError: string | null;
  toSuggestions: AirportSuggestion[];
  missingFields?: Record<string, boolean>;
  searchAttempted?: boolean;
  departurePopoverOpen: boolean;
  setDeparturePopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  returnPopoverOpen: boolean;
  setReturnPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
}

// Amadeus API airport/location type
interface AmadeusAirportData {
  iataCode: string;
  name?: string;
  address?: {
    cityName?: string;
    countryName?: string;
  };
}

// Amadeus traveler pricing type
interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags: {
      quantity: number;
    };
  }>;
}

// Amadeus API segment type
interface AmadeusSegment {
  departure: { iataCode: string; terminal?: string; at: string; };
  arrival: { iataCode: string; terminal?: string; at: string; };
  carrierCode: string;
  number: string;
  aircraft: { code: string; };
  operating?: { carrierCode: string; };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

interface AmadeusItinerary {
  duration: string;
  segments: AmadeusSegment[];
}

interface AmadeusPrice {
  currency: string;
  total: string;
  base: string;
  fees: Array<{ amount: string; type: string }>;
  grandTotal: string;
}

interface AmadeusFlightOfferFull {
  id: string;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusItinerary[];
  price: AmadeusPrice;
  pricingOptions: { fareType: string[]; includedCheckedBagsOnly: boolean };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

// Add types for Amadeus API dictionaries and render helpers
interface AmadeusDictionaries {
  locations: Record<string, { cityCode: string; countryCode: string }>;
  aircraft: Record<string, string>;
  currencies: Record<string, string>;
  carriers: Record<string, string>;
}

// For flight details rendering
interface FlightDetailsProps {
  offer: FlightOffer;
}

// Add types for Amadeus API baggage, layover, and other helpers
interface AmadeusBaggage {
  quantity?: number;
}

// For layover calculation
interface AmadeusSegmentWithArrival extends AmadeusSegment {
  arrival: { iataCode: string; terminal?: string; at: string; };
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
  toPopoverOpen,
  setToPopoverOpen,
  toLoading,
  toError,
  toSuggestions,
  missingFields = {},
  searchAttempted = false,
  departurePopoverOpen,
  setDeparturePopoverOpen,
  returnPopoverOpen,
  setReturnPopoverOpen,
  loading = false,
  ...rest
}: SearchFormProps) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const [travelerPopoverOpen, setTravelerPopoverOpen] = React.useState(false);

  return (
    <form className="w-full max-w-md mx-auto flex flex-col gap-4 relative" autoComplete="off">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm" aria-busy="true" aria-live="polite">
          <svg className="animate-spin h-12 w-12 text-emerald-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div className="text-emerald-700 font-semibold text-lg">Searching flights...</div>
        </div>
      )}
      {/* Trip Type Dropdown */}
      <select
        className="bg-emerald-100 text-emerald-900 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-gray-200"
        value={searchParams.tripType}
        onChange={e => setSearchParams(prev => ({ ...prev, tripType: e.target.value }))}
      >
        <option value="ROUND_TRIP">Return</option>
        <option value="ONE_WAY">One way</option>
      </select>
      {/* From input */}
      <input
                type="text"
                value={fromQuery}
        onChange={e => {
          setFromQuery(e.target.value);
          if (e.target.value.length >= 2) setFromPopoverOpen(true);
          else setFromPopoverOpen(false);
        }}
                placeholder="From"
        className={`h-12 w-full rounded-full pl-4 pr-4 border ${missingFields.origin && searchAttempted ? 'border-red-500' : 'border-gray-200'} bg-gray-50 text-base font-medium shadow-sm focus:border-emerald-500 focus:ring-emerald-500 hover:border-emerald-400 hover:bg-emerald-50 transition-all`}
                autoComplete="off"
                tabIndex={0}
        onFocus={() => {
          if (fromQuery.length >= 2) setFromPopoverOpen(true);
        }}
        onBlur={() => setFromPopoverOpen(false)}
        data-testid="from-input"
        style={{ boxSizing: 'border-box' }}
      />
      {searchAttempted && missingFields.origin && (
        <div className="text-xs text-red-500 ml-2 -mt-3 mb-1">Please select a departure city</div>
      )}
      {fromPopoverOpen && fromQuery.length >= 2 && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-72 overflow-auto from-popover">
                {fromLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : fromError ? (
                  <div className="p-4 text-center text-red-500">{fromError}</div>
          ) : fromSuggestions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No airports found</div>
                ) : (
                  fromSuggestions.map((a, idx) => (
                    <button
                      key={a.code + idx}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 focus:bg-emerald-100 focus:outline-none"
                onMouseDown={e => {
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
        </div>
      )}
      {/* To input */}
      <input
        type="text"
        value={toQuery}
        onChange={e => {
          setToQuery(e.target.value);
          if (e.target.value.length >= 2) setToPopoverOpen(true);
          else setToPopoverOpen(false);
        }}
        placeholder="To"
        className={`h-12 w-full rounded-full pl-4 pr-4 border ${missingFields.destination && searchAttempted ? 'border-red-500' : 'border-gray-200'} bg-gray-50 text-base font-medium shadow-sm focus:border-emerald-500 focus:ring-emerald-500 hover:border-emerald-400 hover:bg-emerald-50 transition-all`}
        autoComplete="off"
        tabIndex={0}
        onFocus={() => {
          if (toQuery.length >= 2) setToPopoverOpen(true);
        }}
        onBlur={() => setToPopoverOpen(false)}
        data-testid="to-input"
        style={{ boxSizing: 'border-box' }}
      />
      {searchAttempted && missingFields.destination && (
        <div className="text-xs text-red-500 ml-2 -mt-3 mb-1">Please select a destination city</div>
      )}
      {/* To popover */}
      {toPopoverOpen && toQuery.length >= 2 && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-72 overflow-auto to-popover">
          {toLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : toError ? (
            <div className="p-4 text-center text-red-500">{toError}</div>
          ) : toSuggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No airports found</div>
          ) : (
            toSuggestions.map((a, idx) => (
              <button
                key={a.code + idx}
                className="w-full text-left px-4 py-2 hover:bg-emerald-50 focus:bg-emerald-100 focus:outline-none"
                onMouseDown={e => {
                  setSearchParams(prev => ({ ...prev, destinationLocationCode: a.code }));
                  setToQuery(`${a.city} (${a.code})`);
                  setToPopoverOpen(false);
                }}
                type="button"
                aria-label={`Select ${a.city} (${a.code})`}
              >
                <span className="font-semibold">{a.code}</span> - {a.city}, {a.country} <span className="block text-gray-500 text-[10px]">{a.name}</span>
              </button>
            ))
          )}
        </div>
      )}
      {/* Date pickers */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-400" />
          <Popover open={departurePopoverOpen} onOpenChange={setDeparturePopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`px-3 py-2 rounded-lg font-medium bg-white border border-gray-200 shadow-sm hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${missingFields.date && searchAttempted ? 'border-red-500' : ''}`}
                aria-label="Select departure date"
              >
                {searchParams.departureDate ? format(searchParams.departureDate, 'd MMM yyyy') : 'Select departure date'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 z-50" align="start">
              <Calendar
                mode="single"
                selected={searchParams.departureDate}
                onSelect={date => {
                  if (date && date >= today) {
                    setSearchParams(prev => ({ ...prev, departureDate: date, returnDate: prev.returnDate && prev.returnDate > date ? prev.returnDate : undefined }));
                    setDeparturePopoverOpen(false);
                  }
                }}
                initialFocus
                disabled={date => date < today}
              />
            </PopoverContent>
          </Popover>
        </div>
        {searchParams.tripType === 'ROUND_TRIP' && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-400" />
            <Popover open={returnPopoverOpen} onOpenChange={setReturnPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg font-medium bg-white border border-gray-200 shadow-sm hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${missingFields.returnDate && searchAttempted ? 'border-red-500' : ''}`}
                  aria-label="Select return date"
                >
                  {searchParams.returnDate ? format(searchParams.returnDate, 'd MMM yyyy') : 'Select return date'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={searchParams.returnDate}
                  onSelect={date => {
                    if (date && searchParams.departureDate && date > searchParams.departureDate) {
                    setSearchParams(prev => ({ ...prev, returnDate: date }));
                      setReturnPopoverOpen(false);
                    }
                  }}
                  initialFocus
                  disabled={date => !searchParams.departureDate || date <= searchParams.departureDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      {/* Passenger selector */}
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-emerald-400" />
        <Popover open={travelerPopoverOpen} onOpenChange={setTravelerPopoverOpen}>
          <PopoverTrigger asChild>
            <button
          type="button"
              className="font-medium bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Select number of travellers"
            >
              {getTotalPassengers()} Traveller{getTotalPassengers() > 1 ? 's' : ''}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 z-50" align="start">
            <div className="space-y-4">
              {/* Adult row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Adults</div>
                  <div className="text-xs text-gray-500">Aged 12+</div>
      </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold disabled:opacity-50"
                    onClick={() => setSearchParams((prev: any) => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                    disabled={searchParams.adults <= 1}
                    aria-label="Decrease adults"
                  >-</button>
                  <span className="w-6 text-center">{searchParams.adults}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold"
                    onClick={() => setSearchParams((prev: any) => ({ ...prev, adults: prev.adults + 1 }))}
                    aria-label="Increase adults"
                  >+</button>
                </div>
              </div>
              {/* Child row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Children</div>
                  <div className="text-xs text-gray-500">Aged 2-11</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold disabled:opacity-50"
                    onClick={() => setSearchParams((prev: any) => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                    disabled={searchParams.children <= 0}
                    aria-label="Decrease children"
                  >-</button>
                  <span className="w-6 text-center">{searchParams.children}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold"
                    onClick={() => setSearchParams((prev: any) => ({ ...prev, children: prev.children + 1 }))}
                    aria-label="Increase children"
                  >+</button>
                </div>
              </div>
              {/* Infant row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Infants</div>
                  <div className="text-xs text-gray-500">Under 2</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold disabled:opacity-50"
                    onClick={() => setSearchParams((prev: any) => ({ ...prev, infants: Math.max(0, prev.infants - 1) }))}
                    disabled={searchParams.infants <= 0}
                    aria-label="Decrease infants"
                  >-</button>
                  <span className="w-6 text-center">{searchParams.infants}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold"
                    onClick={() => setSearchParams((prev: any) => ({ ...prev, infants: prev.infants + 1 }))}
                    aria-label="Increase infants"
                  >+</button>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg"
                onClick={() => setTravelerPopoverOpen(false)}
              >
                Done
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* Direct flights checkbox */}
      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" id="direct" className="accent-emerald-500" checked={searchParams.nonStop} onChange={e => setSearchParams(prev => ({ ...prev, nonStop: e.target.checked }))} />
        <label htmlFor="direct" className="text-emerald-900 font-medium">Direct flights</label>
      </div>
      {/* Search Button */}
      <button
        className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-bold py-3 rounded-xl shadow hover:opacity-90 transition"
        type="button"
        onClick={e => { console.log('Search button clicked'); handleSearch(e); }}
      >
        Search
      </button>
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

// Alias map for old/new city names (can be updated or loaded from an external source)
const cityAliasMap: Record<string, string[]> = {
  'Mumbai': ['Bombay'],
  'Bombay': ['Mumbai'],
  'Chennai': ['Madras'],
  'Madras': ['Chennai'],
  'Beijing': ['Peking'],
  'Peking': ['Beijing'],
  'Kolkata': ['Calcutta'],
  'Calcutta': ['Kolkata'],
  'Istanbul': ['Constantinople'],
  'Constantinople': ['Istanbul'],
  'Ho Chi Minh City': ['Saigon'],
  'Saigon': ['Ho Chi Minh City'],
  'Jakarta': ['Batavia'],
  'Batavia': ['Jakarta'],
  'Saint Petersburg': ['Leningrad', 'Petrograd'],
  'Leningrad': ['Saint Petersburg'],
  'Petrograd': ['Saint Petersburg'],
  'Nur-Sultan': ['Astana'],
  'Astana': ['Nur-Sultan'],
  'Harare': ['Salisbury'],
  'Salisbury': ['Harare'],
  'Maputo': ['Lourenco Marques'],
  'Lourenco Marques': ['Maputo'],
  'Dhaka': ['Dacca'],
  'Dacca': ['Dhaka'],
  'Yangon': ['Rangoon'],
  'Rangoon': ['Yangon'],
  'Almaty': ['Alma-Ata'],
  'Alma-Ata': ['Almaty'],
  'Zhengzhou': ['Changsha'], // Example, add more as needed
  // ...add more as needed or load from a maintained JSON/API
};
// To automate updates, fetch a maintained alias JSON from a remote source and merge here.
function getAliasesForCity(city: string) {
  if (!city) return [];
  return cityAliasMap[city] || [];
}

// Add Levenshtein distance function for fuzzy matching
function levenshtein(a: string, b: string) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onFlightSelect, className, initialAdults = 1, initialChildren = 0, initialInfants = 0 }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: undefined,
    returnDate: undefined,
    adults: initialAdults,
    children: initialChildren,
    infants: initialInfants,
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
  const [toPopoverOpen, setToPopoverOpen] = useState(false);
  const [toLoading, setToLoading] = useState(false);
  const [toError, setToError] = useState<string | null>(null);

  const [searchAttempted, setSearchAttempted] = useState(false);

  const amadeus = useMemo(() => new AmadeusAPI(
    import.meta.env.VITE_AMADEUS_API_KEY,
    import.meta.env.VITE_AMADEUS_API_SECRET
  ), []);

  useEffect(() => {
    setAirports(airportsData);
  }, []);

  useEffect(() => {
    let active = true;
    if (fromQuery.length >= 2) {
      setFromLoading(true);
      setFromError(null);
      amadeus.getAirportInfo(fromQuery)
        .then((data: { data: AmadeusAirportData[] }) => {
          if (!active) return;
          const q = fromQuery.toLowerCase();
          const airports = (data.data || []).map((a: AmadeusAirportData) => ({
            code: a.iataCode,
            city: a.address?.cityName || '',
            country: a.address?.countryName || '',
            name: a.name || '',
            aliases: getAliasesForCity(a.address?.cityName)
          }));
          // Fuzzy match: score by min distance to code, city, or any alias
          const scored = airports.map((a: AirportSuggestion) => {
            const codeDist = levenshtein(q, a.code.toLowerCase());
            const cityDist = levenshtein(q, a.city.toLowerCase());
            const aliasDist = a.aliases && a.aliases.length > 0
              ? Math.min(...a.aliases.map((alias: string) => levenshtein(q, alias.toLowerCase())))
              : Infinity;
            return { ...a, score: Math.min(codeDist, cityDist, aliasDist) };
          });
          // Sort by score, then by city name
          scored.sort((a, b) => (a.score ?? 0) - (b.score ?? 0) || a.city.localeCompare(b.city));
          setFromSuggestions(scored.slice(0, 8));
          setShowFromSuggestions(true);
        })
        .catch((err: unknown) => {
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
  }, [fromQuery, amadeus]);

  useEffect(() => {
    if (toQuery.length >= 2) {
      const q = toQuery.toLowerCase();
      setToSuggestions(
        airports.filter((a: AirportSuggestion) =>
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
    if (!searchParams.destinationLocationCode) {
      setSearchParams(prev => ({ ...prev, destinationLocationCode: 'JED' }));
      setToQuery('Jeddah (JED)');
    }
  }, [searchParams.destinationLocationCode, setSearchParams]);

  useEffect(() => {
    let active = true;
    if (toQuery.length >= 2) {
      setToLoading(true);
      setToError(null);
      amadeus.getAirportInfo(toQuery)
        .then((data: { data: AmadeusAirportData[] }) => {
          if (!active) return;
          setToSuggestions(
            (data.data || []).map((a: AmadeusAirportData) => ({
              code: a.iataCode,
              city: a.address?.cityName || '',
              country: a.address?.countryName || '',
              name: a.name || ''
            }))
          );
          setShowToSuggestions(true);
        })
        .catch((err: unknown) => {
          if (!active) return;
          setToError('Error loading airports');
          setToSuggestions([]);
          setShowToSuggestions(false);
        })
        .finally(() => {
          if (active) setToLoading(false);
        });
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
      setToError(null);
    }
    return () => { active = false; };
  }, [toQuery, amadeus]);

  const transformAmadeusToFlightOffer = useCallback(
    (
      amadeusOffer: AmadeusFlightOfferFull,
      carriers: Record<string, string>,
      aircraft: Record<string, string>
    ): FlightOffer => {
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
    },
    []
  );

  // Helper to check missing fields
  const getMissingFields = () => ({
    origin: !searchParams.originLocationCode,
    destination: !searchParams.destinationLocationCode,
    date: !searchParams.departureDate,
    returnDate: searchParams.tripType === 'ROUND_TRIP' && !searchParams.returnDate,
  });
  const missingFields = getMissingFields();

  const handleSearch = useCallback(async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setSearchAttempted(true);
    console.log('handleSearch called');
    console.log('searchParams:', searchParams);
    console.log('missingFields:', missingFields);
    if (missingFields.origin || missingFields.destination || missingFields.date || missingFields.returnDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
        const transformedFlights = response.data.map((offer: AmadeusFlightOfferFull) => 
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
  }, [searchParams, missingFields, toast, setLoading, setMinLoaderVisible, setSearchPerformed, transformAmadeusToFlightOffer]);

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
                  toPopoverOpen={toPopoverOpen}
                  setToPopoverOpen={setToPopoverOpen}
                  toLoading={toLoading}
                  toError={toError}
                  toSuggestions={toSuggestions}
                  missingFields={missingFields}
                  searchAttempted={searchAttempted}
                  departurePopoverOpen={departurePopoverOpen}
                  setDeparturePopoverOpen={setDeparturePopoverOpen}
                  returnPopoverOpen={returnPopoverOpen}
                  setReturnPopoverOpen={setReturnPopoverOpen}
                  loading={loading}
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
          toPopoverOpen={toPopoverOpen}
          setToPopoverOpen={setToPopoverOpen}
          toLoading={toLoading}
          toError={toError}
          toSuggestions={toSuggestions}
          missingFields={missingFields}
          searchAttempted={searchAttempted}
          departurePopoverOpen={departurePopoverOpen}
          setDeparturePopoverOpen={setDeparturePopoverOpen}
          returnPopoverOpen={returnPopoverOpen}
          setReturnPopoverOpen={setReturnPopoverOpen}
          loading={loading}
        />
      )}
    </div>
  );
};

const FlightDetails = ({ offer }: FlightDetailsProps) => {
  if (!offer) return <div className="text-gray-500">Details not available.</div>;

  // Pricing by traveler type
  const getPrice = (type: string) => {
    const pricing = offer.travelerPricings?.find((p: any) => p.travelerType === type);
    return pricing ? `${pricing.price.currency} ${parseFloat(pricing.price.total).toLocaleString()}` : 'N/A';
  };

  // Baggage info for all segments
  const getBaggage = (segments: AmadeusSegment[]) => {
    return segments.map((seg: AmadeusSegment, idx: number) => {
      const bag = (seg as unknown as { includedCheckedBags?: AmadeusBaggage }).includedCheckedBags?.quantity;
      return (
        <span key={idx} className="inline-block mr-2">
          {bag ? `${bag} bag${bag > 1 ? 's' : ''}` : 'No checked bag'}
        </span>
      );
    });
  };

  // Segments
  const onwardSegments = offer.itineraries[0]?.segments || [];
  const returnSegments = offer.itineraries[1]?.segments || [];

  // Layover calculation
  const getLayover = (prev: AmadeusSegmentWithArrival, next: AmadeusSegment) => {
    const prevArrival = new Date(prev.arrival.at);
    const nextDeparture = new Date(next.departure.at);
    const diff = (nextDeparture.getTime() - prevArrival.getTime()) / (1000 * 60); // minutes
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
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
