import React, { useState, useEffect } from 'react';
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
import { supabase, supabaseUrl } from '@/lib/supabaseClient';

const VEHICLE_TYPES = [
  'Sedan', 'Mini Van', 'GMC', 'Large Van', 'Mini Bus', 'Bus', 'Van', 'Coach'
];
const FEATURE_OPTIONS = [
  'AC', 'WiFi', 'Reclining Seats', 'Charger', 'TV', 'Music', 'Luggage', 'Water', 'Snacks', 'GPS', 'Leather Seats', 'Sunroof'
];

const VEHICLE_TYPE_MAP = {
  'Sedan': 'car',
  'Mini Van': 'van',
  'GMC': 'luxury_car',
  'Large Van': 'van',
  'Mini Bus': 'bus',
  'Bus': 'bus',
  'Van': 'van',
  'Coach': 'bus',
};

const defaultValues = {
  vehicle_type: '',
  vehicle_name: '',
  route: '',
  capacity: '',
  price: '',
  description: '',
  features: [],
  driver_name: '',
  driver_contact: '',
  vehicle_details: '',
  is_ac: true,
  luggage_capacity: '',
  is_active: true,
  trip_distance: '',
  trip_duration: '',
  vehicle_image: '',
};

const TransportManager = () => {
  const [transports, setTransports] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const form = useForm({ defaultValues });

  // Fetch all transports from Supabase
  const fetchTransports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transport_services')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setTransports(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTransports(); }, []);

  // Add or update transport
  const onSubmit = async (data) => {
    let vehicleImageUrl = data.vehicle_image;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('lovable-uploads').upload(fileName, imageFile);
      if (uploadError) {
        alert('Image upload failed: ' + uploadError.message);
        return;
      }
      vehicleImageUrl = `${supabaseUrl}/storage/v1/object/public/lovable-uploads/${fileName}`;
    }
    const payload = {
      vehicle_type: VEHICLE_TYPE_MAP[data.vehicle_type] || 'car',
      vehicle_name: data.vehicle_name,
      route: data.route,
      capacity: parseInt(data.capacity),
      price: parseFloat(data.price),
      description: data.description || null,
      features: data.features,
      driver_name: data.driver_name || null,
      driver_contact: data.driver_contact || null,
      vehicle_details: data.vehicle_details
        ? (data.vehicle_details.trim().startsWith('{') ? JSON.parse(data.vehicle_details) : data.vehicle_details)
        : null,
      is_ac: data.is_ac,
      luggage_capacity: data.luggage_capacity || null,
      is_active: data.is_active,
      trip_distance: data.trip_distance || null,
      trip_duration: data.trip_duration || null,
      vehicle_image: vehicleImageUrl || null,
    };

    let result;
    if (editingTransport) {
      result = await supabase
        .from('transport_services')
        .update(payload)
        .eq('id', editingTransport.id);
    } else {
      result = await supabase
        .from('transport_services')
        .insert([payload]);
    }

    if (result.error) {
      alert('Failed to save transport: ' + result.error.message);
      return;
    }

    setIsDialogOpen(false);
    setEditingTransport(null);
    form.reset(defaultValues);
    fetchTransports();
    setImageFile(null);
  };

  // Edit handler
  const handleEdit = (transport) => {
    setEditingTransport(transport);
    form.reset({
      vehicle_type: transport.vehicle_type,
      vehicle_name: transport.vehicle_name || '',
      route: transport.route,
      capacity: transport.capacity.toString(),
      price: transport.price.toString(),
      description: transport.description || '',
      features: transport.features || [],
      driver_name: transport.driver_name || '',
      driver_contact: transport.driver_contact || '',
      vehicle_details: transport.vehicle_details ? JSON.stringify(transport.vehicle_details) : '',
      is_ac: transport.is_ac,
      luggage_capacity: transport.luggage_capacity || '',
      is_active: transport.is_active,
      trip_distance: transport.trip_distance || '',
      trip_duration: transport.trip_duration || '',
      vehicle_image: transport.vehicle_image || '',
    });
    setIsDialogOpen(true);
    setImageFile(null);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transport?')) return;
    const { error } = await supabase
      .from('transport_services')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Failed to delete transport: ' + error.message);
      return;
    }
    fetchTransports();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Transport Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingTransport(null); form.reset(defaultValues); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transport
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTransport ? 'Edit Transport' : 'Add New Transport'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicle_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VEHICLE_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicle_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Toyota Hiace" {...field} />
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
                          <Input placeholder="e.g., Jeddah Airport - Makkah Hotel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} placeholder="Number of passengers" {...field} />
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
                          <Input type="number" min={0} step="0.01" placeholder="e.g., 150.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
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
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {FEATURE_OPTIONS.map(option => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.value?.includes(option)}
                              onChange={e => {
                                if (e.target.checked) {
                                  field.onChange([...(field.value || []), option]);
                                } else {
                                  field.onChange((field.value || []).filter(f => f !== option));
                                }
                              }}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="driver_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Driver's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="driver_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Driver's contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="vehicle_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Details (JSON)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='e.g. {"color":"White","model":"2023"}' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="is_ac"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AC</FormLabel>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="luggage_capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luggage Capacity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2 bags" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Active</FormLabel>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="trip_distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Distance</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 80 km" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trip_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 1.5 hours" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="vehicle_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            setImageFile(file || null);
                            if (!file) field.onChange('');
                          }}
                        />
                      </FormControl>
                      {form.watch('vehicle_image') && !imageFile && (
                        <img src={form.watch('vehicle_image')} alt="preview" className="w-24 h-16 object-cover rounded mt-2" />
                      )}
                      {imageFile && (
                        <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-24 h-16 object-cover rounded mt-2" />
                      )}
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
        <CardHeader>
          <CardTitle>All Transport Services</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Vehicle Type</th>
                  <th className="p-2 border">Vehicle Name</th>
                  <th className="p-2 border">Trip Distance</th>
                  <th className="p-2 border">Trip Duration</th>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Route</th>
                  <th className="p-2 border">Capacity</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Active</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transports.map(transport => (
                  <tr key={transport.id}>
                    <td className="p-2 border">{transport.vehicle_type}</td>
                    <td className="p-2 border">{transport.vehicle_name}</td>
                    <td className="p-2 border">{transport.trip_distance}</td>
                    <td className="p-2 border">{transport.trip_duration}</td>
                    <td className="p-2 border">{transport.vehicle_image && <img src={transport.vehicle_image} alt="vehicle" className="w-16 h-10 object-cover rounded" />}</td>
                    <td className="p-2 border">{transport.route}</td>
                    <td className="p-2 border">{transport.capacity}</td>
                    <td className="p-2 border">{transport.price}</td>
                    <td className="p-2 border">{transport.is_active ? 'Yes' : 'No'}</td>
                    <td className="p-2 border space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(transport)}>
                        <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(transport.id)}>
                        <Trash2 className="w-4 h-4" />
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportManager;
