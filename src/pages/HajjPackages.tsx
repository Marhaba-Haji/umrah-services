import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HajjPackageCard from "../components/HajjPackageCard";
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
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertFromINR } from "@/lib/utils";

const maktabCategories = ["A", "B", "C", "D"];
const durations = [
  { value: "short", label: "Short (<20 days)" },
  { value: "medium", label: "Medium (20-30 days)" },
  { value: "long", label: "Long (>30 days)" },
];
const types = ["Shifting", "Non-Shifting"];
const classes = ["Budget", "Deluxe", "Premium", "Luxury"];

const defaultPriceRange = [0, 2500000];

interface Prices {
  sharing?: {
    adult?: string;
    [key: string]: string | number | undefined;
  };
  [key: string]:
    | string
    | number
    | undefined
    | { [key: string]: string | number | undefined };
}

interface HajjPackage {
  id?: string;
  name: string;
  description?: string;
  duration?: string;
  duration_category?: string;
  departure_city?: string;
  departure_date?: string;
  season_category?: string;
  prices?: Prices | string;
  status?: string;
  package_category?: string;
  inclusions?: string[];
  exclusions?: string[];
  featured_image?: string;
  makkah_hotel_name?: string;
  makkah_hotel_category?: string;
  makkah_hotel_distance?: number;
  madinah_hotel_name?: string;
  madinah_hotel_category?: string;
  madinah_hotel_distance?: number;
  meal_plan?: string;
  flight_type?: string;
  itinerary?: { title: string; description: string }[];
  max_capacity?: number;
  available_spots?: number;
  is_group_package?: boolean;
  min_participants?: number;
  activities?: string[];
  cities_covered?: string[];
  flight_included?: boolean;
  maktab_category?: string;
  type?: string;
  class?: string;
  terms_and_conditions?: string;
}

const HajjPackages = () => {
  const [hajjPackages, setHajjPackages] = useState<HajjPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currency } = useCurrency();
  const [filters, setFilters] = useState({
    maktab: [],
    duration: [], // ensure empty array by default
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

      if (!error && data && data.length > 0) {
        setHajjPackages(data);
        setFilteredPackages(data);
      }
      setIsLoading(false);
    };
    fetchHajjPackages();
  }, []);

  // Filtering logic
  useEffect(() => {
    let pkgs = [...hajjPackages];
    console.log("All packages:", pkgs);
    console.log("Current filters:", filters);
    if (pkgs.length > 0) console.log("Loaded package:", pkgs[0]);
    console.log("Before maktab filter:", pkgs.length);
    if (filters.maktab.length > 0) {
      pkgs = pkgs.filter((pkg) => filters.maktab.includes(pkg.maktab_category));
    }
    console.log("Before duration filter:", pkgs.length);
    if (filters.duration.length > 0) {
      pkgs = pkgs.filter((pkg) => {
        const days = getDays(pkg.duration);
        console.log("Duration filter:", pkg.name, pkg.duration, days);
        return (
          (filters.duration.includes("short") && days < 20) ||
          (filters.duration.includes("medium") && days >= 20 && days <= 30) ||
          (filters.duration.includes("long") && days > 30)
        );
      });
    }
    console.log("Before type filter:", pkgs.length);
    if (filters.type.length > 0) {
      pkgs = pkgs.filter((pkg) => filters.type.includes(pkg.type));
    }
    console.log("Before class filter:", pkgs.length);
    if (filters.class.length > 0) {
      pkgs = pkgs.filter((pkg) => filters.class.includes(pkg.class));
    }
    console.log("Before price filter:", pkgs.length);
    if (filters.price) {
      pkgs = pkgs.filter((pkg) => {
        let price = 0;
        try {
          const prices =
            typeof pkg.prices === "string"
              ? JSON.parse(pkg.prices)
              : pkg.prices;
          price = parseInt(prices?.sharing?.adult || "0");
        } catch (error) {
          console.error("Error parsing price:", error);
        }
        console.log("Price filter:", pkg.name, price, filters.price);
        return price >= filters.price[0] && price <= filters.price[1];
      });
    }
    console.log("After all filters:", pkgs.length);
    setFilteredPackages(pkgs);
  }, [filters, hajjPackages]);

  function getDays(durationStr: string) {
    const match = durationStr?.match(/(\d+)\s*Days?/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  // Filter bar component
  const FilterBar = () => (
    <Card className="sticky top-4 h-fit mb-8 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
          Filter Packages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Maktab Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🕌 Maktab Category
          </label>
          <div className="grid grid-cols-2 gap-2">
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
                />
                <Label htmlFor={`maktab-${cat}`} className="text-sm">
                  Category {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⏱️ Duration
          </label>
          <div className="grid gap-2">
            {durations.map((d) => (
              <div key={d.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`duration-${d.value}`}
                  checked={filters.duration.includes(d.value)}
                  onCheckedChange={(checked) => {
                    setFilters((f) => ({
                      ...f,
                      duration: checked
                        ? [...f.duration, d.value]
                        : f.duration.filter((v: string) => v !== d.value),
                    }));
                  }}
                />
                <Label htmlFor={`duration-${d.value}`} className="text-sm">
                  {d.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🏨 Hotel Type
          </label>
          <div className="space-y-2">
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
                />
                <Label htmlFor={`type-${t}`} className="text-sm">
                  {t}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            💰 Price Range ({currency})
          </label>
          <div className="px-2">
            <Slider
              value={filters.price}
              onValueChange={(val) => setFilters((f) => ({ ...f, price: val }))}
              min={200000}
              max={800000}
              step={25000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>
                {(() => {
                  const { symbol, value } = convertFromINR(
                    filters.price[0],
                    currency,
                  );
                  return `${symbol}${value.toLocaleString()}`;
                })()}
              </span>
              <span>
                {(() => {
                  const { symbol, value } = convertFromINR(
                    filters.price[1],
                    currency,
                  );
                  return `${symbol}${value.toLocaleString()}`;
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⭐ Package Class
          </label>
          <div className="space-y-2">
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
                />
                <Label htmlFor={`class-${c}`} className="text-sm">
                  {c}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              maktab: [],
              duration: [],
              type: [],
              price: defaultPriceRange,
              class: [],
            });
          }}
          className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />

      {/* Hero Section */}
      <section className="py-4 md:py-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-1 px-3 py-1 text-xs md:text-sm">
            ✨ Sacred Journey to Makkah
          </Badge>
          <h1 className="text-xl md:text-3xl font-bold text-white mb-1 leading-snug md:leading-tight">
            Hajj Packages 2025
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto leading-snug md:leading-snug">
            Embark on the spiritual journey of a lifetime with our carefully
            curated Hajj packages, designed to provide comfort, guidance, and
            peace of mind throughout your pilgrimage.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Left Panel - Filters (Desktop) */}
            <div className="hidden lg:block w-80 flex-shrink-0 self-start">
              <FilterBar />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Show Filters
              </Button>
            </div>

            {/* Right Panel - Packages */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Hajj Packages
                  </h2>
                  <p className="text-sm text-gray-600">
                    {filteredPackages.length} package
                    {filteredPackages.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <div className="text-xs text-gray-500 italic">
                  All prices are in INR (₹) unless otherwise specified.
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">
                    No Hajj packages found
                  </div>
                  <p className="text-gray-400">
                    Try adjusting your filters to see more options
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <HajjPackageCard key={pkg.id} pkg={pkg} />
                  ))}
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
