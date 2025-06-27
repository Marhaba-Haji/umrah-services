import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const vehicleDefaultValues = {
  vehicle_name: '',
  vehicle_type: '',
  capacity: '',
  luggage_capacity: '',
  features: [],
  vehicle_image: '',
  description: '',
};

const routeDefaultValues = {
  route_name: '',
  trip_duration: '',
  trip_distance: '',
  description: '',
};

const TransportManager = () => {
  const [transports, setTransports] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const [vehicleImageFile, setVehicleImageFile] = useState(null);
  const [isTransportDialogOpen, setIsTransportDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [transportPrice, setTransportPrice] = useState('');

  const form = useForm({ defaultValues });
  const vehicleForm = useForm({ defaultValues: vehicleDefaultValues });
  const routeForm = useForm({ defaultValues: routeDefaultValues });

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

  // Fetch all vehicles
  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('vehicle_name');
    if (!error) setVehicles(data || []);
  };

  // Fetch all routes
  const fetchRoutes = async () => {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('route_name');
    if (!error) setRoutes(data || []);
  };

  useEffect(() => { fetchTransports(); fetchVehicles(); fetchRoutes(); }, []);

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

  // Add vehicle
  const onVehicleSubmit = async (data) => {
    let vehicleImageUrl = '';
    if (vehicleImageFile) {
      const fileExt = vehicleImageFile.name.split('.').pop();
      const fileName = `${Date.now()}-vehicle-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('lovable-uploads').upload(fileName, vehicleImageFile);
      if (uploadError) {
        alert('Image upload failed: ' + uploadError.message);
        return;
      }
      vehicleImageUrl = `${supabaseUrl}/storage/v1/object/public/lovable-uploads/${fileName}`;
    }
    const { error } = await supabase.from('vehicles').insert([
      {
        vehicle_name: data.vehicle_name,
        vehicle_type: data.vehicle_type,
        capacity: parseInt(data.capacity),
        luggage_capacity: data.luggage_capacity,
        features: data.features,
        vehicle_image: vehicleImageUrl,
        description: data.description,
      },
    ]);
    if (error) { alert('Failed to save vehicle: ' + error.message); return; }
    setIsVehicleDialogOpen(false);
    vehicleForm.reset(vehicleDefaultValues);
    setVehicleImageFile(null);
    fetchVehicles();
  };

  // Add route
  const onRouteSubmit = async (data) => {
    const { error } = await supabase.from('routes').insert([
      {
        route_name: data.route_name,
        trip_duration: data.trip_duration,
        trip_distance: data.trip_distance,
        description: data.description,
      },
    ]);
    if (error) { alert('Failed to save route: ' + error.message); return; }
    setIsRouteDialogOpen(false);
    routeForm.reset(routeDefaultValues);
    fetchRoutes();
  };

  // Add transport from vehicle and route
  const onTransportSubmit = async (e) => {
    e.preventDefault();
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    const route = routes.find(r => r.id === selectedRouteId);
    if (!vehicle || !route || !transportPrice) {
      alert('Please select a vehicle, route, and enter a price.');
      return;
    }
    const payload = {
      vehicle_type: vehicle.vehicle_type,
      vehicle_name: vehicle.vehicle_name,
      route: route.route_name,
      capacity: vehicle.capacity,
      price: parseFloat(transportPrice),
      description: vehicle.description,
      features: vehicle.features,
      luggage_capacity: vehicle.luggage_capacity,
      vehicle_image: vehicle.vehicle_image,
      trip_distance: route.trip_distance,
      trip_duration: route.trip_duration,
      is_active: true,
    };
    const { error } = await supabase.from('transport_services').insert([payload]);
    if (error) { alert('Failed to save transport: ' + error.message); return; }
    setIsTransportDialogOpen(false);
    setSelectedVehicleId('');
    setSelectedRouteId('');
    setTransportPrice('');
    fetchTransports();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h3 className="text-xl font-semibold">Transport Management</h3>
        <div className="flex gap-2">
          <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { vehicleForm.reset(vehicleDefaultValues); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle>Add Vehicle</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new vehicle. All fields marked * are required.
                </DialogDescription>
              </DialogHeader>
              <Form {...vehicleForm}>
                <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-4">
                  <FormField control={vehicleForm.control} name="vehicle_name" render={({ field }) => (
                    <FormItem><FormLabel>Vehicle Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={vehicleForm.control} name="vehicle_type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="Mini Van">Mini Van</SelectItem>
                          <SelectItem value="GMC">GMC</SelectItem>
                          <SelectItem value="Van">Van</SelectItem>
                          <SelectItem value="Mini Bus">Mini Bus</SelectItem>
                          <SelectItem value="Bus">Bus</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={vehicleForm.control} name="capacity" render={({ field }) => (
                    <FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={vehicleForm.control} name="luggage_capacity" render={({ field }) => (
                    <FormItem><FormLabel>Luggage Capacity</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={vehicleForm.control} name="features" render={({ field }) => (
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
                  )} />
                  <FormField control={vehicleForm.control} name="vehicle_image" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            setVehicleImageFile(file || null);
                            if (!file) field.onChange('');
                          }}
                        />
                      </FormControl>
                      {vehicleImageFile && (
                        <img src={URL.createObjectURL(vehicleImageFile)} alt="preview" className="w-24 h-16 object-cover rounded mt-2" />
                      )}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={vehicleForm.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit">Save Vehicle</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { routeForm.reset(routeDefaultValues); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle>Add Route</DialogTitle>
                <DialogDescription>
                  Enter the details for the new route. All fields marked * are required.
                </DialogDescription>
              </DialogHeader>
              <Form {...routeForm}>
                <form onSubmit={routeForm.handleSubmit(onRouteSubmit)} className="space-y-4">
                  <FormField control={routeForm.control} name="route_name" render={({ field }) => (
                    <FormItem><FormLabel>Route Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={routeForm.control} name="trip_duration" render={({ field }) => (
                    <FormItem><FormLabel>Trip Duration</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={routeForm.control} name="trip_distance" render={({ field }) => (
                    <FormItem><FormLabel>Trip Distance</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={routeForm.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit">Save Route</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={isTransportDialogOpen} onOpenChange={setIsTransportDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSelectedVehicleId(''); setSelectedRouteId(''); setTransportPrice(''); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Transport
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle>Add Transport</DialogTitle>
                <DialogDescription>
                  Select a vehicle and a route, and enter a price to create a new transport service.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onTransportSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle</label>
                  <select className="w-full border rounded p-2" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} required>
                    <option value="">Select vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.vehicle_name} ({v.vehicle_type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Route</label>
                  <select className="w-full border rounded p-2" value={selectedRouteId} onChange={e => setSelectedRouteId(e.target.value)} required>
                    <option value="">Select route</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.route_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input className="w-full border rounded p-2" type="number" min="0" step="0.01" value={transportPrice} onChange={e => setTransportPrice(e.target.value)} required placeholder="₹1000" />
                </div>
                <Button type="submit">Save Transport</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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
                  <th className="p-2 border">Price (₹)</th>
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
      {/* Vehicles Table */}
      <Card>
        <CardHeader><CardTitle>All Vehicles</CardTitle></CardHeader>
        <CardContent>
          <table className="min-w-full text-sm border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Capacity</th>
                <th className="p-2 border">Luggage</th>
                <th className="p-2 border">Features</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td className="p-2 border">{vehicle.vehicle_name}</td>
                  <td className="p-2 border">{vehicle.vehicle_type}</td>
                  <td className="p-2 border">{vehicle.capacity}</td>
                  <td className="p-2 border">{vehicle.luggage_capacity}</td>
                  <td className="p-2 border">{Array.isArray(vehicle.features) ? vehicle.features.join(', ') : vehicle.features}</td>
                  <td className="p-2 border">{vehicle.vehicle_image && <img src={vehicle.vehicle_image} alt="vehicle" className="w-16 h-10 object-cover rounded" />}</td>
                  <td className="p-2 border">{vehicle.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* Routes Table */}
      <Card>
        <CardHeader><CardTitle>All Routes</CardTitle></CardHeader>
        <CardContent>
          <table className="min-w-full text-sm border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Distance</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(route => (
                <tr key={route.id}>
                  <td className="p-2 border">{route.route_name}</td>
                  <td className="p-2 border">{route.trip_duration}</td>
                  <td className="p-2 border">{route.trip_distance}</td>
                  <td className="p-2 border">{route.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportManager;
