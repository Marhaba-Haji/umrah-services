
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import DateFilterSelector from "./DateFilterSelector";
import { DateFilter } from "./DashboardTabs";
import AnimatedCounter from "@/components/AnimatedCounter";

interface CMSStats {
  groupUmrahPackages: { total: number; active: number; inactive: number };
  independentUmrahPackages: { total: number; active: number; inactive: number };
  hajjPackages: { total: number; active: number; inactive: number };
  flights: { total: number; active: number; inactive: number };
  hotels: { total: number; active: number; inactive: number };
  visas: { total: number; active: number; inactive: number };
  transport: { total: number; active: number; inactive: number };
  guides: { total: number; active: number; inactive: number };
  activities: { total: number; active: number; inactive: number };
}

const CMSDashboard = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("monthly");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date }>();
  const [cmsStats, setCmsStats] = useState<CMSStats>({
    groupUmrahPackages: { total: 0, active: 0, inactive: 0 },
    independentUmrahPackages: { total: 0, active: 0, inactive: 0 },
    hajjPackages: { total: 0, active: 0, inactive: 0 },
    flights: { total: 0, active: 0, inactive: 0 },
    hotels: { total: 0, active: 0, inactive: 0 },
    visas: { total: 0, active: 0, inactive: 0 },
    transport: { total: 0, active: 0, inactive: 0 },
    guides: { total: 0, active: 0, inactive: 0 },
    activities: { total: 0, active: 0, inactive: 0 }
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchCMSStats();
  }, [dateFilter, customDateRange]);

  const fetchCMSStats = async () => {
    try {
      // Fetch Umrah packages
      const { data: umrahPackages, error: umrahError } = await supabase
        .from("umrah_packages")
        .select("*");

      // Fetch Hajj packages
      const { data: hajjPackages, error: hajjError } = await supabase
        .from("hajj_packages")
        .select("*");

      // Fetch group flights
      const { data: groupFlights, error: flightsError } = await supabase
        .from("group_flights")
        .select("*");

      // Fetch hotels
      const { data: hotels, error: hotelsError } = await supabase
        .from("hotels")
        .select("*");

      // Fetch visas
      const { data: visas, error: visasError } = await supabase
        .from("saudi_visas")
        .select("*");

      // Fetch transport services
      const { data: transport, error: transportError } = await supabase
        .from("transport_services")
        .select("*");

      // Fetch guide services
      const { data: guides, error: guidesError } = await supabase
        .from("guide_services")
        .select("*");

      // Fetch activities
      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("*");

      if (umrahError || hajjError || flightsError || hotelsError || visasError || transportError || guidesError || activitiesError) {
        throw new Error("Error fetching CMS data");
      }

      // Calculate stats for each category
      const calculateStats = (items: any[], statusField: string = 'status', activeValue: string = 'active') => {
        const total = items?.length || 0;
        const active = items?.filter(item => item[statusField] === activeValue).length || 0;
        const inactive = total - active;
        return { total, active, inactive };
      };

      // Group vs Independent Umrah packages (assuming is_group_package field exists)
      const groupUmrah = umrahPackages?.filter(pkg => pkg.is_group_package) || [];
      const independentUmrah = umrahPackages?.filter(pkg => !pkg.is_group_package) || [];

      const newStats: CMSStats = {
        groupUmrahPackages: calculateStats(groupUmrah),
        independentUmrahPackages: calculateStats(independentUmrah),
        hajjPackages: calculateStats(hajjPackages),
        flights: calculateStats(groupFlights),
        hotels: calculateStats(hotels, 'is_active', true),
        visas: calculateStats(visas),
        transport: calculateStats(transport, 'is_active', true),
        guides: calculateStats(guides),
        activities: calculateStats(activities) // Assuming activities don't have status field
      };

      setCmsStats(newStats);

      // Prepare chart data
      const totalData = [
        { name: 'Group Umrah', total: newStats.groupUmrahPackages.total, active: newStats.groupUmrahPackages.active, inactive: newStats.groupUmrahPackages.inactive },
        { name: 'Independent Umrah', total: newStats.independentUmrahPackages.total, active: newStats.independentUmrahPackages.active, inactive: newStats.independentUmrahPackages.inactive },
        { name: 'Hajj Packages', total: newStats.hajjPackages.total, active: newStats.hajjPackages.active, inactive: newStats.hajjPackages.inactive },
        { name: 'Flights', total: newStats.flights.total, active: newStats.flights.active, inactive: newStats.flights.inactive },
        { name: 'Hotels', total: newStats.hotels.total, active: newStats.hotels.active, inactive: newStats.hotels.inactive },
        { name: 'Visas', total: newStats.visas.total, active: newStats.visas.active, inactive: newStats.visas.inactive },
        { name: 'Transport', total: newStats.transport.total, active: newStats.transport.active, inactive: newStats.transport.inactive },
        { name: 'Guides', total: newStats.guides.total, active: newStats.guides.active, inactive: newStats.guides.inactive },
        { name: 'Activities', total: newStats.activities.total, active: newStats.activities.active, inactive: newStats.activities.inactive }
      ];

      setChartData(totalData);
    } catch (error) {
      console.error("Error fetching CMS stats:", error);
    }
  };

  const chartConfig = {
    total: { label: "Total", color: "#3b82f6" },
    active: { label: "Active", color: "#22c55e" },
    inactive: { label: "Inactive", color: "#ef4444" }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CMS Summary Dashboard</h2>
        <DateFilterSelector
          value={dateFilter}
          onChange={setDateFilter}
          customDateRange={customDateRange}
          onCustomDateChange={setCustomDateRange}
        />
      </div>

      {/* Package Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Group Umrah Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.groupUmrahPackages.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.groupUmrahPackages.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.groupUmrahPackages.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Independent Umrah Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.independentUmrahPackages.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.independentUmrahPackages.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.independentUmrahPackages.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hajj Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.hajjPackages.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.hajjPackages.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.hajjPackages.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.flights.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.flights.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.flights.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.hotels.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.hotels.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.hotels.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Visas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.visas.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.visas.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.visas.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transport</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.transport.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.transport.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.transport.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.guides.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.guides.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.guides.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={cmsStats.activities.total} />
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600">Active: {cmsStats.activities.active}</span>
                <span className="ml-2 text-red-600">Inactive: {cmsStats.activities.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="#3b82f6" />
                  <Bar dataKey="active" fill="#22c55e" />
                  <Bar dataKey="inactive" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Content Distribution</CardTitle>
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
                    dataKey="total"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CMSDashboard;
