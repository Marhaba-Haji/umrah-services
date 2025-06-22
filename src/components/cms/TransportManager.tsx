
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
import { Eye, Edit, Trash2, Plus, Car } from 'lucide-react';

interface Transport {
  id: number;
  vehicleType: string;
  vehicleName: string;
  route: string;
  capacity: number;
  price: string;
  features: string[];
  status: string;
  description: string;
}

const TransportManager = () => {
  const [transports, setTransports] = useState<Transport[]>([
    { 
      id: 1, 
      vehicleType: 'Bus', 
      vehicleName: 'Luxury Coach', 
      route: 'Jeddah Airport - Makkah', 
      capacity: 45, 
      price: '$25', 
      features: ['AC', 'WiFi', 'Reclining Seats'], 
      status: 'Active',
      description: 'Comfortable luxury bus service'
    },
    { 
      id: 2, 
      vehicleType: 'Van', 
      vehicleName: 'Premium Van', 
      route: 'Makkah - Madinah', 
      capacity: 8, 
      price: '$150', 
      features: ['AC', 'Private'], 
      status: 'Active',
      description: 'Private van service'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(null);

  const form = useForm({
    defaultValues: {
      vehicleType: '',
      vehicleName: '',
      route: '',
      capacity: '',
      price: '',
      features: '',
      status: 'Active',
      description: ''
    }
  });

  const onSubmit = (data: any) => {
    const newTransport: Transport = {
      id: editingTransport ? editingTransport.id : Date.now(),
      vehicleType: data.vehicleType,
      vehicleName: data.vehicleName,
      route: data.route,
      capacity: parseInt(data.capacity),
      price: data.price,
      features: data.features.split(',').map((item: string) => item.trim()),
      status: data.status,
      description: data.description
    };

    if (editingTransport) {
      setTransports(transports.map(transport => transport.id === editingTransport.id ? newTransport : transport));
    } else {
      setTransports([...transports, newTransport]);
    }

    setIsDialogOpen(false);
    setEditingTransport(null);
    form.reset();
  };

  const handleEdit = (transport: Transport) => {
    setEditingTransport(transport);
    form.reset({
      vehicleType: transport.vehicleType,
      vehicleName: transport.vehicleName,
      route: transport.route,
      capacity: transport.capacity.toString(),
      price: transport.price,
      features: transport.features.join(', '),
      status: transport.status,
      description: transport.description
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTransports(transports.filter(transport => transport.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Transport Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingTransport(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transport
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTransport ? 'Edit Transport' : 'Add New Transport'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Bus">Bus</SelectItem>
                            <SelectItem value="Van">Van</SelectItem>
                            <SelectItem value="Car">Car</SelectItem>
                            <SelectItem value="Taxi">Taxi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter vehicle name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jeddah Airport - Makkah" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of passengers" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="$25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="AC, WiFi, Reclining Seats" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Transport description" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingTransport ? 'Update Transport' : 'Create Transport'}
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
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Route</th>
                  <th className="text-left p-2">Capacity</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transports.map(transport => (
                  <tr key={transport.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{transport.vehicleName}</div>
                        <div className="text-sm text-gray-500">{transport.vehicleType}</div>
                      </div>
                    </td>
                    <td className="p-2">{transport.route}</td>
                    <td className="p-2">{transport.capacity} passengers</td>
                    <td className="p-2">{transport.price}</td>
                    <td className="p-2">
                      <Badge variant={transport.status === 'Active' ? 'default' : 'secondary'}>
                        {transport.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(transport)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(transport.id)}>
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

export default TransportManager;
