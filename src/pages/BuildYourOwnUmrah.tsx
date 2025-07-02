
import React, { useState } from 'react';
import { ArrowLeft, Package, Users, Calendar, MapPin, Car, UserCheck, Map, ShoppingCart, Plus, Minus, X } from 'lucide-react';
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
    { id: 0, title: 'Visa', icon: Package, color: 'bg-green-500' },
    { id: 1, title: 'Flights', icon: Calendar, color: 'bg-blue-500' },
    { id: 2, title: 'Hotels', icon: MapPin, color: 'bg-purple-500' },
    { id: 3, title: 'Transport', icon: Car, color: 'bg-orange-500' },
    { id: 4, title: 'Guide', icon: UserCheck, color: 'bg-teal-500' },
    { id: 5, title: 'Ziarath', icon: Map, color: 'bg-pink-500' }
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Umrah Visa</h3>
            <div className="space-y-3">
              {[
                { id: 'visa-1', name: 'Standard Umrah Visa', price: 12000, processing: '10-15 days', validity: '30 days' },
                { id: 'visa-2', name: 'Express Umrah Visa', price: 18000, processing: '5-7 days', validity: '30 days' },
                { id: 'visa-3', name: 'Premium Umrah Visa', price: 25000, processing: '3-5 days', validity: '90 days' }
              ].map((visa) => (
                <Card key={visa.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{visa.name}</h4>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">Processing: {visa.processing}</p>
                          <p className="text-xs text-gray-600">Validity: {visa.validity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#023f3a] text-sm">₹{visa.price.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-[#023f3a] hover:bg-[#023f3a]/90 text-xs px-3 py-1.5 h-auto"
                          onClick={() => addToCart({
                            id: visa.id,
                            type: 'visa',
                            name: visa.name,
                            price: visa.price,
                            details: { processing: visa.processing, validity: visa.validity }
                          })}
                        >
                          <Plus className="w-3 h-3 mr-1" />
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

      case 1:
        return <FlightStep onFlightSelect={addToCart} />;

      case 2:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Hotels</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-3 text-sm">Makkah Hotels</h4>
                <div className="space-y-3">
                  {[
                    { id: 'makkah-1', name: 'Dar Al Eiman Royal', price: 8500, rating: 4.5, distance: '200m from Haram' },
                    { id: 'makkah-2', name: 'Pullman ZamZam Makkah', price: 15000, rating: 5, distance: '100m from Haram' }
                  ].map((hotel) => (
                    <Card key={hotel.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm mb-1">{hotel.name}</h5>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-600">★ {hotel.rating} • {hotel.distance}</p>
                              <p className="text-xs text-gray-600">Per night</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#023f3a] text-sm">₹{hotel.price.toLocaleString()}</p>
                            <Button 
                              size="sm" 
                              className="mt-2 bg-[#023f3a] hover:bg-[#023f3a]/90 text-xs px-3 py-1.5 h-auto"
                              onClick={() => addToCart({
                                id: hotel.id,
                                type: 'hotel',
                                name: `${hotel.name} - Makkah`,
                                price: hotel.price,
                                details: { rating: hotel.rating, distance: hotel.distance, city: 'Makkah' }
                              })}
                            >
                              <Plus className="w-3 h-3 mr-1" />
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
                <h4 className="font-medium text-gray-800 mb-3 text-sm">Madinah Hotels</h4>
                <div className="space-y-3">
                  {[
                    { id: 'madinah-1', name: 'Anwar Al Madinah Movenpick', price: 7500, rating: 4.5, distance: '300m from Masjid Nabawi' },
                    { id: 'madinah-2', name: 'Shaza Al Madinah', price: 12000, rating: 5, distance: '150m from Masjid Nabawi' }
                  ].map((hotel) => (
                    <Card key={hotel.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm mb-1">{hotel.name}</h5>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-600">★ {hotel.rating} • {hotel.distance}</p>
                              <p className="text-xs text-gray-600">Per night</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#023f3a] text-sm">₹{hotel.price.toLocaleString()}</p>
                            <Button 
                              size="sm" 
                              className="mt-2 bg-[#023f3a] hover:bg-[#023f3a]/90 text-xs px-3 py-1.5 h-auto"
                              onClick={() => addToCart({
                                id: hotel.id,
                                type: 'hotel',
                                name: `${hotel.name} - Madinah`,
                                price: hotel.price,
                                details: { rating: hotel.rating, distance: hotel.distance, city: 'Madinah' }
                              })}
                            >
                              <Plus className="w-3 h-3 mr-1" />
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

      case 3:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Transport</h3>
            <div className="space-y-3">
              {[
                { id: 'transport-1', name: 'Airport Transfer - Sedan', price: 3500, capacity: '4 passengers', route: 'Jeddah Airport to Hotel' },
                { id: 'transport-2', name: 'Airport Transfer - Van', price: 5000, capacity: '8 passengers', route: 'Jeddah Airport to Hotel' },
                { id: 'transport-3', name: 'Makkah-Madinah Transfer', price: 8000, capacity: '4-8 passengers', route: 'Hotel to Hotel' }
              ].map((transport) => (
                <Card key={transport.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{transport.name}</h4>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">{transport.capacity}</p>
                          <p className="text-xs text-gray-600">{transport.route}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#023f3a] text-sm">₹{transport.price.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-[#023f3a] hover:bg-[#023f3a]/90 text-xs px-3 py-1.5 h-auto"
                          onClick={() => addToCart({
                            id: transport.id,
                            type: 'transport',
                            name: transport.name,
                            price: transport.price,
                            details: { capacity: transport.capacity, route: transport.route }
                          })}
                        >
                          <Plus className="w-3 h-3 mr-1" />
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Guide Services</h3>
            <div className="space-y-3">
              {[
                { id: 'guide-1', name: 'Personal Umrah Guide', price: 15000, duration: 'Full journey', languages: 'English, Hindi, Urdu' },
                { id: 'guide-2', name: 'Group Guide Service', price: 8000, duration: 'Full journey', languages: 'English, Hindi' },
                { id: 'guide-3', name: 'Ziarath Guide', price: 5000, duration: 'Per day', languages: 'English, Arabic' }
              ].map((guide) => (
                <Card key={guide.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{guide.name}</h4>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">{guide.duration}</p>
                          <p className="text-xs text-gray-600">Languages: {guide.languages}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#023f3a] text-sm">₹{guide.price.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-[#023f3a] hover:bg-[#023f3a]/90 text-xs px-3 py-1.5 h-auto"
                          onClick={() => addToCart({
                            id: guide.id,
                            type: 'guide',
                            name: guide.name,
                            price: guide.price,
                            details: { duration: guide.duration, languages: guide.languages }
                          })}
                        >
                          <Plus className="w-3 h-3 mr-1" />
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Ziarath Tours</h3>
            <div className="space-y-3">
              {[
                { id: 'ziarath-1', name: 'Makkah Historical Sites', price: 4500, duration: '4 hours', sites: '8 locations' },
                { id: 'ziarath-2', name: 'Madinah Ziarath Tour', price: 5000, duration: '6 hours', sites: '12 locations' },
                { id: 'ziarath-3', name: 'Combined Ziarath Package', price: 8500, duration: '2 days', sites: '20+ locations' }
              ].map((ziarath) => (
                <Card key={ziarath.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{ziarath.name}</h4>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">{ziarath.duration} • {ziarath.sites}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#023f3a] text-sm">₹{ziarath.price.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-[#023f3a] hover:bg-[#023f3a]/90 text-xs px-3 py-1.5 h-auto"
                          onClick={() => addToCart({
                            id: ziarath.id,
                            type: 'ziarath',
                            name: ziarath.name,
                            price: ziarath.price,
                            details: { duration: ziarath.duration, sites: ziarath.sites }
                          })}
                        >
                          <Plus className="w-3 h-3 mr-1" />
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
      {/* Mobile-First Sticky Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Build Package</h1>
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

      {/* Mobile-Optimized Step Navigation */}
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
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 min-w-[70px] ${
                  isActive 
                    ? 'bg-[#023f3a] text-white shadow-md' 
                    : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-xs font-medium">{step.title}</span>
                {isCompleted && !isActive && (
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white px-4 py-2 border-b">
        <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
          <span>Step {activeStep + 1} of {steps.length}</span>
          <span>{Math.round(((activeStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-[#023f3a] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="px-4 py-4 pb-24">
        {renderStepContent()}
      </div>

      {/* Mobile Navigation & Cart Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
        <div className="px-4 py-3">
          {cart.length > 0 && (
            <div className="mb-3 p-3 bg-[#023f3a]/5 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{getTotalItems()} items selected</p>
                  <p className="text-lg font-bold text-[#023f3a]">₹{getTotalPrice().toLocaleString()}</p>
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
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={activeStep === 0}
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            >
              Previous
            </Button>
            <Button
              className="flex-1 bg-[#023f3a] hover:bg-[#023f3a]/90"
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            >
              {activeStep === steps.length - 1 ? 'Complete' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Modal - Mobile Optimized */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-xl overflow-hidden">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Package ({getTotalItems()} items)</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-[50vh] px-4 py-3">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No items in your package yet</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-600 capitalize">{item.type}</p>
                        <p className="font-semibold text-[#023f3a] text-sm">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="w-7 h-7 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="w-7 h-7 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 w-7 h-7 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t px-4 py-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-[#023f3a]">₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <Button className="w-full bg-[#023f3a] hover:bg-[#023f3a]/90">
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
