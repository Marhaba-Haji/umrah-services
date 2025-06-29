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

interface ZiarathService {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  description: string;
  ziarath_type: 'makkah_ziarath' | 'madinah_ziarath' | 'taif_ziarath' | 'badr_ziarath' | 'jeddah_ziarath';
  significance: string;
  historical_importance: string;
  best_time: string;
  inclusions: string[];
  images: string[];
  max_participants: number;
  guide_id: string;
  status: string;
  vehicle_prices: { [vehicleId: string]: number };
}

const ZiarathManager = () => {
  const [services, setServices] = useState<ZiarathService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ZiarathService>>({
    title: '',
    location: '',
    duration: '',
    price: 0,
    description: '',
    ziarath_type: 'makkah_ziarath',
    significance: '',
    historical_importance: '',
    best_time: '',
    inclusions: [],
    images: [],
    max_participants: 0,
    guide_id: '',
    status: 'active',
    vehicle_prices: {}
  });

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('ziarath_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(service => ({
        ...service,
        vehicle_prices: typeof service.vehicle_prices === 'object' 
          ? service.vehicle_prices as { [vehicleId: string]: number }
          : {}
      })) || [];
      
      setServices(formattedData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch ziarath services');
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

  if (loading) {
    return <div className="flex justify-center p-8">Loading ziarath services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ziarath Services Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Ziarath Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ZiarathForm
              data={formData}
              onChange={setFormData}
              onSave={handleSave}
              onCancel={() => {
                setShowAddForm(false);
                setFormData({
                  title: '',
                  location: '',
                  duration: '',
                  price: 0,
                  description: '',
                  ziarath_type: 'makkah_ziarath',
                  significance: '',
                  historical_importance: '',
                  best_time: '',
                  inclusions: [],
                  images: [],
                  max_participants: 0,
                  guide_id: '',
                  status: 'active',
                  vehicle_prices: {}
                });
              }}
            />
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{service.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge>{service.ziarath_type?.replace('_', ' ') || 'Unknown'}</Badge>
                  <Badge variant="outline">₹{service.price}</Badge>
                  <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditMode(service.id);
                    setFormData({
                      id: service.id,
                      title: service.title,
                      location: service.location,
                      duration: service.duration,
                      price: service.price,
                      description: service.description,
                      ziarath_type: service.ziarath_type,
                      significance: service.significance,
                      historical_importance: service.historical_importance,
                      best_time: service.best_time,
                      inclusions: service.inclusions,
                      images: service.images,
                      max_participants: service.max_participants,
                      guide_id: service.guide_id,
                      status: service.status,
                      vehicle_prices: service.vehicle_prices
                    });
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            {editMode === service.id && (
              <CardContent>
                <ZiarathForm
                  data={formData}
                  onChange={setFormData}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditMode(null);
                    setFormData({
                      title: '',
                      location: '',
                      duration: '',
                      price: 0,
                      description: '',
                      ziarath_type: 'makkah_ziarath',
                      significance: '',
                      historical_importance: '',
                      best_time: '',
                      inclusions: [],
                      images: [],
                      max_participants: 0,
                      guide_id: '',
                      status: 'active',
                      vehicle_prices: {}
                    });
                  }}
                />
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  async function handleSave(data: Partial<ZiarathService>) {
    try {
      if (data.id) {
        const { error } = await supabase
          .from('ziarath_services')
          .update(data)
          .eq('id', data.id);

        if (error) throw error;
        toast.success('Ziarath service updated successfully');
      } else {
        const { error } = await supabase
          .from('ziarath_services')
          .insert([data]);

        if (error) throw error;
        toast.success('Ziarath service created successfully');
      }

      await fetchServices();
      setShowAddForm(false);
      setEditMode(null);
      setFormData({
        title: '',
        location: '',
        duration: '',
        price: 0,
        description: '',
        ziarath_type: 'makkah_ziarath',
        significance: '',
        historical_importance: '',
        best_time: '',
        inclusions: [],
        images: [],
        max_participants: 0,
        guide_id: '',
        status: 'active',
        vehicle_prices: {}
      });
    } catch (error) {
      console.error('Error saving ziarath service:', error);
      toast.error('Failed to save ziarath service');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this ziarath service?')) return;

    try {
      const { error } = await supabase
        .from('ziarath_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Ziarath service deleted successfully');
      await fetchServices();
    } catch (error) {
      console.error('Error deleting ziarath service:', error);
      toast.error('Failed to delete ziarath service');
    }
  }
};

interface ZiarathFormProps {
  data: Partial<ZiarathService>;
  onChange: (data: Partial<ZiarathService>) => void;
  onSave: (data: Partial<ZiarathService>) => void;
  onCancel: () => void;
}

const ZiarathForm: React.FC<ZiarathFormProps> = ({
  data,
  onChange,
  onSave,
  onCancel,
}) => {
  const handleChange = (field: keyof ZiarathService, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          value={data.duration || ''}
          onChange={(e) => handleChange('duration', e.target.value)}
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
        <Label htmlFor="ziarath_type">Ziarath Type</Label>
        <Select
          value={data.ziarath_type || 'makkah_ziarath'}
          onValueChange={(value: 'makkah_ziarath' | 'madinah_ziarath' | 'taif_ziarath' | 'badr_ziarath' | 'jeddah_ziarath') =>
            handleChange('ziarath_type', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="makkah_ziarath">Makkah Ziarath</SelectItem>
            <SelectItem value="madinah_ziarath">Madinah Ziarath</SelectItem>
            <SelectItem value="taif_ziarath">Taif Ziarath</SelectItem>
            <SelectItem value="badr_ziarath">Badr Ziarath</SelectItem>
            <SelectItem value="jeddah_ziarath">Jeddah Ziarath</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="max_participants">Max Participants</Label>
        <Input
          id="max_participants"
          type="number"
          value={data.max_participants || 0}
          onChange={(e) => handleChange('max_participants', Number(e.target.value))}
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

      <div className="md:col-span-2 flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={() => onSave(data)}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default ZiarathManager;
