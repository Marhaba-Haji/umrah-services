import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  Plane,
  Landmark,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertFromINR } from "@/lib/utils";

const maktabCategories = ["A", "B", "C", "D"];
const durations = [
  { value: "short", label: "Short (<15 days)" },
  { value: "medium", label: "Medium (15-20 days)" },
  { value: "long", label: "Long (>20 days)" },
];
const types = ["Shifting", "Non-Shifting"];
const classes = ["Budget", "Deluxe", "Premium", "Luxury"];

const defaultPriceRange = [100000, 500000];

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
  itinerary?: { title: string; description: string }[];
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
  activities?: string[];
  cities_covered?: string[];
  flight_included?: boolean;
}

const HajjPackages = () => {
  const [hajjPackages, setHajjPackages] = useState<HajjPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currency } = useCurrency();
  const [filters, setFilters] = useState({
    maktab: [],
    duration: "",
    type: [],
    price: defaultPriceRange,
    class: [],
  });
  const [filteredPackages, setFilteredPackages] = useState<HajjPackage[]>([]);

  useEffect(() => {
    const fetchHajjPackages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("hajj_packages")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      let pkgs: HajjPackage[] = [];
      if (!error && data && data.length > 0) {
        pkgs = data;
      } else {
        pkgs = [
          {
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
          },
          {
            id: 2,
            name: "Economy Hajj Package",
            price: 220000,
            duration: "18 Days / 17 Nights",
            departure_city: "Mumbai",
            departure_date: "2025-06-05",
            season_category: "Hajj 2025",
            inclusions: [
              "3 Star Hotel",
              "Group Flight",
              "Breakfast Included",
              "Basic Transport",
            ],
            featured_image: "/public/placeholder.svg",
            package_category: "Economy",
            maktab: "C",
            type: "Non-Shifting",
            class: "Budget",
          },
          {
            id: 3,
            name: "Family Hajj Package",
            price: 280000,
            duration: "21 Days / 20 Nights",
            departure_city: "Hyderabad",
            departure_date: "2025-06-10",
            season_category: "Hajj 2025",
            inclusions: [
              "4 Star Hotel",
              "Family Suite",
              "Meals Included",
              "Private Transport",
            ],
            featured_image: "/public/umrah-package-banner.jpg",
            package_category: "Family",
            maktab: "B",
            type: "Shifting",
            class: "Deluxe",
          },
        ];
      }
      setHajjPackages(pkgs);
      setFilteredPackages(pkgs);
      setIsLoading(false);
    };
    fetchHajjPackages();
  }, []);

  // Filtering logic
  useEffect(() => {
    let pkgs = [...hajjPackages];
    if (filters.maktab.length > 0) {
      pkgs = pkgs.filter((pkg) => filters.maktab.includes(pkg.maktab));
    }
    if (filters.duration) {
      pkgs = pkgs.filter((pkg) => {
        if (filters.duration === "short") return getDays(pkg.duration) < 15;
        if (filters.duration === "medium")
          return getDays(pkg.duration) >= 15 && getDays(pkg.duration) <= 20;
        if (filters.duration === "long") return getDays(pkg.duration) > 20;
        return true;
      });
    }
    if (filters.type.length > 0) {
      pkgs = pkgs.filter((pkg) => filters.type.includes(pkg.type));
    }
    if (filters.class.length > 0) {
      pkgs = pkgs.filter((pkg) => filters.class.includes(pkg.class));
    }
    if (filters.price) {
      pkgs = pkgs.filter(
        (pkg) => pkg.price >= filters.price[0] && pkg.price <= filters.price[1],
      );
    }
    setFilteredPackages(pkgs);
  }, [filters, hajjPackages]);

  function getDays(durationStr: string) {
    // expects format like '20 Days / 19 Nights'
    const match = durationStr.match(/(\d+)\s*Days?/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  // Helper to get currency symbol
  const getCurrencySymbol = (currency: string | undefined) => {
    switch ((currency || "INR").toUpperCase()) {
      case "INR":
        return "\u20b9";
      case "USD":
        return "$";
      case "SAR":
        return "\ufdfc";
      default:
        return currency ? currency.toUpperCase() + " " : "\u20b9";
    }
  };

  // Filter bar component
  const FilterBar = () => (
    <Card className="sticky top-4 h-fit mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          Filter Packages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Maktab Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maktab Category
          </label>
          <div className="flex flex-wrap gap-2">
            {maktabCategories.map((cat) => (
              <div key={cat} className="flex items-center space-x-2">
                <Checkbox
                  id={`maktab-${cat}`}
                  checked={filters.maktab.includes(cat)}
                  onCheckedChange={(checked) => {
                    setFilters((f) => ({
                      ...f,
                      maktab: checked
                        ? [...f.maktab, cat]
                        : f.maktab.filter((c: string) => c !== cat),
                    }));
                  }}
                  className="mr-2"
                />
                <Label htmlFor={`maktab-${cat}`}>{cat}</Label>
              </div>
            ))}
          </div>
        </div>
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <RadioGroup
            value={filters.duration}
            onValueChange={(val) =>
              setFilters((f) => ({ ...f, duration: val }))
            }
          >
            {durations.map((d) => (
              <div key={d.value} className="flex items-center space-x-2">
                <RadioGroupItem value={d.value} id={d.value} />
                <Label htmlFor={d.value}>{d.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <div key={t} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${t}`}
                  checked={filters.type.includes(t)}
                  onCheckedChange={(checked) => {
                    setFilters((f) => ({
                      ...f,
                      type: checked
                        ? [...f.type, t]
                        : f.type.filter((c: string) => c !== t),
                    }));
                  }}
                  className="mr-2"
                />
                <Label htmlFor={`type-${t}`}>{t}</Label>
              </div>
            ))}
          </div>
        </div>
        {/* Price Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (INR)
          </label>
          <Slider
            value={filters.price}
            onValueChange={(val) => setFilters((f) => ({ ...f, price: val }))}
            min={100000}
            max={500000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>₹{filters.price[0].toLocaleString()}</span>
            <span>₹{filters.price[1].toLocaleString()}</span>
          </div>
        </div>
        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class
          </label>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <div key={c} className="flex items-center space-x-2">
                <Checkbox
                  id={`class-${c}`}
                  checked={filters.class.includes(c)}
                  onCheckedChange={(checked) => {
                    setFilters((f) => ({
                      ...f,
                      class: checked
                        ? [...f.class, c]
                        : f.class.filter((cl: string) => cl !== c),
                    }));
                  }}
                  className="mr-2"
                />
                <Label htmlFor={`class-${c}`}>{c}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      {/* Hero Section */}
      <section className="py-6 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="hidden md:block" />
            <div className="flex flex-col items-end text-right">
              <Badge className="bg-white/20 text-white border-white/30 mb-2">
                <Landmark className="w-4 h-4 mr-1" />
                Hajj Packages
              </Badge>
              <p className="text-base md:text-lg text-emerald-100 max-w-xl">
                Explore our curated Hajj packages for a seamless pilgrimage
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 max-w-7xl mx-auto items-start">
            {/* Left Panel - Filters */}
            <div className="w-80 flex-shrink-0 self-start">
              <FilterBar />
            </div>
            {/* Right Panel - Packages */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-gray-500 italic">
                All prices are in INR (₹) unless otherwise specified.
              </div>
              {isLoading ? (
                <div>Loading packages...</div>
              ) : filteredPackages.length === 0 ? (
                <div>No Hajj packages found</div>
              ) : (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredPackages.map((pkg) => {
                    const inclusionsToShow = (pkg.inclusions || []).slice(0, 4);
                    const moreInclusions =
                      (pkg.inclusions || []).length - inclusionsToShow.length;
                    const { value, symbol } = convertFromINR(
                      pkg.price,
                      currency,
                    );
                    return (
                      <div
                        key={pkg.id}
                        className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white/90 border border-emerald-100 hover:shadow-emerald-200 transition-all duration-300 flex flex-col min-h-[540px]"
                        tabIndex={0}
                        aria-label={`View details for ${pkg.name}`}
                      >
                        {/* Image with overlays */}
                        <div className="relative h-56 md:h-64 w-full overflow-hidden aspect-[16/9] rounded-3xl">
                          <img
                            src={
                              pkg.featured_image || "/public/placeholder.svg"
                            }
                            alt={pkg.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-3xl"
                            loading="lazy"
                            decoding="async"
                          />
                          {/* Departure city badge on image, bottom right */}
                          {pkg.departure_city && (
                            <div className="absolute bottom-4 right-4 z-20">
                              <Badge className="bg-blue-600/90 text-white shadow-lg px-3 py-1 text-xs font-bold tracking-wide backdrop-blur border border-white/20 flex items-center">
                                <Plane className="w-4 h-4 mr-1 text-white inline-block" />
                                {pkg.departure_city}
                              </Badge>
                            </div>
                          )}
                          {/* Glassy overlay for badges */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="flex justify-between p-4">
                              <div className="flex flex-col gap-2">
                                <Badge className="backdrop-blur bg-emerald-600/80 text-white shadow-lg px-3 py-1 text-xs font-bold tracking-wide">
                                  Hajj
                                </Badge>
                              </div>
                              <div className="flex flex-col gap-2 items-end">
                                {pkg.package_category && (
                                  <Badge className="backdrop-blur bg-amber-100/80 text-amber-800 border-amber-200 shadow px-3 py-1 text-xs font-bold tracking-wide">
                                    {pkg.package_category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-end p-4">
                              <Badge className="backdrop-blur bg-white/80 text-emerald-700 border-emerald-200 flex items-center gap-1 shadow px-3 py-1 text-xs font-semibold">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                {pkg.duration}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {/* Card Content */}
                        <div className="flex flex-col flex-1 p-6 pb-4">
                          <div className="mb-2 flex flex-wrap gap-2 items-center">
                            {pkg.departure_date && (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(
                                  new Date(pkg.departure_date),
                                  "dd MMM yyyy",
                                )}
                              </Badge>
                            )}
                            {pkg.season_category && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                {pkg.season_category}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl font-bold text-emerald-900 mb-2">
                            {pkg.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-semibold text-emerald-700">
                              {symbol}
                              {value.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              per person
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {inclusionsToShow.map(
                              (inc: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  className="bg-emerald-50 text-emerald-700 border-emerald-100"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1 text-emerald-400" />
                                  {inc}
                                </Badge>
                              ),
                            )}
                            {moreInclusions > 0 && (
                              <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                                +{moreInclusions} more
                              </Badge>
                            )}
                          </div>
                          <div className="mt-auto pt-4">
                            <Link to={`/hajj-packages/${pkg.id}`}>
                              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HajjPackages;
