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
  Filter,
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
import {
  ttsFlightSearch,
  TTSFlightSearchParams,
} from "@/services/ttsFlightService";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "../components/ui/drawer";
import FlightSearch from "../components/FlightSearch";
import type { FlightOffer } from "../components/FlightSearch";

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

// Add this type above fetchAirportSuggestions
interface AmadeusAirportSuggestItem {
  iataCode: string;
  address?: {
    cityName?: string;
    countryName?: string;
  };
  name: string;
}

// --- Add FlightCard component at the top (after imports) ---
const FlightCard = ({ offer, onSelect, isBest, isCheapest, isFastest }) => {
  const onwardSegments = offer.itineraries?.[0]?.segments || [];
  const returnSegments = offer.itineraries?.[1]?.segments || [];
  const airlineName =
    offer.dictionaries?.carriers?.[onwardSegments[0]?.carrierCode] ||
    onwardSegments[0]?.carrierCode ||
    "";
  const price = offer.price?.total || "-";
  const currency = offer.price?.currency || "INR";
  const getCurrencySymbol = (currency) => {
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
  const formatTime = (t) => (t ? t.slice(11, 16) : "-");
  const formatAirport = (seg) =>
    seg?.departure?.iataCode || seg?.arrival?.iataCode || "-";
  const formatDuration = (d) => {
    if (!d || typeof d !== "string") return "-";
    if (typeof d === "number") {
      // If duration is in minutes
      const h = Math.floor(d / 60);
      const m = d % 60;
      return `${h ? h + "h " : ""}${m ? m + "m" : ""}`.trim();
    }
    const match = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const h = match && match[1] ? parseInt(match[1]) : 0;
    const m = match && match[2] ? parseInt(match[2]) : 0;
    return `${h ? h + "h " : ""}${m ? m + "m" : ""}`.trim();
  };
  const getLayoverDuration = (prevArrival, nextDeparture) => {
    if (!prevArrival || !nextDeparture) return null;
    const prev = new Date(prevArrival);
    const next = new Date(nextDeparture);
    const diff = (next - prev) / 60000; // minutes
    if (diff <= 0 || isNaN(diff)) return null;
    const h = Math.floor(diff / 60);
    const m = Math.round(diff % 60);
    return `${h ? h + "h " : ""}${m ? m + "m" : ""}`.trim();
  };

  // Helper to render a journey (onward or return)
  const renderJourneySegments = (segments, label) => (
    <div className="mb-2">
      <div className="text-xs font-semibold text-emerald-700 mb-1">{label}</div>
      <div className="flex flex-col gap-0.5">
        {segments.map((seg, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className="flex items-center justify-center text-xs text-gray-500 my-1">
                <span className="px-2 py-0.5 bg-emerald-50 rounded">
                  Layover at {segments[i - 1]?.arrival?.iataCode || "-"}
                  {(() => {
                    const layover = getLayoverDuration(
                      segments[i - 1]?.arrival?.at,
                      seg?.departure?.at,
                    );
                    return layover ? ` — ${layover}` : "";
                  })()}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border rounded-lg px-2 py-1 bg-gray-50 mb-1">
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="font-bold text-base text-emerald-900">
                  {formatTime(seg?.departure?.at)}
                </span>
                <span className="text-xs text-gray-500">
                  {seg?.departure?.iataCode}
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-xs text-gray-500">
                  {formatDuration(seg?.duration)}
                </span>
                <span className="w-12 h-0.5 bg-emerald-100 my-1" />
                <span className="text-xs text-gray-400">
                  {seg?.carrierCode} {seg?.number}
                </span>
              </div>
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="font-bold text-base text-emerald-900">
                  {formatTime(seg?.arrival?.at)}
                </span>
                <span className="text-xs text-gray-500">
                  {seg?.arrival?.iataCode}
                </span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-xl shadow-md bg-white p-4 mb-4 border border-emerald-100 overflow-hidden w-full">
      {/* Airline and Favorite */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={`https://content.airhex.com/content/logos/airlines_${onwardSegments[0]?.carrierCode?.toLowerCase()}_350_100_r.png?background=fff&pad=auto`}
            alt={airlineName}
            className="h-6 w-6 object-contain rounded bg-white border"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
          <span className="font-semibold text-emerald-900">{airlineName}</span>
        </div>
      </div>
      {/* Outbound Journey Segments */}
      {onwardSegments.length > 0 &&
        renderJourneySegments(onwardSegments, "Onward Journey")}
      {/* Return Journey Segments */}
      {returnSegments.length > 0 &&
        renderJourneySegments(returnSegments, "Return Journey")}
      {/* Price and Select */}
      <div className="flex items-center justify-between border-t pt-3 mt-2">
        <div>
          <div className="text-xs text-gray-500">1 deal from</div>
          <div className="font-bold text-xl text-emerald-900">
            {getCurrencySymbol(currency)}
            {parseInt(price).toLocaleString()}
          </div>
        </div>
        <button
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center gap-1"
          onClick={onSelect}
        >
          Select <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
};

interface FlightSearchResults {
  data?: FlightOffer[];
  [key: string]: unknown;
}

interface UmrahPackage {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  duration?: string;
  rating?: number;
  reviews?: number;
  package_type?: string;
  package_category?: string;
  cities_covered?: string[];
  currency?: string;
  price?: number;
  meal_plan?: string;
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: Itinerary[] | string | null;
  activities?: Activity[] | string | null;
  makkah_hotel?: HotelDetails["makkah"] | string | null;
  madinah_hotel?: HotelDetails["madinah"] | string | null;
  flight_included?: boolean;
  flight_details?: FlightDetails | string | null;
  is_group_package?: boolean;
  pricing?: Pricing | string | null;
  [key: string]: unknown;
}

interface Itinerary {
  title: string;
  description: string;
}

interface Activity {
  id: string;
  name: string;
  description?: string;
  featured_image?: string;
  city?: string;
  duration?: string;
}

interface HotelDetails {
  makkah?: {
    id?: string;
    name?: string;
    featured_image?: string;
    images?: string[];
    rating?: number;
    distance_from_haram?: number;
    distance?: number;
    amenities?: string[];
    [key: string]: unknown;
  };
  madinah?: {
    id?: string;
    name?: string;
    featured_image?: string;
    images?: string[];
    rating?: number;
    distance_from_masjid_e_nabawi?: number;
    distance?: number;
    amenities?: string[];
    [key: string]: unknown;
  };
}

interface FlightDetails {
  airline?: string;
  flightNumber?: string;
  departure?: { iataCode: string; at: string };
  arrival?: { iataCode: string; at: string };
  cabin?: string;
  duration?: string;
  [key: string]: unknown;
}

interface Pricing {
  sharing?: {
    pricePerTraveler?: number;
  };
  private?: {
    quint?: number;
    quad?: number;
    triple?: number;
    double?: number;
    single?: number;
  };
  childWithoutBed?: number;
  infant?: number;
  [key: string]: unknown;
}

interface SelectedFlight {
  flight: FlightDetails;
  searchParams: {
    adults: number;
    children?: number;
    infants?: number;
    [key: string]: unknown;
  };
  details?: {
    adults: number;
    adultPrice: number;
    children: number;
    childPrice: number;
    infants: number;
    infantPrice: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// 1. Add runtime type guards and parsing for fields that may be stringified JSON
function parseJsonField<T>(field: unknown, fallback: T): T {
  if (Array.isArray(fallback) && Array.isArray(field)) return field as T;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(fallback) && Array.isArray(parsed)) return parsed as T;
      if (typeof fallback === "object" && typeof parsed === "object")
        return parsed as T;
      return fallback;
    } catch {
      return fallback;
    }
  }
  if (typeof field === "object" && field !== null) return field as T;
  return fallback;
}

const PackageDetailDynamic = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<UmrahPackage | null>(null);
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
  const [activityDetails, setActivityDetails] = useState<Activity[]>([]);
  const [hotelDetails, setHotelDetails] = useState<HotelDetails>({});
  const [flightModalOpen, setFlightModalOpen] = useState(false);
  const [showFlightSearch, setShowFlightSearch] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(
    null,
  );
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  // Add state for sorting
  const [sortBy, setSortBy] = useState("best");
  const [flightFilters, setFlightFilters] = useState({
    departureTimes: [], // e.g. ["early", "morning", ...]
    airlines: [], // e.g. ["EK", "SV"]
    stops: [], // e.g. [0, 1, 2]
    price: [0, 100000], // min, max
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [flightSearchResults, setFlightSearchResults] =
    useState<FlightSearchResults | null>(null);

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
          setPkg(data2 as UmrahPackage); // type assertion for Supabase result
          setError(null);
        }
      } else {
        setPkg(data as UmrahPackage); // type assertion for Supabase result
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
    const newHotelDetails: HotelDetails = {};
    // Parse hotels if stringified
    const makkahHotel = parseJsonField<HotelDetails["makkah"]>(
      pkg.makkah_hotel,
      undefined,
    );
    const madinahHotel = parseJsonField<HotelDetails["madinah"]>(
      pkg.madinah_hotel,
      undefined,
    );
    if (makkahHotel) newHotelDetails.makkah = makkahHotel;
    if (madinahHotel) newHotelDetails.madinah = madinahHotel;
    setHotelDetails(newHotelDetails);
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    // Parse activities if stringified
    const activities = parseJsonField<Activity[]>(pkg.activities, []);
    if (
      activities.length > 0 &&
      typeof activities[0] === "object" &&
      "name" in activities[0]
    ) {
      setActivityDetails(activities);
      return;
    }
    // Otherwise, fetch activity details by IDs
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("id, name, description, featured_image")
        .in("id", activities);
      if (!error && data) setActivityDetails(data as Activity[]);
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
    try {
      const { data, error } = await supabase.functions.invoke(
        "amadeus-airport-suggest",
        {
          body: { keyword: input, subType: "AIRPORT" },
        },
      );
      if (error) throw error;
      setSuggestions(
        (data.data || data || []).map((item: AmadeusAirportSuggestItem) => ({
          code: item.iataCode,
          city: item.address?.cityName,
          country: item.address?.countryName,
          name: item.name,
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
    if (typeof duration !== "string") return "";
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
  const getPriceByType = (
    offer: {
      travelerPricings?: {
        travelerType: string;
        price: { currency: string; total: string };
      }[];
    },
    type: string,
  ) => {
    const pricing = offer.travelerPricings?.find(
      (p) => p.travelerType === type,
    );
    return pricing
      ? pricing.price.currency +
          " " +
          parseFloat(pricing.price.total).toLocaleString()
      : "N/A";
  };

  // Helper function to get baggage info
  const getBaggageInfo = (offer: {
    itineraries?: {
      segments: {
        id: string;
        departure: { iataCode: string };
        arrival: { iataCode: string };
      }[];
    }[];
    travelerPricings?: {
      segmentId: string;
      includedCheckedBags?: { quantity?: number };
    }[];
  }) => {
    const itineraries = offer.itineraries || [];
    if (
      !Array.isArray(itineraries) ||
      !itineraries[0] ||
      !Array.isArray(itineraries[0].segments)
    ) {
      return [];
    }
    const segments = itineraries[0].segments;
    const baggageInfo = segments.map((segment) => {
      const fareDetails = offer.travelerPricings?.find(
        (f) => f.segmentId === segment.id,
      );
      return {
        segment: `${segment.departure.iataCode} → ${segment.arrival.iataCode}`,
        baggage: fareDetails?.includedCheckedBags?.quantity || 0,
      };
    });
    return baggageInfo;
  };

  // Helper function to get meals info (if available)
  const getMealsInfo = (offer: {
    itineraries?: {
      segments: {
        departure: { iataCode: string };
        arrival: { iataCode: string };
      }[];
    }[];
  }) => {
    return (
      offer.itineraries?.[0]?.segments?.map((segment) => ({
        segment: `${segment.departure.iataCode} → ${segment.arrival.iataCode}`,
        meals: "Meal information not available",
      })) || []
    );
  };

  // Helper to get total duration in minutes
  const getMinutes = (durationStr) => {
    if (!durationStr || typeof durationStr !== "string") return 0;
    // Format: PT13H40M
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = match && match[1] ? parseInt(match[1]) : 0;
    const mins = match && match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + mins;
  };

  // Compute available airlines from results
  const availableAirlines = useMemo(() => {
    if (!flightSearchResults?.data || !Array.isArray(flightSearchResults.data))
      return [];
    const map = new Map();
    flightSearchResults.data.forEach((offer) => {
      const code = offer.itineraries?.[0]?.segments?.[0]?.carrierCode;
      const name = offer.dictionaries?.carriers?.[code] || code;
      if (code && !map.has(code)) {
        map.set(code, {
          code,
          name,
          logo: `https://content.airhex.com/content/logos/airlines_${code?.toLowerCase()}_350_100_r.png?background=fff&pad=auto`,
        });
      }
    });
    return Array.from(map.values());
  }, [flightSearchResults]);

  // Compute sorted results
  const sortedResults = useMemo(() => {
    if (!flightSearchResults?.data || !Array.isArray(flightSearchResults.data))
      return [];
    let data = [...flightSearchResults.data];
    // --- FILTERING ---
    // Departure time
    if (flightFilters.departureTimes.length > 0) {
      data = data.filter((offer) => {
        const dep = offer.itineraries?.[0]?.segments?.[0]?.departure?.at;
        if (!dep) return false;
        const hour = new Date(dep).getHours();
        return flightFilters.departureTimes.some((group) => {
          if (group === "early") return hour >= 0 && hour < 6;
          if (group === "morning") return hour >= 6 && hour < 12;
          if (group === "afternoon") return hour >= 12 && hour < 18;
          if (group === "evening") return hour >= 18 && hour < 24;
          return false;
        });
      });
    }
    // Airlines
    if (flightFilters.airlines.length > 0) {
      data = data.filter((offer) => {
        const code = offer.itineraries?.[0]?.segments?.[0]?.carrierCode;
        return flightFilters.airlines.includes(code);
      });
    }
    // Stops
    if (flightFilters.stops.length > 0) {
      data = data.filter((offer) => {
        const stops = (offer.itineraries?.[0]?.segments?.length ?? 1) - 1;
        return flightFilters.stops.includes(stops);
      });
    }
    // Price
    if (flightFilters.price) {
      data = data.filter((offer) => {
        const price = parseInt(offer.price?.total || "0");
        return (
          price >= flightFilters.price[0] && price <= flightFilters.price[1]
        );
      });
    }
    // --- SORTING (existing logic) ---
    if (data.length === 0) return data;
    if (sortBy === "cheapest") {
      data.sort(
        (a, b) =>
          convertToINR(
            parseFloat(a?.price?.total ?? 0),
            a?.price?.currency ?? "INR",
          ) -
          convertToINR(
            parseFloat(b?.price?.total ?? 0),
            b?.price?.currency ?? "INR",
          ),
      );
    } else if (sortBy === "fastest") {
      data.sort(
        (a, b) =>
          getMinutes(a?.itineraries?.[0]?.duration ?? "PT0M") -
          getMinutes(b?.itineraries?.[0]?.duration ?? "PT0M"),
      );
    } else {
      // best
      // Normalize price, duration, stops
      const prices = (data ?? []).map((f) =>
        convertToINR(
          parseFloat(f?.price?.total ?? 0),
          f?.price?.currency ?? "INR",
        ),
      );
      const durations = (data ?? []).map((f) =>
        getMinutes(f?.itineraries?.[0]?.duration ?? "PT0M"),
      );
      const stops = (data ?? []).map(
        (f) => (f?.itineraries?.[0]?.segments?.length ?? 1) - 1,
      );
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
      data.sort((a, b) => (a._score ?? 0) - (b._score ?? 0));
    }
    return data;
  }, [flightSearchResults, sortBy, flightFilters]);

  // Add these useMemo hooks after sortedResults:
  const cheapestResult = useMemo(() => {
    if (!flightSearchResults?.data || !Array.isArray(flightSearchResults.data))
      return null;
    const filtered = sortedResults;
    if (!filtered.length) return null;
    return [...filtered].sort(
      (a, b) =>
        parseInt(a.price?.total || "0") - parseInt(b.price?.total || "0"),
    )[0];
  }, [flightSearchResults, sortedResults]);

  const fastestResult = useMemo(() => {
    if (!flightSearchResults?.data || !Array.isArray(flightSearchResults.data))
      return null;
    const filtered = sortedResults;
    if (!filtered.length) return null;
    return [...filtered].sort(
      (a, b) =>
        getMinutes(a.itineraries?.[0]?.duration) -
        getMinutes(b.itineraries?.[0]?.duration),
    )[0];
  }, [flightSearchResults, sortedResults]);

  const bestResult = useMemo(() => {
    if (!flightSearchResults?.data || !Array.isArray(flightSearchResults.data))
      return null;
    const filtered = sortedResults;
    if (!filtered.length) return null;
    // Use the same scoring as in the 'best' sort
    const data = [...filtered];
    const prices = data.map((f) =>
      convertToINR(
        parseFloat(f?.price?.total ?? 0),
        f?.price?.currency ?? "INR",
      ),
    );
    const durations = data.map((f) =>
      getMinutes(f?.itineraries?.[0]?.duration ?? "PT0M"),
    );
    const stops = data.map(
      (f) => (f?.itineraries?.[0]?.segments?.length ?? 1) - 1,
    );
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
    data.sort((a, b) => (a._score ?? 0) - (b._score ?? 0));
    return data[0];
  }, [flightSearchResults, sortedResults]);

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
    const { flight, searchParams, details } = selectedFlight;
    const total =
      details.adults * details.adultPrice +
      details.children * details.childPrice +
      details.infants * details.infantPrice;
    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
        {/* Onward Flight */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={`https://content.airhex.com/content/logos/airlines_${flight.flightNumber.split(" ")[0].toLowerCase()}_350_100_r.png?background=fff&pad=auto`}
            alt={flight.airline}
            className="w-10 h-7 object-contain rounded bg-white border"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
          <div className="font-semibold text-base">
            {flight.airline}{" "}
            <span className="text-xs text-gray-500">{flight.flightNumber}</span>
          </div>
        </div>
        <div className="text-xs text-emerald-700 font-semibold mb-1">
          Onward Journey
        </div>
        <div className="text-sm text-gray-700 mb-1">
          {flight.departure.iataCode} → {flight.arrival.iataCode} |{" "}
          {flight.cabin} | {flight.duration}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {flight.departure.at} → {flight.arrival.at}
        </div>
        {/* Return Flight (if present) */}
        {selectedFlight.returnFlight && (
          <>
            <div className="mt-2 flex items-center gap-2 mb-2">
              <img
                src={`https://content.airhex.com/content/logos/airlines_${selectedFlight.returnFlight.flightNumber.split(" ")[0].toLowerCase()}_350_100_r.png?background=fff&pad=auto`}
                alt={selectedFlight.returnFlight.airline}
                className="w-10 h-7 object-contain rounded bg-white border"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
              <div className="font-semibold text-base">
                {selectedFlight.returnFlight.airline}{" "}
                <span className="text-xs text-gray-500">
                  {selectedFlight.returnFlight.flightNumber}
                </span>
              </div>
            </div>
            <div className="text-xs text-emerald-700 font-semibold mb-1">
              Return Journey
            </div>
            <div className="text-sm text-gray-700 mb-1">
              {selectedFlight.returnFlight.departure.iataCode} →{" "}
              {selectedFlight.returnFlight.arrival.iataCode} |{" "}
              {selectedFlight.returnFlight.cabin} |{" "}
              {selectedFlight.returnFlight.duration}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {selectedFlight.returnFlight.departure.at} →{" "}
              {selectedFlight.returnFlight.arrival.at}
            </div>
          </>
        )}
        <div className="flex flex-col gap-1 text-sm mb-2">
          <div>
            Adults: <span className="font-semibold">{details.adults}</span> × ₹
            {details.adultPrice.toLocaleString()}
          </div>
          {details.children > 0 && (
            <div>
              Children:{" "}
              <span className="font-semibold">{details.children}</span> × ₹
              {details.childPrice.toLocaleString()}
            </div>
          )}
          {details.infants > 0 && (
            <div>
              Infants: <span className="font-semibold">{details.infants}</span>{" "}
              × ₹{details.infantPrice.toLocaleString()}
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
            onClick={() => {
              setSelectedFlight(null);
              setShowFlightSearch(false);
            }}
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
                    {pkg.meal_plan && (
                      <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold gap-1 ml-2">
                        <Utensils className="w-4 h-4" />
                        {pkg.meal_plan}
                      </span>
                    )}
                  </div>
                </div>
                {/* Info Cards Row */}
                <div className="mb-6 animate-fade-in-up">
                  {/* Flight Info Card - now full width */}
                  <div className="bg-blue-50 rounded-xl shadow p-6 border border-blue-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-blue-500" />
                      <span className="font-bold text-blue-900">
                        Flight Info
                      </span>
                    </div>
                    {/* Only allow add/edit flight if NOT a group package */}
                    {pkg.is_group_package === true ? (
                      <div className="w-full">
                        <div className="text-blue-900 font-medium mb-2">
                          <span className="font-bold">Flight:</span>{" "}
                          {pkg.flight_details?.airline_name ||
                            "Pre-determined group flight"}{" "}
                          <br />
                          {pkg.flight_details?.departure_from_airport &&
                            pkg.flight_details?.arrival_at_airport && (
                              <>
                                {pkg.flight_details.departure_from_airport} →{" "}
                                {pkg.flight_details.arrival_at_airport} <br />
                              </>
                            )}
                          {pkg.flight_details?.departure_date &&
                            pkg.flight_details?.arrival_date && (
                              <>
                                {new Date(
                                  pkg.flight_details.departure_date,
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  pkg.flight_details.arrival_date,
                                ).toLocaleDateString()}{" "}
                                <br />
                              </>
                            )}
                          <span className="text-xs text-gray-500">
                            (Group package flights cannot be modified or
                            cancelled)
                          </span>
                        </div>
                      </div>
                    ) : // --- Custom package logic ---
                    selectedFlight ? (
                      <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <div className="text-blue-900 font-medium mb-2">
                          <span className="font-bold">Selected Flight:</span>{" "}
                          {selectedFlight.flight.airline}{" "}
                          {selectedFlight.flight.flightNumber} <br />
                          {selectedFlight.flight.departure.iataCode} →{" "}
                          {selectedFlight.flight.arrival.iataCode} <br />
                          {new Date(
                            selectedFlight.flight.departure.at,
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            selectedFlight.flight.arrival.at,
                          ).toLocaleDateString()}{" "}
                          <br />
                          Travelers: {selectedFlight.searchParams.adults}{" "}
                          Adult(s)
                          {selectedFlight.searchParams.children
                            ? `, ${selectedFlight.searchParams.children} Child(ren)`
                            : ""}
                          {selectedFlight.searchParams.infants
                            ? `, ${selectedFlight.searchParams.infants} Infant(s)`
                            : ""}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => setShowFlightSearch(true)}
                          >
                            Edit Flight
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setSelectedFlight(null);
                              setShowFlightSearch(false);
                            }}
                          >
                            Cancel Flight
                          </Button>
                        </div>
                      </div>
                    ) : showFlightSearch ? (
                      <div className="w-full flex items-start gap-2 mt-2">
                        <div className="flex-1">
                          <FlightSearch
                            onFlightSelect={(flight, searchParams) => {
                              setSelectedFlight({ flight, searchParams });
                              setShowFlightSearch(false);
                            }}
                            onResults={setFlightSearchResults}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2 border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => setShowFlightSearch(false)}
                        >
                          Cancel Flight
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded self-start"
                        onClick={() => setShowFlightSearch(true)}
                      >
                        Add Flight
                      </Button>
                    )}
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
                        like a new HajjPackageDetail.tsx file scaffolded with
                        this layout, ready for you to wire up with Hajj
                        data?like a new HajjPackageDetail.tsx file scaffolded
                        with this layout, ready for you to wire up with Hajj
                        data?{" "}
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
