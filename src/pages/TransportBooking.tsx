import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MapPin, Users, ShoppingCart, Plus, Minus, Trash2, X, Briefcase, Clock, BadgeCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadCapturePopup from '../components/LeadCapturePopup';
import { useTransportCart } from '../hooks/useTransportCart';
import { supabase } from '../lib/supabaseClient';
import { TransportService, VehicleType } from '../types/transport';

const TransportBooking = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, addToCart, removeFromCart, updateCartItemCount, clearCart, getTotalAmount, getTotalItems } = useTransportCart();
  const [transports, setTransports] = useState<TransportService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if popup was already shown on this page
  React.useEffect(() => {
    const currentPage = window.location.pathname;
    const popupShownKey = `popup-shown-${currentPage}`;
    const wasShown = sessionStorage.getItem(popupShownKey);
    
    if (!wasShown) {
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    const currentPage = window.location.pathname;
    const popupShownKey = `popup-shown-${currentPage}`;
    sessionStorage.setItem(popupShownKey, 'true');
  };

  useEffect(() => {
    async function fetchTransports() {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('transport_services')
        .select('*')
        .eq('is_active', true);
      if (error) {
        setError('Failed to fetch transport services.');
        setTransports([]);
      } else {
        setTransports(data || []);
      }
      setLoading(false);
    }
    fetchTransports();
  }, []);

  if (loading) return <div>Loading transport options...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Group transports by vehicle_type
  const vehicleTypeMap: Record<string, VehicleType> = {};
  for (const t of transports) {
    if (!vehicleTypeMap[t.vehicle_type]) {
      vehicleTypeMap[t.vehicle_type] = {
        vehicle_type: t.vehicle_type,
        vehicle_name: t.vehicle_name,
        vehicle_image: t.vehicle_image,
        capacity: t.capacity,
        luggage_capacity: t.luggage_capacity,
        features: t.features,
        vehicle_details: t.vehicle_details,
        routes: []
      };
    }
    vehicleTypeMap[t.vehicle_type].routes.push(t);
  }
  const vehicleTypes = Object.values(vehicleTypeMap);

  const VehicleCard = ({ vehicle }: { vehicle: VehicleType }) => {
    const [selectedRouteId, setSelectedRouteId] = useState('');
    const [vehicleCount, setVehicleCount] = useState(1);

    // Parse vehicle details JSON if present - fix type inference
    let vehicleDetailsObj: Record<string, any> | null = null;
    if (vehicle.vehicle_details) {
      if (typeof vehicle.vehicle_details === 'string' && vehicle.vehicle_details.trim().startsWith('{')) {
        try { 
          vehicleDetailsObj = JSON.parse(vehicle.vehicle_details); 
        } catch {
          // Silent catch for invalid JSON
        }
      } else if (typeof vehicle.vehicle_details === 'object') {
        vehicleDetailsObj = vehicle.vehicle_details;
      }
    }

    const selectedRoute = vehicle.routes.find(r => r.id === selectedRouteId);
    const pricePerUnit = selectedRoute ? selectedRoute.price : 0;

    const handleAddToCart = () => {
      if (!selectedRoute) return;
      addToCart({
        vehicleId: vehicle.vehicle_type,
        routeId: selectedRoute.id,
        vehicleName: vehicle.vehicle_name,
        routeName: selectedRoute.route,
        count: vehicleCount,
        pricePerUnit
      });
      setSelectedRouteId('');
      setVehicleCount(1);
    };

    return (
      <Card className="h-full flex flex-col shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-amber-50 hover:shadow-2xl transition-shadow duration-200">
        {/* Vehicle Header */}
        <div className="relative">
          <img 
            src={vehicle.vehicle_image || '/placeholder.svg'} 
            alt={vehicle.vehicle_name || 'Vehicle'}
            className="w-full h-48 object-cover rounded-t-xl shadow-md border-b-4 border-emerald-200"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">{vehicle.vehicle_type}</Badge>
            <BadgeCheck className="text-emerald-400 w-5 h-5" />
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col p-5">
          {/* Vehicle Info */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-emerald-800">{vehicle.vehicle_name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-700 mb-2">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {vehicle.capacity} pax</span>
              {vehicle.luggage_capacity && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {vehicle.luggage_capacity}</span>}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {vehicle.features && Array.isArray(vehicle.features) && vehicle.features.map(f => (
                <span key={f} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs border border-emerald-200">{f}</span>
              ))}
            </div>
            {vehicleDetailsObj && (
              <div className="text-xs text-gray-500 mt-1">
                <b>Details:</b> {Object.entries(vehicleDetailsObj).map(([k, v]) => `${k}: ${v}`).join(', ')}
              </div>
            )}
          </div>
          <Separator className="my-2" />

          {/* Route Options */}
          <div className="mb-2">
            <div className="font-semibold text-gray-800 mb-2">Available Routes</div>
            <Select onValueChange={setSelectedRouteId} value={selectedRouteId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a route" />
              </SelectTrigger>
              <SelectContent>
                {vehicle.routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    <span className="font-medium">{route.route}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Route Info Section */}
          {selectedRoute && (
            <div className="flex flex-col items-start mt-2 bg-amber-50 rounded-lg p-3 border border-amber-100">
              <div className="font-semibold text-amber-800 mb-1">{selectedRoute.route}</div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-700 mb-1">
                {selectedRoute.trip_duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedRoute.trip_duration}
                  </span>
                )}
                {selectedRoute.trip_distance && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedRoute.trip_distance}
                  </span>
                )}
              </div>
              <span className="text-lg font-bold text-emerald-700">${selectedRoute.price}</span>
            </div>
          )}

          {/* Vehicle Count and Price Section */}
          {selectedRoute && (
            <div className="space-y-2 mt-2 border-t pt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Vehicles</label>
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setVehicleCount(Math.max(1, vehicleCount - 1))}
                    disabled={vehicleCount <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="font-bold text-lg w-8 text-center">{vehicleCount}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setVehicleCount(vehicleCount + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Total Price:</span>
                  <span className="text-xl font-bold text-emerald-600">
                    ${(pricePerUnit * vehicleCount).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${pricePerUnit} × {vehicleCount} vehicle{vehicleCount > 1 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!selectedRoute}
                className="w-full bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90 text-white shadow-lg text-lg mt-2"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Header />
      
      <LeadCapturePopup isOpen={isPopupOpen} onClose={handlePopupClose} />
      
      {/* Fixed Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-3 shadow-lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart ({getTotalItems()})
          {getTotalAmount() > 0 && (
            <span className="ml-2 bg-white text-emerald-600 px-2 py-1 rounded-full text-sm font-bold">
              ${getTotalAmount().toLocaleString()}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Transport Cart</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.vehicleName}</h4>
                              <p className="text-xs text-gray-600 mb-2">{item.routeName}</p>
                              <p className="text-sm font-bold text-emerald-600">${item.pricePerUnit} per vehicle</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartItemCount(item.id, item.count - 1)}
                                disabled={item.count <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="font-medium">{item.count}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartItemCount(item.id, item.count + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-600">${item.totalPrice.toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className="border-t p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${getTotalAmount().toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Proceed to Booking
                      </Button>
                      <Button variant="outline" className="w-full" onClick={clearCart}>
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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
              Safe, comfortable, and reliable transportation for your sacred journey. Select your vehicles, routes, and add to cart for easy booking.
            </p>
          </div>

          {/* Vehicle Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Available Transport Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicleTypes.map((vehicle) => (
                <VehicleCard key={vehicle.vehicle_type} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TransportBooking;
