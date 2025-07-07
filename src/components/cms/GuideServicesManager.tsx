
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface GuideService {
  id: string;
  guide_name: string;
  guide_city: string;
  phone_number: string | null;
  country_code: string | null;
  description: string | null;
  experience: string | null;
  languages: string[] | null;
  specializations: string[] | null;
  qualifications: string[] | null;
  service_type: string[] | null;
  services_offered: string[] | null;
  service_prices: any;
  availability_schedule: any;
  rating: number | null;
  guide_photo: string | null;
  featured_service: string | null;
  status: "active" | "inactive";
}

interface GuideFormData {
  guide_name: string;
  guide_city: string;
  phone_number: string;
  country_code: string;
  description: string;
  experience: string;
  languages: string;
  specializations: string;
  qualifications: string;
  service_type: string;
  services_offered: string;
  featured_service: string;
  status: "active" | "inactive";
}

const GuideServicesManager = () => {
  const [guides, setGuides] = useState<GuideService[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideService | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [formData, setFormData] = useState<GuideFormData>({
    guide_name: "",
    guide_city: "",
    phone_number: "",
    country_code: "",
    description: "",
    experience: "",
    languages: "",
    specializations: "",
    qualifications: "",
    service_type: "",
    services_offered: "",
    featured_service: "",
    status: "active",
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("guide_services")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Map the data to ensure proper typing
      const mappedGuides: GuideService[] = (data || []).map(guide => ({
        ...guide,
        status: guide.status as "active" | "inactive"
      }));
      
      setGuides(mappedGuides);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter((guide) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      guide.guide_name.toLowerCase().includes(searchTermLower) ||
      guide.guide_city.toLowerCase().includes(searchTermLower)
    );
  });

  const handleEdit = (guide: GuideService) => {
    setEditingGuide(guide);
    setFormData({
      guide_name: guide.guide_name,
      guide_city: guide.guide_city,
      phone_number: guide.phone_number || "",
      country_code: guide.country_code || "",
      description: guide.description || "",
      experience: guide.experience || "",
      languages: guide.languages?.join(", ") || "",
      specializations: guide.specializations?.join(", ") || "",
      qualifications: guide.qualifications?.join(", ") || "",
      service_type: guide.service_type?.join(", ") || "",
      services_offered: guide.services_offered?.join(", ") || "",
      featured_service: guide.featured_service || "",
      status: guide.status,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this guide service?")) {
      setLoading(true);
      try {
        const { error } = await supabase.from("guide_services").delete().eq("id", id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Guide service deleted successfully!",
        });
        fetchGuides();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const guideData = {
        guide_name: formData.guide_name,
        guide_city: formData.guide_city,
        phone_number: formData.phone_number || null,
        country_code: formData.country_code || null,
        description: formData.description || null,
        experience: formData.experience || null,
        languages: formData.languages ? formData.languages.split(",").map(s => s.trim()) : null,
        specializations: formData.specializations ? formData.specializations.split(",").map(s => s.trim()) : null,
        qualifications: formData.qualifications ? formData.qualifications.split(",").map(s => s.trim()) : null,
        service_type: formData.service_type ? formData.service_type.split(",").map(s => s.trim()) : null,
        services_offered: formData.services_offered ? formData.services_offered.split(",").map(s => s.trim()) : null,
        featured_service: formData.featured_service || null,
        status: formData.status,
      };

      if (editingGuide) {
        const { error } = await supabase
          .from("guide_services")
          .update(guideData)
          .eq("id", editingGuide.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Guide service updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from("guide_services")
          .insert([guideData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Guide service added successfully!",
        });
      }

      fetchGuides();
      setIsFormOpen(false);
      setEditingGuide(null);
      setFormData({
        guide_name: "",
        guide_city: "",
        phone_number: "",
        country_code: "",
        description: "",
        experience: "",
        languages: "",
        specializations: "",
        qualifications: "",
        service_type: "",
        services_offered: "",
        featured_service: "",
        status: "active",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as "all" | "active" | "inactive");
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as "active" | "inactive" }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide Services Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => {
            setEditingGuide(null);
            setFormData({
              guide_name: "",
              guide_city: "",
              phone_number: "",
              country_code: "",
              description: "",
              experience: "",
              languages: "",
              specializations: "",
              qualifications: "",
              service_type: "",
              services_offered: "",
              featured_service: "",
              status: "active",
            });
            setIsFormOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Guide
          </Button>
        </div>

        {/* Guides Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guide Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell className="font-medium">{guide.guide_name}</TableCell>
                  <TableCell>{guide.guide_city}</TableCell>
                  <TableCell>{guide.phone_number || "N/A"}</TableCell>
                  <TableCell>{guide.experience || "N/A"}</TableCell>
                  <TableCell>
                    {guide.status === "active" ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(guide)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(guide.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingGuide ? "Edit Guide Service" : "Add New Guide Service"}</DialogTitle>
              <DialogDescription>
                {editingGuide ? "Update guide service details." : "Enter details for the new guide service."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guide_name">Guide Name *</Label>
                  <Input
                    id="guide_name"
                    value={formData.guide_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, guide_name: e.target.value }))}
                    placeholder="Enter guide name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guide_city">City *</Label>
                  <Input
                    id="guide_city"
                    value={formData.guide_city}
                    onChange={(e) => setFormData(prev => ({ ...prev, guide_city: e.target.value }))}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="country_code">Country Code</Label>
                  <Input
                    id="country_code"
                    value={formData.country_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, country_code: e.target.value }))}
                    placeholder="e.g., +971"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Enter experience details"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="languages">Languages (comma-separated)</Label>
                  <Input
                    id="languages"
                    value={formData.languages}
                    onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                    placeholder="e.g., English, Arabic, Urdu"
                  />
                </div>
                <div>
                  <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                  <Input
                    id="specializations"
                    value={formData.specializations}
                    onChange={(e) => setFormData(prev => ({ ...prev, specializations: e.target.value }))}
                    placeholder="e.g., Umrah, Hajj, Tours"
                  />
                </div>
                <div>
                  <Label htmlFor="qualifications">Qualifications (comma-separated)</Label>
                  <Input
                    id="qualifications"
                    value={formData.qualifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                    placeholder="e.g., Certified Guide, Religious Studies"
                  />
                </div>
                <div>
                  <Label htmlFor="service_type">Service Types (comma-separated)</Label>
                  <Input
                    id="service_type"
                    value={formData.service_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
                    placeholder="e.g., Group Tours, Private Tours"
                  />
                </div>
                <div>
                  <Label htmlFor="services_offered">Services Offered (comma-separated)</Label>
                  <Input
                    id="services_offered"
                    value={formData.services_offered}
                    onChange={(e) => setFormData(prev => ({ ...prev, services_offered: e.target.value }))}
                    placeholder="e.g., Ziyarat, Historical Tours"
                  />
                </div>
                <div>
                  <Label htmlFor="featured_service">Featured Service</Label>
                  <Input
                    id="featured_service"
                    value={formData.featured_service}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_service: e.target.value }))}
                    placeholder="Enter featured service"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GuideServicesManager;
