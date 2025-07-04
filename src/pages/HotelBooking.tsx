import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, MapPin, Users, Wifi, Car, Coffee } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HotelFilters from "../components/HotelFilters";
import { createClient } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  format,
  addDays,
  differenceInCalendarDays,
  isBefore,
  isAfter,
  format as formatDate,
} from "date-fns";
import { toast } from "react-hot-toast";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

type Hotel = {
  id: number;
  name: string;
  location: string;
  rating: number;
  price_per_night: number;
  status: string;
  description: string;
  amenities: string[];
  city: string;
  distance_from_haram?: number;
  distance_from_masjid_e_nabawi?: number;
  images?: string[];
  latitude?: string;
  longitude?: string;
  is_shuttle?: boolean;
  is_walkable?: boolean;
};

type HotelFilterState = {
  city: string;
  priceRange: [number, number];
  starRating: number[];
  distanceRange: [number, number];
  amenities: string[];
};

const HotelBooking = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price-asc");
  const [activeFilters, setActiveFilters] = useState<HotelFilterState>({
    city: "makkah",
    priceRange: [0, 10000],
    starRating: [],
    distanceRange: [0, 15000],
    amenities: [],
  });
  const [enquiryHotel, setEnquiryHotel] = useState<Hotel | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    message: "",
    checkIn: "",
    checkOut: "",
    rooms: [{ guests: 1 }],
  });
  const [countrySearch, setCountrySearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  const defaultPriceRange = [0, 10000];
  const defaultDistanceRange = [0, 15000];

  const COUNTRY_CODES = [
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+971", name: "UAE", flag: "🇦🇪" },
    { code: "+1", name: "USA", flag: "🇺🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
  ];

  const filteredCountryCodes = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch),
  );

  const today = formatDate(new Date(), "yyyy-MM-dd");
  const tomorrow = formatDate(addDays(new Date(), 1), "yyyy-MM-dd");
  const [nightCount, setNightCount] = useState<number | null>(null);

  const fetchAndFilterHotels = async () => {
    setLoading(true);
    let query = supabase.from("hotels").select("*");

    // Filter by city from sidebar
    if (activeFilters.city && activeFilters.city !== "all") {
      query = query.eq("city", activeFilters.city);
    }

    // Apply price filter only if changed from default
    if (
      activeFilters.priceRange &&
      (activeFilters.priceRange[0] > defaultPriceRange[0] ||
        activeFilters.priceRange[1] < defaultPriceRange[1])
    ) {
      query = query.gte("price_per_night", activeFilters.priceRange[0]);
      query = query.lte("price_per_night", activeFilters.priceRange[1]);
    }

    // Apply star rating filter only if at least one is selected
    if (activeFilters.starRating && activeFilters.starRating.length > 0) {
      query = query.in("rating", activeFilters.starRating);
    }

    // Apply distance filter only if changed from default
    if (
      activeFilters.distanceRange &&
      activeFilters.city &&
      activeFilters.city !== "all" &&
      (activeFilters.distanceRange[0] > defaultDistanceRange[0] ||
        activeFilters.distanceRange[1] < defaultDistanceRange[1])
    ) {
      const distanceColumn =
        activeFilters.city === "makkah"
          ? "distance_from_haram"
          : "distance_from_masjid_e_nabawi";
      query = query.gte(distanceColumn, activeFilters.distanceRange[0]);
      query = query.lte(distanceColumn, activeFilters.distanceRange[1]);
    }

    // Apply amenities filter only if at least one is selected
    if (activeFilters.amenities && activeFilters.amenities.length > 0) {
      query = query.contains("amenities", activeFilters.amenities);
    }

    // Sorting
    const sortOptions = {
      "price-asc": { column: "price_per_night", ascending: true },
      "price-desc": { column: "price_per_night", ascending: false },
      "distance-asc": {
        column:
          activeFilters.city === "makkah"
            ? "distance_from_haram"
            : "distance_from_masjid_e_nabawi",
        ascending: true,
      },
    };

    if (sortBy === "distance-asc" && activeFilters.city === "all") {
      // Cannot sort by distance if no city is selected, so default to price
      query = query.order("price_per_night", { ascending: true });
    } else {
      query = query.order(sortOptions[sortBy].column, {
        ascending: sortOptions[sortBy].ascending,
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching hotels:", error);
      setHotels([]);
    } else {
      setHotels(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndFilterHotels();
  }, [activeFilters, sortBy]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setCountryDropdownOpen(false);
      }
    }
    if (countryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [countryDropdownOpen]);

  useEffect(() => {
    if (enquiryForm.checkIn && enquiryForm.checkOut) {
      const nights = differenceInCalendarDays(
        new Date(enquiryForm.checkOut),
        new Date(enquiryForm.checkIn),
      );
      setNightCount(nights > 0 ? nights : null);
    } else {
      setNightCount(null);
    }
  }, [enquiryForm.checkIn, enquiryForm.checkOut]);

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "free wifi":
        return <Wifi className="w-4 h-4" />;
      case "parking":
        return <Car className="w-4 h-4" />;
      case "restaurant":
      case "coffee shop":
        return <Coffee className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const openEnquiry = (hotel: Hotel) => {
    setEnquiryHotel(hotel);
    setIsEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setIsEnquiryOpen(false);
    setEnquiryHotel(null);
    setEnquiryForm({
      name: "",
      email: "",
      countryCode: "+91",
      phone: "",
      message: "",
      checkIn: "",
      checkOut: "",
      rooms: [{ guests: 1 }],
    });
  };

  const handleEnquiryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEnquiryForm({ ...enquiryForm, [e.target.name]: e.target.value });
  };

  const handleRoomGuestChange = (idx: number, value: number) => {
    const newRooms = enquiryForm.rooms.map((room, i) =>
      i === idx ? { guests: Math.max(1, Math.min(4, value)) } : room,
    );
    setEnquiryForm({ ...enquiryForm, rooms: newRooms });
  };

  const addRoom = () => {
    if (enquiryForm.rooms.length < 5) {
      setEnquiryForm({
        ...enquiryForm,
        rooms: [...enquiryForm.rooms, { guests: 1 }],
      });
    }
  };

  const removeRoom = (idx: number) => {
    if (enquiryForm.rooms.length > 1) {
      setEnquiryForm({
        ...enquiryForm,
        rooms: enquiryForm.rooms.filter((_, i) => i !== idx),
      });
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      const { data, error } = await supabase.from("hotel_enquiries").insert([
        {
          hotel_id: enquiryHotel?.id,
          hotel_name: enquiryHotel?.name,
          name: enquiryForm.name,
          email: enquiryForm.email,
          country_code: enquiryForm.countryCode,
          phone: enquiryForm.phone,
          message: enquiryForm.message,
          check_in: enquiryForm.checkIn ? new Date(enquiryForm.checkIn) : null,
          check_out: enquiryForm.checkOut
            ? new Date(enquiryForm.checkOut)
            : null,
          rooms: enquiryForm.rooms,
        },
      ]);
      if (error) throw error;
      setIsEnquiryOpen(false);
      setEnquiryHotel(null);
      setEnquiryForm({
        name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        message: "",
        checkIn: "",
        checkOut: "",
        rooms: [{ guests: 1 }],
      });
      toast.success("Enquiry submitted!");
    } catch (err) {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setEnquiryLoading(false);
    }
  };

  const handleCountryCodeChange = (code: string) => {
    setEnquiryForm({ ...enquiryForm, countryCode: code });
    setCountryDropdownOpen(false);
    setCountrySearch("");
  };

  const HotelCard = ({ hotel }: { hotel: Hotel }) => {
    const distanceColumn =
      hotel.city === "makkah"
        ? hotel.distance_from_haram
        : hotel.distance_from_masjid_e_nabawi;
    const distanceFrom = hotel.city === "makkah" ? "Haram" : "Masjid-e-Nabawi";

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={
                hotel.images && hotel.images.length > 0
                  ? hotel.images[0]
                  : "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop"
              }
              alt={hotel.name}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
              <div className="flex">{renderStars(hotel.rating)}</div>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              {distanceColumn}m from {distanceFrom}
            </div>

            <p className="text-gray-600 mb-4">{hotel.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities &&
                hotel.amenities
                  .slice(0, 4)
                  .map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {getAmenityIcon(amenity)}
                      <span className="ml-1">{amenity}</span>
                    </Badge>
                  ))}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Starting from</span>
                <div className="text-2xl font-bold text-emerald-600">
                  ₹{hotel.price_per_night.toLocaleString()}
                </div>
                <span className="text-sm text-gray-500">/ night</span>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => openEnquiry(hotel)}
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-4 md:py-6">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-emerald-600 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-amber-600 rounded-lg transform rotate-12"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-4 gap-8 items-start">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1 pt-2">
              <HotelFilters onFilterChange={setActiveFilters} />
            </div>
            {/* Right Content - Hotels */}
            <div className="lg:col-span-3 flex flex-col items-center">
              {/* Title & Subtitle */}
              <div className="w-full text-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  🏨 Book Your <span className="text-emerald-600">Hotel</span>
                </h1>
                <p className="text-base text-gray-600 max-w-xl mx-auto mb-2">
                  Stay in premium approved hotels close to Haram. Comfortable
                  accommodations for your spiritual journey.
                </p>
              </div>
              {/* Results Header and Sorting Dropdown in one row */}
              <div className="flex justify-between items-center w-full mb-4">
                <div className="flex items-center gap-2">
                  {activeFilters.city === "makkah" && (
                    <span className="text-2xl">🕋</span>
                  )}
                  {activeFilters.city === "madinah" && (
                    <span className="text-2xl">🕌</span>
                  )}
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeFilters.city
                      ? `${activeFilters.city === "makkah" ? "Makkah" : "Madinah"} Hotels`
                      : "Available Hotels"}
                  </h2>
                  <span className="text-gray-600 ml-4 text-base">
                    {hotels.length} hotel{hotels.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem
                      value="distance-asc"
                      disabled={activeFilters.city === "all"}
                    >
                      Distance: Closest
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Hotels List */}
              <div className="space-y-6 w-full">
                {hotels.length > 0 ? (
                  hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <div className="text-gray-500 mb-4">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <h3 className="text-lg font-medium">No hotels found</h3>
                      <p className="text-sm">
                        Try adjusting your filters to see more results
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <Dialog open={isEnquiryOpen} onOpenChange={setIsEnquiryOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hotel Enquiry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEnquirySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hotel</label>
              <Input
                value={enquiryHotel?.name || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Check-in
                </label>
                <Input
                  name="checkIn"
                  type="date"
                  value={enquiryForm.checkIn}
                  onChange={handleEnquiryChange}
                  required
                  min={today}
                />
                {enquiryForm.checkIn && (
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(enquiryForm.checkIn), "dd/MMM/yyyy")}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Check-out
                </label>
                <Input
                  name="checkOut"
                  type="date"
                  value={enquiryForm.checkOut}
                  onChange={handleEnquiryChange}
                  required
                  min={
                    enquiryForm.checkIn
                      ? formatDate(
                          addDays(new Date(enquiryForm.checkIn), 1),
                          "yyyy-MM-dd",
                        )
                      : tomorrow
                  }
                />
                {enquiryForm.checkOut && (
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(enquiryForm.checkOut), "dd/MMM/yyyy")}
                  </div>
                )}
              </div>
            </div>
            {nightCount !== null && (
              <div className="text-sm text-emerald-700 font-medium mb-2">
                Nights: {nightCount}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Rooms & Guests
              </label>
              <div className="space-y-2">
                {enquiryForm.rooms.map((room, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm">Room {idx + 1}:</span>
                    <Input
                      type="number"
                      min={1}
                      max={4}
                      value={room.guests}
                      onChange={(e) =>
                        handleRoomGuestChange(
                          idx,
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="w-20"
                    />
                    <span className="text-xs text-gray-600">guests</span>
                    {enquiryForm.rooms.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeRoom(idx)}
                      >
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addRoom}
                  disabled={enquiryForm.rooms.length >= 5}
                >
                  + Add Room
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <Input
                name="name"
                value={enquiryForm.name}
                onChange={handleEnquiryChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                name="email"
                type="email"
                value={enquiryForm.email}
                onChange={handleEnquiryChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Country Code
              </label>
              <div className="flex gap-2 items-center">
                <div className="relative w-40" ref={countryDropdownRef}>
                  <button
                    type="button"
                    className="flex items-center border rounded px-2 py-1 w-full bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    onClick={() => setCountryDropdownOpen((open) => !open)}
                  >
                    <span className="mr-2 text-lg">
                      {
                        COUNTRY_CODES.find(
                          (c) => c.code === enquiryForm.countryCode,
                        )?.flag
                      }
                    </span>
                    <span className="mr-1 text-sm font-medium">
                      {
                        COUNTRY_CODES.find(
                          (c) => c.code === enquiryForm.countryCode,
                        )?.code
                      }
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {
                        COUNTRY_CODES.find(
                          (c) => c.code === enquiryForm.countryCode,
                        )?.name
                      }
                    </span>
                    <svg
                      className="ml-auto w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {countryDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow-lg z-20 max-h-48 overflow-y-auto">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search country"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full px-2 py-1 border-b outline-none text-sm"
                      />
                      {filteredCountryCodes.length === 0 && (
                        <div className="px-2 py-2 text-gray-400 text-sm">
                          No results
                        </div>
                      )}
                      {filteredCountryCodes.map((c) => (
                        <div
                          key={c.code}
                          className={`flex items-center px-2 py-1 cursor-pointer hover:bg-emerald-50 ${enquiryForm.countryCode === c.code ? "bg-emerald-100 font-semibold" : ""}`}
                          onMouseDown={() => {
                            handleCountryCodeChange(c.code);
                            setCountryDropdownOpen(false);
                            setCountrySearch("");
                          }}
                        >
                          <span className="mr-2 text-lg">{c.flag}</span>
                          <span className="mr-2 text-sm">{c.name}</span>
                          <span className="ml-auto text-xs text-gray-500">
                            {c.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  name="phone"
                  value={enquiryForm.phone}
                  onChange={handleEnquiryChange}
                  required
                  placeholder="Phone number"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                name="message"
                value={enquiryForm.message}
                onChange={handleEnquiryChange}
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeEnquiry}
                disabled={enquiryLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={enquiryLoading}>
                {enquiryLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 mr-1 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Enquiry"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default HotelBooking;
