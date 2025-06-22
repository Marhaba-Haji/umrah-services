
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';

interface HotelFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const HotelFilters = ({ onFiltersChange }: HotelFiltersProps) => {
  const [priceRange, setPriceRange] = useState([50, 1000]);
  const [starRating, setStarRating] = useState([1, 5]);
  const [distanceRange, setDistanceRange] = useState([0, 2000]);

  const handleFiltersChange = () => {
    const filters = {
      priceRange,
      starRating,
      distanceRange
    };
    onFiltersChange(filters);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          🔍 Filter Hotels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
        >
          🔍 Apply Filters
        </Button>

        {/* Clear Filters */}
        <Button 
          variant="outline"
          onClick={() => {
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
