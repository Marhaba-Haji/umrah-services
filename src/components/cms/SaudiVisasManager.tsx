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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface SaudiVisa {
  id: number;
  visaType: string;
  visaCategory: string;
  price: string;
  processingTime: string;
  visaValidity: string;
  stayValidity: string;
  numberOfEntries: string;
  requirements: string[];
  description: string;
  status: string;
  approvalRate?: number;
  process: string;
  total_stay_allowed: number | null;
  eligibility: string;
  visa_format: string;
  agency_fees: number | null;
  embassy_fees: number | null;
  checklist_url: string;
  featured_image?: string;
}

// Define a type for the form data
interface VisaFormData {
  visaType: string;
  visaCategory: string;
  price: string;
  processingTime: string;
  visaValidity: string;
  stayValidity: string;
  numberOfEntries: string;
  requirements: string;
  description: string;
  status: string;
  approvalRate?: string;
  process?: string;
  totalStayAllowed?: string;
  eligibility?: string;
  visaFormat?: string;
  agencyFees?: string;
  embassyFees?: string;
  checklistUrl?: string;
  featuredImage?: string;
}

const SaudiVisasManager = () => {
  const [visas, setVisas] = useState<SaudiVisa[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<SaudiVisa | null>(null);

  const form = useForm({
    defaultValues: {
      visaType: "",
      visaCategory: "",
      price: "",
      processingTime: "",
      visaValidity: "",
      stayValidity: "",
      numberOfEntries: "",
      requirements: "",
      description: "",
      status: "active",
      approvalRate: "",
      process: "",
      totalStayAllowed: "",
      eligibility: "",
      visaFormat: "",
      agencyFees: "",
      embassyFees: "",
      checklistUrl: "",
      featuredImage: "",
    },
  });

  // Fetch visas from Supabase
  const fetchVisas = async () => {
    const { data, error } = await supabase.from("saudi_visas").select("*");
    if (error) {
      alert("Failed to fetch visas: " + error.message);
      return;
    }
    setVisas(
      (data || []).map((row) => ({
        id: row.id,
        visaType: row.visa_type,
        visaCategory: row.visa_category,
        price: `₹${row.price}`,
        processingTime: row.processing_time,
        visaValidity: row.visa_validity,
        stayValidity: row.stay_validity,
        numberOfEntries: row.number_of_entries,
        requirements: row.requirements || [],
        description: row.description,
        status: row.status?.charAt(0).toUpperCase() + row.status.slice(1),
        approvalRate: row.approval_rate,
        process: row.process,
        total_stay_allowed: row.total_stay_allowed,
        eligibility: row.eligibility,
        visa_format: row.visa_format,
        agency_fees: row.agency_fees,
        embassy_fees: row.embassy_fees,
        checklist_url: row.checklist_url,
        featured_image: row.featured_image,
      })),
    );
  };

  useEffect(() => {
    fetchVisas();
    // Auto-fix any existing non-public featured_image URLs
    (async () => {
      const { data: visas, error } = await supabase
        .from("saudi_visas")
        .select("id, featured_image");
      if (!error && visas) {
        for (const visa of visas) {
          if (
            visa.featured_image &&
            !visa.featured_image.includes("/public/visa-images/")
          ) {
            const fileName = visa.featured_image.split("/").pop();
            const publicUrl = `https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/visa-images/${fileName}`;
            await supabase
              .from("saudi_visas")
              .update({ featured_image: publicUrl })
              .eq("id", visa.id);
          }
        }
      }
    })();
  }, []);

  const onSubmit = async (data: VisaFormData) => {
    const visaPayload = {
      visa_type: data.visaType,
      visa_category: data.visaCategory,
      price: parseFloat(data.price.replace(/[^0-9.]/g, "")),
      processing_time: data.processingTime,
      visa_validity: data.visaValidity,
      stay_validity: data.stayValidity,
      number_of_entries: data.numberOfEntries,
      requirements: data.requirements
        .split(",")
        .map((req: string) => req.trim()),
      description: data.description,
      status: data.status,
      approval_rate: data.approvalRate ? parseFloat(data.approvalRate) : null,
      process: data.process,
      total_stay_allowed: data.totalStayAllowed
        ? parseInt(data.totalStayAllowed, 10)
        : null,
      eligibility: data.eligibility,
      visa_format: data.visaFormat,
      agency_fees: data.agencyFees ? parseFloat(data.agencyFees) : null,
      embassy_fees: data.embassyFees ? parseFloat(data.embassyFees) : null,
      checklist_url: data.checklistUrl,
      featured_image: data.featuredImage,
    };

    let error;
    if (editingVisa) {
      // Update existing visa
      ({ error } = await supabase
        .from("saudi_visas")
        .update(visaPayload)
        .eq("id", editingVisa.id));
    } else {
      // Insert new visa
      ({ error } = await supabase.from("saudi_visas").insert(visaPayload));
    }

    if (error) {
      alert("Failed to save visa: " + error.message);
      return;
    }
    await fetchVisas();
    setIsDialogOpen(false);
    setEditingVisa(null);
    form.reset();
  };

  const handleEdit = (visa: SaudiVisa & { [key: string]: unknown }) => {
    setEditingVisa(visa);
    form.reset({
      visaType: visa.visaType,
      visaCategory: visa.visaCategory,
      price: visa.price,
      processingTime: visa.processingTime,
      visaValidity: visa.visaValidity,
      stayValidity: visa.stayValidity,
      numberOfEntries: visa.numberOfEntries,
      requirements: visa.requirements.join(", "),
      description: visa.description,
      status: visa.status.toLowerCase(),
      approvalRate:
        visa.approvalRate !== undefined && visa.approvalRate !== null
          ? visa.approvalRate.toString()
          : "",
      process: visa.process || "",
      totalStayAllowed:
        visa.total_stay_allowed !== undefined &&
        visa.total_stay_allowed !== null
          ? visa.total_stay_allowed.toString()
          : "",
      eligibility: visa.eligibility || "",
      visaFormat: visa.visa_format || "",
      agencyFees:
        visa.agency_fees !== undefined && visa.agency_fees !== null
          ? visa.agency_fees.toString()
          : "",
      embassyFees:
        visa.embassy_fees !== undefined && visa.embassy_fees !== null
          ? visa.embassy_fees.toString()
          : "",
      checklistUrl: visa.checklist_url || "",
      featuredImage: visa.featured_image || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("saudi_visas").delete().eq("id", id);
    if (error) {
      alert("Failed to delete visa: " + error.message);
      return;
    }
    await fetchVisas();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("visa-images")
      .upload(fileName, file, { upsert: true });
    if (error) {
      alert("Failed to upload image: " + error.message);
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from("visa-images")
      .getPublicUrl(fileName);
    if (publicUrlData && publicUrlData.publicUrl) {
      form.setValue("featuredImage", publicUrlData.publicUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Saudi Visas Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingVisa(null);
                form.reset();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Visa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVisa ? "Edit Saudi Visa" : "Add New Saudi Visa"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="visaType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visa Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visa type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Umrah Visa">
                              Umrah Visa
                            </SelectItem>
                            <SelectItem value="Tourist Visa">
                              Tourist Visa
                            </SelectItem>
                            <SelectItem value="Business Visa">
                              Business Visa
                            </SelectItem>
                            <SelectItem value="Family Visit Visa">
                              Family Visit Visa
                            </SelectItem>
                            <SelectItem value="Student Visa">
                              Student Visa
                            </SelectItem>
                            <SelectItem value="Job Waqala">
                              Job Waqala
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="visaCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visa Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Express">Express</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="₹12000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="processingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Processing Time</FormLabel>
                        <FormControl>
                          <Input placeholder="3-5 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="visaValidity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visa Validity</FormLabel>
                        <FormControl>
                          <Input placeholder="30 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stayValidity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stay Validity</FormLabel>
                        <FormControl>
                          <Input placeholder="15 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfEntries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Entries</FormLabel>
                        <FormControl>
                          <Input placeholder="Single / Multiple" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Passport, Photo, Vaccination Certificate"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="discontinued">
                            Discontinued
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approvalRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approval Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          placeholder="e.g. 98.5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="process"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Process</FormLabel>
                      <FormControl>
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalStayAllowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Stay Allowed (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="e.g. 90"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eligibility"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Eligibility</FormLabel>
                      <FormControl>
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visaFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="eVisa">eVisa</SelectItem>
                          <SelectItem value="Sticker Visa">
                            Sticker Visa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agencyFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency Fees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="e.g. 1500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="embassyFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embassy Fees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="e.g. 12000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checklistUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Checklist PDF URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://.../checklist.pdf"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <a
                          href={field.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mt-1 inline-block"
                        >
                          Download Checklist
                        </a>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Featured Image</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          {field.value && (
                            <img
                              src={field.value}
                              alt="Featured"
                              className="w-32 h-20 object-cover rounded border"
                            />
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingVisa ? "Update Visa" : "Create Visa"}
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

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Visa Type</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Processing Time</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visas.map((visa) => (
                  <tr key={visa.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{visa.visaType}</div>
                        <div className="text-sm text-gray-500">
                          Valid for {visa.visaValidity}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{visa.visaCategory}</Badge>
                    </td>
                    <td className="p-2">{visa.price}</td>
                    <td className="p-2">{visa.processingTime}</td>
                    <td className="p-2">
                      <Badge
                        variant={
                          visa.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {visa.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(visa)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(visa.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaudiVisasManager;
