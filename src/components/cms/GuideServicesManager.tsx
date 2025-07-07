import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Plus, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface GuideService {
  id: string;
  guide_name: string;
  guide_city: string;
  phone_number: number | null;
  country_code: string | null;
  description: string;
  experience: string;
  languages: string[];
  specializations: string[];
  qualifications: string[];
  services_offered: string[];
  service_type: string;
  service_prices: string;
  availability_schedule: string;
  guide_photo: string;
  featured_service: boolean;
  rating: number;
  status: "active" | "inactive";
}

interface GuideFormData {
  guideName: string;
  guideCity: string;
  phoneNumber: number | null;
  countryCode: string | null;
  description: string;
  experience: string;
  languages: string[];
  specializations: string[];
  qualifications: string[];
  servicesOffered: string[];
  serviceType: string;
  servicePrices: string;
  availabilitySchedule: string;
  guidePhoto: string;
  featuredService: boolean;
  rating: number | null;
  status: "active" | "inactive";
}

const GuideServicesManager = () => {
  const [guides, setGuides] = useState<GuideService[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all",
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideService | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [guideName, setGuideName] = useState("");
  const [guideCity, setGuideCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<number | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [servicePrices, setServicePrices] = useState("");
  const [availabilitySchedule, setAvailabilitySchedule] = useState("");
  const [guidePhoto, setGuidePhoto] = useState("");
  const [featuredService, setFeaturedService] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      let query = supabase.from("guide_services").select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setGuides(data || []);
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
    setIsFormOpen(true);

    setGuideName(guide.guide_name);
    setGuideCity(guide.guide_city);
    setPhoneNumber(guide.phone_number);
    setCountryCode(guide.country_code);
    setDescription(guide.description);
    setExperience(guide.experience);
    setLanguages(guide.languages);
    setSpecializations(guide.specializations);
    setQualifications(guide.qualifications);
    setServicesOffered(guide.services_offered);
    setServiceType(guide.service_type);
    setServicePrices(guide.service_prices);
    setAvailabilitySchedule(guide.availability_schedule);
    setGuidePhoto(guide.guide_photo);
    setFeaturedService(guide.featured_service);
    setRating(guide.rating);
    setStatus(guide.status);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this guide?")) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from("guide_services")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Guide deleted successfully!",
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

  const reset = () => {
    setGuideName("");
    setGuideCity("");
    setPhoneNumber(null);
    setCountryCode("");
    setDescription("");
    setExperience("");
    setLanguages([]);
    setSpecializations([]);
    setQualifications([]);
    setServicesOffered([]);
    setServiceType("");
    setServicePrices("");
    setAvailabilitySchedule("");
    setGuidePhoto("");
    setFeaturedService(false);
    setRating(null);
    setStatus("active");
  };

  const handleSubmit = async (data: GuideFormData) => {
    try {
      setLoading(true);

      const guideData = {
        guide_name: data.guideName,
        guide_city: data.guideCity,
        phone_number: data.phoneNumber,
        country_code: data.countryCode,
        description: data.description,
        experience: data.experience,
        languages: data.languages,
        specializations: data.specializations,
        qualifications: data.qualifications,
        services_offered: data.servicesOffered,
        service_type: data.serviceType,
        service_prices: data.servicePrices,
        availability_schedule: data.availabilitySchedule,
        guide_photo: data.guidePhoto,
        featured_service: data.featuredService,
        rating: data.rating ? parseFloat(data.rating.toString()) : 0,
        status: data.status,
      };

      if (editingGuide) {
        const { error } = await supabase
          .from("guide_services")
          .update(guideData)
          .eq("id", editingGuide.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Guide updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from("guide_services")
          .insert([guideData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Guide added successfully!",
        });
      }

      fetchGuides();
      setIsFormOpen(false);
      setEditingGuide(null);
      reset();
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          <Button onClick={() => setIsFormOpen(true)}>
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
                <TableHead>Services</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell className="font-medium">{guide.guide_name}</TableCell>
                  <TableCell>{guide.guide_city}</TableCell>
                  <TableCell>{String(guide.phone_number || '')}</TableCell>
                  <TableCell>
                    {Array.isArray(guide.services_offered) && guide.services_offered.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {guide.services_offered.slice(0, 2).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {String(service)}
                          </Badge>
                        ))}
                        {guide.services_offered.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{guide.services_offered.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {guide.rating || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={guide.status === "active" ? "default" : "secondary"}>
                      {guide.status}
                    </Badge>
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

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingGuide ? "Edit Guide" : "Add New Guide"}
              </DialogTitle>
              <DialogDescription>
                {editingGuide
                  ? "Update guide details here. Click save when done."
                  : "Add a new guide to the list. Make sure everything is clear."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guideName">Guide Name</Label>
                  <Input
                    id="guideName"
                    value={guideName}
                    onChange={(e) => setGuideName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="guideCity">Guide City</Label>
                  <Input
                    id="guideCity"
                    value={guideCity}
                    onChange={(e) => setGuideCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    type="number"
                    id="phoneNumber"
                    value={phoneNumber !== null ? phoneNumber.toString() : ""}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value ? parseInt(e.target.value) : null)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="countryCode">Country Code</Label>
                  <Input
                    id="countryCode"
                    value={countryCode || ""}
                    onChange={(e) => setCountryCode(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="languages">Languages (comma-separated)</Label>
                  <Input
                    id="languages"
                    value={languages.join(",")}
                    onChange={(e) =>
                      setLanguages(
                        e.target.value.split(",").map((lang) => lang.trim()),
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specializations">
                    Specializations (comma-separated)
                  </Label>
                  <Input
                    id="specializations"
                    value={specializations.join(",")}
                    onChange={(e) =>
                      setSpecializations(
                        e.target.value.split(",").map((spec) => spec.trim()),
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="qualifications">
                    Qualifications (comma-separated)
                  </Label>
                  <Input
                    id="qualifications"
                    value={qualifications.join(",")}
                    onChange={(e) =>
                      setQualifications(
                        e.target.value.split(",").map((qual) => qual.trim()),
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="servicesOffered">
                  Services Offered (comma-separated)
                </Label>
                <Input
                  id="servicesOffered"
                  value={servicesOffered.join(",")}
                  onChange={(e) =>
                    setServicesOffered(
                      e.target.value.split(",").map((service) => service.trim()),
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Input
                    id="serviceType"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="servicePrices">Service Prices</Label>
                  <Input
                    id="servicePrices"
                    value={servicePrices}
                    onChange={(e) => setServicePrices(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="availabilitySchedule">Availability Schedule</Label>
                <Input
                  id="availabilitySchedule"
                  value={availabilitySchedule}
                  onChange={(e) => setAvailabilitySchedule(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="guidePhoto">Guide Photo URL</Label>
                <Input
                  id="guidePhoto"
                  value={guidePhoto}
                  onChange={(e) => setGuidePhoto(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="featuredService">Featured Service</Label>
                <Checkbox
                  id="featuredService"
                  checked={featuredService}
                  onCheckedChange={(checked) => setFeaturedService(!!checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    type="number"
                    id="rating"
                    value={rating !== null ? rating.toString() : ""}
                    onChange={(e) =>
                      setRating(e.target.value ? parseFloat(e.target.value) : null)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
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
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingGuide(null);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleSubmit({
                    guideName,
                    guideCity,
                    phoneNumber,
                    countryCode,
                    description,
                    experience,
                    languages,
                    specializations,
                    qualifications,
                    servicesOffered,
                    serviceType,
                    servicePrices,
                    availabilitySchedule,
                    guidePhoto,
                    featuredService,
                    rating,
                    status,
                  });
                }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GuideServicesManager;
