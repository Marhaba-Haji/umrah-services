
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import DateFilterSelector from "./DateFilterSelector";
import { DateFilter } from "./DashboardTabs";
import AnimatedCounter from "@/components/AnimatedCounter";

interface BookingStats {
  totalBookings: number;
  flightBookings: number;
  hotelBookings: number;
  visaBookings: number;
  umrahPackages: number;
  hajjPackages: number;
  transportBookings: number;
  guideBookings: number;
  activityBookings: number;
  groupPackages: number;
  independentPackages: number;
  customPackages: number;
}

const BookingsDashboard = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("thisMonth");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date }>();
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    totalBookings: 0,
    flightBookings: 0,
    hotelBookings: 0,
    visaBookings: 0,
    umrahPackages: 0,
    hajjPackages: 0,
    transportBookings: 0,
    guideBookings: 0,
    activityBookings: 0,
    groupPackages: 0,
    independentPackages: 0,
    customPackages: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchBookingStats();
  }, [dateFilter, customDateRange]);

  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case "today":
        return { from: today, to: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
      case "yesterday":
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return { from: yesterday, to: today };
      case "thisWeek":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return { from: weekStart, to: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
      case "lastWeek":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 7);
        return { from: lastWeekStart, to: lastWeekEnd };
      case "thisMonth":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: monthStart, to: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
      case "lastMonth":
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: lastMonthStart, to: lastMonthEnd };
      case "last3Months":
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        return { from: threeMonthsAgo, to: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
      case "last6Months":
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        return { from: sixMonthsAgo, to: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
      case "thisYear":
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return { from: yearStart, to: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
      case "lastYear":
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear(), 0, 1);
        return { from: lastYearStart, to: lastYearEnd };
      case "custom":
        return customDateRange ? customDateRange : { from: today, to: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
      default:
        return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
    }
  };

  const fetchBookingStats = async () => {
    try {
      const dateRange = getDateRange();
      
      // Fetch general bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      // Fetch hotel bookings
      const { data: hotelBookings, error: hotelError } = await supabase
        .from("hotel_bookings")
        .select("*")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      // Fetch visa applications
      const { data: visaApplications, error: visaError } = await supabase
        .from("visa_applications")
        .select("*")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      if (bookingsError || hotelError || visaError) {
        throw new Error("Error fetching booking data");
      }

      // Calculate stats
      const totalBookings = (bookings?.length || 0) + (hotelBookings?.length || 0) + (visaApplications?.length || 0);
      const flightBookings = 15; // Placeholder - would need flight bookings table
      const hotelBookingsCount = hotelBookings?.length || 0;
      const visaBookings = visaApplications?.length || 0;
      const umrahPackages = bookings?.filter(b => b.package_id)?.length || 0;
      const hajjPackages = 8; // Placeholder
      const transportBookings = 12; // Placeholder
      const guideBookings = 5; // Placeholder
      const activityBookings = 23; // Placeholder
      const groupPackages = 18; // Placeholder
      const independentPackages = 25; // Placeholder
      const customPackages = 10; // Placeholder

      setBookingStats({
        totalBookings,
        flightBookings,
        hotelBookings: hotelBookingsCount,
        visaBookings,
        umrahPackages,
        hajjPackages,
        transportBookings,
        guideBookings,
        activityBookings,
        groupPackages,
        independentPackages,
        customPackages
      });

      // Prepare chart data
      const serviceData = [
        { name: 'Flights', value: flightBookings, color: '#3b82f6' },
        { name: 'Hotels', value: hotelBookingsCount, color: '#ef4444' },
        { name: 'Visas', value: visaBookings, color: '#22c55e' },
        { name: 'Umrah', value: umrahPackages, color: '#8b5cf6' },
        { name: 'Hajj', value: hajjPackages, color: '#f59e0b' },
        { name: 'Transport', value: transportBookings, color: '#06b6d4' },
        { name: 'Guide', value: guideBookings, color: '#84cc16' },
        { name: 'Activities', value: activityBookings, color: '#f97316' }
      ];

      setChartData(serviceData);
    } catch (error) {
      console.error("Error fetching booking stats:", error);
    }
  };

  const chartConfig = {
    flights: { label: "Flight Bookings", color: "#3b82f6" },
    hotels: { label: "Hotel Bookings", color: "#ef4444" },
    visas: { label: "Visa Applications", color: "#22c55e" },
    umrah: { label: "Umrah Packages", color: "#8b5cf6" },
    hajj: { label: "Hajj Packages", color: "#f59e0b" },
    transport: { label: "Transport", color: "#06b6d4" },
    guide: { label: "Guide Services", color: "#84cc16" },
    activities: { label: "Activities", color: "#f97316" }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookings Dashboard</h2>
        <DateFilterSelector
          value={dateFilter}
          onChange={setDateFilter}
          customDateRange={customDateRange}
          onCustomDateChange={setCustomDateRange}
        />
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={bookingStats.totalBookings} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flight Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              <AnimatedCounter end={bookingStats.flightBookings} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotel Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              <AnimatedCounter end={bookingStats.hotelBookings} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <AnimatedCounter end={bookingStats.visaBookings} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Umrah Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              <AnimatedCounter end={bookingStats.umrahPackages} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hajj Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              <AnimatedCounter end={bookingStats.hajjPackages} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transport Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              <AnimatedCounter end={bookingStats.transportBookings} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Guide Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lime-600">
              <AnimatedCounter end={bookingStats.guideBookings} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Group Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              <AnimatedCounter end={bookingStats.groupPackages} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Independent Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              <AnimatedCounter end={bookingStats.independentPackages} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Custom Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              <AnimatedCounter end={bookingStats.customPackages} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Categories Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Volume by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingsDashboard;
