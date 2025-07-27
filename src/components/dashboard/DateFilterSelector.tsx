
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export type DateFilter = 
  | "today" 
  | "yesterday" 
  | "thisWeek" 
  | "lastWeek" 
  | "thisMonth" 
  | "lastMonth" 
  | "last3Months" 
  | "last6Months" 
  | "thisYear" 
  | "lastYear" 
  | "custom";

interface DateFilterSelectorProps {
  value: DateFilter;
  onChange: (value: DateFilter) => void;
  customDateRange?: { from: Date; to: Date };
  onCustomDateChange?: (range: { from: Date; to: Date }) => void;
}

const DateFilterSelector: React.FC<DateFilterSelectorProps> = ({
  value,
  onChange,
  customDateRange,
  onCustomDateChange
}) => {
  const [showCustomDate, setShowCustomDate] = useState(false);

  const handleFilterChange = (newValue: DateFilter) => {
    onChange(newValue);
    if (newValue === "custom") {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Select value={value} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="thisWeek">This Week Until Today</SelectItem>
          <SelectItem value="lastWeek">Last Week</SelectItem>
          <SelectItem value="thisMonth">This Month Until Today</SelectItem>
          <SelectItem value="lastMonth">Last Month</SelectItem>
          <SelectItem value="last3Months">Last 3 Months</SelectItem>
          <SelectItem value="last6Months">Last 6 Months</SelectItem>
          <SelectItem value="thisYear">This Year Until Today</SelectItem>
          <SelectItem value="lastYear">Last Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {(value === "custom" || showCustomDate) && (
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange?.from ? format(customDateRange.from, "PPP") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={customDateRange?.from}
                onSelect={(date) => {
                  if (date && onCustomDateChange) {
                    onCustomDateChange({
                      from: date,
                      to: customDateRange?.to || date
                    });
                  }
                }}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange?.to ? format(customDateRange.to, "PPP") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={customDateRange?.to}
                onSelect={(date) => {
                  if (date && onCustomDateChange) {
                    onCustomDateChange({
                      from: customDateRange?.from || date,
                      to: date
                    });
                  }
                }}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default DateFilterSelector;
