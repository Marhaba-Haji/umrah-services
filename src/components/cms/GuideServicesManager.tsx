
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
import { Eye, Edit, Trash2, Plus, User } from 'lucide-react';

interface GuideService {
  id: number;
  guideName: string;
  guidePhoto: string;
  guideCity: string;
  guideContact: string;
  serviceType: string;
  languages: string[];
  experience: string;
  rating: number;
  status: string;
  description: string;
}

const GuideServicesManager = () => {
  const [guides, setGuides] = useState<GuideService[]>([
    { 
      id: 1, 
      guideName: 'Ahmad Abdullah', 
      guidePhoto: '/placeholder.svg',
      guideCity: 'Makkah', 
      guideContact: '+966501234567', 
      serviceType: 'Umrah Guide',
      languages: ['Arabic', 'English', 'Urdu'],
      experience: '5 years',
      rating: 4.8,
      status: 'Active',
      description: 'Experienced Umrah guide with excellent knowledge of Islamic history'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideService | null>(null);

  const form = useForm({
    defaultValues: {
      guideName: '',
      guidePhoto: '',
      guideCity: '',
      guideContact: '',
      serviceType: '',
      languages: '',
      experience: '',
      rating: '',
      status: 'Active',
      description: ''
    }
  });

  const onSubmit = (data: any) => {
    const newGuide: GuideService = {
      id: editingGuide ? editingGuide.id : Date.now(),
      guideName: data.guideName,
      guidePhoto: data.guidePhoto,
      guideCity: data.guideCity,
      guideContact: data.guideContact,
      serviceType: data.serviceType,
      languages: data.languages.split(',').map((lang: string) => lang.trim()),
      experience: data.experience,
      rating: parseFloat(data.rating),
      status: data.status,
      description: data.description
    };

    if (editingGuide) {
      setGuides(guides.map(guide => guide.id === editingGuide.id ? newGuide : guide));
    } else {
      setGuides([...guides, newGuide]);
    }

    setIsDialogOpen(false);
    setEditingGuide(null);
    form.reset();
  };

  const handleEdit = (guide: GuideService) => {
    setEditingGuide(guide);
    form.reset({
      guideName: guide.guideName,
      guidePhoto: guide.guidePhoto,
      guideCity: guide.guideCity,
      guideContact: guide.guideContact,
      serviceType: guide.serviceType,
      languages: guide.languages.join(', '),
      experience: guide.experience,
      rating: guide.rating.toString(),
      status: guide.status,
      description: guide.description
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setGuides(guides.filter(guide => guide.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Guide Services Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingGuide(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingGuide ? 'Edit Guide Service' : 'Add New Guide Service'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="guideName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guide Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter guide name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="guideCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guide City</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Makkah">Makkah</SelectItem>
                            <SelectItem value="Madinah">Madinah</SelectItem>
                            <SelectItem value="Taif">Taif</SelectItem>
                            <SelectItem value="Badr">Badr</SelectItem>
                            <SelectItem value="Jeddah">Jeddah</SelectItem>
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
                    name="guideContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+966501234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Umrah Guide">Umrah Guide</SelectItem>
                            <SelectItem value="Makkah Ziarath Guide">Makkah Ziarath Guide</SelectItem>
                            <SelectItem value="Madinah Ziarath Guide">Madinah Ziarath Guide</SelectItem>
                            <SelectItem value="Taif Ziarath Guide">Taif Ziarath Guide</SelectItem>
                            <SelectItem value="Badr Ziarath Guide">Badr Ziarath Guide</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="guidePhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guide Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="Arabic, English, Urdu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="5 years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1-5)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" min="1" max="5" placeholder="4.8" {...field} />
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
                            <SelectItem value="On Leave">On Leave</SelectItem>
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
                        <Textarea placeholder="Guide description and specialties" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingGuide ? 'Update Guide' : 'Create Guide'}
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
                  <th className="text-left p-2">Guide</th>
                  <th className="text-left p-2">City</th>
                  <th className="text-left p-2">Service Type</th>
                  <th className="text-left p-2">Rating</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guides.map(guide => (
                  <tr key={guide.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center space-x-3">
                        <img src={guide.guidePhoto} alt={guide.guideName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-medium">{guide.guideName}</div>
                          <div className="text-sm text-gray-500">{guide.guideContact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{guide.guideCity}</td>
                    <td className="p-2">{guide.serviceType}</td>
                    <td className="p-2">⭐ {guide.rating}</td>
                    <td className="p-2">
                      <Badge variant={guide.status === 'Active' ? 'default' : 'secondary'}>
                        {guide.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(guide)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(guide.id)}>
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

export default GuideServicesManager;
