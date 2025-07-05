
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, MapPin, Star, Users, Bed } from "lucide-react";
import { searchHotels, HotelSearchParams, AmadeusHotelOffer, CITY_CODES } from "@/services/hotelService";
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
}

const HotelSearch: React.FC<HotelSearchProps> = ({
  city,
  checkInDate,
  checkOutDate,
  rooms,
  onHotelSelect,
}) => {
  const [hotels, setHotels] = useState<AmadeusHotelOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
      const cityCode = city === "makkah" ? CITY_CODES.MAKKAH : CITY_CODES.MADINAH;

      const searchParams: HotelSearchParams = {
        cityCode,
        checkInDate,
        checkOutDate,
        adults: totalGuests,
        roomQuantity: rooms.length,
        radius: 50, // 50km radius
      };

      console.log('Searching hotels for:', searchParams);

      const response = await searchHotels(searchParams);
      
      if (response.data && response.data.length > 0) {
        setHotels(response.data);
        toast.success(`Found ${response.data.length} hotels`);
      } else {
        setHotels([]);
        toast.error("No hotels found for the selected dates");
      }
      
      setHasSearched(true);
    } catch (error) {
      console.error('Hotel search error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to search hotels");
      setHotels([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string, currency: string) => {
    const numPrice = parseFloat(price);
    // Convert to INR if USD (approximate rate)
    const inrPrice = currency === 'USD' ? numPrice * 83.5 : numPrice;
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
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Searching Hotels...
          </>
        ) : (
          "Search Hotels"
        )}
      </Button>

      {hasSearched && (
        <div className="space-y-4">
          {hotels.length === 0 ? (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No hotels found for the selected dates and criteria.</p>
                <p className="text-sm mt-2">Try adjusting your search parameters.</p>
              </div>
            </Card>
          ) : (
            hotels.map((hotel) => {
              const firstOffer = hotel.offers[0];
              const price = formatPrice(firstOffer.price.total, firstOffer.price.currency);
              const isPopular = hotel.hotel.rating && hotel.hotel.rating >= 4;

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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {hotel.hotel.name}
                        </h4>
                        <p className="text-sm text-primary font-medium mb-2">
                          {firstOffer.room.type || "Standard Room"}
                        </p>
                        <div className="space-y-1">
                          {hotel.hotel.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(Math.floor(hotel.hotel.rating))].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">
                                {hotel.hotel.rating}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{getDistanceText(city)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{firstOffer.guests.adults} guest(s)</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Bed className="w-4 h-4" />
                            <span>{rooms.length} room(s)</span>
                          </div>
                          <p className="text-xs text-gray-500">per night</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          ₹{price.toLocaleString()}
                        </p>
                        <Button
                          size="sm"
                          className="mt-3 bg-primary hover:bg-primary/90"
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
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
