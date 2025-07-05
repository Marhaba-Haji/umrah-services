import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plane,
  Calendar,
  Star,
  CheckCircle,
  CreditCard,
  Info,
  MapPin,
  Utensils,
  X,
  Bed,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Briefcase,
} from "lucide-react";
import ResponsiveBanner from "../components/ResponsiveBanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchFlights } from "@/services/flightService";
import airportsData from "../../public/airports.json";

type AirportSuggestion = {
  code: string;
  city: string;
  country: string;
  name: string;
};
type AirportType = {
  code: string;
  city: string;
  country: string;
  name: string;
};

const PackageDetailDynamic = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [guestCount, setGuestCount] = useState({
    adults: 2,
    childWithBed: 0,
    childWithoutBed: 0,
    infants: 0,
  });
  const [totalCost, setTotalCost] = useState(0);
  const [activityDetails, setActivityDetails] = useState<
    Array<{
      id: string;
      name: string;
      description?: string;
      featured_image?: string;
      city?: string;
      duration?: string;
    }>
  >([]);
  const [hotelDetails, setHotelDetails] = useState<{
    makkah?: Record<string, unknown>;
    madinah?: Record<string, unknown>;
  }>({});
  const [flightModalOpen, setFlightModalOpen] = useState(false);
  const [flightForm, setFlightForm] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    tripType: "oneway",
    directFlights: false,
    classType: "economy",
  });
  const [flightSearchLoading, setFlightSearchLoading] = useState(false);
  const [flightSearchResults, setFlightSearchResults] = useState<unknown>(null);
  const [flightSearchError, setFlightSearchError] = useState<string | null>(
    null,
  );
  const [originSuggestions, setOriginSuggestions] = useState<
    Array<{ code: string; city: string; country: string; name: string }>
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Array<{ code: string; city: string; country: string; name: string }>
  >([]);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  // Add state for sorting
  const [sortBy, setSortBy] = useState("best");
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("umrah_packages")
        .select("*")
        .eq("seo->>slug", slug)
        .single();
      if (error || !data) {
        // Fallback: try fetching by 'slug' field
        const { data: data2, error: error2 } = await supabase
          .from("umrah_packages")
          .select("*")
          .eq("slug", slug)
          .single();
        if (error2 || !data2) {
          setError("Package not found.");
          setPkg(null);
        } else {
          setPkg(data2);
          setError(null);
        }
      } else {
        setPkg(data);
        setError(null);
      }
      setLoading(false);
    };
    if (slug) fetchPackage();
  }, [slug]);

  useEffect(() => {
    if (!pkg) return;
    // Calculate total cost based on selected room type and guest count
    const pricing =
      pkg.pricing?.[pkg.package_type || "group"]?.[selectedRoomType] || {};
    const cost =
      guestCount.adults * (pricing.adult || 0) +
      guestCount.childWithBed * (pricing.childWithBed || 0) +
      guestCount.childWithoutBed * (pricing.childWithoutBed || 0) +
      guestCount.infants * (pricing.infant || 0);
    setTotalCost(cost);
  }, [pkg, selectedRoomType, guestCount]);

  useEffect(() => {
    if (!pkg) return;
    const fetchHotels = async () => {
      const newHotelDetails: Record<string, unknown> = {};
      // Fetch Makkah hotel if needed
      if (
        pkg.makkah_hotel &&
        (typeof pkg.makkah_hotel === "string" ||
          !pkg.makkah_hotel.featured_image)
      ) {
        const makkahId =
          typeof pkg.makkah_hotel === "string"
            ? pkg.makkah_hotel
            : pkg.makkah_hotel.id;
        if (makkahId) {
          const { data } = await supabase
            .from("hotels")
            .select("*")
            .eq("id", makkahId)
            .single();
          if (data) newHotelDetails.makkah = data;
        }
      } else if (pkg.makkah_hotel) {
        newHotelDetails.makkah = pkg.makkah_hotel;
      }
      // Fetch Madinah hotel if needed
      if (
        pkg.madinah_hotel &&
        (typeof pkg.madinah_hotel === "string" ||
          !pkg.madinah_hotel.featured_image)
      ) {
        const madinahId =
          typeof pkg.madinah_hotel === "string"
            ? pkg.madinah_hotel
            : pkg.madinah_hotel.id;
        if (madinahId) {
          const { data } = await supabase
            .from("hotels")
            .select("*")
            .eq("id", madinahId)
            .single();
          if (data) newHotelDetails.madinah = data;
        }
      } else if (pkg.madinah_hotel) {
        newHotelDetails.madinah = pkg.madinah_hotel;
      }
      setHotelDetails(newHotelDetails);
    };
    fetchHotels();
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    // If activities are already objects with name, skip fetch
    if (typeof pkg.activities[0] === "object" && pkg.activities[0].name) {
      setActivityDetails(
        pkg.activities as Array<{
          id: string;
          name: string;
          description?: string;
          featured_image?: string;
          city?: string;
          duration?: string;
        }>,
      );
      return;
    }
    // Otherwise, fetch activity details by IDs
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("id, name, description, featured_image")
        .in("id", pkg.activities);
      if (!error && data)
        setActivityDetails(
          data as Array<{
            id: string;
            name: string;
            description?: string;
            featured_image?: string;
            city?: string;
            duration?: string;
          }>,
        );
    };
    fetchActivities();
  }, [pkg]);

  useEffect(() => {
    if (selectedRoomType === "sharing") {
      setGuestCount({ sharing: 1, childWithoutBed: 0, infants: 0 });
    }
  }, [selectedRoomType]);

  // Helper to fetch airport suggestions
  const fetchAirportSuggestions = async (
    input: string,
    setSuggestions: (s: AirportSuggestion[]) => void,
    setLoading: (l: boolean) => void,
  ) => {
    setLoading(true);
    const local = airportsData.filter(
      (a: AirportType) =>
        a.code.toLowerCase().includes(input.toLowerCase()) ||
        a.city.toLowerCase().includes(input.toLowerCase()) ||
        a.name.toLowerCase().includes(input.toLowerCase()),
    );
    if (local.length > 0) {
      setSuggestions(local.slice(0, 6));
      setLoading(false);
      return;
    }
    // If not found locally, call Amadeus API
    try {
      const { AmadeusAPI } = await import("@/utils/amadeusApi");
      const amadeus = new AmadeusAPI(
        import.meta.env.VITE_AMADEUS_API_KEY,
        import.meta.env.VITE_AMADEUS_API_SECRET,
      );
      const res = await amadeus.getAirportInfo(input);
      setSuggestions(
        (res.data || []).map((item: Record<string, unknown>) => ({
          code: item.iataCode as string,
          city: item.address?.cityName as string,
          country: item.address?.countryName as string,
          name: item.name as string,
        })),
      );
    } catch (e) {
      setSuggestions([]);
    }
    setLoading(false);
  };

  // Helper to get tomorrow's date in yyyy-mm-dd
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  // Helper function to format duration
  const formatDuration = (duration: string) => {
    return duration.replace("PT", "").toLowerCase();
  };

  // Helper function to format time
  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to calculate layover duration
  const getLayoverDuration = (prevArrival: string, nextDeparture: string) => {
    const prev = new Date(prevArrival);
    const next = new Date(nextDeparture);
    const diffMs = next.getTime() - prev.getTime();
    if (diffMs <= 0) return null;
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return `${hours ? hours + "h " : ""}${mins}m`;
  };

  // Helper function to get airline logo URL
  const getAirlineLogo = (carrierCode: string) => {
    return `https://daisycon.io/images/airline/?width=60&height=40&color=ffffff&iata=${carrierCode}`;
  };

  // Helper function to convert currency to INR (simplified conversion rates)
  const convertToINR = (amount: number, currency: string) => {
    const rates: { [key: string]: number } = {
      USD: 83.0,
      EUR: 90.0,
      GBP: 105.0,
      SAR: 22.0,
      AED: 22.5,
      INR: 1.0,
    };
    const rate = rates[currency.toUpperCase()] || 1.0;
    return Math.round(amount * rate);
  };

  // Helper function to get price by traveler type in INR
  const getPriceByType = (offer: Record<string, unknown>, type: string) => {
    const pricing = (
      offer.travelerPricings as Array<Record<string, unknown>>
    )?.find((p) => p.travelerType === type);
    return pricing
      ? (pricing.price as { currency: string; total: string }).currency +
          " " +
          parseFloat(
            (pricing.price as { total: string }).total,
          ).toLocaleString()
      : "N/A";
  };

  // Helper function to get baggage info
  const getBaggageInfo = (offer: Record<string, unknown>) => {
    const segments =
      (
        offer.itineraries as Array<{ segments: Array<Record<string, unknown>> }>
      )[0]?.segments || [];
    const baggageInfo = segments.map((segment: Record<string, unknown>) => {
      const fareDetails = (
        offer.travelerPricings as Array<Record<string, unknown>>
      )?.find((f: Record<string, unknown>) => f.segmentId === segment.id);
      return {
        segment: `${segment.departure.iataCode} → ${segment.arrival.iataCode}`,
        baggage: fareDetails?.includedCheckedBags?.quantity || 0,
      };
    });
    return baggageInfo;
  };

  // Helper function to get meals info (if available)
  const getMealsInfo = (offer: Record<string, unknown>) => {
    // This would need to be implemented based on available API data
    // For now, we'll show a placeholder
    return (
      (
        offer.itineraries as Array<{ segments: Array<Record<string, unknown>> }>
      )[0]?.segments?.map((segment: Record<string, unknown>) => ({
        segment: `${segment.departure.iataCode} → ${segment.arrival.iataCode}`,
        meals: "Meal information not available",
      })) || []
    );
  };

  // Helper to get total duration in minutes
  const getMinutes = (durationStr) => {
    if (!durationStr) return 0;
    // Format: PT13H40M
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = match && match[1] ? parseInt(match[1]) : 0;
    const mins = match && match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + mins;
  };

  // Compute sorted results
  const sortedResults = useMemo(() => {
    if (!flightSearchResults?.data) return [];
    const data = [...flightSearchResults.data];
    if (data.length === 0) return data;
    if (sortBy === "cheapest") {
      data.sort(
        (a, b) =>
          convertToINR(parseFloat(a.price.total), a.price.currency) -
          convertToINR(parseFloat(b.price.total), b.price.currency),
      );
    } else if (sortBy === "fastest") {
      data.sort(
        (a, b) =>
          getMinutes(a.itineraries[0].duration) -
          getMinutes(b.itineraries[0].duration),
      );
    } else {
      // best
      // Normalize price, duration, stops
      const prices = data.map((f) =>
        convertToINR(parseFloat(f.price.total), f.price.currency),
      );
      const durations = data.map((f) => getMinutes(f.itineraries[0].duration));
      const stops = data.map((f) => f.itineraries[0].segments.length - 1);
      const minPrice = Math.min(...prices),
        maxPrice = Math.max(...prices);
      const minDur = Math.min(...durations),
        maxDur = Math.max(...durations);
      const minStops = Math.min(...stops),
        maxStops = Math.max(...stops);
      data.forEach((f, i) => {
        const normPrice = (prices[i] - minPrice) / (maxPrice - minPrice || 1);
        const normDur = (durations[i] - minDur) / (maxDur - minDur || 1);
        const normStops = (stops[i] - minStops) / (maxStops - minStops || 1);
        f._score = normPrice * 0.5 + normDur * 0.3 + normStops * 0.2;
      });
      data.sort((a, b) => a._score - b._score);
    }
    return data;
  }, [flightSearchResults, sortBy]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading package details...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        {error}
      </div>
    );
  if (!pkg) return null;

  // Helper for currency
  const getCurrencySymbol = (currency: string | undefined) => {
    switch ((currency || "INR").toUpperCase()) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "SAR":
        return "﷼";
      default:
        return currency ? currency.toUpperCase() + " " : "₹";
    }
  };

  // Helper to format currency
  const formatCurrency = (amount: number | undefined) =>
    amount !== undefined && amount !== null
      ? getCurrencySymbol(pkg.currency) + amount.toLocaleString()
      : "-";

  // Helper to render selected flight info in sidebar
  const renderSelectedFlightSidebar = () => {
    if (!selectedFlight) return null;
    const {
      airline,
      flightNumber,
      departure,
      arrival,
      duration,
      cabin,
      adultPrice,
      childPrice,
      infantPrice,
      adults,
      children,
      infants,
      returnFlight,
    } = selectedFlight.details;
    const total =
      adults * adultPrice + children * childPrice + infants * infantPrice;
    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
        {/* Onward Flight */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={`https://content.airhex.com/content/logos/airlines_${flightNumber.split(" ")[0].toLowerCase()}_350_100_r.png?background=fff&pad=auto`}
            alt={airline}
            className="w-10 h-7 object-contain rounded bg-white border"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
          <div className="font-semibold text-base">
            {airline}{" "}
            <span className="text-xs text-gray-500">{flightNumber}</span>
          </div>
        </div>
        <div className="text-xs text-emerald-700 font-semibold mb-1">
          Onward Journey
        </div>
        <div className="text-sm text-gray-700 mb-1">
          {departure.iataCode} → {arrival.iataCode} | {cabin} | {duration}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {departure.at} → {arrival.at}
        </div>
        {/* Return Flight (if present) */}
        {returnFlight && (
          <>
            <div className="mt-2 flex items-center gap-2 mb-2">
              <img
                src={`https://content.airhex.com/content/logos/airlines_${returnFlight.flightNumber.split(" ")[0].toLowerCase()}_350_100_r.png?background=fff&pad=auto`}
                alt={returnFlight.airline}
                className="w-10 h-7 object-contain rounded bg-white border"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
              <div className="font-semibold text-base">
                {returnFlight.airline}{" "}
                <span className="text-xs text-gray-500">
                  {returnFlight.flightNumber}
                </span>
              </div>
            </div>
            <div className="text-xs text-emerald-700 font-semibold mb-1">
              Return Journey
            </div>
            <div className="text-sm text-gray-700 mb-1">
              {returnFlight.departure.iataCode} →{" "}
              {returnFlight.arrival.iataCode} | {returnFlight.cabin} |{" "}
              {returnFlight.duration}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {returnFlight.departure.at} → {returnFlight.arrival.at}
            </div>
          </>
        )}
        <div className="flex flex-col gap-1 text-sm mb-2">
          <div>
            Adults: <span className="font-semibold">{adults}</span> × ₹
            {adultPrice.toLocaleString()}
          </div>
          {children > 0 && (
            <div>
              Children: <span className="font-semibold">{children}</span> × ₹
              {childPrice.toLocaleString()}
            </div>
          )}
          {infants > 0 && (
            <div>
              Infants: <span className="font-semibold">{infants}</span> × ₹
              {infantPrice.toLocaleString()}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Total Flight Price:</span>
          <span className="text-lg font-bold text-emerald-700">
            ₹{total.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className="text-xs text-emerald-700 underline font-semibold"
            onClick={() => setFlightModalOpen(true)}
          >
            Modify Flight
          </button>
          <button
            type="button"
            className="text-xs text-red-600 underline"
            onClick={() => setSelectedFlight(null)}
          >
            Remove Flight
          </button>
        </div>
      </div>
    );
  };

  // Responsive layout, sticky sidebar, modern cards, tabs, etc.
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      <section className="relative h-[60vh] overflow-hidden flex items-end">
        {/* Overlayed badges for package type and category */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {pkg.package_type && (
            <Badge className="bg-emerald-600 text-white shadow font-bold px-3 py-1 text-base rounded-full">
              {pkg.package_type === "group"
                ? "Group Package"
                : pkg.package_type === "independent"
                  ? "Independent Package"
                  : pkg.package_type}
            </Badge>
          )}
          {pkg.package_category && (
            <Badge className="bg-blue-700 text-white shadow font-bold px-3 py-1 text-base rounded-full">
              {pkg.package_category}
            </Badge>
          )}
        </div>
        <ResponsiveBanner alt={pkg.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {pkg.duration || "Duration not specified"}
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 fill-current text-yellow-400" />
                {pkg.rating
                  ? `${pkg.rating} (${pkg.reviews} reviews)`
                  : "(No reviews)"}
              </div>
              <div className="flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                {pkg.flight_included === false ? (
                  <span className="text-red-500 font-semibold mr-3">
                    Flight not included
                  </span>
                ) : (
                  pkg.flight_details?.departure_from_airport ||
                  "Departure City not specified"
                )}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {Array.isArray(pkg.cities_covered) &&
                pkg.cities_covered.length > 0
                  ? pkg.cities_covered.join(" & ")
                  : "Cities not specified"}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="flex justify-between items-center bg-amber-50 rounded-xl p-2 w-full mb-6 gap-2">
                <TabsTrigger
                  value="overview"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="hotels"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Hotels
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Activities
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="terms"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Terms
                </TabsTrigger>
              </TabsList>
              {/* Enhanced Overview Tab Layout */}
              <TabsContent value="overview" className="space-y-8">
                {/* Hero Card */}
                <div className="mb-8 bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-xl p-8 border border-emerald-200 animate-fade-in-up">
                  <div className="flex flex-wrap gap-3 items-center mb-2">
                    {pkg.package_type && (
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-blue-200">
                        🕋{" "}
                        {pkg.package_type === "group"
                          ? "Group Package"
                          : pkg.package_type === "independent"
                            ? "Independent Package"
                            : pkg.package_type}
                      </span>
                    )}
                    {pkg.package_category && (
                      <span className="inline-flex items-center bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-emerald-200">
                        {pkg.package_category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 leading-tight drop-shadow mb-2">
                    {pkg.name}
                  </h1>
                  {pkg.description && (
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4 prose max-w-none">
                      {pkg.description}
                    </p>
                  )}
                  {/* Quick Facts Row */}
                  <div className="flex flex-wrap gap-3 items-center mt-4">
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium gap-1">
                      <Calendar className="w-4 h-4" />
                      {pkg.duration}
                    </span>
                    {pkg.departure_date && (
                      <span className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium gap-1">
                        <Plane className="w-4 h-4" />
                        {new Date(pkg.departure_date).toLocaleDateString()}
                      </span>
                    )}
                    {pkg.cities_covered && pkg.cities_covered.length > 0 && (
                      <span className="inline-flex items-center bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium gap-1">
                        <MapPin className="w-4 h-4" />
                        {pkg.cities_covered.join(" & ")}
                      </span>
                    )}
                    <span className="inline-flex items-center bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-sm font-bold gap-1">
                      <CreditCard className="w-4 h-4" />
                      {getCurrencySymbol(pkg.currency)}
                      {pkg.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
                {/* Info Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                  {/* Flight Info Card */}
                  <div className="bg-blue-50 rounded-xl shadow p-6 border border-blue-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-blue-500" />
                      <span className="font-bold text-blue-900">
                        Flight Info
                      </span>
                    </div>
                    <div className="text-blue-900 font-medium">
                      Airline:{" "}
                      <span className="font-normal">
                        {pkg.flight_details?.airline_name || "-"}
                      </span>
                    </div>
                    <div className="text-blue-900 font-medium">
                      Type:{" "}
                      <span className="font-normal">
                        {pkg.flight_details?.flight_type || "-"}
                      </span>
                    </div>
                    {pkg.flight_included === false && (
                      <>
                        <Button
                          size="sm"
                          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded self-start"
                          onClick={() => setFlightModalOpen(true)}
                        >
                          Add Flight
                        </Button>
                        <Dialog
                          open={flightModalOpen}
                          onOpenChange={setFlightModalOpen}
                        >
                          <DialogContent className="sm:max-w-md p-0 max-h-[90vh] flex flex-col">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-emerald-800 px-6 pt-6">
                                Search Flights
                              </DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto w-full">
                              {showSearchForm ? (
                                <form className="space-y-4 px-6 pb-6 pt-2">
                                  {/* Trip type dropdown */}
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <div className="flex-1 min-w-[140px]">
                                      <select
                                        className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        value={flightForm.tripType || "oneway"}
                                        onChange={(e) =>
                                          setFlightForm((f) => ({
                                            ...f,
                                            tripType: e.target.value,
                                          }))
                                        }
                                      >
                                        <option value="oneway">One way</option>
                                        <option value="roundtrip">
                                          Round trip
                                        </option>
                                      </select>
                                    </div>
                                    <div className="flex-1 min-w-[140px]">
                                      <select
                                        className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        value={
                                          flightForm.classType || "economy"
                                        }
                                        onChange={(e) =>
                                          setFlightForm((f) => ({
                                            ...f,
                                            classType: e.target.value,
                                          }))
                                        }
                                      >
                                        <option value="economy">Economy</option>
                                        <option value="business">
                                          Business
                                        </option>
                                        <option value="first">First</option>
                                      </select>
                                    </div>
                                  </div>
                                  {/* Card-like container for main controls */}
                                  <div className="bg-emerald-50 rounded-2xl shadow border border-emerald-100 flex flex-col relative overflow-visible">
                                    {/* Origin */}
                                    <div className="flex items-center px-4 py-3 relative">
                                      <span className="mr-2 text-emerald-700">
                                        <Plane className="w-5 h-5" />
                                      </span>
                                      <input
                                        className="flex-1 border-none bg-transparent focus:ring-0 text-emerald-900 font-medium placeholder:text-emerald-400 outline-none"
                                        placeholder="Origin (city or airport)"
                                        value={originInput}
                                        onChange={(e) => {
                                          setOriginInput(e.target.value);
                                          setFlightForm((f) => ({
                                            ...f,
                                            origin: e.target.value,
                                          }));
                                          if (e.target.value.length >= 2)
                                            fetchAirportSuggestions(
                                              e.target.value,
                                              setOriginSuggestions,
                                              setOriginLoading,
                                            );
                                          else setOriginSuggestions([]);
                                        }}
                                        autoComplete="off"
                                      />
                                      {originLoading && (
                                        <svg
                                          className="animate-spin h-4 w-4 text-emerald-600 ml-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                          ></path>
                                        </svg>
                                      )}
                                      {originSuggestions.length > 0 && (
                                        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-emerald-100 rounded shadow z-20 max-h-48 overflow-y-auto">
                                          {originSuggestions.map((s, i) => (
                                            <div
                                              key={s.code + i}
                                              className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm"
                                              onClick={() => {
                                                setOriginInput(
                                                  `${s.city} (${s.code})`,
                                                );
                                                setFlightForm((f) => ({
                                                  ...f,
                                                  origin: s.code,
                                                }));
                                                setOriginSuggestions([]);
                                              }}
                                            >
                                              <span className="font-semibold">
                                                {s.city}
                                              </span>{" "}
                                              <span className="text-gray-500">
                                                ({s.code})
                                              </span>{" "}
                                              <span className="text-gray-400">
                                                {s.name}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {/* Divider and swap button */}
                                    <div className="flex items-center relative">
                                      <div className="flex-1 border-t border-emerald-100 ml-4" />
                                      <button
                                        type="button"
                                        className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white border border-emerald-200 rounded-full p-1 shadow hover:bg-emerald-100 z-10"
                                        title="Swap origin and destination"
                                        onClick={() =>
                                          setFlightForm((f) => ({
                                            ...f,
                                            origin: f.destination,
                                            destination: f.origin,
                                          }))
                                        }
                                        style={{ marginTop: 0 }}
                                      >
                                        <svg
                                          className="w-5 h-5 text-emerald-600"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 17l6-6-6-6M20 7v10"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    {/* Destination */}
                                    <div className="flex items-center px-4 py-3 relative">
                                      <span className="mr-2 text-emerald-700">
                                        <MapPin className="w-5 h-5" />
                                      </span>
                                      <input
                                        className="flex-1 border-none bg-transparent focus:ring-0 text-emerald-900 font-medium placeholder:text-emerald-400 outline-none"
                                        placeholder="Destination (city or airport)"
                                        value={destinationInput}
                                        onChange={(e) => {
                                          setDestinationInput(e.target.value);
                                          setFlightForm((f) => ({
                                            ...f,
                                            destination: e.target.value,
                                          }));
                                          if (e.target.value.length >= 2)
                                            fetchAirportSuggestions(
                                              e.target.value,
                                              setDestinationSuggestions,
                                              setDestinationLoading,
                                            );
                                          else setDestinationSuggestions([]);
                                        }}
                                        autoComplete="off"
                                      />
                                      {destinationLoading && (
                                        <svg
                                          className="animate-spin h-4 w-4 text-emerald-600 ml-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                          ></path>
                                        </svg>
                                      )}
                                      {destinationSuggestions.length > 0 && (
                                        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-emerald-100 rounded shadow z-20 max-h-48 overflow-y-auto">
                                          {destinationSuggestions.map(
                                            (s, i) => (
                                              <div
                                                key={s.code + i}
                                                className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm"
                                                onClick={() => {
                                                  setDestinationInput(
                                                    `${s.city} (${s.code})`,
                                                  );
                                                  setFlightForm((f) => ({
                                                    ...f,
                                                    destination: s.code,
                                                  }));
                                                  setDestinationSuggestions([]);
                                                }}
                                              >
                                                <span className="font-semibold">
                                                  {s.city}
                                                </span>{" "}
                                                <span className="text-gray-500">
                                                  ({s.code})
                                                </span>{" "}
                                                <span className="text-gray-400">
                                                  {s.name}
                                                </span>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* Date and passenger selectors */}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="flex-1 min-w-[140px] flex items-center bg-white border border-emerald-100 rounded-lg px-3 py-2">
                                      <Calendar className="w-4 h-4 text-emerald-600 mr-2" />
                                      <Input
                                        id="departureDate"
                                        type="date"
                                        className="border-none p-0 focus:ring-0 text-emerald-900 font-medium bg-transparent min-w-0 w-full"
                                        value={flightForm.departureDate}
                                        min={getTomorrow()}
                                        onChange={(e) => {
                                          setFlightForm((f) => {
                                            // If return date is before new departure, clear it
                                            let newReturn = f.returnDate;
                                            if (
                                              newReturn &&
                                              newReturn < e.target.value
                                            )
                                              newReturn = "";
                                            return {
                                              ...f,
                                              departureDate: e.target.value,
                                              returnDate: newReturn,
                                            };
                                          });
                                        }}
                                      />
                                    </div>
                                    {flightForm.tripType === "roundtrip" && (
                                      <div className="flex-1 min-w-[140px] flex items-center bg-white border border-emerald-100 rounded-lg px-3 py-2">
                                        <Calendar className="w-4 h-4 text-emerald-600 mr-2" />
                                        <Input
                                          id="returnDate"
                                          type="date"
                                          className="border-none p-0 focus:ring-0 text-emerald-900 font-medium bg-transparent min-w-0 w-full"
                                          value={flightForm.returnDate}
                                          min={
                                            flightForm.departureDate ||
                                            getTomorrow()
                                          }
                                          onChange={(e) =>
                                            setFlightForm((f) => ({
                                              ...f,
                                              returnDate: e.target.value,
                                            }))
                                          }
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-[140px] flex items-center bg-white border border-emerald-100 rounded-lg px-3 py-2">
                                      <Users className="w-4 h-4 text-emerald-600 mr-2" />
                                      <select
                                        id="adults"
                                        className="flex-1 border-none bg-transparent focus:ring-0 text-emerald-900 font-medium min-w-0 w-full"
                                        value={flightForm.adults}
                                        onChange={(e) =>
                                          setFlightForm((f) => ({
                                            ...f,
                                            adults: Number(e.target.value),
                                          }))
                                        }
                                      >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                                          (n) => (
                                            <option key={n} value={n}>
                                              {n} Adult{n > 1 ? "s" : ""}
                                            </option>
                                          ),
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  {/* Children and infants selectors */}
                                  <div className="flex gap-2">
                                    <div className="flex-1 flex items-center bg-white border border-emerald-100 rounded-lg px-3 py-2">
                                      <span className="mr-2 text-emerald-600">
                                        <Users className="w-4 h-4" />
                                      </span>
                                      <select
                                        id="children"
                                        className="flex-1 border-none bg-transparent focus:ring-0 text-emerald-900 font-medium"
                                        value={flightForm.children}
                                        onChange={(e) =>
                                          setFlightForm((f) => ({
                                            ...f,
                                            children: Number(e.target.value),
                                          }))
                                        }
                                      >
                                        {[0, 1, 2, 3, 4, 5].map((n) => (
                                          <option key={n} value={n}>
                                            {n} Child{n !== 1 ? "ren" : ""}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="flex-1 flex items-center bg-white border border-emerald-100 rounded-lg px-3 py-2">
                                      <span className="mr-2 text-emerald-600">
                                        <Users className="w-4 h-4" />
                                      </span>
                                      <select
                                        id="infants"
                                        className="flex-1 border-none bg-transparent focus:ring-0 text-emerald-900 font-medium"
                                        value={flightForm.infants}
                                        onChange={(e) =>
                                          setFlightForm((f) => ({
                                            ...f,
                                            infants: Number(e.target.value),
                                          }))
                                        }
                                      >
                                        {[0, 1, 2, 3, 4, 5].map((n) => (
                                          <option key={n} value={n}>
                                            {n} Infant{n !== 1 ? "s" : ""}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  {/* Direct flights checkbox */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <input
                                      id="directFlights"
                                      type="checkbox"
                                      checked={!!flightForm.directFlights}
                                      onChange={(e) =>
                                        setFlightForm((f) => ({
                                          ...f,
                                          directFlights: e.target.checked,
                                        }))
                                      }
                                      className="accent-emerald-600"
                                    />
                                    <Label
                                      htmlFor="directFlights"
                                      className="text-sm text-emerald-800"
                                    >
                                      Direct flights
                                    </Label>
                                  </div>
                                  {/* Search button */}
                                  <div className="flex gap-2 mt-4">
                                    <Button
                                      type="button"
                                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-2 rounded-xl"
                                      onClick={async () => {
                                        setFlightSearchLoading(true);
                                        setFlightSearchResults(null);
                                        setFlightSearchError(null);
                                        try {
                                          const params = {
                                            originLocationCode:
                                              flightForm.origin,
                                            destinationLocationCode:
                                              flightForm.destination,
                                            departureDate:
                                              flightForm.departureDate,
                                            returnDate:
                                              flightForm.tripType ===
                                              "roundtrip"
                                                ? flightForm.returnDate
                                                : undefined,
                                            adults: flightForm.adults,
                                            children: flightForm.children,
                                            infants: flightForm.infants,
                                            travelClass:
                                              flightForm.classType?.toUpperCase(),
                                            nonStop: flightForm.directFlights,
                                            max: 10,
                                          };
                                          const results =
                                            await searchFlights(params);
                                          setFlightSearchResults(results);
                                          setShowSearchForm(false);
                                        } catch (err: unknown) {
                                          setFlightSearchError(
                                            typeof err === "object" &&
                                              err !== null &&
                                              "message" in err
                                              ? String(
                                                  (err as { message?: unknown })
                                                    .message,
                                                )
                                              : "Flight search failed",
                                          );
                                        } finally {
                                          setFlightSearchLoading(false);
                                        }
                                      }}
                                      disabled={flightSearchLoading}
                                    >
                                      {flightSearchLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                          <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <circle
                                              className="opacity-25"
                                              cx="12"
                                              cy="12"
                                              r="10"
                                              stroke="currentColor"
                                              strokeWidth="4"
                                            ></circle>
                                            <path
                                              className="opacity-75"
                                              fill="currentColor"
                                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                          </svg>
                                          Searching...
                                        </span>
                                      ) : (
                                        "Search"
                                      )}
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="w-full text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                                      onClick={() => setShowSearchForm(false)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              ) : (
                                <div className="px-6 pt-4 flex flex-col h-full">
                                  <Button
                                    type="button"
                                    className="mb-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold px-4 py-2 rounded self-start"
                                    onClick={() => setShowSearchForm(true)}
                                  >
                                    Modify Search
                                  </Button>
                                  {/* Above the flight results list, add the sorting dropdown: */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <label
                                      htmlFor="flight-sort"
                                      className="text-sm font-medium text-gray-700"
                                    >
                                      Sort by:
                                    </label>
                                    <select
                                      id="flight-sort"
                                      value={sortBy}
                                      onChange={(e) =>
                                        setSortBy(e.target.value)
                                      }
                                      className="border border-emerald-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    >
                                      <option value="best">Best</option>
                                      <option value="cheapest">Cheapest</option>
                                      <option value="fastest">Fastest</option>
                                    </select>
                                  </div>
                                  {sortedResults.length > 0 ? (
                                    sortedResults.map(
                                      (offer: Record<string, unknown>, idx) => {
                                        const isExpanded =
                                          expandedFlightId === offer.id;
                                        const onwardSegments =
                                          offer.itineraries?.[0]?.segments ||
                                          [];
                                        const returnSegments =
                                          offer.itineraries?.[1]?.segments ||
                                          [];
                                        const totalSegments = [
                                          ...onwardSegments,
                                          ...returnSegments,
                                        ];
                                        // Get first and last segment for times
                                        const firstSegment = onwardSegments[0];
                                        const lastSegment =
                                          onwardSegments[
                                            onwardSegments.length - 1
                                          ];
                                        // Departure and arrival times
                                        const departureTime = firstSegment
                                          ? formatTime(
                                              firstSegment.departure.at,
                                            )
                                          : "";
                                        const arrivalTime = lastSegment
                                          ? formatTime(lastSegment.arrival.at)
                                          : "";
                                        // Total duration
                                        const totalDuration = offer
                                          .itineraries?.[0]?.duration
                                          ? formatDuration(
                                              offer.itineraries[0].duration,
                                            )
                                          : "";
                                        // Always define baggageInfo and mealsInfo here for use in expanded details
                                        const baggageInfo =
                                          getBaggageInfo(offer);
                                        const mealsInfo = getMealsInfo(offer);
                                        const isSelected =
                                          selectedFlight &&
                                          selectedFlight.id === offer.id;
                                        return (
                                          <div
                                            key={offer.id || idx}
                                            id={`flight-card-${offer.id}`}
                                            className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow p-4 mb-4 cursor-pointer flex flex-col gap-2"
                                            onClick={() =>
                                              setExpandedFlightId(
                                                isExpanded ? null : offer.id,
                                              )
                                            }
                                          >
                                            {/* Onward Journey Row */}
                                            {onwardSegments.length > 0 && (
                                              <div className="flex items-center gap-3 min-w-0">
                                                <img
                                                  src={getAirlineLogo(
                                                    onwardSegments[0]
                                                      .carrierCode,
                                                  )}
                                                  alt={
                                                    offer.dictionaries
                                                      ?.carriers?.[
                                                      onwardSegments[0]
                                                        .carrierCode
                                                    ] ||
                                                    onwardSegments[0]
                                                      .carrierCode
                                                  }
                                                  className="w-7 h-7 object-contain flex-shrink-0"
                                                  onError={(e) => {
                                                    e.currentTarget.style.display =
                                                      "none";
                                                  }}
                                                />
                                                <span className="font-semibold text-base text-gray-900">
                                                  {
                                                    onwardSegments[0]?.departure
                                                      .iataCode
                                                  }
                                                </span>
                                                <span className="text-gray-500">
                                                  →
                                                </span>
                                                <span className="font-semibold text-base text-gray-900">
                                                  {
                                                    onwardSegments[
                                                      onwardSegments.length - 1
                                                    ]?.arrival.iataCode
                                                  }
                                                </span>
                                                <span className="ml-2 text-sm font-medium text-gray-800">
                                                  {onwardSegments[0]
                                                    ? formatTime(
                                                        onwardSegments[0]
                                                          .departure.at,
                                                      )
                                                    : ""}{" "}
                                                  -{" "}
                                                  {onwardSegments[
                                                    onwardSegments.length - 1
                                                  ]
                                                    ? formatTime(
                                                        onwardSegments[
                                                          onwardSegments.length -
                                                            1
                                                        ].arrival.at,
                                                      )
                                                    : ""}
                                                </span>
                                                <span
                                                  className="ml-2 text-xs px-2 py-1 rounded-full font-semibold"
                                                  style={{
                                                    background:
                                                      onwardSegments.length ===
                                                      1
                                                        ? "#e6f9f0"
                                                        : "#fff4f4",
                                                    color:
                                                      onwardSegments.length ===
                                                      1
                                                        ? "#059669"
                                                        : "#e11d48",
                                                  }}
                                                >
                                                  {onwardSegments.length === 1
                                                    ? "Direct"
                                                    : `${onwardSegments.length - 1} stop${onwardSegments.length - 1 > 1 ? "s" : ""}`}
                                                </span>
                                                <span className="ml-2 text-xs text-gray-500">
                                                  {offer.itineraries?.[0]
                                                    ?.duration
                                                    ? formatDuration(
                                                        offer.itineraries[0]
                                                          .duration,
                                                      )
                                                    : ""}
                                                </span>
                                              </div>
                                            )}
                                            {/* Return Journey Row */}
                                            {returnSegments.length > 0 && (
                                              <div className="flex items-center gap-3 min-w-0">
                                                <img
                                                  src={getAirlineLogo(
                                                    returnSegments[0]
                                                      .carrierCode,
                                                  )}
                                                  alt={
                                                    offer.dictionaries
                                                      ?.carriers?.[
                                                      returnSegments[0]
                                                        .carrierCode
                                                    ] ||
                                                    returnSegments[0]
                                                      .carrierCode
                                                  }
                                                  className="w-7 h-7 object-contain flex-shrink-0"
                                                  onError={(e) => {
                                                    e.currentTarget.style.display =
                                                      "none";
                                                  }}
                                                />
                                                <span className="font-semibold text-base text-gray-900">
                                                  {
                                                    returnSegments[0]?.departure
                                                      .iataCode
                                                  }
                                                </span>
                                                <span className="text-gray-500">
                                                  →
                                                </span>
                                                <span className="font-semibold text-base text-gray-900">
                                                  {
                                                    returnSegments[
                                                      returnSegments.length - 1
                                                    ]?.arrival.iataCode
                                                  }
                                                </span>
                                                <span className="ml-2 text-sm font-medium text-gray-800">
                                                  {returnSegments[0]
                                                    ? formatTime(
                                                        returnSegments[0]
                                                          .departure.at,
                                                      )
                                                    : ""}{" "}
                                                  -{" "}
                                                  {returnSegments[
                                                    returnSegments.length - 1
                                                  ]
                                                    ? formatTime(
                                                        returnSegments[
                                                          returnSegments.length -
                                                            1
                                                        ].arrival.at,
                                                      )
                                                    : ""}
                                                </span>
                                                <span
                                                  className="ml-2 text-xs px-2 py-1 rounded-full font-semibold"
                                                  style={{
                                                    background:
                                                      returnSegments.length ===
                                                      1
                                                        ? "#e6f9f0"
                                                        : "#fff4f4",
                                                    color:
                                                      returnSegments.length ===
                                                      1
                                                        ? "#059669"
                                                        : "#e11d48",
                                                  }}
                                                >
                                                  {returnSegments.length === 1
                                                    ? "Direct"
                                                    : `${returnSegments.length - 1} stop${returnSegments.length - 1 > 1 ? "s" : ""}`}
                                                </span>
                                                <span className="ml-2 text-xs text-gray-500">
                                                  {offer.itineraries?.[1]
                                                    ?.duration
                                                    ? formatDuration(
                                                        offer.itineraries[1]
                                                          .duration,
                                                      )
                                                    : ""}
                                                </span>
                                              </div>
                                            )}
                                            {/* Price and Passenger Info */}
                                            <div className="flex items-center justify-between mt-2">
                                              <div className="flex items-center gap-2"></div>
                                              <div className="flex flex-col items-end">
                                                <span className="text-emerald-900 text-xl font-bold">
                                                  ₹{" "}
                                                  {convertToINR(
                                                    parseFloat(
                                                      offer.price.total,
                                                    ),
                                                    offer.price.currency,
                                                  ).toLocaleString()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                  {flightForm.adults +
                                                    flightForm.children +
                                                    flightForm.infants}{" "}
                                                  people
                                                </span>
                                                <button
                                                  type="button"
                                                  className={`mt-2 px-4 py-2 rounded font-semibold text-sm transition ${isSelected ? "bg-emerald-600 text-white cursor-not-allowed" : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"}`}
                                                  disabled={isSelected}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Extract per-traveler-type prices from offer.travelerPricings
                                                    let adultPrice = 0,
                                                      childPrice = 0,
                                                      infantPrice = 0;
                                                    if (
                                                      offer.travelerPricings
                                                    ) {
                                                      const getInr = (p) =>
                                                        p
                                                          ? Math.round(
                                                              parseFloat(
                                                                p.price.total,
                                                              ) *
                                                                (p.price
                                                                  .currency ===
                                                                "INR"
                                                                  ? 1
                                                                  : p.price
                                                                        .currency ===
                                                                      "USD"
                                                                    ? 83.5
                                                                    : 1),
                                                            )
                                                          : 0;
                                                      const adult =
                                                        offer.travelerPricings.find(
                                                          (p) =>
                                                            p.travelerType ===
                                                            "ADULT",
                                                        );
                                                      const child =
                                                        offer.travelerPricings.find(
                                                          (p) =>
                                                            p.travelerType ===
                                                            "CHILD",
                                                        );
                                                      const infant =
                                                        offer.travelerPricings.find(
                                                          (p) =>
                                                            p.travelerType ===
                                                              "HELD_INFANT" ||
                                                            p.travelerType ===
                                                              "INFANT",
                                                        );
                                                      adultPrice =
                                                        getInr(adult);
                                                      childPrice =
                                                        getInr(child);
                                                      infantPrice =
                                                        getInr(infant);
                                                    }
                                                    // Extract onward and return segments
                                                    const onwardSegments =
                                                      offer.itineraries?.[0]
                                                        ?.segments || [];
                                                    const returnSegments =
                                                      offer.itineraries?.[1]
                                                        ?.segments || [];
                                                    const onward =
                                                      onwardSegments[0];
                                                    const onwardLast =
                                                      onwardSegments[
                                                        onwardSegments.length -
                                                          1
                                                      ];
                                                    const returnFirst =
                                                      returnSegments[0];
                                                    const returnLast =
                                                      returnSegments[
                                                        returnSegments.length -
                                                          1
                                                      ];
                                                    setSelectedFlight({
                                                      id: offer.id,
                                                      airline:
                                                        offer.dictionaries
                                                          ?.carriers?.[
                                                          onward?.carrierCode
                                                        ] ||
                                                        onward?.carrierCode ||
                                                        "",
                                                      flightNumber:
                                                        onward?.carrierCode +
                                                        " " +
                                                        onward?.number,
                                                      price: parseFloat(
                                                        offer.price.total,
                                                      ),
                                                      details: {
                                                        airline:
                                                          offer.dictionaries
                                                            ?.carriers?.[
                                                            onward?.carrierCode
                                                          ] ||
                                                          onward?.carrierCode ||
                                                          "",
                                                        flightNumber:
                                                          onward?.carrierCode +
                                                          " " +
                                                          onward?.number,
                                                        departure:
                                                          onward?.departure,
                                                        arrival:
                                                          onwardLast?.arrival,
                                                        duration:
                                                          offer.itineraries?.[0]
                                                            ?.duration || "",
                                                        stops:
                                                          onwardSegments.length -
                                                          1,
                                                        cabin:
                                                          offer
                                                            .travelerPricings?.[0]
                                                            ?.fareDetailsBySegment?.[0]
                                                            ?.cabin || "",
                                                        aircraft:
                                                          onward?.aircraft
                                                            ?.code,
                                                        adultPrice,
                                                        childPrice,
                                                        infantPrice,
                                                        adults:
                                                          flightForm.adults,
                                                        children:
                                                          flightForm.children,
                                                        infants:
                                                          flightForm.infants,
                                                        // Add returnFlight if present and valid
                                                        ...(returnSegments.length >
                                                          0 &&
                                                        returnFirst &&
                                                        returnLast
                                                          ? {
                                                              returnFlight: {
                                                                airline:
                                                                  offer
                                                                    .dictionaries
                                                                    ?.carriers?.[
                                                                    returnFirst
                                                                      ?.carrierCode
                                                                  ] ||
                                                                  returnFirst?.carrierCode ||
                                                                  "",
                                                                flightNumber:
                                                                  returnFirst?.carrierCode +
                                                                  " " +
                                                                  returnFirst?.number,
                                                                departure:
                                                                  returnFirst?.departure,
                                                                arrival:
                                                                  returnLast?.arrival,
                                                                duration:
                                                                  offer
                                                                    .itineraries?.[1]
                                                                    ?.duration ||
                                                                  "",
                                                                stops:
                                                                  returnSegments.length -
                                                                  1,
                                                                cabin:
                                                                  offer
                                                                    .travelerPricings?.[0]
                                                                    ?.fareDetailsBySegment?.[1]
                                                                    ?.cabin ||
                                                                  "",
                                                                aircraft:
                                                                  returnFirst
                                                                    ?.aircraft
                                                                    ?.code,
                                                              },
                                                            }
                                                          : {}),
                                                      },
                                                    });
                                                    setFlightModalOpen(false);
                                                  }}
                                                >
                                                  {isSelected
                                                    ? "Selected"
                                                    : "Add to Package"}
                                                </button>
                                              </div>
                                            </div>
                                            {isExpanded && (
                                              <div className="border-t bg-gray-50 p-4 transition-all duration-300 ease-in-out animate-fade-in">
                                                <div className="flex justify-end mb-2">
                                                  <button
                                                    type="button"
                                                    className="text-gray-500 hover:text-emerald-700 text-sm flex items-center gap-1"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setExpandedFlightId(null);
                                                    }}
                                                    aria-label="Collapse details"
                                                  >
                                                    <ChevronUp className="w-4 h-4" />{" "}
                                                    Close
                                                  </button>
                                                </div>
                                                {/* ...existing Tabs and tab content... */}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      },
                                    )
                                  ) : (
                                    <div className="text-gray-500 text-center">
                                      No flights found.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                  {/* Meal Plan Card */}
                  <div className="bg-yellow-50 rounded-xl shadow p-6 border border-yellow-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="w-5 h-5 text-yellow-600" />
                      <span className="font-bold text-yellow-900">
                        Meal Plan
                      </span>
                    </div>
                    <div className="text-yellow-900 font-medium">
                      {pkg.meal_plan || "-"}
                    </div>
                  </div>
                </div>
                {/* Inclusions/Exclusions Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                  {/* Inclusions Card */}
                  <div className="bg-emerald-50 rounded-xl shadow p-6 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-emerald-900">
                        Inclusions
                      </span>
                    </div>
                    <ul className="list-disc pl-5 text-emerald-900 space-y-1">
                      {(pkg.inclusions || [])
                        .slice(0, 5)
                        .map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      {pkg.inclusions && pkg.inclusions.length > 5 && (
                        <li className="text-xs text-emerald-700 font-semibold">
                          +{pkg.inclusions.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                  {/* Exclusions Card */}
                  <div className="bg-rose-50 rounded-xl shadow p-6 border border-rose-200">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="w-5 h-5 text-rose-600" />
                      <span className="font-bold text-rose-900">
                        Exclusions
                      </span>
                    </div>
                    <ul className="list-disc pl-5 text-rose-900 space-y-1">
                      {(pkg.exclusions || [])
                        .slice(0, 5)
                        .map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      {pkg.exclusions && pkg.exclusions.length > 5 && (
                        <li className="text-xs text-rose-700 font-semibold">
                          +{pkg.exclusions.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              {/* Hotels Tab */}
              <TabsContent value="hotels">
                <div className="grid md:grid-cols-2 gap-8">
                  {hotelDetails.makkah && (
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
                          Makkah Accommodation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={
                            hotelDetails.makkah.featured_image ||
                            (hotelDetails.makkah.images &&
                              hotelDetails.makkah.images[0]) ||
                            "/placeholder.svg"
                          }
                          alt={hotelDetails.makkah.name}
                          className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
                        />
                        <div className="font-bold text-lg mb-2">
                          {hotelDetails.makkah.name}
                        </div>
                        <div className="flex items-center mt-2 mb-2">
                          {[...Array(hotelDetails.makkah.rating)].map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-yellow-400 fill-current"
                              />
                            ),
                          )}
                        </div>
                        {(hotelDetails.makkah.distance_from_haram ||
                          hotelDetails.makkah.distance) && (
                          <div className="mb-2 text-gray-700 font-medium">
                            Distance:{" "}
                            {hotelDetails.makkah.distance_from_haram ||
                              hotelDetails.makkah.distance}{" "}
                            metres
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {hotelDetails.makkah.amenities?.map(
                            (amenity: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs justify-start"
                              >
                                {amenity}
                              </Badge>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {hotelDetails.madinah && (
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                          Madinah Accommodation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={
                            hotelDetails.madinah.featured_image ||
                            (hotelDetails.madinah.images &&
                              hotelDetails.madinah.images[0]) ||
                            "/placeholder.svg"
                          }
                          alt={hotelDetails.madinah.name}
                          className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
                        />
                        <div className="font-bold text-lg mb-2">
                          {hotelDetails.madinah.name}
                        </div>
                        <div className="flex items-center mt-2 mb-2">
                          {[...Array(hotelDetails.madinah.rating)].map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-yellow-400 fill-current"
                              />
                            ),
                          )}
                        </div>
                        {(hotelDetails.madinah.distance_from_masjid_e_nabawi ||
                          hotelDetails.madinah.distance) && (
                          <div className="mb-2 text-gray-700 font-medium">
                            Distance:{" "}
                            {hotelDetails.madinah
                              .distance_from_masjid_e_nabawi ||
                              hotelDetails.madinah.distance}{" "}
                            metres
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {hotelDetails.madinah.amenities?.map(
                            (amenity: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs justify-start"
                              >
                                {amenity}
                              </Badge>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              {/* Itinerary Tab */}
              <TabsContent value="itinerary">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                      Day-by-Day Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pkg.itinerary &&
                    Array.isArray(pkg.itinerary) &&
                    pkg.itinerary.length > 0 ? (
                      <div className="relative pl-8">
                        <div className="absolute left-2 top-0 bottom-0 w-1 bg-emerald-100 rounded" />
                        {pkg.itinerary.map(
                          (
                            item: {
                              location?: string;
                              title?: string;
                              day?: string | number;
                              activities?: string[] | string;
                              description?: string;
                            },
                            idx: number,
                          ) => {
                            // Determine day type and icon
                            const dayTitle = (
                              item.location ||
                              item.title ||
                              ""
                            ).toLowerCase();
                            let dotColor = "bg-emerald-500";
                            let borderColor = "border-emerald-100";
                            let Icon = MapPin;
                            if (
                              dayTitle.includes("arrival") ||
                              dayTitle.includes("depart")
                            ) {
                              dotColor = "bg-blue-500";
                              borderColor = "border-blue-100";
                              Icon = Plane;
                            } else if (
                              dayTitle.includes("ziyarah") ||
                              dayTitle.includes("special")
                            ) {
                              dotColor = "bg-yellow-500";
                              borderColor = "border-yellow-100";
                              Icon = Star;
                            } else if (dayTitle.includes("free")) {
                              dotColor = "bg-purple-500";
                              borderColor = "border-purple-100";
                              Icon = Sparkles;
                            }
                            return (
                              <div
                                key={idx}
                                className="relative mb-8 animate-fade-in-up"
                                style={{ animationDelay: `${idx * 80}ms` }}
                              >
                                <div
                                  className={`absolute -left-4 top-2 w-8 h-8 ${dotColor} text-white rounded-full flex items-center justify-center font-bold shadow transition-colors duration-300`}
                                >
                                  {item.day || idx + 1}
                                </div>
                                <div
                                  className={`ml-8 bg-white rounded-xl shadow p-6 border ${borderColor} transition-colors duration-300 flex flex-col gap-2`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Icon className="w-5 h-5" />
                                    <span className="font-semibold text-lg">
                                      {item.location ||
                                        item.title ||
                                        "Location TBA"}
                                    </span>
                                  </div>
                                  <div className="text-gray-700">
                                    {Array.isArray(item.activities) ? (
                                      <ul className="list-disc pl-5">
                                        {item.activities.map(
                                          (activity: string, i: number) => (
                                            <li key={i}>{activity}</li>
                                          ),
                                        )}
                                      </ul>
                                    ) : (
                                      <p>
                                        {item.activities ||
                                          item.description ||
                                          "Activities TBA"}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Detailed itinerary will be provided upon booking
                        confirmation.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Activities Tab */}
              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-6 h-6 mr-2 text-purple-600" />
                      Included Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activityDetails && activityDetails.length > 0 ? (
                      <div className="space-y-8">
                        {activityDetails.map(
                          (
                            activity: {
                              id: string;
                              name: string;
                              description?: string;
                              featured_image?: string;
                              city?: string;
                              duration?: string;
                            },
                            idx: number,
                          ) => {
                            return (
                              <div
                                key={activity.id || idx}
                                className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 p-6"
                              >
                                <div className="clearfix">
                                  <img
                                    src={
                                      activity.featured_image ||
                                      "/placeholder.svg"
                                    }
                                    alt={activity.name}
                                    className="float-left w-32 h-32 object-cover rounded-lg mr-6 mb-2 border border-emerald-100 shadow"
                                    style={{
                                      maxWidth: "8rem",
                                      maxHeight: "8rem",
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "/placeholder.svg";
                                    }}
                                  />
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xl font-bold text-emerald-900">
                                      {activity.name}
                                    </span>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {activity.city && (
                                        <span className="text-xs text-white bg-emerald-500 rounded px-2 py-1">
                                          {activity.city}
                                        </span>
                                      )}
                                      {activity.duration && (
                                        <span className="text-xs text-white bg-blue-500 rounded px-2 py-1">
                                          {activity.duration}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {activity.description && (
                                    <div
                                      className="text-gray-700 text-base leading-relaxed mt-2"
                                      dangerouslySetInnerHTML={{
                                        __html: activity.description,
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Activity details will be shared before departure.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Pricing Tab */}
              <TabsContent value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                      Comprehensive Pricing Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Sharing Room Card - always on its own row */}
                      {pkg.pricing?.sharing?.pricePerTraveler && (
                        <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-emerald-200">
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                            Most Popular
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-emerald-600" />
                            <span className="text-lg font-bold">
                              Sharing Room
                            </span>
                          </div>
                          <div className="text-3xl font-extrabold text-emerald-700 mb-1">
                            {getCurrencySymbol(pkg.currency)}
                            {pkg.pricing.sharing.pricePerTraveler.toLocaleString()}
                          </div>
                          <div className="text-gray-500 mb-2">per traveler</div>
                          <div className="flex gap-4 mt-2">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                Child (no bed)
                                <span title="Ages 2-9, no separate bed">
                                  <Info className="w-3 h-3 text-gray-400" />
                                </span>
                              </span>
                              <span className="font-semibold text-emerald-600">
                                {formatCurrency(pkg.pricing.childWithoutBed)}
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                Infant
                                <span title="Below 2 years">
                                  <Info className="w-3 h-3 text-gray-400" />
                                </span>
                              </span>
                              <span className="font-semibold text-emerald-600">
                                {formatCurrency(pkg.pricing.infant)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 bg-emerald-100 rounded px-3 py-2">
                            <Info className="w-4 h-4 text-emerald-500" />
                            <span>
                              Sharing is typically{" "}
                              <span className="font-semibold">
                                4 or 5 in a room
                              </span>
                              . During{" "}
                              <span className="font-semibold">Ramadan</span>,
                              sharing may be up to{" "}
                              <span className="font-semibold">6 in a room</span>
                              .
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-6 justify-center">
                      {["quint", "quad", "triple", "double", "single"].map(
                        (type) =>
                          pkg.pricing?.private?.[type] ? (
                            <div
                              key={type}
                              className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow p-5 flex flex-col items-center border border-blue-200 min-w-[220px] flex-1 max-w-xs"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Bed className="w-6 h-6 text-blue-600" />
                                <span className="font-semibold text-base">
                                  {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                                  Room
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-blue-700 mb-1">
                                {getCurrencySymbol(pkg.currency)}
                                {pkg.pricing.private[type].toLocaleString()}
                              </div>
                              <div className="text-gray-500 mb-2">
                                per room (
                                {type === "quint"
                                  ? 5
                                  : type === "quad"
                                    ? 4
                                    : type === "triple"
                                      ? 3
                                      : type === "double"
                                        ? 2
                                        : 1}{" "}
                                travelers)
                              </div>
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    Child (no bed)
                                    <span title="Ages 2-9, no separate bed">
                                      <Info className="w-3 h-3 text-gray-400" />
                                    </span>
                                  </span>
                                  <span className="font-semibold text-blue-600">
                                    {formatCurrency(
                                      pkg.pricing.childWithoutBed,
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    Infant
                                    <span title="Below 2 years">
                                      <Info className="w-3 h-3 text-gray-400" />
                                    </span>
                                  </span>
                                  <span className="font-semibold text-blue-600">
                                    {formatCurrency(pkg.pricing.infant)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null,
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Terms Tab */}
              <TabsContent value="terms">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-6 h-6 mr-2 text-yellow-600" />
                      Terms & Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Payment Terms Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          🧾 Payment Terms
                        </h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>
                            <strong>Booking Amount:</strong> A minimum of 50% of
                            the total package value must be paid at the time of
                            booking to secure seats and initiate visa, flight,
                            and hotel arrangements.
                          </li>
                          <li>
                            <strong>Balance Payment:</strong> Full payment must
                            be cleared at least 15 days before the departure
                            date. For bookings made within 15 days of departure,
                            100% upfront payment is required.
                          </li>
                          <li>
                            <strong>Non-Refundable Charges:</strong> A flat
                            amount of ₹5,000 per traveler is non-refundable
                            under any circumstances (covers administrative,
                            processing, and service charges).
                          </li>
                          <li>
                            <strong>Payment Methods & Surcharges:</strong>{" "}
                            Payments can be made via bank transfer, UPI, payment
                            gateways, or credit/debit cards. Payments made via
                            card swipe or payment gateways will incur an
                            additional 2% service charge.
                          </li>
                          <li>
                            <strong>
                              Foreign Currency & Pricing Disclaimer:
                            </strong>{" "}
                            All package costs are quoted in Indian Rupees (INR).
                            Prices may vary based on forex fluctuations, airline
                            surcharges, or visa fee changes.
                          </li>
                        </ul>
                      </section>
                      <hr />
                      {/* Cancellation Policy Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          ❌ Cancellation Policy
                        </h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>
                            <strong>Cancellation by Traveler:</strong>
                          </li>
                          <ul className="list-disc pl-8">
                            <li>
                              30+ days before departure: ₹5,000 per traveler
                              retained.
                            </li>
                            <li>
                              15–29 days before departure: 25% of the package
                              cost retained.
                            </li>
                            <li>
                              8–14 days before departure: 50% of the package
                              cost retained.
                            </li>
                            <li>
                              0–7 days before departure: 100% of the package
                              cost retained (no refund).
                            </li>
                          </ul>
                          <li>
                            <strong>Cancellation by Agency:</strong> In the rare
                            event that we cancel the tour for any reason other
                            than the traveler's fault, a full refund or suitable
                            travel credit will be offered.
                          </li>
                        </ul>
                      </section>
                      <hr />
                      {/* Refund Policy Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          💰 Refund Policy
                        </h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>
                            <strong>Refund Processing Time:</strong> All
                            eligible refunds will be processed within 15 to 30
                            working days after deduction of applicable fees and
                            actual costs already incurred.
                          </li>
                          <li>
                            <strong>Non-Refundable Components Include:</strong>
                            <ul className="list-disc pl-8">
                              <li>Visa fee (once applied)</li>
                              <li>
                                Airline ticket charges (if non-refundable or
                                issued)
                              </li>
                              <li>
                                Hotel cancellation fees (as per hotel policy)
                              </li>
                              <li>
                                Service and processing charges (₹5,000 minimum)
                              </li>
                            </ul>
                          </li>
                          <li>
                            <strong>No Refund Will Be Issued For:</strong>
                            <ul className="list-disc pl-8">
                              <li>Voluntary withdrawal after visa issuance</li>
                              <li>
                                Missed departures or missed services due to
                                personal delays
                              </li>
                              <li>
                                Unused services (meals, transfers, hotel nights,
                                etc.)
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </section>
                      <hr />
                      {/* Traveler Responsibilities Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          🧍🏽 Traveler Responsibilities
                        </h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>
                            <strong>Valid Travel Documents:</strong> Travelers
                            must hold a passport valid for at least 6 months
                            beyond the travel date and must submit required
                            documents (passport, photographs, vaccine
                            certificate, etc.) on time.
                          </li>
                          <li>
                            <strong>Information Accuracy:</strong> It is the
                            traveler's responsibility to provide correct and
                            complete information for visa processing. Any errors
                            may lead to visa rejection or delays.
                          </li>
                          <li>
                            <strong>Group Discipline & Conduct:</strong> All
                            travelers must maintain respectful behavior, observe
                            group timings, and follow tour leader instructions.
                            Disruptive or disrespectful behavior may result in
                            removal from the group with no refund.
                          </li>
                          <li>
                            <strong>Health Disclosure & Fitness:</strong> Please
                            inform us in advance of any medical condition or
                            physical limitation. Travelers must be fit for
                            walking during Ziyarah and Umrah rituals.
                          </li>
                          <li>
                            <strong>Arrival Timeliness:</strong> Travelers must
                            ensure they are punctual for airport check-ins,
                            group departures, Ziyarah, and rituals. Delays may
                            lead to missed components with no reimbursement.
                          </li>
                        </ul>
                      </section>
                      <hr />
                      {/* Disclaimers Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          ⚠️ Disclaimers
                        </h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>
                            <strong>Force Majeure:</strong> The agency is not
                            liable for delays, disruptions, or cancellations
                            caused by factors beyond our control — including but
                            not limited to natural calamities, political unrest,
                            pandemics, government restrictions, airline/visa
                            rejections, or acts of God.
                          </li>
                          <li>
                            <strong>Itinerary Flexibility:</strong> While we
                            strive to honor the planned itinerary, we reserve
                            the right to modify hotels, flights, or travel dates
                            based on operational or logistic necessities.
                            Service quality will remain equivalent or better.
                          </li>
                          <li>
                            <strong>Minimum Group Size:</strong> Certain
                            features (e.g. tour leader, shared transport) may
                            require a minimum number of participants. If unmet,
                            we may revise service inclusions or offer an
                            adjusted itinerary.
                          </li>
                          <li>
                            <strong>Religious Disclaimer:</strong> The spiritual
                            outcome of Umrah is solely with Allah. We serve as
                            facilitators and cannot guarantee spiritual
                            experiences or acceptance of worship.
                          </li>
                        </ul>
                      </section>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          {/* Sidebar Booking Widget */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2 text-emerald-600" />
                  Customize Your Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Type Selection */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">
                    Room Sharing Type
                  </label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={selectedRoomType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedRoomType(value);
                      if (value === "sharing") {
                        setGuestCount({
                          sharing: 1,
                          childWithoutBed: 0,
                          infants: 0,
                        });
                      } else if (value === "private") {
                        setGuestCount({
                          quint: 0,
                          quad: 0,
                          triple: 0,
                          double: 0,
                          single: 0,
                          childWithoutBed: 0,
                          infants: 0,
                        });
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select room type
                    </option>
                    {pkg.is_group_package !== false && (
                      <option value="sharing">Sharing room</option>
                    )}
                    <option value="private">Private room</option>
                  </select>
                </div>
                {/* Guest Count Selection - only show if sharing */}
                {selectedRoomType === "sharing" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        Adult
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            setGuestCount((g) => ({
                              ...g,
                              sharing: Math.max(1, (g.sharing || 1) - 1),
                            }))
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-bold">
                          {guestCount.sharing || 1}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            setGuestCount((g) => ({
                              ...g,
                              sharing: (g.sharing || 1) + 1,
                            }))
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2 text-yellow-700">
                        <Users className="w-5 h-5 text-yellow-500" />
                        Child (no bed)
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            setGuestCount((g) => ({
                              ...g,
                              childWithoutBed: Math.max(
                                0,
                                g.childWithoutBed - 1,
                              ),
                            }))
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-bold">
                          {guestCount.childWithoutBed}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            setGuestCount((g) => ({
                              ...g,
                              childWithoutBed: g.childWithoutBed + 1,
                            }))
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2 text-purple-700">
                        <Users className="w-5 h-5 text-purple-500" />
                        Infant
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            setGuestCount((g) => ({
                              ...g,
                              infants: Math.max(0, g.infants - 1),
                            }))
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-bold">
                          {guestCount.infants}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            setGuestCount((g) => ({
                              ...g,
                              infants: g.infants + 1,
                            }))
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Guest Count Selection - only show if private */}
                {selectedRoomType === "private" && (
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      Select Number of Rooms
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2">
                          <Users className="w-5 h-5 text-emerald-600" />
                          Quint Bed
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                quint: Math.max(0, (g.quint || 0) - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-bold">
                            {guestCount.quint || 0}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                quint: (g.quint || 0) + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2">
                          <Users className="w-5 h-5 text-emerald-600" />
                          Quad Bed
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                quad: Math.max(0, (g.quad || 0) - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-bold">
                            {guestCount.quad || 0}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                quad: (g.quad || 0) + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2">
                          <Users className="w-5 h-5 text-emerald-600" />
                          Triple Bed
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                triple: Math.max(0, (g.triple || 0) - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-bold">
                            {guestCount.triple || 0}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                triple: (g.triple || 0) + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2">
                          <Users className="w-5 h-5 text-emerald-600" />
                          Double Bed
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                double: Math.max(0, (g.double || 0) - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-bold">
                            {guestCount.double || 0}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                double: (g.double || 0) + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2">
                          <Users className="w-5 h-5 text-emerald-600" />
                          Single Bed
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                single: Math.max(0, (g.single || 0) - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-bold">
                            {guestCount.single || 0}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                single: (g.single || 0) + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2 text-yellow-700">
                          <Users className="w-5 h-5 text-yellow-500" />
                          Child (no bed)
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                childWithoutBed: Math.max(
                                  0,
                                  g.childWithoutBed - 1,
                                ),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-bold">
                            {guestCount.childWithoutBed}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                childWithoutBed: g.childWithoutBed + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2 text-purple-700">
                          <Users className="w-5 h-5 text-purple-500" />
                          Infants
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                infants: Math.max(0, g.infants - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-bold">
                            {guestCount.infants}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setGuestCount((g) => ({
                                ...g,
                                infants: g.infants + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedRoomType === "private" &&
                  (() => {
                    const capacities = {
                      quint: 5,
                      quad: 4,
                      triple: 3,
                      double: 2,
                      single: 1,
                    };
                    const roomTypes = [
                      "quint",
                      "quad",
                      "triple",
                      "double",
                      "single",
                    ];
                    let totalRoomTravelers = 0;
                    let totalRooms = 0;
                    const roomBreakdown = [];
                    let roomsCost = 0;
                    roomTypes.forEach((type) => {
                      const count = guestCount[type] || 0;
                      const cap = capacities[type];
                      const price = pkg.pricing?.private?.[type] || 0;
                      if (count > 0) {
                        const subtotal = count * price;
                        roomBreakdown.push({
                          type: type.charAt(0).toUpperCase() + type.slice(1),
                          count,
                          cap,
                          price,
                          subtotal,
                        });
                        totalRoomTravelers += count * cap;
                        totalRooms += count;
                        roomsCost += subtotal;
                      }
                    });
                    const childWithoutBed = guestCount.childWithoutBed || 0;
                    const infants = guestCount.infants || 0;
                    const childWithoutBedCost =
                      (pkg.pricing?.childWithoutBed || 0) * childWithoutBed;
                    const infantsCost = (pkg.pricing?.infant || 0) * infants;
                    const totalTravelers =
                      totalRoomTravelers + childWithoutBed + infants;
                    const totalCost =
                      roomsCost + childWithoutBedCost + infantsCost;
                    return (
                      <div className="space-y-4 bg-green-50 rounded-lg p-4">
                        <div className="font-semibold mb-2">Room Breakdown</div>
                        <div className="space-y-2">
                          {roomBreakdown.map((r, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {r.type} Room × {r.count}{" "}
                                <span className="text-gray-500">
                                  ({r.cap} guests/room)
                                </span>
                              </span>
                              <span>
                                {getCurrencySymbol(pkg.currency)}
                                {r.price.toLocaleString()} × {r.count} ={" "}
                                <span className="font-semibold">
                                  {getCurrencySymbol(pkg.currency)}
                                  {r.subtotal.toLocaleString()}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Total Rooms:</span>
                          <span className="font-semibold">{totalRooms}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Child (no bed):</span>
                          <span>
                            {childWithoutBed} ×{" "}
                            {getCurrencySymbol(pkg.currency)}
                            {(
                              pkg.pricing?.childWithoutBed || 0
                            ).toLocaleString()}{" "}
                            ={" "}
                            <span className="font-semibold">
                              {getCurrencySymbol(pkg.currency)}
                              {childWithoutBedCost.toLocaleString()}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Infant:</span>
                          <span>
                            {infants} × {getCurrencySymbol(pkg.currency)}
                            {(pkg.pricing?.infant || 0).toLocaleString()} ={" "}
                            <span className="font-semibold">
                              {getCurrencySymbol(pkg.currency)}
                              {infantsCost.toLocaleString()}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-base mt-2">
                          <span>Total Travelers:</span>
                          <span className="font-semibold">
                            {totalTravelers}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t text-lg">
                          <span className="font-semibold">Total Cost:</span>
                          <span className="text-2xl font-bold text-emerald-600">
                            {getCurrencySymbol(pkg.currency)}
                            {totalCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                {pkg.is_group_package !== false &&
                  selectedRoomType === "sharing" && (
                    <div className="space-y-4 bg-green-50 rounded-lg p-4 mt-4">
                      <div className="font-semibold mb-2">
                        Booking Breakdown
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Adult:</span>
                        <span>
                          {guestCount.sharing} ×{" "}
                          {getCurrencySymbol(pkg.currency)}
                          {pkg.pricing?.sharing?.pricePerTraveler.toLocaleString()}{" "}
                          ={" "}
                          <span className="font-semibold">
                            {getCurrencySymbol(pkg.currency)}
                            {(
                              guestCount.sharing *
                              pkg.pricing?.sharing?.pricePerTraveler
                            ).toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Child (no bed):</span>
                        <span>
                          {guestCount.childWithoutBed} ×{" "}
                          {getCurrencySymbol(pkg.currency)}
                          {pkg.pricing?.childWithoutBed.toLocaleString()} ={" "}
                          <span className="font-semibold">
                            {getCurrencySymbol(pkg.currency)}
                            {(
                              guestCount.childWithoutBed *
                              pkg.pricing?.childWithoutBed
                            ).toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Infant:</span>
                        <span>
                          {guestCount.infants} ×{" "}
                          {getCurrencySymbol(pkg.currency)}
                          {pkg.pricing?.infant.toLocaleString()} ={" "}
                          <span className="font-semibold">
                            {getCurrencySymbol(pkg.currency)}
                            {(
                              guestCount.infants * pkg.pricing?.infant
                            ).toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between text-base mt-2">
                        <span>Total Travelers:</span>
                        <span className="font-semibold">
                          {guestCount.sharing +
                            guestCount.childWithoutBed +
                            guestCount.infants}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t text-lg">
                        <span className="font-semibold">Total Cost:</span>
                        <span className="text-2xl font-bold text-emerald-600">
                          {getCurrencySymbol(pkg.currency)}
                          {(
                            guestCount.sharing *
                              pkg.pricing?.sharing?.pricePerTraveler +
                            guestCount.childWithoutBed *
                              pkg.pricing?.childWithoutBed +
                            guestCount.infants * pkg.pricing?.infant
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                {renderSelectedFlightSidebar()}
                {(() => {
                  // Calculate room/booking cost
                  let roomCost = 0;
                  if (selectedRoomType === "private") {
                    const capacities = {
                      quint: 5,
                      quad: 4,
                      triple: 3,
                      double: 2,
                      single: 1,
                    };
                    const roomTypes = [
                      "quint",
                      "quad",
                      "triple",
                      "double",
                      "single",
                    ];
                    let roomsCost = 0;
                    roomTypes.forEach((type) => {
                      const count = guestCount[type] || 0;
                      const price = pkg.pricing?.private?.[type] || 0;
                      if (count > 0) {
                        roomsCost += count * price;
                      }
                    });
                    const childWithoutBedCost =
                      (pkg.pricing?.childWithoutBed || 0) *
                      (guestCount.childWithoutBed || 0);
                    const infantsCost =
                      (pkg.pricing?.infant || 0) * (guestCount.infants || 0);
                    roomCost = roomsCost + childWithoutBedCost + infantsCost;
                  } else if (
                    selectedRoomType === "sharing" &&
                    pkg.is_group_package !== false
                  ) {
                    roomCost =
                      (guestCount.sharing || 1) *
                        (pkg.pricing?.sharing?.pricePerTraveler || 0) +
                      (guestCount.childWithoutBed || 0) *
                        (pkg.pricing?.childWithoutBed || 0) +
                      (guestCount.infants || 0) * (pkg.pricing?.infant || 0);
                  }

                  // Get flight cost
                  const flightCost = selectedFlight
                    ? selectedFlight.details.adults *
                        selectedFlight.details.adultPrice +
                      selectedFlight.details.children *
                        selectedFlight.details.childPrice +
                      selectedFlight.details.infants *
                        selectedFlight.details.infantPrice
                    : 0;

                  // Total package cost
                  const totalPackageCost = roomCost + flightCost;

                  return selectedFlight || roomCost > 0 ? (
                    <div className="flex justify-between items-center my-2 p-3 rounded-lg bg-emerald-100 border border-emerald-200">
                      <span className="font-semibold text-emerald-900">
                        Total Package Cost:
                      </span>
                      <span className="text-xl font-bold text-emerald-700">
                        ₹{totalPackageCost.toLocaleString()}
                      </span>
                    </div>
                  ) : null;
                })()}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-lg py-6 shadow-lg">
                    Book This Package Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Request Custom Quote
                  </Button>
                </div>
                {/* Need Assistance Section */}
                <hr className="my-6" />
                <div className="space-y-4">
                  <div className="font-semibold text-lg">Need Assistance?</div>
                  <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold">Call Us</div>
                      <div className="text-gray-700">+91-78920-09800</div>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 008 0zm-8 0V8a4 4 0 018 0v4"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold">Email Us</div>
                      <div className="text-gray-700">
                        support@marhabahaji.com
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackageDetailDynamic;
