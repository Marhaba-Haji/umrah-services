
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DatabasePackage {
  id?: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  status: 'draft' | 'active' | 'inactive';
  category: string;
  inclusions: string[];
  exclusions: string[];
  images: string[];
  makkah_hotel: any;
  madinah_hotel: any;
  flight_details: any;
  itinerary: any;
  pricing: any;
}

interface FormPackage {
  name: string;
  description: string;
  duration: string;
  price: number;
  status: 'draft' | 'published' | 'archived';
  category: string;
  inclusions: string[];
  exclusions: string[];
  images: string[];
  makkah_hotel: any;
  madinah_hotel: any;
  flight_details: any;
  itinerary: any;
  pricing: any;
}

const PackageManager = () => {
  const [packages, setPackages] = useState<DatabasePackage[]>([]);
  const [editingPackage, setEditingPackage] = useState<DatabasePackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormPackage>({
    name: '',
    description: '',
    duration: '',
    price: 0,
    status: 'draft',
    category: '',
    inclusions: [],
    exclusions: [],
    images: [],
    makkah_hotel: null,
    madinah_hotel: null,
    flight_details: null,
    itinerary: null,
    pricing: null
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormPackage, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const convertFormToDatabase = (formPackage: FormPackage): Omit<DatabasePackage, 'id'> => {
    const statusMap: Record<FormPackage['status'], DatabasePackage['status']> = {
      'draft': 'draft',
      'published': 'active',
      'archived': 'inactive'
    };

    return {
      ...formPackage,
      status: statusMap[formPackage.status]
    };
  };

  const convertDatabaseToForm = (dbPackage: DatabasePackage): FormPackage => {
    const statusMap: Record<DatabasePackage['status'], FormPackage['status']> = {
      'draft': 'draft',
      'active': 'published',
      'inactive': 'archived'
    };

    return {
      ...dbPackage,
      status: statusMap[dbPackage.status]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dbData = convertFormToDatabase(formData);
      
      if (editingPackage?.id) {
        const { error } = await supabase
          .from('umrah_packages')
          .update(dbData)
          .eq('id', editingPackage.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Package updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('umrah_packages')
          .insert([dbData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Package created successfully",
        });
      }

      resetForm();
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      price: 0,
      status: 'draft',
      category: '',
      inclusions: [],
      exclusions: [],
      images: [],
      makkah_hotel: null,
      madinah_hotel: null,
      flight_details: null,
      itinerary: null,
      pricing: null
    });
    setEditingPackage(null);
  };

  const handleEdit = (pkg: DatabasePackage) => {
    setEditingPackage(pkg);
    setFormData(convertDatabaseToForm(pkg));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const { error } = await supabase
        .from('umrah_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Manager</h2>
        <Button onClick={resetForm}>Add New Package</Button>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList>
          <TabsTrigger value="form">Package Form</TabsTrigger>
          <TabsTrigger value="list">Package List</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Package Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
                  </Button>
                  {editingPackage && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Existing Packages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading packages...</div>
              ) : packages.length === 0 ? (
                <div>No packages found</div>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{pkg.name}</h3>
                          <p className="text-sm text-gray-600">{pkg.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{pkg.duration}</Badge>
                            <Badge variant="outline">${pkg.price}</Badge>
                            <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                              {pkg.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => pkg.id && handleDelete(pkg.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PackageManager;
