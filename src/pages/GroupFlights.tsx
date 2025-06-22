import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Plane, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const GroupFlights = () => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerCount, setPassengerCount] = useState('10');
  const [tripType, setTripType] = useState('round-trip');

  const popularRoutes = [
    { from: 'Delhi', to: 'Jeddah', price: 'Starting from $450' },
    { from: 'Mumbai', to: 'Jeddah', price: 'Starting from $420' },
    { from: 'Bangalore', to: 'Jeddah', price: 'Starting from $480' },
    { from: 'Hyderabad', to: 'Jeddah', price: 'Starting from $460' },
    { from: 'Chennai', to: 'Jeddah', price: 'Starting from $470' },
    { from: 'Ahmedabad', to: 'Jeddah', price: 'Starting from $440' },
    { from: 'Calicut', to: 'Jeddah', price: 'Starting from $490' },
    { from: 'Lucknow', to: 'Jeddah', price: 'Starting from $465' },
    { from: 'Kolkata', to: 'Jeddah', price: 'Starting from $485' },
    { from: 'Delhi', to: 'Madinah', price: 'Starting from $470' },
    { from: 'Mumbai', to: 'Madinah', price: 'Starting from $440' },
    { from: 'Bangalore', to: 'Madinah', price: 'Starting from $500' },
    { from: 'Hyderabad', to: 'Madinah', price: 'Starting from $480' },
    { from: 'Chennai', to: 'Madinah', price: 'Starting from $490' },
    { from: 'Ahmedabad', to: 'Madinah', price: 'Starting from $460' },
    { from: 'Calicut', to: 'Madinah', price: 'Starting from $510' },
    { from: 'Lucknow', to: 'Madinah', price: 'Starting from $485' },
    { from: 'Kolkata', to: 'Madinah', price: 'Starting from $505' }
  ];

  const handleRouteSelect = (route: { from: string; to: string }) => {
    setFromCity(route.from);
    setToCity(route.to);
  };

  const handleSearch = () => {
    console.log('Searching group flights:', {
      fromCity,
      toCity,
      departureDate,
      returnDate,
      passengerCount,
      tripType
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Group Flight Bookings
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Special rates for group travel to Saudi Arabia for Umrah pilgrimage
          </p>
          <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-lg">
            ✈️ Minimum 10 Passengers Required
          </Badge>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="w-6 h-6 text-emerald-600" />
              <span>Search Group Flights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Trip Type</label>
                <Select value={tripType} onValueChange={setTripType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round-trip">Round Trip</SelectItem>
                    <SelectItem value="one-way">One Way</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">From City</label>
                <Input
                  placeholder="Enter departure city"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">To City</label>
                <Input
                  placeholder="Enter destination city"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Passengers</label>
                <Select value={passengerCount} onValueChange={setPassengerCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 41 }, (_, i) => i + 10).map((count) => (
                      <SelectItem key={`passengers-${count}`} value={count.toString()}>
                        {count} Passengers
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Departure Date</label>
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>

              {tripType === 'round-trip' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Return Date</label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 px-8 py-3"
              size="lg"
            >
              <Plane className="w-5 h-5 mr-2" />
              Search Group Flights
            </Button>
          </CardContent>
        </Card>

        {/* Popular Routes Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Popular Group Flight Routes
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Click on any route to automatically fill your search form
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500"
                onClick={() => handleRouteSelect(route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-gray-900">{route.from}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-gray-900">{route.to}</span>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">{route.price}</p>
                  <p className="text-xs text-gray-500 mt-1">Click to select this route</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Group Discounts</h3>
              <p className="text-sm text-gray-600">Special discounted rates for groups of 10 or more passengers</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Dates</h3>
              <p className="text-sm text-gray-600">Choose from multiple departure dates that suit your group</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Direct Flights</h3>
              <p className="text-sm text-gray-600">Convenient direct flights to Jeddah and Madinah from major Indian cities</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GroupFlights;
