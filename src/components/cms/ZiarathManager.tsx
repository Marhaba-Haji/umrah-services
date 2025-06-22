
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
import { Eye, Edit, Trash2, Plus, MapPin } from 'lucide-react';

interface Ziarath {
  id: number;
  ziarathType: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  description: string;
  inclusions: string[];
  significance: string;
  bestTime: string;
  status: string;
}

const ZiarathManager = () => {
  const [ziaraths, setZiaraths] = useState<Ziarath[]>([
    { 
      id: 1, 
      ziarathType: 'Makkah Ziarath',
      title: 'Historical Sites of Makkah',
      location: 'Makkah', 
      duration: '4 hours',
      price: '$50',
      description: 'Visit the historical Islamic sites in Makkah',
      inclusions: ['Transportation', 'Guide', 'Refreshments'],
      significance: 'Birthplace of Prophet Muhammad (PBUH)',
      bestTime: 'Morning',
      status: 'Active'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZiarath, setEditingZiarath] = useState<Ziarath | null>(null);

  const form = useForm({
    defaultValues: {
      ziarathType: '',
      title: '',
      location: '',
      duration: '',
      price: '',
      description: '',
      inclusions: '',
      significance: '',
      bestTime: '',
      status: 'Active'
    }
  });

  const onSubmit = (data: any) => {
    const newZiarath: Ziarath = {
      id: editingZiarath ? editingZiarath.id : Date.now(),
      ziarathType: data.ziarathType,
      title: data.title,
      location: data.location,
      duration: data.duration,
      price: data.price,
      description: data.description,
      inclusions: data.inclusions.split(',').map((item: string) => item.trim()),
      significance: data.significance,
      bestTime: data.bestTime,
      status: data.status
    };

    if (editingZiarath) {
      setZiaraths(ziaraths.map(ziarath => ziarath.id === editingZiarath.id ? newZiarath : ziarath));
    } else {
      setZiaraths([...ziaraths, newZiarath]);
    }

    setIsDialogOpen(false);
    setEditingZiarath(null);
    form.reset();
  };

  const handleEdit = (ziarath: Ziarath) => {
    setEditingZiarath(ziarath);
    form.reset({
      ziarathType: ziarath.ziarathType,
      title: ziarath.title,
      location: ziarath.location,
      duration: ziarath.duration,
      price: ziarath.price,
      description: ziarath.description,
      inclusions: ziarath.inclusions.join(', '),
      significance: ziarath.significance,
      bestTime: ziarath.bestTime,
      status: ziarath.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setZiaraths(ziaraths.filter(ziarath => ziarath.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Ziarath Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingZiarath(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Ziarath
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingZiarath ? 'Edit Ziarath' : 'Add New Ziarath'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ziarathType"
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
                            <SelectItem value="Makkah Ziarath">Makkah Ziarath</SelectItem>
                            <SelectItem value="Madinah Ziarath">Madinah Ziarath</SelectItem>
                            <SelectItem value="Taif Ziarath">Taif Ziarath</SelectItem>
                            <SelectItem value="Badr Ziarath">Badr Ziarath</SelectItem>
                            <SelectItem value="Jeddah Ziarath">Jeddah Ziarath</SelectItem>
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
                          <Input placeholder="Specific location" {...field} />
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
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="$50" {...field} />
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
                      <FormLabel>Historical Significance</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Historical and religious significance" {...field} />
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
                          <SelectItem value="Seasonal">Seasonal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ziaraths.map(ziarath => (
                  <tr key={ziarath.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{ziarath.title}</div>
                        <div className="text-sm text-gray-500">{ziarath.location}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{ziarath.ziarathType}</Badge>
                    </td>
                    <td className="p-2">{ziarath.duration}</td>
                    <td className="p-2">{ziarath.price}</td>
                    <td className="p-2">
                      <Badge variant={ziarath.status === 'Active' ? 'default' : 'secondary'}>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZiarathManager;
