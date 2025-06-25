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
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ZiarathService {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  description?: string;
  inclusions?: string[];
  max_participants?: number;
  ziarath_type?: string;
  significance?: string;
  historical_importance?: string;
  best_time?: string;
  images?: string[];
  status?: string;
}

const ZiarathManager = () => {
  const [ziaraths, setZiaraths] = useState<ZiarathService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZiarath, setEditingZiarath] = useState<ZiarathService | null>(null);
  const [viewingZiarath, setViewingZiarath] = useState<ZiarathService | null>(null);

  const form = useForm({
    defaultValues: {
      title: '',
      location: '',
      duration: '',
      price: '',
      description: '',
      ziarathType: '',
      maxParticipants: '',
      inclusions: '',
      significance: '',
      historicalImportance: '',
      bestTime: '',
      images: '',
      status: 'active',
    }
  });

  useEffect(() => {
    fetchZiaraths();
  }, []);

  const fetchZiaraths = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ziarath_services')
      .select('*');
    if (!error && data) {
      setZiaraths(data);
    }
    setLoading(false);
  };

  const onSubmit = async (data: any) => {
    const newZiarath = {
      title: data.title,
      location: data.location,
      duration: data.duration,
      price: parseFloat(data.price),
      description: data.description,
      ziarath_type: data.ziarathType,
      max_participants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined,
      inclusions: data.inclusions ? data.inclusions.split(',').map((i: string) => i.trim()) : [],
      significance: data.significance,
      historical_importance: data.historicalImportance,
      best_time: data.bestTime,
      images: data.images ? data.images.split(',').map((i: string) => i.trim()) : [],
      status: data.status,
    };

    let error;
    if (editingZiarath && editingZiarath.id) {
      ({ error } = await supabase.from('ziarath_services').update(newZiarath).eq('id', editingZiarath.id));
    } else {
      ({ error } = await supabase.from('ziarath_services').insert([newZiarath]));
    }
    if (!error) {
      await fetchZiaraths();
      setIsDialogOpen(false);
      setEditingZiarath(null);
      form.reset();
    } else {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save ziarath service',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (ziarath: ZiarathService) => {
    setEditingZiarath(ziarath);
    form.reset({
      title: ziarath.title,
      location: ziarath.location,
      duration: ziarath.duration,
      price: ziarath.price.toString(),
      description: ziarath.description,
      ziarathType: ziarath.ziarath_type,
      maxParticipants: ziarath.max_participants?.toString() || '',
      inclusions: ziarath.inclusions?.join(', ') || '',
      significance: ziarath.significance || '',
      historicalImportance: ziarath.historical_importance || '',
      bestTime: ziarath.best_time || '',
      images: ziarath.images?.join(', ') || '',
      status: ziarath.status || 'active'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast({
        title: 'Error',
        description: 'Invalid ziarath ID for delete.',
        variant: 'destructive',
      });
      return;
    }
    if (!window.confirm('Are you sure you want to delete this ziarath service? This action cannot be undone.')) return;
    const { error } = await supabase.from('ziarath_services').delete().eq('id', id);
    if (!error) {
      await fetchZiaraths();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Ziarath Services Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingZiarath(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Ziarath Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingZiarath ? 'Edit Ziarath Service' : 'Add New Ziarath Service'}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Fill in the details for the ziarath service. All fields marked * are required.
            </DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
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
                          <Input placeholder="e.g. Full Day" {...field} />
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
                          <Input type="number" step="0.01" placeholder="Enter price" {...field} />
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
                          <Textarea placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ziarathType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ziarath Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ziarath type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Participants</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter max participants" {...field} />
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
                          <Input placeholder="e.g. Transport, Meals" {...field} />
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
                          <Textarea placeholder="Enter significance" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="historicalImportance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Historical Importance</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter historical importance" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bestTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best Time to Visit</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter best time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Images (comma separated URLs)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URLs" {...field} />
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
          {loading ? (
            <div className="text-center py-8">Loading ziarath services...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Location</th>
                    <th className="text-left p-2">Duration</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ziaraths.map(ziarath => (
                    <tr key={ziarath.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{ziarath.title}</td>
                      <td className="p-2">{ziarath.location}</td>
                      <td className="p-2">{ziarath.duration}</td>
                      <td className="p-2">${ziarath.price}</td>
                      <td className="p-2">
                        <Badge variant={ziarath.status === 'active' ? 'default' : 'secondary'}>
                          {ziarath.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => setViewingZiarath(ziarath)}>
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewingZiarath} onOpenChange={open => { if (!open) setViewingZiarath(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ziarath Service Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            View all details of the selected ziarath service.
          </DialogDescription>
          {viewingZiarath && (
            <div className="space-y-2">
              <div><b>Title:</b> {viewingZiarath.title}</div>
              <div><b>Location:</b> {viewingZiarath.location}</div>
              <div><b>Duration:</b> {viewingZiarath.duration}</div>
              <div><b>Price:</b> ${viewingZiarath.price}</div>
              <div><b>Description:</b> {viewingZiarath.description}</div>
              <div><b>Ziarath Type:</b> {viewingZiarath.ziarath_type}</div>
              <div><b>Max Participants:</b> {viewingZiarath.max_participants}</div>
              <div><b>Inclusions:</b> {viewingZiarath.inclusions?.join(', ')}</div>
              <div><b>Significance:</b> {viewingZiarath.significance}</div>
              <div><b>Historical Importance:</b> {viewingZiarath.historical_importance}</div>
              <div><b>Best Time to Visit:</b> {viewingZiarath.best_time}</div>
              <div><b>Images:</b> {viewingZiarath.images?.map((img, idx) => (
                <img key={idx} src={img} alt={`Ziarath image ${idx + 1}`} className="w-24 h-24 object-cover rounded mr-2 inline-block" />
              ))}</div>
              <div><b>Status:</b> {viewingZiarath.status}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZiarathManager;
