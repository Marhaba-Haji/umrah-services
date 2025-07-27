
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
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface UmrahPackage {
  id: string;
  name: string;
  is_group_package: boolean;
  package_type: string;
  price: number;
  created_at: string;
}

const BookingsManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>([]);
  const [umrahPackages, setUmrahPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("umrah-packages");

  const fetchUmrahPackageBookings = useCallback(async () => {
    setLoading(true);
    try {
      // Get Umrah package bookings
      let query = supabase
        .from("bookings")
        .select(`
          *,
          umrah_packages!inner(
            id,
            name,
            is_group_package,
            package_type,
            price
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setBookings(data || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchHotelBookings = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("hotel_bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setHotelBookings(data || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchVisaApplications = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("visa_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setVisaApplications(data || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (activeTab === "umrah-packages") {
      fetchUmrahPackageBookings();
    } else if (activeTab === "hotels") {
      fetchHotelBookings();
    } else if (activeTab === "visa") {
      fetchVisaApplications();
    }
  }, [activeTab, fetchUmrahPackageBookings, fetchHotelBookings, fetchVisaApplications]);

  const filteredBookings = bookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    return booking.booking_reference.toLowerCase().includes(searchTermLower);
  });

  const filteredHotelBookings = hotelBookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    return booking.booking_reference.toLowerCase().includes(searchTermLower);
  });

  const filteredVisaApplications = visaApplications.filter((visa) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      visa.first_name.toLowerCase().includes(searchTermLower) ||
      visa.last_name.toLowerCase().includes(searchTermLower) ||
      visa.email.toLowerCase().includes(searchTermLower)
    );
  });

  const getUmrahPackagesByType = (type: string) => {
    return filteredBookings.filter((booking: any) => {
      const packageData = booking.umrah_packages;
      if (!packageData) return false;
      
      if (type === "group") {
        return packageData.is_group_package === true;
      } else if (type === "independent") {
        return packageData.is_group_package === false && packageData.package_type !== "custom";
      } else if (type === "custom") {
        return packageData.package_type === "custom";
      }
      return false;
    });
  };

  const renderBookingTable = (bookingData: Booking[], title: string) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
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
              <TableCell>${booking.total_amount}</TableCell>
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
              <TableCell>${booking.total_amount}</TableCell>
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

  const renderPlaceholderTable = (serviceName: string) => (
    <div className="rounded-md border">
      <div className="p-8 text-center text-gray-500">
        <h3 className="text-lg font-semibold mb-2">{serviceName} Bookings</h3>
        <p>No {serviceName.toLowerCase()} bookings found.</p>
        <p className="text-sm mt-2">This section will be populated when {serviceName.toLowerCase()} booking functionality is implemented.</p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Management</CardTitle>
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
                {renderBookingTable(getUmrahPackagesByType("group"), "Group Umrah")}
              </TabsContent>
              
              <TabsContent value="independent">
                {renderBookingTable(getUmrahPackagesByType("independent"), "Independent Umrah")}
              </TabsContent>
              
              <TabsContent value="custom">
                {renderBookingTable(getUmrahPackagesByType("custom"), "Custom Umrah")}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="hajj-packages">
            {renderPlaceholderTable("Hajj Packages")}
          </TabsContent>

          <TabsContent value="flights">
            {renderPlaceholderTable("Flight")}
          </TabsContent>

          <TabsContent value="hotels">
            {renderHotelTable()}
          </TabsContent>

          <TabsContent value="visa">
            {renderVisaTable()}
          </TabsContent>

          <TabsContent value="transport">
            {renderPlaceholderTable("Transport")}
          </TabsContent>

          <TabsContent value="activities">
            {renderPlaceholderTable("Activities")}
          </TabsContent>

          <TabsContent value="guide">
            {renderPlaceholderTable("Guide Services")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingsManager;
