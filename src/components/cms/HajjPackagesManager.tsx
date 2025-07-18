import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const maktabCategories = ["A", "B", "C", "D"];
const types = ["Shifting", "Non-Shifting"];
const classes = ["Budget", "Deluxe", "Premium", "Luxury"];

const durationCategories = [
  { value: "short", label: "Short (10-20 days)" },
  { value: "medium", label: "Medium (20-30 days)" },
  { value: "long", label: "Long (30-45 days)" },
];

const mealPlanOptions = [
  { value: "Breakfast", label: "Breakfast" },
  { value: "Half-board", label: "Half-board" },
  { value: "Full-board", label: "Full-board" },
];

const defaultForm: HajjPackageForm = {
  id: undefined,
  name: "",
  price: {
    sharing: { adult: "", child: "", infant: "" },
    private: { quad: "", triple: "", double: "" },
  },
  duration: "",
  duration_category: "",
  departure_city: "",
  departure_date: "",
  season_category: "",
  inclusions: [],
  exclusions: [],
  featured_image: "",
  package_category: "",
  maktab: "",
  type: "",
  class: "",
  max_capacity: 0,
  available_spots: 0,
  hotels: [],
  makkah_hotel_name: "",
  makkah_hotel_category: "",
  makkah_hotel_distance: "",
  madinah_hotel_name: "",
  madinah_hotel_category: "",
  madinah_hotel_distance: "",
  meal_plan: "",
  itinerary: [], // now array of {title, description}
  terms_and_conditions: "",
  cancellation_policy: "",
  refund_policy: "",
  traveller_responsibilities: "",
  disclaimer: "",
  status: "active",
  activities: [],
  flight_type: "",
  seo: {
    slug: "",
    meta_title: "",
    meta_description: "",
    target_keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    canonical_url: "",
    schema_markup: "",
  },
};

interface Pricing {
  sharing: { adult: string; child: string; infant: string };
  private: { quad: string; triple: string; double: string };
}

interface HajjPackage {
  id?: string;
  name: string;
  description?: string;
  duration?: string;
  price: Pricing;
  status?: string;
  category?: string;
  inclusions?: string[];
  exclusions?: string[];
  images?: string[];
  featured_image?: string;
  makkah_hotel?: string;
  madinah_hotel?: string;
  flight_details?: string;
  itinerary?: { title: string; description: string }[];
  pricing?: Pricing;
  room_type_pricing?: {
    single?: number;
    double?: number;
    triple?: number;
  };
  max_capacity?: number;
  available_spots?: number;
  departure_date?: string;
  return_date?: string;
  is_group_package?: boolean;
  min_participants?: number;
  activities?: string[];
  cities_covered?: string[];
  flight_included?: boolean;
}

interface HajjPackageForm extends HajjPackage {
  [key: string]: unknown;
}

const HajjPackagesManager = () => {
  const [packages, setPackages] = useState<HajjPackage[]>([]);
  const [form, setForm] = useState<HajjPackageForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const [activitiesList, setActivitiesList] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    fetchPackages();
    fetchActivities();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("hajj_packages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setPackages(data || []);
    setIsLoading(false);
  };

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("id, name")
      .order("name", { ascending: true });
    if (!error && data) setActivitiesList(data);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f: HajjPackageForm) => ({ ...f, [name]: value }));
  };

  const handleArrayChange = (name: string, value: string) => {
    setForm((f: HajjPackageForm) => ({
      ...f,
      [name]: value
        .split(/,|\n/)
        .map((v) => v.trim())
        .filter(Boolean),
    }));
  };

  const handlePriceChange = (
    section: "sharing" | "private",
    field: string,
    value: string,
  ) => {
    setForm((f: HajjPackageForm) => ({
      ...f,
      price: {
        ...f.price,
        [section]: {
          ...f.price[section],
          [field]: value,
        },
      },
    }));
  };

  const handleItineraryChange = (
    idx: number,
    field: "title" | "description",
    value: string,
  ) => {
    setForm((f: HajjPackageForm) => ({
      ...f,
      itinerary: f.itinerary.map(
        (item: { title: string; description: string }, i: number) =>
          i === idx ? { ...item, [field]: value } : item,
      ),
    }));
  };
  const handleAddItinerary = () => {
    setForm((f: HajjPackageForm) => ({
      ...f,
      itinerary: [...(f.itinerary || []), { title: "", description: "" }],
    }));
  };
  const handleRemoveItinerary = (idx: number) => {
    setForm((f: HajjPackageForm) => ({
      ...f,
      itinerary: f.itinerary.filter(
        (_: { title: string; description: string }, i: number) => i !== idx,
      ),
    }));
  };

  const handleSeoChange = (field: string, value: string) => {
    setForm((f: HajjPackageForm) => ({
      ...f,
      seo: {
        ...f.seo,
        [field]: value,
      },
    }));
  };

  const handleActivityToggle = (id: string) => {
    setForm((f: HajjPackageForm) => ({
      ...f,
      activities: f.activities.includes(id)
        ? f.activities.filter((a: string) => a !== id)
        : [...f.activities, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      ...form,
      price: form.price || {
        sharing: { adult: "", child: "", infant: "" },
        private: { quad: "", triple: "", double: "" },
      },
      seo: { ...form.seo },
    };
    if (editingId) {
      const { error } = await supabase
        .from("hajj_packages")
        .update(payload)
        .eq("id", editingId);
      if (!error) toast({ title: "Updated", description: "Package updated." });
    } else {
      const { error } = await supabase.from("hajj_packages").insert([payload]);
      if (!error) toast({ title: "Created", description: "Package created." });
    }
    setForm(defaultForm);
    setEditingId(undefined);
    setShowForm(false);
    fetchPackages();
    setIsLoading(false);
  };

  const handleEdit = (pkg: HajjPackage) => {
    setForm({
      ...pkg,
      price: pkg.price || {
        sharing: { adult: "", child: "", infant: "" },
        private: { quad: "", triple: "", double: "" },
      },
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this package?")) return;
    setIsLoading(true);
    await supabase.from("hajj_packages").delete().eq("id", id);
    fetchPackages();
    setIsLoading(false);
    toast({ title: "Deleted", description: "Package deleted." });
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setEditingId(undefined);
    setShowForm(false);
  };

  const flightTypeOptions = [
    { value: "TBD", label: "TBD" },
    { value: "Direct", label: "Direct" },
    { value: "Connecting", label: "Connecting" },
  ];

  const hotelCategoryOptions = [
    { value: "Budget", label: "Budget" },
    { value: "2 star", label: "2 star" },
    { value: "3 star", label: "3 star" },
    { value: "4 star", label: "4 star" },
    { value: "5 star", label: "5 star" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hajj Packages Manager</h2>
        <Button
          onClick={() => {
            setShowForm(true);
            setForm(defaultForm);
            setEditingId(undefined);
          }}
        >
          Add New Package
        </Button>
      </div>
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Hajj Package" : "Create New Hajj Package"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-8 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md"
            >
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-700">
                  Basic Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Featured Image</Label>
                    <Input
                      name="featured_image"
                      value={form.featured_image}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Paste image URL here"
                    />
                    {form.featured_image && (
                      <img
                        src={form.featured_image}
                        alt="Featured"
                        className="mt-2 h-24 rounded shadow border object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      name="duration"
                      value={form.duration}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration_category">Duration Category</Label>
                    <select
                      name="duration_category"
                      value={form.duration_category}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select</option>
                      {durationCategories.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="meal_plan">Meal Plan</Label>
                    <select
                      name="meal_plan"
                      value={form.meal_plan}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select</option>
                      {mealPlanOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="flight_type">Flight Type</Label>
                    <select
                      name="flight_type"
                      value={form.flight_type}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select</option>
                      {flightTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Price */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-700">
                  Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label>Price (Sharing, per person)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
                      <div>
                        <Label className="text-xs">Adult</Label>
                        <Input
                          type="number"
                          min="0"
                          value={form.price.sharing.adult}
                          onChange={(e) =>
                            handlePriceChange(
                              "sharing",
                              "adult",
                              e.target.value,
                            )
                          }
                          placeholder="Adult"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Child</Label>
                        <Input
                          type="number"
                          min="0"
                          value={form.price.sharing.child}
                          onChange={(e) =>
                            handlePriceChange(
                              "sharing",
                              "child",
                              e.target.value,
                            )
                          }
                          placeholder="Child"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Infant</Label>
                        <Input
                          type="number"
                          min="0"
                          value={form.price.sharing.infant}
                          onChange={(e) =>
                            handlePriceChange(
                              "sharing",
                              "infant",
                              e.target.value,
                            )
                          }
                          placeholder="Infant"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Price (Private, per room)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
                      <div>
                        <Label className="text-xs">Quad</Label>
                        <Input
                          type="number"
                          min="0"
                          value={form.price.private.quad}
                          onChange={(e) =>
                            handlePriceChange("private", "quad", e.target.value)
                          }
                          placeholder="Quad"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Triple</Label>
                        <Input
                          type="number"
                          min="0"
                          value={form.price.private.triple}
                          onChange={(e) =>
                            handlePriceChange(
                              "private",
                              "triple",
                              e.target.value,
                            )
                          }
                          placeholder="Triple"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Double</Label>
                        <Input
                          type="number"
                          min="0"
                          value={form.price.private.double}
                          onChange={(e) =>
                            handlePriceChange(
                              "private",
                              "double",
                              e.target.value,
                            )
                          }
                          placeholder="Double"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hotel Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-700">
                  Hotel Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="makkah_hotel_name">Makkah Hotel Name</Label>
                    <Input
                      name="makkah_hotel_name"
                      value={form.makkah_hotel_name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="makkah_hotel_category">
                      Makkah Hotel Category
                    </Label>
                    <select
                      name="makkah_hotel_category"
                      value={form.makkah_hotel_category}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select</option>
                      {hotelCategoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="makkah_hotel_distance">
                      Makkah Hotel Distance
                    </Label>
                    <Input
                      name="makkah_hotel_distance"
                      value={form.makkah_hotel_distance}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="madinah_hotel_name">
                      Madinah Hotel Name
                    </Label>
                    <Input
                      name="madinah_hotel_name"
                      value={form.madinah_hotel_name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="madinah_hotel_category">
                      Madinah Hotel Category
                    </Label>
                    <select
                      name="madinah_hotel_category"
                      value={form.madinah_hotel_category}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select</option>
                      {hotelCategoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="madinah_hotel_distance">
                      Madinah Hotel Distance
                    </Label>
                    <Input
                      name="madinah_hotel_distance"
                      value={form.madinah_hotel_distance}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              {/* Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-700">
                  Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="departure_city">Departure City</Label>
                    <Input
                      name="departure_city"
                      value={form.departure_city}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="departure_date">Departure Date</Label>
                    <Input
                      name="departure_date"
                      type="date"
                      value={form.departure_date}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="package_category">Package Category</Label>
                    <Input
                      name="package_category"
                      value={form.package_category}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              {/* Classification */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-700">
                  Classification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="maktab">Maktab</Label>
                    <select
                      name="maktab"
                      value={form.maktab}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select</option>
                      {maktabCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select</option>
                      {types.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="class">Class</Label>
                    <select
                      name="class"
                      value={form.class}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select</option>
                      {classes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Capacity & Inclusions/Exclusions/Itinerary */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-700">
                  Capacity & Inclusions/Exclusions/Itinerary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="max_capacity">Max Capacity</Label>
                    <Input
                      name="max_capacity"
                      type="number"
                      value={form.max_capacity}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="available_spots">Available Spots</Label>
                    <Input
                      name="available_spots"
                      type="number"
                      value={form.available_spots}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="inclusions">
                      Inclusions{" "}
                      <span className="text-xs text-gray-400">
                        (comma or new line separated)
                      </span>
                    </Label>
                    <Textarea
                      name="inclusions"
                      value={form.inclusions.join(", ")}
                      onChange={(e) =>
                        handleArrayChange("inclusions", e.target.value)
                      }
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="exclusions">
                      Exclusions{" "}
                      <span className="text-xs text-gray-400">
                        (comma or new line separated)
                      </span>
                    </Label>
                    <Textarea
                      name="exclusions"
                      value={form.exclusions.join(", ")}
                      onChange={(e) =>
                        handleArrayChange("exclusions", e.target.value)
                      }
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-2 block">Itinerary</Label>
                    {form.itinerary && form.itinerary.length > 0 && (
                      <div className="space-y-4 mb-4">
                        {form.itinerary.map(
                          (
                            item: { title: string; description: string },
                            idx: number,
                          ) => (
                            <div
                              key={idx}
                              className="flex flex-col md:flex-row gap-2 items-end border p-3 rounded-md bg-white/80"
                            >
                              <div className="flex-1">
                                <Label className="text-xs">Title</Label>
                                <Input
                                  value={item.title}
                                  onChange={(e) =>
                                    handleItineraryChange(
                                      idx,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  className="mt-1"
                                  placeholder={`Day ${idx + 1} title`}
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-xs">Description</Label>
                                <Input
                                  value={item.description}
                                  onChange={(e) =>
                                    handleItineraryChange(
                                      idx,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  className="mt-1"
                                  placeholder="Description"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveItinerary(idx)}
                                className="ml-2"
                              >
                                Remove
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddItinerary}
                    >
                      Add Itinerary Item
                    </Button>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="activities">Activities</Label>
                    <div className="border rounded-md bg-white/80 p-2 max-h-40 overflow-y-auto flex flex-wrap gap-2">
                      {activitiesList.length === 0 ? (
                        <span className="text-gray-400 text-sm">
                          No activities found.
                        </span>
                      ) : (
                        activitiesList.map((activity) => (
                          <label
                            key={activity.id}
                            className="flex items-center gap-2 mr-4 mb-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={form.activities.includes(activity.id)}
                              onChange={() => handleActivityToggle(activity.id)}
                              className="accent-emerald-600 h-4 w-4 rounded border border-gray-300"
                            />
                            <span className="text-sm">{activity.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Policies & Legal */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-700">
                  Policies & Legal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="terms_and_conditions">
                      Terms and Conditions
                    </Label>
                    <Textarea
                      name="terms_and_conditions"
                      value={form.terms_and_conditions}
                      onChange={handleInputChange}
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="cancellation_policy">
                      Cancellation Policy
                    </Label>
                    <Textarea
                      name="cancellation_policy"
                      value={form.cancellation_policy}
                      onChange={handleInputChange}
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="refund_policy">Refund Policy</Label>
                    <Textarea
                      name="refund_policy"
                      value={form.refund_policy}
                      onChange={handleInputChange}
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="traveller_responsibilities">
                      Traveller Responsibilities
                    </Label>
                    <Textarea
                      name="traveller_responsibilities"
                      value={form.traveller_responsibilities}
                      onChange={handleInputChange}
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="disclaimer">Disclaimer</Label>
                    <Textarea
                      name="disclaimer"
                      value={form.disclaimer}
                      onChange={handleInputChange}
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
              {/* SEO & Social Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-700">
                  SEO & Social
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      name="slug"
                      value={form.seo.slug}
                      onChange={(e) => handleSeoChange("slug", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      name="meta_title"
                      value={form.seo.meta_title}
                      onChange={(e) =>
                        handleSeoChange("meta_title", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      name="meta_description"
                      value={form.seo.meta_description}
                      onChange={(e) =>
                        handleSeoChange("meta_description", e.target.value)
                      }
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="target_keywords">
                      Target Keywords{" "}
                      <span className="text-xs text-gray-400">
                        (comma separated)
                      </span>
                    </Label>
                    <Input
                      name="target_keywords"
                      value={form.seo.target_keywords}
                      onChange={(e) =>
                        handleSeoChange("target_keywords", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="og_title">OG Title</Label>
                    <Input
                      name="og_title"
                      value={form.seo.og_title}
                      onChange={(e) =>
                        handleSeoChange("og_title", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="og_description">OG Description</Label>
                    <Input
                      name="og_description"
                      value={form.seo.og_description}
                      onChange={(e) =>
                        handleSeoChange("og_description", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="og_image">OG Image URL</Label>
                    <Input
                      name="og_image"
                      value={form.seo.og_image}
                      onChange={(e) =>
                        handleSeoChange("og_image", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="canonical_url">Canonical URL</Label>
                    <Input
                      name="canonical_url"
                      value={form.seo.canonical_url}
                      onChange={(e) =>
                        handleSeoChange("canonical_url", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="schema_markup">
                      Schema Markup (JSON-LD)
                    </Label>
                    <Textarea
                      name="schema_markup"
                      value={form.seo.schema_markup}
                      onChange={(e) =>
                        handleSeoChange("schema_markup", e.target.value)
                      }
                      className="mt-1 min-h-[60px] font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                >
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>All Hajj Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : packages.length === 0 ? (
            <div>No packages found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Featured Image</th>
                    <th>
                      Sharing Price
                      <br />
                      <span className="font-normal text-xs">
                        Adult/Child/Infant
                      </span>
                    </th>
                    <th>
                      Private Price
                      <br />
                      <span className="font-normal text-xs">
                        Quad/Triple/Double
                      </span>
                    </th>
                    <th>Duration</th>
                    <th>Departure City</th>
                    <th>Departure Date</th>
                    <th>Category</th>
                    <th>Maktab</th>
                    <th>Type</th>
                    <th>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>{pkg.name}</td>
                      <td>
                        {pkg.featured_image && (
                          <img
                            src={pkg.featured_image}
                            alt="Featured"
                            className="h-10 w-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td>
                        {pkg.price?.sharing
                          ? [
                              pkg.price.sharing.adult,
                              pkg.price.sharing.child,
                              pkg.price.sharing.infant,
                            ]
                              .map((v, i) => v || "-")
                              .join(" / ")
                          : "-"}
                      </td>
                      <td>
                        {pkg.price?.private
                          ? [
                              pkg.price.private.quad,
                              pkg.price.private.triple,
                              pkg.price.private.double,
                            ]
                              .map((v, i) => v || "-")
                              .join(" / ")
                          : "-"}
                      </td>
                      <td>{pkg.duration}</td>
                      <td>{pkg.departure_city}</td>
                      <td>{pkg.departure_date}</td>
                      <td>{pkg.package_category}</td>
                      <td>{pkg.maktab}</td>
                      <td>{pkg.type}</td>
                      <td>{pkg.class}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(pkg)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(pkg.id)}
                          className="ml-2"
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
    </div>
  );
};

export default HajjPackagesManager;
