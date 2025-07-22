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
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Search,
  Filter,
} from "lucide-react";
import HotelEnquiriesManager from "../../pages/cms/HotelEnquiriesManager";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  source: string;
  notes: string;
  date: string;
  followUpDate?: string;
  raw?: any; // Add raw property
}

type ContactInquiry = Record<string, unknown>;
type GroupFlightInquiry = Record<string, unknown>;

type LeadFormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  source: string;
  notes: string;
  followUpDate?: string;
};

interface VisaApplication {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  passport_number: string;
  gender: string;
  phone: string;
  email: string;
  payment_status: string | null;
  status: string | null;
  created_at: string;
}

const LeadManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(
    [],
  );
  const [groupFlightInquiries, setGroupFlightInquiries] = useState<
    GroupFlightInquiry[]
  >([]);
  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>(
    [],
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [messageLead, setMessageLead] = useState<Lead | null>(null);
  const [messageText, setMessageText] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "Umrah Visa",
      status: "New",
      source: "Website",
      notes: "",
      followUpDate: "",
    },
  });

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        setLeads(
          data.map((lead) => ({
            id: lead.id,
            name:
              lead.first_name + (lead.last_name ? " " + lead.last_name : ""),
            email: lead.email,
            phone:
              (lead.country_code ? lead.country_code + " " : "") + lead.phone,
            service: lead.service_interest,
            status: lead.status || "New",
            source: lead.lead_source || "Website",
            notes: lead.notes || "",
            date: lead.created_at ? lead.created_at.split("T")[0] : "",
            followUpDate: lead.follow_up_date
              ? lead.follow_up_date.split("T")[0]
              : undefined,
            raw: lead, // store the full object
          })),
        );
      }
      if (error) {
        console.error("Error fetching leads:", error.message);
      }
    }
    fetchLeads();

    // Real-time subscription
    const channel = supabase.channel("leads-realtime");
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          fetchLeads();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchContactInquiries() {
      const { data, error } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setContactInquiries(data);
      if (error)
        console.error("Error fetching contact inquiries:", error.message);
    }
    fetchContactInquiries();
    // Optionally subscribe to changes
    const channel = supabase.channel("contact-inquiries-realtime");
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_inquiries" },
        () => {
          fetchContactInquiries();
        },
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchGroupFlightInquiries() {
      const { data, error } = await supabase
        .from("group_flight_inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setGroupFlightInquiries(data);
      if (error)
        console.error("Error fetching group flight inquiries:", error.message);
    }
    fetchGroupFlightInquiries();
    // Optionally subscribe to changes
    const channel = supabase.channel("group-flight-inquiries-realtime");
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_flight_inquiries" },
        () => {
          fetchGroupFlightInquiries();
        },
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchVisaApplications();
    // Optionally, add a subscription for real-time updates if needed
  }, []);

  const fetchVisaApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("visa_applications")
        .select("*")
        .or("payment_status.is.null,payment_status.neq.completed")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Deduplicate by id
      const unique = Array.from(
        new Map((data || []).map((v) => [v.id, v])).values(),
      );
      setVisaApplications(unique);
    } catch (error) {
      console.error(
        "Error fetching visa applications:",
        (error as Error).message,
      );
    }
  };

  const onSubmit = (data: unknown) => {
    const d = data as LeadFormData;
    const newLead: Lead = {
      id: editingLead ? editingLead.id : Date.now(),
      name: d.name,
      email: d.email,
      phone: d.phone,
      service: d.service,
      status: d.status,
      source: d.source,
      notes: d.notes,
      date: editingLead
        ? editingLead.date
        : new Date().toISOString().split("T")[0],
      followUpDate: d.followUpDate || undefined,
    };

    if (editingLead) {
      setLeads(
        leads.map((lead) => (lead.id === editingLead.id ? newLead : lead)),
      );
    } else {
      setLeads([...leads, newLead]);
    }

    setIsDialogOpen(false);
    setEditingLead(null);
    form.reset();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    form.reset({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      followUpDate: lead.followUpDate || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "New":
        return "default";
      case "Contacted":
        return "secondary";
      case "Qualified":
        return "outline";
      case "Converted":
        return "default";
      case "Lost":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingLead(null);
                form.reset();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLead ? "Edit Lead" : "Add New Lead"}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+966501234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Interest</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Umrah Visa">
                              Umrah Visa
                            </SelectItem>
                            <SelectItem value="Umrah Package">
                              Umrah Package
                            </SelectItem>
                            <SelectItem value="Hotel Booking">
                              Hotel Booking
                            </SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Group Flights">
                              Group Flights
                            </SelectItem>
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
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Social Media">
                              Social Media
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="followUpDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow-up Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes about the lead..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingLead ? "Update Lead" : "Create Lead"}
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

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search leads by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Service</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Source</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        {lead.followUpDate && (
                          <div className="text-xs text-red-600">
                            Follow up: {lead.followUpDate}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{lead.service}</td>
                    <td className="p-2">
                      <Badge variant={getStatusBadgeVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{lead.source}</Badge>
                    </td>
                    <td className="p-2">{lead.date}</td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewLead(lead)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(lead)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setMessageLead(lead)}
                        >
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(lead.id)}
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
          {/* Umrah Visa Applications Section */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">
              Umrah Visa Applications (Unpaid/Failed)
            </h2>
            <div className="rounded-md border overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nationality
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passport
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visaApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {app.nationality}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {app.passport_number}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {app.gender}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {app.phone}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {app.email}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {app.status}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {app.payment_status}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visaApplications.length === 0 && (
                <div className="p-4 text-gray-500">
                  No unpaid or failed Umrah visa applications found.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Lead Dialog */}
      <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {viewLead && viewLead.raw && (
            <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto bg-gray-50 rounded-lg p-4 shadow-inner">
              {Object.entries(viewLead.raw).map(([key, value]) => (
                <div key={key} className="flex gap-2 border-b pb-1 last:border-b-0 last:pb-0">
                  <span className="font-semibold capitalize min-w-[140px] text-gray-700">{key.replace(/_/g, ' ')}:</span>
                  <span className="break-all text-gray-900">
                    {typeof value === "object" && value !== null
                      ? <pre className="whitespace-pre-wrap text-xs text-gray-600">{JSON.stringify(value, null, 2)}</pre>
                      : value === null || value === ""
                        ? <span className="text-gray-400">—</span>
                        : (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/))
                          ? new Date(value).toLocaleString()
                          : value}
                  </span>
              </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Lead Dialog */}
      <Dialog open={!!messageLead} onOpenChange={() => setMessageLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Message / Log Note</DialogTitle>
          </DialogHeader>
          {messageLead && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!messageText.trim()) return;
                setLeads((leads) =>
                  leads.map((lead) =>
                    lead.id === messageLead.id
                      ? {
                          ...lead,
                          notes:
                            (lead.notes ? lead.notes + "\n" : "") + messageText,
                        }
                      : lead,
                  ),
                );
                setMessageText("");
                setMessageLead(null);
              }}
              className="space-y-4"
            >
              <div>
                <b>Lead:</b> {messageLead.name}
              </div>
              <Textarea
                placeholder="Type your message or note here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <Button type="submit">Send / Log</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMessageLead(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Hotel Enquiries</h3>
        <HotelEnquiriesManager />
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Contact Inquiries</h3>
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Subject</th>
                    <th className="text-left p-2">Message</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contactInquiries.map((inq) => (
                    <tr key={inq.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{inq.name}</td>
                      <td className="p-2">{inq.email}</td>
                      <td className="p-2">{inq.phone}</td>
                      <td className="p-2">{inq.subject}</td>
                      <td className="p-2">{inq.message}</td>
                      <td className="p-2">
                        {inq.created_at ? inq.created_at.split("T")[0] : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Group Flight Inquiries</h3>
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">From City</th>
                    <th className="text-left p-2">To City</th>
                    <th className="text-left p-2">Departure Date</th>
                    <th className="text-left p-2">Return Date</th>
                    <th className="text-left p-2">Passengers</th>
                    <th className="text-left p-2">Trip Type</th>
                    <th className="text-left p-2">Contact Email</th>
                    <th className="text-left p-2">Contact Phone</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {groupFlightInquiries.map((inq) => (
                    <tr key={inq.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{inq.from_city}</td>
                      <td className="p-2">{inq.to_city}</td>
                      <td className="p-2">{inq.departure_date}</td>
                      <td className="p-2">{inq.return_date || "-"}</td>
                      <td className="p-2">{inq.passenger_count}</td>
                      <td className="p-2">{inq.trip_type}</td>
                      <td className="p-2">{inq.contact_email}</td>
                      <td className="p-2">{inq.contact_phone}</td>
                      <td className="p-2">
                        {inq.created_at ? inq.created_at.split("T")[0] : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadManager;
