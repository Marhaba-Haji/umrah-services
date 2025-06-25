import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Filter, Star, MapPin, Users, Clock, Plane, Car, UserCheck, Mountain, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Define interfaces for our data
interface Hotel {
  id: string;
  name: string;
  city: string;
  rating: number;
  price_per_night: number;
  images?: string[];
  amenities?: string[];
  distance_from_haram?: string;
  description?: string;
}

interface Flight {
  id: string;
  airline: string;
  sector: string;
  departure_date: string;
  return_date?: string;
  price: number;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
}

interface Transport {
  id: string;
  route: string;
  vehicle_type: string;
  price: number;
  capacity: number;
  vehicle_name?: string;
  trip_duration?: string;
  trip_distance?: string;
  features?: string[];
}

interface VisaService {
  id: string;
  visa_type: string;
  visa_category: string;
  price: number;
  processing_time: string;
  description?: string;
  requirements?: string[];
}

interface GuideService {
  id: string;
  guide_name: string;
  guide_city: string;
  service_type: string[];
  languages?: string[];
  experience?: string;
  rating?: number;
  price?: number;
  description?: string;
}

interface ZiarathService {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  description?: string;
  inclusions?: string[];
  max_participants?: number;
}

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  quantity: number;
  details?: any;
}

interface RoomConfig {
  id: string;
  guests: number;
}

interface FilterState {
  city: string;
  checkin: Date | undefined;
  checkout: Date | undefined;
  rooms: RoomConfig[];
  nationality: string;
  type: string;
  route: string;
  language: string;
  duration: string;
}

const BuildYourOwnUmrah = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Data states
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [visaServices, setVisaServices] = useState<VisaService[]>([]);
  const [guideServices, setGuideServices] = useState<GuideService[]>([]);
  const [ziarathServices, setZiarathServices] = useState<ZiarathService[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states with proper typing
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    checkin: undefined,
    checkout: undefined,
    rooms: [{ id: '1', guests: 1 }], // Default: 1 room with 1 guest
    nationality: '',
    type: '',
    route: '',
    language: '',
    duration: ''
  });

  // Calculate number of nights
  const calculateNights = () => {
    if (filters.checkin && filters.checkout) {
      const diffTime = Math.abs(filters.checkout.getTime() - filters.checkin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  // Get total guests across all rooms
  const getTotalGuests = () => {
    return filters.rooms.reduce((total, room) => total + room.guests, 0);
  };

  // Room management functions
  const addRoom = () => {
    const newRoom: RoomConfig = {
      id: (filters.rooms.length + 1).toString(),
      guests: 1
    };
    setFilters(prev => ({
      ...prev,
      rooms: [...prev.rooms, newRoom]
    }));
  };

  const removeRoom = (roomId: string) => {
    if (filters.rooms.length > 1) {
      setFilters(prev => ({
        ...prev,
        rooms: prev.rooms.filter(room => room.id !== roomId)
      }));
    }
  };

  const updateRoomGuests = (roomId: string, guests: number) => {
    setFilters(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => 
        room.id === roomId ? { ...room, guests: Math.max(1, Math.min(4, guests)) } : room
      )
    }));
  };

  const steps = [
    { id: 1, title: 'Hotels', icon: MapPin, description: 'Choose your accommodation' },
    { id: 2, title: 'Flights', icon: Plane, description: 'Book your journey' },
    { id: 3, title: 'Visa Services', icon: UserCheck, description: 'Get your visa sorted' },
    { id: 4, title: 'Transport', icon: Car, description: 'Local transportation' },
    { id: 5, title: 'Guide Services', icon: Users, description: 'Expert guidance' },
    { id: 6, title: 'Ziarath Tours', icon: Mountain, description: 'Spiritual journeys' },
  ];

  // Fetch data functions
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_flights')
        .select('*')
        .eq('status', 'active')
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      setFlights(data || []);
    } catch (error) {
      console.error('Error fetching flights:', error);
      toast({
        title: "Error",
        description: "Failed to fetch flights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transport_services')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      setTransports(data || []);
    } catch (error) {
      console.error('Error fetching transport services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transport services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVisaServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saudi_visas')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });
      
      if (error) throw error;
      setVisaServices(data || []);
    } catch (error) {
      console.error('Error fetching visa services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch visa services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGuideServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guide_services')
        .select('*')
        .eq('status', 'active')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      setGuideServices(data || []);
    } catch (error) {
      console.error('Error fetching guide services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch guide services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchZiarathServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ziarath_services')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });
      
      if (error) throw error;
      setZiarathServices(data || []);
    } catch (error) {
      console.error('Error fetching ziarath services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ziarath services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data when step changes
  useEffect(() => {
    switch (activeStep) {
      case 1:
        fetchHotels();
        break;
      case 2:
        fetchFlights();
        break;
      case 3:
        fetchVisaServices();
        break;
      case 4:
        fetchTransports();
        break;
      case 5:
        fetchGuideServices();
        break;
      case 6:
        fetchZiarathServices();
        break;
    }
  }, [activeStep]);

  // Filter functions with proper typing
  const getFilteredHotels = () => {
    return hotels.filter(hotel => {
      if (searchTerm && !hotel.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.city && filters.city !== 'all' && hotel.city !== filters.city) return false;
      return true;
    });
  };

  const getFilteredFlights = () => {
    return flights.filter(flight => {
      if (searchTerm && !flight.airline.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.checkin && new Date(flight.departure_date) < filters.checkin) return false;
      return true;
    });
  };

  const getFilteredVisaServices = () => {
    return visaServices.filter(visa => {
      if (searchTerm && !visa.visa_type.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.nationality && filters.nationality !== 'all' && !visa.description?.toLowerCase().includes(filters.nationality.toLowerCase())) return false;
      return true;
    });
  };

  const getFilteredTransports = () => {
    return transports.filter(transport => {
      if (searchTerm && !transport.route.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.type && filters.type !== 'all' && transport.vehicle_type !== filters.type) return false;
      if (filters.route && filters.route !== 'all' && !transport.route.includes(filters.route)) return false;
      return true;
    });
  };

  const getFilteredGuideServices = () => {
    return guideServices.filter(guide => {
      if (searchTerm && !guide.guide_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.city && filters.city !== 'all' && guide.guide_city !== filters.city) return false;
      if (filters.language && filters.language !== 'all' && !(guide.languages || []).includes(filters.language)) return false;
      return true;
    });
  };

  const getFilteredZiarathServices = () => {
    return ziarathServices.filter(ziarath => {
      if (searchTerm && !ziarath.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.duration && filters.duration !== 'all' && !ziarath.duration.includes(filters.duration)) return false;
      return true;
    });
  };

  // Cart functions
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === item.type);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id && cartItem.type === item.type
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your package`,
    });
  };

  const removeFromCart = (id: string, type: string) => {
    setCart(cart.filter(item => !(item.id === id && item.type === type)));
  };

  const updateQuantity = (id: string, type: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === id && item.type === type
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Component render functions
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return renderHotels();
      case 2:
        return renderFlights();
      case 3:
        return renderVisaServices();
      case 4:
        return renderTransports();
      case 5:
        return renderGuideServices();
      case 6:
        return renderZiarathServices();
      default:
        return null;
    }
  };

  // Enhanced hotel rendering with nights calculation
  const renderHotels = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredHotels().map(hotel => {
            const nights = calculateNights();
            const totalGuests = getTotalGuests();
            const totalRooms = filters.rooms.length;
            const totalPrice = hotel.price_per_night * nights * totalRooms;
            
            return (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-blue-100">
                  {hotel.images && hotel.images[0] ? (
                    <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <MapPin className="w-12 h-12 text-emerald-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{hotel.city}</span>
                  </div>
                  {hotel.distance_from_haram && (
                    <p className="text-xs text-gray-500 mb-2">{hotel.distance_from_haram} from Haram</p>
                  )}
                  
                  {/* Booking Details */}
                  {nights > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{nights} nights</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600">Rooms:</span>
                        <span className="font-medium">{totalRooms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{totalGuests}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">${hotel.price_per_night}/night</div>
                      {nights > 0 && (
                        <div className="text-xl font-bold text-emerald-600">${totalPrice}</div>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => addToCart({
                        id: hotel.id,
                        type: 'hotel',
                        name: `${hotel.name} (${nights} nights)`,
                        price: totalPrice,
                        details: { 
                          city: hotel.city, 
                          rating: hotel.rating,
                          nights: nights,
                          rooms: totalRooms,
                          guests: totalGuests,
                          checkin: filters.checkin,
                          checkout: filters.checkout
                        }
                      })}
                      disabled={!filters.checkin || !filters.checkout}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderFlights = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {getFilteredFlights().map(flight => (
            <Card key={flight.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Plane className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{flight.airline}</h3>
                      <p className="text-gray-600">{flight.sector}</p>
                      <p className="text-sm text-gray-500">Flight {flight.flight_number}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      {flight.departure_time} - {flight.arrival_time}
                    </div>
                    <div className="text-xs text-gray-500">{flight.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">${flight.price}</div>
                    <Button 
                      size="sm"
                      onClick={() => addToCart({
                        id: flight.id,
                        type: 'flight',
                        name: `${flight.airline} - ${flight.sector}`,
                        price: flight.price,
                        details: { 
                          flight_number: flight.flight_number,
                          departure_date: flight.departure_date,
                          departure_time: flight.departure_time,
                          arrival_time: flight.arrival_time
                        }
                      })}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderVisaServices = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {getFilteredVisaServices().map(visa => (
            <Card key={visa.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{visa.visa_type}</h3>
                      <p className="text-gray-600 text-sm">{visa.visa_category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-600">${visa.price}</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="font-medium">Processing Time:</span> {visa.processing_time}</p>
                  {visa.description && (
                    <p className="text-sm text-gray-600">{visa.description}</p>
                  )}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => addToCart({
                    id: visa.id,
                    type: 'visa',
                    name: `${visa.visa_type} - ${visa.visa_category}`,
                    price: visa.price,
                    details: { processing_time: visa.processing_time }
                  })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Package
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderTransports = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {getFilteredTransports().map(transport => (
            <Card key={transport.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{transport.vehicle_name || transport.vehicle_type}</h3>
                      <p className="text-gray-600 text-sm">{transport.route}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-600">${transport.price}</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{transport.capacity} passengers</span>
                  </div>
                  {transport.trip_duration && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{transport.trip_duration}</span>
                    </div>
                  )}
                  {transport.trip_distance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{transport.trip_distance}</span>
                    </div>
                  )}
                </div>
                {transport.features && transport.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {transport.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button 
                  className="w-full"
                  onClick={() => addToCart({
                    id: transport.id,
                    type: 'transport',
                    name: `${transport.vehicle_name || transport.vehicle_type} - ${transport.route}`,
                    price: transport.price,
                    details: { 
                      capacity: transport.capacity,
                      duration: transport.trip_duration,
                      distance: transport.trip_distance
                    }
                  })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Package
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderGuideServices = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {getFilteredGuideServices().map(guide => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{guide.guide_name}</h3>
                      <p className="text-gray-600 text-sm">{guide.guide_city}</p>
                      {guide.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">{guide.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {guide.price && (
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-600">${guide.price}</div>
                    </div>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  {guide.experience && (
                    <p className="text-sm"><span className="font-medium">Experience:</span> {guide.experience}</p>
                  )}
                  {guide.languages && guide.languages.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Languages: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guide.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {guide.service_type && guide.service_type.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Services: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guide.service_type.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => addToCart({
                    id: guide.id,
                    type: 'guide',
                    name: guide.guide_name,
                    price: guide.price || 0,
                    details: { 
                      city: guide.guide_city,
                      experience: guide.experience,
                      languages: guide.languages,
                      services: guide.service_type
                    }
                  })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Package
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderZiarathServices = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {getFilteredZiarathServices().map(ziarath => (
            <Card key={ziarath.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Mountain className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{ziarath.title}</h3>
                      <p className="text-gray-600 text-sm">{ziarath.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-600">${ziarath.price}</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{ziarath.duration}</span>
                  </div>
                  {ziarath.max_participants && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Max Participants:</span>
                      <span className="font-medium">{ziarath.max_participants}</span>
                    </div>
                  )}
                  {ziarath.description && (
                    <p className="text-sm text-gray-600 mt-2">{ziarath.description}</p>
                  )}
                </div>
                {ziarath.inclusions && ziarath.inclusions.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium">Inclusions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ziarath.inclusions.map((inclusion, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {inclusion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button 
                  className="w-full"
                  onClick={() => addToCart({
                    id: ziarath.id,
                    type: 'ziarath',
                    name: ziarath.title,
                    price: ziarath.price,
                    details: { 
                      location: ziarath.location,
                      duration: ziarath.duration,
                      max_participants: ziarath.max_participants
                    }
                  })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Package
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderFilters = () => {
    switch (activeStep) {
      case 1: // Hotels
        return (
          <div className="space-y-4">
            {/* First row - City and dates */}
            <div className="grid grid-cols-3 gap-4">
              <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value === 'all' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Makkah">Makkah</SelectItem>
                  <SelectItem value="Madinah">Madinah</SelectItem>
                  <SelectItem value="Jeddah">Jeddah</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !filters.checkin && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.checkin ? format(filters.checkin, "PPP") : "Check-in date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.checkin}
                    onSelect={(date) => setFilters({ ...filters, checkin: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !filters.checkout && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.checkout ? format(filters.checkout, "PPP") : "Check-out date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.checkout}
                    onSelect={(date) => setFilters({ ...filters, checkout: date })}
                    disabled={(date) => date < new Date() || (filters.checkin && date <= filters.checkin)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Nights display */}
            {calculateNights() > 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                </Badge>
              </div>
            )}

            {/* Room and Guest Configuration */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Rooms & Guests</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRoom}
                  className="h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Room
                </Button>
              </div>
              
              <div className="space-y-3">
                {filters.rooms.map((room, index) => (
                  <div key={room.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-600">
                        Room {index + 1}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Guests:</span>
                        <div className="flex items-center space-x-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateRoomGuests(room.id, room.guests - 1)}
                            disabled={room.guests <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{room.guests}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateRoomGuests(room.id, room.guests + 1)}
                            disabled={room.guests >= 4}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {filters.rooms.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeRoom(room.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-sm text-gray-600 text-center">
                Total: {filters.rooms.length} {filters.rooms.length === 1 ? 'room' : 'rooms'}, {getTotalGuests()} {getTotalGuests() === 1 ? 'guest' : 'guests'}
              </div>
            </div>
          </div>
        );
      case 3: // Visa Services
        return (
          <div className="grid grid-cols-2 gap-4">
            <Select value={filters.nationality} onValueChange={(value) => setFilters({ ...filters, nationality: value === 'all' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nationalities</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="pakistani">Pakistani</SelectItem>
                <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                <SelectItem value="british">British</SelectItem>
                <SelectItem value="american">American</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 4: // Transport
        return (
          <div className="grid grid-cols-2 gap-4">
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.route} onValueChange={(value) => setFilters({ ...filters, route: value === 'all' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                <SelectItem value="airport">Airport Transfer</SelectItem>
                <SelectItem value="makkah">Makkah</SelectItem>
                <SelectItem value="madinah">Madinah</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 5: // Guide Services
        return (
          <div className="grid grid-cols-2 gap-4">
            <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value === 'all' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Makkah">Makkah</SelectItem>
                <SelectItem value="Madinah">Madinah</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.language} onValueChange={(value) => setFilters({ ...filters, language: value === 'all' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Urdu">Urdu</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 6: // Ziarath Services
        return (
          <div className="grid grid-cols-2 gap-4">
            <Select value={filters.duration} onValueChange={(value) => setFilters({ ...filters, duration: value === 'all' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="half">Half Day</SelectItem>
                <SelectItem value="full">Full Day</SelectItem>
                <SelectItem value="2">2 Days</SelectItem>
                <SelectItem value="3">3 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  const handleProceedToCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add some services to your package before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically integrate with a payment processor
    // For now, we'll just show a success message
    toast({
      title: "Package Created!",
      description: `Your custom Umrah package (${cart.length} items, $${getTotalPrice()}) has been created. We'll contact you shortly to finalize the booking.`,
    });

    // Clear cart after successful creation
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 rounded-full px-4 py-2 mb-4">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Build Your Perfect Umrah Experience</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create Your Custom Package
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Design your ideal Umrah journey by selecting from our comprehensive range of services. 
            Choose accommodations, flights, transport, guides, and spiritual tours tailored to your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Steps Navigation */}
          <div className="lg:col-span-3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Package Builder</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = activeStep === step.id;
                    const isCompleted = cart.some(item => {
                      switch (step.id) {
                        case 1: return item.type === 'hotel';
                        case 2: return item.type === 'flight';
                        case 3: return item.type === 'visa';
                        case 4: return item.type === 'transport';
                        case 5: return item.type === 'guide';
                        case 6: return item.type === 'ziarath';
                        default: return false;
                      }
                    });
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start space-x-3",
                          isActive 
                            ? "bg-emerald-600 text-white shadow-lg" 
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          isActive 
                            ? "bg-white/20" 
                            : isCompleted
                            ? "bg-emerald-100"
                            : "bg-gray-100"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            isActive 
                              ? "text-white" 
                              : isCompleted
                              ? "text-emerald-600"
                              : "text-gray-500"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "font-medium text-sm",
                            isActive ? "text-white" : isCompleted ? "text-emerald-700" : "text-gray-900"
                          )}>
                            {step.title}
                          </div>
                          <div className={cn(
                            "text-xs mt-1",
                            isActive ? "text-white/80" : "text-gray-500"
                          )}>
                            {step.description}
                          </div>
                        </div>
                        {isCompleted && (
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Content */}
          <div className="lg:col-span-6">
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {steps.find(s => s.id === activeStep)?.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {steps.find(s => s.id === activeStep)?.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Filters */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                  </div>
                  {renderFilters()}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Cart */}
          <div className="lg:col-span-3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Package</span>
                  <Badge variant="secondary">{cart.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Your package is empty</p>
                    <p className="text-xs text-gray-400 mt-1">Start adding services to build your custom Umrah package</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-semibold text-emerald-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-lg text-gray-900">Total</span>
                        <span className="font-bold text-2xl text-emerald-600">
                          ${getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                      
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
                        onClick={handleProceedToCheckout}
                      >
                        Create Package
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center mt-2">
                        We'll contact you to finalize your booking
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuildYourOwnUmrah;
