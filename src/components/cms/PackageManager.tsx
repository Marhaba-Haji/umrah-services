import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Package {
  id: string;
  created_at: string;
  name: string;
  duration: string;
  price: number; // Changed from string to number to match database
  description: string;
  category: string;
  inclusions: string;
  exclusions: string;
  terms_conditions: string;
  images: string;
  featured_image: string;
  status: string;
  max_capacity: string;
  available_spots: string;
  departure_date: string;
  return_date: string;
  booking_deadline: string;
  is_group_package: boolean;
  min_participants: string;
}

interface Category {
  id: string;
  name: string;
}

const PackageManager = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    duration: '',
    price: '',
    description: '',
    category: '',
    inclusions: '',
    exclusions: '',
    terms_conditions: '',
    images: '',
    featured_image: '',
    status: 'draft',
    max_capacity: '',
    available_spots: '',
    departure_date: '',
    return_date: '',
    booking_deadline: '',
    is_group_package: false,
    min_participants: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*');

      if (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to fetch packages');
      } else {
        setPackages(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: e }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleEdit = (packageItem: Package) => {
    setIsEditing(true);
    setSelectedPackageId(packageItem.id);
    setFormData({
      id: packageItem.id,
      name: packageItem.name,
      duration: packageItem.duration,
      price: packageItem.price.toString(), // Convert number to string for form
      description: packageItem.description,
      category: packageItem.category,
      inclusions: packageItem.inclusions,
      exclusions: packageItem.exclusions,
      terms_conditions: packageItem.terms_conditions,
      images: packageItem.images,
      featured_image: packageItem.featured_image,
      status: packageItem.status,
      max_capacity: packageItem.max_capacity,
      available_spots: packageItem.available_spots,
      departure_date: packageItem.departure_date,
      return_date: packageItem.return_date,
      booking_deadline: packageItem.booking_deadline,
      is_group_package: packageItem.is_group_package,
      min_participants: packageItem.min_participants,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const { error } = await supabase
          .from('umrah_packages')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting package:', error);
          toast.error('Failed to delete package');
        } else {
          toast.success('Package deleted successfully');
          fetchPackages();
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        toast.error('Failed to delete package');
      }
    }
  };

  const handleSave = () => {
    handleSubmit;
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPackageId(null);
    setFormData({
      id: '',
      name: '',
      duration: '',
      price: '',
      description: '',
      category: '',
      inclusions: '',
      exclusions: '',
      terms_conditions: '',
      images: '',
      featured_image: '',
      status: 'draft',
      max_capacity: '',
      available_spots: '',
      departure_date: '',
      return_date: '',
      booking_deadline: '',
      is_group_package: false,
      min_participants: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const packageData = {
        name: formData.name,
        duration: formData.duration,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        inclusions: formData.inclusions.split('\n').filter(item => item.trim()),
        exclusions: formData.exclusions.split('\n').filter(item => item.trim()),
        terms_conditions: formData.terms_conditions,
        images: formData.images.split('\n').filter(item => item.trim()),
        featured_image: formData.featured_image,
        status: formData.status as 'active' | 'inactive' | 'draft',
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity.toString()) : null,
        available_spots: formData.available_spots ? parseInt(formData.available_spots.toString()) : null,
        departure_date: formData.departure_date || null,
        return_date: formData.return_date || null,
        booking_deadline: formData.booking_deadline || null,
        is_group_package: formData.is_group_package,
        min_participants: formData.min_participants ? parseInt(formData.min_participants.toString()) : null,
      };

      if (isEditing && selectedPackageId) {
        const { data, error } = await supabase
          .from('umrah_packages')
          .update(packageData)
          .eq('id', selectedPackageId);

        if (error) {
          console.error('Error updating package:', error);
          toast.error('Failed to update package');
        } else {
          toast.success('Package updated successfully');
          setIsEditing(false);
          setSelectedPackageId(null);
          fetchPackages();
        }
      } else {
        const { data, error } = await supabase
          .from('umrah_packages')
          .insert([packageData]);

        if (error) {
          console.error('Error saving package:', error);
          toast.error('Failed to save package');
        } else {
          toast.success('Package saved successfully');
          fetchPackages();
        }
      }

      setFormData({
        id: '',
        name: '',
        duration: '',
        price: '',
        description: '',
        category: '',
        inclusions: '',
        exclusions: '',
        terms_conditions: '',
        images: '',
        featured_image: '',
        status: 'draft',
        max_capacity: '',
        available_spots: '',
        departure_date: '',
        return_date: '',
        booking_deadline: '',
        is_group_package: false,
        min_participants: '',
      });
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Package' : 'Create New Package'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(e) => handleSelectChange(e, 'category')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" defaultValue={formData.category} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_capacity">Max Capacity</Label>
                <Input type="number" id="max_capacity" name="max_capacity" value={formData.max_capacity} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="available_spots">Available Spots</Label>
                <Input type="number" id="available_spots" name="available_spots" value={formData.available_spots} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure_date">Departure Date</Label>
                <Input type="date" id="departure_date" name="departure_date" value={formData.departure_date} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="return_date">Return Date</Label>
                <Input type="date" id="return_date" name="return_date" value={formData.return_date} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="booking_deadline">Booking Deadline</Label>
              <Input type="date" id="booking_deadline" name="booking_deadline" value={formData.booking_deadline} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="is_group_package">Is Group Package</Label>
              <Input type="checkbox" id="is_group_package" name="is_group_package" checked={formData.is_group_package} onChange={handleCheckboxChange} />
            </div>

            {formData.is_group_package && (
              <div>
                <Label htmlFor="min_participants">Minimum Participants</Label>
                <Input type="number" id="min_participants" name="min_participants" value={formData.min_participants} onChange={handleChange} />
              </div>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="inclusions">Inclusions (one per line)</Label>
              <Textarea id="inclusions" name="inclusions" value={formData.inclusions} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="exclusions">Exclusions (one per line)</Label>
              <Textarea id="exclusions" name="exclusions" value={formData.exclusions} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="terms_conditions">Terms & Conditions</Label>
              <Textarea id="terms_conditions" name="terms_conditions" value={formData.terms_conditions} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="images">Images (one per line)</Label>
              <Textarea id="images" name="images" value={formData.images} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input type="text" id="featured_image" name="featured_image" value={formData.featured_image} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(e) => handleSelectChange(e, 'status')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" defaultValue={formData.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">{isEditing ? 'Update Package' : 'Create Package'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      <Card>
        <CardHeader>
          <CardTitle>Manage Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading packages...</div>
          ) : (
            <div className="grid gap-4">
              {packages.map(packageItem => (
                <Card key={packageItem.id}>
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{packageItem.name}</h3>
                      <p className="text-sm text-gray-500">{packageItem.duration} | ${packageItem.price}</p>
                      <Badge className="mt-2">{packageItem.status}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(packageItem)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(packageItem.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageManager;
