
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Star, Users, MapPin } from 'lucide-react';

interface HotelFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const HotelFilters = ({ onFiltersChange }: HotelFiltersProps) => {
  const [city, setCity] = useState('');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [priceRange, setPriceRange] = useState([50, 1000]);
  const [starRating, setStarRating] = useState([1, 5]);
  const [distanceRange, setDistanceRange] = useState([0, 2000]);

  const handleFiltersChange = () => {
    const filters = {
      city,
      rooms,
      adults,
      children,
      priceRange,
      starRating,
      distanceRange
    };
    onFiltersChange(filters);
  };

  const getTotalGuests = () => adults + children;
  const isGuestCountValid = getTotalGuests() <= 6 && adults >= 1;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          🔍 Filter Hotels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* City Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏙️ City
          </label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="makkah">🕋 Makkah</SelectItem>
              <SelectItem value="madinah">🕌 Madinah</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Room Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏨 Rooms
          </label>
          <Select value={rooms.toString()} onValueChange={(value) => setRooms(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Room{num > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guest Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            👥 Guests
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Adults (Required: min 1)</label>
              <Select value={adults.toString()} onValueChange={(value) => setAdults(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Adult{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Children</label>
              <Select value={children.toString()} onValueChange={(value) => setChildren(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].filter(num => adults + num <= 6).map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Child{num !== 1 ? 'ren' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-gray-500">
              Total: {getTotalGuests()} guest{getTotalGuests() > 1 ? 's' : ''} (Max: 6)
              {!isGuestCountValid && (
                <span className="text-red-500 block">⚠️ At least 1 adult required, max 6 guests total</span>
              )}
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            💰 Price Range (per night)
          </label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              min={50}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⭐ Star Rating
          </label>
          <div className="px-2">
            <Slider
              value={starRating}
              onValueChange={setStarRating}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span className="flex items-center">
                {starRating[0]} <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
              </span>
              <span className="flex items-center">
                {starRating[1]} <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
              </span>
            </div>
          </div>
        </div>

        {/* Distance from Haram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📍 Distance from Holy Sites
          </label>
          <div className="px-2">
            <Slider
              value={distanceRange}
              onValueChange={setDistanceRange}
              max={2000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{distanceRange[0]}m</span>
              <span>{distanceRange[1]}m</span>
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <Button 
          onClick={handleFiltersChange}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={!city || !isGuestCountValid}
        >
          🔍 Apply Filters
        </Button>

        {/* Clear Filters */}
        <Button 
          variant="outline"
          onClick={() => {
            setCity('');
            setRooms(1);
            setAdults(1);
            setChildren(0);
            setPriceRange([50, 1000]);
            setStarRating([1, 5]);
            setDistanceRange([0, 2000]);
          }}
          className="w-full border-gray-300 text-gray-600"
        >
          🗑️ Clear All
        </Button>
      </CardContent>
    </Card>
  );
};

export default HotelFilters;
