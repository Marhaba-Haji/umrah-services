import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle, Truck, Calendar, UserCheck, Badge } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Enhanced interfaces with vendor tracking and service delivery
interface VendorStatus {
  vendor_id?: string;
  vendor_name?: string;
  vendor_contact?: string;
  vendor_email?: string;
  mapped_date?: string;
  confirmed_date?: string;
  confirmation_status: "not_mapped" | "mapped" | "confirmed" | "rejected";
  notes?: string;
  priority_level?: "low" | "medium" | "high" | "urgent";
}

interface ServiceDeliveryStatus {
  service_delivered: boolean;
  delivery_date?: string;
  due_date: string;
  delivery_notes?: string;
  delivery_confirmation?: string;
  delivery_proof?: string;
  delivery_status: "pending" | "in_progress" | "delivered" | "overdue";
}

interface Booking {
  id: string;
  booking_reference: string;
  total_amount: number;
  number_of_travelers: number;
  travel_date: string | null;
  status: "pending" | "confirmed" | "cancelled";
  payment_status: "pending" | "completed" | null;
  created_at: string;
  package_id?: string;
  user_id?: string;
  package_name?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  // Enhanced fields for vendor tracking
  vendor_status_json?: Record<string, VendorStatus>;
  service_delivery_json?: Record<string, ServiceDeliveryStatus>;
  operations_notes?: string;
  priority_level?: "low" | "medium" | "high" | "urgent";
}

interface HotelBooking {
  id: string;
  booking_reference: string;
  total_amount: number;
  number_of_guests: number;
  check_in_date: string;
  check_out_date: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  hotel_id?: string;
  user_id?: string;
  hotel_name?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
}

interface VisaApplication {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  passport_number: string;
  gender: string;
  phone: string;
  email: string;
  payment_status: "pending" | "completed" | null;
  status: "pending" | "confirmed" | "cancelled" | "completed" | null;
  created_at: string;
  visa_type?: string;
}

interface FlightBooking {
  id: string;
  booking_reference: string;
  total_amount: number;
  number_of_passengers: number;
  departure_date: string;
  return_date?: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  departure_city: string;
  arrival_city: string;
  flight_type: string;
}

interface TransportBooking {
  id: string;
  booking_reference: string;
  total_amount: number;
  number_of_passengers: number;
  pickup_date: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  route: string;
  vehicle_type: string;
}

interface ActivityBooking {
  id: string;
  booking_reference: string;
  total_amount: number;
  number_of_participants: number;
  activity_date: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  activity_name: string;
  city: string;
}

interface GuideBooking {
  id: string;
  booking_reference: string;
  total_amount: number;
  number_of_people: number;
  service_date: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  guide_name: string;
  service_type: string;
}

interface HajjBooking {
  id: string;
  booking_reference: string;
  total_amount: number;
  number_of_travelers: number;
  departure_date: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  package_name: string;
  package_category: string;
}

// Vendor Management Dialog Component
const VendorManagementDialog = ({ 
  booking, 
  serviceType, 
  isOpen, 
  onClose, 
  onUpdate 
}: {
  booking: any;
  serviceType: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (vendorStatus: VendorStatus) => void;
}) => {
  const [vendorStatus, setVendorStatus] = useState<VendorStatus>({
    confirmation_status: "not_mapped"
  });

  useEffect(() => {
    if (booking?.vendor_status_json?.[serviceType]) {
      setVendorStatus(booking.vendor_status_json[serviceType]);
    }
  }, [booking, serviceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(vendorStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vendor Management - {serviceType}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Vendor Name</label>
              <Input
                value={vendorStatus.vendor_name || ""}
                onChange={(e) => setVendorStatus(prev => ({ ...prev, vendor_name: e.target.value }))}
                placeholder="Enter vendor name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Vendor Contact</label>
              <Input
                value={vendorStatus.vendor_contact || ""}
                onChange={(e) => setVendorStatus(prev => ({ ...prev, vendor_contact: e.target.value }))}
                placeholder="Enter vendor contact"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Vendor Email</label>
            <Input
              value={vendorStatus.vendor_email || ""}
              onChange={(e) => setVendorStatus(prev => ({ ...prev, vendor_email: e.target.value }))}
              placeholder="Enter vendor email"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Mapped Date</label>
              <Input
                type="date"
                value={vendorStatus.mapped_date || ""}
                onChange={(e) => setVendorStatus(prev => ({ ...prev, mapped_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirmation Status</label>
              <Select 
                value={vendorStatus.confirmation_status} 
                onValueChange={(value: any) => setVendorStatus(prev => ({ ...prev, confirmation_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_mapped">Not Mapped</SelectItem>
                  <SelectItem value="mapped">Mapped</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Priority Level</label>
            <Select 
              value={vendorStatus.priority_level || "low"} 
              onValueChange={(value: any) => setVendorStatus(prev => ({ ...prev, priority_level: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={vendorStatus.notes || ""}
              onChange={(e) => setVendorStatus(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter vendor notes"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Vendor Status
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Service Delivery Management Dialog Component
const ServiceDeliveryDialog = ({ 
  booking, 
  serviceType, 
  isOpen, 
  onClose, 
  onUpdate 
}: {
  booking: any;
  serviceType: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (deliveryStatus: ServiceDeliveryStatus) => void;
}) => {
  const [deliveryStatus, setDeliveryStatus] = useState<ServiceDeliveryStatus>({
    service_delivered: false,
    due_date: "",
    delivery_status: "pending"
  });

  useEffect(() => {
    if (booking?.service_delivery_json?.[serviceType]) {
      setDeliveryStatus(booking.service_delivery_json[serviceType]);
    }
  }, [booking, serviceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(deliveryStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Service Delivery Management - {serviceType}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={deliveryStatus.due_date}
                onChange={(e) => setDeliveryStatus(prev => ({ ...prev, due_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Delivery Status</label>
              <Select 
                value={deliveryStatus.delivery_status} 
                onValueChange={(value: any) => setDeliveryStatus(prev => ({ ...prev, delivery_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Service Delivered</label>
            <Select 
              value={deliveryStatus.service_delivered ? "yes" : "no"} 
              onValueChange={(value) => setDeliveryStatus(prev => ({ ...prev, service_delivered: value === "yes" }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {deliveryStatus.service_delivered && (
            <div>
              <label className="text-sm font-medium">Delivery Date</label>
              <Input
                type="date"
                value={deliveryStatus.delivery_date || ""}
                onChange={(e) => setDeliveryStatus(prev => ({ ...prev, delivery_date: e.target.value }))}
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Delivery Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={deliveryStatus.delivery_notes || ""}
              onChange={(e) => setDeliveryStatus(prev => ({ ...prev, delivery_notes: e.target.value }))}
              placeholder="Enter delivery notes"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Delivery Confirmation</label>
            <Input
              value={deliveryStatus.delivery_confirmation || ""}
              onChange={(e) => setDeliveryStatus(prev => ({ ...prev, delivery_confirmation: e.target.value }))}
              placeholder="Enter delivery confirmation details"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Delivery Status
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Status Indicator Component
const StatusIndicator = ({ status, type }: { status: string; type: "vendor" | "delivery" }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle };
      case "pending":
      case "mapped":
      case "in_progress":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock };
      case "not_mapped":
      case "overdue":
      case "rejected":
        return { color: "bg-red-100 text-red-800", icon: AlertCircle };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: Clock };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <BadgeComponent className={`${config.color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {status.replace("_", " ")}
    </BadgeComponent>
  );
};

// Progress Tracking Component
const ProgressTracker = ({ booking, serviceType }: { booking: any; serviceType: string }) => {
  const vendorStatus = booking?.vendor_status_json?.[serviceType]?.confirmation_status || "not_mapped";
  const deliveryStatus = booking?.service_delivery_json?.[serviceType]?.service_delivered || false;
  
  const getProgressValue = () => {
    if (vendorStatus === "not_mapped") return 0;
    if (vendorStatus === "mapped") return 33;
    if (vendorStatus === "confirmed") return 66;
    if (deliveryStatus) return 100;
    return 66;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-600">
        <span>Vendor Mapping</span>
        <span>Vendor Confirmation</span>
        <span>Service Delivery</span>
      </div>
      <Progress value={getProgressValue()} className="h-2" />
      <div className="flex justify-between text-xs">
        <StatusIndicator status={vendorStatus} type="vendor" />
        <StatusIndicator status={deliveryStatus ? "delivered" : "pending"} type="delivery" />
      </div>
    </div>
  );
};

const BookingsManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>([]);
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([]);
  const [transportBookings, setTransportBookings] = useState<TransportBooking[]>([]);
  const [activityBookings, setActivityBookings] = useState<ActivityBooking[]>([]);
  const [guideBookings, setGuideBookings] = useState<GuideBooking[]>([]);
  const [hajjBookings, setHajjBookings] = useState<HajjBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("umrah-packages");
  
  // Vendor and delivery management states
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);

  // Dummy data for Umrah packages with specific categories
  const dummyUmrahBookings: Booking[] = [
    // Group Umrah Packages
    {
      id: "1",
      booking_reference: "GRP-UMR-2024-001",
      total_amount: 125000,
      number_of_travelers: 4,
      travel_date: "2024-03-15",
      status: "confirmed",
      payment_status: "completed",
      created_at: "2024-01-15T10:30:00Z",
      package_name: "Group Umrah Package - 14 Days Premium",
      customer_name: "Ahmed Hassan",
      customer_email: "ahmed.hassan@email.com",
      customer_phone: "+91-9876543210",
      vendor_status_json: {
        flight: {
          vendor_name: "Saudi Airlines",
          vendor_contact: "+966-123456789",
          vendor_email: "bookings@saudiairlines.com",
          mapped_date: "2024-01-16",
          confirmed_date: "2024-01-18",
          confirmation_status: "confirmed",
          notes: "Flight confirmed with seat allocation",
          priority_level: "medium"
        },
        hotel: {
          vendor_name: "Hilton Suites Makkah",
          vendor_contact: "+966-123456790",
          vendor_email: "reservations@hiltonmakkah.com",
          mapped_date: "2024-01-17",
          confirmed_date: "2024-01-19",
          confirmation_status: "confirmed",
          notes: "Hotel rooms confirmed and allocated",
          priority_level: "medium"
        },
        visa: {
          vendor_name: "Saudi Embassy",
          vendor_contact: "+91-1123456789",
          vendor_email: "visa@saudiembassy.in",
          mapped_date: "2024-01-20",
          confirmed_date: "2024-01-25",
          confirmation_status: "confirmed",
          notes: "Visa approved and issued",
          priority_level: "high"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: true,
          delivery_date: "2024-03-15",
          due_date: "2024-03-15",
          delivery_notes: "Flight departed on time",
          delivery_confirmation: "Boarding passes issued",
          delivery_status: "delivered"
        },
        hotel: {
          service_delivered: true,
          delivery_date: "2024-03-15",
          due_date: "2024-03-15",
          delivery_notes: "Hotel check-in completed",
          delivery_confirmation: "Room keys provided",
          delivery_status: "delivered"
        },
        visa: {
          service_delivered: true,
          delivery_date: "2024-01-25",
          due_date: "2024-02-01",
          delivery_notes: "Visa delivered to customer",
          delivery_confirmation: "Passport with visa collected",
          delivery_status: "delivered"
        }
      },
      operations_notes: "All services confirmed and delivered successfully. Customer satisfied with arrangements.",
      priority_level: "medium"
    },
    {
      id: "2",
      booking_reference: "GRP-UMR-2024-002",
      total_amount: 85000,
      number_of_travelers: 6,
      travel_date: "2024-04-20",
      status: "pending",
      payment_status: "pending",
      created_at: "2024-02-10T14:20:00Z",
      package_name: "Group Umrah Package - 10 Days Economy",
      customer_name: "Fatima Ali",
      customer_email: "fatima.ali@email.com",
      customer_phone: "+91-9876543211",
      vendor_status_json: {
        flight: {
          vendor_name: "Emirates Airlines",
          vendor_contact: "+971-123456789",
          vendor_email: "bookings@emirates.com",
          mapped_date: "2024-02-12",
          confirmed_date: "",
          confirmation_status: "mapped",
          notes: "Awaiting flight confirmation",
          priority_level: "high"
        },
        hotel: {
          vendor_name: "",
          vendor_contact: "",
          vendor_email: "",
          mapped_date: "",
          confirmed_date: "",
          confirmation_status: "not_mapped",
          notes: "Hotel vendor not yet mapped",
          priority_level: "urgent"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: false,
          delivery_date: "",
          due_date: "2024-04-20",
          delivery_notes: "",
          delivery_confirmation: "",
          delivery_status: "pending"
        },
        hotel: {
          service_delivered: false,
          delivery_date: "",
          due_date: "2024-04-20",
          delivery_notes: "",
          delivery_confirmation: "",
          delivery_status: "pending"
        }
      },
      operations_notes: "Flight vendor mapped but not confirmed. Hotel vendor needs to be mapped urgently.",
      priority_level: "high"
    },
    {
      id: "3",
      booking_reference: "GRP-UMR-2024-003",
      total_amount: 195000,
      number_of_travelers: 8,
      travel_date: "2024-05-10",
      status: "confirmed",
      payment_status: "completed",
      created_at: "2024-02-25T09:15:00Z",
      package_name: "Group Umrah Package - 21 Days Luxury",
      customer_name: "Mohammad Khan",
      customer_email: "mohammad.khan@email.com",
      customer_phone: "+91-9876543212",
      vendor_status_json: {
        flight: {
          vendor_name: "Etihad Airways",
          vendor_contact: "+971-123456790",
          vendor_email: "bookings@etihad.com",
          mapped_date: "2024-02-20",
          confirmed_date: "2024-02-22",
          confirmation_status: "confirmed",
          notes: "Flight confirmed with seat allocation",
          priority_level: "medium"
        },
        hotel: {
          vendor_name: "Madinah Crown Hotel",
          vendor_contact: "+966-123456791",
          vendor_email: "reservations@madinacrown.com",
          mapped_date: "2024-02-21",
          confirmed_date: "2024-02-23",
          confirmation_status: "confirmed",
          notes: "Hotel rooms confirmed and allocated",
          priority_level: "medium"
        },
        visa: {
          vendor_name: "Saudi Embassy",
          vendor_contact: "+91-1123456790",
          vendor_email: "visa@saudiembassy.in",
          mapped_date: "2024-02-25",
          confirmed_date: "2024-02-28",
          confirmation_status: "confirmed",
          notes: "Visa approved and issued",
          priority_level: "high"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: true,
          delivery_date: "2024-05-10",
          due_date: "2024-05-10",
          delivery_notes: "Flight departed on time",
          delivery_confirmation: "Boarding passes issued",
          delivery_status: "delivered"
        },
        hotel: {
          service_delivered: true,
          delivery_date: "2024-05-10",
          due_date: "2024-05-10",
          delivery_notes: "Hotel check-in completed",
          delivery_confirmation: "Room keys provided",
          delivery_status: "delivered"
        },
        visa: {
          service_delivered: true,
          delivery_date: "2024-02-28",
          due_date: "2024-03-05",
          delivery_notes: "Visa delivered to customer",
          delivery_confirmation: "Passport with visa collected",
          delivery_status: "delivered"
        }
      },
      operations_notes: "All services confirmed and delivered successfully. Customer satisfied with arrangements.",
      priority_level: "medium"
    },
    // Independent Umrah Packages
    {
      id: "4",
      booking_reference: "IND-UMR-2024-001",
      total_amount: 75000,
      number_of_travelers: 2,
      travel_date: "2024-03-25",
      status: "confirmed",
      payment_status: "completed",
      created_at: "2024-01-20T11:45:00Z",
      package_name: "Independent Umrah Package - 7 Days Standard",
      customer_name: "Sarah Abdullah",
      customer_email: "sarah.abdullah@email.com",
      customer_phone: "+91-9876543213",
      vendor_status_json: {
        flight: {
          vendor_name: "Saudi Airlines",
          vendor_contact: "+966-123456792",
          vendor_email: "bookings@saudiairlines.com",
          mapped_date: "2024-01-26",
          confirmed_date: "2024-01-28",
          confirmation_status: "confirmed",
          notes: "Flight confirmed with seat allocation",
          priority_level: "medium"
        },
        hotel: {
          vendor_name: "Hilton Suites Makkah",
          vendor_contact: "+966-123456793",
          vendor_email: "reservations@hiltonmakkah.com",
          mapped_date: "2024-01-27",
          confirmed_date: "2024-01-29",
          confirmation_status: "confirmed",
          notes: "Hotel rooms confirmed and allocated",
          priority_level: "medium"
        },
        visa: {
          vendor_name: "Saudi Embassy",
          vendor_contact: "+91-1123456791",
          vendor_email: "visa@saudiembassy.in",
          mapped_date: "2024-01-29",
          confirmed_date: "2024-02-02",
          confirmation_status: "confirmed",
          notes: "Visa approved and issued",
          priority_level: "high"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: true,
          delivery_date: "2024-03-25",
          due_date: "2024-03-25",
          delivery_notes: "Flight departed on time",
          delivery_confirmation: "Boarding passes issued",
          delivery_status: "delivered"
        },
        hotel: {
          service_delivered: true,
          delivery_date: "2024-03-25",
          due_date: "2024-03-25",
          delivery_notes: "Hotel check-in completed",
          delivery_confirmation: "Room keys provided",
          delivery_status: "delivered"
        },
        visa: {
          service_delivered: true,
          delivery_date: "2024-02-02",
          due_date: "2024-02-05",
          delivery_notes: "Visa delivered to customer",
          delivery_confirmation: "Passport with visa collected",
          delivery_status: "delivered"
        }
      },
      operations_notes: "All services confirmed and delivered successfully. Customer satisfied with arrangements.",
      priority_level: "medium"
    },
    {
      id: "5",
      booking_reference: "IND-UMR-2024-002",
      total_amount: 95000,
      number_of_travelers: 3,
      travel_date: "2024-04-15",
      status: "pending",
      payment_status: "pending",
      created_at: "2024-02-12T16:30:00Z",
      package_name: "Independent Umrah Package - 12 Days Deluxe",
      customer_name: "Omar Malik",
      customer_email: "omar.malik@email.com",
      customer_phone: "+91-9876543214",
      vendor_status_json: {
        flight: {
          vendor_name: "Emirates Airlines",
          vendor_contact: "+971-123456794",
          vendor_email: "bookings@emirates.com",
          mapped_date: "2024-02-13",
          confirmed_date: "",
          confirmation_status: "mapped",
          notes: "Awaiting flight confirmation",
          priority_level: "high"
        },
        hotel: {
          vendor_name: "",
          vendor_contact: "",
          vendor_email: "",
          mapped_date: "",
          confirmed_date: "",
          confirmation_status: "not_mapped",
          notes: "Hotel vendor not yet mapped",
          priority_level: "urgent"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: false,
          delivery_date: "",
          due_date: "2024-04-15",
          delivery_notes: "",
          delivery_confirmation: "",
          delivery_status: "pending"
        },
        hotel: {
          service_delivered: false,
          delivery_date: "",
          due_date: "2024-04-15",
          delivery_notes: "",
          delivery_confirmation: "",
          delivery_status: "pending"
        }
      },
      operations_notes: "Flight vendor mapped but not confirmed. Hotel vendor needs to be mapped urgently.",
      priority_level: "high"
    },
    {
      id: "6",
      booking_reference: "IND-UMR-2024-003",
      total_amount: 55000,
      number_of_travelers: 1,
      travel_date: "2024-05-05",
      status: "confirmed",
      payment_status: "completed",
      created_at: "2024-02-28T13:45:00Z",
      package_name: "Independent Umrah Package - 5 Days Budget",
      customer_name: "Amina Rahman",
      customer_email: "amina.rahman@email.com",
      customer_phone: "+91-9876543215",
      vendor_status_json: {
        flight: {
          vendor_name: "Saudi Airlines",
          vendor_contact: "+966-123456795",
          vendor_email: "bookings@saudiairlines.com",
          mapped_date: "2024-02-28",
          confirmed_date: "2024-03-02",
          confirmation_status: "confirmed",
          notes: "Flight confirmed with seat allocation",
          priority_level: "medium"
        },
        hotel: {
          vendor_name: "Madinah Crown Hotel",
          vendor_contact: "+966-123456796",
          vendor_email: "reservations@madinacrown.com",
          mapped_date: "2024-02-29",
          confirmed_date: "2024-03-01",
          confirmation_status: "confirmed",
          notes: "Hotel rooms confirmed and allocated",
          priority_level: "medium"
        },
        visa: {
          vendor_name: "Saudi Embassy",
          vendor_contact: "+91-1123456792",
          vendor_email: "visa@saudiembassy.in",
          mapped_date: "2024-03-01",
          confirmed_date: "2024-03-05",
          confirmation_status: "confirmed",
          notes: "Visa approved and issued",
          priority_level: "high"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: true,
          delivery_date: "2024-05-05",
          due_date: "2024-05-05",
          delivery_notes: "Flight departed on time",
          delivery_confirmation: "Boarding passes issued",
          delivery_status: "delivered"
        },
        hotel: {
          service_delivered: true,
          delivery_date: "2024-05-05",
          due_date: "2024-05-05",
          delivery_notes: "Hotel check-in completed",
          delivery_confirmation: "Room keys provided",
          delivery_status: "delivered"
        },
        visa: {
          service_delivered: true,
          delivery_date: "2024-03-05",
          due_date: "2024-03-10",
          delivery_notes: "Visa delivered to customer",
          delivery_confirmation: "Passport with visa collected",
          delivery_status: "delivered"
        }
      },
      operations_notes: "All services confirmed and delivered successfully. Customer satisfied with arrangements.",
      priority_level: "medium"
    },
    // Custom Umrah Packages
    {
      id: "7",
      booking_reference: "CUS-UMR-2024-001",
      total_amount: 155000,
      number_of_travelers: 2,
      travel_date: "2024-03-30",
      status: "confirmed",
      payment_status: "completed",
      created_at: "2024-01-25T14:20:00Z",
      package_name: "Custom Umrah Package - 15 Days Premium Tailored",
      customer_name: "Khalid Sheikh",
      customer_email: "khalid.sheikh@email.com",
      customer_phone: "+91-9876543216",
      vendor_status_json: {
        flight: {
          vendor_name: "Etihad Airways",
          vendor_contact: "+971-123456797",
          vendor_email: "bookings@etihad.com",
          mapped_date: "2024-01-26",
          confirmed_date: "2024-01-28",
          confirmation_status: "confirmed",
          notes: "Flight confirmed with seat allocation",
          priority_level: "medium"
        },
        hotel: {
          vendor_name: "Hilton Suites Makkah",
          vendor_contact: "+966-123456798",
          vendor_email: "reservations@hiltonmakkah.com",
          mapped_date: "2024-01-27",
          confirmed_date: "2024-01-29",
          confirmation_status: "confirmed",
          notes: "Hotel rooms confirmed and allocated",
          priority_level: "medium"
        },
        visa: {
          vendor_name: "Saudi Embassy",
          vendor_contact: "+91-1123456793",
          vendor_email: "visa@saudiembassy.in",
          mapped_date: "2024-01-29",
          confirmed_date: "2024-02-02",
          confirmation_status: "confirmed",
          notes: "Visa approved and issued",
          priority_level: "high"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: true,
          delivery_date: "2024-03-30",
          due_date: "2024-03-30",
          delivery_notes: "Flight departed on time",
          delivery_confirmation: "Boarding passes issued",
          delivery_status: "delivered"
        },
        hotel: {
          service_delivered: true,
          delivery_date: "2024-03-30",
          due_date: "2024-03-30",
          delivery_notes: "Hotel check-in completed",
          delivery_confirmation: "Room keys provided",
          delivery_status: "delivered"
        },
        visa: {
          service_delivered: true,
          delivery_date: "2024-02-02",
          due_date: "2024-02-05",
          delivery_notes: "Visa delivered to customer",
          delivery_confirmation: "Passport with visa collected",
          delivery_status: "delivered"
        }
      },
      operations_notes: "All services confirmed and delivered successfully. Customer satisfied with arrangements.",
      priority_level: "medium"
    },
    {
      id: "8",
      booking_reference: "CUS-UMR-2024-002",
      total_amount: 225000,
      number_of_travelers: 4,
      travel_date: "2024-04-25",
      status: "pending",
      payment_status: "pending",
      created_at: "2024-02-15T10:15:00Z",
      package_name: "Custom Umrah Package - 20 Days Luxury Bespoke",
      customer_name: "Zainab Qureshi",
      customer_email: "zainab.qureshi@email.com",
      customer_phone: "+91-9876543217",
      vendor_status_json: {
        flight: {
          vendor_name: "Emirates Airlines",
          vendor_contact: "+971-123456799",
          vendor_email: "bookings@emirates.com",
          mapped_date: "2024-02-13",
          confirmed_date: "",
          confirmation_status: "mapped",
          notes: "Awaiting flight confirmation",
          priority_level: "high"
        },
        hotel: {
          vendor_name: "",
          vendor_contact: "",
          vendor_email: "",
          mapped_date: "",
          confirmed_date: "",
          confirmation_status: "not_mapped",
          notes: "Hotel vendor not yet mapped",
          priority_level: "urgent"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: false,
          delivery_date: "",
          due_date: "2024-04-25",
          delivery_notes: "",
          delivery_confirmation: "",
          delivery_status: "pending"
        },
        hotel: {
          service_delivered: false,
          delivery_date: "",
          due_date: "2024-04-25",
          delivery_notes: "",
          delivery_confirmation: "",
          delivery_status: "pending"
        }
      },
      operations_notes: "Flight vendor mapped but not confirmed. Hotel vendor needs to be mapped urgently.",
      priority_level: "high"
    },
    {
      id: "9",
      booking_reference: "CUS-UMR-2024-003",
      total_amount: 105000,
      number_of_travelers: 3,
      travel_date: "2024-05-15",
      status: "confirmed",
      payment_status: "completed",
      created_at: "2024-03-01T12:30:00Z",
      package_name: "Custom Umrah Package - 10 Days Premium Personalized",
      customer_name: "Ibrahim Yusuf",
      customer_email: "ibrahim.yusuf@email.com",
      customer_phone: "+91-9876543218",
      vendor_status_json: {
        flight: {
          vendor_name: "Saudi Airlines",
          vendor_contact: "+966-123456800",
          vendor_email: "bookings@saudiairlines.com",
          mapped_date: "2024-03-01",
          confirmed_date: "2024-03-03",
          confirmation_status: "confirmed",
          notes: "Flight confirmed with seat allocation",
          priority_level: "medium"
        },
        hotel: {
          vendor_name: "Madinah Crown Hotel",
          vendor_contact: "+966-123456801",
          vendor_email: "reservations@madinacrown.com",
          mapped_date: "2024-03-02",
          confirmed_date: "2024-03-04",
          confirmation_status: "confirmed",
          notes: "Hotel rooms confirmed and allocated",
          priority_level: "medium"
        },
        visa: {
          vendor_name: "Saudi Embassy",
          vendor_contact: "+91-1123456794",
          vendor_email: "visa@saudiembassy.in",
          mapped_date: "2024-03-04",
          confirmed_date: "2024-03-08",
          confirmation_status: "confirmed",
          notes: "Visa approved and issued",
          priority_level: "high"
        }
      },
      service_delivery_json: {
        flight: {
          service_delivered: true,
          delivery_date: "2024-05-15",
          due_date: "2024-05-15",
          delivery_notes: "Flight departed on time",
          delivery_confirmation: "Boarding passes issued",
          delivery_status: "delivered"
        },
        hotel: {
          service_delivered: true,
          delivery_date: "2024-05-15",
          due_date: "2024-05-15",
          delivery_notes: "Hotel check-in completed",
          delivery_confirmation: "Room keys provided",
          delivery_status: "delivered"
        },
        visa: {
          service_delivered: true,
          delivery_date: "2024-03-08",
          due_date: "2024-03-12",
          delivery_notes: "Visa delivered to customer",
          delivery_confirmation: "Passport with visa collected",
          delivery_status: "delivered"
        }
      },
      operations_notes: "All services confirmed and delivered successfully. Customer satisfied with arrangements.",
      priority_level: "medium"
    }
  ];

  const dummyHotelBookings: HotelBooking[] = [
    {
      id: "1",
      booking_reference: "HTL-2024-001",
      total_amount: 45000,
      number_of_guests: 2,
      check_in_date: "2024-03-10",
      check_out_date: "2024-03-17",
      status: "confirmed",
      created_at: "2024-01-20T11:00:00Z",
      hotel_name: "Hilton Suites Makkah",
      customer_name: "Sarah Ahmed",
      customer_email: "sarah.ahmed@email.com",
      customer_phone: "+91-9876543213"
    },
    {
      id: "2",
      booking_reference: "HTL-2024-002",
      total_amount: 28000,
      number_of_guests: 3,
      check_in_date: "2024-04-15",
      check_out_date: "2024-04-22",
      status: "pending",
      created_at: "2024-02-05T16:30:00Z",
      hotel_name: "Madinah Crown Hotel",
      customer_name: "Omar Abdullah",
      customer_email: "omar.abdullah@email.com",
      customer_phone: "+91-9876543214"
    },
    {
      id: "3",
      booking_reference: "HTL-2024-003",
      total_amount: 65000,
      number_of_guests: 4,
      check_in_date: "2024-05-05",
      check_out_date: "2024-05-12",
      status: "confirmed",
      created_at: "2024-02-28T13:45:00Z",
      hotel_name: "Swissôtel Makkah",
      customer_name: "Amina Rahman",
      customer_email: "amina.rahman@email.com",
      customer_phone: "+91-9876543215"
    }
  ];

  const dummyVisaApplications: VisaApplication[] = [
    {
      id: "1",
      first_name: "Hassan",
      last_name: "Sheikh",
      nationality: "Indian",
      passport_number: "A1234567",
      gender: "Male",
      phone: "+91-9876543216",
      email: "hassan.sheikh@email.com",
      payment_status: "completed",
      status: "confirmed",
      created_at: "2024-01-10T08:00:00Z",
      visa_type: "Umrah Visa"
    },
    {
      id: "2",
      first_name: "Zainab",
      last_name: "Malik",
      nationality: "Pakistani",
      passport_number: "B7654321",
      gender: "Female",
      phone: "+92-3001234567",
      email: "zainab.malik@email.com",
      payment_status: "pending",
      status: "pending",
      created_at: "2024-02-15T12:30:00Z",
      visa_type: "Tourist Visa"
    },
    {
      id: "3",
      first_name: "Ibrahim",
      last_name: "Yusuf",
      nationality: "Bangladeshi",
      passport_number: "C9876543",
      gender: "Male",
      phone: "+880-1712345678",
      email: "ibrahim.yusuf@email.com",
      payment_status: "completed",
      status: "completed",
      created_at: "2024-02-20T15:20:00Z",
      visa_type: "Business Visa"
    }
  ];

  const dummyFlightBookings: FlightBooking[] = [
    {
      id: "1",
      booking_reference: "FLT-2024-001",
      total_amount: 75000,
      number_of_passengers: 2,
      departure_date: "2024-03-20",
      return_date: "2024-04-05",
      status: "confirmed",
      created_at: "2024-01-25T10:00:00Z",
      customer_name: "Khalid Rahman",
      customer_email: "khalid.rahman@email.com",
      customer_phone: "+91-9876543217",
      departure_city: "Delhi",
      arrival_city: "Jeddah",
      flight_type: "Round Trip"
    },
    {
      id: "2",
      booking_reference: "FLT-2024-002",
      total_amount: 45000,
      number_of_passengers: 1,
      departure_date: "2024-04-10",
      status: "pending",
      created_at: "2024-02-12T14:15:00Z",
      customer_name: "Nadia Sultana",
      customer_email: "nadia.sultana@email.com",
      customer_phone: "+91-9876543218",
      departure_city: "Mumbai",
      arrival_city: "Riyadh",
      flight_type: "One Way"
    },
    {
      id: "3",
      booking_reference: "FLT-2024-003",
      total_amount: 95000,
      number_of_passengers: 3,
      departure_date: "2024-05-15",
      return_date: "2024-05-30",
      status: "confirmed",
      created_at: "2024-03-01T09:30:00Z",
      customer_name: "Tariq Ahmed",
      customer_email: "tariq.ahmed@email.com",
      customer_phone: "+91-9876543219",
      departure_city: "Kolkata",
      arrival_city: "Medina",
      flight_type: "Round Trip"
    }
  ];

  const dummyTransportBookings: TransportBooking[] = [
    {
      id: "1",
      booking_reference: "TRN-2024-001",
      total_amount: 15000,
      number_of_passengers: 4,
      pickup_date: "2024-03-15",
      status: "confirmed",
      created_at: "2024-01-30T11:00:00Z",
      customer_name: "Rashid Khan",
      customer_email: "rashid.khan@email.com",
      customer_phone: "+91-9876543220",
      route: "Jeddah Airport to Makkah",
      vehicle_type: "SUV"
    },
    {
      id: "2",
      booking_reference: "TRN-2024-002",
      total_amount: 25000,
      number_of_passengers: 8,
      pickup_date: "2024-04-20",
      status: "pending",
      created_at: "2024-02-18T13:20:00Z",
      customer_name: "Layla Hassan",
      customer_email: "layla.hassan@email.com",
      customer_phone: "+91-9876543221",
      route: "Makkah to Medina",
      vehicle_type: "Bus"
    },
    {
      id: "3",
      booking_reference: "TRN-2024-003",
      total_amount: 8000,
      number_of_passengers: 2,
      pickup_date: "2024-05-10",
      status: "confirmed",
      created_at: "2024-02-22T16:45:00Z",
      customer_name: "Yusuf Ali",
      customer_email: "yusuf.ali@email.com",
      customer_phone: "+91-9876543222",
      route: "Medina Airport to Hotel",
      vehicle_type: "Sedan"
    }
  ];

  const dummyActivityBookings: ActivityBooking[] = [
    {
      id: "1",
      booking_reference: "ACT-2024-001",
      total_amount: 12000,
      number_of_participants: 3,
      activity_date: "2024-03-18",
      status: "confirmed",
      created_at: "2024-02-01T10:30:00Z",
      customer_name: "Mariam Abdullah",
      customer_email: "mariam.abdullah@email.com",
      customer_phone: "+91-9876543223",
      activity_name: "Ziyarat Tour - Makkah",
      city: "Makkah"
    },
    {
      id: "2",
      booking_reference: "ACT-2024-002",
      total_amount: 18000,
      number_of_participants: 5,
      activity_date: "2024-04-25",
      status: "pending",
      created_at: "2024-02-14T12:15:00Z",
      customer_name: "Salman Qureshi",
      customer_email: "salman.qureshi@email.com",
      customer_phone: "+91-9876543224",
      activity_name: "Historical Sites Tour",
      city: "Medina"
    },
    {
      id: "3",
      booking_reference: "ACT-2024-003",
      total_amount: 25000,
      number_of_participants: 2,
      activity_date: "2024-05-12",
      status: "confirmed",
      created_at: "2024-02-26T14:00:00Z",
      customer_name: "Aisha Rahman",
      customer_email: "aisha.rahman@email.com",
      customer_phone: "+91-9876543225",
      activity_name: "Desert Safari Experience",
      city: "Riyadh"
    }
  ];

  const dummyGuideBookings: GuideBooking[] = [
    {
      id: "1",
      booking_reference: "GUD-2024-001",
      total_amount: 8000,
      number_of_people: 2,
      service_date: "2024-03-16",
      status: "confirmed",
      created_at: "2024-01-28T09:45:00Z",
      customer_name: "Bilal Ahmed",
      customer_email: "bilal.ahmed@email.com",
      customer_phone: "+91-9876543226",
      guide_name: "Abdul Rahman",
      service_type: "Umrah Guide"
    },
    {
      id: "2",
      booking_reference: "GUD-2024-002",
      total_amount: 12000,
      number_of_people: 4,
      service_date: "2024-04-22",
      status: "pending",
      created_at: "2024-02-16T11:30:00Z",
      customer_name: "Khadija Malik",
      customer_email: "khadija.malik@email.com",
      customer_phone: "+91-9876543227",
      guide_name: "Muhammad Saleem",
      service_type: "City Tour Guide"
    },
    {
      id: "3",
      booking_reference: "GUD-2024-003",
      total_amount: 15000,
      number_of_people: 6,
      service_date: "2024-05-08",
      status: "confirmed",
      created_at: "2024-02-24T13:20:00Z",
      customer_name: "Hafiz Ibrahim",
      customer_email: "hafiz.ibrahim@email.com",
      customer_phone: "+91-9876543228",
      guide_name: "Sheikh Abdullah",
      service_type: "Religious Guide"
    }
  ];

  const dummyHajjBookings: HajjBooking[] = [
    {
      id: "1",
      booking_reference: "HAJ-2024-001",
      total_amount: 450000,
      number_of_travelers: 2,
      departure_date: "2024-06-15",
      status: "confirmed",
      created_at: "2024-01-05T08:00:00Z",
      customer_name: "Abdullah Rahman",
      customer_email: "abdullah.rahman@email.com",
      customer_phone: "+91-9876543229",
      package_name: "Premium Hajj Package",
      package_category: "Premium"
    },
    {
      id: "2",
      booking_reference: "HAJ-2024-002",
      total_amount: 320000,
      number_of_travelers: 1,
      departure_date: "2024-06-20",
      status: "pending",
      created_at: "2024-01-12T10:15:00Z",
      customer_name: "Fatima Begum",
      customer_email: "fatima.begum@email.com",
      customer_phone: "+91-9876543230",
      package_name: "Standard Hajj Package",
      package_category: "Standard"
    },
    {
      id: "3",
      booking_reference: "HAJ-2024-003",
      total_amount: 650000,
      number_of_travelers: 3,
      departure_date: "2024-06-10",
      status: "confirmed",
      created_at: "2024-01-18T14:30:00Z",
      customer_name: "Imam Hassan",
      customer_email: "imam.hassan@email.com",
      customer_phone: "+91-9876543231",
      package_name: "Luxury Hajj Package",
      package_category: "Luxury"
    }
  ];

  useEffect(() => {
    // Load dummy data based on active tab
    if (activeTab === "umrah-packages") {
      setBookings(dummyUmrahBookings);
    } else if (activeTab === "hajj-packages") {
      setHajjBookings(dummyHajjBookings);
    } else if (activeTab === "flights") {
      setFlightBookings(dummyFlightBookings);
    } else if (activeTab === "hotels") {
      setHotelBookings(dummyHotelBookings);
    } else if (activeTab === "visa") {
      setVisaApplications(dummyVisaApplications);
    } else if (activeTab === "transport") {
      setTransportBookings(dummyTransportBookings);
    } else if (activeTab === "activities") {
      setActivityBookings(dummyActivityBookings);
    } else if (activeTab === "guide") {
      setGuideBookings(dummyGuideBookings);
    }
  }, [activeTab]);

  const filteredBookings = bookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTermLower) ||
                         booking.customer_name?.toLowerCase().includes(searchTermLower) ||
                         booking.customer_email?.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredHotelBookings = hotelBookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTermLower) ||
                         booking.customer_name?.toLowerCase().includes(searchTermLower) ||
                         booking.customer_email?.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredVisaApplications = visaApplications.filter((visa) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = visa.first_name.toLowerCase().includes(searchTermLower) ||
                         visa.last_name.toLowerCase().includes(searchTermLower) ||
                         visa.email.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || visa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFlightBookings = flightBookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTermLower) ||
                         booking.customer_name.toLowerCase().includes(searchTermLower) ||
                         booking.customer_email.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTransportBookings = transportBookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTermLower) ||
                         booking.customer_name.toLowerCase().includes(searchTermLower) ||
                         booking.customer_email.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredActivityBookings = activityBookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTermLower) ||
                         booking.customer_name.toLowerCase().includes(searchTermLower) ||
                         booking.customer_email.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredGuideBookings = guideBookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTermLower) ||
                         booking.customer_name.toLowerCase().includes(searchTermLower) ||
                         booking.customer_email.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredHajjBookings = hajjBookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTermLower) ||
                         booking.customer_name.toLowerCase().includes(searchTermLower) ||
                         booking.customer_email.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getUmrahPackagesByType = (type: string) => {
    return filteredBookings.filter((booking) => {
      if (type === "group") {
        return booking.booking_reference.includes("GRP-UMR");
      } else if (type === "independent") {
        return booking.booking_reference.includes("IND-UMR");
      } else if (type === "custom") {
        return booking.booking_reference.includes("CUS-UMR");
      }
      return false;
    });
  };

  // Vendor management functions
  const handleVendorUpdate = async (vendorStatus: VendorStatus) => {
    if (!selectedBooking || !selectedServiceType) return;

    try {
      const updatedVendorStatus = {
        ...selectedBooking.vendor_status_json,
        [selectedServiceType]: {
          ...vendorStatus,
          mapped_date: vendorStatus.mapped_date || new Date().toISOString().split('T')[0],
          confirmed_date: vendorStatus.confirmation_status === "confirmed" 
            ? (vendorStatus.confirmed_date || new Date().toISOString().split('T')[0])
            : ""
        }
      };

      // Update the booking in state
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, vendor_status_json: updatedVendorStatus }
          : booking
      );
      setBookings(updatedBookings);

      toast({
        title: "Vendor Status Updated",
        description: `Vendor status for ${selectedServiceType} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vendor status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeliveryUpdate = async (deliveryStatus: ServiceDeliveryStatus) => {
    if (!selectedBooking || !selectedServiceType) return;

    try {
      const updatedDeliveryStatus = {
        ...selectedBooking.service_delivery_json,
        [selectedServiceType]: {
          ...deliveryStatus,
          delivery_date: deliveryStatus.service_delivered 
            ? (deliveryStatus.delivery_date || new Date().toISOString().split('T')[0])
            : ""
        }
      };

      // Update the booking in state
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, service_delivery_json: updatedDeliveryStatus }
          : booking
      );
      setBookings(updatedBookings);

      toast({
        title: "Delivery Status Updated",
        description: `Service delivery status for ${selectedServiceType} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update delivery status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Enhanced table rendering with vendor tracking
  const renderEnhancedBookingTable = (bookingData: Booking[], title: string) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Travelers</TableHead>
            <TableHead>Travel Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Vendor Status</TableHead>
            <TableHead>Service Delivery</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingData.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.booking_reference}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{booking.package_name}</TableCell>
              <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
              <TableCell>{booking.number_of_travelers}</TableCell>
              <TableCell>
                {booking.travel_date
                  ? new Date(booking.travel_date).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.payment_status === "completed"
                      ? "bg-green-100 text-green-800"
                      : booking.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.payment_status || "pending"}
                </span>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {booking.vendor_status_json && Object.entries(booking.vendor_status_json).map(([service, status]) => (
                    <div key={service} className="flex items-center gap-1">
                      <span className="text-xs font-medium">{service}:</span>
                      <StatusIndicator status={status.confirmation_status} type="vendor" />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {booking.service_delivery_json && Object.entries(booking.service_delivery_json).map(([service, delivery]) => (
                    <div key={service} className="flex items-center gap-1">
                      <span className="text-xs font-medium">{service}:</span>
                      <StatusIndicator 
                        status={delivery.delivery_status} 
                        type="delivery" 
                      />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <BadgeComponent 
                  className={`${
                    booking.priority_level === "urgent" ? "bg-red-100 text-red-800" :
                    booking.priority_level === "high" ? "bg-orange-100 text-orange-800" :
                    booking.priority_level === "medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}
                >
                  {booking.priority_level || "low"}
                </BadgeComponent>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setSelectedServiceType("flight");
                      setVendorDialogOpen(true);
                    }}
                    title="Manage Vendor"
                  >
                    <UserCheck className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setSelectedServiceType("flight");
                      setDeliveryDialogOpen(true);
                    }}
                    title="Manage Delivery"
                  >
                    <Truck className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="View Details">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Edit">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {bookingData.length === 0 && (
        <div className="p-4 text-gray-500">
          No {title.toLowerCase()} bookings found.
        </div>
      )}
    </div>
  );

  const renderBookingTable = (bookingData: Booking[], title: string) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Travelers</TableHead>
            <TableHead>Travel Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingData.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.booking_reference}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{booking.package_name}</TableCell>
              <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
              <TableCell>{booking.number_of_travelers}</TableCell>
              <TableCell>
                {booking.travel_date
                  ? new Date(booking.travel_date).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.payment_status === "completed"
                      ? "bg-green-100 text-green-800"
                      : booking.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.payment_status || "pending"}
                </span>
              </TableCell>
              <TableCell>
                {new Date(booking.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {bookingData.length === 0 && (
        <div className="p-4 text-gray-500">
          No {title.toLowerCase()} bookings found.
        </div>
      )}
    </div>
  );

  const renderHotelTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Hotel</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHotelBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.booking_reference}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{booking.hotel_name}</TableCell>
              <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
              <TableCell>{booking.number_of_guests}</TableCell>
              <TableCell>
                {new Date(booking.check_in_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(booking.check_out_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(booking.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredHotelBookings.length === 0 && (
        <div className="p-4 text-gray-500">
          No hotel bookings found.
        </div>
      )}
    </div>
  );

  const renderVisaTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Passport</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Visa Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVisaApplications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>
                {app.first_name} {app.last_name}
              </TableCell>
              <TableCell>{app.nationality}</TableCell>
              <TableCell>{app.passport_number}</TableCell>
              <TableCell>{app.gender}</TableCell>
              <TableCell>{app.phone}</TableCell>
              <TableCell>{app.email}</TableCell>
              <TableCell>{app.visa_type}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    app.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : app.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.status}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    app.payment_status === "completed"
                      ? "bg-green-100 text-green-800"
                      : app.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.payment_status || "pending"}
                </span>
              </TableCell>
              <TableCell>
                {new Date(app.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredVisaApplications.length === 0 && (
        <div className="p-4 text-gray-500">
          No visa applications found.
        </div>
      )}
    </div>
  );

  const renderFlightTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Passengers</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Return</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFlightBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.booking_reference}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{booking.departure_city} → {booking.arrival_city}</TableCell>
              <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
              <TableCell>{booking.number_of_passengers}</TableCell>
              <TableCell>
                {new Date(booking.departure_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {booking.return_date 
                  ? new Date(booking.return_date).toLocaleDateString() 
                  : "One Way"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(booking.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredFlightBookings.length === 0 && (
        <div className="p-4 text-gray-500">
          No flight bookings found.
        </div>
      )}
    </div>
  );

  const renderTransportTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Passengers</TableHead>
            <TableHead>Pickup Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransportBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.booking_reference}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{booking.route}</TableCell>
              <TableCell>{booking.vehicle_type}</TableCell>
              <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
              <TableCell>{booking.number_of_passengers}</TableCell>
              <TableCell>
                {new Date(booking.pickup_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(booking.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredTransportBookings.length === 0 && (
        <div className="p-4 text-gray-500">
          No transport bookings found.
        </div>
      )}
    </div>
  );

  const renderActivityTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredActivityBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.booking_reference}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{booking.activity_name}</TableCell>
              <TableCell>{booking.city}</TableCell>
              <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
              <TableCell>{booking.number_of_participants}</TableCell>
              <TableCell>
                {new Date(booking.activity_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(booking.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredActivityBookings.length === 0 && (
        <div className="p-4 text-gray-500">
          No activity bookings found.
        </div>
      )}
    </div>
  );

  const renderGuideTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Guide</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>People</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuideBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.booking_reference}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{booking.guide_name}</TableCell>
              <TableCell>{booking.service_type}</TableCell>
              <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
              <TableCell>{booking.number_of_people}</TableCell>
              <TableCell>
                {new Date(booking.service_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(booking.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredGuideBookings.length === 0 && (
        <div className="p-4 text-gray-500">
          No guide bookings found.
        </div>
      )}
    </div>
  );

  const renderHajjTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Travelers</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHajjBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.booking_reference}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{booking.package_name}</TableCell>
              <TableCell>{booking.package_category}</TableCell>
              <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
              <TableCell>{booking.number_of_travelers}</TableCell>
              <TableCell>
                {new Date(booking.departure_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(booking.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredHajjBookings.length === 0 && (
        <div className="p-4 text-gray-500">
          No hajj bookings found.
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Management - Operations & Service Delivery Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search bookings..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="umrah-packages">Umrah</TabsTrigger>
            <TabsTrigger value="hajj-packages">Hajj</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="visa">Visa</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="umrah-packages" className="space-y-6">
            <Tabs defaultValue="group" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="group">Group Umrah</TabsTrigger>
                <TabsTrigger value="independent">Independent Umrah</TabsTrigger>
                <TabsTrigger value="custom">Custom Umrah</TabsTrigger>
              </TabsList>
              
              <TabsContent value="group">
                {renderEnhancedBookingTable(getUmrahPackagesByType("group"), "Group Umrah")}
              </TabsContent>
              
              <TabsContent value="independent">
                {renderEnhancedBookingTable(getUmrahPackagesByType("independent"), "Independent Umrah")}
              </TabsContent>
              
              <TabsContent value="custom">
                {renderEnhancedBookingTable(getUmrahPackagesByType("custom"), "Custom Umrah")}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="hajj-packages">
            {renderHajjTable()}
          </TabsContent>

          <TabsContent value="flights">
            {renderFlightTable()}
          </TabsContent>

          <TabsContent value="hotels">
            {renderHotelTable()}
          </TabsContent>

          <TabsContent value="visa">
            {renderVisaTable()}
          </TabsContent>

          <TabsContent value="transport">
            {renderTransportTable()}
          </TabsContent>

          <TabsContent value="activities">
            {renderActivityTable()}
          </TabsContent>

          <TabsContent value="guide">
            {renderGuideTable()}
          </TabsContent>
        </Tabs>

        {/* Vendor Management Dialog */}
        <VendorManagementDialog
          booking={selectedBooking}
          serviceType={selectedServiceType}
          isOpen={vendorDialogOpen}
          onClose={() => setVendorDialogOpen(false)}
          onUpdate={handleVendorUpdate}
        />

        {/* Service Delivery Dialog */}
        <ServiceDeliveryDialog
          booking={selectedBooking}
          serviceType={selectedServiceType}
          isOpen={deliveryDialogOpen}
          onClose={() => setDeliveryDialogOpen(false)}
          onUpdate={handleDeliveryUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default BookingsManager;
