
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Users, Wifi, Car, Coffee, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HotelBooking = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [currency, setCurrency] = useState('USD');

  const hotels = {
    makkah: [
      {
        id: 'fairmont-makkah',
        name: 'Fairmont Makkah Clock Royal Tower',
        rating: 5,
        distance: '0.1 km from Haram',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
        amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Spa', 'Room Service'],
        description: 'Luxury hotel with stunning views of Kaaba',
        basePrice: { USD: 800, INR: 66800, SAR: 3000 }
      },
      {
        id: 'hilton-makkah',
        name: 'Hilton Makkah Convention Hotel',
        rating: 5,
        distance: '0.5 km from Haram',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop',
        amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Gym', 'Business Center'],
        description: 'Modern hotel with excellent service',
        basePrice: { USD: 600, INR: 50100, SAR: 2250 }
      },
      {
        id: 'swissotel-makkah',
        name: 'Swissôtel Makkah',
        rating: 5,
        distance: '0.3 km from Haram',
        image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=400&h=250&fit=crop',
        amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Concierge', 'Room Service'],
        description: 'Elegant Swiss hospitality in the heart of Makkah',
        basePrice: { USD: 700, INR: 58450, SAR: 2625 }
      },
      {
        id: 'conrad-makkah',
        name: 'Conrad Makkah',
        rating: 5,
        distance: '0.2 km from Haram',
        image: 'https://images.unsplash.com/photo-1578774296842-c45e472b3028?w=400&h=250&fit=crop',
        amenities: ['Free WiFi', 'Parking', 'Multiple Restaurants', 'Spa', 'Shopping'],
        description: 'Contemporary luxury with panoramic city views',
        basePrice: { USD: 750, INR: 62625, SAR: 2812 }
      }
    ],
    madinah: [
      {
        id: 'oberoi-madinah',
        name: 'The Oberoi Madinah',
        rating: 5,
        distance: '0.1 km from Prophet\'s Mosque',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
        amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Butler Service', 'Garden'],
        description: 'Ultra-luxury hotel with personalized service',
        basePrice: { USD: 900, INR: 75150, SAR: 3375 }
      },
      {
        id: 'hilton-madinah',
        name: 'Hilton Madinah',
        rating: 5,
        distance: '0.3 km from Prophet\'s Mosque',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop',
        amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Fitness Center', 'Meeting Rooms'],
        description: 'Modern comfort with spiritual ambiance',
        basePrice: { USD: 550, INR: 45925, SAR: 2062 }
      },
      {
        id: 'anwar-madinah',
        name: 'Anwar Al Madinah Movenpick',
        rating: 5,
        distance: '0.2 km from Prophet\'s Mosque',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop',
        amenities: ['Free WiFi', 'Restaurant', 'Coffee Shop', 'Concierge', 'Laundry'],
        description: 'Contemporary hotel with Arabian hospitality',
        basePrice: { USD: 650, INR: 54275, SAR: 2437 }
      },
      {
        id: 'shaza-madinah',
        name: 'Shaza Madinah',
        rating: 5,
        distance: '0.4 km from Prophet\'s Mosque',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop',
        amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Shopping', 'Business Center'],
        description: 'Sophisticated accommodation with modern amenities',
        basePrice: { USD: 600, INR: 50100, SAR: 2250 }
      }
    ]
  };

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' }
  ];

  const getCurrencySymbol = () => {
    return currencies.find(curr => curr.code === currency)?.symbol || '$';
  };

  const getHotelPrice = (hotel: any) => {
    return hotel.basePrice[currency as keyof typeof hotel.basePrice] || hotel.basePrice.USD;
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

  const selectedHotels = selectedCity ? hotels[selectedCity as keyof typeof hotels] || [] : [];

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
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🏙️ City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="makkah">🕋 Makkah</SelectItem>
                      <SelectItem value="madinah">🕌 Madinah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">💰 Currency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotels List */}
          {selectedHotels.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-8">
                Available Hotels in {selectedCity === 'makkah' ? '🕋 Makkah' : '🕌 Madinah'}
              </h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {selectedHotels.map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
                          {hotel.distance}
                        </div>
                        
                        <p className="text-gray-600 mb-4">{hotel.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {getAmenityIcon(amenity)}
                              <span className="ml-1">{amenity}</span>
                            </Badge>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{hotel.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold text-emerald-600">
                              {getCurrencySymbol()}{getHotelPrice(hotel).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">/ night</span>
                          </div>
                          <div className="space-x-2">
                            <Button 
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              disabled={!checkIn || !checkOut}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!selectedCity && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a City to View Hotels</h3>
              <p className="text-gray-600">Choose between Makkah or Madinah to see available accommodations</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HotelBooking;
