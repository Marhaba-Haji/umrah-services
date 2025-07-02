import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Users,
  Calendar,
  MapPin,
  Car,
  UserCheck,
  Map,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import FlightStep from "@/components/FlightStep";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface CartItem {
  id: string;
  type: "hotel" | "flight" | "transport" | "visa" | "guide" | "ziarath";
  name: string;
  price: number;
  quantity?: number;
  details?: Record<string, unknown>;
}

const BuildYourOwnUmrah = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [visaOptions, setVisaOptions] = useState<
    Database["public"]["Tables"]["saudi_visas"]["Row"][]
  >([]);
  const [visaLoading, setVisaLoading] = useState(false);
  const [visaError, setVisaError] = useState<string | null>(null);
  const [transportOptions, setTransportOptions] = useState<
    Database["public"]["Tables"]["transport_services"]["Row"][]
  >([]);
  const [transportLoading, setTransportLoading] = useState(false);
  const [transportError, setTransportError] = useState<string | null>(null);
  const [tripDuration, setTripDuration] = useState<number | null>(null);
  const [manualDuration, setManualDuration] = useState<string>("");
  const [adultCount, setAdultCount] = useState(1);
  const [childWithBedCount, setChildWithBedCount] = useState(0);
  const [childWithoutBedCount, setChildWithoutBedCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [ziarathOptions, setZiarathOptions] = useState<
    Database["public"]["Tables"]["activities"]["Row"][]
  >([]);
  const [ziarathLoading, setZiarathLoading] = useState(false);
  const [ziarathError, setZiarathError] = useState<string | null>(null);

  const totalGroupSize =
    adultCount + childWithBedCount + childWithoutBedCount + infantCount;

  const steps = [
    { id: 0, title: "Trip Duration", icon: Calendar, color: "bg-primary" },
    { id: 1, title: "Group Size", icon: Users, color: "bg-primary" },
    { id: 2, title: "Visa", icon: Package, color: "bg-primary" },
    { id: 3, title: "Flights", icon: Calendar, color: "bg-primary" },
    { id: 4, title: "Makkah Hotel", icon: MapPin, color: "bg-primary" },
    { id: 5, title: "Madinah Hotel", icon: MapPin, color: "bg-primary" },
    { id: 6, title: "Transport", icon: Car, color: "bg-primary" },
    { id: 7, title: "Guide", icon: UserCheck, color: "bg-primary" },
    { id: 8, title: "Ziarath", icon: Map, color: "bg-primary" },
  ];

  useEffect(() => {
    const fetchVisas = async () => {
      setVisaLoading(true);
      setVisaError(null);
      const { data, error } = await supabase
        .from("saudi_visas")
        .select("*")
        .eq("visa_type", "Umrah Visa");
      if (error) {
        setVisaError("Failed to load visa options.");
        setVisaOptions([]);
      } else {
        setVisaOptions(data || []);
      }
      setVisaLoading(false);
    };
    fetchVisas();

    const fetchTransport = async () => {
      setTransportLoading(true);
      setTransportError(null);
      const { data, error } = await supabase
        .from("transport_services")
        .select("*");
      if (error) {
        setTransportError("Failed to load transport options.");
        setTransportOptions([]);
      } else {
        setTransportOptions(data || []);
      }
      setTransportLoading(false);
    };
    fetchTransport();

    const fetchZiarath = async () => {
      setZiarathLoading(true);
      setZiarathError(null);
      const { data, error } = await supabase.from("activities").select("*");
      if (error) {
        setZiarathError("Failed to load Ziarath options.");
        setZiarathOptions([]);
      } else {
        setZiarathOptions(data || []);
      }
      setZiarathLoading(false);
    };
    fetchZiarath();
  }, []);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0,
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const renderTripDurationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Select Trip Duration
        </h2>
        <p className="text-gray-600">
          How many days do you want your Umrah trip to be?
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {[3, 5, 7, 10, 15].map((days) => (
          <Button
            key={days}
            className={`px-6 py-3 text-lg ${tripDuration === days ? "bg-primary text-white" : "bg-accent text-primary"}`}
            onClick={() => {
              setTripDuration(days);
              setManualDuration("");
            }}
          >
            {days} days
          </Button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="manual-duration" className="text-gray-700">
          Or enter number of days:
        </label>
        <input
          id="manual-duration"
          type="number"
          min={1}
          className="border rounded px-3 py-2 w-32 text-center"
          placeholder="Custom days"
          value={manualDuration}
          onChange={(e) => {
            setManualDuration(e.target.value);
            setTripDuration(Number(e.target.value) || null);
          }}
        />
      </div>
      <div className="flex justify-center mt-6">
        <Button
          className="bg-primary text-white px-8 py-3 text-lg"
          disabled={!tripDuration || tripDuration < 1}
          onClick={() => setActiveStep(1)}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderGroupSizeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Enter Group Size
        </h2>
        <p className="text-gray-600">
          Specify the number of travelers in each category
        </p>
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">Adults</label>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
            >
              -
            </Button>
            <span className="w-8 text-center">{adultCount}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAdultCount(adultCount + 1)}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="font-medium">Children (with bed)</label>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setChildWithBedCount(Math.max(0, childWithBedCount - 1))
              }
            >
              -
            </Button>
            <span className="w-8 text-center">{childWithBedCount}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setChildWithBedCount(childWithBedCount + 1)}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="font-medium">Children (without bed)</label>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setChildWithoutBedCount(Math.max(0, childWithoutBedCount - 1))
              }
            >
              -
            </Button>
            <span className="w-8 text-center">{childWithoutBedCount}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setChildWithoutBedCount(childWithoutBedCount + 1)}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="font-medium">Infants</label>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setInfantCount(Math.max(0, infantCount - 1))}
            >
              -
            </Button>
            <span className="w-8 text-center">{infantCount}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setInfantCount(infantCount + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <span className="text-lg font-semibold">Total Group Size: </span>
        <span className="text-2xl font-bold text-primary">
          {totalGroupSize}
        </span>
      </div>
      <div className="flex justify-center mt-6">
        <Button
          className="bg-primary text-white px-8 py-3 text-lg"
          onClick={() => setActiveStep(2)}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderVisaStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Select Umrah Visa
        </h2>
        <p className="text-gray-600">
          Choose the perfect visa option for your Umrah
        </p>
      </div>
      <div className="grid gap-4">
        {visaLoading && (
          <div className="text-center text-gray-500">
            Loading visa options...
          </div>
        )}
        {visaError && (
          <div className="text-center text-red-500">{visaError}</div>
        )}
        {!visaLoading && !visaError && visaOptions.length === 0 && (
          <div className="text-center text-gray-500">
            No Umrah visa options available.
          </div>
        )}
        {!visaLoading &&
          !visaError &&
          visaOptions.map((visa) => (
            <Card
              key={visa.id}
              className={`relative border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                visa.popular
                  ? "border-primary shadow-md"
                  : "border-gray-200 hover:border-primary/30"
              }`}
              onClick={() =>
                addToCart({
                  id: visa.id,
                  type: "visa",
                  name: visa.visa_type,
                  price: visa.price,
                  details: {
                    processing: visa.processing_time,
                    validity: visa.visa_validity,
                  },
                })
              }
            >
              {visa.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-secondary text-primary px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {visa.visa_type}
                      </h3>
                    </div>
                    <p className="text-sm text-primary font-medium mb-3">
                      {visa.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Processing: {visa.processing_time}
                      </p>
                      <p className="text-sm text-gray-600">
                        Validity: {visa.visa_validity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ₹{visa.price?.toLocaleString()}
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 bg-primary hover:bg-primary/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: visa.id,
                          type: "visa",
                          name: visa.visa_type,
                          price: visa.price,
                          details: {
                            processing: visa.processing_time,
                            validity: visa.visa_validity,
                          },
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
      <div className="bg-accent rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h4 className="font-semibold text-primary mb-1">Recommended Visa</h4>
          <p className="text-sm text-gray-700">
            Express visa allows comfortable processing time with reliable
            approval rates.
          </p>
        </div>
      </div>
    </div>
  );

  // Makkah Hotel Step
  const renderMakkahHotelStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Select Makkah Hotel
        </h2>
        <p className="text-gray-600">Choose your accommodation in Makkah</p>
      </div>
      <div className="grid gap-4">
        {[
          {
            id: "makkah-1",
            name: "Dar Al Eiman Royal",
            price: 8500,
            rating: 4.5,
            distance: "200m from Haram",
            description: "Comfort",
          },
          {
            id: "makkah-2",
            name: "Pullman ZamZam Makkah",
            price: 15000,
            rating: 5,
            distance: "100m from Haram",
            description: "Premium",
            popular: true,
          },
        ].map((hotel) => (
          <Card
            key={hotel.id}
            className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
              hotel.popular
                ? "border-primary shadow-md"
                : "border-gray-200 hover:border-primary/30"
            }`}
          >
            {hotel.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-secondary text-primary px-4 py-1">
                  Recommended
                </Badge>
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {hotel.name}
                  </h4>
                  <p className="text-sm text-primary font-medium mb-2">
                    {hotel.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {hotel.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{hotel.distance}</p>
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    ₹{hotel.price.toLocaleString()}
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-primary hover:bg-primary/90"
                    onClick={() =>
                      addToCart({
                        id: hotel.id,
                        type: "hotel",
                        name: `${hotel.name} - Makkah`,
                        price: hotel.price,
                        details: {
                          rating: hotel.rating,
                          distance: hotel.distance,
                          city: "Makkah",
                        },
                      })
                    }
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

  // Madinah Hotel Step
  const renderMadinahHotelStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Select Madinah Hotel
        </h2>
        <p className="text-gray-600">Choose your accommodation in Madinah</p>
      </div>
      <div className="grid gap-4">
        {[
          {
            id: "madinah-1",
            name: "Anwar Al Madinah Movenpick",
            price: 7500,
            rating: 4.5,
            distance: "300m from Masjid Nabawi",
            description: "Comfort",
          },
          {
            id: "madinah-2",
            name: "Shaza Al Madinah",
            price: 12000,
            rating: 5,
            distance: "150m from Masjid Nabawi",
            description: "Premium",
            popular: true,
          },
        ].map((hotel) => (
          <Card
            key={hotel.id}
            className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
              hotel.popular
                ? "border-primary shadow-md"
                : "border-gray-200 hover:border-primary/30"
            }`}
          >
            {hotel.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-secondary text-primary px-4 py-1">
                  Recommended
                </Badge>
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {hotel.name}
                  </h4>
                  <p className="text-sm text-primary font-medium mb-2">
                    {hotel.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {hotel.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{hotel.distance}</p>
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    ₹{hotel.price.toLocaleString()}
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-primary hover:bg-primary/90"
                    onClick={() =>
                      addToCart({
                        id: hotel.id,
                        type: "hotel",
                        name: `${hotel.name} - Madinah`,
                        price: hotel.price,
                        details: {
                          rating: hotel.rating,
                          distance: hotel.distance,
                          city: "Madinah",
                        },
                      })
                    }
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderTripDurationStep();
      case 1:
        return renderGroupSizeStep();
      case 2:
        return renderVisaStep();
      case 3:
        return <FlightStep onFlightSelect={addToCart} />;
      case 4:
        return renderMakkahHotelStep();
      case 5:
        return renderMadinahHotelStep();
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Select Transport
              </h2>
              <p className="text-gray-600">Choose your travel comfort</p>
            </div>
            <div className="grid gap-4">
              {transportLoading && (
                <div className="text-center text-gray-500">
                  Loading transport options...
                </div>
              )}
              {transportError && (
                <div className="text-center text-red-500">{transportError}</div>
              )}
              {!transportLoading &&
                !transportError &&
                transportOptions.length === 0 && (
                  <div className="text-center text-gray-500">
                    No transport options available.
                  </div>
                )}
              {!transportLoading &&
                !transportError &&
                transportOptions.map((transport) => (
                  <Card
                    key={transport.id}
                    className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                      transport.popular
                        ? "border-primary shadow-md"
                        : "border-gray-200 hover:border-primary/30"
                    }`}
                  >
                    {transport.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-secondary text-primary px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {transport.vehicle_name}
                          </h4>
                          <p className="text-sm text-primary font-medium mb-2">
                            {transport.description}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              Capacity: {transport.capacity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Route: {transport.route}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            ₹{transport.price?.toLocaleString()}
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-primary hover:bg-primary/90"
                            onClick={() =>
                              addToCart({
                                id: transport.id,
                                type: "transport",
                                name: transport.vehicle_name,
                                price: transport.price,
                                details: {
                                  capacity: transport.capacity,
                                  route: transport.route,
                                },
                              })
                            }
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
      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Select Guide Services
              </h2>
              <p className="text-gray-600">
                Get expert guidance for your journey
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  id: "guide-1",
                  name: "Personal Umrah Guide",
                  price: 15000,
                  duration: "Full journey",
                  languages: "English, Hindi, Urdu",
                  description: "Premium",
                },
                {
                  id: "guide-2",
                  name: "Group Guide Service",
                  price: 8000,
                  duration: "Full journey",
                  languages: "English, Hindi",
                  description: "Popular",
                  popular: true,
                },
                {
                  id: "guide-3",
                  name: "Ziarath Guide",
                  price: 5000,
                  duration: "Per day",
                  languages: "English, Arabic",
                  description: "Essential",
                },
              ].map((guide) => (
                <Card
                  key={guide.id}
                  className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                    guide.popular
                      ? "border-primary shadow-md"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  {guide.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-secondary text-primary px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {guide.name}
                        </h4>
                        <p className="text-sm text-primary font-medium mb-2">
                          {guide.description}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            {guide.duration}
                          </p>
                          <p className="text-sm text-gray-600">
                            Languages: {guide.languages}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          ₹{guide.price.toLocaleString()}
                        </p>
                        <Button
                          size="sm"
                          className="mt-3 bg-primary hover:bg-primary/90"
                          onClick={() =>
                            addToCart({
                              id: guide.id,
                              type: "guide",
                              name: guide.name,
                              price: guide.price,
                              details: {
                                duration: guide.duration,
                                languages: guide.languages,
                              },
                            })
                          }
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
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Select Ziarath Tours
              </h2>
              <p className="text-gray-600">Explore historical Islamic sites</p>
            </div>
            <div className="grid gap-4">
              {ziarathLoading && (
                <div className="text-center text-gray-500">
                  Loading Ziarath options...
                </div>
              )}
              {ziarathError && (
                <div className="text-center text-red-500">{ziarathError}</div>
              )}
              {!ziarathLoading &&
                !ziarathError &&
                ziarathOptions.length === 0 && (
                  <div className="text-center text-gray-500">
                    No Ziarath options available.
                  </div>
                )}
              {!ziarathLoading &&
                !ziarathError &&
                ziarathOptions.map((ziarath) => (
                  <Card
                    key={ziarath.id}
                    className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                      ziarath.popular
                        ? "border-primary shadow-md"
                        : "border-gray-200 hover:border-primary/30"
                    }`}
                  >
                    {ziarath.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-secondary text-primary px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {ziarath.name}
                          </h4>
                          <p className="text-sm text-primary font-medium mb-2">
                            {ziarath.description}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              Duration: {ziarath.duration}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            ₹{ziarath.price?.toLocaleString()}
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-primary hover:bg-primary/90"
                            onClick={() =>
                              addToCart({
                                id: ziarath.id,
                                type: "ziarath",
                                name: ziarath.name,
                                price: ziarath.price,
                                details: { duration: ziarath.duration },
                              })
                            }
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
              <h1 className="text-lg font-bold text-gray-900">
                Build Your Umrah
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs text-primary border-primary"
                >
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
        <div className="w-full bg-accent rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
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
            const isCompleted = cart.some((item) => {
              switch (step.id) {
                case 0:
                  return item.type === "visa";
                case 1:
                  return item.type === "flight";
                case 2:
                  return item.type === "hotel";
                case 3:
                  return item.type === "hotel";
                case 4:
                  return item.type === "transport";
                case 5:
                  return item.type === "guide";
                case 6:
                  return item.type === "ziarath";
                default:
                  return false;
              }
            });

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-200 min-w-[80px] ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : isCompleted
                      ? "bg-accent text-primary border border-accent"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
      <div className="px-4 py-6 pb-32">{renderStepContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
        <div className="px-4 py-4">
          {cart.length > 0 && (
            <div className="mb-4 p-4 bg-accent rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getTotalItems()} items selected
                  </p>
                  <p className="text-xl font-bold text-primary">
                    ₹{getTotalPrice().toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCart(true)}
                  className="text-primary border-primary"
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
              className="flex-1 bg-primary hover:bg-primary/90 py-6"
              disabled={activeStep === steps.length - 1}
              onClick={() =>
                setActiveStep(Math.min(steps.length - 1, activeStep + 1))
              }
            >
              {activeStep === steps.length - 1 ? "Complete" : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[85vh] rounded-t-2xl overflow-hidden">
            <div className="sticky top-0 bg-white border-b px-4 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-primary">
                Your Package ({getTotalItems()} items)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCart(false)}
              >
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
                    <div
                      key={item.id}
                      className="flex justify-between items-start p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize mb-2">
                          {item.type}
                        </p>
                        <p className="font-bold text-primary text-lg">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, (item.quantity || 1) - 1)
                          }
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity || 1}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, (item.quantity || 1) + 1)
                          }
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
                  <span className="text-2xl font-bold text-primary">
                    ₹{getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-lg">
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
