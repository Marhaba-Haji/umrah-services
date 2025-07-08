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

const GroupPackageDetail = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchPackage = async () => {
      if (!slug) {
        setError("No slug provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("umrah_packages")
        .select("*")
        .filter("seo->slug", "eq", slug)
        .single();
      if (error) {
        const { data: data2, error: error2 } = await supabase
          .from("umrah_packages")
          .select("*")
          .eq("seo->>slug", slug)
          .single();
        if (error2) {
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
    fetchPackage();
  }, [slug]);

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

  const maxCap = pkg.max_capacity || 0;
  const availableSpots = Math.min(pkg.available_spots ?? 0, maxCap);
  const isSoldOut = availableSpots === 0;

  // Example: fake reviews and rating for demo
  const reviews = pkg.reviews || 847;
  const rating = pkg.rating || 4.9;

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
            {pkg.is_group_package && (
              <Badge className="bg-emerald-600 text-white shadow font-bold px-3 py-1">
                Group Package
              </Badge>
            )}
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
                {pkg.makkah_hotel?.name && "Makkah"}
                {pkg.makkah_hotel?.name && pkg.madinah_hotel?.name && " & "}
                {pkg.madinah_hotel?.name && "Madinah"}
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
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Package Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-2">
                      <span className="font-semibold">Type:</span>{" "}
                      {pkg.is_group_package ? "Group" : "Individual"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Category:</span>{" "}
                      {pkg.package_category}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Season:</span>{" "}
                      {pkg.season_category}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Departure Date:</span>{" "}
                      {pkg.departure_date
                        ? format(new Date(pkg.departure_date), "dd-MMM-yyyy")
                        : "-"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Booking Deadline:</span>{" "}
                      {pkg.booking_deadline
                        ? format(new Date(pkg.booking_deadline), "dd-MMM-yyyy")
                        : "-"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Meal Plan:</span>{" "}
                      {pkg.meal_plan}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="font-semibold">Inclusions:</span>
                      <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                        {pkg.inclusions &&
                          pkg.inclusions.map((inc: string, idx: number) => (
                            <li key={idx}>{inc}</li>
                          ))}
                      </ul>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Exclusions:</span>
                      <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                        {pkg.exclusions &&
                          pkg.exclusions.map((exc: string, idx: number) => (
                            <li key={idx}>{exc}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hotels Tab */}
          <TabsContent value="hotels">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Hotels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pkg.makkah_hotel && (
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-emerald-500" /> Makkah
                        Hotel
                      </h4>
                      <div className="font-bold text-lg mb-1">
                        {pkg.makkah_hotel.name}
                      </div>
                      {pkg.makkah_hotel.address && (
                        <div className="text-xs text-gray-500 mb-1">
                          {pkg.makkah_hotel.address}
                        </div>
                      )}
                      {pkg.makkah_hotel.amenities && (
                        <div className="flex flex-wrap gap-2 mb-1">
                          {pkg.makkah_hotel.amenities.map(
                            (a: string, idx: number) => (
                              <Badge
                                key={idx}
                                className="bg-emerald-100 text-emerald-700 border-emerald-200"
                              >
                                {a}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {pkg.madinah_hotel && (
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-emerald-500" />{" "}
                        Madinah Hotel
                      </h4>
                      <div className="font-bold text-lg mb-1">
                        {pkg.madinah_hotel.name}
                      </div>
                      {pkg.madinah_hotel.address && (
                        <div className="text-xs text-gray-500 mb-1">
                          {pkg.madinah_hotel.address}
                        </div>
                      )}
                      {pkg.madinah_hotel.amenities && (
                        <div className="flex flex-wrap gap-2 mb-1">
                          {pkg.madinah_hotel.amenities.map(
                            (a: string, idx: number) => (
                              <Badge
                                key={idx}
                                className="bg-emerald-100 text-emerald-700 border-emerald-200"
                              >
                                {a}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                {pkg.itinerary &&
                Array.isArray(pkg.itinerary) &&
                pkg.itinerary.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                      <thead>
                        <tr className="bg-emerald-50">
                          <th className="px-3 py-2 border">Day</th>
                          <th className="px-3 py-2 border">Location</th>
                          <th className="px-3 py-2 border">Activities</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pkg.itinerary.map((item: unknown, idx: number) => (
                          <tr key={idx} className="even:bg-gray-50">
                            <td className="px-3 py-2 border">
                              {item.day || idx + 1}
                            </td>
                            <td className="px-3 py-2 border">
                              {item.location || "-"}
                            </td>
                            <td className="px-3 py-2 border">
                              {Array.isArray(item.activities) ? (
                                <ul className="list-disc pl-4">
                                  {item.activities.map(
                                    (a: string, i: number) => (
                                      <li key={i}>{a}</li>
                                    ),
                                  )}
                                </ul>
                              ) : (
                                item.activities || "-"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500">No itinerary available.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {pkg.activities && pkg.activities.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {pkg.activities.map((act: string, idx: number) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">No activities listed.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                {pkg.pricing && Array.isArray(pkg.pricing) ? (
                  <table className="min-w-full text-sm border bg-gray-50 rounded">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 border">Type</th>
                        <th className="px-3 py-2 border">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.pricing.map((row, idx) => (
                        <tr key={idx} className="even:bg-white">
                          <td className="px-3 py-2 border">
                            {row.type || row.label || "-"}
                          </td>
                          <td className="px-3 py-2 border">
                            {convertFromINR(row.price || 0, currency).symbol}
                            {convertFromINR(
                              row.price || 0,
                              currency,
                            ).value.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(pkg.pricing, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms Tab */}
          <TabsContent value="terms">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-line">
                  {pkg.terms_conditions || "No terms specified."}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default GroupPackageDetail;
