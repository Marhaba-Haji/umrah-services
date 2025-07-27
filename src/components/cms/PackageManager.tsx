
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
    available_spots: ""
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
        available_spots: formData.available_spots ? parseInt(formData.available_spots) : null
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
      available_spots: pkg.available_spots?.toString() || ""
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
      available_spots: ""
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <Label htmlFor="package_category">Category</Label>
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
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_group_package"
            checked={formData.is_group_package}
            onChange={(e) => handleInputChange("is_group_package", e.target.checked)}
          />
          <Label htmlFor="is_group_package">Group Package</Label>
        </div>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
