import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Vehicle {
  id: string;
  vehicle_name: string;
  vehicle_type: string;
  vehicle_image?: string;
  capacity?: number;
}

interface Activity {
  id: string;
  name: string;
  city: string;
  description: string;
  duration?: string;
  price?: number;
  featured_image?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  vehicle_prices?: { [vehicleId: string]: number };
  slug: string;
  inclusions?: string;
  exclusions?: string;
  features?: string;
  faqs?: { q: string; a: string }[];
  gallery?: string[];
  sites?: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  page_schema: string;
  [key: string]: unknown;
}

interface ActivityFormValues {
  name: string;
  slug: string;
  city: string;
  description: string;
  duration: string;
  price: string;
  featured_image: string;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  page_schema: string;
  [key: string]: unknown;
}

const ActivityManager = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclePrices, setVehiclePrices] = useState<{
    [vehicleId: string]: number;
  }>({});

  const form = useForm<ActivityFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      city: "",
      description: "",
      duration: "",
      price: "",
      featured_image: "",
      is_featured: false,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      canonical_url: "",
      og_title: "",
      og_description: "",
      og_image: "",
      page_schema: "",
    },
  });

  useEffect(() => {
    fetchActivities();
    fetchVehicles();
  }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name" && value.name) {
        const slug = value.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        form.setValue("slug", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("activities").select("*");
    if (!error && data) {
      setActivities(
        data.map((a: Activity) => ({
          ...a,
          slug: a.slug || "",
        })),
      );
    }
    setLoading(false);
  };

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("id, vehicle_name, vehicle_type, vehicle_image, capacity");
    if (!error && data) setVehicles(data);
  };

  const onSubmit = async (data: ActivityFormValues) => {
    const newActivity = {
      name: data.name,
      city: data.city,
      description: data.description,
      duration: data.duration,
      price: data.price ? parseFloat(data.price) : null,
      featured_image: data.featured_image,
      is_featured: data.is_featured,
      vehicle_prices: vehiclePrices,
      slug: data.slug,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      meta_keywords: data.meta_keywords,
      canonical_url: data.canonical_url,
      og_title: data.og_title,
      og_description: data.og_description,
      og_image: data.og_image,
      page_schema: data.page_schema,
    };

    let error;
    if (editingActivity && editingActivity.id) {
      ({ error } = await supabase
        .from("activities")
        .update(newActivity)
        .eq("id", editingActivity.id));
    } else {
      ({ error } = await supabase.from("activities").insert([newActivity]));
    }
    if (!error) {
      await fetchActivities();
      setIsDialogOpen(false);
      setEditingActivity(null);
      form.reset();
      setVehiclePrices({});
    } else {
      toast({
        title: "Error",
        description: error.message || "Failed to save activity",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setVehiclePrices(activity.vehicle_prices || {});
    form.reset({
      name: activity.name,
      slug: activity.slug || "",
      city: activity.city,
      description: activity.description,
      duration: activity.duration || "",
      price: activity.price?.toString() || "",
      featured_image: activity.featured_image || "",
      is_featured: activity.is_featured,
      meta_title: activity.meta_title || "",
      meta_description: activity.meta_description || "",
      meta_keywords: activity.meta_keywords || "",
      canonical_url: activity.canonical_url || "",
      og_title: activity.og_title || "",
      og_description: activity.og_description || "",
      og_image: activity.og_image || "",
      page_schema: activity.page_schema || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast({
        title: "Error",
        description: "Invalid activity ID for delete.",
        variant: "destructive",
      });
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to delete this activity? This action cannot be undone.",
      )
    )
      return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (!error) {
      await fetchActivities();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementation of handleChange function
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Activities Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingActivity(null);
                form.reset();
                setVehiclePrices({});
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? "Edit Activity" : "Add New Activity"}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Fill in the details for the activity. All fields marked * are
              required.
            </DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter activity name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Full Day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is Featured?</FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="auto-generated-from-name"
                            {...field}
                          />
                        </FormControl>
                        <div className="text-xs text-gray-500">
                          This will be used in the URL.
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4">
                  <div className="font-semibold mb-2">Vehicle Pricing</div>
                  {vehicles.map((vehicle) => (
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
                            else updated[vehicle.id] = updated[vehicle.id] ?? 0;
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
                  ))}
                </div>
                <div className="mt-8 p-4 rounded-lg border bg-gray-50">
                  <h3 className="text-lg font-bold mb-4 text-emerald-900">
                    SEO Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="meta_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Meta title for SEO"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Meta description for SEO"
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta_keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Keywords</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Meta keywords, comma separated"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="canonical_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Canonical URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Canonical URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="og_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OG Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Open Graph title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="og_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OG Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Open Graph description"
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="og_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OG Image</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Open Graph image URL"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="page_schema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Schema (JSON-LD)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Page schema as JSON-LD"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingActivity ? "Update Activity" : "Create Activity"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card
            key={activity.id}
            className="relative group overflow-hidden border-0 shadow-xl rounded-3xl bg-white/90 hover:scale-[1.03] hover:shadow-2xl transition-transform"
          >
            <div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
              <img
                src={activity.featured_image || "/public/placeholder.svg"}
                alt={activity.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {activity.is_featured && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-[#fbbf24] to-[#059669] text-white px-3 py-1 text-xs font-bold shadow-lg">
                  Featured
                </Badge>
              )}
              <Badge className="absolute top-4 right-4 bg-white/80 text-[#023f3a] px-3 py-1 text-xs font-bold shadow">
                {activity.city}
              </Badge>
            </div>
            <CardContent className="p-6 flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-[#023f3a] mb-1 group-hover:text-[#fbbf24] transition-colors">
                {activity.name}
              </h3>
              <p className="text-gray-700 text-base line-clamp-3 mb-2">
                {activity.description}
              </p>
              <div className="flex items-center gap-4 mb-2">
                {activity.duration && (
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    {activity.duration}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-extrabold text-[#fbbf24]">
                  ₹{activity.price?.toLocaleString("en-IN")}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(activity)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(activity.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityManager;
