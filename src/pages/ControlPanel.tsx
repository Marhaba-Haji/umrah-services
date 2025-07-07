import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { PackageManager } from "@/components/cms/PackageManager";
import { UsersManager } from "@/components/cms/UsersManager";
import { BookingsManager } from "@/components/cms/BookingsManager";
import { GroupFlightsManager } from "@/components/cms/GroupFlightsManager";
import { GuideServicesManager } from "@/components/cms/GuideServicesManager";
import PayUGatewayManager from "@/components/cms/PayUGatewayManager";

const ControlPanel = () => {
  const router = useRouter();
  const user = useUser();
  const [activeTab, setActiveTab] = useState("package-manager");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      if (user) {
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching admin status:", error);
          toast({
            title: "Error",
            description: "Failed to check admin status",
            variant: "destructive",
          });
        } else {
          setIsAdmin(!!data);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              You do not have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { id: "package-manager", label: "Package Manager", icon: "📦" },
    { id: "users-manager", label: "Users Manager", icon: "👤" },
    { id: "bookings-manager", label: "Bookings Manager", icon: "📅" },
    { id: "flights-manager", label: "Flights Manager", icon: "✈️" },
    { id: "guides-manager", label: "Guides Manager", icon: "🧑‍🏫" },
    { id: "payment-gateway", label: "Payment Gateway", icon: "🔒" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "package-manager":
        return <PackageManager />;
      case "users-manager":
        return <UsersManager />;
      case "bookings-manager":
        return <BookingsManager />;
      case "flights-manager":
        return <GroupFlightsManager />;
      case "guides-manager":
        return <GuideServicesManager />;
      case "payment-gateway":
        return <PayUGatewayManager />;
      default:
        return <PackageManager />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 p-4">
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className="mb-2">
                <Button
                  className="w-full justify-start"
                  variant={activeTab === item.id ? "default" : "outline"}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon} {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Control Panel</CardTitle>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ControlPanel;
