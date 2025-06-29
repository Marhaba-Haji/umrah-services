
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

// Use the actual database types from the schema
interface UmrahPackage {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  status: 'draft' | 'published' | 'archived';
  category: string;
  category_id: string;
  inclusions: string[];
  exclusions: string[];
  images: string[];
  featured_image: string;
  terms_conditions: string;
  max_capacity: number;
  available_spots: number;
  departure_date: string;
  return_date: string;
  booking_deadline: string;
  is_group_package: boolean;
  package_type: string;
  package_category: string;
  meal_plan: string;
  season_category: string;
  currency: string;
  cities_covered: string[];
  activities: string[];
  flight_details: any;
  flight_included: boolean;
  min_participants: number;
  itinerary: any;
  makkah_hotel: any;
  madinah_hotel: any;
  hotels: any;
  pricing: any;
  room_type_pricing: any;
  seo: any;
  created_at: string;
  updated_at: string;
}

const PackageManager = () => {
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [hotels, setHotels] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<UmrahPackage>>({
    name: '',
    description: '',
    duration: '',
    price: 0,
    status: 'draft',
    category: '',
    category_id: '',
    inclusions: [],
    exclusions: [],
    images: [],
    featured_image: '',
    terms_conditions: '',
    max_capacity: 0,
    available_spots: 0,
    departure_date: '',
    return_date: '',
    booking_deadline: '',
    is_group_package: false,
    package_type: '',
    package_category: '',
    meal_plan: '',
    season_category: '',
    currency: 'INR',
    cities_covered: [],
    activities: [],
    flight_details: {},
    flight_included: false,
    min_participants: 1,
    itinerary: {},
    makkah_hotel: {},
    madinah_hotel: {},
    hotels: {},
    pricing: {},
    room_type_pricing: {},
    seo: {}
  });

  const fetchPackages = async () => {
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
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPackages(), fetchCategories(), fetchHotels()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async (packageData: Partial<UmrahPackage>) => {
    try {
      const dataToSave = {
        ...packageData,
        price: Number(packageData.price),
        max_capacity: Number(packageData.max_capacity),
        available_spots: Number(packageData.available_spots),
        min_participants: Number(packageData.min_participants),
        departure_date: packageData.departure_date || null,
        return_date: packageData.return_date || null,
        booking_deadline: packageData.booking_deadline || null
      };

      if (packageData.id) {
        const { error } = await supabase
          .from('umrah_packages')
          .update(dataToSave)
          .eq('id', packageData.id);

        if (error) throw error;
        toast.success('Package updated successfully');
      } else {
        const { error } = await supabase
          .from('umrah_packages')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Package created successfully');
      }

      await fetchPackages();
      setEditMode(null);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const { error } = await supabase
        .from('umrah_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Package deleted successfully');
      await fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const handleEdit = (pkg: UmrahPackage) => {
    setFormData({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || '',
      duration: pkg.duration,
      price: pkg.price,
      status: pkg.status,
      category: pkg.category || '',
      category_id: pkg.category_id || '',
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      images: pkg.images || [],
      featured_image: pkg.featured_image || '',
      terms_conditions: pkg.terms_conditions || '',
      max_capacity: pkg.max_capacity || 0,
      available_spots: pkg.available_spots || 0,
      departure_date: pkg.departure_date || '',
      return_date: pkg.return_date || '',
      booking_deadline: pkg.booking_deadline || '',
      is_group_package: pkg.is_group_package || false,
      package_type: pkg.package_type || '',
      package_category: pkg.package_category || '',
      meal_plan: pkg.meal_plan || '',
      season_category: pkg.season_category || '',
      currency: pkg.currency || 'INR',
      cities_covered: pkg.cities_covered || [],
      activities: pkg.activities || [],
      flight_details: pkg.flight_details || {},
      flight_included: pkg.flight_included || false,
      min_participants: pkg.min_participants || 1,
      itinerary: pkg.itinerary || {},
      makkah_hotel: pkg.makkah_hotel || {},
      madinah_hotel: pkg.madinah_hotel || {},
      hotels: pkg.hotels || {},
      pricing: pkg.pricing || {},
      room_type_pricing: pkg.room_type_pricing || {},
      seo: pkg.seo || {}
    });
    setEditMode(pkg.id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      price: 0,
      status: 'draft',
      category: '',
      category_id: '',
      inclusions: [],
      exclusions: [],
      images: [],
      featured_image: '',
      terms_conditions: '',
      max_capacity: 0,
      available_spots: 0,
      departure_date: '',
      return_date: '',
      booking_deadline: '',
      is_group_package: false,
      package_type: '',
      package_category: '',
      meal_plan: '',
      season_category: '',
      currency: 'INR',
      cities_covered: [],
      activities: [],
      flight_details: {},
      flight_included: false,
      min_participants: 1,
      itinerary: {},
      makkah_hotel: {},
      madinah_hotel: {},
      hotels: {},
      pricing: {},
      room_type_pricing: {},
      seo: {}
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Package</CardTitle>
          </CardHeader>
          <CardContent>
            <PackageForm
              data={formData}
              onChange={setFormData}
              onSave={handleSave}
              onCancel={() => {
                setShowAddForm(false);
                resetForm();
              }}
              categories={categories}
              hotels={hotels}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{pkg.name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant={pkg.status === 'published' ? 'default' : 'secondary'}>
                    {pkg.status}
                  </Badge>
                  <Badge variant="outline">{pkg.duration}</Badge>
                  <Badge variant="outline">{pkg.currency} {pkg.price}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(pkg)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(pkg.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            {editMode === pkg.id && (
              <CardContent>
                <PackageForm
                  data={formData}
                  onChange={setFormData}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditMode(null);
                    resetForm();
                  }}
                  categories={categories}
                  hotels={hotels}
                />
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

interface PackageFormProps {
  data: Partial<UmrahPackage>;
  onChange: (data: Partial<UmrahPackage>) => void;
  onSave: (data: Partial<UmrahPackage>) => void;
  onCancel: () => void;
  categories: { id: string; name: string }[];
  hotels: { id: string; name: string }[];
}

const PackageForm: React.FC<PackageFormProps> = ({
  data,
  onChange,
  onSave,
  onCancel,
  categories,
  hotels
}) => {
  const handleChange = (field: keyof UmrahPackage, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Package Name</Label>
        <Input
          id="name"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          value={data.duration || ''}
          onChange={(e) => handleChange('duration', e.target.value)}
          placeholder="e.g., 10 Days 9 Nights"
        />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={data.price || 0}
          onChange={(e) => handleChange('price', Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="currency">Currency</Label>
        <Select value={data.currency || 'INR'} onValueChange={(value) => handleChange('currency', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INR">INR</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="SAR">SAR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="max_capacity">Max Capacity</Label>
        <Input
          id="max_capacity"
          type="number"
          value={data.max_capacity || 0}
          onChange={(e) => handleChange('max_capacity', Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="available_spots">Available Spots</Label>
        <Input
          id="available_spots"
          type="number"
          value={data.available_spots || 0}
          onChange={(e) => handleChange('available_spots', Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="departure_date">Departure Date</Label>
        <Input
          id="departure_date"
          type="date"
          value={data.departure_date || ''}
          onChange={(e) => handleChange('departure_date', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="return_date">Return Date</Label>
        <Input
          id="return_date"
          type="date"
          value={data.return_date || ''}
          onChange={(e) => handleChange('return_date', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={data.status || 'draft'} onValueChange={(value: 'draft' | 'published' | 'archived') => handleChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="package_category">Package Category</Label>
        <Input
          id="package_category"
          value={data.package_category || ''}
          onChange={(e) => handleChange('package_category', e.target.value)}
        />
      </div>

      <div className="md:col-span-2 flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={() => onSave(data)}>
          <Save className="w-4 h-4 mr-2" />
          Save Package
        </Button>
      </div>
    </div>
  );
};

export default PackageManager;
