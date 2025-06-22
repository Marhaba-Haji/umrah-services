
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Wifi, Car, Coffee } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotelFilters from '../components/HotelFilters';

const HotelBooking = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [activeFilters, setActiveFilters] = useState<any>({});

  const makkahHotels = [
    {
      id: 'fairmont-makkah',
      name: 'Fairmont Makkah Clock Royal Tower',
      rating: 5,
      distance: 100,
      city: 'makkah',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Spa', 'Room Service'],
      description: 'Luxury hotel with stunning views of Kaaba',
      startingPrice: 800
    },
    {
      id: 'hilton-makkah',
      name: 'Hilton Makkah Convention Hotel',
      rating: 5,
      distance: 500,
      city: 'makkah',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Gym', 'Business Center'],
      description: 'Modern hotel with excellent service',
      startingPrice: 600
    },
    {
      id: 'swissotel-makkah',
      name: 'Swissôtel Makkah',
      rating: 5,
      distance: 300,
      city: 'makkah',
      image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Concierge', 'Room Service'],
      description: 'Elegant Swiss hospitality in the heart of Makkah',
      startingPrice: 700
    }
  ];

  const madinahHotels = [
    {
      id: 'oberoi-madinah',
      name: 'The Oberoi Madinah',
      rating: 5,
      distance: 100,
      city: 'madinah',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Butler Service', 'Garden'],
      description: 'Ultra-luxury hotel with personalized service',
      startingPrice: 900
    },
    {
      id: 'hilton-madinah',
      name: 'Hilton Madinah',
      rating: 5,
      distance: 300,
      city: 'madinah',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Fitness Center', 'Meeting Rooms'],
      description: 'Modern comfort with spiritual ambiance',
      startingPrice: 550
    },
    {
      id: 'anwar-madinah',
      name: 'Anwar Al Madinah Movenpick',
      rating: 5,
      distance: 200,
      city: 'madinah',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Restaurant', 'Coffee Shop', 'Concierge', 'Laundry'],
      description: 'Contemporary hotel with Arabian hospitality',
      startingPrice: 650
    }
  ];

  const allHotels = [...makkahHotels, ...madinahHotels];

  const getFilteredHotels = () => {
    if (!activeFilters.city) return allHotels;
    
    return allHotels.filter(hotel => {
      const matchesCity = hotel.city === activeFilters.city;
      const matchesPrice = hotel.startingPrice >= activeFilters.priceRange[0] && hotel.startingPrice <= activeFilters.priceRange[1];
      const matchesRating = hotel.rating >= activeFilters.starRating[0] && hotel.rating <= activeFilters.starRating[1];
      const matchesDistance = hotel.distance >= activeFilters.distanceRange[0] && hotel.distance <= activeFilters.distanceRange[1];
      
      return matchesCity && matchesPrice && matchesRating && matchesDistance;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'restaurant':
      case 'coffee shop':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const HotelCard = ({ hotel }: { hotel: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={hotel.image} 
            alt={hotel.name}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
            <div className="flex">{renderStars(hotel.rating)}</div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {hotel.distance}m from {hotel.city === 'makkah' ? 'Haram' : 'Masjid-e-Nabawi'}
          </div>
          
          <p className="text-gray-600 mb-4">{hotel.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {getAmenityIcon(amenity)}
                <span className="ml-1">{amenity}</span>
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Starting from</span>
              <div className="text-2xl font-bold text-emerald-600">
                ${hotel.startingPrice.toLocaleString()}
              </div>
              <span className="text-sm text-gray-500">/ night</span>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Enquire Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const filteredHotels = getFilteredHotels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-emerald-600 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-amber-600 rounded-lg transform rotate-12"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🏨 Book Your <span className="text-emerald-600">Hotel</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay in premium approved hotels close to Haram. Comfortable accommodations for your spiritual journey.
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📅 Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📅 Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content with Filters and Hotels */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <HotelFilters onFiltersChange={setActiveFilters} />
            </div>

            {/* Right Content - Hotels */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeFilters.city ? 
                    `${activeFilters.city === 'makkah' ? '🕋 Makkah' : '🕌 Madinah'} Hotels` : 
                    'Available Hotels'
                  }
                </h2>
                <span className="text-gray-600">
                  {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
                </span>
              </div>

              {/* Hotels List */}
              <div className="space-y-6">
                {filteredHotels.length > 0 ? (
                  filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <div className="text-gray-500 mb-4">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <h3 className="text-lg font-medium">No hotels found</h3>
                      <p className="text-sm">Try adjusting your filters to see more results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HotelBooking;
