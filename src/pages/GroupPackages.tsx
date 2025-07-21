import React, { useState, useEffect, useRef } from "react";
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
  Filter as FilterIcon,
  X as CloseIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertFromINR } from "@/lib/utils";

const GroupPackages = () => {
  const [filters, setFilters] = useState({});
  const [groupPackages, setGroupPackages] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currency } = useCurrency();
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showFabTooltip, setShowFabTooltip] = useState(true);
  const fabRef = useRef(null);
  const drawerRef = useRef(null);

  // Helper: returns true if any filters are active
  function hasActiveFilters(filters) {
    if (!filters) return false;
    return Object.values(filters).some((v) =>
      Array.isArray(v)
        ? v.length > 0 && !(v.length === 2 && v[0] === 0 && v[1] === 0)
        : v && v !== "",
    );
  }

  // Tooltip auto-hide after 2.5s or on tap
  useEffect(() => {
    if (!showFabTooltip) return;
    const t = setTimeout(() => setShowFabTooltip(false), 2500);
    return () => clearTimeout(t);
  }, [showFabTooltip]);

  // Scroll lock when drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.classList.add("overflow-hidden");
      // Focus trap: focus first focusable in drawer
      setTimeout(() => {
        if (drawerRef.current) {
          const el = drawerRef.current.querySelector(
            'button, [tabindex]:not([tabindex="-1"])',
          );
          if (el) el.focus();
        }
      }, 100);
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileFilterOpen]);

  // Filtering logic
  const filteredPackages = React.useMemo(() => {
    if (
      !Array.isArray(groupPackages) ||
      !filters ||
      Object.keys(filters).length === 0
    ) {
      return groupPackages.map((pkg) => ({
        ...pkg,
        _parsedMakkahHotel: null,
        _parsedMadinahHotel: null,
      }));
    }
    // Helper to map filter values to rating numbers
    const mapCategoryToRating = (cat) => {
      if (cat === "Budget") return 1;
      if (cat === "2 Star") return 2;
      if (typeof cat === "number") return cat;
      const n = Number(cat);
      return isNaN(n) ? null : n;
    };
    const mappedMakkahStars = (filters.makkahStars || [])
      .map(mapCategoryToRating)
      .filter(Boolean);
    const mappedMadinahStars = (filters.madinahStars || [])
      .map(mapCategoryToRating)
      .filter(Boolean);
    return groupPackages
      .map((pkg) => {
        // Parse hotel fields if needed
        const getHotelObj = (hotel) => {
          if (!hotel) return null;
          if (typeof hotel === "string") {
            try {
              const parsed = JSON.parse(hotel);
              if (parsed && typeof parsed === "object") return parsed;
              return null;
            } catch {
              return null;
            }
          }
          if (typeof hotel === "object") return hotel;
          return null;
        };
        const makkahHotel = getHotelObj(pkg.makkah_hotel);
        const madinahHotel = getHotelObj(pkg.madinah_hotel);
        return {
          ...pkg,
          _parsedMakkahHotel: makkahHotel,
          _parsedMadinahHotel: madinahHotel,
        };
      })
      .filter((pkg) => {
        const makkahHotel = pkg._parsedMakkahHotel;
        const madinahHotel = pkg._parsedMadinahHotel;
        // Price Range
        if (filters.priceRange && Array.isArray(filters.priceRange)) {
          const price =
            typeof pkg.price === "number"
              ? pkg.price
              : parseInt(pkg.price || "0");
          if (price < filters.priceRange[0] || price > filters.priceRange[1])
            return false;
        }
        // Flight Type
        if (filters.flightType && filters.flightType !== "any") {
          const pkgFlightType = pkg.flight_details?.flight_type?.toLowerCase();
          if (
            !pkgFlightType ||
            pkgFlightType !== filters.flightType.toLowerCase()
          )
            return false;
        }
        // Makkah Hotel Distance
        if (filters.makkahDistance && Array.isArray(filters.makkahDistance)) {
          if (makkahHotel && makkahHotel.distance_from_haram != null) {
            const dist = Number(makkahHotel.distance_from_haram);
            if (
              isNaN(dist) ||
              dist < filters.makkahDistance[0] ||
              dist > filters.makkahDistance[1]
            )
              return false;
          }
          // If no valid hotel object or distance, skip this filter (do not exclude)
        }
        // Madinah Hotel Distance
        if (filters.madinahDistance && Array.isArray(filters.madinahDistance)) {
          if (
            madinahHotel &&
            madinahHotel.distance_from_masjid_e_nabawi != null
          ) {
            const dist = Number(madinahHotel.distance_from_masjid_e_nabawi);
            if (
              isNaN(dist) ||
              dist < filters.madinahDistance[0] ||
              dist > filters.madinahDistance[1]
            )
              return false;
          }
          // If no valid hotel object or distance, skip this filter (do not exclude)
        }
        // Makkah Hotel Stars
        if (mappedMakkahStars.length > 0) {
          if (!makkahHotel || !mappedMakkahStars.includes(makkahHotel.rating))
            return false;
        }
        // Madinah Hotel Stars
        if (mappedMadinahStars.length > 0) {
          if (
            !madinahHotel ||
            !mappedMadinahStars.includes(madinahHotel.rating)
          )
            return false;
        }
        return true;
      });
  }, [groupPackages, filters]);

  useEffect(() => {
    const fetchGroupPackages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("umrah_packages")
        .select("*")
        .eq("is_group_package", true)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (!error && data) setGroupPackages(data);
      setIsLoading(false);
    };
    fetchGroupPackages();
  }, []);

  const handleFiltersChange = (newFilters: unknown) => {
    setFilters(newFilters);
    // Filtering logic can be added here
  };

  // Helper to get currency symbol
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />

      {/* Hero Section */}
      <section className="py-6 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Left column intentionally left empty for symmetry or future use */}
            <div className="hidden md:block" />
            {/* Right column: Title section */}
            <div className="flex flex-col items-end text-right">
              <Badge className="bg-white/20 text-white border-white/30 mb-2">
                <Users className="w-4 h-4 mr-1" />
                Group Packages
              </Badge>
              <p className="text-base md:text-lg text-emerald-100 max-w-xl">
                Join fellow pilgrims in our carefully crafted group packages
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Floating Action Button (FAB) */}
      <div className="md:hidden">
        <button
          ref={fabRef}
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 shadow-xl rounded-full p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all hover:bg-emerald-700 active:scale-95"
          aria-label="Open filters"
          aria-expanded={isMobileFilterOpen}
          onClick={() => {
            setMobileFilterOpen(true);
            setShowFabTooltip(false);
          }}
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
        >
          <FilterIcon className="w-7 h-7 text-white" />
          {/* Dot badge if filters active */}
          {hasActiveFilters(filters) && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow border-2 border-white" />
          )}
        </button>
        {/* Tooltip on first load */}
        {showFabTooltip && (
          <div className="fixed bottom-20 right-8 bg-gray-900 text-white text-xs rounded px-2 py-1 shadow animate-fade-in z-50 pointer-events-none select-none">
            Filters
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer/Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setMobileFilterOpen(false)}
            aria-label="Close filters"
            tabIndex={-1}
          />
          {/* Drawer */}
          <aside
            ref={drawerRef}
            className="relative ml-auto w-full max-w-sm h-full bg-white shadow-2xl rounded-l-3xl flex flex-col animate-slide-in-right focus:outline-none"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Filter packages"
          >
            <button
              className="absolute top-4 right-4 z-10 bg-gray-100 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={() => setMobileFilterOpen(false)}
              aria-label="Close filters"
            >
              <CloseIcon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="p-6 overflow-y-auto flex-1">
              <UmrahPackageFilters
                onFiltersChange={handleFiltersChange}
                currency={currency}
              />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content with Filters */}
      <section className="py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex gap-8 max-w-7xl mx-auto items-start">
            {/* Left Panel - Filters (desktop only) */}
            <div className="w-80 flex-shrink-0 self-start hidden md:block">
              <UmrahPackageFilters
                onFiltersChange={handleFiltersChange}
                currency={currency}
              />
            </div>

            {/* Right Panel - Packages */}
            <div className="flex-1 w-full">
              {/* Info note about currency */}
              <div className="mb-4 text-sm text-gray-500 italic">
                All prices are in INR (₹) unless otherwise specified.
              </div>
              {isLoading ? (
                <div>Loading packages...</div>
              ) : filteredPackages.length === 0 ? (
                <div>No group packages found</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filteredPackages.map((pkg) => {
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
                    const { value, symbol } = convertFromINR(
                      pkg.price,
                      currency,
                    );
                    const makkahHotel = pkg._parsedMakkahHotel;
                    const madinahHotel = pkg._parsedMadinahHotel;
                    return (
                      <div
                        key={pkg.id}
                        className="relative group rounded-2xl overflow-hidden shadow-xl bg-white/90 border border-emerald-100 hover:shadow-emerald-200 transition-all duration-300 flex flex-col min-h-[340px]"
                        tabIndex={0}
                        aria-label={`View details for ${pkg.name}`}
                      >
                        {/* Compact Image */}
                        <div className="relative h-28 md:h-32 w-full overflow-hidden aspect-[4/3] rounded-t-2xl">
                          <img
                            src={
                              pkg.featured_image || "/public/placeholder.svg"
                            }
                            alt={pkg.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
                            loading="lazy"
                            decoding="async"
                          />
                          {/* Overlay: Package Category (top left) */}
                          {pkg.package_category && (
                            <div className="absolute top-2 left-2 z-10">
                              <Badge className="bg-amber-100/90 text-amber-800 border-amber-200 px-2 py-0.5 text-xs font-bold shadow">
                                {pkg.package_category}
                              </Badge>
                            </div>
                          )}
                          {/* Overlay: Duration (top right) */}
                          {pkg.duration && (
                            <div className="absolute top-2 right-2 z-10">
                              <Badge className="bg-white/90 text-emerald-700 border-emerald-200 flex items-center gap-1 px-2 py-0.5 text-xs font-semibold shadow">
                                <Clock className="w-3 h-3 text-emerald-500" />
                                {pkg.duration}
                              </Badge>
                            </div>
                          )}
                        </div>
                        {/* Badges Row */}
                        <div className="flex flex-wrap gap-2 items-center justify-between px-4 pt-2 pb-1">
                          {isSoldOut && (
                            <Badge className="bg-red-600/90 text-white px-2 py-0.5 text-xs font-bold animate-pulse">
                              Sold Out
                            </Badge>
                          )}
                        </div>
                        {/* Main Content */}
                        <div className="flex flex-col flex-1 px-4 pb-3 pt-1 gap-2">
                          {/* Package Name */}
                          <div className="mb-1">
                            <h2
                              className="text-lg font-bold text-gray-900 truncate flex-1"
                              title={pkg.name}
                            >
                              {pkg.name}
                            </h2>
                          </div>
                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-700 mb-1">
                            {pkg.departure_date && (
                              <div className="flex items-center gap-1 truncate">
                                <Calendar className="w-3 h-3 text-emerald-500" />
                                {format(
                                  new Date(pkg.departure_date),
                                  "dd-MMM-yyyy",
                                )}
                              </div>
                            )}
                            {pkg.flight_details?.departure_from_airport && (
                              <div className="flex items-center gap-1 truncate">
                                <Plane className="w-3 h-3 text-blue-500" />
                                {pkg.flight_details.departure_from_airport}
                              </div>
                            )}
                          </div>
                          {/* Hotels and Flights Row */}
                          <div className="flex flex-wrap gap-2 items-center text-xs text-gray-600 mb-1">
                            {makkahHotel?.name && (
                              <span
                                className="flex items-center bg-emerald-50 px-1.5 py-0.5 rounded max-w-[48%] truncate"
                                title={`Makkah Hotel: ${makkahHotel.name}`}
                              >
                                <Landmark className="w-3 h-3 mr-1 text-emerald-500" />
                                <span className="truncate">
                                  {makkahHotel.name}
                                </span>
                              </span>
                            )}
                            {madinahHotel?.name && (
                              <span
                                className="flex items-center bg-emerald-50 px-1.5 py-0.5 rounded max-w-[48%] truncate"
                                title={`Madinah Hotel: ${madinahHotel.name}`}
                              >
                                <Landmark className="w-3 h-3 mr-1 text-emerald-500" />
                                <span className="truncate">
                                  {madinahHotel.name}
                                </span>
                              </span>
                            )}
                            {pkg.flight_details?.airline_name && (
                              <span
                                className="flex items-center bg-blue-50 px-1.5 py-0.5 rounded truncate"
                                title="Airline"
                              >
                                <Plane className="w-3 h-3 mr-1 text-blue-500" />
                                {pkg.flight_details.airline_name}
                              </span>
                            )}
                            {pkg.flight_details?.flight_type && (
                              <span
                                className="flex items-center bg-blue-50 px-1.5 py-0.5 rounded truncate"
                                title="Flight Type"
                              >
                                <Plane className="w-3 h-3 mr-1 text-blue-500" />
                                {pkg.flight_details.flight_type}
                              </span>
                            )}
                          </div>
                          {/* Price & CTA */}
                          <div className="flex items-end justify-between mt-2">
                            <div>
                              <span className="text-xl font-extrabold text-emerald-600">
                                {symbol}
                                {value.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                per person
                              </span>
                            </div>
                            <Button
                              asChild
                              size="sm"
                              className="ml-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-4 py-2 rounded-xl shadow text-xs tracking-wide transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                              aria-label={`View details for ${pkg.name}`}
                              tabIndex={0}
                              disabled={isSoldOut}
                            >
                              <Link
                                to={`/group-packages/${pkg.seo?.slug || pkg.slug || pkg.id}`}
                              >
                                {isSoldOut ? "Sold Out" : "View Details"}
                              </Link>
                            </Button>
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

      {/* Animations for drawer */}
      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%) scale(0.98); opacity: 0.7; }
          60% { transform: translateX(-8px) scale(1.02); opacity: 1; }
          80% { transform: translateX(2px) scale(0.99); }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.38s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease both;
        }
      `}</style>
    </div>
  );
};

export default GroupPackages;
