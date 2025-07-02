import React, { useState } from 'react';
import { ArrowLeft, Package, Users, Calendar, MapPin, Car, UserCheck, Map, ShoppingCart, Plus, Minus, X, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import FlightStep from '@/components/FlightStep';

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  quantity?: number;
  details?: any;
}

const BuildYourOwnUmrah = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const steps = [
    { id: 0, title: 'Visa', icon: Package, color: 'bg-[#023f3a]' },
    { id: 1, title: 'Flights', icon: Calendar, color: 'bg-[#023f3a]' },
    { id: 2, title: 'Hotels', icon: MapPin, color: 'bg-[#023f3a]' },
    { id: 3, title: 'Transport', icon: Car, color: 'bg-[#023f3a]' },
    { id: 4, title: 'Guide', icon: UserCheck, color: 'bg-[#023f3a]' },
    { id: 5, title: 'Ziarath', icon: Map, color: 'bg-[#023f3a]' }
  ];

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const renderVisaStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#023f3a] mb-2">Select Umrah Visa</h2>
        <p className="text-gray-600">Choose the perfect visa option for your Umrah</p>
      </div>
      
      <div className="grid gap-4">
        {[
          { 
            id: 'visa-1', 
            name: 'Standard Umrah Visa', 
            price: 12000, 
            processing: '10-15 days', 
            validity: '30 days',
            popular: false,
            description: 'Quick'
          },
          { 
            id: 'visa-2', 
            name: 'Express Umrah Visa', 
            price: 18000, 
            processing: '5-7 days', 
            validity: '30 days',
            popular: true,
            description: 'Popular'
          },
          { 
            id: 'visa-3', 
            name: 'Premium Umrah Visa', 
            price: 25000, 
            processing: '3-5 days', 
            validity: '90 days',
            popular: false,
            description: 'Comfort'
          }
        ].map((visa) => (
          <Card 
            key={visa.id} 
            className={`relative border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
              visa.popular ? 'border-[#023f3a] shadow-md' : 'border-gray-200 hover:border-[#023f3a]/30'
            }`}
            onClick={() => addToCart({
              id: visa.id,
              type: 'visa',
              name: visa.name,
              price: visa.price,
              details: { processing: visa.processing, validity: visa.validity }
            })}
          >
            {visa.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#023f3a] text-white px-4 py-1">Most Popular</Badge>
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{visa.name}</h3>
                  </div>
                  <p className="text-sm text-[#023f3a] font-medium mb-3">{visa.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Processing: {visa.processing}</p>
                    <p className="text-sm text-gray-600">Validity: {visa.validity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#023f3a]">₹{visa.price.toLocaleString()}</p>
                  <Button 
                    size="sm" 
                    className="mt-3 bg-[#023f3a] hover:bg-[#023f3a]/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: visa.id,
                        type: 'visa',
                        name: visa.name,
                        price: visa.price,
                        details: { processing: visa.processing, validity: visa.validity }
                      });
                    }}
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
      
      <div className="bg-[#023f3a]/5 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#023f3a] mt-0.5" />
        <div>
          <h4 className="font-semibold text-[#023f3a] mb-1">Recommended Visa</h4>
          <p className="text-sm text-gray-700">Express visa allows comfortable processing time with reliable approval rates.</p>
        </div>
      </div>
    </div>
  );

  const renderHotelsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#023f3a] mb-2">Select Hotels</h2>
        <p className="text-gray-600">Choose your accommodation in holy cities</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#023f3a]" />
            Makkah Hotels
          </h3>
          <div className="grid gap-4">
            {[
              { id: 'makkah-1', name: 'Dar Al Eiman Royal', price: 8500, rating: 4.5, distance: '200m from Haram', description: 'Comfort' },
              { id: 'makkah-2', name: 'Pullman ZamZam Makkah', price: 15000, rating: 5, distance: '100m from Haram', description: 'Premium', popular: true }
            ].map((hotel) => (
              <Card key={hotel.id} className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                hotel.popular ? 'border-[#023f3a] shadow-md' : 'border-gray-200 hover:border-[#023f3a]/30'
              }`}>
                {hotel.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#023f3a] text-white px-4 py-1">Recommended</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{hotel.name}</h4>
                      <p className="text-sm text-[#023f3a] font-medium mb-2">{hotel.description}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600">{hotel.distance}</p>
                        <p className="text-xs text-gray-500">per night</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#023f3a]">₹{hotel.price.toLocaleString()}</p>
                      <Button 
                        size="sm" 
                        className="mt-3 bg-[#023f3a] hover:bg-[#023f3a]/90"
                        onClick={() => addToCart({
                          id: hotel.id,
                          type: 'hotel',
                          name: `${hotel.name} - Makkah`,
                          price: hotel.price,
                          details: { rating: hotel.rating, distance: hotel.distance, city: 'Makkah' }
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
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Madinah Hotels
          </h3>
          <div className="grid gap-4">
            {[
              { id: 'madinah-1', name: 'Anwar Al Madinah Movenpick', price: 7500, rating: 4.5, distance: '300m from Masjid Nabawi', description: 'Comfort' },
              { id: 'madinah-2', name: 'Shaza Al Madinah', price: 12000, rating: 5, distance: '150m from Masjid Nabawi', description: 'Premium', popular: true }
            ].map((hotel) => (
              <Card key={hotel.id} className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                hotel.popular ? 'border-[#023f3a] shadow-md' : 'border-gray-200 hover:border-[#023f3a]/30'
              }`}>
                {hotel.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#023f3a] text-white px-4 py-1">Recommended</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{hotel.name}</h4>
                      <p className="text-sm text-[#023f3a] font-medium mb-2">{hotel.description}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600">{hotel.distance}</p>
                        <p className="text-xs text-gray-500">per night</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#023f3a]">₹{hotel.price.toLocaleString()}</p>
                      <Button 
                        size="sm" 
                        className="mt-3 bg-[#023f3a] hover:bg-[#023f3a]/90"
                        onClick={() => addToCart({
                          id: hotel.id,
                          type: 'hotel',
                          name: `${hotel.name} - Madinah`,
                          price: hotel.price,
                          details: { rating: hotel.rating, distance: hotel.distance, city: 'Madinah' }
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
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderVisaStep();
      case 1:
        return <FlightStep onFlightSelect={addToCart} />;
      case 2:
        return renderHotelsStep();
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#023f3a] mb-2">Select Transport</h2>
              <p className="text-gray-600">Choose your travel comfort</p>
            </div>
            <div className="grid gap-4">
              {[
                { id: 'transport-1', name: 'Airport Transfer - Sedan', price: 3500, capacity: '4 passengers', route: 'Jeddah Airport to Hotel', description: 'Quick' },
                { id: 'transport-2', name: 'Airport Transfer - Van', price: 5000, capacity: '8 passengers', route: 'Jeddah Airport to Hotel', description: 'Popular', popular: true },
                { id: 'transport-3', name: 'Makkah-Madinah Transfer', price: 8000, capacity: '4-8 passengers', route: 'Hotel to Hotel', description: 'Comfort' }
              ].map((transport) => (
                <Card key={transport.id} className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  transport.popular ? 'border-[#023f3a] shadow-md' : 'border-gray-200 hover:border-[#023f3a]/30'
                }`}>
                  {transport.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#023f3a] text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{transport.name}</h4>
                        <p className="text-sm text-[#023f3a] font-medium mb-2">{transport.description}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{transport.capacity}</p>
                          <p className="text-sm text-gray-600">{transport.route}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#023f3a]">₹{transport.price.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="mt-3 bg-[#023f3a] hover:bg-[#023f3a]/90"
                          onClick={() => addToCart({
                            id: transport.id,
                            type: 'transport',
                            name: transport.name,
                            price: transport.price,
                            details: { capacity: transport.capacity, route: transport.route }
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
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#023f3a] mb-2">Select Guide Services</h2>
              <p className="text-gray-600">Get expert guidance for your journey</p>
            </div>
            <div className="grid gap-4">
              {[
                { id: 'guide-1', name: 'Personal Umrah Guide', price: 15000, duration: 'Full journey', languages: 'English, Hindi, Urdu', description: 'Premium' },
                { id: 'guide-2', name: 'Group Guide Service', price: 8000, duration: 'Full journey', languages: 'English, Hindi', description: 'Popular', popular: true },
                { id: 'guide-3', name: 'Ziarath Guide', price: 5000, duration: 'Per day', languages: 'English, Arabic', description: 'Essential' }
              ].map((guide) => (
                <Card key={guide.id} className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  guide.popular ? 'border-[#023f3a] shadow-md' : 'border-gray-200 hover:border-[#023f3a]/30'
                }`}>
                  {guide.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#023f3a] text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{guide.name}</h4>
                        <p className="text-sm text-[#023f3a] font-medium mb-2">{guide.description}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{guide.duration}</p>
                          <p className="text-sm text-gray-600">Languages: {guide.languages}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#023f3a]">₹{guide.price.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="mt-3 bg-[#023f3a] hover:bg-[#023f3a]/90"
                          onClick={() => addToCart({
                            id: guide.id,
                            type: 'guide',
                            name: guide.name,
                            price: guide.price,
                            details: { duration: guide.duration, languages: guide.languages }
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
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#023f3a] mb-2">Select Ziarath Tours</h2>
              <p className="text-gray-600">Explore historical Islamic sites</p>
            </div>
            <div className="grid gap-4">
              {[
                { id: 'ziarath-1', name: 'Makkah Historical Sites', price: 4500, duration: '4 hours', sites: '8 locations', description: 'Essential' },
                { id: 'ziarath-2', name: 'Madinah Ziarath Tour', price: 5000, duration: '6 hours', sites: '12 locations', description: 'Popular', popular: true },
                { id: 'ziarath-3', name: 'Combined Ziarath Package', price: 8500, duration: '2 days', sites: '20+ locations', description: 'Complete' }
              ].map((ziarath) => (
                <Card key={ziarath.id} className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  ziarath.popular ? 'border-[#023f3a] shadow-md' : 'border-gray-200 hover:border-[#023f3a]/30'
                }`}>
                  {ziarath.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#023f3a] text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{ziarath.name}</h4>
                        <p className="text-sm text-[#023f3a] font-medium mb-2">{ziarath.description}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{ziarath.duration} • {ziarath.sites}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#023f3a]">₹{ziarath.price.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="mt-3 bg-[#023f3a] hover:bg-[#023f3a]/90"
                          onClick={() => addToCart({
                            id: ziarath.id,
                            type: 'ziarath',
                            name: ziarath.name,
                            price: ziarath.price,
                            details: { duration: ziarath.duration, sites: ziarath.sites }
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Build Your Umrah</h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs text-[#023f3a] border-[#023f3a]">
                  Step {activeStep + 1} of {steps.length}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCart(true)}
              className="relative p-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#023f3a] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b px-3 py-3">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isCompleted = cart.some(item => {
              switch (step.id) {
                case 0: return item.type === 'visa';
                case 1: return item.type === 'flight';
                case 2: return item.type === 'hotel';
                case 3: return item.type === 'transport';
                case 4: return item.type === 'guide';
                case 5: return item.type === 'ziarath';
                default: return false;
              }
            });

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-200 min-w-[80px] ${
                  isActive 
                    ? 'bg-[#023f3a] text-white shadow-lg' 
                    : isCompleted
                    ? 'bg-green-50 text-[#023f3a] border border-green-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-1" />
                  {isCompleted && !isActive && (
                    <Check className="w-3 h-3 absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5" />
                  )}
                </div>
                <span className="text-xs font-medium">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-32">
        {renderStepContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
        <div className="px-4 py-4">
          {cart.length > 0 && (
            <div className="mb-4 p-4 bg-[#023f3a]/5 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{getTotalItems()} items selected</p>
                  <p className="text-xl font-bold text-[#023f3a]">₹{getTotalPrice().toLocaleString()}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCart(true)}
                  className="text-[#023f3a] border-[#023f3a]"
                >
                  View Cart
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 py-6"
              disabled={activeStep === 0}
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            >
              Previous
            </Button>
            <Button
              className="flex-1 bg-[#023f3a] hover:bg-[#023f3a]/90 py-6"
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            >
              {activeStep === steps.length - 1 ? 'Complete' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[85vh] rounded-t-2xl overflow-hidden">
            <div className="sticky top-0 bg-white border-b px-4 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#023f3a]">Your Package ({getTotalItems()} items)</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-[50vh] px-4 py-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No items in your package yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600 capitalize mb-2">{item.type}</p>
                        <p className="font-bold text-[#023f3a] text-lg">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 w-8 h-8 p-0 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t px-4 py-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#023f3a]">₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <Button className="w-full bg-[#023f3a] hover:bg-[#023f3a]/90 py-6 text-lg">
                  Proceed to Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildYourOwnUmrah;
