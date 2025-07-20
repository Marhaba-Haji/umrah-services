import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Star,
  Plane,
  MapPin,
  CreditCard,
  Utensils,
  User,
  Phone,
  Mail,
} from "lucide-react";
import type { HajjPackage } from "./HajjPackages";

const HajjPackageDetail: React.FC = () => {
  // TODO: Replace with real Hajj data
  const [pkg] = useState<HajjPackage>({
    title: "Hajj 2025 Premium Package",
    name: "Hajj 2025 Premium Package",
    description:
      "Experience a premium Hajj journey with top hotels, guided rituals, and all-inclusive services.",
    duration: "25 Days / 24 Nights",
    rating: 4.9,
    reviews: 847,
    maktab_category: "A",
    category: "Premium",
    cities_covered: ["Makkah", "Madinah"],
    currency: "INR",
    price: 450000,
    meal_plan: "Full-board",
    inclusions: ["5 Star Hotels", "Direct Flights", "All Meals"],
    exclusions: ["Personal Expenses", "Shopping"],
    itinerary: [],
    activities: [],
    makkah_hotel: {
      name: "Swissotel Makkah",
      amenities: ["WiFi", "Breakfast"],
    },
    madinah_hotel: {
      name: "Pullman Zamzam Madina",
      amenities: ["WiFi", "Breakfast"],
    },
    is_group_package: true,
    pricing: {},
    departure_date: "2025-06-15",
    featured_image: "/public/umrah-package-banner.jpg",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [quintCount, setQuintCount] = useState(0);
  const [quadCount, setQuadCount] = useState(0);
  const [tripleCount, setTripleCount] = useState(0);
  const [doubleCount, setDoubleCount] = useState(0);
  const [singleCount, setSingleCount] = useState(0);
  const roomTypes = [
    { value: "", label: "Select room type" },
    { value: "sharing", label: "Sharing room" },
    { value: "private", label: "Private room" },
  ];
  const prices = {
    adult: 98000,
    child: 65000,
    infant: 30000,
  };
  const privatePrices = {
    quint: 60000,
    quad: 70000,
    triple: 80000,
    double: 90000,
    single: 120000,
    child: 65000,
  };
  const totalTravelers = adultCount + childCount + infantCount;
  const adultTotal = adultCount * prices.adult;
  const childTotal = childCount * prices.child;
  const infantTotal = infantCount * prices.infant;
  const totalRooms =
    quintCount + quadCount + tripleCount + doubleCount + singleCount;
  const privateTotal =
    quintCount * privatePrices.quint +
    quadCount * privatePrices.quad +
    tripleCount * privatePrices.triple +
    doubleCount * privatePrices.double +
    singleCount * privatePrices.single +
    childCount * privatePrices.child;
  const totalTravelersPrivate =
    quintCount * 5 +
    quadCount * 4 +
    tripleCount * 3 +
    doubleCount * 2 +
    singleCount * 1 +
    childCount;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden flex items-end">
        {/* Overlayed badges for package type and category */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge className="bg-emerald-600 text-white shadow font-bold px-3 py-1 text-base rounded-full">
            Hajj 2025
          </Badge>
          {pkg.category && (
            <Badge className="bg-blue-700 text-white shadow font-bold px-3 py-1 text-base rounded-full">
              {pkg.category}
            </Badge>
          )}
          {pkg.maktab_category && (
            <Badge className="bg-yellow-400 text-white shadow font-bold px-3 py-1 text-base rounded-full">
              Maktab {pkg.maktab_category}
            </Badge>
          )}
        </div>
        <img
          src={pkg.featured_image || "/public/placeholder.svg"}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
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
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <Card className="mb-8 bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-xl p-8 border border-emerald-200 animate-fade-in-up">
                  <CardHeader>
                    <CardTitle>{pkg.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-700 mb-4">
                      {pkg.description}
                    </p>
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
                  </CardContent>
                </Card>
                {/* Inclusions/Exclusions */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Inclusions & Exclusions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-2 font-semibold">Inclusions:</div>
                        <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                          {pkg.inclusions?.map((inc, idx) => (
                            <li key={idx}>{inc}</li>
                          )) || <li>No inclusions listed.</li>}
                        </ul>
                      </div>
                      <div>
                        <div className="mb-2 font-semibold">Exclusions:</div>
                        <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                          {pkg.exclusions?.map((exc, idx) => (
                            <li key={idx}>{exc}</li>
                          )) || <li>No exclusions listed.</li>}
                        </ul>
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
                      <div>
                        <h4 className="font-semibold mb-1">Makkah Hotel</h4>
                        <div className="font-bold text-lg mb-1">
                          {pkg.makkah_hotel?.name || "-"}
                        </div>
                        {pkg.makkah_hotel?.amenities && (
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
                      <div>
                        <h4 className="font-semibold mb-1">Madinah Hotel</h4>
                        <div className="font-bold text-lg mb-1">
                          {pkg.madinah_hotel?.name || "-"}
                        </div>
                        {pkg.madinah_hotel?.amenities && (
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
                    {/* TODO: Render itinerary table or list here */}
                    <div className="text-gray-500">No itinerary available.</div>
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
                    {/* TODO: Render activities list here */}
                    <div className="text-gray-500">No activities listed.</div>
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
                    {/* TODO: Render pricing table here */}
                    <div className="text-gray-500">No pricing data.</div>
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
                    {/* TODO: Render terms and conditions here */}
                    <div className="text-sm whitespace-pre-line">
                      No terms specified.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 shadow-xl border-emerald-200 bg-white rounded-2xl p-6 mb-8">
              {/* Title and Icon */}
              <div className="flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-emerald-700" />
                <span className="text-2xl font-bold text-gray-900">
                  Customize Your Booking
                </span>
              </div>
              {/* Room Sharing Type Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Sharing Type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={selectedRoomType}
                  onChange={(e) => {
                    setSelectedRoomType(e.target.value);
                    // Reset counters on change
                    setAdultCount(1);
                    setChildCount(0);
                    setInfantCount(0);
                    setQuintCount(0);
                    setQuadCount(0);
                    setTripleCount(0);
                    setDoubleCount(0);
                    setSingleCount(0);
                  }}
                >
                  {roomTypes.map((rt) => (
                    <option
                      key={rt.value}
                      value={rt.value}
                      disabled={rt.value === ""}
                    >
                      {rt.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Traveler Counters for Sharing Room */}
              {selectedRoomType === "sharing" && (
                <>
                  {/* Adult Counter */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Adult
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setAdultCount(Math.max(1, adultCount - 1))
                        }
                        disabled={adultCount <= 1}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {adultCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setAdultCount(adultCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Child Counter */}
                  <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Child (no bed)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-yellow-200 text-yellow-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setChildCount(Math.max(0, childCount - 1))
                        }
                        disabled={childCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {childCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-yellow-200 text-yellow-700 text-lg font-bold"
                        onClick={() => setChildCount(childCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Infant Counter */}
                  <div className="flex items-center justify-between bg-purple-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Infant
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-purple-200 text-purple-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setInfantCount(Math.max(0, infantCount - 1))
                        }
                        disabled={infantCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {infantCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-purple-200 text-purple-700 text-lg font-bold"
                        onClick={() => setInfantCount(infantCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Booking Breakdown */}
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                    <div className="font-semibold text-lg mb-2">
                      Booking Breakdown
                    </div>
                    <div className="mb-1">
                      Adult: {adultCount} × ₹{prices.adult.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{adultTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Child (no bed): {childCount} × ₹
                      {prices.child.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{childTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Infant: {infantCount} × ₹{prices.infant.toLocaleString()}{" "}
                      ={" "}
                      <span className="font-bold">
                        ₹{infantTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 font-semibold">
                      Total Travelers:{" "}
                      <span className="font-bold">{totalTravelers}</span>
                    </div>
                    {/* Total Package Cost Row */}
                    <div className="mt-4 bg-green-100 rounded-lg px-6 py-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-emerald-800">
                        Total Package Cost:
                      </span>
                      <span className="text-2xl font-bold text-emerald-700">
                        ₹
                        {(
                          adultTotal +
                          childTotal +
                          infantTotal
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {selectedRoomType === "private" && (
                <>
                  <div className="font-semibold text-base mb-2">
                    Select Number of Rooms
                  </div>
                  {/* Quint Bed */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Quint Bed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setQuintCount(Math.max(0, quintCount - 1))
                        }
                        disabled={quintCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {quintCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setQuintCount(quintCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Quad Bed */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Quad Bed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() => setQuadCount(Math.max(0, quadCount - 1))}
                        disabled={quadCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {quadCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setQuadCount(quadCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Triple Bed */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Triple Bed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setTripleCount(Math.max(0, tripleCount - 1))
                        }
                        disabled={tripleCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {tripleCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setTripleCount(tripleCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Double Bed */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Double Bed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setDoubleCount(Math.max(0, doubleCount - 1))
                        }
                        disabled={doubleCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {doubleCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setDoubleCount(doubleCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Single Bed */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Single Bed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setSingleCount(Math.max(0, singleCount - 1))
                        }
                        disabled={singleCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {singleCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setSingleCount(singleCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Child (no bed) */}
                  <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Child (no bed)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-yellow-200 text-yellow-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setChildCount(Math.max(0, childCount - 1))
                        }
                        disabled={childCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {childCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-yellow-200 text-yellow-700 text-lg font-bold"
                        onClick={() => setChildCount(childCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Infant */}
                  <div className="flex items-center justify-between bg-purple-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Infant
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-purple-200 text-purple-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setInfantCount(Math.max(0, infantCount - 1))
                        }
                        disabled={infantCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {infantCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-purple-200 text-purple-700 text-lg font-bold"
                        onClick={() => setInfantCount(infantCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Booking Breakdown */}
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                    <div className="font-semibold text-lg mb-2">
                      Booking Breakdown
                    </div>
                    <div className="mb-1">
                      Quint Bed: {quintCount} × ₹
                      {privatePrices.quint.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(quintCount * privatePrices.quint).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Quad Bed: {quadCount} × ₹
                      {privatePrices.quad.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(quadCount * privatePrices.quad).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Triple Bed: {tripleCount} × ₹
                      {privatePrices.triple.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(tripleCount * privatePrices.triple).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Double Bed: {doubleCount} × ₹
                      {privatePrices.double.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(doubleCount * privatePrices.double).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Single Bed: {singleCount} × ₹
                      {privatePrices.single.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(singleCount * privatePrices.single).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Child (no bed): {childCount} × ₹
                      {privatePrices.child.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(childCount * privatePrices.child).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Infant: {infantCount} × ₹{prices.infant.toLocaleString()}{" "}
                      ={" "}
                      <span className="font-bold">
                        ₹{(infantCount * prices.infant).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 font-semibold">
                      Total Rooms:{" "}
                      <span className="font-bold">{totalRooms}</span>
                    </div>
                    <div className="font-semibold">
                      Total Travelers:{" "}
                      <span className="font-bold">
                        {totalTravelersPrivate + infantCount}
                      </span>
                    </div>
                    {/* Total Package Cost Row */}
                    <div className="mt-4 bg-green-100 rounded-lg px-6 py-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-emerald-800">
                        Total Package Cost:
                      </span>
                      <span className="text-2xl font-bold text-emerald-700">
                        ₹
                        {(
                          privateTotal +
                          infantCount * prices.infant
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {/* Book Now Button */}
              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-lg mb-3"
                disabled={
                  selectedRoomType === "" ||
                  (selectedRoomType === "sharing" && adultCount < 1) ||
                  (selectedRoomType === "private" && totalRooms < 1)
                }
              >
                Book This Package Now
              </Button>
              {/* Request Custom Quote Button */}
              <Button
                variant="outline"
                className="w-full border-emerald-600 text-emerald-700 font-semibold py-3 rounded-lg text-lg mb-6"
              >
                Request Custom Quote
              </Button>
              <hr className="my-6 border-gray-200" />
              {/* Need Assistance Section */}
              <div>
                <div className="text-lg font-semibold text-gray-900 mb-4">
                  Need Assistance?
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 rounded-lg p-4 mb-3">
                  <Phone className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Call Us</div>
                    <div className="text-gray-700 text-base">
                      +91-78920-09800
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 rounded-lg p-4">
                  <Mail className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Email Us</div>
                    <div className="text-gray-700 text-base">
                      support@marhabahaji.com
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HajjPackageDetail;
