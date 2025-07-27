
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import DateFilterSelector from "./DateFilterSelector";
import { DateFilter } from "./DashboardTabs";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SalesStats {
  totalRevenue: number;
  flightsSales: number;
  hotelsSales: number;
  visasSales: number;
  umrahSales: number;
  hajjSales: number;
  transportSales: number;
  guideSales: number;
  activitiesSales: number;
}

const SalesDashboard = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("thisMonth");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date }>();
  const [salesStats, setSalesStats] = useState<SalesStats>({
    totalRevenue: 0,
    flightsSales: 0,
    hotelsSales: 0,
    visasSales: 0,
    umrahSales: 0,
    hajjSales: 0,
    transportSales: 0,
    guideSales: 0,
    activitiesSales: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topSelling, setTopSelling] = useState<any[]>([]);

  useEffect(() => {
    fetchSalesStats();
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

  const fetchSalesStats = async () => {
    try {
      const dateRange = getDateRange();
      
      // Fetch payment transactions for revenue calculation
      const { data: transactions, error: transactionsError } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("payment_status", "completed")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      // Fetch bookings for sales breakdown
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      if (transactionsError || bookingsError) {
        throw new Error("Error fetching sales data");
      }

      // Calculate revenue from completed transactions
      const totalRevenue = transactions?.reduce((sum, transaction) => {
        return sum + (parseFloat(transaction.amount) || 0);
      }, 0) || 0;

      // Mock data for different service categories (in production, you'd calculate from actual data)
      const flightsSales = 45000;
      const hotelsSales = 32000;
      const visasSales = 15000;
      const umrahSales = 78000;
      const hajjSales = 125000;
      const transportSales = 12000;
      const guideSales = 8000;
      const activitiesSales = 18000;

      setSalesStats({
        totalRevenue,
        flightsSales,
        hotelsSales,
        visasSales,
        umrahSales,
        hajjSales,
        transportSales,
        guideSales,
        activitiesSales
      });

      // Prepare chart data
      const salesData = [
        { name: 'Flights', value: flightsSales, color: '#3b82f6' },
        { name: 'Hotels', value: hotelsSales, color: '#ef4444' },
        { name: 'Visas', value: visasSales, color: '#22c55e' },
        { name: 'Umrah', value: umrahSales, color: '#8b5cf6' },
        { name: 'Hajj', value: hajjSales, color: '#f59e0b' },
        { name: 'Transport', value: transportSales, color: '#06b6d4' },
        { name: 'Guide', value: guideSales, color: '#84cc16' },
        { name: 'Activities', value: activitiesSales, color: '#f97316' }
      ];

      setChartData(salesData);

      // Mock top selling data
      const topSellingData = [
        { category: 'Hajj Packages', item: 'Premium Hajj Package', sales: 125000, units: 25 },
        { category: 'Umrah Packages', item: 'Luxury Umrah Package', sales: 78000, units: 39 },
        { category: 'Flights', item: 'Jeddah Return Flight', sales: 45000, units: 90 },
        { category: 'Hotels', item: 'Madinah Hotel Booking', sales: 32000, units: 64 },
        { category: 'Activities', item: 'Ziarath Tours', sales: 18000, units: 36 }
      ];

      setTopSelling(topSellingData);
    } catch (error) {
      console.error("Error fetching sales stats:", error);
    }
  };

  const chartConfig = {
    flights: { label: "Flight Sales", color: "#3b82f6" },
    hotels: { label: "Hotel Sales", color: "#ef4444" },
    visas: { label: "Visa Sales", color: "#22c55e" },
    umrah: { label: "Umrah Sales", color: "#8b5cf6" },
    hajj: { label: "Hajj Sales", color: "#f59e0b" },
    transport: { label: "Transport Sales", color: "#06b6d4" },
    guide: { label: "Guide Sales", color: "#84cc16" },
    activities: { label: "Activities Sales", color: "#f97316" }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Dashboard</h2>
        <DateFilterSelector
          value={dateFilter}
          onChange={setDateFilter}
          customDateRange={customDateRange}
          onCustomDateChange={setCustomDateRange}
        />
      </div>

      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $<AnimatedCounter end={salesStats.totalRevenue} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hajj Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              $<AnimatedCounter end={salesStats.hajjSales} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umrah Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              $<AnimatedCounter end={salesStats.umrahSales} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flight Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              $<AnimatedCounter end={salesStats.flightsSales} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Hotel Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              $<AnimatedCounter end={salesStats.hotelsSales} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Visa Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              $<AnimatedCounter end={salesStats.visasSales} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transport Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              $<AnimatedCounter end={salesStats.transportSales} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activities Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              $<AnimatedCounter end={salesStats.activitiesSales} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution by Category</CardTitle>
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
            <CardTitle>Revenue by Service Category</CardTitle>
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

      {/* Top Selling Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Sales ($)</TableHead>
                <TableHead>Units Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSelling.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>${item.sales.toLocaleString()}</TableCell>
                  <TableCell>{item.units}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
