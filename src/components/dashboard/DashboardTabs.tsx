
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeadsDashboard from "./LeadsDashboard";
import BookingsDashboard from "./BookingsDashboard";
import SalesDashboard from "./SalesDashboard";
import CMSDashboard from "./CMSDashboard";

export type DateFilter = "daily" | "weekly" | "monthly" | "yearly" | "tillDate" | "custom";

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("leads");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="cms">CMS Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="space-y-4">
          <LeadsDashboard />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <BookingsDashboard />
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <SalesDashboard />
        </TabsContent>
        
        <TabsContent value="cms" className="space-y-4">
          <CMSDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
