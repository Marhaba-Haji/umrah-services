import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Users, Plane, Landmark, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertFromINR } from "@/lib/utils";

// Add HajjPackage interface and use it in state and handlers
interface HajjPackage {
  id?: string;
  name: string;
  description?: string;
  duration?: string;
  price?: number;
  status?: string;
  category?: string;
  inclusions?: string[];
  exclusions?: string[];
  images?: string[];
  featured_image?: string;
  makkah_hotel?: string;
  madinah_hotel?: string;
  flight_details?: string;
  itinerary?: ItineraryItem[];
  pricing?: Pricing;
  room_type_pricing?: {
    single?: number;
    double?: number;
    triple?: number;
  };
  max_capacity?: number;
  available_spots?: number;
  departure_date?: string;
  return_date?: string;
  is_group_package?: boolean;
  min_participants?: number;
  activities?: Activity[];
  cities_covered?: string[];
  flight_included?: boolean;
}

// Add interfaces for hotel, itinerary, and activity
interface Hotel {
  name: string;
  city: string;
  stars: number;
}
interface ItineraryItem {
  day: number;
  desc: string;
}
interface Activity {
  name: string;
  desc: string;
}

const HajjPackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState<HajjPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) {
        setError("No package ID provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("hajj_packages")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        // Dummy fallback for demo
        setPkg({
          id: 1,
          name: "Premium Hajj Package",
          price: 350000,
          duration: "20 Days / 19 Nights",
          departure_city: "Delhi",
          departure_date: "2025-06-01",
          season_category: "Hajj 2025",
          inclusions: [
            "5 Star Hotel",
            "Direct Flight",
            "All Meals",
            "Guided Ziyarath",
            "VIP Transport",
          ],
          featured_image: "/public/umrah-package-banner.jpg",
          package_category: "Premium",
          maktab: "A",
          type: "Shifting",
          class: "Premium",
          max_capacity: 40,
          available_spots: 12,
          reviews: 120,
          rating: 4.8,
          hotels: [
            { name: "Makkah Grand Hotel", city: "Makkah", stars: 5 },
            { name: "Madinah Royal Inn", city: "Madinah", stars: 4 },
          ],
          itinerary: [
            { day: 1, desc: "Arrival in Makkah, check-in, rest." },
            { day: 2, desc: "Umrah rituals and guided tour." },
          ],
          activities: [
            { name: "Ziyarath Tour", desc: "Visit holy sites in Makkah." },
          ],
        });
        setError(null);
      } else {
        setPkg(data);
        setError(null);
      }
      setLoading(false);
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading package details...
      </div>
    );
  }
  if (error || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        {error || "Package not found."}
      </div>
    );
  }

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

  const maxCap = pkg.max_capacity || 0;
  const availableSpots = Math.min(pkg.available_spots ?? 0, maxCap);
  const isSoldOut = availableSpots === 0;
  const reviews = pkg.reviews || 120;
  const rating = pkg.rating || 4.8;
  const { value: convertedPrice, symbol: convertedSymbol } = convertFromINR(
    pkg.price || 0,
    currency,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-white shadow-lg">
        <div className="relative h-64 md:h-96 w-full overflow-hidden aspect-[16/7]">
          <img
            src={pkg.featured_image || "/public/placeholder.svg"}
            alt={pkg.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <Badge className="bg-emerald-600 text-white shadow font-bold px-3 py-1">
              Hajj Package
            </Badge>
            {pkg.package_category && (
              <Badge className="bg-blue-700 text-white shadow font-bold px-3 py-1">
                {pkg.package_category}
              </Badge>
            )}
            {pkg.season_category && (
              <Badge className="bg-emerald-200 text-emerald-800 font-bold px-3 py-1">
                {pkg.season_category}
              </Badge>
            )}
            {isSoldOut && (
              <Badge className="bg-red-600 text-white shadow font-bold px-3 py-1 animate-pulse">
                Sold Out
              </Badge>
            )}
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <Badge className="bg-white/80 text-emerald-700 border-emerald-200 flex items-center gap-1 shadow px-3 py-1 text-base font-semibold">
              <Clock className="w-5 h-5 text-emerald-500" />
              {pkg.duration}
            </Badge>
          </div>
        </div>
        {/* Title and highlights */}
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              {pkg.name}
            </h1>
            <div className="flex flex-wrap gap-4 items-center text-lg text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-5 h-5 text-emerald-500" />
                {pkg.duration}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400" />
                {rating}{" "}
                <span className="text-gray-500 text-base">
                  ({reviews} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Landmark className="w-5 h-5 text-emerald-500" />
                {pkg.hotels?.map((h: Hotel) => h.city).join(" & ")}
              </span>
            </div>
          </div>
          {/* Price and booking summary */}
          <div className="flex flex-col items-end">
            <div className="text-4xl font-extrabold text-emerald-600">
              {convertedSymbol}
              {convertedPrice.toLocaleString()}
            </div>
            <div className="text-base text-gray-500">per person</div>
            <Button
              size="lg"
              className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-2xl shadow-lg text-lg tracking-wide transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              disabled={isSoldOut}
            >
              {isSoldOut ? "Sold Out" : "Book This Package Now"}
            </Button>
            <div className="mt-2 text-xs text-gray-500">
              Only {availableSpots} spots left!
            </div>
          </div>
        </div>
      </section>
      {/* Main Content with Tabs */}
      <section className="container mx-auto px-2 md:px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white/80 shadow rounded-xl p-1 flex gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Package Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {pkg.inclusions?.map((inc: string, idx: number) => (
                    <li key={idx}>{inc}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="hotels">
            <Card>
              <CardHeader>
                <CardTitle>Hotels</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {pkg.hotels?.map((h: Hotel, idx: number) => (
                    <li key={idx}>
                      {(h as Hotel).name} ({(h as Hotel).city}) -{" "}
                      {(h as Hotel).stars}★
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="itinerary">
            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {pkg.itinerary?.map((item: ItineraryItem, idx: number) => (
                    <li key={idx}>
                      Day {(item as ItineraryItem).day}:{" "}
                      {(item as ItineraryItem).desc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {pkg.activities?.map((a: Activity, idx: number) => (
                    <li key={idx}>
                      {(a as Activity).name}: {(a as Activity).desc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
      <Footer />
    </div>
  );
};

export default HajjPackageDetail;
