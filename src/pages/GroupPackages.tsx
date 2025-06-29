import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UmrahPackageFilters from '../components/UmrahPackageFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  CheckCircle,
  Clock,
  Plane
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const GroupPackages = () => {
  const [filters, setFilters] = useState({});
  const [groupPackages, setGroupPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGroupPackages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .eq('is_group_package', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (!error && data) setGroupPackages(data);
      setIsLoading(false);
    };
    fetchGroupPackages();
  }, []);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // Filtering logic can be added here
  };

  // Helper to get currency symbol
  const getCurrencySymbol = (currency: string | undefined) => {
    switch ((currency || 'INR').toUpperCase()) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'SAR': return '﷼';
      default: return currency ? currency.toUpperCase() + ' ' : '₹';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-6 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Left column intentionally left empty for symmetry or future use */}
            <div className="hidden md:block" />
            {/* Right column: Title section */}
            <div className="flex flex-col items-end text-right">
              <Badge className="bg-white/20 text-white border-white/30 mb-2">
                <Users className="w-4 h-4 mr-1" />
                Group Packages
              </Badge>
              <p className="text-base md:text-lg text-emerald-100 max-w-xl">
                Join fellow pilgrims in our carefully crafted group packages
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 max-w-7xl mx-auto items-start">
            {/* Left Panel - Filters */}
            <div className="w-80 flex-shrink-0 self-start">
              <UmrahPackageFilters onFiltersChange={handleFiltersChange} />
            </div>

            {/* Right Panel - Packages */}
            <div className="flex-1">
              {/* Info note about currency */}
              <div className="mb-4 text-sm text-gray-500 italic">All prices are in INR (₹) unless otherwise specified.</div>
              {isLoading ? (
                <div>Loading packages...</div>
              ) : groupPackages.length === 0 ? (
                <div>No group packages found</div>
              ) : (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                  {groupPackages.map((pkg) => (
                    <Card key={pkg.id} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                      {/* Featured image if available */}
                      {pkg.featured_image && (
                        <div className="relative h-48 overflow-hidden">
                          <img src={pkg.featured_image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl font-bold text-gray-900">{pkg.name}</CardTitle>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">{getCurrencySymbol(pkg.currency)}{pkg.price}</div>
                            <div className="text-sm text-gray-500">per person</div>
                          </div>
                        </div>
                        {/* Highlights Row */}
                        <div className="flex flex-wrap gap-3 items-center text-xs text-gray-700 mb-2">
                          {/* Duration */}
                          <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                            <Clock className="w-4 h-4 mr-1 text-emerald-500" />
                            {pkg.duration}
                          </span>
                          {/* Group Size */}
                          {pkg.max_capacity && (
                            <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                              <Users className="w-4 h-4 mr-1 text-emerald-500" />
                              {pkg.max_capacity} max
                            </span>
                          )}
                          {/* Makkah Hotel */}
                          {pkg.makkah_hotel?.name && (
                            <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                              <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
                              Makkah: {pkg.makkah_hotel.name}
                            </span>
                          )}
                          {/* Madinah Hotel */}
                          {pkg.madinah_hotel?.name && (
                            <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                              <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
                              Madinah: {pkg.madinah_hotel.name}
                            </span>
                          )}
                          {/* Departure/Return */}
                          {pkg.flight_details?.departure_from_airport && (
                            <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                              <Plane className="w-4 h-4 mr-1 text-emerald-500" />
                              Dep: {pkg.flight_details.departure_from_airport}
                            </span>
                          )}
                          {pkg.flight_details?.return_from_airport && (
                            <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                              <Plane className="w-4 h-4 mr-1 text-emerald-500" />
                              Ret: {pkg.flight_details.return_from_airport}
                            </span>
                          )}
                          {/* Airline */}
                          {pkg.flight_details?.airline_name && (
                            <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                              <Plane className="w-4 h-4 mr-1 text-emerald-500" />
                              {pkg.flight_details.airline_name}
                            </span>
                          )}
                          {/* Flight Type */}
                          {pkg.flight_details?.flight_type && (
                            <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                              <Plane className="w-4 h-4 mr-1 text-emerald-500" />
                              {pkg.flight_details.flight_type}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Description:</h4>
                          <div className="text-xs text-gray-700">{pkg.description}</div>
                        </div>
                        {/* Inclusions */}
                        {pkg.inclusions && pkg.inclusions.length > 0 && (
                          <div className="mb-2">
                            <h5 className="font-semibold text-gray-900 mb-1">Inclusions:</h5>
                            <div className="flex flex-wrap gap-2">
                              {pkg.inclusions.map((inc, idx) => (
                                <Badge key={idx} className="bg-emerald-100 text-emerald-700 border-emerald-200">{inc}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Cities Covered */}
                        {pkg.cities_covered && pkg.cities_covered.length > 0 && (
                          <div className="mb-2">
                            <h5 className="font-semibold text-gray-900 mb-1">Cities Covered:</h5>
                            <div className="flex flex-wrap gap-2">
                              {pkg.cities_covered.map((city, idx) => (
                                <Badge key={idx} className="bg-teal-100 text-teal-700 border-teal-200">{city}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Call to Action */}
                        <div className="mt-4 flex justify-end">
                          <Button asChild>
                            <Link to={`/group-packages/${pkg.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GroupPackages;
