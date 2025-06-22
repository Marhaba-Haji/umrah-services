
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

interface Package {
  id: number;
  name: string;
  price: string;
  duration: string;
  status: string;
  description: string;
  includes: string[];
  category: string;
}

const PackageManager = () => {
  const [packages, setPackages] = useState<Package[]>([
    { id: 1, name: '5-Star Umrah Package', price: '$2999', duration: '14 days', status: 'Active', description: 'Luxury Umrah experience', includes: ['5-star hotel', 'VIP transport', 'Guide service'], category: 'luxury' },
    { id: 2, name: 'Economy Umrah Package', price: '$1999', duration: '10 days', status: 'Active', description: 'Affordable Umrah package', includes: ['3-star hotel', 'Group transport', 'Basic guide'], category: 'economy' },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      price: '',
      duration: '',
      status: 'Active',
      description: '',
      includes: '',
      category: 'economy'
    }
  });

  const onSubmit = (data: any) => {
    const newPackage: Package = {
      id: editingPackage ? editingPackage.id : Date.now(),
      name: data.name,
      price: data.price,
      duration: data.duration,
      status: data.status,
      description: data.description,
      includes: data.includes.split(',').map((item: string) => item.trim()),
      category: data.category
    };

    if (editingPackage) {
      setPackages(packages.map(pkg => pkg.id === editingPackage.id ? newPackage : pkg));
    } else {
      setPackages([...packages, newPackage]);
    }

    setIsDialogOpen(false);
    setEditingPackage(null);
    form.reset();
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    form.reset({
      name: pkg.name,
      price: pkg.price,
      duration: pkg.duration,
      status: pkg.status,
      description: pkg.description,
      includes: pkg.includes.join(', '),
      category: pkg.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Umrah Packages</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPackage(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter package name" {...field} />
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
                          <Input placeholder="$2999" {...field} />
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
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="14 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
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
                        <Textarea placeholder="Package description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Includes (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="5-star hotel, VIP transport, Guide service" {...field} />
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
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingPackage ? 'Update Package' : 'Create Package'}
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
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{pkg.name}</td>
                    <td className="p-2">{pkg.price}</td>
                    <td className="p-2">{pkg.duration}</td>
                    <td className="p-2">
                      <Badge variant="outline">{pkg.category}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={pkg.status === 'Active' ? 'default' : 'secondary'}>
                        {pkg.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(pkg.id)}>
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

export default PackageManager;
