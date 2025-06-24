import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Package {
  id: string;
  created_at: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  category: string;
  inclusions: string[];
  exclusions: string[];
  terms_conditions: string;
  images: string[];
  featured_image: string;
  status: string;
  max_capacity: number; // Changed from string to number to match database
  min_participants: number; // Changed from string to number to match database
  available_spots: number; // Changed from string to number to match database
  departure_date: string;
  return_date: string;
  booking_deadline: string;
  package_type: string;
  package_category: string;
  cities_covered: string[];
  activities: string[];
  flight_included: boolean;
  meal_plan: string;
  pricing: any;
  flight_details: any;
  makkah_hotel: any;
  madinah_hotel: any;
  itinerary: any;
  category_id: string;
  is_group_package: boolean;
  room_type_pricing: any;
  updated_at: string;
}

interface FormState {
  id?: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  category: string;
  inclusions: string;
  exclusions: string;
  terms_conditions: string;
  images: string;
  featured_image: string;
  status: string;
  max_capacity: string;
  min_participants: string;
  available_spots: string;
  departure_date: string;
  return_date: string;
  booking_deadline: string;
  package_type: string;
  package_category: string;
  cities_covered: string;
  activities: string;
  flight_included: boolean;
  meal_plan: string;
}

const packageStatuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const PackageManager = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [form, setForm] = useState<FormState>({
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
    min_participants: '',
    available_spots: '',
    departure_date: '',
    return_date: '',
    booking_deadline: '',
    package_type: '',
    package_category: '',
    cities_covered: '',
    activities: '',
    flight_included: false,
    meal_plan: '',
  });

  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('type', 'package');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
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
      min_participants: '',
      available_spots: '',
      departure_date: '',
      return_date: '',
      booking_deadline: '',
      package_type: '',
      package_category: '',
      cities_covered: '',
      activities: '',
      flight_included: false,
      meal_plan: '',
    });
  };

  const openCreateDialog = () => {
    setEditingPackage(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (packageItem: Package) => {
    setEditingPackage(packageItem);
    setForm({
      id: packageItem.id,
      name: packageItem.name,
      duration: packageItem.duration,
      price: packageItem.price.toString(),
      description: packageItem.description,
      category: packageItem.category,
      inclusions: Array.isArray(packageItem.inclusions) ? packageItem.inclusions.join('\n') : '',
      exclusions: Array.isArray(packageItem.exclusions) ? packageItem.exclusions.join('\n') : '',
      terms_conditions: packageItem.terms_conditions,
      images: Array.isArray(packageItem.images) ? packageItem.images.join('\n') : '',
      featured_image: packageItem.featured_image,
      status: packageItem.status,
      max_capacity: packageItem.max_capacity?.toString() || '', // Convert number to string
      min_participants: packageItem.min_participants?.toString() || '', // Convert number to string
      available_spots: packageItem.available_spots?.toString() || '', // Convert number to string
      departure_date: packageItem.departure_date,
      return_date: packageItem.return_date,
      booking_deadline: packageItem.booking_deadline,
      package_type: packageItem.package_type,
      package_category: packageItem.package_category,
      cities_covered: Array.isArray(packageItem.cities_covered) ? packageItem.cities_covered.join('\n') : '',
      activities: Array.isArray(packageItem.activities) ? packageItem.activities.join('\n') : '',
      flight_included: packageItem.flight_included,
      meal_plan: packageItem.meal_plan,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const inclusionsArray = form.inclusions.split('\n').map(item => item.trim()).filter(item => item !== '');
      const exclusionsArray = form.exclusions.split('\n').map(item => item.trim()).filter(item => item !== '');
      const imagesArray = form.images.split('\n').map(item => item.trim()).filter(item => item !== '');
      const citiesCoveredArray = form.cities_covered.split('\n').map(item => item.trim()).filter(item => item !== '');
      const activitiesArray = form.activities.split('\n').map(item => item.trim()).filter(item => item !== '');

      const packageData = {
        name: form.name,
        duration: form.duration,
        price: parseFloat(form.price),
        description: form.description,
        category: form.category,
        inclusions: inclusionsArray,
        exclusions: exclusionsArray,
        terms_conditions: form.terms_conditions,
        images: imagesArray,
        featured_image: form.featured_image,
        status: form.status,
        max_capacity: parseInt(form.max_capacity),
        min_participants: parseInt(form.min_participants),
        available_spots: parseInt(form.available_spots),
        departure_date: form.departure_date,
        return_date: form.return_date,
        booking_deadline: form.booking_deadline,
        package_type: form.package_type,
        package_category: form.package_category,
        cities_covered: citiesCoveredArray,
        activities: activitiesArray,
        flight_included: form.flight_included,
        meal_plan: form.meal_plan,
      };

      if (editingPackage) {
        // Update existing package
        const { error } = await supabase
          .from('umrah_packages')
          .update(packageData)
          .eq('id', editingPackage.id);

        if (error) throw error;
        toast.success('Package updated successfully!');
      } else {
        // Create new package
        const { error } = await supabase
          .from('umrah_packages')
          .insert([packageData]);

        if (error) throw error;
        toast.success('Package created successfully!');
      }

      fetchPackages();
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving package:', error);
      toast.error(`Failed to save package: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      const { error } = await supabase
        .from('umrah_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Package deleted successfully!');
      fetchPackages();
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast.error(`Failed to delete package: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={openCreateDialog}>Add Package</Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPackage ? 'Edit Package' : 'Create Package'}</DialogTitle>
                <DialogDescription>
                  {editingPackage ? 'Edit the details of this package.' : 'Fill in the details to create a new package.'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      type="text"
                      id="duration"
                      name="duration"
                      value={form.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))} defaultValue={form.category}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inclusions">Inclusions (one per line)</Label>
                    <Textarea
                      id="inclusions"
                      name="inclusions"
                      value={form.inclusions}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exclusions">Exclusions (one per line)</Label>
                    <Textarea
                      id="exclusions"
                      name="exclusions"
                      value={form.exclusions}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                  <Textarea
                    id="terms_conditions"
                    name="terms_conditions"
                    value={form.terms_conditions}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="images">Images (one per line)</Label>
                    <Textarea
                      id="images"
                      name="images"
                      value={form.images}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="featured_image">Featured Image URL</Label>
                    <Input
                      type="text"
                      id="featured_image"
                      name="featured_image"
                      value={form.featured_image}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => setForm(prev => ({ ...prev, status: value }))} defaultValue={form.status}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        {packageStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="max_capacity">Max Capacity</Label>
                    <Input
                      type="number"
                      id="max_capacity"
                      name="max_capacity"
                      value={form.max_capacity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_participants">Min Participants</Label>
                    <Input
                      type="number"
                      id="min_participants"
                      name="min_participants"
                      value={form.min_participants}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="available_spots">Available Spots</Label>
                    <Input
                      type="number"
                      id="available_spots"
                      name="available_spots"
                      value={form.available_spots}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="departure_date">Departure Date</Label>
                    <Input
                      type="date"
                      id="departure_date"
                      name="departure_date"
                      value={form.departure_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="return_date">Return Date</Label>
                    <Input
                      type="date"
                      id="return_date"
                      name="return_date"
                      value={form.return_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="booking_deadline">Booking Deadline</Label>
                    <Input
                      type="date"
                      id="booking_deadline"
                      name="booking_deadline"
                      value={form.booking_deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="package_type">Package Type</Label>
                    <Input
                      type="text"
                      id="package_type"
                      name="package_type"
                      value={form.package_type}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="package_category">Package Category</Label>
                    <Input
                      type="text"
                      id="package_category"
                      name="package_category"
                      value={form.package_category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cities_covered">Cities Covered (one per line)</Label>
                    <Textarea
                      id="cities_covered"
                      name="cities_covered"
                      value={form.cities_covered}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="activities">Activities (one per line)</Label>
                  <Textarea
                    id="activities"
                    name="activities"
                    value={form.activities}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="flight_included"
                    name="flight_included"
                    checked={form.flight_included}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="flight_included">Flight Included</Label>
                </div>

                <div>
                  <Label htmlFor="meal_plan">Meal Plan</Label>
                  <Input
                    type="text"
                    id="meal_plan"
                    name="meal_plan"
                    value={form.meal_plan}
                    onChange={handleInputChange}
                  />
                </div>

                <Button type="submit">{editingPackage ? 'Update Package' : 'Create Package'}</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading packages...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {packages.map((packageItem) => (
                    <tr key={packageItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{packageItem.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${packageItem.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={packageItem.status === 'published' ? 'default' : 'secondary'}>{packageItem.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(packageItem)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(packageItem.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageManager;
