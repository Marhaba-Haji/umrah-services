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
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

interface SaudiVisa {
  id: number;
  visaType: string;
  visaCategory: string;
  price: string;
  processingTime: string;
  visaValidity: string;
  stayValidity: string;
  numberOfEntries: string;
  requirements: string[];
  description: string;
  status: string;
}

const SaudiVisasManager = () => {
  const [visas, setVisas] = useState<SaudiVisa[]>([
    { 
      id: 1, 
      visaType: 'Umrah Visa', 
      visaCategory: 'Basic',
      price: '$120', 
      processingTime: '3-5 days',
      visaValidity: '30 days',
      stayValidity: '15 days',
      numberOfEntries: 'Single',
      requirements: ['Passport', 'Photo', 'Vaccination Certificate'],
      description: 'Basic Umrah visa for pilgrimage',
      status: 'Active'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<SaudiVisa | null>(null);

  const form = useForm({
    defaultValues: {
      visaType: '',
      visaCategory: '',
      price: '',
      processingTime: '',
      visaValidity: '',
      stayValidity: '',
      numberOfEntries: '',
      requirements: '',
      description: '',
      status: 'Active'
    }
  });

  const onSubmit = (data: any) => {
    const newVisa: SaudiVisa = {
      id: editingVisa ? editingVisa.id : Date.now(),
      visaType: data.visaType,
      visaCategory: data.visaCategory,
      price: data.price,
      processingTime: data.processingTime,
      visaValidity: data.visaValidity,
      stayValidity: data.stayValidity,
      numberOfEntries: data.numberOfEntries,
      requirements: data.requirements.split(',').map((req: string) => req.trim()),
      description: data.description,
      status: data.status
    };

    if (editingVisa) {
      setVisas(visas.map(visa => visa.id === editingVisa.id ? newVisa : visa));
    } else {
      setVisas([...visas, newVisa]);
    }

    setIsDialogOpen(false);
    setEditingVisa(null);
    form.reset();
  };

  const handleEdit = (visa: SaudiVisa) => {
    setEditingVisa(visa);
    form.reset({
      visaType: visa.visaType,
      visaCategory: visa.visaCategory,
      price: visa.price,
      processingTime: visa.processingTime,
      visaValidity: visa.visaValidity,
      stayValidity: visa.stayValidity,
      numberOfEntries: visa.numberOfEntries,
      requirements: visa.requirements.join(', '),
      description: visa.description,
      status: visa.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setVisas(visas.filter(visa => visa.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Saudi Visas Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingVisa(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Visa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVisa ? 'Edit Saudi Visa' : 'Add New Saudi Visa'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="visaType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visa Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visa type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Umrah Visa">Umrah Visa</SelectItem>
                            <SelectItem value="Tourist Visa">Tourist Visa</SelectItem>
                            <SelectItem value="Business Visa">Business Visa</SelectItem>
                            <SelectItem value="Family Visit Visa">Family Visit Visa</SelectItem>
                            <SelectItem value="Student Visa">Student Visa</SelectItem>
                            <SelectItem value="Job Waqala">Job Waqala</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="visaCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visa Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Express">Express</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="$120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="processingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Processing Time</FormLabel>
                        <FormControl>
                          <Input placeholder="3-5 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="visaValidity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visa Validity</FormLabel>
                        <FormControl>
                          <Input placeholder="30 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stayValidity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stay Validity</FormLabel>
                        <FormControl>
                          <Input placeholder="15 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfEntries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Entries</FormLabel>
                        <FormControl>
                          <Input placeholder="Single / Multiple" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Passport, Photo, Vaccination Certificate" {...field} />
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
                        <Textarea placeholder="Visa description" {...field} />
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
                          <SelectItem value="Suspended">Suspended</SelectItem>
                          <SelectItem value="Discontinued">Discontinued</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingVisa ? 'Update Visa' : 'Create Visa'}
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
                  <th className="text-left p-2">Visa Type</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Processing Time</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visas.map(visa => (
                  <tr key={visa.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{visa.visaType}</div>
                        <div className="text-sm text-gray-500">Valid for {visa.visaValidity}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{visa.visaCategory}</Badge>
                    </td>
                    <td className="p-2">{visa.price}</td>
                    <td className="p-2">{visa.processingTime}</td>
                    <td className="p-2">
                      <Badge variant={visa.status === 'Active' ? 'default' : 'secondary'}>
                        {visa.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(visa)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(visa.id)}>
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

export default SaudiVisasManager;
