import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

interface GroupFlight {
  id: string;
  sector: string;
  airline: string;
  flight_number: string;
  price: number;
  duration: string;
  layover_duration?: string;
  luggage_limit?: string;
  flight_type: string;
  departure_time: string;
  arrival_time: string;
  status: string;
}

const GroupFlightsManager = () => {
  const [flights, setFlights] = useState<GroupFlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<GroupFlight | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    sector: '',
    airline: '',
    flight_number: '',
    price: 0,
    duration: '',
    layover_duration: '',
    luggage_limit: '',
    flight_type: 'direct',
    departure_time: '',
    arrival_time: '',
    status: 'active'
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const { data, error } = await supabase
        .from('group_flights')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedFlights = (data || []).map(item => ({
        id: item.id,
        sector: item.sector,
        airline: item.airline,
        flight_number: item.flight_number,
        price: item.price,
        duration: item.duration,
        layover_duration: item.layover_duration,
        luggage_limit: item.luggage_limit,
        flight_type: item.flight_type,
        departure_time: item.departure_time,
        arrival_time: item.arrival_time,
        status: item.status
      }));
      
      setFlights(typedFlights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      toast({
        title: "Error",
        description: "Failed to fetch flights",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const flightData = {
        sector: formData.sector,
        airline: formData.airline,
        flight_number: formData.flight_number,
        price: formData.price,
        duration: formData.duration,
        layover_duration: formData.layover_duration || null,
        luggage_limit: formData.luggage_limit || null,
        flight_type: formData.flight_type,
        departure_time: formData.departure_time,
        arrival_time: formData.arrival_time,
        status: formData.status
      };

      if (isEditing && selectedFlight) {
        const { error } = await supabase
          .from('group_flights')
          .update(flightData)
          .eq('id', selectedFlight.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Flight updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('group_flights')
          .insert([flightData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Flight created successfully"
        });
      }

      resetForm();
      fetchFlights();
    } catch (error) {
      console.error('Error saving flight:', error);
      toast({
        title: "Error",
        description: "Failed to save flight",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      sector: '',
      airline: '',
      flight_number: '',
      price: 0,
      duration: '',
      layover_duration: '',
      luggage_limit: '',
      flight_type: 'direct',
      departure_time: '',
      arrival_time: '',
      status: 'active'
    });
    setSelectedFlight(null);
    setIsEditing(false);
  };

  const handleEdit = (flight: GroupFlight) => {
    setSelectedFlight(flight);
    setFormData({
      sector: flight.sector,
      airline: flight.airline,
      flight_number: flight.flight_number,
      price: flight.price,
      duration: flight.duration,
      layover_duration: flight.layover_duration || '',
      luggage_limit: flight.luggage_limit || '',
      flight_type: flight.flight_type,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      status: flight.status
    });
    setIsEditing(true);
  };

  const handleDelete = async (flightId: string) => {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    
    try {
      const { error } = await supabase
        .from('group_flights')
        .delete()
        .eq('id', flightId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Flight deleted successfully"
      });
      
      fetchFlights();
    } catch (error) {
      console.error('Error deleting flight:', error);
      toast({
        title: "Error",
        description: "Failed to delete flight",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Group Flights Manager</h2>
        <Button onClick={() => setIsEditing(false)}>
          <Plus className="h-4 w-4 mr-2" />
          New Flight
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Flight' : 'Create New Flight'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sector">Sector</Label>
                <Input
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  placeholder="e.g., Delhi - Jeddah"
                />
              </div>
              <div>
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e) => setFormData({...formData, airline: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="flight_number">Flight Number</Label>
                <Input
                  id="flight_number"
                  value={formData.flight_number}
                  onChange={(e) => setFormData({...formData, flight_number: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Group Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flights.map((flight) => (
                <div key={flight.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-semibold">{flight.sector}</h3>
                    <p className="text-sm text-gray-600">{flight.airline} - {flight.flight_number}</p>
                    <p className="text-sm">₹{flight.price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(flight)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(flight.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupFlightsManager;
