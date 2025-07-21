import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackageManager from "@/components/cms/PackageManager";
import UsersManager from "@/components/cms/UsersManager";
import BookingsManager from "@/components/cms/BookingsManager";
import GroupFlightsManager from "@/components/cms/GroupFlightsManager";
import GuideServicesManager from "@/components/cms/GuideServicesManager";
import PayUGatewayManager from "@/components/cms/PayUGatewayManager";
import HotelManager from "@/components/cms/HotelManager";
import TransportManager from "@/components/cms/TransportManager";
import ActivityManager from "@/components/cms/ActivityManager";
import ZiarathManager from "@/components/cms/ZiarathManager";
import BlogManager from "@/components/cms/BlogManager";
import SEOManager from "@/components/seo/SEOManager";
import LeadManager from "@/components/crm/LeadManager";
import SaudiVisasManager from "@/components/cms/SaudiVisasManager";
import HajjPackagesManager from "@/components/cms/HajjPackagesManager";
import MarkupManagement from "@/components/cms/MarkupManagement";
import AnimatedCounter from "@/components/AnimatedCounter";
import FaqsManager from "@/components/cms/FaqsManager";

const APP_NAME = "Marhaba Admin";

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuSections = [
    {
      heading: "Dashboard",
      items: [{ id: "dashboard", label: "Dashboard", icon: "📊" }],
    },
    {
      heading: "Management",
      items: [
        { id: "package-manager", label: "Package Manager", icon: "📦" },
        {
          id: "hajj-packages-manager",
          label: "Hajj Packages Manager",
          icon: "🏛️",
        },
        { id: "users-manager", label: "Users Manager", icon: "👤" },
        { id: "bookings-manager", label: "Bookings Manager", icon: "📅" },
        { id: "flights-manager", label: "Flights Manager", icon: "✈️" },
        { id: "guides-manager", label: "Guides Manager", icon: "🧑‍🏫" },
        { id: "visa-manager", label: "Visa Manager", icon: "🛂" },
        { id: "hotel-manager", label: "Hotel Manager", icon: "🏨" },
        { id: "transport-manager", label: "Transport Manager", icon: "🚗" },
        { id: "activity-manager", label: "Activity Manager", icon: "🎯" },
        { id: "ziarath-manager", label: "Ziarath Manager", icon: "🕌" },
        { id: "blog-manager", label: "Blog Manager", icon: "📝" },
        { id: "lead-manager", label: "Leads Manager", icon: "📋" },
        { id: "faqs-manager", label: "FAQs", icon: "❓" },
      ],
    },
    {
      heading: "Settings",
      items: [
        { id: "payment-gateway", label: "Payment Gateway", icon: "🔒" },
        { id: "seo-manager", label: "SEO Settings", icon: "🔍" },
        { id: "markup-management", label: "Markup Management", icon: "📝" }, // Added Markup Management
      ],
    },
  ];

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const renderDashboard = () => {
    // Placeholder for now, will fetch and show stats in next step
    const modules = [
      { key: "bookings", label: "Bookings" },
      { key: "leads", label: "Leads" },
      { key: "umrahPackages", label: "Umrah Packages" },
      { key: "hajjPackages", label: "Hajj Packages" },
      { key: "groupFlights", label: "Group Flights" },
      { key: "visas", label: "Saudi Visas" },
      { key: "hotels", label: "Hotels" },
      { key: "transport", label: "Transport" },
      { key: "activities", label: "Activities" },
      { key: "guides", label: "Guides" },
      { key: "ziarath", label: "Ziarath" },
    ];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <Card key={mod.key} className="shadow border border-gray-100">
            <CardHeader>
              <CardTitle>{mod.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">
                <AnimatedCounter end={0} />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Total {mod.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "package-manager":
        return <PackageManager />;
      case "hajj-packages-manager":
        return <HajjPackagesManager />;
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
      case "visa-manager":
        return <SaudiVisasManager />;
      case "hotel-manager":
        return <HotelManager />;
      case "transport-manager":
        return <TransportManager />;
      case "activity-manager":
        return <ActivityManager />;
      case "ziarath-manager":
        return <ZiarathManager />;
      case "blog-manager":
        return <BlogManager />;
      case "seo-manager":
        return <SEOManager />;
      case "markup-management":
        return <MarkupManagement />;
      case "lead-manager":
        return <LeadManager />;
      case "faqs-manager":
        return <FaqsManager />;
      case "logout":
        handleLogout();
        return null;
      default:
        return renderDashboard();
    }
  };

  // Breadcrumb logic
  const currentMenu = menuSections
    .flatMap((s) => s.items)
    .find((i) => i.id === activeTab);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 p-0 flex flex-col h-full shadow-lg">
        {/* Logo/App Name */}
        <div className="flex items-center justify-center h-16 font-bold text-xl bg-white border-b border-gray-300">
          {APP_NAME}
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {menuSections.map((section) => (
            <div key={section.heading} className="mb-6">
              <div className="text-xs font-semibold text-gray-500 px-2 mb-2 uppercase tracking-wider">
                {section.heading}
              </div>
              <ul>
                {section.items.map((item) => (
                  <li key={item.id} className="mb-1">
                    <Button
                      className={`w-full justify-start transition-colors duration-150 ${activeTab === item.id ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-blue-100"}`}
                      variant="ghost"
                      style={{
                        fontWeight: activeTab === item.id ? "bold" : "normal",
                      }}
                      onClick={() => setActiveTab(item.id)}
                      title={item.label}
                    >
                      <span className="mr-2 text-lg">{item.icon}</span>{" "}
                      {item.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* Logout at bottom */}
        <div className="p-4 border-t border-gray-300">
          <Button
            className="w-full justify-start bg-red-100 text-red-700 hover:bg-red-200"
            variant="ghost"
            onClick={() => setActiveTab("logout")}
            title="Logout"
          >
            <span className="mr-2 text-lg">🚪</span> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-4 flex items-center space-x-2 text-gray-500 text-sm">
          <span>Control Panel</span>
          <span className="mx-1">/</span>
          <span className="font-semibold text-gray-800">
            {currentMenu ? currentMenu.label : "Dashboard"}
          </span>
        </div>
        <Card className="shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle>
              {currentMenu ? currentMenu.label : "Dashboard"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ControlPanel;
