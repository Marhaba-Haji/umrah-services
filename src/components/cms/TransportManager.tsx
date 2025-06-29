
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
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';

interface TransportService {
  id: string;
  route: string;
  vehicle_type: 'sedan' | 'suv' | 'minivan' | 'bus' | 'van';
  capacity: number;
  price: number;
  description: string;
  vehicle_name: string;
  vehicle_image: string;
  features: string[];
  is_ac: boolean;
  is_active: boolean;
  trip_duration: string;
  trip_distance: string;
  driver_name: string;
  driver_contact: string;
  luggage_capacity: string;
  vehicle_details: Record<string, any>;
}

const TransportManager = () => {
  const [services, setServices] = useState<TransportService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<TransportService>>({
    route: '',
    vehicle_type: 'sedan',
    capacity: 4,
    price: 0,
    description: '',
    vehicle_name: '',
    vehicle_image: '',
    features: [],
    is_ac: true,
    is_active: true,
    trip_duration: '',
    trip_distance: '',
    driver_name: '',
    driver_contact: '',
    luggage_capacity: '',
    vehicle_details: {}
  });

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(service => ({
        id: service.id,
        route: service.route,
        vehicle_type: service.vehicle_type as 'sedan' | 'suv' | 'minivan' | 'bus' | 'van',
        capacity: service.capacity,
        price: service.price,
        description: service.description || '',
        vehicle_name: service.vehicle_name || '',
        vehicle_image: service.vehicle_image || '',
        features: service.features || [],
        is_ac: service.is_ac ?? true,
        is_active: service.is_active ?? true,
        trip_duration: service.trip_duration || '',
        trip_distance: service.trip_distance || '',
        driver_name: service.driver_name || '',
        driver_contact: service.driver_contact || '',
        luggage_capacity: service.luggage_capacity || '',
        vehicle_details: typeof service.vehicle_details === 'object' ? service.vehicle_details as Record<string, any> : {}
      })) || [];
      
      setServices(formattedData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch transport services');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchServices();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleImageUpload = async (file: File, field: 'vehicle_image') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `transport/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('transport-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('transport-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, [field]: data.publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading transport services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transport Services Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Transport Service</CardTitle>
          </CardHeader>
          <CardContent>
            <TransportForm
              data={formData}
              onChange={setFormData}
              onSave={async (data) => {
                try {
                  const { error } = await supabase
                    .from('transport_services')
                    .insert([data]);

                  if (error) throw error;
                  toast.success('Transport service created successfully');
                  await fetchServices();
                  setShowAddForm(false);
                  setFormData({
                    route: '',
                    vehicle_type: 'sedan',
                    capacity: 4,
                    price: 0,
                    description: '',
                    vehicle_name: '',
                    vehicle_image: '',
                    features: [],
                    is_ac: true,
                    is_active: true,
                    trip_duration: '',
                    trip_distance: '',
                    driver_name: '',
                    driver_contact: '',
                    luggage_capacity: '',
                    vehicle_details: {}
                  });
                } catch (error) {
                  console.error('Error creating transport service:', error);
                  toast.error('Failed to create transport service');
                }
              }}
              onCancel={() => setShowAddForm(false)}
              onImageUpload={handleImageUpload}
            />
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{service.vehicle_name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge>{service.vehicle_type}</Badge>
                  <Badge variant="outline">₹{service.price}</Badge>
                  <Badge variant={service.is_active ? 'default' : 'secondary'}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface TransportFormProps {
  data: Partial<TransportService>;
  onChange: (data: Partial<TransportService>) => void;
  onSave: (data: Partial<TransportService>) => Promise<void>;
  onCancel: () => void;
  onImageUpload: (file: File, field: 'vehicle_image') => Promise<void>;
}

const TransportForm: React.FC<TransportFormProps> = ({
  data,
  onChange,
  onSave,
  onCancel,
  onImageUpload
}) => {
  const handleChange = (field: keyof TransportService, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const featuresArray = value.split(',').map(item => item.trim());
    handleChange('features', featuresArray);
  };

  const handleVehicleDetailsChange = (field: string, value: any) => {
    const updatedDetails = { ...data.vehicle_details, [field]: value };
    handleChange('vehicle_details', updatedDetails);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="route">Route</Label>
        <Input
          id="route"
          value={data.route || ''}
          onChange={(e) => handleChange('route', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="vehicle_type">Vehicle Type</Label>
        <Select value={data.vehicle_type || 'sedan'} onValueChange={(value: 'sedan' | 'suv' | 'minivan' | 'bus' | 'van') => handleChange('vehicle_type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="bus">Bus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          type="number"
          value={data.capacity || 4}
          onChange={(e) => handleChange('capacity', Number(e.target.value))}
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

      <div className="md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="vehicle_name">Vehicle Name</Label>
        <Input
          id="vehicle_name"
          value={data.vehicle_name || ''}
          onChange={(e) => handleChange('vehicle_name', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="vehicle_image">Vehicle Image</Label>
        <Input
          type="file"
          id="vehicle_image"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImageUpload(file, 'vehicle_image');
            }
          }}
        />
        {data.vehicle_image && (
          <img src={data.vehicle_image} alt="Vehicle" className="mt-2 max-h-32" />
        )}
      </div>

      <div>
        <Label htmlFor="features">Features (comma separated)</Label>
        <Textarea
          id="features"
          value={(data.features || []).join(', ')}
          onChange={handleFeaturesChange}
        />
      </div>

      <div>
        <Label htmlFor="is_ac">Is AC</Label>
        <Select value={data.is_ac === true ? 'true' : 'false'} onValueChange={(value) => handleChange('is_ac', value === 'true')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="is_active">Is Active</Label>
        <Select value={data.is_active === true ? 'true' : 'false'} onValueChange={(value) => handleChange('is_active', value === 'true')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="trip_duration">Trip Duration</Label>
        <Input
          id="trip_duration"
          value={data.trip_duration || ''}
          onChange={(e) => handleChange('trip_duration', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="trip_distance">Trip Distance</Label>
        <Input
          id="trip_distance"
          value={data.trip_distance || ''}
          onChange={(e) => handleChange('trip_distance', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="driver_name">Driver Name</Label>
        <Input
          id="driver_name"
          value={data.driver_name || ''}
          onChange={(e) => handleChange('driver_name', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="driver_contact">Driver Contact</Label>
        <Input
          id="driver_contact"
          value={data.driver_contact || ''}
          onChange={(e) => handleChange('driver_contact', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="luggage_capacity">Luggage Capacity</Label>
        <Input
          id="luggage_capacity"
          value={data.luggage_capacity || ''}
          onChange={(e) => handleChange('luggage_capacity', e.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <Label>Vehicle Details</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label htmlFor="fuel_type">Fuel Type</Label>
            <Input
              id="fuel_type"
              value={data.vehicle_details?.fuel_type || ''}
              onChange={(e) => handleVehicleDetailsChange('fuel_type', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="transmission">Transmission</Label>
            <Input
              id="transmission"
              value={data.vehicle_details?.transmission || ''}
              onChange={(e) => handleVehicleDetailsChange('transmission', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="model_year">Model Year</Label>
            <Input
              id="model_year"
              type="number"
              value={data.vehicle_details?.model_year || ''}
              onChange={(e) => handleVehicleDetailsChange('model_year', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={data.vehicle_details?.color || ''}
              onChange={(e) => handleVehicleDetailsChange('color', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={() => onSave(data)}>
          <Save className="w-4 h-4 mr-2" />
          Save Service
        </Button>
      </div>
    </div>
  );
};

export default TransportManager;
