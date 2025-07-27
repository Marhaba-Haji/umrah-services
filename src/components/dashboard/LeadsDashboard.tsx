
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import DateFilterSelector from "./DateFilterSelector";
import { DateFilter } from "./DashboardTabs";
import AnimatedCounter from "@/components/AnimatedCounter";

interface LeadStats {
  totalLeads: number;
  newLeads: number;
  hotLeads: number;
  coldLeads: number;
  deadLeads: number;
  convertedLeads: number;
  conversionRate: number;
}

const LeadsDashboard = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("monthly");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date }>();
  const [leadStats, setLeadStats] = useState<LeadStats>({
    totalLeads: 0,
    newLeads: 0,
    hotLeads: 0,
    coldLeads: 0,
    deadLeads: 0,
    convertedLeads: 0,
    conversionRate: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchLeadStats();
  }, [dateFilter, customDateRange]);

  const fetchLeadStats = async () => {
    try {
      // Get date range based on filter
      let dateCondition = "";
      const now = new Date();
      
      switch (dateFilter) {
        case "daily":
          dateCondition = `created_at >= '${now.toISOString().split('T')[0]}'`;
          break;
        case "weekly":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateCondition = `created_at >= '${weekAgo.toISOString()}'`;
          break;
        case "monthly":
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          dateCondition = `created_at >= '${monthAgo.toISOString()}'`;
          break;
        case "yearly":
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          dateCondition = `created_at >= '${yearAgo.toISOString()}'`;
          break;
        case "custom":
          if (customDateRange) {
            dateCondition = `created_at >= '${customDateRange.from.toISOString()}' AND created_at <= '${customDateRange.to.toISOString()}'`;
          }
          break;
        default:
          dateCondition = "TRUE";
      }

      const query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (dateCondition !== "TRUE") {
        // This is a simplified approach - in production you'd want to use proper date filtering
        const { data, error } = await query;
        if (error) throw error;
        
        // Calculate stats
        const totalLeads = data?.length || 0;
        const newLeads = data?.filter(lead => lead.status === 'new').length || 0;
        const hotLeads = data?.filter(lead => lead.status === 'hot').length || 0;
        const coldLeads = data?.filter(lead => lead.status === 'cold').length || 0;
        const deadLeads = data?.filter(lead => lead.status === 'dead').length || 0;
        const convertedLeads = data?.filter(lead => lead.status === 'converted').length || 0;
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

        setLeadStats({
          totalLeads,
          newLeads,
          hotLeads,
          coldLeads,
          deadLeads,
          convertedLeads,
          conversionRate
        });

        // Prepare chart data
        const statusData = [
          { name: 'New', value: newLeads, color: '#3b82f6' },
          { name: 'Hot', value: hotLeads, color: '#ef4444' },
          { name: 'Cold', value: coldLeads, color: '#6b7280' },
          { name: 'Dead', value: deadLeads, color: '#000000' },
          { name: 'Converted', value: convertedLeads, color: '#22c55e' }
        ];

        setChartData(statusData);
      }
    } catch (error) {
      console.error("Error fetching lead stats:", error);
    }
  };

  const chartConfig = {
    new: { label: "New Leads", color: "#3b82f6" },
    hot: { label: "Hot Leads", color: "#ef4444" },
    cold: { label: "Cold Leads", color: "#6b7280" },
    dead: { label: "Dead Leads", color: "#000000" },
    converted: { label: "Converted", color: "#22c55e" }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leads Dashboard</h2>
        <DateFilterSelector
          value={dateFilter}
          onChange={setDateFilter}
          customDateRange={customDateRange}
          onCustomDateChange={setCustomDateRange}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={leadStats.totalLeads} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              <AnimatedCounter end={leadStats.newLeads} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              <AnimatedCounter end={leadStats.hotLeads} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <AnimatedCounter end={leadStats.conversionRate} />%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Cold Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              <AnimatedCounter end={leadStats.coldLeads} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dead Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              <AnimatedCounter end={leadStats.deadLeads} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Converted Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <AnimatedCounter end={leadStats.convertedLeads} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
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
            <CardTitle>Lead Status Breakdown</CardTitle>
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

export default LeadsDashboard;
