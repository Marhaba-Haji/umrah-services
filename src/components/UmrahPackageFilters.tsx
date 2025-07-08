import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, Filter } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertFromINR } from "@/lib/utils";

interface UmrahPackageFiltersProps {
  onFiltersChange: (filters: unknown) => void;
  currency: string;
}

const UmrahPackageFilters = ({
  onFiltersChange,
  currency,
}: UmrahPackageFiltersProps) => {
  const [priceRange, setPriceRange] = useState([1000, 5000]);
  const [duration, setDuration] = useState("");
  const [makkahDistance, setMakkahDistance] = useState([0, 2000]);
  const [madinahDistance, setMadinahDistance] = useState([0, 2000]);
  const [flightIncluded, setFlightIncluded] = useState("");
  const [makkahStars, setMakkahStars] = useState<number[]>([]);
  const [madinahStars, setMadinahStars] = useState<number[]>([]);
  const [mealPlan, setMealPlan] = useState("");

  const handleFiltersChange = () => {
    const filters = {
      priceRange,
      duration,
      makkahDistance,
      madinahDistance,
      flightIncluded,
      makkahStars,
      madinahStars,
      mealPlan,
    };
    onFiltersChange(filters);
  };

  const handleStarRatingChange = (
    stars: number,
    type: "makkah" | "madinah",
    checked: boolean,
  ) => {
    if (type === "makkah") {
      if (checked) {
        setMakkahStars([...makkahStars, stars]);
      } else {
        setMakkahStars(makkahStars.filter((s) => s !== stars));
      }
    } else {
      if (checked) {
        setMadinahStars([...madinahStars, stars]);
      } else {
        setMadinahStars(madinahStars.filter((s) => s !== stars));
      }
    }
  };

  return (
    <Card className="sticky top-4 h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filter Packages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            💰 Price Range ({currency})
          </label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={5000}
              min={1000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>
                {(() => {
                  const { symbol, value } = convertFromINR(
                    priceRange[0],
                    currency,
                  );
                  return `${symbol}${value.toLocaleString()}`;
                })()}
              </span>
              <span>
                {(() => {
                  const { symbol, value } = convertFromINR(
                    priceRange[1],
                    currency,
                  );
                  return `${symbol}${value.toLocaleString()}`;
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⏱️ Duration
          </label>
          <RadioGroup value={duration} onValueChange={setDuration}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="short" id="short" />
              <Label htmlFor="short">Short (5-7 days)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard (8-12 days)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="long" id="long" />
              <Label htmlFor="long">Long (13+ days)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Makkah Hotel Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🕋 Makkah Hotel Distance (meters)
          </label>
          <div className="px-2">
            <Slider
              value={makkahDistance}
              onValueChange={setMakkahDistance}
              max={2000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{makkahDistance[0]}m</span>
              <span>{makkahDistance[1]}m</span>
            </div>
          </div>
        </div>

        {/* Madinah Hotel Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🕌 Madinah Hotel Distance (meters)
          </label>
          <div className="px-2">
            <Slider
              value={madinahDistance}
              onValueChange={setMadinahDistance}
              max={2000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{madinahDistance[0]}m</span>
              <span>{madinahDistance[1]}m</span>
            </div>
          </div>
        </div>

        {/* Flight Inclusion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ✈️ Flight
          </label>
          <RadioGroup value={flightIncluded} onValueChange={setFlightIncluded}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="included" id="included" />
              <Label htmlFor="included">Included</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excluded" id="excluded" />
              <Label htmlFor="excluded">Excluded</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Makkah Hotel Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⭐ Makkah Hotel Category
          </label>
          <div className="space-y-2">
            {[3, 4, 5].map((stars) => (
              <div key={stars} className="flex items-center space-x-2">
                <Checkbox
                  id={`makkah-${stars}`}
                  checked={makkahStars.includes(stars)}
                  onCheckedChange={(checked) =>
                    handleStarRatingChange(stars, "makkah", checked as boolean)
                  }
                />
                <Label
                  htmlFor={`makkah-${stars}`}
                  className="flex items-center"
                >
                  {stars}{" "}
                  {Array.from({ length: stars }, (_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Madinah Hotel Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⭐ Madinah Hotel Category
          </label>
          <div className="space-y-2">
            {[3, 4, 5].map((stars) => (
              <div key={stars} className="flex items-center space-x-2">
                <Checkbox
                  id={`madinah-${stars}`}
                  checked={madinahStars.includes(stars)}
                  onCheckedChange={(checked) =>
                    handleStarRatingChange(stars, "madinah", checked as boolean)
                  }
                />
                <Label
                  htmlFor={`madinah-${stars}`}
                  className="flex items-center"
                >
                  {stars}{" "}
                  {Array.from({ length: stars }, (_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🍽️ Meal Plan
          </label>
          <RadioGroup value={mealPlan} onValueChange={setMealPlan}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="room-only" id="room-only" />
              <Label htmlFor="room-only">Room Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="breakfast" id="breakfast" />
              <Label htmlFor="breakfast">Breakfast</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="half-board" id="half-board" />
              <Label htmlFor="half-board">Half Board</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full-board" id="full-board" />
              <Label htmlFor="full-board">Full Board</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Apply Filters Button */}
        <Button
          onClick={handleFiltersChange}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Apply Filters
        </Button>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={() => {
            setPriceRange([1000, 5000]);
            setDuration("");
            setMakkahDistance([0, 2000]);
            setMadinahDistance([0, 2000]);
            setFlightIncluded("");
            setMakkahStars([]);
            setMadinahStars([]);
            setMealPlan("");
          }}
          className="w-full border-gray-300 text-gray-600"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default UmrahPackageFilters;
