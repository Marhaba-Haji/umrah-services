import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface Flight {
  id: string;
  sector: string;
  airline: string;
  flight_number: string;
  price: number;
  duration: string;
  layover_duration: string | null;
  luggage_limit: string | null;
  flight_type: "direct" | "connecting";
  departure_time: string;
  arrival_time: string;
  status: "active" | "inactive";
}

interface FlightFormData {
  sector: string;
  airline: string;
  flightNumber: string;
  price: string;
  duration: string;
  layoverDuration?: string;
  luggageLimit?: string;
  flightType: string;
  departureTime: string;
  arrivalTime: string;
  status: "active" | "inactive";
}

const GroupFlightsManager = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FlightFormData>();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("group_flights")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFlights(data || []);
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

  const filteredFlights = flights.filter((flight) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      flight.sector.toLowerCase().includes(searchTermLower) ||
      flight.airline.toLowerCase().includes(searchTermLower) ||
      flight.flight_number.toLowerCase().includes(searchTermLower)
    );
  });

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setIsFormOpen(true);

    setValue("sector", flight.sector);
    setValue("airline", flight.airline);
    setValue("flightNumber", flight.flight_number);
    setValue("price", String(flight.price));
    setValue("duration", flight.duration);
    setValue("layoverDuration", flight.layover_duration || "");
    setValue("luggageLimit", flight.luggage_limit || "");
    setValue("flightType", flight.flight_type);
    setValue("departureTime", flight.departure_time);
    setValue("arrivalTime", flight.arrival_time);
    setValue("status", flight.status);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      setLoading(true);
      try {
        const { error } = await supabase.from("group_flights").delete().eq("id", id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Flight deleted successfully!",
        });
        fetchFlights();
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

  const handleSubmit = async (data: FlightFormData) => {
    try {
      setLoading(true);

      const flightData = {
        sector: data.sector,
        airline: data.airline,
        flight_number: data.flightNumber,
        price: parseFloat(data.price),
        duration: data.duration,
        layover_duration: data.layoverDuration || null,
        luggage_limit: data.luggageLimit || null,
        flight_type: data.flightType as "direct" | "connecting",
        departure_time: data.departureTime,
        arrival_time: data.arrivalTime,
        status: data.status,
      };

      if (editingFlight) {
        const { error } = await supabase
          .from("group_flights")
          .update(flightData)
          .eq("id", editingFlight.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Flight updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from("group_flights")
          .insert([flightData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Flight added successfully!",
        });
      }

      fetchFlights();
      setIsFormOpen(false);
      setEditingFlight(null);
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
        <CardTitle>Group Flights Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search flights..."
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
          <Button onClick={() => {
            setEditingFlight(null);
            reset();
            setIsFormOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Flight
          </Button>
        </div>

        {/* Flights Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sector</TableHead>
                <TableHead>Airline</TableHead>
                <TableHead>Flight Number</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell className="font-medium">{flight.sector}</TableCell>
                  <TableCell>{flight.airline}</TableCell>
                  <TableCell>{flight.flight_number}</TableCell>
                  <TableCell>{flight.price}</TableCell>
                  <TableCell>{flight.duration}</TableCell>
                  <TableCell>
                    {flight.status === "active" ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(flight)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(flight.id)}
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingFlight ? "Edit Flight" : "Add New Flight"}</DialogTitle>
              <DialogDescription>
                {editingFlight ? "Update flight details." : "Enter details for the new flight."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sector" className="text-right">
                    Sector
                  </Label>
                  <Controller
                    name="sector"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Sector is required" }}
                    render={({ field }) => (
                      <Input id="sector" placeholder="e.g., DXB-JED" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="airline" className="text-right">
                    Airline
                  </Label>
                  <Controller
                    name="airline"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Airline is required" }}
                    render={({ field }) => (
                      <Input id="airline" placeholder="e.g., Emirates" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="flightNumber" className="text-right">
                    Flight Number
                  </Label>
                  <Controller
                    name="flightNumber"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Flight Number is required" }}
                    render={({ field }) => (
                      <Input id="flightNumber" placeholder="e.g., EK123" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Controller
                    name="price"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Price is required",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                        message: "Invalid price format",
                      },
                    }}
                    render={({ field }) => (
                      <Input id="price" placeholder="e.g., 1200.00" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration
                  </Label>
                  <Controller
                    name="duration"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Duration is required" }}
                    render={({ field }) => (
                      <Input id="duration" placeholder="e.g., 3h 45m" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="layoverDuration" className="text-right">
                    Layover Duration
                  </Label>
                  <Controller
                    name="layoverDuration"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input id="layoverDuration" placeholder="e.g., 2h 30m" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="luggageLimit" className="text-right">
                    Luggage Limit
                  </Label>
                  <Controller
                    name="luggageLimit"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input id="luggageLimit" placeholder="e.g., 20kg" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="flightType" className="text-right">
                    Flight Type
                  </Label>
                  <Controller
                    name="flightType"
                    control={control}
                    defaultValue="direct"
                    rules={{ required: "Flight Type is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select flight type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">Direct</SelectItem>
                          <SelectItem value="connecting">Connecting</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departureTime" className="text-right">
                    Departure Time
                  </Label>
                  <Controller
                    name="departureTime"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Departure Time is required" }}
                    render={({ field }) => (
                      <Input type="time" id="departureTime" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="arrivalTime" className="text-right">
                    Arrival Time
                  </Label>
                  <Controller
                    name="arrivalTime"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Arrival Time is required" }}
                    render={({ field }) => (
                      <Input type="time" id="arrivalTime" {...field} />
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue="active"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
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

export default GroupFlightsManager;
