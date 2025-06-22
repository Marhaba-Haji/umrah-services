
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus, Plane } from 'lucide-react';

interface GroupFlight {
  id: number;
  sector: string;
  airline: string;
  flightNumber: string;
  price: string;
  duration: string;
  layoverDuration: string;
  luggageLimit: string;
  flightType: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}

const GroupFlightsManager = () => {
  const [flights, setFlights] = useState<GroupFlight[]>([
    { 
      id: 1, 
      sector: 'Karachi - Jeddah', 
      airline: 'Saudi Airlines', 
      flightNumber: 'SV-714', 
      price: '$450', 
      duration: '3h 30m',
      layoverDuration: 'Direct',
      luggageLimit: '23kg + 7kg',
      flightType: 'Direct',
      departureTime: '14:30',
      arrivalTime: '16:00',
      status: 'Active'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<GroupFlight | null>(null);

  const form = useForm({
    defaultValues: {
      sector: '',
      airline: '',
      flightNumber: '',
      price: '',
      duration: '',
      layoverDuration: '',
      luggageLimit: '',
      flightType: 'Direct',
      departureTime: '',
      arrivalTime: '',
      status: 'Active'
    }
  });

  const onSubmit = (data: any) => {
    const newFlight: GroupFlight = {
      id: editingFlight ? editingFlight.id : Date.now(),
      sector: data.sector,
      airline: data.airline,
      flightNumber: data.flightNumber,
      price: data.price,
      duration: data.duration,
      layoverDuration: data.layoverDuration,
      luggageLimit: data.luggageLimit,
      flightType: data.flightType,
      departureTime: data.departureTime,
      arrivalTime: data.arrivalTime,
      status: data.status
    };

    if (editingFlight) {
      setFlights(flights.map(flight => flight.id === editingFlight.id ? newFlight : flight));
    } else {
      setFlights([...flights, newFlight]);
    }

    setIsDialogOpen(false);
    setEditingFlight(null);
    form.reset();
  };

  const handleEdit = (flight: GroupFlight) => {
    setEditingFlight(flight);
    form.reset(flight);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setFlights(flights.filter(flight => flight.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Group Flights Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingFlight(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Flight
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFlight ? 'Edit Group Flight' : 'Add New Group Flight'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight Sector</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Karachi - Jeddah" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="airline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airline</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Saudi Airlines" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="flightNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SV-714" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="$450" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 3h 30m" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="layoverDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Layover Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="Direct or 2h 30m" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="luggageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luggage Limit</FormLabel>
                        <FormControl>
                          <Input placeholder="23kg + 7kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="flightType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select flight type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Direct">Direct</SelectItem>
                            <SelectItem value="Connecting">Connecting</SelectItem>
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
                    name="departureTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Time</FormLabel>
                        <FormControl>
                          <Input placeholder="14:30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="arrivalTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrival Time</FormLabel>
                        <FormControl>
                          <Input placeholder="16:00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingFlight ? 'Update Flight' : 'Create Flight'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
                  <th className="text-left p-2">Flight Details</th>
                  <th className="text-left p-2">Sector</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(flight => (
                  <tr key={flight.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{flight.airline}</div>
                        <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                      </div>
                    </td>
                    <td className="p-2">{flight.sector}</td>
                    <td className="p-2">
                      <div>
                        <div>{flight.duration}</div>
                        <div className="text-sm text-gray-500">{flight.flightType}</div>
                      </div>
                    </td>
                    <td className="p-2">{flight.price}</td>
                    <td className="p-2">
                      <Badge variant={flight.status === 'Active' ? 'default' : 'secondary'}>
                        {flight.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(flight)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(flight.id)}>
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

export default GroupFlightsManager;
