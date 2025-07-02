import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';

interface HotelFiltersProps {
  onFilterChange: (filters: unknown) => void;
}

const HotelFilters = ({ onFilterChange }: HotelFiltersProps) => {
  const [city, setCity] = useState('makkah');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [starRating, setStarRating] = useState<number[]>([]);
  const [distanceRange, setDistanceRange] = useState([0, 15000]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const ALL_AMENITIES = ['Free WiFi', 'Parking', 'Restaurant', 'Spa', 'Gym', 'Pool'];

  useEffect(() => {
    onFilterChange({
      city,
      priceRange,
      starRating,
      distanceRange,
      amenities,
    });
  }, [city, priceRange, starRating, distanceRange, amenities]);

  const handleStarRatingChange = (rating: number) => {
    setStarRating(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };
  
  const handleAmenityChange = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setCity('makkah');
    setPriceRange([0, 10000]);
    setStarRating([]);
    setDistanceRange([0, 15000]);
    setAmenities([]);
  };

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
          <label className="block text-sm font-medium text-gray-700 mb-3">
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

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            💰 Price Range (per night)
          </label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={10000}
              min={0}
              step={50}
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
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`star-${rating}`}
                  checked={starRating.includes(rating)}
                  onCheckedChange={() => handleStarRatingChange(rating)}
                />
                <label htmlFor={`star-${rating}`} className="flex items-center text-sm text-gray-700">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  {rating === 1 ? <span className="ml-1">1 Star</span> : null}
                  {rating === 2 ? <span className="ml-1">2 Stars</span> : null}
                </label>
              </div>
            ))}
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
              max={15000}
              min={0}
              step={100}
              className="w-full"
              disabled={city === 'makkah' ? false : city === 'madinah' ? false : true}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{distanceRange[0]}m</span>
              <span>{distanceRange[1]}m</span>
            </div>
            {city === 'all' && (
              <p className="text-xs text-amber-600 mt-2">
                Please select a city to enable distance filtering.
              </p>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🏨 Amenities
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_AMENITIES.map(amenity => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityChange(amenity)}
                />
                <label htmlFor={`amenity-${amenity}`} className="text-sm text-gray-700">{amenity}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <Button 
          variant="outline"
          onClick={clearFilters}
          className="w-full border-gray-300 text-gray-600"
        >
          🗑️ Clear All
        </Button>
      </CardContent>
    </Card>
  );
};

export default HotelFilters;
