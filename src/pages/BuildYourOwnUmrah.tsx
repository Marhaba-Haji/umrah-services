
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, ChevronLeft, ChevronRight, Users, Clock, MapPin, Plane, Car, FileText, UserCheck, Plus, Minus, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FlightStep from '@/components/FlightStep';
import CartValueWidget from '@/components/CartValueWidget';

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  details?: any;
}

const BuildYourOwnUmrah = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState('');
  const [groupSize, setGroupSize] = useState({
    adults: 2,
    children: 0,
    childrenWithoutBed: 0,
    infants: 0
  });
  const [makkahHotel, setMakkahHotel] = useState<any>(null);
  const [madinahHotel, setMadinahHotel] = useState<any>(null);
  const [selectedFlight, setSelectedFlight] = useState<CartItem | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<any>(null);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const steps = [
    { id: 1, title: 'Duration', icon: Clock },
    { id: 2, title: 'Group Size', icon: Users },
    { id: 3, title: 'Makkah Hotel', icon: MapPin },
    { id: 4, title: 'Madinah Hotel', icon: MapPin },
    { id: 5, title: 'Flights', icon: Plane },
    { id: 6, title: 'Visa', icon: FileText },
    { id: 7, title: 'Transport', icon: Car },
    { id: 8, title: 'Guide', icon: UserCheck },
    { id: 9, title: 'Review', icon: Check }
  ];

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(cartItem => cartItem.id === item.id && cartItem.type === item.type);
      if (existingIndex !== -1) {
        // Replace existing item
        const newItems = [...prev];
        newItems[existingIndex] = item;
        return newItems;
      } else {
        // Add new item
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (itemId: string, itemType: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === itemId && item.type === itemType)));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFlightSelect = (flight: Omit<CartItem, 'quantity'>) => {
    const flightItem: CartItem = {
      ...flight,
      price: flight.price * (groupSize.adults + groupSize.children + groupSize.childrenWithoutBed)
    };
    setSelectedFlight(flightItem);
    addToCart(flightItem);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Duration
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How long is your Umrah journey?</h2>
              <p className="text-gray-600">Choose the duration that works best for you</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[7, 14, 21, 3, 5].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedDuration(days)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedDuration === days
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-xl font-bold text-gray-900">{days} Days</div>
                      <div className="text-sm text-gray-600">
                        {days === 7 && 'Perfect for first-time pilgrims'}
                        {days === 14 && 'Most popular choice'}
                        {days === 21 && 'Extended spiritual journey'}
                        {days === 3 && 'Quick spiritual visit'}
                        {days === 5 && 'Short but meaningful'}
                      </div>
                    </div>
                    {selectedDuration === days && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
              
              {/* Custom Duration */}
              <div className={`p-6 rounded-2xl border-2 ${
                customDuration ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <div className="text-xl font-bold text-gray-900">Custom Duration</div>
                    <div className="text-sm text-gray-600">Enter your preferred number of days</div>
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="Enter days"
                  value={customDuration}
                  onChange={(e) => {
                    setCustomDuration(e.target.value);
                    setSelectedDuration(null);
                  }}
                  className="h-12 text-center text-lg font-semibold"
                  min="1"
                  max="90"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Group Size
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Who's traveling with you?</h2>
              <p className="text-gray-600">Tell us about your travel group</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Adults</h3>
                    <p className="text-sm text-gray-600">Age 12+ years</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setGroupSize(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                      disabled={groupSize.adults <= 1}
                      className="h-12 w-12 rounded-full"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{groupSize.adults}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setGroupSize(prev => ({ ...prev, adults: prev.adults + 1 }))}
                      className="h-12 w-12 rounded-full"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Children (with bed)</h3>
                    <p className="text-sm text-gray-600">Age 2-11 years</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setGroupSize(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                      disabled={groupSize.children <= 0}
                      className="h-12 w-12 rounded-full"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{groupSize.children}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setGroupSize(prev => ({ ...prev, children: prev.children + 1 }))}
                      className="h-12 w-12 rounded-full"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Children (without bed)</h3>
                    <p className="text-sm text-gray-600">Age 2-11 years, sharing bed</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setGroupSize(prev => ({ ...prev, childrenWithoutBed: Math.max(0, prev.childrenWithoutBed - 1) }))}
                      disabled={groupSize.childrenWithoutBed <= 0}
                      className="h-12 w-12 rounded-full"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{groupSize.childrenWithoutBed}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setGroupSize(prev => ({ ...prev, childrenWithoutBed: prev.childrenWithoutBed + 1 }))}
                      className="h-12 w-12 rounded-full"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Infants</h3>
                    <p className="text-sm text-gray-600">Under 2 years</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setGroupSize(prev => ({ ...prev, infants: Math.max(0, prev.infants - 1) }))}
                      disabled={groupSize.infants <= 0}
                      className="h-12 w-12 rounded-full"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{groupSize.infants}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setGroupSize(prev => ({ ...prev, infants: prev.infants + 1 }))}
                      className="h-12 w-12 rounded-full"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <div className="text-center">
                  <div className="text-sm text-emerald-700 font-medium">Total Travelers</div>
                  <div className="text-2xl font-bold text-emerald-800">
                    {groupSize.adults + groupSize.children + groupSize.childrenWithoutBed + groupSize.infants}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Makkah Hotel
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your Makkah hotel</h2>
              <p className="text-gray-600">Stay close to the sacred Haram</p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => nextStep()}
              className="w-full h-14 rounded-2xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
            >
              Skip Makkah Hotel Selection
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Or choose from our recommended hotels below
            </div>

            {/* Sample hotel options */}
            <div className="space-y-4">
              {[
                { name: 'Pullman ZamZam Makkah', distance: '50m from Haram', price: 15000, rating: 5 },
                { name: 'Swissotel Makkah', distance: '100m from Haram', price: 12000, rating: 5 },
                { name: 'Hilton Suites Makkah', distance: '200m from Haram', price: 10000, rating: 4 }
              ].map((hotel, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-emerald-300 cursor-pointer transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-gray-600">{hotel.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(hotel.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-600">₹{hotel.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4: // Madinah Hotel
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your Madinah hotel</h2>
              <p className="text-gray-600">Stay near the Prophet's Mosque</p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => nextStep()}
              className="w-full h-14 rounded-2xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
            >
              Skip Madinah Hotel Selection
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Or choose from our recommended hotels below
            </div>

            {/* Sample hotel options */}
            <div className="space-y-4">
              {[
                { name: 'Pullman ZamZam Madinah', distance: '50m from Masjid Nabawi', price: 12000, rating: 5 },
                { name: 'Hilton Madinah', distance: '100m from Masjid Nabawi', price: 10000, rating: 5 },
                { name: 'Marriott Madinah', distance: '150m from Masjid Nabawi', price: 8000, rating: 4 }
              ].map((hotel, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-emerald-300 cursor-pointer transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-gray-600">{hotel.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(hotel.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-600">₹{hotel.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5: // Flights
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find your flights</h2>
              <p className="text-gray-600">Search and select the best flights for your journey</p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => nextStep()}
              className="w-full h-14 rounded-2xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-emerald-300 hover:text-emerald-600 mb-6"
            >
              Skip Flight Selection
            </Button>
            
            <FlightStep 
              onFlightSelect={handleFlightSelect}
              groupSize={{
                adults: groupSize.adults,
                children: groupSize.children + groupSize.childrenWithoutBed,
                infants: groupSize.infants
              }}
            />
          </div>
        );

      case 6: // Visa
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Visa assistance</h2>
              <p className="text-gray-600">Get help with your Saudi visa application</p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => nextStep()}
              className="w-full h-14 rounded-2xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
            >
              Skip Visa Selection
            </Button>
            
            <div className="space-y-4">
              {[
                { type: 'Umrah Visa', price: 5000, processing: '3-5 working days' },
                { type: 'Tourist Visa', price: 8000, processing: '2-3 working days' }
              ].map((visa, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-emerald-300 cursor-pointer transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{visa.type}</h3>
                        <p className="text-sm text-gray-600">Processing: {visa.processing}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-600">₹{visa.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 7: // Transport
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Transportation</h2>
              <p className="text-gray-600">Choose your transport options</p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => nextStep()}
              className="w-full h-14 rounded-2xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
            >
              Skip Transport Selection
            </Button>
            
            <div className="space-y-4">
              {[
                { type: 'Airport Transfer', description: 'Round trip airport transfers', price: 2000 },
                { type: 'Ziarath Tour', description: 'Religious sites tour', price: 5000 },
                { type: 'Private Car', description: 'Dedicated car with driver', price: 8000 }
              ].map((transport, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-emerald-300 cursor-pointer transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{transport.type}</h3>
                        <p className="text-sm text-gray-600">{transport.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-600">₹{transport.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">per group</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 8: // Guide
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Guide services</h2>
              <p className="text-gray-600">Enhance your journey with expert guidance</p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => nextStep()}
              className="w-full h-14 rounded-2xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
            >
              Skip Guide Selection
            </Button>
            
            <div className="space-y-4">
              {[
                { name: 'Islamic Scholar Guide', languages: 'English, Arabic, Urdu', price: 10000 },
                { name: 'Local Expert Guide', languages: 'English, Hindi', price: 7000 },
                { name: 'Multilingual Guide', languages: 'English, Arabic, Urdu, Hindi', price: 12000 }
              ].map((guide, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-emerald-300 cursor-pointer transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.name}</h3>
                        <p className="text-sm text-gray-600">Languages: {guide.languages}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-600">₹{guide.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">per group</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 9: // Review
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review your package</h2>
              <p className="text-gray-600">Confirm your selections and pricing</p>
            </div>

            <div className="space-y-6">
              {/* Duration Summary */}
              <Card className="border-emerald-200 bg-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <Clock className="w-5 h-5" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-emerald-700 font-semibold">
                    {selectedDuration ? `${selectedDuration} days` : `${customDuration} days`}
                  </p>
                </CardContent>
              </Card>

              {/* Group Size Summary */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Users className="w-5 h-5" />
                    Group Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-blue-700">
                      <span className="font-semibold">{groupSize.adults}</span> Adults
                    </div>
                    <div className="text-blue-700">
                      <span className="font-semibold">{groupSize.children}</span> Children (with bed)
                    </div>
                    <div className="text-blue-700">
                      <span className="font-semibold">{groupSize.childrenWithoutBed}</span> Children (no bed)
                    </div>
                    <div className="text-blue-700">
                      <span className="font-semibold">{groupSize.infants}</span> Infants
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Services */}
              {cartItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-800">Selected Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-600">₹{item.price.toLocaleString()}</div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id, item.type)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">Total Package Cost</span>
                          <span className="text-2xl font-bold text-emerald-600">
                            ₹{cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold">
                Book This Package
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Step Indicator - Mobile Optimized */}
        <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-8 shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900">Build Your Umrah</h1>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Current Step Info */}
          <div className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 text-emerald-600" })}
            <span className="font-medium text-gray-900">{steps[currentStep - 1].title}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex-1 h-14 rounded-2xl text-base font-semibold"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === steps.length}
              className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-base font-semibold"
            >
              {currentStep === steps.length ? 'Complete' : 'Next'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Value Widget */}
      <CartValueWidget cartItems={cartItems} />
      
      <Footer />
    </div>
  );
};

export default BuildYourOwnUmrah;
