import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Plane, Clock, Plus, Minus, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { searchFlights, AmadeusFlightOffer } from '@/services/flightService';

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
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onFlightSelect }) => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-emerald-600" />
            <span>Flight Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Trip Type</label>
            <Select value={searchParams.tripType} onValueChange={(value: 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY') => 
              setSearchParams(prev => ({ ...prev, tripType: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROUND_TRIP">Round Trip</SelectItem>
                <SelectItem value="ONE_WAY">One Way</SelectItem>
                <SelectItem value="MULTI_CITY">Multi City</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
              <Input
                placeholder="Departure city (e.g., JFK)"
                value={searchParams.originLocationCode}
                onChange={(e) => setSearchParams(prev => ({ 
                  ...prev, 
                  originLocationCode: e.target.value.toUpperCase() 
                }))}
                className="uppercase"
                maxLength={3}
              />
            </div>
            
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={swapLocations}
                className="h-10 w-10 p-0 rounded-full"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
              <Input
                placeholder="Destination city (e.g., RUH)"
                value={searchParams.destinationLocationCode}
                onChange={(e) => setSearchParams(prev => ({ 
                  ...prev, 
                  destinationLocationCode: e.target.value.toUpperCase() 
                }))}
                className="uppercase"
                maxLength={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Departure Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn("w-full justify-start text-left font-normal", 
                      !searchParams.departureDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchParams.departureDate ? format(searchParams.departureDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchParams.departureDate}
                    onSelect={(date) => setSearchParams(prev => ({ ...prev, departureDate: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {searchParams.tripType === 'ROUND_TRIP' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Return Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn("w-full justify-start text-left font-normal",
                        !searchParams.returnDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {searchParams.returnDate ? format(searchParams.returnDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={searchParams.returnDate}
                      onSelect={(date) => setSearchParams(prev => ({ ...prev, returnDate: date }))}
                      disabled={(date) => date < new Date() || (searchParams.departureDate && date <= searchParams.departureDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Passengers</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <span className="font-medium text-gray-900">Adults</span>
                  <p className="text-xs text-gray-500">12+ years</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updatePassengerCount('adults', -1)}
                    disabled={searchParams.adults <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{searchParams.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updatePassengerCount('adults', 1)}
                    disabled={searchParams.adults >= 9}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <span className="font-medium text-gray-900">Children</span>
                  <p className="text-xs text-gray-500">2-11 years</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updatePassengerCount('children', -1)}
                    disabled={searchParams.children <= 0}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{searchParams.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updatePassengerCount('children', 1)}
                    disabled={searchParams.children >= 9}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <span className="font-medium text-gray-900">Infants</span>
                  <p className="text-xs text-gray-500">Under 2 years</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updatePassengerCount('infants', -1)}
                    disabled={searchParams.infants <= 0}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{searchParams.infants}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updatePassengerCount('infants', 1)}
                    disabled={searchParams.infants >= searchParams.adults}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center text-sm text-gray-600">
              Total: {getTotalPassengers()} passenger{getTotalPassengers() !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Travel Class</label>
              <Select value={searchParams.travelClass} onValueChange={(value: any) => 
                setSearchParams(prev => ({ ...prev, travelClass: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ECONOMY">Economy</SelectItem>
                  <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="FIRST">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="nonStop"
                  checked={searchParams.nonStop}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, nonStop: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="nonStop" className="text-sm font-medium text-gray-700">
                  Direct flights only
                </label>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search Flights</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {searchPerformed && (
        <Card>
          <CardHeader>
            <CardTitle>Flight Results</CardTitle>
            {flightResults.length > 0 && (
              <p className="text-gray-600">Found {flightResults.length} flights</p>
            )}
          </CardHeader>
          <CardContent>
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
                {flightResults.map((flight) => (
                  <div key={flight.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Plane className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{flight.airline}</h3>
                          <p className="text-gray-600">{flight.flightNumber}</p>
                          {flight.aircraft && (
                            <p className="text-sm text-gray-500">{flight.aircraft}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center space-x-4 mb-2">
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
                        <Badge variant="outline" className="text-xs">
                          {flight.cabin.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          {flight.price.currency} {flight.price.total}
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          per person
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => onFlightSelect(flight)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlightSearch;
