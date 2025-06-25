import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Ziarath {
  id: string;
  ziarath_type: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  description: string | null;
  inclusions: string[] | null;
  significance: string | null;
  best_time: string | null;
  historical_importance: string | null;
  images: string[] | null;
  guide_id: string | null;
  max_participants: number | null;
  status: string;
  created_at: string | null;
  vehicles?: { [vehicleType: string]: string };
}

const defaultValues = {
  ziarath_type: '',
  title: '',
  location: '',
  duration: '',
  price: '',
  description: '',
  inclusions: '',
  significance: '',
  best_time: '',
  historical_importance: '',
  guide_id: '',
  max_participants: '',
  status: 'active',
  vehicles: {},
};

const ZiarathManager = () => {
  const [ziaraths, setZiaraths] = useState<Ziarath[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZiarath, setEditingZiarath] = useState<Ziarath | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    defaultValues
  });

  // Fetch all ziaraths from Supabase
  const fetchZiaraths = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ziarath_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ziaraths:', error);
    } else {
      setZiaraths(data || []);
    }
    setLoading(false);
  };

  // Fetch all vehicles
  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('vehicle_name');
    
    if (error) {
      console.error('Error fetching vehicles:', error);
    } else {
      setVehicles(data || []);
    }
  };

  useEffect(() => {
    fetchZiaraths();
    fetchVehicles();
  }, []);

  const onSubmit = async (data: any) => {
    // Convert comma-separated inclusions to array
    const inclusionsArray = data.inclusions
      ? data.inclusions.split(',').map((item: string) => item.trim())
      : null;

    const payload = {
      ziarath_type: data.ziarath_type,
      title: data.title,
      location: data.location,
      duration: data.duration,
      price: parseFloat(data.price),
      description: data.description || null,
      inclusions: inclusionsArray,
      significance: data.significance || null,
      best_time: data.best_time || null,
      historical_importance: data.historical_importance || null,
      guide_id: data.guide_id || null,
      max_participants: data.max_participants ? parseInt(data.max_participants) : null,
      status: data.status,
      vehicles: data.vehicles // Store vehicle prices
    };

    let result;
    if (editingZiarath) {
      result = await supabase
        .from('ziarath_services')
        .update(payload)
        .eq('id', editingZiarath.id);
    } else {
      result = await supabase
        .from('ziarath_services')
        .insert([payload]);
    }

    if (result.error) {
      console.error('Error saving ziarath:', result.error);
      return;
    }

    setIsDialogOpen(false);
    setEditingZiarath(null);
    form.reset(defaultValues);
    fetchZiaraths();
  };

  const handleEdit = (ziarath: Ziarath) => {
    setEditingZiarath(ziarath);
    form.reset({
      ...ziarath,
      inclusions: ziarath.inclusions ? ziarath.inclusions.join(', ') : '',
      price: ziarath.price.toString(),
      max_participants: ziarath.max_participants?.toString() || '',
      vehicles: ziarath.vehicles || {},
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('ziarath_services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ziarath:', error);
      return;
    }

    fetchZiaraths();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Ziarath Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingZiarath(null); form.reset(defaultValues); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Ziarath
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingZiarath ? 'Edit Ziarath' : 'Add New Ziarath'}</DialogTitle>
              <DialogDescription>
                Fill in the details for the Ziarath, including location, vehicle types, and prices.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ziarath_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ziarath Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ziarath type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="makkah_ziarath">Makkah Ziarath</SelectItem>
                            <SelectItem value="madinah_ziarath">Madinah Ziarath</SelectItem>
                            <SelectItem value="taif_ziarath">Taif Ziarath</SelectItem>
                            <SelectItem value="badr_ziarath">Badr Ziarath</SelectItem>
                            <SelectItem value="jeddah_ziarath">Jeddah Ziarath</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ziarath title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="4 hours" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" placeholder="50.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="best_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best Time to Visit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select best time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Morning">Morning</SelectItem>
                            <SelectItem value="Afternoon">Afternoon</SelectItem>
                            <SelectItem value="Evening">Evening</SelectItem>
                            <SelectItem value="Night">Night</SelectItem>
                            <SelectItem value="Anytime">Anytime</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Textarea placeholder="Ziarath description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="significance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Significance</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Religious significance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="historical_importance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Importance</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Historical importance and background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inclusions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inclusions (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Transportation, Guide, Refreshments" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="20" {...field} />
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  key={vehicles.map(v => v.vehicle_type).join(',')}
                  control={form.control}
                  name="vehicles"
                  render={({ field: { value = {}, onChange } }) => {
                    console.log('Vehicle selection value:', value);
                    return (
                      <div>
                        <FormLabel>Vehicle Types & Prices</FormLabel>
                        <div className="flex flex-col gap-2">
                          {vehicles.map(vehicle => {
                            const checked = !!value[vehicle.vehicle_type];
                            return (
                              <div key={vehicle.vehicle_type} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      onChange({ ...value, [vehicle.vehicle_type]: '' });
                                    } else {
                                      const { [vehicle.vehicle_type]: omit, ...rest } = value;
                                      onChange({ ...rest });
                                    }
                                  }}
                                />
                                <span className="w-40">{vehicle.vehicle_type} ({vehicle.vehicle_name})</span>
                                {checked && (
                                  <Input
                                    className="w-24"
                                    placeholder="Price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={value[vehicle.vehicle_type] || ''}
                                    onChange={e => {
                                      onChange({ ...value, [vehicle.vehicle_type]: e.target.value });
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingZiarath ? 'Update Ziarath' : 'Create Ziarath'}
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
                  <th className="text-left p-2">Ziarath</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Base Price</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4">Loading...</td>
                  </tr>
                ) : ziaraths.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4">No ziaraths found</td>
                  </tr>
                ) : (
                  ziaraths.map(ziarath => (
                    <tr key={ziarath.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{ziarath.title}</div>
                          <div className="text-sm text-gray-500">{ziarath.location}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{ziarath.ziarath_type}</Badge>
                      </td>
                      <td className="p-2">{ziarath.location}</td>
                      <td className="p-2">{ziarath.duration}</td>
                      <td className="p-2">${ziarath.price.toFixed(2)}</td>
                      <td className="p-2">
                        <Badge variant={ziarath.status === 'active' ? 'default' : 'secondary'}>
                          {ziarath.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(ziarath)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(ziarath.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZiarathManager;
