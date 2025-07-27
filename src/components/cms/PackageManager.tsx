import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  departure_date: string;
  return_date?: string;
  booking_deadline?: string;
  status: string;
  package_category: string;
  season_category?: string;
  is_group_package: boolean;
  max_capacity?: number;
  available_spots?: number;
  created_at: string;
  updated_at: string;
  cities_covered?: string[];
  category?: string;
  featured_image?: string;
  images?: string[];
  itinerary?: { title: string; description: string }[];
  inclusions?: string[];
  exclusions?: string[];
  terms_and_conditions?: string;
  makkah_hotel?: string;
  madinah_hotel?: string;
  flight_details?: {
    flight_type: string;
    airline_name: string;
    departure_airport: string;
    return_airport: string;
  };
  activities?: string[];
  sharing_price?: {
    adult: number;
    child_without_bed: number;
    infant: number;
  };
  private_room_price?: {
    quint: number;
    quad: number;
    triple: number;
    double: number;
    single: number;
  };
  meal_plan?: string;
  seo?: any;
  hotels?: any;
}

interface Hotel {
  id: string;
  name: string;
  city: string;
}

interface Activity {
  id: string;
  name: string;
}

const PackageManager = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [groupPackages, setGroupPackages] = useState<Package[]>([]);
  const [independentPackages, setIndependentPackages] = useState<Package[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    departure_date: "",
    return_date: "",
    booking_deadline: "",
    status: "active",
    package_category: "",
    season_category: "",
    is_group_package: false,
    max_capacity: "",
    available_spots: "",
    cities_covered: "",
    category: "",
    featured_image: "",
    images: [] as string[],
    itinerary: [] as { title: string; description: string }[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    terms_and_conditions: "",
    makkah_hotel: "",
    madinah_hotel: "",
    flight_type: "",
    airline_name: "",
    departure_airport: "",
    return_airport: "",
    activities: [] as string[],
    sharing_price_adult: "",
    sharing_price_child_without_bed: "",
    sharing_price_infant: "",
    private_room_price_quint: "",
    private_room_price_quad: "",
    private_room_price_triple: "",
    private_room_price_double: "",
    private_room_price_single: "",
    meal_plan: "",
    seo_meta_title: "",
    seo_meta_description: "",
    seo_meta_keywords: "",
    seo_canonical_url: "",
    seo_og_title: "",
    seo_og_description: "",
    seo_og_image: "",
    hotels_makkah: "",
    hotels_madinah: "",
    hotels_other: ""
  });

  useEffect(() => {
    fetchPackages();
    fetchHotels();
    fetchActivities();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("umrah_packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const allPackages = data || [];
      setPackages(allPackages);
      
      // Separate packages by type
      const grouped = allPackages.filter(pkg => pkg.is_group_package);
      const independent = allPackages.filter(pkg => !pkg.is_group_package);
      
      setGroupPackages(grouped);
      setIndependentPackages(independent);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from("hotels")
        .select("id, name, city")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const uploadImage = async (file: File, isFeatureImage = false) => {
    try {
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('package-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('package-images')
        .getPublicUrl(filePath);

      if (isFeatureImage) {
        setFormData(prev => ({
          ...prev,
          featured_image: publicUrl
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, publicUrl]
        }));
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addItineraryItem = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { title: "", description: "" }]
    }));
  };

  const updateItineraryItem = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItineraryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const addInclusionItem = () => {
    setFormData(prev => ({
      ...prev,
      inclusions: [...prev.inclusions, ""]
    }));
  };

  const updateInclusionItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.map((item, i) => i === index ? value : item)
    }));
  };

  const removeInclusionItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const addExclusionItem = () => {
    setFormData(prev => ({
      ...prev,
      exclusions: [...prev.exclusions, ""]
    }));
  };

  const updateExclusionItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.map((item, i) => i === index ? value : item)
    }));
  };

  const removeExclusionItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const packageData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration,
        departure_date: formData.departure_date,
        return_date: formData.return_date || null,
        booking_deadline: formData.booking_deadline || null,
        status: formData.status,
        package_category: formData.package_category,
        season_category: formData.season_category || null,
        is_group_package: formData.is_group_package,
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : null,
        available_spots: formData.available_spots ? parseInt(formData.available_spots) : null,
        cities_covered: formData.cities_covered ? formData.cities_covered.split(',').map(city => city.trim()) : [],
        category: formData.category,
        featured_image: formData.featured_image || null,
        images: formData.images,
        itinerary: formData.itinerary.length > 0 ? formData.itinerary : null,
        inclusions: formData.inclusions.filter(item => item.trim() !== ''),
        exclusions: formData.exclusions.filter(item => item.trim() !== ''),
        terms_and_conditions: formData.terms_and_conditions || null,
        makkah_hotel: formData.makkah_hotel || null,
        madinah_hotel: formData.madinah_hotel || null,
        flight_details: {
          flight_type: formData.flight_type,
          airline_name: formData.airline_name,
          departure_airport: formData.departure_airport,
          return_airport: formData.return_airport
        },
        activities: formData.activities,
        sharing_price: {
          adult: formData.sharing_price_adult ? parseFloat(formData.sharing_price_adult) : null,
          child_without_bed: formData.sharing_price_child_without_bed ? parseFloat(formData.sharing_price_child_without_bed) : null,
          infant: formData.sharing_price_infant ? parseFloat(formData.sharing_price_infant) : null
        },
        private_room_price: {
          quint: formData.private_room_price_quint ? parseFloat(formData.private_room_price_quint) : null,
          quad: formData.private_room_price_quad ? parseFloat(formData.private_room_price_quad) : null,
          triple: formData.private_room_price_triple ? parseFloat(formData.private_room_price_triple) : null,
          double: formData.private_room_price_double ? parseFloat(formData.private_room_price_double) : null,
          single: formData.private_room_price_single ? parseFloat(formData.private_room_price_single) : null
        },
        meal_plan: formData.meal_plan || null,
        seo: {
          meta_title: formData.seo_meta_title,
          meta_description: formData.seo_meta_description,
          meta_keywords: formData.seo_meta_keywords,
          canonical_url: formData.seo_canonical_url,
          og_title: formData.seo_og_title,
          og_description: formData.seo_og_description,
          og_image: formData.seo_og_image
        },
        hotels: {
          makkah: formData.hotels_makkah,
          madinah: formData.hotels_madinah,
          other: formData.hotels_other
        }
      };

      if (editingPackage) {
        const { error } = await supabase
          .from("umrah_packages")
          .update(packageData)
          .eq("id", editingPackage.id);

        if (error) throw error;
        toast.success("Package updated successfully");
      } else {
        const { error } = await supabase
          .from("umrah_packages")
          .insert([packageData]);

        if (error) throw error;
        toast.success("Package created successfully");
      }

      resetForm();
      fetchPackages();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration,
      departure_date: pkg.departure_date,
      return_date: pkg.return_date || "",
      booking_deadline: pkg.booking_deadline || "",
      status: pkg.status,
      package_category: pkg.package_category,
      season_category: pkg.season_category || "",
      is_group_package: pkg.is_group_package,
      max_capacity: pkg.max_capacity?.toString() || "",
      available_spots: pkg.available_spots?.toString() || "",
      cities_covered: pkg.cities_covered?.join(', ') || "",
      category: pkg.category || "",
      featured_image: pkg.featured_image || "",
      images: pkg.images || [],
      itinerary: pkg.itinerary || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      terms_and_conditions: pkg.terms_and_conditions || "",
      makkah_hotel: pkg.makkah_hotel || "",
      madinah_hotel: pkg.madinah_hotel || "",
      flight_type: pkg.flight_details?.flight_type || "",
      airline_name: pkg.flight_details?.airline_name || "",
      departure_airport: pkg.flight_details?.departure_airport || "",
      return_airport: pkg.flight_details?.return_airport || "",
      activities: pkg.activities || [],
      sharing_price_adult: pkg.sharing_price?.adult?.toString() || "",
      sharing_price_child_without_bed: pkg.sharing_price?.child_without_bed?.toString() || "",
      sharing_price_infant: pkg.sharing_price?.infant?.toString() || "",
      private_room_price_quint: pkg.private_room_price?.quint?.toString() || "",
      private_room_price_quad: pkg.private_room_price?.quad?.toString() || "",
      private_room_price_triple: pkg.private_room_price?.triple?.toString() || "",
      private_room_price_double: pkg.private_room_price?.double?.toString() || "",
      private_room_price_single: pkg.private_room_price?.single?.toString() || "",
      meal_plan: pkg.meal_plan || "",
      seo_meta_title: pkg.seo?.meta_title || "",
      seo_meta_description: pkg.seo?.meta_description || "",
      seo_meta_keywords: pkg.seo?.meta_keywords || "",
      seo_canonical_url: pkg.seo?.canonical_url || "",
      seo_og_title: pkg.seo?.og_title || "",
      seo_og_description: pkg.seo?.og_description || "",
      seo_og_image: pkg.seo?.og_image || "",
      hotels_makkah: pkg.hotels?.makkah || "",
      hotels_madinah: pkg.hotels?.madinah || "",
      hotels_other: pkg.hotels?.other || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const { error } = await supabase
        .from("umrah_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      departure_date: "",
      return_date: "",
      booking_deadline: "",
      status: "active",
      package_category: "",
      season_category: "",
      is_group_package: false,
      max_capacity: "",
      available_spots: "",
      cities_covered: "",
      category: "",
      featured_image: "",
      images: [],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      terms_and_conditions: "",
      makkah_hotel: "",
      madinah_hotel: "",
      flight_type: "",
      airline_name: "",
      departure_airport: "",
      return_airport: "",
      activities: [],
      sharing_price_adult: "",
      sharing_price_child_without_bed: "",
      sharing_price_infant: "",
      private_room_price_quint: "",
      private_room_price_quad: "",
      private_room_price_triple: "",
      private_room_price_double: "",
      private_room_price_single: "",
      meal_plan: "",
      seo_meta_title: "",
      seo_meta_description: "",
      seo_meta_keywords: "",
      seo_canonical_url: "",
      seo_og_title: "",
      seo_og_description: "",
      seo_og_image: "",
      hotels_makkah: "",
      hotels_madinah: "",
      hotels_other: ""
    });
    setEditingPackage(null);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePackage = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const PackageForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="package_category">Package Category</Label>
              <Input
                id="package_category"
                value={formData.package_category}
                onChange={(e) => handleInputChange("package_category", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <ReactQuill
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              theme="snow"
              style={{ height: '200px', marginBottom: '50px' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="departure_date">Departure Date</Label>
              <Input
                id="departure_date"
                type="date"
                value={formData.departure_date}
                onChange={(e) => handleInputChange("departure_date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="return_date">Return Date</Label>
              <Input
                id="return_date"
                type="date"
                value={formData.return_date}
                onChange={(e) => handleInputChange("return_date", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="booking_deadline">Booking Deadline</Label>
              <Input
                id="booking_deadline"
                type="date"
                value={formData.booking_deadline}
                onChange={(e) => handleInputChange("booking_deadline", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="season_category">Season Category</Label>
              <Select
                value={formData.season_category}
                onValueChange={(value) => handleInputChange("season_category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="peak">Peak Season</SelectItem>
                  <SelectItem value="off-peak">Off-Peak Season</SelectItem>
                  <SelectItem value="shoulder">Shoulder Season</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="meal_plan">Meal Plan</Label>
              <Select
                value={formData.meal_plan}
                onValueChange={(value) => handleInputChange("meal_plan", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast Only</SelectItem>
                  <SelectItem value="half-board">Half Board</SelectItem>
                  <SelectItem value="full-board">Full Board</SelectItem>
                  <SelectItem value="all-inclusive">All Inclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_group_package"
              checked={formData.is_group_package}
              onChange={(e) => handleInputChange("is_group_package", e.target.checked)}
            />
            <Label htmlFor="is_group_package">Group Package</Label>
          </div>

          {formData.is_group_package && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_capacity">Max Capacity</Label>
                <Input
                  id="max_capacity"
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => handleInputChange("max_capacity", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="available_spots">Available Spots</Label>
                <Input
                  id="available_spots"
                  type="number"
                  value={formData.available_spots}
                  onChange={(e) => handleInputChange("available_spots", e.target.value)}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">Sharing Price (Per Person)</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <Label htmlFor="sharing_price_adult">Adult</Label>
                <Input
                  id="sharing_price_adult"
                  type="number"
                  step="0.01"
                  value={formData.sharing_price_adult}
                  onChange={(e) => handleInputChange("sharing_price_adult", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sharing_price_child_without_bed">Child (Without Bed)</Label>
                <Input
                  id="sharing_price_child_without_bed"
                  type="number"
                  step="0.01"
                  value={formData.sharing_price_child_without_bed}
                  onChange={(e) => handleInputChange("sharing_price_child_without_bed", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sharing_price_infant">Infant</Label>
                <Input
                  id="sharing_price_infant"
                  type="number"
                  step="0.01"
                  value={formData.sharing_price_infant}
                  onChange={(e) => handleInputChange("sharing_price_infant", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold">Private Room Price (Per Room)</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <Label htmlFor="private_room_price_quint">Quint</Label>
                <Input
                  id="private_room_price_quint"
                  type="number"
                  step="0.01"
                  value={formData.private_room_price_quint}
                  onChange={(e) => handleInputChange("private_room_price_quint", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="private_room_price_quad">Quad</Label>
                <Input
                  id="private_room_price_quad"
                  type="number"
                  step="0.01"
                  value={formData.private_room_price_quad}
                  onChange={(e) => handleInputChange("private_room_price_quad", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="private_room_price_triple">Triple</Label>
                <Input
                  id="private_room_price_triple"
                  type="number"
                  step="0.01"
                  value={formData.private_room_price_triple}
                  onChange={(e) => handleInputChange("private_room_price_triple", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="private_room_price_double">Double</Label>
                <Input
                  id="private_room_price_double"
                  type="number"
                  step="0.01"
                  value={formData.private_room_price_double}
                  onChange={(e) => handleInputChange("private_room_price_double", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="private_room_price_single">Single</Label>
                <Input
                  id="private_room_price_single"
                  type="number"
                  step="0.01"
                  value={formData.private_room_price_single}
                  onChange={(e) => handleInputChange("private_room_price_single", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="price">Base Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor="cities_covered">Cities Covered (comma-separated)</Label>
            <Input
              id="cities_covered"
              value={formData.cities_covered}
              onChange={(e) => handleInputChange("cities_covered", e.target.value)}
              placeholder="Makkah, Madinah, Jeddah"
            />
          </div>

          <div>
            <Label>Featured Image</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, true);
                }}
                className="mb-2"
              />
              {formData.featured_image && (
                <img
                  src={formData.featured_image}
                  alt="Featured"
                  className="w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          </div>

          <div>
            <Label>Gallery Images</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => uploadImage(file, false));
                }}
                className="mb-2"
              />
              <div className="grid grid-cols-4 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Itinerary</Label>
            <div className="space-y-2 mt-2">
              {formData.itinerary.map((item, index) => (
                <div key={index} className="border p-4 rounded">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      placeholder="Day title"
                      value={item.title}
                      onChange={(e) => updateItineraryItem(index, 'title', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItineraryItem(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Day description"
                    value={item.description}
                    onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                  />
                </div>
              ))}
              <Button
                type="button"
                onClick={addItineraryItem}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Add Itinerary Item
              </Button>
            </div>
          </div>

          <div>
            <Label>Inclusions</Label>
            <div className="space-y-2 mt-2">
              {formData.inclusions.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Inclusion item"
                    value={item}
                    onChange={(e) => updateInclusionItem(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeInclusionItem(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addInclusionItem}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Add Inclusion
              </Button>
            </div>
          </div>

          <div>
            <Label>Exclusions</Label>
            <div className="space-y-2 mt-2">
              {formData.exclusions.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Exclusion item"
                    value={item}
                    onChange={(e) => updateExclusionItem(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeExclusionItem(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addExclusionItem}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Add Exclusion
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="terms_and_conditions">Terms and Conditions</Label>
            <ReactQuill
              value={formData.terms_and_conditions}
              onChange={(value) => handleInputChange("terms_and_conditions", value)}
              theme="snow"
              style={{ height: '150px', marginBottom: '50px' }}
            />
          </div>

          <div>
            <Label>Activities</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border p-2 rounded">
              {activities.map((activity) => (
                <label key={activity.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.activities.includes(activity.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          activities: [...prev.activities, activity.id]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          activities: prev.activities.filter(id => id !== activity.id)
                        }));
                      }
                    }}
                  />
                  <span className="text-sm">{activity.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold">Flight Details</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="flight_type">Flight Type</Label>
                <Select
                  value={formData.flight_type}
                  onValueChange={(value) => handleInputChange("flight_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select flight type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="connecting">Connecting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="airline_name">Airline Name</Label>
                <Input
                  id="airline_name"
                  value={formData.airline_name}
                  onChange={(e) => handleInputChange("airline_name", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="departure_airport">Departure Airport</Label>
                <Input
                  id="departure_airport"
                  value={formData.departure_airport}
                  onChange={(e) => handleInputChange("departure_airport", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="return_airport">Return Airport</Label>
                <Input
                  id="return_airport"
                  value={formData.return_airport}
                  onChange={(e) => handleInputChange("return_airport", e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hotels" className="space-y-4">
          <div>
            <Label htmlFor="makkah_hotel">Makkah Hotel</Label>
            <Select
              value={formData.makkah_hotel}
              onValueChange={(value) => handleInputChange("makkah_hotel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Makkah hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.filter(hotel => hotel.city.toLowerCase().includes('makkah') || hotel.city.toLowerCase().includes('mecca')).map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="madinah_hotel">Madinah Hotel</Label>
            <Select
              value={formData.madinah_hotel}
              onValueChange={(value) => handleInputChange("madinah_hotel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Madinah hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.filter(hotel => hotel.city.toLowerCase().includes('madinah') || hotel.city.toLowerCase().includes('medina')).map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hotels_makkah">Makkah Hotel Details</Label>
            <Textarea
              id="hotels_makkah"
              value={formData.hotels_makkah}
              onChange={(e) => handleInputChange("hotels_makkah", e.target.value)}
              placeholder="Additional hotel details for Makkah"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hotels_madinah">Madinah Hotel Details</Label>
            <Textarea
              id="hotels_madinah"
              value={formData.hotels_madinah}
              onChange={(e) => handleInputChange("hotels_madinah", e.target.value)}
              placeholder="Additional hotel details for Madinah"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hotels_other">Other Hotels</Label>
            <Textarea
              id="hotels_other"
              value={formData.hotels_other}
              onChange={(e) => handleInputChange("hotels_other", e.target.value)}
              placeholder="Hotel details for other cities"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seo_meta_title">Meta Title</Label>
              <Input
                id="seo_meta_title"
                value={formData.seo_meta_title}
                onChange={(e) => handleInputChange("seo_meta_title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="seo_canonical_url">Canonical URL</Label>
              <Input
                id="seo_canonical_url"
                value={formData.seo_canonical_url}
                onChange={(e) => handleInputChange("seo_canonical_url", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="seo_meta_description">Meta Description</Label>
            <Textarea
              id="seo_meta_description"
              value={formData.seo_meta_description}
              onChange={(e) => handleInputChange("seo_meta_description", e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="seo_meta_keywords">Meta Keywords</Label>
            <Input
              id="seo_meta_keywords"
              value={formData.seo_meta_keywords}
              onChange={(e) => handleInputChange("seo_meta_keywords", e.target.value)}
              placeholder="umrah, pilgrimage, makkah, madinah"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seo_og_title">OG Title</Label>
              <Input
                id="seo_og_title"
                value={formData.seo_og_title}
                onChange={(e) => handleInputChange("seo_og_title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="seo_og_image">OG Image URL</Label>
              <Input
                id="seo_og_image"
                value={formData.seo_og_image}
                onChange={(e) => handleInputChange("seo_og_image", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="seo_og_description">OG Description</Label>
            <Textarea
              id="seo_og_description"
              value={formData.seo_og_description}
              onChange={(e) => handleInputChange("seo_og_description", e.target.value)}
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <div>
            <Label>Additional Information</Label>
            <p className="text-sm text-gray-600">
              This tab can be used for any additional fields that don't fit in other categories.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button type="submit" disabled={uploadingImage}>
          {editingPackage ? "Update Package" : "Create Package"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  const PackageList = ({ packages: packageList, title }: { packages: Package[], title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {packageList.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No packages found</p>
        ) : (
          <div className="space-y-4">
            {packageList.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{pkg.name}</h3>
                    <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: pkg.description.substring(0, 100) + '...' }} />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Price:</span> ₹{pkg.price}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {pkg.duration}
                  </div>
                  <div>
                    <span className="font-medium">Departure:</span> {pkg.departure_date}
                  </div>
                  <div>
                    <Badge variant={pkg.status === "active" ? "default" : "secondary"}>
                      {pkg.status}
                    </Badge>
                  </div>
                </div>

                {pkg.is_group_package && (
                  <div className="mt-2 text-sm text-blue-600">
                    <span className="font-medium">Group Package:</span> {pkg.available_spots}/{pkg.max_capacity} spots available
                  </div>
                )}

                {pkg.cities_covered && pkg.cities_covered.length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Cities:</span> {pkg.cities_covered.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex justify-center py-8">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Package Manager</h2>
        <Button onClick={handleCreatePackage}>
          <Plus className="h-4 w-4 mr-2" />
          Create Package
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Packages ({packages.length})</TabsTrigger>
          <TabsTrigger value="group">Group Packages ({groupPackages.length})</TabsTrigger>
          <TabsTrigger value="independent">Independent Packages ({independentPackages.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <PackageList packages={packages} title="All Packages" />
        </TabsContent>

        <TabsContent value="group" className="space-y-4">
          <PackageList packages={groupPackages} title="Group Packages" />
        </TabsContent>

        <TabsContent value="independent" className="space-y-4">
          <PackageList packages={independentPackages} title="Independent Packages" />
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Create New Package"}
            </DialogTitle>
          </DialogHeader>
          <PackageForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageManager;
