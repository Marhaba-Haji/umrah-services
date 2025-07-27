
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
  package_name?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
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

  // Dummy data for all booking types
  const dummyUmrahBookings: Booking[] = [
    {
      id: "1",
      booking_reference: "UMR-2024-001",
      total_amount: 125000,
      number_of_travelers: 2,
      travel_date: "2024-03-15",
      status: "confirmed",
      payment_status: "completed",
      created_at: "2024-01-15T10:30:00Z",
      package_name: "Deluxe Umrah Package - 14 Days",
      customer_name: "Ahmed Hassan",
      customer_email: "ahmed.hassan@email.com",
      customer_phone: "+91-9876543210"
    },
    {
      id: "2",
      booking_reference: "UMR-2024-002",
      total_amount: 85000,
      number_of_travelers: 4,
      travel_date: "2024-04-20",
      status: "pending",
      payment_status: "pending",
      created_at: "2024-02-10T14:20:00Z",
      package_name: "Economy Umrah Package - 10 Days",
      customer_name: "Fatima Ali",
      customer_email: "fatima.ali@email.com",
      customer_phone: "+91-9876543211"
    },
    {
      id: "3",
      booking_reference: "UMR-2024-003",
      total_amount: 195000,
      number_of_travelers: 1,
      travel_date: "2024-05-10",
      status: "confirmed",
      payment_status: "completed",
      created_at: "2024-02-25T09:15:00Z",
      package_name: "Premium Umrah Package - 21 Days",
      customer_name: "Mohammad Khan",
      customer_email: "mohammad.khan@email.com",
      customer_phone: "+91-9876543212"
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
        return booking.package_name?.includes("Group");
      } else if (type === "independent") {
        return booking.package_name?.includes("Independent") || booking.package_name?.includes("Economy");
      } else if (type === "custom") {
        return booking.package_name?.includes("Custom") || booking.package_name?.includes("Premium");
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
      </CardContent>
    </Card>
  );
};

export default BookingsManager;
