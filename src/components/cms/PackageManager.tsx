
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
import { Plus, Edit, Trash2, Eye } from "lucide-react";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  departure_date: string;
  status: string;
  package_category: string;
  is_group_package: boolean;
  max_capacity?: number;
  available_spots?: number;
  created_at: string;
  updated_at: string;
  cities_covered?: string[];
  category?: string;
  images?: string[];
  itinerary?: any;
  seo?: any;
  hotels?: any;
}

const PackageManager = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [groupPackages, setGroupPackages] = useState<Package[]>([]);
  const [independentPackages, setIndependentPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    departure_date: "",
    status: "active",
    package_category: "",
    is_group_package: false,
    max_capacity: "",
    available_spots: "",
    cities_covered: "",
    category: "",
    images: "",
    itinerary: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Parse JSON fields
      const citiesCovered = formData.cities_covered ? formData.cities_covered.split(',').map(city => city.trim()) : [];
      const images = formData.images ? formData.images.split(',').map(img => img.trim()) : [];
      
      let itinerary = null;
      let seo = null;
      let hotels = null;

      try {
        if (formData.itinerary) {
          itinerary = JSON.parse(formData.itinerary);
        }
      } catch (e) {
        console.warn("Invalid itinerary JSON, saving as null");
      }

      try {
        if (formData.seo_meta_title || formData.seo_meta_description || formData.seo_meta_keywords || formData.seo_canonical_url || formData.seo_og_title || formData.seo_og_description || formData.seo_og_image) {
          seo = {
            meta_title: formData.seo_meta_title,
            meta_description: formData.seo_meta_description,
            meta_keywords: formData.seo_meta_keywords,
            canonical_url: formData.seo_canonical_url,
            og_title: formData.seo_og_title,
            og_description: formData.seo_og_description,
            og_image: formData.seo_og_image
          };
        }
      } catch (e) {
        console.warn("Invalid SEO data, saving as null");
      }

      try {
        if (formData.hotels_makkah || formData.hotels_madinah || formData.hotels_other) {
          hotels = {
            makkah: formData.hotels_makkah,
            madinah: formData.hotels_madinah,
            other: formData.hotels_other
          };
        }
      } catch (e) {
        console.warn("Invalid hotels data, saving as null");
      }

      const packageData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration,
        departure_date: formData.departure_date,
        status: formData.status,
        package_category: formData.package_category,
        is_group_package: formData.is_group_package,
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : null,
        available_spots: formData.available_spots ? parseInt(formData.available_spots) : null,
        cities_covered: citiesCovered,
        category: formData.category,
        images: images,
        itinerary: itinerary,
        seo: seo,
        hotels: hotels
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
      status: pkg.status,
      package_category: pkg.package_category,
      is_group_package: pkg.is_group_package,
      max_capacity: pkg.max_capacity?.toString() || "",
      available_spots: pkg.available_spots?.toString() || "",
      cities_covered: pkg.cities_covered?.join(', ') || "",
      category: pkg.category || "",
      images: pkg.images?.join(', ') || "",
      itinerary: pkg.itinerary ? JSON.stringify(pkg.itinerary, null, 2) : "",
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
      status: "active",
      package_category: "",
      is_group_package: false,
      max_capacity: "",
      available_spots: "",
      cities_covered: "",
      category: "",
      images: "",
      itinerary: "",
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
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
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>
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
            <Label htmlFor="images">Images (comma-separated URLs)</Label>
            <Textarea
              id="images"
              value={formData.images}
              onChange={(e) => handleInputChange("images", e.target.value)}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="itinerary">Itinerary (JSON format)</Label>
            <Textarea
              id="itinerary"
              value={formData.itinerary}
              onChange={(e) => handleInputChange("itinerary", e.target.value)}
              placeholder='{"day1": "Arrival", "day2": "Umrah"}'
              rows={6}
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

        <TabsContent value="hotels" className="space-y-4">
          <div>
            <Label htmlFor="hotels_makkah">Makkah Hotels</Label>
            <Textarea
              id="hotels_makkah"
              value={formData.hotels_makkah}
              onChange={(e) => handleInputChange("hotels_makkah", e.target.value)}
              placeholder="Hotel names and details for Makkah"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hotels_madinah">Madinah Hotels</Label>
            <Textarea
              id="hotels_madinah"
              value={formData.hotels_madinah}
              onChange={(e) => handleInputChange("hotels_madinah", e.target.value)}
              placeholder="Hotel names and details for Madinah"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hotels_other">Other Hotels</Label>
            <Textarea
              id="hotels_other"
              value={formData.hotels_other}
              onChange={(e) => handleInputChange("hotels_other", e.target.value)}
              placeholder="Hotel names and details for other cities"
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button type="submit">
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
                    <p className="text-gray-600 text-sm">{pkg.description}</p>
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
