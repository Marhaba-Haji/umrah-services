import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Car, Users, Clock, MapPin, Phone, Mail, Star, Shield, Award, CalendarIcon, Luggage } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TransportService {
  id: string;
  route: string;
  vehicle_type: string;
  capacity: number;
  price: number;
  description: string;
  vehicle_name: string;
  vehicle_image: string;
  features: string[];
  is_ac: boolean;
  is_active: boolean;
  trip_duration: string;
  trip_distance: string;
  driver_name: string;
  driver_contact: string;
  luggage_capacity: string;
  vehicle_details: Record<string, any>;
  created_at: string;
}

const TransportBooking = () => {
  const [services, setServices] = useState<TransportService[]>([]);
  const [filteredServices, setFilteredServices] = useState<TransportService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filters, setFilters] = useState({
    vehicleType: '',
    route: '',
    priceRange: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('transport_services')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formattedData = data?.map(service => ({
          ...service,
          vehicle_details: service.vehicle_details || {}
        })) || [];
        
        setServices(formattedData);
        setFilteredServices(formattedData);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load transport services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter functions
  useEffect(() => {
    let filtered = [...services];

    if (filters.vehicleType) {
      filtered = filtered.filter(s => s.vehicle_type === filters.vehicleType);
    }
    if (filters.route) {
      filtered = filtered.filter(s => s.route.toLowerCase().includes(filters.route.toLowerCase()));
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => Number(p));
      filtered = filtered.filter(s => s.price >= min && s.price <= max);
    }

    setFilteredServices(filtered);
  }, [filters, services]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading transport services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Transport Booking</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Book reliable and comfortable transportation for your journey
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div>
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              id="vehicleType"
              value={filters.vehicleType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, vehicleType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="minivan">Minivan</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="route">Route</Label>
            <Input
              id="route"
              placeholder="Search route"
              value={filters.route}
              onChange={(e) => setFilters(prev => ({ ...prev, route: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="priceRange">Price Range (₹)</Label>
            <Select
              id="priceRange"
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="0-1000">0 - 1,000</SelectItem>
                <SelectItem value="1001-3000">1,001 - 3,000</SelectItem>
                <SelectItem value="3001-5000">3,001 - 5,000</SelectItem>
                <SelectItem value="5001-10000">5,001 - 10,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <Card key={service.id} className="shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{service.vehicle_name}</span>
                  <Badge>{service.vehicle_type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{service.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{service.capacity} seats</span>
                  </div>
                </div>

                <p className="text-gray-600">{service.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{service.trip_duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{service.trip_distance}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.features?.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    )) || (
                      <Badge variant="outline" className="text-xs">
                        {service.is_ac ? 'AC' : 'Non-AC'}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TransportBooking;
