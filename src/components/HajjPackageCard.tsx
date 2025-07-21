import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plane,
  Star,
  CheckCircle,
  Users,
  MapPin,
  Landmark,
} from "lucide-react";
import { format } from "date-fns";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertFromINR } from "@/lib/utils";
import type { HajjPackage } from "../pages/HajjPackages";

interface HajjPackageCardProps {
  pkg: HajjPackage;
}

const HajjPackageCard = ({ pkg }: HajjPackageCardProps) => {
  const { currency } = useCurrency();

  // Parse prices from JSON string
  let parsedPrice = 0;
  try {
    const prices =
      typeof pkg.prices === "string" ? JSON.parse(pkg.prices) : pkg.prices;
    parsedPrice = parseInt(prices?.sharing?.adult || "0");
  } catch (error) {
    console.error("Error parsing price:", error);
  }

  const { value, symbol } = convertFromINR(parsedPrice, currency);

  const getPackageCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "premium":
      case "vip":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "luxury":
        return "bg-gradient-to-r from-yellow-400 to-orange-500";
      case "family":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "youth":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "senior":
        return "bg-gradient-to-r from-indigo-500 to-purple-500";
      case "economy":
      case "budget":
        return "bg-gradient-to-r from-gray-500 to-slate-600";
      default:
        return "bg-gradient-to-r from-emerald-500 to-teal-600";
    }
  };

  const getSlug = () => {
    // Prefer top-level slug, then seo.slug, fallback to id
    return pkg.slug || (pkg.seo && pkg.seo.slug) || pkg.id;
  };

  return (
    <Card className="group relative min-h-[250px] md:min-h-[250px] flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-2xl scale-100 hover:scale-[1.025]">
      {/* Image Section */}
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
        <img
          src={pkg.featured_image || "/public/placeholder.svg"}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <Badge className="bg-emerald-600/90 text-white backdrop-blur-sm shadow-lg px-2 py-1 text-xs font-bold rounded-full">
              Hajj 2025
            </Badge>
            {pkg.package_category && (
              <Badge
                className={`${getPackageCategoryColor(pkg.package_category)} text-white shadow-lg px-2 py-1 text-xs font-bold rounded-full`}
              >
                {pkg.package_category}
              </Badge>
            )}
          </div>

          {/* Departure city */}
          {pkg.departure_city && (
            <Badge className="bg-blue-600/90 text-white backdrop-blur-sm shadow-lg px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1">
              <Plane className="w-3 h-3" />
              {pkg.departure_city}
            </Badge>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <Badge className="bg-white/90 text-emerald-700 border border-white/20 shadow-lg px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pkg.duration}
          </Badge>

          {pkg.available_spots && pkg.available_spots <= 10 && (
            <Badge className="bg-red-500/90 text-white shadow-lg px-2 py-1 text-xs font-bold animate-pulse rounded-full">
              Only {pkg.available_spots} left!
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4 flex flex-col bg-gray-50 rounded-b-2xl border-t border-gray-100 pb-[15px]">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
            {pkg.name}
          </h3>

          {/* Date and Maktab info */}
          <div className="flex flex-wrap gap-2 mb-2">
            {/* Duration Category */}
            {pkg.duration_category && (
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-700 bg-blue-50 text-xs rounded-full"
              >
                {pkg.duration_category}
              </Badge>
            )}
            {/* Maktab Category */}
            {pkg.maktab_category && (
              <Badge
                variant="outline"
                className="border-yellow-200 text-yellow-700 bg-yellow-50 text-xs rounded-full"
              >
                Maktab {pkg.maktab_category}
              </Badge>
            )}
            {/* Class */}
            {pkg.class && (
              <Badge
                variant="outline"
                className="border-purple-200 text-purple-700 bg-purple-50 text-xs rounded-full"
              >
                {pkg.class}
              </Badge>
            )}
            {/* Type (Shifting/Non-Shifting) */}
            {pkg.type && (
              <Badge
                variant="outline"
                className="border-pink-200 text-pink-700 bg-pink-50 text-xs rounded-full"
              >
                {pkg.type}
              </Badge>
            )}
          </div>
        </div>

        {/* Hotels info */}
        {(pkg.makkah_hotel_name || pkg.madinah_hotel_name) && (
          <div className="mb-1 space-y-1">
            {pkg.makkah_hotel_name && (
              <div className="flex items-center text-xs text-gray-700 bg-white rounded-lg px-2 py-1 shadow-sm">
                <Landmark className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                <span className="truncate font-medium">
                  {pkg.makkah_hotel_name} ({pkg.makkah_hotel_category})
                </span>
              </div>
            )}
            {pkg.madinah_hotel_name && (
              <div className="flex items-center text-xs text-gray-700 bg-white rounded-lg px-2 py-1 shadow-sm">
                <Landmark className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                <span className="truncate font-medium">
                  {pkg.madinah_hotel_name} ({pkg.madinah_hotel_category})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price and CTA */}
        <div>
          <div className="flex items-center justify-between mb-0 gap-[15px]">
            <div>
              <div className="text-lg font-extrabold text-emerald-600">
                {symbol}
                {value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 font-medium mb-[15px]">
                per person (sharing)
              </div>
            </div>

            {pkg.max_capacity && (
              <div className="text-right">
                <div className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3" />
                  Max {pkg.max_capacity}
                </div>
                {pkg.available_spots && (
                  <div className="text-xs text-emerald-600 font-semibold">
                    {pkg.available_spots} spots left
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to={`/hajj-packages/${getSlug()}`} className="mt-3">
            <Button
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-semibold text-base py-2"
              size="sm"
            >
              View Package Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default HajjPackageCard;
