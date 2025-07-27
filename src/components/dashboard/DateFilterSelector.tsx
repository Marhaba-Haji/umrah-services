
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateFilter } from "./DashboardTabs";

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
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
          <SelectItem value="tillDate">Till Date</SelectItem>
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
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default DateFilterSelector;
