import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  MapPin,
  Clock,
  Users,
  Star,
  Bookmark,
  CheckCircle,
  Heart,
  X,
  ShoppingCart,
} from "lucide-react";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useZiarathCart } from "@/hooks/useZiarathCart";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertFromINR } from "@/lib/utils";

// Define types
interface Activity {
  id: string;
  name: string;
  featured_image?: string;
  is_featured: boolean;
  city: string;
  description: string;
  duration?: string;
  price?: number;
  created_at: string;
  updated_at: string;
  vehicle_prices?: Record<string, string>;
  slug?: string;
  inclusions?: string;
  exclusions?: string;
  features?: string;
  faqs?: { q: string; a: string }[];
  gallery?: string[];
  sites?: string;
  [key: string]: unknown;
}
interface Vehicle {
  id: string;
  vehicle_name: string;
  vehicle_type: string;
  vehicle_image?: string;
  capacity?: number;
}

// BookingModal component (top-level, not nested)
export function BookingModal({
  open,
  onOpenChange,
  activity,
  vehicles,
  selectedVehicleId,
  setSelectedVehicleId,
}) {
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfPeople: 1,
    bookingDate: "",
    specialRequests: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { currency } = useCurrency();

  // Update numberOfPeople when vehicle changes
  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (vehicle && vehicle.capacity) {
        setBookingForm((f) => ({ ...f, numberOfPeople: vehicle.capacity }));
      }
    }
  }, [selectedVehicleId, vehicles]);

  if (!activity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setBookingSuccess(true);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {activity.name}</DialogTitle>
        </DialogHeader>
        {!bookingSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {activity.vehicle_prices && (
              <div>
                <div className="font-semibold mb-2 text-[#023f3a] text-lg">
                  Choose Your Vehicle
                </div>
                <div className="space-y-3">
                  {Object.entries(activity.vehicle_prices).map(
                    ([vehicleId, price]) => {
                      const vehicle = vehicles.find((v) => v.id === vehicleId);
                      if (!vehicle) return null;
                      return (
                        <label
                          key={vehicleId}
                          className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition ${selectedVehicleId === vehicleId ? "border-[#023f3a] bg-[#e6f4f1]" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                        >
                          <input
                            type="radio"
                            name="vehicle"
                            value={vehicleId}
                            checked={selectedVehicleId === vehicleId}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setSelectedVehicleId(e.target.value)}
                            className="accent-[#023f3a] w-5 h-5"
                          />
                          {vehicle.vehicle_image && (
                            <img
                              src={vehicle.vehicle_image}
                              alt={vehicle.vehicle_name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-[#023f3a]">
                              {vehicle.vehicle_name}{" "}
                              <span className="text-xs text-gray-500">
                                ({vehicle.capacity} people)
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {vehicle.vehicle_type}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-[#fbbf24]">
                            {(() => {
                              const { value, symbol } = convertFromINR(
                                Number(price),
                                currency,
                              );
                              return `${symbol}${value.toLocaleString()}`;
                            })()}
                          </div>
                        </label>
                      );
                    },
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mb-2 mt-4">
              <span className="text-2xl font-extrabold text-[#fbbf24]">
                {(() => {
                  let price = activity.price;
                  if (activity.vehicle_prices && selectedVehicleId) {
                    price = Number(activity.vehicle_prices[selectedVehicleId]);
                  }
                  const { value, symbol } = convertFromINR(
                    Number(price),
                    currency,
                  );
                  return `${symbol}${value.toLocaleString()}`;
                })()}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="w-full border rounded p-2"
                  value={bookingForm.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBookingForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded p-2"
                  type="email"
                  value={bookingForm.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBookingForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="w-full border rounded p-2"
                  value={bookingForm.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBookingForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of People
                </label>
                <input
                  className="w-full border rounded p-2"
                  type="number"
                  min={1}
                  value={bookingForm.numberOfPeople}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBookingForm((f) => ({
                      ...f,
                      numberOfPeople: Number(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Preferred Date
              </label>
              <input
                className="w-full border rounded p-2"
                type="date"
                value={bookingForm.bookingDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookingForm((f) => ({ ...f, bookingDate: e.target.value }))
                }
                required
              />
              {bookingForm.bookingDate && (
                <div className="text-xs text-gray-500 mt-1">
                  Selected:{" "}
                  {formatDate(new Date(bookingForm.bookingDate), "dd-MMM-yyyy")}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Special Requests
              </label>
              <textarea
                className="w-full border rounded p-2"
                value={bookingForm.specialRequests}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setBookingForm((f) => ({
                    ...f,
                    specialRequests: e.target.value,
                  }))
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#023f3a] to-[#fbbf24] text-white text-lg py-3 rounded-full shadow-xl hover:scale-105 transition-transform"
              disabled={isLoading}
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-6">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-2" />
            <div className="text-2xl font-bold text-[#023f3a]">
              Booking Confirmed!
            </div>
            <div className="text-lg text-gray-600">
              Thank you for booking your Ziarath tour.
              <br />
              We will contact you soon with confirmation details.
            </div>
            <button
              className="mt-4 bg-gradient-to-r from-[#023f3a] to-[#fbbf24] text-white px-8 py-3 rounded-full shadow-lg"
              onClick={() => {
                setBookingSuccess(false);
                onOpenChange(false);
              }}
            >
              Back to Activities
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const ZiarathBooking = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [bookingDate, setBookingDate] = useState<Date>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfPeople: 1,
    specialRequests: "",
    preferredTime: "",
  });

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemCount,
    clearCart,
    getTotalAmount,
    getTotalItems,
  } = useZiarathCart();
  const [cartOpen, setCartOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerActivity, setDrawerActivity] = useState<Activity | null>(null);
  const [drawerStep, setDrawerStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [modalActivity, setModalActivity] = useState<Activity | null>(null);

  const { currency } = useCurrency();

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("price", { ascending: true });
      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, vehicle_name, vehicle_type, vehicle_image, capacity");
      if (!error && data) setVehicles(data);
    })();
  }, []);

  useEffect(() => {
    setSelectedVehicleId(null);
    setDrawerStep(1);
    setBookingSuccess(false);
  }, [drawerActivity]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !bookingDate) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        ...bookingForm,
        service_id: selectedActivity.id,
        service_date: bookingDate,
        total_amount: selectedActivity.price * bookingForm.numberOfPeople,
        status: "pending",
      };

      console.log("Ziarath booking data:", bookingData);

      toast({
        title: "Success",
        description:
          "Your ziarath booking has been submitted! We'll send you confirmation details within 24 hours.",
      });

      // Reset form
      setBookingForm({
        name: "",
        email: "",
        phone: "",
        numberOfPeople: 1,
        specialRequests: "",
        preferredTime: "",
      });
      setSelectedActivity(null);
      setBookingDate(undefined);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedActivity) {
      toast({
        title: "Selection Required",
        description: "Please select a ziarath tour to continue",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(Math.min(currentStep + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4f1] via-white to-[#f6f8f7]">
      <Header />
      {/* Luxurious Hero Section */}
      <div className="relative w-full h-[340px] md:h-[420px] flex items-center justify-center bg-gradient-to-br from-[#023f3a] to-[#059669] overflow-hidden shadow-lg">
        <img
          src="/public/umrah-package-banner.jpg"
          alt="Ziarath Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
            Discover Sacred Ziarath Tours
          </h1>
          <p className="text-lg md:text-xl font-medium mb-6 drop-shadow">
            Experience the journey of a lifetime with our exclusive, luxury
            Ziarath tours led by expert guides.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#fbbf24] to-[#023f3a] text-white text-lg px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            Book Your Journey
          </Button>
        </div>
      </div>
      {/* Trust/USP Bar */}
      <div className="flex flex-wrap justify-center gap-4 py-6 bg-white/80 shadow-sm border-b border-emerald-100">
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-[#059669] to-[#fbbf24] text-white px-4 py-2 text-base font-semibold shadow"
        >
          Licensed Guides
        </Badge>
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-[#fbbf24] to-[#059669] text-white px-4 py-2 text-base font-semibold shadow"
        >
          Instant Booking
        </Badge>
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-[#059669] to-[#fbbf24] text-white px-4 py-2 text-base font-semibold shadow"
        >
          Best Price Guarantee
        </Badge>
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-[#fbbf24] to-[#059669] text-white px-4 py-2 text-base font-semibold shadow"
        >
          5-Star Reviews
        </Badge>
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-[#059669] to-[#fbbf24] text-white px-4 py-2 text-base font-semibold shadow"
        >
          24/7 Support
        </Badge>
      </div>
      {/* Floating Cart Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#023f3a] to-[#fbbf24] text-white rounded-full shadow-2xl flex items-center px-6 py-4 hover:scale-105 transition-transform border-4 border-white/80"
        onClick={() => setCartOpen(true)}
        style={{ boxShadow: "0 8px 32px 0 rgba(2, 63, 58, 0.25)" }}
      >
        <ShoppingCart className="w-6 h-6 mr-3" />
        <span className="font-bold text-lg">Cart ({getTotalItems()})</span>
      </button>
      {/* Cart Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black bg-opacity-30">
          <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-md p-6 m-4 relative animate-slide-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setCartOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Your Ziarath Cart
            </h3>
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b pb-3"
                  >
                    <img
                      src={item.image || "/public/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">
                        ₹{item.price} x{" "}
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={item.count}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateCartItemCount(item.id, parseInt(e.target.value))
                        }
                        className="w-16 border rounded px-2 py-1 text-sm mt-1"
                      />
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-lg font-bold text-emerald-700">
                    ₹{getTotalAmount().toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  className="w-full bg-[#023f3a] text-white py-2 rounded-lg mt-4 hover:bg-emerald-700 transition"
                  onClick={() => {
                    setCartOpen(false);
                    setCurrentStep(2);
                  }}
                >
                  Proceed to Booking
                </button>
                <button
                  className="w-full text-gray-500 text-sm mt-2 underline"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#023f3a] mb-2 tracking-tight">
            Choose Your Ziarath Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked luxury tours, curated for spiritual fulfillment and
            comfort. Limited spots available—reserve yours now!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities
            .filter((a) => a.name !== "Umrah Tawaf and Sa'i")
            .map((activity) => {
              const inCart = cartItems.some((item) => item.id === activity.id);
              // Get vehicle options for this activity
              const vehicleOptions = activity.vehicle_prices
                ? Object.entries(activity.vehicle_prices)
                : [];
              return (
                <Card
                  key={activity.id}
                  className="relative group overflow-hidden border-0 shadow-xl rounded-3xl bg-white/90 hover:scale-[1.03] hover:shadow-2xl transition-transform"
                >
                  <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
                    <img
                      src={activity.featured_image || "/public/placeholder.svg"}
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {activity.is_featured && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-[#fbbf24] to-[#059669] text-white px-3 py-1 text-xs font-bold shadow-lg">
                        Featured
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-white/80 text-[#023f3a] px-3 py-1 text-xs font-bold shadow">
                      {activity.city}
                    </Badge>
                  </div>
                  <CardContent className="p-6 flex flex-col gap-3">
                    <h3 className="text-2xl font-bold text-[#023f3a] mb-1 group-hover:text-[#fbbf24] transition-colors">
                      {activity.name}
                    </h3>
                    <p
                      className="text-gray-700 text-base line-clamp-3 mb-2"
                      dangerouslySetInnerHTML={{ __html: activity.description }}
                    />
                    <div className="flex items-center gap-4 mb-2">
                      {activity.duration && (
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" /> {activity.duration}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-[#fbbf24]" /> Luxury
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-2xl font-extrabold text-[#fbbf24]">
                        {(() => {
                          const { value, symbol } = convertFromINR(
                            Number(activity.price),
                            currency,
                          );
                          return `${symbol}${value.toLocaleString()}`;
                        })()}
                      </span>
                      <Button
                        size="lg"
                        className="rounded-full px-6 py-2 text-lg font-bold shadow-lg bg-gradient-to-r from-[#023f3a] to-[#fbbf24] text-white hover:scale-105 transition-transform"
                        onClick={() => {
                          setModalActivity(activity);
                          setBookingModalOpen(true);
                          const vehicleOptions = activity.vehicle_prices
                            ? Object.entries(activity.vehicle_prices)
                            : [];
                          if (vehicleOptions.length === 1) {
                            setSelectedVehicleId(vehicleOptions[0][0]);
                          } else {
                            setSelectedVehicleId(null);
                          }
                        }}
                      >
                        Book Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2"
                        onClick={() => navigate(`/ziarath/${activity.slug}`)}
                        disabled={!activity.slug}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
      {/* Activity Detail Drawer with Stepper */}
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        shouldScaleBackground
      >
        <DrawerContent className="max-w-xl w-full ml-auto h-full overflow-y-auto bg-white rounded-l-3xl shadow-2xl border-0 animate-fade-in-scale">
          <DrawerHeader className="relative p-0">
            {drawerStep === 1 && drawerActivity && (
              <>
                <div className="relative w-full h-64 md:h-80 rounded-t-3xl overflow-hidden">
                  <img
                    src={
                      drawerActivity.featured_image || "/public/placeholder.svg"
                    }
                    alt={drawerActivity.name}
                    className="w-full h-full object-cover"
                  />
                  <DrawerClose className="absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow hover:bg-white">
                    <X className="w-6 h-6 text-[#023f3a]" />
                  </DrawerClose>
                  {drawerActivity.is_featured && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-[#fbbf24] to-[#059669] text-white px-3 py-1 text-xs font-bold shadow-lg">
                      Featured
                    </Badge>
                  )}
                  <Badge className="absolute top-4 right-16 bg-white/80 text-[#023f3a] px-3 py-1 text-xs font-bold shadow">
                    {drawerActivity.city}
                  </Badge>
                </div>
                <div
                  className="p-6 pb-2 flex flex-col gap-2 overflow-y-auto"
                  style={{ maxHeight: "calc(100vh - 18rem)" }}
                >
                  <DrawerTitle className="text-3xl font-extrabold text-[#023f3a] mb-1">
                    {drawerActivity.name}
                  </DrawerTitle>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    {drawerActivity.duration && (
                      <span className="inline-flex items-center gap-1 text-base text-gray-500">
                        <Clock className="w-5 h-5" /> {drawerActivity.duration}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-base text-gray-500">
                      <Star className="w-5 h-5 text-[#fbbf24]" /> Luxury
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <span className="text-base text-gray-400">
                      City:{" "}
                      <span className="text-[#023f3a] font-semibold">
                        {drawerActivity.city}
                      </span>
                    </span>
                    <span className="text-base text-gray-400">
                      ID:{" "}
                      <span className="text-gray-500">
                        {drawerActivity.id?.slice(0, 8)}...
                      </span>
                    </span>
                  </div>
                  <div
                    className="text-lg text-gray-700 mb-4 leading-relaxed"
                    style={{ wordBreak: "break-word" }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: drawerActivity.description || "",
                      }}
                    />
                  </div>
                  {/* Vehicle Selection */}
                  {drawerActivity.vehicle_prices && (
                    <div className="mt-6 mb-4">
                      <div className="font-semibold mb-2 text-[#023f3a] text-lg">
                        Choose Your Vehicle
                      </div>
                      <div className="space-y-3">
                        {Object.entries(drawerActivity.vehicle_prices).map(
                          ([vehicleId, price]) => {
                            const vehicle = vehicles.find(
                              (v) => v.id === vehicleId,
                            );
                            if (!vehicle) return null;
                            return (
                              <label
                                key={vehicleId}
                                className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition ${selectedVehicleId === vehicleId ? "border-[#023f3a] bg-[#e6f4f1]" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                              >
                                <input
                                  type="radio"
                                  name="vehicle"
                                  value={vehicleId}
                                  checked={selectedVehicleId === vehicleId}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                  ) => setSelectedVehicleId(e.target.value)}
                                  className="accent-[#023f3a] w-5 h-5"
                                />
                                {vehicle.vehicle_image && (
                                  <img
                                    src={vehicle.vehicle_image}
                                    alt={vehicle.vehicle_name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="font-semibold text-[#023f3a]">
                                    {vehicle.vehicle_name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {vehicle.vehicle_type}
                                  </div>
                                </div>
                                <div className="text-lg font-bold text-[#fbbf24]">
                                  {(() => {
                                    const { value, symbol } = convertFromINR(
                                      Number(price),
                                      currency,
                                    );
                                    return `${symbol}${value.toLocaleString()}`;
                                  })()}
                                </div>
                              </label>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl font-extrabold text-[#fbbf24]">
                      {(() => {
                        let price = drawerActivity.price;
                        if (
                          drawerActivity.vehicle_prices &&
                          selectedVehicleId
                        ) {
                          price = Number(
                            drawerActivity.vehicle_prices[selectedVehicleId],
                          );
                        }
                        const { value, symbol } = convertFromINR(
                          Number(price),
                          currency,
                        );
                        return `${symbol}${value.toLocaleString()}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row md:gap-4 gap-2 mt-2">
                    <Button
                      size="lg"
                      className="flex-1 rounded-full px-6 py-3 text-lg font-bold shadow-lg bg-gradient-to-r from-[#023f3a] to-[#fbbf24] text-white hover:scale-105 transition-transform"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        setDrawerStep(2);
                      }}
                      disabled={
                        drawerActivity.vehicle_prices && !selectedVehicleId
                      }
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 rounded-full px-6 py-3 text-lg font-bold border-[#023f3a] text-[#023f3a] hover:bg-[#fbbf24]/10"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        setDrawerOpen(false);
                      }}
                    >
                      Back to Activities
                    </Button>
                  </div>
                  <div className="mt-8 border-t pt-4 flex flex-wrap gap-6 text-xs text-gray-400">
                    <span>
                      Created:{" "}
                      {drawerActivity.created_at
                        ? new Date(drawerActivity.created_at).toLocaleString()
                        : "-"}
                    </span>
                    <span>
                      Last Updated:{" "}
                      {drawerActivity.updated_at
                        ? new Date(drawerActivity.updated_at).toLocaleString()
                        : "-"}
                    </span>
                  </div>
                </div>
              </>
            )}
            {drawerStep === 2 && drawerActivity && (
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      setDrawerStep(1);
                    }}
                  >
                    &larr; Back
                  </Button>
                  <span className="text-lg font-bold text-[#023f3a]">
                    Booking Details
                  </span>
                </div>
                <div className="bg-[#f8f6ff] rounded-lg p-4 mb-4">
                  <div className="font-semibold text-[#023f3a] mb-1">
                    {drawerActivity.name}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {
                      vehicles.find((v) => v.id === selectedVehicleId)
                        ?.vehicle_name
                    }
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Date:{" "}
                    <span className="font-medium">
                      {bookingDate
                        ? formatDate(bookingDate, "PPP")
                        : "Select date"}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-[#fbbf24]">
                    {(() => {
                      let price = drawerActivity.price;
                      if (drawerActivity.vehicle_prices && selectedVehicleId) {
                        price = Number(
                          drawerActivity.vehicle_prices[selectedVehicleId],
                        );
                      }
                      const { value, symbol } = convertFromINR(
                        Number(price),
                        currency,
                      );
                      return `${symbol}${value.toLocaleString()}`;
                    })()}
                  </div>
                </div>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input
                        value={bookingForm.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBookingForm((f) => ({
                            ...f,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={bookingForm.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBookingForm((f) => ({
                            ...f,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <Input
                        value={bookingForm.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBookingForm((f) => ({
                            ...f,
                            phone: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Number of People
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={bookingForm.numberOfPeople}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBookingForm((f) => ({
                            ...f,
                            numberOfPeople: Number(e.target.value),
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Preferred Date
                    </label>
                    <Input
                      type="date"
                      value={
                        bookingDate ? formatDate(bookingDate, "yyyy-MM-dd") : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBookingDate(new Date(e.target.value))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Special Requests
                    </label>
                    <Textarea
                      value={bookingForm.specialRequests}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setBookingForm((f) => ({
                          ...f,
                          specialRequests: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#023f3a] to-[#fbbf24] text-white text-lg py-3 rounded-full shadow-xl hover:scale-105 transition-transform"
                    disabled={isLoading}
                  >
                    {isLoading ? "Booking..." : "Confirm Booking"}
                  </Button>
                </form>
              </div>
            )}
            {drawerStep === 3 && bookingSuccess && (
              <div className="p-8 flex flex-col items-center justify-center text-center gap-6">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-2" />
                <div className="text-2xl font-bold text-[#023f3a]">
                  Booking Confirmed!
                </div>
                <div className="text-lg text-gray-600">
                  Thank you for booking your Ziarath tour.
                  <br />
                  We will contact you soon with confirmation details.
                </div>
                <Button
                  className="mt-4 bg-gradient-to-r from-[#023f3a] to-[#fbbf24] text-white px-8 py-3 rounded-full shadow-lg"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    setDrawerOpen(false);
                    setDrawerStep(1);
                  }}
                >
                  Back to Activities
                </Button>
              </div>
            )}
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        activity={modalActivity}
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        setSelectedVehicleId={setSelectedVehicleId}
      />
      <Footer />
    </div>
  );
};

export default ZiarathBooking;
