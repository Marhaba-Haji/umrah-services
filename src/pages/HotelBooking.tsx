import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Users, Wifi, Car, Coffee, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HotelBooking = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const makkahHotels = [
    {
      id: 'fairmont-makkah',
      name: 'Fairmont Makkah Clock Royal Tower',
      rating: 5,
      distance: 100,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Spa', 'Room Service'],
      description: 'Luxury hotel with stunning views of Kaaba',
      startingPrice: { USD: 800, INR: 66800, SAR: 3000 }
    },
    {
      id: 'hilton-makkah',
      name: 'Hilton Makkah Convention Hotel',
      rating: 5,
      distance: 500,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Gym', 'Business Center'],
      description: 'Modern hotel with excellent service',
      startingPrice: { USD: 600, INR: 50100, SAR: 2250 }
    },
    {
      id: 'swissotel-makkah',
      name: 'Swissôtel Makkah',
      rating: 5,
      distance: 300,
      image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Concierge', 'Room Service'],
      description: 'Elegant Swiss hospitality in the heart of Makkah',
      startingPrice: { USD: 700, INR: 58450, SAR: 2625 }
    }
  ];

  const madinahHotels = [
    {
      id: 'oberoi-madinah',
      name: 'The Oberoi Madinah',
      rating: 5,
      distance: 100,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Butler Service', 'Garden'],
      description: 'Ultra-luxury hotel with personalized service',
      startingPrice: { USD: 900, INR: 75150, SAR: 3375 }
    },
    {
      id: 'hilton-madinah',
      name: 'Hilton Madinah',
      rating: 5,
      distance: 300,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Fitness Center', 'Meeting Rooms'],
      description: 'Modern comfort with spiritual ambiance',
      startingPrice: { USD: 550, INR: 45925, SAR: 2062 }
    },
    {
      id: 'anwar-madinah',
      name: 'Anwar Al Madinah Movenpick',
      rating: 5,
      distance: 200,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop',
      amenities: ['Free WiFi', 'Restaurant', 'Coffee Shop', 'Concierge', 'Laundry'],
      description: 'Contemporary hotel with Arabian hospitality',
      startingPrice: { USD: 650, INR: 54275, SAR: 2437 }
    }
  ];

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

  const HotelCard = ({ hotel, city }: { hotel: any, city: 'makkah' | 'madinah' }) => (
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
            {hotel.distance}m from {city === 'makkah' ? 'Haram' : 'Masjid-e-Nabawi'}
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
                ${'$'}{hotel.startingPrice.USD.toLocaleString()}
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

          {/* Booking Form */}
          <Card className="max-w-4xl mx-auto mb-12">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">👥 Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Makkah Hotels Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              🕋 Makkah Hotels
            </h2>
            <div className="space-y-6">
              {makkahHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} city="makkah" />
              ))}
            </div>
          </div>

          {/* Madinah Hotels Section */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              🕌 Madinah Hotels
            </h2>
            <div className="space-y-6">
              {madinahHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} city="madinah" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HotelBooking;
