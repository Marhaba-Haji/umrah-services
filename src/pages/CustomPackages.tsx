import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UmrahPackageFilters from "../components/UmrahPackageFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const CustomPackages = () => {
  const [filters, setFilters] = useState({});
  const [customPackages, setCustomPackages] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchCustomPackages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("umrah_packages")
        .select("*")
        .eq("is_group_package", false)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (!error && data) setCustomPackages(data);
      setIsLoading(false);
    };
    fetchCustomPackages();
  }, []);

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    // Filtering logic can be added here
  };

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
                <Users className="w-4 h-4 mr-1" />
                Custom Packages
              </Badge>
              <p className="text-base md:text-lg text-emerald-100 max-w-xl">
                Create your perfect pilgrimage experience tailored just for you
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content with Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 max-w-7xl mx-auto items-start">
            {/* Left Panel - Filters */}
            <div className="w-80 flex-shrink-0 self-start">
              <UmrahPackageFilters
                onFiltersChange={handleFiltersChange}
                currency={currency}
              />
            </div>
            {/* Right Panel - Packages */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-gray-500 italic">
                All prices are in INR (₹) unless otherwise specified.
              </div>
              {isLoading ? (
                <div>Loading packages...</div>
              ) : customPackages.length === 0 ? (
                <div>No custom packages found</div>
              ) : (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                  {customPackages.map((pkg) => {
                    const maxCap = pkg.max_capacity || 0;
                    const availableSpots = Math.min(
                      pkg.available_spots ?? 0,
                      maxCap,
                    );
                    const minParticipants = Math.min(
                      pkg.min_participants ?? 0,
                      maxCap,
                    );
                    const isSoldOut = availableSpots === 0;
                    const spotsUrgency =
                      availableSpots > 0 && availableSpots <= 5;
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
                          {pkg.flight_details?.departure_from_airport && (
                            <div className="absolute bottom-4 right-4 z-20">
                              <Badge className="bg-blue-600/90 text-white shadow-lg px-3 py-1 text-xs font-bold tracking-wide backdrop-blur border border-white/20 flex items-center">
                                <Plane className="w-4 h-4 mr-1 text-white inline-block" />
                                {pkg.flight_details.departure_from_airport}
                              </Badge>
                            </div>
                          )}
                          {/* Glassy overlay for badges */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="flex justify-between p-4">
                              <div className="flex flex-col gap-2">
                                {pkg.is_group_package === false && (
                                  <Badge className="backdrop-blur bg-emerald-600/80 text-white shadow-lg px-3 py-1 text-xs font-bold tracking-wide">
                                    Custom
                                  </Badge>
                                )}
                                {isSoldOut && (
                                  <Badge className="backdrop-blur bg-red-600/90 text-white shadow-lg px-3 py-1 text-xs font-bold tracking-wide animate-pulse">
                                    Sold Out
                                  </Badge>
                                )}
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
                              {spotsUrgency && !isSoldOut && (
                                <Badge className="backdrop-blur bg-gradient-to-r from-orange-400/80 to-red-400/80 text-white shadow px-3 py-1 text-xs font-bold animate-pulse">
                                  Only {availableSpots} left!
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Card Content */}
                        <div className="flex flex-col flex-1 p-6 pb-4">
                          {/* Departure date and season category badges below image, above title */}
                          {(pkg.departure_date || pkg.season_category) && (
                            <div className="mb-2 flex flex-wrap gap-2 items-center">
                              {pkg.departure_date && (
                                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-3 py-1 rounded-full text-xs shadow">
                                  <Calendar className="w-4 h-4 mr-1 inline-block" />
                                  {format(
                                    new Date(pkg.departure_date),
                                    "dd-MMM-yyyy",
                                  )}
                                </Badge>
                              )}
                              {pkg.season_category && (
                                <Badge className="bg-gradient-to-r from-emerald-200 to-teal-100 text-emerald-800 border-emerald-200 font-semibold px-3 py-1 rounded-full text-xs shadow">
                                  {pkg.season_category}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Users
                              className="w-5 h-5 text-emerald-500"
                              aria-hidden="true"
                            />
                            <h2
                              className="text-2xl font-extrabold text-gray-900 truncate flex-1"
                              title={pkg.name}
                            >
                              {pkg.name}
                            </h2>
                          </div>
                          {/* Hotels in a single row, truncate if too long */}
                          {(pkg.makkah_hotel?.name ||
                            pkg.madinah_hotel?.name) && (
                            <div className="flex gap-2 items-center mb-3 text-sm text-gray-700 w-full overflow-hidden">
                              {pkg.makkah_hotel?.name && (
                                <span
                                  className="flex items-center bg-emerald-50 px-2 py-1 rounded-lg max-w-[48%] truncate"
                                  title={`Makkah Hotel: ${pkg.makkah_hotel.name}`}
                                >
                                  <Landmark className="w-4 h-4 mr-1 text-emerald-500 flex-shrink-0" />
                                  <span className="truncate">
                                    {pkg.makkah_hotel.name}
                                  </span>
                                </span>
                              )}
                              {pkg.madinah_hotel?.name && (
                                <span
                                  className="flex items-center bg-emerald-50 px-2 py-1 rounded-lg max-w-[48%] truncate"
                                  title={`Madinah Hotel: ${pkg.madinah_hotel.name}`}
                                >
                                  <Landmark className="w-4 h-4 mr-1 text-emerald-500 flex-shrink-0" />
                                  <span className="truncate">
                                    {pkg.madinah_hotel.name}
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                          {/* Inclusions */}
                          {inclusionsToShow.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-2 items-center">
                              {inclusionsToShow.map((inc, i) => (
                                <Badge
                                  key={i}
                                  className="bg-emerald-50 text-emerald-800 border-emerald-200 px-2 py-1 text-xs font-medium"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1 text-emerald-500 inline-block" />
                                  {inc}
                                </Badge>
                              ))}
                              {moreInclusions > 0 && (
                                <span className="text-xs text-gray-500">
                                  +{moreInclusions} more
                                </span>
                              )}
                            </div>
                          )}
                          {/* Price and CTA */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-emerald-700">
                              {symbol}
                              {value.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              per person
                            </span>
                          </div>
                          <div className="flex items-end justify-between mt-auto pt-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500">
                                Starting from
                              </span>
                              <span className="text-2xl font-bold text-emerald-600">
                                {symbol}
                                {value.toLocaleString()}
                              </span>
                            </div>
                            {pkg.seo?.slug ? (
                              <Button
                                asChild
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-6 py-2"
                              >
                                <Link to={`/custom-packages/${pkg.seo.slug}`}>
                                  View Details
                                </Link>
                              </Button>
                            ) : (
                              <span className="text-red-500 text-xs">
                                No slug set
                              </span>
                            )}
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

export default CustomPackages;
