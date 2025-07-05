import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Users,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Briefcase,
  Clock,
  BadgeCheck,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LeadCapturePopup from "../components/LeadCapturePopup";
import { useTransportCart } from "../hooks/useTransportCart";
import { supabase } from "@/integrations/supabase/client";
import { TransportService, VehicleType } from "../types/transport";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";

const TransportBooking = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemCount,
    clearCart,
    getTotalAmount,
    getTotalItems,
  } = useTransportCart();
  const [transports, setTransports] = useState<TransportService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [capacityRange, setCapacityRange] = useState<[number, number]>([1, 50]);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>(
    [],
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filterBarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

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
    sessionStorage.setItem(popupShownKey, "true");
  };

  useEffect(() => {
    async function fetchTransports() {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("transport_services")
        .select("*")
        .eq("is_active", true);
      if (error) {
        setError("Failed to fetch transport services.");
        setTransports([]);
      } else {
        setTransports(data || []);
      }
      setLoading(false);
    }
    fetchTransports();
  }, []);

  // Restore filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("transportFilters");
    if (saved) {
      const { capacityRange, selectedVehicleTypes, selectedFeatures } =
        JSON.parse(saved);
      setCapacityRange(capacityRange);
      setSelectedVehicleTypes(selectedVehicleTypes);
      setSelectedFeatures(selectedFeatures);
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem(
      "transportFilters",
      JSON.stringify({ capacityRange, selectedVehicleTypes, selectedFeatures }),
    );
  }, [capacityRange, selectedVehicleTypes, selectedFeatures]);

  // Auto-scroll to filters on load
  useEffect(() => {
    if (filterBarRef.current) {
      filterBarRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Minimize hero section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        if (window.scrollY > 40) {
          heroRef.current.style.maxHeight = "60px";
          heroRef.current.style.overflow = "hidden";
        } else {
          heroRef.current.style.maxHeight = "";
          heroRef.current.style.overflow = "";
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        routes: [],
      };
    }
    vehicleTypeMap[t.vehicle_type].routes.push(t);
  }
  const vehicleTypes = Object.values(vehicleTypeMap);

  // Collect all vehicle types and features for filter options
  const allVehicleTypes = Array.from(
    new Set(vehicleTypes.map((v) => v.vehicle_type)),
  );
  const allFeatures = Array.from(
    new Set(vehicleTypes.flatMap((v) => v.features || [])),
  );
  const minCapacity = Math.min(...vehicleTypes.map((v) => v.capacity));
  const maxCapacity = Math.max(...vehicleTypes.map((v) => v.capacity));

  // Filter logic
  const filteredVehicleTypes = vehicleTypes.filter((v) => {
    const matchesCapacity =
      v.capacity >= capacityRange[0] && v.capacity <= capacityRange[1];
    const matchesType =
      selectedVehicleTypes.length === 0 ||
      selectedVehicleTypes.includes(v.vehicle_type);
    const matchesFeatures =
      selectedFeatures.length === 0 ||
      (v.features && selectedFeatures.every((f) => v.features.includes(f)));
    return matchesCapacity && matchesType && matchesFeatures;
  });

  const VehicleCard = ({ vehicle }: { vehicle: VehicleType }) => {
    const [selectedRouteId, setSelectedRouteId] = useState("");
    const [vehicleCount, setVehicleCount] = useState(1);

    // Parse vehicle details JSON if present - fix type inference
    let vehicleDetailsObj: Record<string, unknown> | null = null;
    if (vehicle.vehicle_details) {
      if (typeof vehicle.vehicle_details === "string") {
        try {
          vehicleDetailsObj = JSON.parse(vehicle.vehicle_details);
        } catch {
          // Silent catch for invalid JSON
        }
      } else if (typeof vehicle.vehicle_details === "object") {
        vehicleDetailsObj = vehicle.vehicle_details;
      }
    }

    const selectedRoute = vehicle.routes.find((r) => r.id === selectedRouteId);
    const pricePerUnit = selectedRoute ? selectedRoute.price : 0;

    const handleAddToCart = () => {
      if (!selectedRoute) return;
      addToCart({
        vehicleId: vehicle.vehicle_type,
        routeId: selectedRoute.id,
        vehicleName: vehicle.vehicle_name,
        routeName: selectedRoute.route,
        count: vehicleCount,
        pricePerUnit,
      });
      setSelectedRouteId("");
      setVehicleCount(1);
    };

    return (
      <Card className="h-full flex flex-col shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-amber-50 hover:shadow-2xl transition-shadow duration-200">
        {/* Vehicle Header */}
        <div className="relative">
          <img
            src={vehicle.vehicle_image || "/placeholder.svg"}
            alt={vehicle.vehicle_name || "Vehicle"}
            className="w-full h-48 object-cover rounded-t-xl shadow-md border-b-4 border-emerald-200"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
              {vehicle.vehicle_type}
            </Badge>
            <BadgeCheck className="text-emerald-400 w-5 h-5" />
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col p-5">
          {/* Vehicle Info */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-emerald-800">
                {vehicle.vehicle_name}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {vehicle.capacity} pax
              </span>
              {vehicle.luggage_capacity && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> {vehicle.luggage_capacity}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {vehicle.features &&
                Array.isArray(vehicle.features) &&
                vehicle.features.map((f) => (
                  <span
                    key={f}
                    className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs border border-emerald-200"
                  >
                    {f}
                  </span>
                ))}
            </div>
            {vehicleDetailsObj && (
              <div className="text-xs text-gray-500 mt-1">
                <b>Details:</b>{" "}
                {Object.entries(vehicleDetailsObj)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}
              </div>
            )}
          </div>
          <Separator className="my-2" />

          {/* Route Options */}
          <div className="mb-2">
            <div className="font-semibold text-gray-800 mb-2">
              Available Routes
            </div>
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
              <div className="font-semibold text-amber-800 mb-1">
                {selectedRoute.route}
              </div>
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
              <span className="text-lg font-bold text-emerald-700">
                ${selectedRoute.price}
              </span>
            </div>
          )}

          {/* Vehicle Count and Price Section */}
          {selectedRoute && (
            <div className="space-y-2 mt-2 border-t pt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Vehicles
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setVehicleCount(Math.max(1, vehicleCount - 1))
                    }
                    disabled={vehicleCount <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="font-bold text-lg w-8 text-center">
                    {vehicleCount}
                  </span>
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
                  ${pricePerUnit} × {vehicleCount} vehicle
                  {vehicleCount > 1 ? "s" : ""}
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
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Transport Cart</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                >
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
                              <h4 className="font-semibold text-sm">
                                {item.vehicleName}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">
                                {item.routeName}
                              </p>
                              <p className="text-sm font-bold text-emerald-600">
                                ${item.pricePerUnit} per vehicle
                              </p>
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
                                onClick={() =>
                                  updateCartItemCount(item.id, item.count - 1)
                                }
                                disabled={item.count <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="font-medium">{item.count}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateCartItemCount(item.id, item.count + 1)
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-600">
                                ${item.totalPrice.toLocaleString()}
                              </p>
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
                      <span className="text-lg font-semibold">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${getTotalAmount().toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Proceed to Booking
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearCart}
                      >
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

      {/* Hero Section - compact and auto-minimizing */}
      <div
        ref={heroRef}
        className="transition-all duration-300 ease-in-out max-h-[180px] overflow-hidden flex flex-col items-center justify-center py-4 mb-2"
      >
        <div className="flex items-center gap-2 text-3xl font-bold mb-1">
          <span role="img" aria-label="car">
            🚗
          </span>{" "}
          Book Your <span className="text-emerald-600">Transport</span>
        </div>
        <div className="text-base text-gray-600 text-center max-w-2xl mx-auto leading-tight">
          Safe, comfortable, and reliable transportation for your sacred
          journey. Select your vehicles, routes, and add to cart for easy
          booking.
        </div>
      </div>
      <div className="container mx-auto px-2 py-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            ref={filterBarRef}
            id="filter-bar"
            className={`w-72 shrink-0 ${isMobile ? "fixed z-40 top-0 left-0 h-full bg-white shadow-lg transition-transform" : "sticky top-8"} ${isMobile && !sidebarOpen ? "-translate-x-full" : ""}`}
          >
            <div className="p-6 border-r border-emerald-100 h-full flex flex-col gap-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-emerald-800">
                  Filters
                </h3>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
              {/* Capacity Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Capacity
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={minCapacity}
                    max={capacityRange[1]}
                    value={capacityRange[0]}
                    onChange={(e) =>
                      setCapacityRange([
                        Number(e.target.value),
                        capacityRange[1],
                      ])
                    }
                    className="w-16 border rounded px-2 py-1 text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min={capacityRange[0]}
                    max={maxCapacity}
                    value={capacityRange[1]}
                    onChange={(e) =>
                      setCapacityRange([
                        capacityRange[0],
                        Number(e.target.value),
                      ])
                    }
                    className="w-16 border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
              {/* Vehicle Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vehicle Type
                </label>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {allVehicleTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedVehicleTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          setSelectedVehicleTypes(
                            checked
                              ? [...selectedVehicleTypes, type]
                              : selectedVehicleTypes.filter((t) => t !== type),
                          );
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Features Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Features
                </label>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {allFeatures.map((feature) => (
                    <label key={feature} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => {
                          setSelectedFeatures(
                            checked
                              ? [...selectedFeatures, feature]
                              : selectedFeatures.filter((f) => f !== feature),
                          );
                        }}
                      />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
              {isMobile && (
                <Button
                  className="mt-4 w-full"
                  onClick={() => setSidebarOpen(false)}
                >
                  Apply Filters
                </Button>
              )}
            </div>
          </aside>
          {/* Mobile sidebar toggle button */}
          {isMobile && !sidebarOpen && (
            <button
              className="fixed top-4 left-4 z-50 bg-emerald-600 text-white rounded-full shadow-lg p-3 hover:bg-emerald-700 transition"
              onClick={() => setSidebarOpen(true)}
            >
              Filters
            </button>
          )}
          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-12">
              <h2 className="text-xl font-bold text-left mb-4">
                Available Transport Vehicles
              </h2>
              {/* Cart suggestion placeholder */}
              {/* TODO: Show add-on suggestions after add to cart */}
              {/* Backend automation: auto-assign vehicle and send notification after booking (see backend integration) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicleTypes.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-12">
                    No vehicles match your filters.
                  </div>
                ) : (
                  filteredVehicleTypes.map((vehicle) => (
                    <VehicleCard key={vehicle.vehicle_type} vehicle={vehicle} />
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TransportBooking;
