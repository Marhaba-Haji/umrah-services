
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MapPin, Users, ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadCapturePopup from '../components/LeadCapturePopup';
import { useTransportCart } from '../hooks/useTransportCart';

const TransportBooking = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, addToCart, removeFromCart, updateCartItemCount, clearCart, getTotalAmount, getTotalItems } = useTransportCart();

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

  const vehicles = [
    {
      id: 'sedan',
      name: 'Sedan',
      model: 'Toyota Camry or Similar',
      capacity: 3,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=250&fit=crop',
      description: 'Comfortable sedan for small groups'
    },
    {
      id: 'minivan',
      name: 'Mini Van',
      model: 'Hyundai H1 or Similar',
      capacity: 5,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop',
      description: 'Spacious van for families'
    },
    {
      id: 'gmc',
      name: 'GMC',
      model: 'Chevrolet GMC',
      capacity: 7,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=250&fit=crop',
      description: 'Premium SUV for comfortable travel'
    },
    {
      id: 'largevan',
      name: 'Large Van',
      model: 'Toyota Hiace',
      capacity: 10,
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop',
      description: 'Large van for bigger groups'
    },
    {
      id: 'minibus',
      name: 'Mini Bus',
      model: 'Coaster',
      capacity: 20,
      image: 'https://images.unsplash.com/photo-1544620282-0e1511a922e8?w=400&h=250&fit=crop',
      description: 'Mini bus for medium groups'
    },
    {
      id: 'bus',
      name: 'Bus',
      model: 'Volvo',
      capacity: 50,
      image: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=400&h=250&fit=crop',
      description: 'Full-size bus for large groups'
    }
  ];

  const routes = [
    { id: 'jed-makkah', name: 'Jeddah Airport to Makkah Hotel', distance: '80 km', duration: '1.5 hours', prices: { sedan: 120, minivan: 150, gmc: 180, largevan: 200, minibus: 280, bus: 450 } },
    { id: 'jed-madinah', name: 'Jeddah Airport to Madinah Hotel', distance: '420 km', duration: '4.5 hours', prices: { sedan: 350, minivan: 420, gmc: 480, largevan: 550, minibus: 750, bus: 1200 } },
    { id: 'makkah-madinah', name: 'Makkah to Madinah', distance: '450 km', duration: '5 hours', prices: { sedan: 380, minivan: 450, gmc: 520, largevan: 600, minibus: 800, bus: 1300 } },
    { id: 'madinah-makkah', name: 'Madinah to Makkah', distance: '450 km', duration: '5 hours', prices: { sedan: 380, minivan: 450, gmc: 520, largevan: 600, minibus: 800, bus: 1300 } },
    { id: 'makkah-jed', name: 'Makkah to Jeddah Airport', distance: '80 km', duration: '1.5 hours', prices: { sedan: 120, minivan: 150, gmc: 180, largevan: 200, minibus: 280, bus: 450 } },
    { id: 'madinah-med', name: 'Madinah Hotel to Madinah Airport', distance: '20 km', duration: '30 minutes', prices: { sedan: 50, minivan: 70, gmc: 90, largevan: 100, minibus: 150, bus: 250 } },
    { id: 'madinah-jed', name: 'Madinah Hotel to Jeddah Airport', distance: '420 km', duration: '4.5 hours', prices: { sedan: 350, minivan: 420, gmc: 480, largevan: 550, minibus: 750, bus: 1200 } },
    { id: 'makkah-tour', name: 'Makkah City Day Tour', distance: '50 km', duration: '8 hours', prices: { sedan: 200, minivan: 250, gmc: 300, largevan: 350, minibus: 500, bus: 800 } },
    { id: 'madinah-tour', name: 'Madinah City Day Tour', distance: '40 km', duration: '8 hours', prices: { sedan: 180, minivan: 220, gmc: 270, largevan: 320, minibus: 450, bus: 750 } },
    { id: 'jeddah-tour', name: 'Jeddah City Day Tour', distance: '60 km', duration: '8 hours', prices: { sedan: 220, minivan: 280, gmc: 330, largevan: 380, minibus: 550, bus: 900 } },
    { id: 'taif-tour', name: 'Taif City Day Tour', distance: '100 km', duration: '10 hours', prices: { sedan: 300, minivan: 380, gmc: 450, largevan: 520, minibus: 750, bus: 1200 } }
  ];

  const VehicleCard = ({ vehicle }: { vehicle: typeof vehicles[0] }) => {
    const [selectedRoute, setSelectedRoute] = useState('');
    const [vehicleCount, setVehicleCount] = useState(1);

    const handleAddToCart = () => {
      if (!selectedRoute) return;
      
      const route = routes.find(r => r.id === selectedRoute);
      if (!route) return;

      const pricePerUnit = route.prices[vehicle.id as keyof typeof route.prices];
      
      addToCart({
        vehicleId: vehicle.id,
        routeId: selectedRoute,
        vehicleName: vehicle.name,
        routeName: route.name,
        count: vehicleCount,
        pricePerUnit
      });

      // Reset form
      setSelectedRoute('');
      setVehicleCount(1);
    };

    const selectedRouteData = routes.find(r => r.id === selectedRoute);
    const pricePerUnit = selectedRouteData ? selectedRouteData.prices[vehicle.id as keyof typeof selectedRouteData.prices] : 0;

    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="p-0">
          <img 
            src={vehicle.image} 
            alt={vehicle.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg">{vehicle.name}</CardTitle>
            <Badge className="bg-emerald-100 text-emerald-800">
              <Users className="w-3 h-3 mr-1" />
              {vehicle.capacity}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">{vehicle.model}</p>
          <p className="text-xs text-gray-500 mb-4 flex-1">{vehicle.description}</p>
          
          <div className="space-y-4">
            {/* Route Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Route</label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your route" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{route.name}</p>
                          <p className="text-xs text-gray-500">{route.distance} • {route.duration}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-bold text-emerald-600">${route.prices[vehicle.id as keyof typeof route.prices]}</p>
                          <p className="text-xs text-gray-500">per vehicle</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Count */}
            {selectedRoute && (
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
            )}

            {/* Price Display */}
            {selectedRoute && (
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
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedRoute}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
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
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Vehicles & Routes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
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
