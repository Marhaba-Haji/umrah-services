
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TransportBooking = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState('');

  const vehicles = [
    {
      id: 'sedan',
      name: 'Sedan',
      model: 'Toyota Camry or Similar',
      capacity: 3,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=250&fit=crop',
      description: 'Comfortable sedan for small groups',
      basePrice: 80
    },
    {
      id: 'minivan',
      name: 'Mini Van',
      model: 'Hyundai H1 or Similar',
      capacity: 5,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop',
      description: 'Spacious van for families',
      basePrice: 120
    },
    {
      id: 'gmc',
      name: 'GMC',
      model: 'Chevrolet GMC',
      capacity: 7,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=250&fit=crop',
      description: 'Premium SUV for comfortable travel',
      basePrice: 150
    },
    {
      id: 'largevan',
      name: 'Large Van',
      model: 'Toyota Hiace',
      capacity: 10,
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop',
      description: 'Large van for bigger groups',
      basePrice: 180
    },
    {
      id: 'minibus',
      name: 'Mini Bus',
      model: 'Coaster',
      capacity: 20,
      image: 'https://images.unsplash.com/photo-1544620282-0e1511a922e8?w=400&h=250&fit=crop',
      description: 'Mini bus for medium groups',
      basePrice: 250
    },
    {
      id: 'bus',
      name: 'Bus',
      model: 'Volvo',
      capacity: 50,
      image: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=400&h=250&fit=crop',
      description: 'Full-size bus for large groups',
      basePrice: 400
    }
  ];

  const routes = [
    { id: 'jed-makkah', name: 'Jeddah Airport to Makkah Hotel', distance: '80 km', duration: '1.5 hours' },
    { id: 'jed-madinah', name: 'Jeddah Airport to Madinah Hotel', distance: '420 km', duration: '4.5 hours' },
    { id: 'makkah-madinah', name: 'Makkah to Madinah', distance: '450 km', duration: '5 hours' },
    { id: 'madinah-makkah', name: 'Madinah to Makkah', distance: '450 km', duration: '5 hours' },
    { id: 'makkah-jed', name: 'Makkah to Jeddah Airport', distance: '80 km', duration: '1.5 hours' },
    { id: 'madinah-med', name: 'Madinah Hotel to Madinah Airport', distance: '20 km', duration: '30 minutes' },
    { id: 'madinah-jed', name: 'Madinah Hotel to Jeddah Airport', distance: '420 km', duration: '4.5 hours' },
    { id: 'makkah-tour', name: 'Makkah City Day Tour', distance: '50 km', duration: '8 hours' },
    { id: 'madinah-tour', name: 'Madinah City Day Tour', distance: '40 km', duration: '8 hours' },
    { id: 'jeddah-tour', name: 'Jeddah City Day Tour', distance: '60 km', duration: '8 hours' },
    { id: 'taif-tour', name: 'Taif City Day Tour', distance: '100 km', duration: '10 hours' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-emerald-600 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-amber-600 rounded-lg transform rotate-12"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🚗 Book Your <span className="text-emerald-600">Transport</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Safe, comfortable, and reliable transportation for your sacred journey. Choose from our fleet of modern vehicles.
            </p>
          </div>

          {/* Vehicle Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Vehicle</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedVehicle === vehicle.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <CardHeader className="p-0">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        <Users className="w-3 h-3 mr-1" />
                        {vehicle.capacity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{vehicle.model}</p>
                    <p className="text-xs text-gray-500 mb-3">{vehicle.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-emerald-600">
                        ${vehicle.basePrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">Starting from</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Route Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Select Your Route</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((route) => (
                <Card 
                  key={route.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedRoute === route.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                  }`}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{route.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📍 Distance: {route.distance}</p>
                          <p>⏱️ Duration: {route.duration}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Complete Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👥 Number of Passengers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Travel Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {selectedVehicle && selectedRoute && (
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-emerald-800 mb-2">Booking Summary</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Vehicle:</span> {vehicles.find(v => v.id === selectedVehicle)?.name}</p>
                    <p><span className="font-medium">Route:</span> {routes.find(r => r.id === selectedRoute)?.name}</p>
                    <p><span className="font-medium">Passengers:</span> {passengers}</p>
                    <p><span className="font-medium">Date:</span> {date}</p>
                    <p className="text-lg font-bold text-emerald-800">
                      Total: ${selectedVehicle ? vehicles.find(v => v.id === selectedVehicle)!.basePrice.toLocaleString() : '0'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                  disabled={!selectedVehicle || !selectedRoute || !date}
                >
                  🚗 Book Now
                </Button>
                <Button variant="outline" className="flex-1 border-emerald-600 text-emerald-600 py-3">
                  💬 WhatsApp Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TransportBooking;
