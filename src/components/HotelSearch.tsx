import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, MapPin, Star, Users, Bed } from "lucide-react";
import {
  searchHotels,
  HotelSearchParams,
  AmadeusHotelOffer,
  CITY_CODES,
} from "@/services/hotelService";
import { toast } from "react-hot-toast";

interface CartItem {
  id: string;
  type: "hotel" | "flight" | "transport" | "visa" | "guide" | "ziarath";
  name: string;
  price: number;
  quantity?: number;
  details?: Record<string, unknown>;
}

interface HotelSearchProps {
  city: "makkah" | "madinah";
  checkInDate: string;
  checkOutDate: string;
  rooms: Array<{ guests: number }>;
  onHotelSelect: (hotel: Omit<CartItem, "quantity">) => void;
  results: AmadeusHotelOffer[];
  setResults: (hotels: AmadeusHotelOffer[]) => void;
  hasSearched: boolean;
  setHasSearched: (v: boolean) => void;
}

const HotelSearch: React.FC<HotelSearchProps> = ({
  city,
  checkInDate,
  checkOutDate,
  rooms,
  onHotelSelect,
  results,
  setResults,
  hasSearched,
  setHasSearched,
}) => {
  // hotels and setHotels are now managed by parent via props
  const [loading, setLoading] = useState(false);
  // hasSearched and setHasSearched are now managed by parent via props

  const handleSearch = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (rooms.length === 0) {
      toast.error("Please add at least one room");
      return;
    }

    setLoading(true);
    setHasSearched(false);

    try {
      const totalGuests = rooms.reduce((sum, room) => sum + room.guests, 0);
      // Use JED (Jeddah) for Makkah searches as it's the closest major city
      const cityCode =
        city === "makkah" ? CITY_CODES.MAKKAH : CITY_CODES.MADINAH;

      const searchParams: HotelSearchParams = {
        cityCode,
        checkInDate,
        checkOutDate,
        adults: totalGuests,
        roomQuantity: rooms.length,
        radius: city === "makkah" ? 25 : 50, // Smaller radius for Makkah to focus on nearby hotels
      };

      console.log("Searching hotels for:", searchParams);

      const response = await searchHotels(searchParams);
      if (response.data && response.data.length > 0) {
        setResults(response.data);
        toast.success(`Found ${response.data.length} hotels`);
      } else {
        setResults([]);
        if (city === "makkah") {
          toast.error(
            "No hotels found near Makkah. This might be due to API limitations with Makkah city searches. Try different dates or check back later.",
          );
        } else {
          toast.error("No hotels found for the selected dates");
        }
      }

      setHasSearched(true);
    } catch (error) {
      console.error("Hotel search error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to search hotels";

      if (
        errorMessage.includes("502") ||
        errorMessage.includes("External API")
      ) {
        toast.error(
          "Hotel search service is temporarily unavailable. Please try again later.",
        );
      } else if (errorMessage.includes("credentials")) {
        toast.error(
          "Hotel search service is not properly configured. Please contact support.",
        );
      } else {
        toast.error(`Hotel search failed: ${errorMessage}`);
      }

      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string, currency: string) => {
    const numPrice = parseFloat(price);
    // Convert to INR if USD (approximate rate)
    const inrPrice = currency === "USD" ? numPrice * 83.5 : numPrice;
    return Math.round(inrPrice);
  };

  const getDistanceText = (city: string) => {
    if (city === "makkah") {
      return "Distance from Haram varies";
    } else {
      return "Distance from Masjid Nabawi varies";
    }
  };

  return (
    <div className="space-y-4">
      <Button
        size="lg"
        className="w-full bg-primary text-white"
        onClick={handleSearch}
        disabled={loading || !checkInDate || !checkOutDate}
      >
        {loading
          ? "Searching Hotels..."
          : `Search Hotels in ${city === "makkah" ? "Makkah" : "Madinah"}`}
      </Button>

      {/* Overlay loading GIF when loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <img
            src={
              city === "makkah"
                ? "https://res.cloudinary.com/doxoxzz02/image/upload/v1752633038/Kaaba_loading_eq7pby.gif"
                : "https://res.cloudinary.com/doxoxzz02/image/upload/v1752633038/madinah_loading_onc9td.gif"
            }
            alt="Loading..."
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
          />
        </div>
      )}

      {hasSearched && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No hotels found for the selected dates and criteria.</p>
                {city === "makkah" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Searching for Makkah Hotels
                    </h4>
                    <p className="text-sm text-blue-700">
                      We're using advanced search methods including geographic
                      coordinates to find hotels near the Haram. If no results
                      appear, it may be due to:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                      <li>Limited availability for selected dates</li>
                      <li>API restrictions for Makkah region</li>
                      <li>High demand during peak seasons</li>
                    </ul>
                    <p className="text-sm text-blue-700 mt-2">
                      Try adjusting your dates or check back later.
                    </p>
                  </div>
                )}
                {city === "madinah" && (
                  <p className="text-sm mt-2">
                    Try adjusting your search parameters or dates.
                  </p>
                )}
              </div>
            </Card>
          ) : (
            <>
              {(() => {
                const nights =
                  (new Date(checkOutDate).getTime() -
                    new Date(checkInDate).getTime()) /
                  (1000 * 60 * 60 * 24);
                const numRooms = rooms.length;
                return results.map((hotel) => {
                  const firstOffer = hotel.offers[0];
                  const price = formatPrice(
                    firstOffer.price.total,
                    firstOffer.price.currency,
                  );
                  // Calculate per-night price
                  const pricePerNight =
                    nights > 0 ? Math.round(price / nights) : price;
                  const isPopular =
                    hotel.hotel.rating && hotel.hotel.rating >= 4;
                  // Try to get hotel image from media array or image property
                  let hotelImage =
                    hotel.hotel.media && hotel.hotel.media[0]?.uri;
                  if (!hotelImage) {
                    hotelImage = "/public/placeholder.svg"; // fallback placeholder
                  }
                  // Mock/placeholder values for fields not in Amadeus
                  const guestRating = hotel.hotel.rating
                    ? (hotel.hotel.rating * 2).toFixed(1)
                    : "8.5";
                  const guestRatingLabel =
                    parseFloat(guestRating) >= 9
                      ? "Excellent"
                      : parseFloat(guestRating) >= 8
                        ? "Very Good"
                        : "Good";
                  const numReviews = Math.floor(Math.random() * 500) + 50; // mock
                  const cancellationPolicy = "Free cancellation"; // mock
                  const amenitiesSummary = hotel.hotel.amenities
                    ? hotel.hotel.amenities.slice(0, 3).join(", ")
                    : "WiFi, Breakfast, Parking";
                  // Debug: log hotel media array to check image data
                  console.log(
                    "Hotel media for",
                    hotel.hotel.name,
                    hotel.hotel.media,
                  );
                  return (
                    <Card
                      key={hotel.id}
                      className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                        isPopular
                          ? "border-primary shadow-md"
                          : "border-gray-200 hover:border-primary/30"
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-secondary text-primary px-4 py-1">
                            Recommended
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex gap-4 items-start">
                          {/* Hotel Image */}
                          <img
                            src={hotelImage}
                            alt={hotel.hotel.name}
                            className="w-28 h-20 object-cover rounded-xl border bg-gray-100 flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = "/public/placeholder.svg";
                            }}
                          />
                          {/* Hotel Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {hotel.hotel.name}
                                </h4>
                                {hotel.hotel.rating && (
                                  <span className="text-yellow-500 text-base">
                                    {"★".repeat(Math.round(hotel.hotel.rating))}
                                  </span>
                                )}
                                <span className="ml-2 text-sm text-green-700 font-semibold">
                                  {guestRating} / 10 {guestRatingLabel}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">
                                  ({numReviews} reviews)
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                {getDistanceText(city)}
                              </div>
                              <div className="text-sm text-gray-700">
                                {firstOffer.room.type || "Standard Room"} |{" "}
                                {amenitiesSummary}
                              </div>
                              <div className="text-xs text-green-700 mt-1">
                                {cancellationPolicy}
                              </div>
                            </div>
                            {/* Room Types & Prices */}
                            <div className="mt-3">
                              <div className="font-semibold mb-1 text-sm text-gray-800">
                                Available Rooms & Prices:
                              </div>
                              {hotel.offers.map((offer, idx) => {
                                const totalPrice = formatPrice(
                                  offer.price.total,
                                  offer.price.currency,
                                );
                                const perRoomPerNight =
                                  nights > 0 && numRooms > 0
                                    ? Math.round(totalPrice / numRooms / nights)
                                    : totalPrice;
                                return (
                                  <div
                                    key={offer.id}
                                    className="mb-2 p-2 border rounded bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between"
                                  >
                                    <div>
                                      <div className="font-medium text-sm">
                                        {offer.room.type || "Room"}
                                      </div>
                                      {offer.room.description?.text && (
                                        <div className="text-xs text-gray-600 mb-1">
                                          {offer.room.description.text}
                                        </div>
                                      )}
                                      <div className="text-xs text-gray-500">
                                        {offer.guests.adults} adults |{" "}
                                        {offer.checkInDate} -{" "}
                                        {offer.checkOutDate}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end mt-2 md:mt-0">
                                      <span className="text-primary font-bold text-base">
                                        ₹{totalPrice.toLocaleString()} total
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        Total for {numRooms} room(s), all
                                        guests, all nights (incl. taxes)
                                      </span>
                                      <span className="text-xs text-gray-700">
                                        ₹{perRoomPerNight.toLocaleString()} per
                                        room per night
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div>
                                <span className="text-xl font-bold text-primary block">
                                  ₹{price.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-600 block">
                                  Total for stay (incl. taxes)
                                </span>
                                <span className="text-sm text-gray-700 block">
                                  ₹{pricePerNight.toLocaleString()} per night
                                </span>
                              </div>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() =>
                                  onHotelSelect({
                                    id: hotel.id,
                                    type: "hotel",
                                    name: `${hotel.hotel.name} - ${city.charAt(0).toUpperCase() + city.slice(1)}`,
                                    price: price,
                                    details: {
                                      rating: hotel.hotel.rating,
                                      roomType: firstOffer.room.type,
                                      city: city,
                                      checkIn: checkInDate,
                                      checkOut: checkOutDate,
                                      guests: firstOffer.guests.adults,
                                      rooms: rooms.length,
                                      hotelId: hotel.hotel.hotelId,
                                      address: hotel.hotel.address,
                                    },
                                  })
                                }
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                View Deal
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                });
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
