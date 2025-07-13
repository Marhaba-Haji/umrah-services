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
  Plane,
  IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import FlightStep from "@/components/FlightStep";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { FlightCartDetails } from "../components/FlightStep";
import Header from "@/components/Header";
import HotelSearch from "@/components/HotelSearch";
import Footer from "../components/Footer";
import { KaabaIcon } from "@/components/ui/kaaba-icon";
import { MasjidNabawiIcon } from "@/components/ui/masjid-nabawi-icon";

interface CartItem {
  id: string;
  type: "hotel" | "flight" | "transport" | "visa" | "guide" | "ziarath";
  name: string;
  price: number;
  quantity?: number;
  details?: Record<string, unknown>;
}

interface VehicleOption {
  id: string;
  price: number;
  vehicle_name: string;
  capacity: string | number;
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
  const [makkahCheckin, setMakkahCheckin] = useState("");
  const [makkahCheckout, setMakkahCheckout] = useState("");
  const [makkahRooms, setMakkahRooms] = useState([{ guests: 1 }]);
  const madinahTodayStr = new Date().toISOString().split("T")[0];
  const madinahMinCheckout = makkahCheckin
    ? new Date(new Date(makkahCheckin).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : madinahTodayStr;
  const [madinahDateError, setMadinahDateError] = useState<string | null>(null);
  const [guideOptions, setGuideOptions] = useState<
    Database["public"]["Tables"]["guide_services"]["Row"][]
  >([]);
  const [guideLoading, setGuideLoading] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  const [visaQuantities, setVisaQuantities] = useState({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [transportCapacity, setTransportCapacity] = useState<number | null>(
    null,
  );
  const [ziarathVehicleSelections, setZiarathVehicleSelections] = useState<
    Record<string, string>
  >({});
  const [vehicles, setVehicles] = useState<
    Database["public"]["Tables"]["vehicles"]["Row"][]
  >([]);
  // Track vehicle counts for each activity and vehicle type
  const [vehicleCounts, setVehicleCounts] = useState<
    Record<string, Record<string, number>>
  >({});
  // Madinah hotel state
  const [madinahCheckin, setMadinahCheckin] = useState("");
  const [madinahCheckout, setMadinahCheckout] = useState("");
  const [madinahRooms, setMadinahRooms] = useState([{ guests: 1 }]);
  // Persisted search results for hotels and flights
  const [makkahHotelResults, setMakkahHotelResults] = useState([]);
  const [madinahHotelResults, setMadinahHotelResults] = useState([]);
  const [flightResults, setFlightResults] = useState([]);
  // Persisted search state for hotels
  const [makkahHasSearched, setMakkahHasSearched] = useState(false);
  const [madinahHasSearched, setMadinahHasSearched] = useState(false);
  const [isFlightDrawerOpen, setIsFlightDrawerOpen] = useState(false);

  const totalGroupSize =
    adultCount + childWithBedCount + childWithoutBedCount + infantCount;

  const steps = [
    { id: 0, title: "Trip Duration", icon: Calendar, color: "bg-primary" },
    { id: 1, title: "Group Size", icon: Users, color: "bg-primary" },
    { id: 2, title: "Visa", icon: IdCard, color: "bg-primary" },
    { id: 3, title: "Flights", icon: Plane, color: "bg-primary" },
    { id: 4, title: "Makkah Hotel", icon: KaabaIcon, color: "bg-primary" },
    {
      id: 5,
      title: "Madinah Hotel",
      icon: MasjidNabawiIcon,
      color: "bg-primary",
    },
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

    const fetchGuides = async () => {
      setGuideLoading(true);
      setGuideError(null);
      const { data, error } = await supabase.from("guide_services").select("*");
      if (error) {
        setGuideError("Failed to load guide services.");
        setGuideOptions([]);
      } else {
        setGuideOptions(data || []);
      }
      setGuideLoading(false);
    };
    fetchGuides();

    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicles").select("*");
      if (!error && data) setVehicles(data);
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (!visaOptions || visaOptions.length === 0) return;
    setVisaQuantities((prev) => {
      const initial = { ...prev };
      visaOptions.forEach((visa) => {
        const cartVisa = cart.find(
          (item) => item.id === visa.id && item.type === "visa",
        );
        initial[visa.id] = cartVisa ? cartVisa.quantity || 1 : totalGroupSize;
      });
      return initial;
    });
  }, [visaOptions, cart, totalGroupSize]);

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
    return cart.reduce((total, item) => {
      if (item.type === "flight" && item.details) {
        const d = item.details as FlightCartDetails;
        const adults = d.adults || 0;
        const children = d.children || 0;
        const infants = d.infants || 0;
        const adultPrice = d.adultPrice || 0;
        const childPrice = d.childPrice || 0;
        const infantPrice = d.infantPrice || 0;
        const flightTotal =
          adults * adultPrice + children * childPrice + infants * infantPrice;
        return total + flightTotal;
      }
      return total + item.price * (item.quantity || 1);
    }, 0);
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
          visaOptions.map((visa) => {
            const cartVisa = cart.find(
              (item) => item.id === visa.id && item.type === "visa",
            );
            const localQty = visaQuantities[visa.id] || 1;
            const totalVisaPrice = (visa.price || 0) * (localQty || 1);
            return (
              <Card
                key={visa.id}
                className={`relative border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  visa.popular
                    ? "border-primary shadow-md"
                    : "border-gray-200 hover:border-primary/30"
                }`}
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
                          {visa.visa_type}{" "}
                          {visa.visa_category ? `(${visa.visa_category})` : ""}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Processing: {visa.processing_time}
                        </p>
                        <p className="text-sm text-gray-600">
                          Validity: {visa.visa_validity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right min-w-[120px] flex flex-col items-end gap-2">
                      <p className="text-lg font-bold text-primary">
                        ₹{visa.price?.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          / visa
                        </span>
                      </p>
                      {/* Editable Counter */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisaQuantities((q) => ({
                              ...q,
                              [visa.id]: Math.max(1, (q[visa.id] || 1) - 1),
                            }));
                          }}
                          disabled={localQty <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <input
                          type="number"
                          min={1}
                          className="w-12 text-center border rounded"
                          value={localQty}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const val = Math.max(1, Number(e.target.value));
                            setVisaQuantities((q) => ({
                              ...q,
                              [visa.id]: val,
                            }));
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisaQuantities((q) => ({
                              ...q,
                              [visa.id]: (q[visa.id] || 1) + 1,
                            }));
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total:{" "}
                        <span className="font-semibold text-primary">
                          ₹{totalVisaPrice.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        className="mt-2 w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => {
                          if (cartVisa) {
                            updateQuantity(visa.id, localQty);
                          } else {
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
                            updateQuantity(visa.id, localQty);
                          }
                        }}
                      >
                        Add to Package
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col flex-1">
            <label className="font-medium mb-1 flex items-center gap-1">
              Check-in Date
              <span
                className="align-super text-xs cursor-pointer"
                title="Check-in time: 4pm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#059669"
                    strokeWidth="2"
                    fill="#fff"
                  />
                  <text
                    x="12"
                    y="17"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#059669"
                    fontFamily="Arial"
                    fontWeight="bold"
                  >
                    i
                  </text>
                </svg>
              </span>
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={makkahCheckin}
              min={madinahTodayStr}
              onChange={(e) => {
                setMakkahCheckin(e.target.value);
                if (
                  makkahCheckout &&
                  e.target.value &&
                  makkahCheckout <= e.target.value
                ) {
                  setMakkahCheckout("");
                }
              }}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-medium mb-1 flex items-center gap-1">
              Check-out Date
              <span
                className="align-super text-xs cursor-pointer"
                title="Check-out time: 12pm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#059669"
                    strokeWidth="2"
                    fill="#fff"
                  />
                  <text
                    x="12"
                    y="17"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#059669"
                    fontFamily="Arial"
                    fontWeight="bold"
                  >
                    i
                  </text>
                </svg>
              </span>
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={makkahCheckout}
              min={madinahMinCheckout}
              disabled={!makkahCheckin}
              onChange={(e) => {
                if (e.target.value <= makkahCheckin) {
                  setMadinahDateError(
                    "Checkout must be at least 1 day after check-in",
                  );
                } else {
                  setMadinahDateError(null);
                }
                setMakkahCheckout(e.target.value);
              }}
            />
            {madinahDateError && (
              <span className="text-xs text-red-600 mt-1">
                {madinahDateError}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <label className="font-medium mb-1 flex items-center gap-2">
            Rooms & Guests
            <span className="text-xs text-gray-500">
              ({makkahRooms.length} room{makkahRooms.length > 1 ? "s" : ""},{" "}
              {makkahRooms.reduce((sum, r) => sum + r.guests, 0)} guest
              {makkahRooms.reduce((sum, r) => sum + r.guests, 0) > 1 ? "s" : ""}
              )
            </span>
          </label>
          {makkahRooms.map((room, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Room {idx + 1}:</span>
              <span>Guests:</span>
              <select
                className="border rounded px-2 py-1"
                value={room.guests}
                onChange={(e) => {
                  const newRooms = [...makkahRooms];
                  newRooms[idx].guests = Number(e.target.value);
                  setMakkahRooms(newRooms);
                }}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {makkahRooms.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setMakkahRooms(makkahRooms.filter((_, i) => i !== idx))
                  }
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {makkahRooms.length < 5 && (
            <Button
              size="sm"
              className="w-full mb-2"
              onClick={() => setMakkahRooms([...makkahRooms, { guests: 1 }])}
            >
              Add Room
            </Button>
          )}
        </div>
      </div>

      <HotelSearch
        city="makkah"
        checkInDate={makkahCheckin}
        checkOutDate={makkahCheckout}
        rooms={makkahRooms}
        onHotelSelect={addToCart}
        results={makkahHotelResults}
        setResults={setMakkahHotelResults}
        hasSearched={makkahHasSearched}
        setHasSearched={setMakkahHasSearched}
      />
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
      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col flex-1">
            <label className="font-medium mb-1 flex items-center gap-1">
              Check-in Date
              <span
                className="align-super text-xs cursor-pointer"
                title="Check-in time: 4pm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#059669"
                    strokeWidth="2"
                    fill="#fff"
                  />
                  <text
                    x="12"
                    y="17"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#059669"
                    fontFamily="Arial"
                    fontWeight="bold"
                  >
                    i
                  </text>
                </svg>
              </span>
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={madinahCheckin}
              min={madinahTodayStr}
              onChange={(e) => {
                setMadinahCheckin(e.target.value);
                if (
                  madinahCheckout &&
                  e.target.value &&
                  madinahCheckout <= e.target.value
                ) {
                  setMadinahCheckout("");
                }
              }}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-medium mb-1 flex items-center gap-1">
              Check-out Date
              <span
                className="align-super text-xs cursor-pointer"
                title="Check-out time: 12pm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#059669"
                    strokeWidth="2"
                    fill="#fff"
                  />
                  <text
                    x="12"
                    y="17"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#059669"
                    fontFamily="Arial"
                    fontWeight="bold"
                  >
                    i
                  </text>
                </svg>
              </span>
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={madinahCheckout}
              min={madinahCheckin || madinahTodayStr}
              disabled={!madinahCheckin}
              onChange={(e) => {
                if (e.target.value <= madinahCheckin) {
                  setMadinahDateError(
                    "Checkout must be at least 1 day after check-in",
                  );
                } else {
                  setMadinahDateError(null);
                }
                setMadinahCheckout(e.target.value);
              }}
            />
            {madinahDateError && (
              <span className="text-xs text-red-600 mt-1">
                {madinahDateError}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <label className="font-medium mb-1 flex items-center gap-2">
            Rooms & Guests
            <span className="text-xs text-gray-500">
              ({madinahRooms.length} room{madinahRooms.length > 1 ? "s" : ""},{" "}
              {madinahRooms.reduce((sum, r) => sum + r.guests, 0)} guest
              {madinahRooms.reduce((sum, r) => sum + r.guests, 0) > 1
                ? "s"
                : ""}
              )
            </span>
          </label>
          {madinahRooms.map((room, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Room {idx + 1}:</span>
              <span>Guests:</span>
              <select
                className="border rounded px-2 py-1"
                value={room.guests}
                onChange={(e) => {
                  const newRooms = [...madinahRooms];
                  newRooms[idx].guests = Number(e.target.value);
                  setMadinahRooms(newRooms);
                }}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {madinahRooms.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setMadinahRooms(madinahRooms.filter((_, i) => i !== idx))
                  }
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {madinahRooms.length < 5 && (
            <Button
              size="sm"
              className="w-full mb-2"
              onClick={() => setMadinahRooms([...madinahRooms, { guests: 1 }])}
            >
              Add Room
            </Button>
          )}
        </div>
      </div>

      <HotelSearch
        city="madinah"
        checkInDate={madinahCheckin}
        checkOutDate={madinahCheckout}
        rooms={madinahRooms}
        onHotelSelect={addToCart}
        results={madinahHotelResults}
        setResults={setMadinahHotelResults}
        hasSearched={madinahHasSearched}
        setHasSearched={setMadinahHasSearched}
      />
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
        return (
          <FlightStep
            onFlightSelect={addToCart}
            results={flightResults}
            setResults={setFlightResults}
            onDrawerOpenChange={setIsFlightDrawerOpen}
          />
        );
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
            {/* Vehicle Capacity Filter */}
            <div className="flex justify-center mb-4">
              <label
                className="mr-2 font-medium text-gray-700"
                htmlFor="capacity-filter"
              >
                Vehicle Capacity:
              </label>
              <select
                id="capacity-filter"
                className="border rounded px-3 py-2"
                value={transportCapacity ?? ""}
                onChange={(e) =>
                  setTransportCapacity(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">All</option>
                {[
                  ...new Set(
                    transportOptions.map((t) => t.capacity).filter(Boolean),
                  ),
                ]
                  .sort((a, b) => a - b)
                  .map((cap) => (
                    <option key={cap} value={cap}>
                      {cap} seats
                    </option>
                  ))}
              </select>
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
                transportOptions.filter((t) =>
                  transportCapacity ? t.capacity === transportCapacity : true,
                ).length === 0 && (
                  <div className="text-center text-gray-500">
                    No transport options available.
                  </div>
                )}
              {!transportLoading &&
                !transportError &&
                transportOptions
                  .filter((t) =>
                    transportCapacity ? t.capacity === transportCapacity : true,
                  )
                  .map((transport) => (
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
                        <div className="flex justify-between items-start gap-4">
                          {transport.vehicle_image && (
                            <img
                              src={transport.vehicle_image}
                              alt={transport.vehicle_name}
                              className="w-24 h-16 object-cover rounded-xl border mb-2"
                              style={{ flexShrink: 0 }}
                            />
                          )}
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
              {guideLoading && (
                <div className="text-center text-gray-500">
                  Loading guide services...
                </div>
              )}
              {guideError && (
                <div className="text-center text-red-500">{guideError}</div>
              )}
              {!guideLoading && !guideError && guideOptions.length === 0 && (
                <div className="text-center text-gray-500">
                  No guide services available.
                </div>
              )}
              {!guideLoading &&
                !guideError &&
                guideOptions.map((guide) => {
                  // Get price: use min value from service_prices if available, else 0
                  let price = 0;
                  if (
                    guide.service_prices &&
                    typeof guide.service_prices === "object"
                  ) {
                    const prices = Object.values(
                      guide.service_prices as Record<string, number>,
                    );
                    price = prices.length > 0 ? Math.min(...prices) : 0;
                  }
                  return (
                    <Card
                      key={guide.id}
                      className="border-2 transition-all duration-200 hover:shadow-lg cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          {guide.guide_photo && (
                            <img
                              src={guide.guide_photo}
                              alt={guide.guide_name}
                              className="w-20 h-20 object-cover rounded-xl border mb-2"
                              style={{ flexShrink: 0 }}
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {guide.guide_name}
                            </h4>
                            <p className="text-sm text-primary font-medium mb-2">
                              {guide.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              ₹{price.toLocaleString()}
                            </p>
                            <Button
                              size="sm"
                              className="mt-3 bg-primary hover:bg-primary/90"
                              onClick={() =>
                                addToCart({
                                  id: guide.id,
                                  type: "guide",
                                  name: guide.guide_name,
                                  price,
                                  details: {},
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
                  );
                })}
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
                ziarathOptions
                  .filter((z) => {
                    const name = (z.name || "").toLowerCase().trim();
                    return (
                      name !== "umrah tawaf" &&
                      name !== ".sa'i" &&
                      name !== "umrah tawaf & sa'i" &&
                      name !== "umrah tawaf & sa’i" &&
                      name !== "umrah tawaf and sa'i" &&
                      name !== "umrah tawaf and sa’i"
                    );
                  })
                  .map((ziarath) => {
                    let vehicleOptions: VehicleOption[] = [];
                    if (
                      ziarath.vehicle_prices &&
                      typeof ziarath.vehicle_prices === "object"
                    ) {
                      vehicleOptions = Object.entries(
                        ziarath.vehicle_prices,
                      ).map(([vehicleId, price]) => {
                        const vehicle = vehicles.find(
                          (v) => v.id === vehicleId,
                        );
                        return {
                          id: vehicleId,
                          price,
                          vehicle_name:
                            vehicle?.vehicle_name || `Vehicle ${vehicleId}`,
                          capacity: vehicle?.capacity || "-",
                        };
                      });
                    }
                    return (
                      <Card
                        key={ziarath.id}
                        className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer w-full max-w-full overflow-x-hidden ${
                          ziarath.popular
                            ? "border-primary shadow-md"
                            : "border-gray-200 hover:border-primary/30"
                        }`}
                      >
                        <CardContent className="p-4 w-full max-w-full overflow-x-hidden">
                          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch w-full max-w-full">
                            {/* Activity info: stacked on mobile, left column on desktop */}
                            <div className="flex flex-col items-start w-full md:min-w-[200px] md:max-w-[260px] md:w-auto">
                              {ziarath.featured_image && (
                                <img
                                  src={ziarath.featured_image}
                                  alt={ziarath.name}
                                  className="w-full max-w-[220px] h-28 object-cover rounded-xl border mb-2 md:w-32 md:h-24"
                                  style={{ flexShrink: 0 }}
                                />
                              )}
                              <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-1 mt-1 w-full truncate">
                                {ziarath.name}
                              </h4>
                              <p className="text-xs md:text-sm text-gray-600 mb-0.5">
                                City: {ziarath.city}
                              </p>
                              <p className="text-xs md:text-sm text-gray-600">
                                Duration: {ziarath.duration}
                              </p>
                            </div>
                            {/* Vehicle options: horizontal scroll on mobile, row on desktop */}
                            <div className="w-full md:flex-1">
                              <div
                                className="flex flex-row flex-nowrap items-stretch w-full max-w-full max-w-[100vw] overflow-x-auto pb-2 pr-6 touch-pan-x space-x-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                                style={{ WebkitOverflowScrolling: "touch" }}
                              >
                                {vehicleOptions.map((vehicle) => {
                                  const count =
                                    vehicleCounts[ziarath.id]?.[vehicle.id] ||
                                    0;
                                  return (
                                    <div
                                      key={vehicle.id}
                                      className={`relative border rounded-lg p-2 md:p-3 flex flex-col justify-between w-[160px] md:w-[220px] flex-shrink-0 transition-colors duration-200 ${
                                        isVehicleSelected(
                                          ziarath.id,
                                          vehicle.id,
                                        )
                                          ? "bg-green-50 border-green-400"
                                          : "bg-gray-50"
                                      }`}
                                    >
                                      {isVehicleSelected(
                                        ziarath.id,
                                        vehicle.id,
                                      ) && (
                                        <span className="absolute top-2 right-2 text-green-600 text-lg font-bold">
                                          ✔
                                        </span>
                                      )}
                                      <div className="flex flex-col gap-1">
                                        <span className="font-medium text-xs md:text-base">
                                          {vehicle.vehicle_name}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-gray-600">
                                          ({vehicle.capacity} seats)
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <button
                                          className="px-2 py-1 border rounded text-base md:text-lg min-w-[32px] min-h-[32px]"
                                          onClick={() =>
                                            handleDecrement(
                                              ziarath.id,
                                              vehicle.id,
                                            )
                                          }
                                          disabled={count <= 0}
                                          aria-label="Decrease vehicle count"
                                        >
                                          -
                                        </button>
                                        <span className="w-6 text-center text-base md:text-lg">
                                          {count}
                                        </span>
                                        <button
                                          className="px-2 py-1 border rounded text-base md:text-lg min-w-[32px] min-h-[32px]"
                                          onClick={() =>
                                            handleIncrement(
                                              ziarath.id,
                                              vehicle.id,
                                            )
                                          }
                                          aria-label="Increase vehicle count"
                                        >
                                          +
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <span className="text-primary font-bold text-sm md:text-lg">
                                          ₹{vehicle.price?.toLocaleString()}
                                        </span>
                                        <Button
                                          className="bg-primary hover:bg-primary/90 text-white px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm"
                                          onClick={() => {
                                            if (count > 0) {
                                              // Check if item already exists in cart
                                              const itemId = `${ziarath.id}_${vehicle.id}`;
                                              const existing = cart.find(
                                                (item) =>
                                                  item.id === itemId &&
                                                  item.type === "ziarath",
                                              );
                                              if (existing) {
                                                // Update quantity
                                                updateQuantity(
                                                  itemId,
                                                  (existing.quantity || 0) +
                                                    count,
                                                );
                                              } else {
                                                addToCart({
                                                  id: itemId,
                                                  type: "ziarath",
                                                  name: `${ziarath.name} (${vehicle.vehicle_name})`,
                                                  price: vehicle.price,
                                                  quantity: count,
                                                  details: {
                                                    duration: ziarath.duration,
                                                    city: ziarath.city,
                                                    vehicle:
                                                      vehicle.vehicle_name,
                                                    vehicle_id: vehicle.id,
                                                  },
                                                });
                                              }
                                              // Do NOT reset count to zero
                                            }
                                          }}
                                          disabled={!count}
                                        >
                                          Add{count > 1 ? ` ${count}` : ""}
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              {/* Mobile scroll indicator */}
                              <div className="block md:hidden text-xs text-gray-400 mt-1 pl-1">
                                ⇠ scroll for more vehicles ⇢
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
            </div>
            {console.log("Ziarath options:", ziarathOptions)}
            {console.log("Transport options:", transportOptions)}
          </div>
        );
      default:
        return null;
    }
  };

  // Handlers for incrementing/decrementing vehicle counts
  const handleIncrement = (activityId: string, vehicleId: string) => {
    setVehicleCounts((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        [vehicleId]: (prev[activityId]?.[vehicleId] || 0) + 1,
      },
    }));
  };
  const handleDecrement = (activityId: string, vehicleId: string) => {
    setVehicleCounts((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        [vehicleId]: Math.max((prev[activityId]?.[vehicleId] || 0) - 1, 0),
      },
    }));
  };

  // Utility to check if a vehicle for an activity is in the cart
  const isVehicleSelected = (activityId: string, vehicleId: string) => {
    return cart.some(
      (item) =>
        item.type === "ziarath" && item.id === `${activityId}_${vehicleId}`,
    );
  };

  return (
    <>
      {!isFlightDrawerOpen && <Header />}
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-b-3xl shadow mb-4">
          <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">
            Build Your Umrah
          </h1>
          <p className="text-lg text-gray-600 italic">
            “Begin your spiritual journey with ease and confidence.”
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white px-4 py-3 border-b">
          <div className="w-full bg-[#e6f4ea] rounded-full h-2 relative">
            <div
              className="bg-gradient-to-r from-[#eab308] to-[#023f3a] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Navigation */}
        <div
          className="bg-white border-b px-3 py-2 flex justify-center shadow-md rounded-b-2xl border-[#eab308]/20"
          style={{ height: "100px", minHeight: "100px" }}
        >
          <div className="flex space-x-4 overflow-x-auto overflow-y-hidden scrollbar-hide justify-center items-center w-full max-w-5xl h-full">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              const isCompleted = completedSteps.includes(index);

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[90px] h-[80px] shadow-sm
                    ${
                      isActive
                        ? "bg-[#023f3a] text-white scale-105 shadow-lg ring-2 ring-[#eab308]/40 border border-[#eab308]"
                        : isCompleted
                          ? "bg-[#e6f4ea] text-[#023f3a] border border-[#eab308]/30"
                          : "bg-[#f9fafb] text-[#023f3a] hover:bg-[#eab308]/10"
                    }
                  `}
                  style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                >
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full mb-1 ${isActive ? "bg-[#eab308] shadow-lg" : "bg-[#e6f4ea]"}`}
                  >
                    <Icon className="w-6 h-6" />
                    {isCompleted && !isActive && (
                      <Check className="w-3 h-3 absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5" />
                    )}
                  </div>
                  <span className="text-xs font-semibold leading-tight truncate">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content with Decorative Background */}
        <div className="relative px-4 py-6 pb-32 min-h-[60vh] flex items-center justify-center bg-[#f9fafb] overflow-hidden">
          {/* Decorative SVG geometric background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none select-none"
            aria-hidden="true"
          >
            <pattern
              id="geo"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#eab308"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#geo)" />
          </svg>
          {/* Main Card with glassy effect and improved contrast */}
          <div className="relative z-10 max-w-3xl w-full mx-auto rounded-2xl shadow-2xl bg-white border border-[#eab308]/30 p-8">
            <div className="flex items-center justify-center mb-6">
              <span className="inline-block w-12 h-1 rounded-full bg-gradient-to-r from-[#eab308] to-[#023f3a]"></span>
            </div>
            <Card className="shadow-none border-none bg-transparent p-0">
              <CardContent className="p-0 text-[#222]">
                {renderStepContent()}
              </CardContent>
            </Card>
            {/* Callout */}
            <div className="mt-8 p-4 rounded-lg bg-[#fffbe6] border-l-4 border-[#eab308] text-[#b58900] text-sm italic">
              “Did you know? Your Umrah journey can be fully customized for your
              family's needs.”
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        {!isFlightDrawerOpen && (
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
                  onClick={() => {
                    // Check if current step is valid and mark as completed
                    let valid = false;
                    switch (activeStep) {
                      case 0: // Visa
                        valid = cart.some((item) => item.type === "visa");
                        break;
                      case 1: // Flight
                        valid = cart.some((item) => item.type === "flight");
                        break;
                      case 2: // Hotel (Makkah)
                        valid = cart.some((item) => item.type === "hotel");
                        break;
                      case 3: // Hotel (Madinah)
                        valid = cart.some((item) => item.type === "hotel");
                        break;
                      case 4: // Transport
                        valid = cart.some((item) => item.type === "transport");
                        break;
                      case 5: // Guide
                        valid = cart.some((item) => item.type === "guide");
                        break;
                      case 6: // Ziarath
                        valid = cart.some((item) => item.type === "ziarath");
                        break;
                      default:
                        valid = false;
                    }
                    if (valid && !completedSteps.includes(activeStep)) {
                      setCompletedSteps((prev) => [...prev, activeStep]);
                    }
                    setActiveStep(Math.min(steps.length - 1, activeStep + 1));
                  }}
                >
                  {activeStep === steps.length - 1 ? "Complete" : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Footer />

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
                    <p className="text-gray-500">
                      No items in your package yet
                    </p>
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
                          {item.type === "flight" && item.details ? (
                            <div className="mb-2 text-sm text-gray-700 space-y-1">
                              <div>
                                <span className="font-medium">Travelers:</span>{" "}
                                <span>Adults: {item.details.adults || 0}</span>
                                {item.details.children ? (
                                  <span>
                                    , Children: {item.details.children}
                                  </span>
                                ) : null}
                                {item.details.infants ? (
                                  <span>, Infants: {item.details.infants}</span>
                                ) : null}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Travel Dates:
                                </span>{" "}
                                <span>
                                  {item.details.departure?.at
                                    ? new Date(
                                        item.details.departure.at,
                                      ).toLocaleDateString()
                                    : "-"}
                                  {item.details.arrival?.at &&
                                  item.details.departure?.at &&
                                  item.details.arrival.at !==
                                    item.details.departure.at
                                    ? ` - ${new Date(item.details.arrival.at).toLocaleDateString()}`
                                    : ""}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">
                                  Fare Breakdown:
                                </span>{" "}
                                <span>
                                  {item.details.adults
                                    ? `₹${(item.details.adultPrice || 0).toLocaleString()} x ${item.details.adults} adult(s)`
                                    : null}
                                  {item.details.children
                                    ? `, ₹${(item.details.childPrice || 0).toLocaleString()} x ${item.details.children} child(ren)`
                                    : null}
                                  {item.details.infants
                                    ? `, ₹${(item.details.infantPrice || 0).toLocaleString()} x ${item.details.infants} infant(s)`
                                    : null}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          <p className="font-bold text-primary text-lg">
                            {item.type === "flight" && item.details
                              ? `₹${(
                                  (item.details.adults || 0) *
                                    (item.details.adultPrice || 0) +
                                  (item.details.children || 0) *
                                    (item.details.childPrice || 0) +
                                  (item.details.infants || 0) *
                                    (item.details.infantPrice || 0)
                                ).toLocaleString()}`
                              : `₹${(item.price * (item.quantity || 1)).toLocaleString()}`}
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
    </>
  );
};

export default BuildYourOwnUmrah;
