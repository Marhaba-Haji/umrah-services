
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

interface SaudiVisa {
  id: string;
  visa_type: string;
  visa_category: string;
  price: number;
  processing_time: string;
  visa_validity: string;
  stay_validity: string;
  number_of_entries: string;
  requirements: string[];
  description: string;
  status: 'active' | 'suspended' | 'discontinued';
  approval_rate: number;
}

const SaudiVisasManager = () => {
  const [visas, setVisas] = useState<SaudiVisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<SaudiVisa>>({
    visa_type: '',
    visa_category: '',
    price: 0,
    processing_time: '',
    visa_validity: '',
    stay_validity: '',
    number_of_entries: '',
    requirements: [],
    description: '',
    status: 'active',
    approval_rate: 0
  });

  const fetchVisas = async () => {
    try {
      const { data, error } = await supabase
        .from('saudi_visas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(visa => ({
        id: visa.id,
        visa_type: visa.visa_type,
        visa_category: visa.visa_category,
        price: visa.price,
        processing_time: visa.processing_time,
        visa_validity: visa.visa_validity,
        stay_validity: visa.stay_validity,
        number_of_entries: visa.number_of_entries,
        requirements: visa.requirements || [],
        description: visa.description || '',
        status: visa.status as 'active' | 'suspended' | 'discontinued',
        approval_rate: visa.approval_rate || 0
      })) || [];
      
      setVisas(formattedData);
    } catch (error) {
      console.error('Error fetching visas:', error);
      toast.error('Failed to fetch visas');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchVisas();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async (visaData: Partial<SaudiVisa>) => {
    try {
      const dataToSave = {
        visa_type: visaData.visa_type || '',
        visa_category: visaData.visa_category || '',
        price: Number(visaData.price) || 0,
        processing_time: visaData.processing_time || '',
        visa_validity: visaData.visa_validity || '',
        stay_validity: visaData.stay_validity || '',
        number_of_entries: visaData.number_of_entries || '',
        requirements: visaData.requirements || [],
        description: visaData.description || '',
        status: visaData.status || 'active',
        approval_rate: Number(visaData.approval_rate) || 0
      };

      if (visaData.id) {
        const { error } = await supabase
          .from('saudi_visas')
          .update(dataToSave)
          .eq('id', visaData.id);

        if (error) throw error;
        toast.success('Visa updated successfully');
      } else {
        const { error } = await supabase
          .from('saudi_visas')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Visa created successfully');
      }

      await fetchVisas();
      setEditMode(null);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving visa:', error);
      toast.error('Failed to save visa');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visa?')) return;

    try {
      const { error } = await supabase
        .from('saudi_visas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Visa deleted successfully');
      await fetchVisas();
    } catch (error) {
      console.error('Error deleting visa:', error);
      toast.error('Failed to delete visa');
    }
  };

  const handleEdit = (visa: SaudiVisa) => {
    setFormData(visa);
    setEditMode(visa.id);
  };

  const resetForm = () => {
    setFormData({
      visa_type: '',
      visa_category: '',
      price: 0,
      processing_time: '',
      visa_validity: '',
      stay_validity: '',
      number_of_entries: '',
      requirements: [],
      description: '',
      status: 'active',
      approval_rate: 0
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading visas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saudi Visas Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Visa
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Visa</CardTitle>
          </CardHeader>
          <CardContent>
            <VisaForm
              data={formData}
              onChange={setFormData}
              onSave={handleSave}
              onCancel={() => {
                setShowAddForm(false);
                resetForm();
              }}
            />
          </CardContent>
        </Card>
      )}

      {editMode && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Visa</CardTitle>
          </CardHeader>
          <CardContent>
            <VisaForm
              data={formData}
              onChange={setFormData}
              onSave={handleSave}
              onCancel={() => setEditMode(null)}
            />
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4">
        {visas.map((visa) => (
          <Card key={visa.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{visa.visa_type}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge>{visa.visa_category}</Badge>
                  <Badge variant="outline">${visa.price}</Badge>
                  <Badge variant={visa.status === 'active' ? 'default' : 'secondary'}>
                    {visa.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(visa)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(visa.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface VisaFormProps {
  data: Partial<SaudiVisa>;
  onChange: (data: Partial<SaudiVisa>) => void;
  onSave: (data: Partial<SaudiVisa>) => void;
  onCancel: () => void;
}

const VisaForm: React.FC<VisaFormProps> = ({
  data,
  onChange,
  onSave,
  onCancel
}) => {
  const handleChange = (field: keyof SaudiVisa, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="visa_type">Visa Type</Label>
        <Input
          id="visa_type"
          value={data.visa_type || ''}
          onChange={(e) => handleChange('visa_type', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="visa_category">Visa Category</Label>
        <Input
          id="visa_category"
          value={data.visa_category || ''}
          onChange={(e) => handleChange('visa_category', e.target.value)}
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
        <Label htmlFor="processing_time">Processing Time</Label>
        <Input
          id="processing_time"
          value={data.processing_time || ''}
          onChange={(e) => handleChange('processing_time', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="visa_validity">Visa Validity</Label>
        <Input
          id="visa_validity"
          value={data.visa_validity || ''}
          onChange={(e) => handleChange('visa_validity', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="stay_validity">Stay Validity</Label>
        <Input
          id="stay_validity"
          value={data.stay_validity || ''}
          onChange={(e) => handleChange('stay_validity', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="number_of_entries">Number of Entries</Label>
        <Input
          id="number_of_entries"
          value={data.number_of_entries || ''}
          onChange={(e) => handleChange('number_of_entries', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="approval_rate">Approval Rate</Label>
        <Input
          id="approval_rate"
          type="number"
          value={data.approval_rate || 0}
          onChange={(e) => handleChange('approval_rate', Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={data.status || 'active'} onValueChange={(value: 'active' | 'suspended' | 'discontinued') => handleChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
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

      <div className="md:col-span-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={(data.requirements || []).join('\n')}
          onChange={(e) => handleChange('requirements', e.target.value.split('\n'))}
        />
      </div>

      <div className="md:col-span-2 flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={() => onSave(data)}>
          <Save className="w-4 h-4 mr-2" />
          Save Visa
        </Button>
      </div>
    </div>
  );
};

export default SaudiVisasManager;
