import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Hotel,
  Package,
  Car,
  Plane,
  User,
  FileText,
  MapPin,
  MessageSquare,
  Users,
  Star,
  Settings,
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  PenTool,
  Folder,
  LayoutDashboard,
  Building2,
  Compass,
  Ticket,
  Plane as PlaneIcon,
  UserCheck,
  Stamp,
  Map,
  HeartHandshake,
  Search,
  Database,
  Textarea as TextareaComponent,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

// Import CMS components
import BlogManager from "../components/cms/BlogManager";
import CategoryManager from "../components/cms/CategoryManager";
import HotelManager from "../components/cms/HotelManager";
import PackageManager from "../components/cms/PackageManager";
import TransportManager from "../components/cms/TransportManager";
import GroupFlightsManager from "../components/cms/GroupFlightsManager";
import GuideServicesManager from "../components/cms/GuideServicesManager";
import SaudiVisasManager from "../components/cms/SaudiVisasManager";
import ZiarathManager from "../components/cms/ZiarathManager";
import LeadManager from "../components/crm/LeadManager";
import SEOManager from "../components/seo/SEOManager";
import DatabaseBackupManager from "../components/cms/DatabaseBackupManager";

// Define types
interface Activity {
  id: string;
  featured_image?: string;
  is_featured: boolean;
  city: string;
  name: string;
  slug: string;
  description: string;
  duration?: string;
  price?: number;
  inclusions?: string;
  exclusions?: string;
  features?: string;
  faqs?: { q: string; a: string }[];
  gallery?: string[];
  sites?: string;
  vehicle_prices?: Record<string, number>;
  [key: string]: unknown;
}
interface Vehicle {
  id: string;
  vehicle_name: string;
  vehicle_type: string;
  vehicle_image?: string;
  capacity?: number;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const ControlPanel = () => {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activityForm, setActivityForm] = useState({
    featured_image: "",
    is_featured: false,
    city: "",
    name: "",
    slug: "",
    description: "",
    duration: "",
    price: "",
    inclusions: "",
    exclusions: "",
    features: "",
    faqs: [],
    gallery: [],
    sites: "",
  });
  const [activityLoading, setActivityLoading] = useState(false);
  const { toast } = useToast();
  const [activityImageFile, setActivityImageFile] = useState<File | null>(null);
  const [activityImagePreview, setActivityImagePreview] = useState<string>("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclePrices, setVehiclePrices] = useState<{
    [vehicleId: string]: number;
  }>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Revenue",
      value: "$125,000",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Packages",
      value: "45",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Total Leads",
      value: "567",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const recentActivity = [
    { action: "New booking received", time: "2 minutes ago", type: "booking" },
    {
      action: "Lead converted to customer",
      time: "15 minutes ago",
      type: "lead",
    },
    { action: "New hotel added", time: "1 hour ago", type: "hotel" },
    { action: "Package updated", time: "2 hours ago", type: "package" },
  ];

  const handleActivityChange = (field: keyof Activity, value: unknown) => {
    setActivityForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddActivity = () => {
    setEditingActivity(null);
    setActivityDialogOpen(true);
  };

  const openEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setActivityForm({
      featured_image: activity.featured_image || "",
      is_featured: activity.is_featured || false,
      city: activity.city || "",
      name: activity.name || "",
      slug: activity.slug || "",
      description: activity.description || "",
      duration: activity.duration || "",
      price: activity.price ? String(activity.price) : "",
      inclusions: activity.inclusions || "",
      exclusions: activity.exclusions || "",
      features: activity.features || "",
      faqs: activity.faqs || [],
      gallery: activity.gallery || [],
      sites: activity.sites || "",
    });
    setActivityImagePreview(activity.featured_image || "");
    setActivityDialogOpen(true);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this activity?"))
      return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted", description: "Activity deleted." });
      fetchActivities();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive",
      });
    }
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivityLoading(true);
    try {
      let error;
      if (editingActivity) {
        ({ error } = await supabase
          .from("activities")
          .update({
            featured_image: activityForm.featured_image,
            is_featured: activityForm.is_featured,
            city: activityForm.city,
            name: activityForm.name,
            slug: activityForm.slug,
            description: activityForm.description,
            duration: activityForm.duration,
            price: activityForm.price ? parseFloat(activityForm.price) : null,
            vehicle_prices: vehiclePrices,
            inclusions: activityForm.inclusions,
            exclusions: activityForm.exclusions,
            features: activityForm.features,
            faqs: activityForm.faqs,
            gallery: activityForm.gallery,
            sites: activityForm.sites,
          })
          .eq("id", editingActivity.id));
      } else {
        ({ error } = await supabase.from("activities").insert([
          {
            featured_image: activityForm.featured_image,
            is_featured: activityForm.is_featured,
            city: activityForm.city,
            name: activityForm.name,
            slug: activityForm.slug,
            description: activityForm.description,
            duration: activityForm.duration,
            price: activityForm.price ? parseFloat(activityForm.price) : null,
            vehicle_prices: vehiclePrices,
            inclusions: activityForm.inclusions,
            exclusions: activityForm.exclusions,
            features: activityForm.features,
            faqs: activityForm.faqs,
            gallery: activityForm.gallery,
            sites: activityForm.sites,
          },
        ]));
      }
      if (error) throw error;
      toast({
        title: "Success",
        description: editingActivity
          ? "Activity updated!"
          : "Activity saved successfully!",
      });
      setActivityForm({
        featured_image: "",
        is_featured: false,
        city: "",
        name: "",
        slug: "",
        description: "",
        duration: "",
        price: "",
        inclusions: "",
        exclusions: "",
        features: "",
        faqs: [],
        gallery: [],
        sites: "",
      });
      setActivityImagePreview("");
      setActivityDialogOpen(false);
      setEditingActivity(null);
      setVehiclePrices({});
      fetchActivities();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save activity",
        variant: "destructive",
      });
    } finally {
      setActivityLoading(false);
    }
  };

  const handleActivityImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setActivityImageFile(file);
    setActivityImagePreview(URL.createObjectURL(file));
    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("activities-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      toast({
        title: "Error",
        description: "Image upload failed",
        variant: "destructive",
      });
      return;
    }
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("activities-images")
      .getPublicUrl(fileName);
    if (publicUrlData?.publicUrl) {
      setActivityForm((prev) => ({
        ...prev,
        featured_image: publicUrlData.publicUrl,
      }));
    }
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setActivities(data || []);
    setActivitiesLoading(false);
  };

  useEffect(() => {
    if (activeTab === "activities") fetchActivities();
  }, [activeTab]);

  useEffect(() => {
    if (activityDialogOpen) {
      (async () => {
        const { data, error } = await supabase
          .from("vehicles")
          .select("id, vehicle_name, vehicle_type, vehicle_image, capacity");
        if (!error && data) setVehicles(data);
      })();
    }
  }, [activityDialogOpen]);

  useEffect(() => {
    if (editingActivity && editingActivity.vehicle_prices) {
      setVehiclePrices(editingActivity.vehicle_prices);
    } else if (!activityDialogOpen) {
      setVehiclePrices({});
    }
  }, [editingActivity, activityDialogOpen]);

  // Auto-generate slug from name
  useEffect(() => {
    const slug = activityForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    if (
      !activityForm.slug ||
      activityForm.slug === "" ||
      activityForm.slug === slug
    ) {
      setActivityForm((prev) => ({ ...prev, slug }));
    }
  }, [activityForm.name, activityForm.slug]);

  // --- SEO Automation ---
  useEffect(() => {
    if (!activityForm.meta_title && activityForm.name) {
      handleActivityChange(
        "meta_title",
        `${activityForm.name} | ${activityForm.city || ""} Ziarath Tour`,
      );
    }
    if (!activityForm.meta_description && activityForm.description) {
      const plainDesc = stripHtml(activityForm.description).slice(0, 160);
      handleActivityChange("meta_description", plainDesc);
    }
    if (!activityForm.meta_keywords && activityForm.name) {
      handleActivityChange(
        "meta_keywords",
        `${activityForm.name}, ${activityForm.city || ""}, Ziarath, Umrah, Hajj`,
      );
    }
    if (!activityForm.canonical_url && activityForm.slug) {
      handleActivityChange(
        "canonical_url",
        `https://yourdomain.com/ziarath/${activityForm.slug}`,
      );
    }
    if (!activityForm.og_title && activityForm.meta_title) {
      handleActivityChange("og_title", activityForm.meta_title);
    }
    if (!activityForm.og_description && activityForm.meta_description) {
      handleActivityChange("og_description", activityForm.meta_description);
    }
    if (!activityForm.og_image && activityForm.featured_image) {
      handleActivityChange("og_image", activityForm.featured_image);
    }
    if (!activityForm.page_schema && activityForm.name && activityForm.slug) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: activityForm.name,
        description: stripHtml(activityForm.description),
        image: activityForm.featured_image,
        url: `https://yourdomain.com/ziarath/${activityForm.slug}`,
        offers: {
          "@type": "Offer",
          price: activityForm.price,
          priceCurrency: "SAR",
        },
      };
      handleActivityChange("page_schema", JSON.stringify(schema, null, 2));
    }
  }, [
    activityForm.name,
    activityForm.city,
    activityForm.description,
    activityForm.slug,
    activityForm.featured_image,
    activityForm.price,
    activityForm.canonical_url,
    activityForm.meta_description,
    activityForm.meta_keywords,
    activityForm.meta_title,
    activityForm.og_description,
    activityForm.og_image,
    activityForm.og_title,
    activityForm.page_schema,
  ]);

  function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  const menuItems = useMemo(
    () => [
      {
        value: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        description: "Overview and analytics",
        shortcut: "⌘D",
      },
      {
        value: "blogs",
        label: "Blogs",
        icon: PenTool,
        description: "Manage blog posts",
        shortcut: "⌘B",
      },
      {
        value: "categories",
        label: "Categories",
        icon: Folder,
        description: "Organize content",
        shortcut: "⌘C",
      },
      {
        value: "hotels",
        label: "Hotels",
        icon: Building2,
        description: "Hotel management",
        shortcut: "⌘H",
      },
      {
        value: "packages",
        label: "Packages",
        icon: Package,
        description: "Travel packages",
        shortcut: "⌘P",
      },
      {
        value: "transport",
        label: "Transport",
        icon: Car,
        description: "Transportation services",
        shortcut: "⌘T",
      },
      {
        value: "flights",
        label: "Flights",
        icon: PlaneIcon,
        description: "Flight bookings",
        shortcut: "⌘F",
      },
      {
        value: "guides",
        label: "Guides",
        icon: Compass,
        description: "Tour guides",
        shortcut: "⌘G",
      },
      {
        value: "visas",
        label: "Visas",
        icon: Stamp,
        description: "Visa services",
        shortcut: "⌘V",
      },
      {
        value: "ziarath",
        label: "Ziarath",
        icon: Map,
        description: "Ziarath services",
        shortcut: "⌘Z",
      },
      {
        value: "leads",
        label: "Leads",
        icon: HeartHandshake,
        description: "Customer leads",
        shortcut: "⌘L",
      },
      {
        value: "seo",
        label: "SEO",
        icon: Search,
        description: "Search optimization",
        shortcut: "⌘S",
      },
      {
        value: "activities",
        label: "Activities",
        icon: Ticket,
        description: "Manage activities",
        shortcut: "⌘A",
      },
      {
        value: "backups",
        label: "Backups",
        icon: Database,
        description: "Database backups",
        shortcut: "⌘K",
      },
    ],
    [],
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        const key = event.key.toLowerCase();
        const menuItem = menuItems.find((item) =>
          item.shortcut.toLowerCase().endsWith(key),
        );
        if (menuItem) {
          event.preventDefault();
          setActiveTab(menuItem.value);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [menuItems]);

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "github"]}
            theme="default"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Marhaba Haji Control Panel
              </h1>
              <p className="text-gray-600">Manage your Umrah travel services</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                System Online
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <Settings className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-sm border">
            <NavigationMenu className="w-full max-w-full p-2">
              <NavigationMenuList className="flex flex-wrap gap-2 justify-start w-full">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.value}>
                      <NavigationMenuTrigger
                        onClick={() => setActiveTab(item.value)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out min-w-[40px] sm:min-w-[120px]",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          "data-[state=open]:bg-accent/50",
                          "group relative",
                          activeTab === item.value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[16rem] p-3">
                          <div className="flex items-center gap-3 mb-3 p-2 rounded-md bg-accent/5">
                            <Icon className="w-8 h-8 text-primary p-1.5 bg-primary/10 rounded-md" />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium leading-none mb-1">
                                {item.label}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="pt-2 text-xs text-muted-foreground border-t">
                            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                              {item.shortcut}
                            </span>
                            <span className="ml-2">Keyboard shortcut</span>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Revenue Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Revenue data visualization
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("blogs")}
                  >
                    <PenTool className="w-6 h-6" />
                    <span className="text-xs">New Blog</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("packages")}
                  >
                    <Package className="w-6 h-6" />
                    <span className="text-xs">Add Package</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("hotels")}
                  >
                    <Hotel className="w-6 h-6" />
                    <span className="text-xs">Add Hotel</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("leads")}
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-xs">View Leads</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("categories")}
                  >
                    <Folder className="w-6 h-6" />
                    <span className="text-xs">Categories</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("seo")}
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-xs">SEO Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs">
            <BlogManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="hotels">
            <HotelManager session={session} />
          </TabsContent>

          <TabsContent value="packages">
            <PackageManager />
          </TabsContent>

          <TabsContent value="transport">
            <TransportManager />
          </TabsContent>

          <TabsContent value="flights">
            <GroupFlightsManager />
          </TabsContent>

          <TabsContent value="guides">
            <GuideServicesManager />
          </TabsContent>

          <TabsContent value="visas">
            <SaudiVisasManager />
          </TabsContent>

          <TabsContent value="ziarath">
            <ZiarathManager />
          </TabsContent>

          <TabsContent value="leads">
            <LeadManager />
          </TabsContent>

          <TabsContent value="activities">
            <Card className="max-w-5xl mx-auto mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Activities</CardTitle>
                <Dialog
                  open={activityDialogOpen}
                  onOpenChange={setActivityDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={openAddActivity}>Add Activity</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingActivity ? "Edit Activity" : "Add Activity"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingActivity
                          ? "Edit the details of this activity."
                          : "Fill in the details to add a new activity."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleActivitySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Featured Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleActivityImageChange}
                            className="block w-full text-sm text-gray-700"
                          />
                          {activityImagePreview && (
                            <img
                              src={activityImagePreview}
                              alt="Preview"
                              className="mt-2 rounded shadow max-h-32"
                            />
                          )}
                        </div>
                        <div className="flex items-center mt-6 md:mt-0">
                          <input
                            type="checkbox"
                            checked={activityForm.is_featured}
                            onChange={(e) =>
                              handleActivityChange(
                                "is_featured",
                                e.target.checked,
                              )
                            }
                            id="is_featured"
                            className="mr-2"
                          />
                          <label
                            htmlFor="is_featured"
                            className="text-sm font-medium"
                          >
                            Featured
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            City
                          </label>
                          <Input
                            value={activityForm.city}
                            onChange={(e) =>
                              handleActivityChange("city", e.target.value)
                            }
                            placeholder="Enter city"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Activity Name
                          </label>
                          <Input
                            value={activityForm.name}
                            onChange={(e) =>
                              handleActivityChange("name", e.target.value)
                            }
                            placeholder="Enter activity name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Slug
                        </label>
                        <Input
                          value={activityForm.slug}
                          onChange={(e) =>
                            handleActivityChange("slug", e.target.value)
                          }
                          placeholder="auto-generated-from-name"
                          required
                        />
                        <div className="text-xs text-gray-500">
                          This will be used in the URL.
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <ReactQuill
                          theme="snow"
                          value={activityForm.description}
                          onChange={(val) =>
                            handleActivityChange("description", val)
                          }
                          className="bg-white"
                          style={{ minHeight: 120 }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Duration
                          </label>
                          <Input
                            value={activityForm.duration}
                            onChange={(e) =>
                              handleActivityChange("duration", e.target.value)
                            }
                            placeholder="e.g. 2 hours"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Price
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={activityForm.price}
                            onChange={(e) =>
                              handleActivityChange("price", e.target.value)
                            }
                            placeholder="e.g. 49.99"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Inclusions
                        </label>
                        <Textarea
                          value={activityForm.inclusions || ""}
                          onChange={(e) =>
                            handleActivityChange("inclusions", e.target.value)
                          }
                          placeholder="Enter inclusions, one per line"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Exclusions
                        </label>
                        <Textarea
                          value={activityForm.exclusions || ""}
                          onChange={(e) =>
                            handleActivityChange("exclusions", e.target.value)
                          }
                          placeholder="Enter exclusions, one per line"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Features
                        </label>
                        <Input
                          value={activityForm.features || ""}
                          onChange={(e) =>
                            handleActivityChange("features", e.target.value)
                          }
                          placeholder="Enter features, comma separated"
                        />
                        <div className="text-xs text-gray-500">
                          Example: AC Vehicle, Snacks Provided, English Guide
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          FAQs
                        </label>
                        {(activityForm.faqs || []).map((faq, idx) => (
                          <div key={idx} className="mb-2 flex gap-2">
                            <Input
                              className="flex-1"
                              value={faq.q}
                              onChange={(e) => {
                                const faqs = [...activityForm.faqs];
                                faqs[idx].q = e.target.value;
                                handleActivityChange("faqs", faqs);
                              }}
                              placeholder="Question"
                            />
                            <Input
                              className="flex-1"
                              value={faq.a}
                              onChange={(e) => {
                                const faqs = [...activityForm.faqs];
                                faqs[idx].a = e.target.value;
                                handleActivityChange("faqs", faqs);
                              }}
                              placeholder="Answer"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                const faqs = [...activityForm.faqs];
                                faqs.splice(idx, 1);
                                handleActivityChange("faqs", faqs);
                              }}
                            >
                              -
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          size="sm"
                          className="mt-1"
                          onClick={() =>
                            handleActivityChange("faqs", [
                              ...(activityForm.faqs || []),
                              { q: "", a: "" },
                            ])
                          }
                        >
                          Add FAQ
                        </Button>
                        <div className="text-xs text-gray-500 mt-1">
                          Add common questions and answers for this activity.
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="font-semibold mb-2">
                          Vehicle Pricing
                        </div>
                        {vehicles.length === 0 ? (
                          <div className="text-gray-500 text-sm">
                            No vehicles found.
                          </div>
                        ) : (
                          vehicles.map((vehicle) => (
                            <div
                              key={vehicle.id}
                              className="flex items-center gap-4 mb-2"
                            >
                              <input
                                type="checkbox"
                                checked={vehicle.id in vehiclePrices}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setVehiclePrices((prev) => {
                                    const updated = { ...prev };
                                    if (!checked) delete updated[vehicle.id];
                                    else
                                      updated[vehicle.id] =
                                        updated[vehicle.id] ?? 0;
                                    return updated;
                                  });
                                }}
                              />
                              <span className="min-w-[120px] flex items-center gap-2">
                                {vehicle.vehicle_image && (
                                  <img
                                    src={vehicle.vehicle_image}
                                    alt={vehicle.vehicle_name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                {vehicle.vehicle_name} ({vehicle.vehicle_type})
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="border rounded px-2 py-1 w-32"
                                placeholder="Enter price"
                                value={vehiclePrices[vehicle.id] ?? ""}
                                disabled={!(vehicle.id in vehiclePrices)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setVehiclePrices((prev) => ({
                                    ...prev,
                                    [vehicle.id]: value ? parseFloat(value) : 0,
                                  }));
                                }}
                              />
                            </div>
                          ))
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Gallery Images
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            // Simulate upload and preview (replace with actual upload logic as needed)
                            const urls = await Promise.all(
                              files.map(async (file) => {
                                // For now, use local preview
                                return URL.createObjectURL(file);
                              }),
                            );
                            handleActivityChange("gallery", urls);
                          }}
                          className="block w-full text-sm text-gray-700"
                        />
                        {activityForm.gallery &&
                          activityForm.gallery.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activityForm.gallery.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="Gallery"
                                  className="h-16 w-16 object-cover rounded shadow"
                                />
                              ))}
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Sites to Visit
                        </label>
                        <Textarea
                          value={activityForm.sites || ""}
                          onChange={(e) =>
                            handleActivityChange("sites", e.target.value)
                          }
                          placeholder="Enter each site on a new line"
                          rows={3}
                        />
                        <div className="text-xs text-gray-500">
                          List all the sites that will be visited in this tour.
                        </div>
                      </div>
                      <div className="mt-8 p-4 rounded-lg border bg-gray-50">
                        <h3 className="text-lg font-bold mb-4 text-emerald-900">
                          SEO Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Meta Title
                            </label>
                            <Input
                              value={activityForm.meta_title || ""}
                              onChange={(e) =>
                                handleActivityChange(
                                  "meta_title",
                                  e.target.value,
                                )
                              }
                              placeholder="Meta title for SEO"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Meta Description
                            </label>
                            <Textarea
                              value={activityForm.meta_description || ""}
                              onChange={(e) =>
                                handleActivityChange(
                                  "meta_description",
                                  e.target.value,
                                )
                              }
                              placeholder="Meta description for SEO"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Meta Keywords
                            </label>
                            <Input
                              value={activityForm.meta_keywords || ""}
                              onChange={(e) =>
                                handleActivityChange(
                                  "meta_keywords",
                                  e.target.value,
                                )
                              }
                              placeholder="Meta keywords, comma separated"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Canonical URL
                            </label>
                            <Input
                              value={activityForm.canonical_url || ""}
                              onChange={(e) =>
                                handleActivityChange(
                                  "canonical_url",
                                  e.target.value,
                                )
                              }
                              placeholder="Canonical URL"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              OG Title
                            </label>
                            <Input
                              value={activityForm.og_title || ""}
                              onChange={(e) =>
                                handleActivityChange("og_title", e.target.value)
                              }
                              placeholder="Open Graph title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              OG Description
                            </label>
                            <Textarea
                              value={activityForm.og_description || ""}
                              onChange={(e) =>
                                handleActivityChange(
                                  "og_description",
                                  e.target.value,
                                )
                              }
                              placeholder="Open Graph description"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              OG Image
                            </label>
                            <Input
                              value={activityForm.og_image || ""}
                              onChange={(e) =>
                                handleActivityChange("og_image", e.target.value)
                              }
                              placeholder="Open Graph image URL"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Page Schema (JSON-LD)
                            </label>
                            <Textarea
                              value={activityForm.page_schema || ""}
                              onChange={(e) =>
                                handleActivityChange(
                                  "page_schema",
                                  e.target.value,
                                )
                              }
                              placeholder="Page schema as JSON-LD"
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={activityLoading}
                          className="w-full"
                        >
                          {activityLoading
                            ? editingActivity
                              ? "Saving..."
                              : "Saving..."
                            : editingActivity
                              ? "Update Activity"
                              : "Save Activity"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="py-8 text-center text-gray-500">
                    Loading...
                  </div>
                ) : activities.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No activities found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border">Image</th>
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">City</th>
                          <th className="p-2 border">Duration</th>
                          <th className="p-2 border">Price</th>
                          <th className="p-2 border">Featured</th>
                          <th className="p-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((a) => (
                          <tr key={a.id} className="hover:bg-gray-50">
                            <td className="p-2 border text-center">
                              {a.featured_image ? (
                                <img
                                  src={a.featured_image}
                                  alt=""
                                  className="h-12 w-12 object-cover rounded mx-auto"
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-2 border">{a.name}</td>
                            <td className="p-2 border">{a.city}</td>
                            <td className="p-2 border">{a.duration}</td>
                            <td className="p-2 border">
                              {a.price
                                ? `₹${Number(a.price).toLocaleString()}`
                                : "-"}
                            </td>
                            <td className="p-2 border text-center">
                              {a.is_featured ? "Yes" : "No"}
                            </td>
                            <td className="p-2 border text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="mr-2"
                                onClick={() => openEditActivity(a)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteActivity(a.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backups">
            <DatabaseBackupManager />
          </TabsContent>

          <TabsContent value="seo">
            <SEOManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ControlPanel;
