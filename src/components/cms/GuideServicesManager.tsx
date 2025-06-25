import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Cropper from 'react-easy-crop';
import * as faceapi from '@vladmandic/face-api';

interface GuideService {
  id: string;
  guide_name: string;
  guide_photo: string;
  guide_city: string;
  country_code: string;
  phone_number: string;
  service_type: string[];
  service_prices: { [service: string]: string };
  languages: string[];
  experience: string;
  rating: number;
  status: string;
  description: string;
  availability_schedule?: string;
  qualifications?: string[];
  specializations?: string[];
}

const SERVICE_TYPES = [
  'Umrah Guide',
  'Makkah Ziarath Guide',
  'Madinah Ziarath Guide',
  'Taif Ziarath Guide',
  'Badr Ziarath Guide',
];

const SERVICE_TYPE_ENUM_MAP: Record<string, string> = {
  'Umrah Guide': 'umrah_guide',
  'Makkah Ziarath Guide': 'makkah_ziarath_guide',
  'Madinah Ziarath Guide': 'madinah_ziarath_guide',
  'Taif Ziarath Guide': 'taif_ziarath_guide',
  'Badr Ziarath Guide': 'badr_ziarath_guide'
};

const COUNTRY_CODES = [
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  // ...add more as needed
];

const GuideServicesManager = () => {
  const [guides, setGuides] = useState<GuideService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideService | null>(null);
  const [servicePrices, setServicePrices] = useState<{ [service: string]: string }>({});
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [countrySearch, setCountrySearch] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [viewingGuide, setViewingGuide] = useState<GuideService | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [faceLoading, setFaceLoading] = useState(false);
  const [faceError, setFaceError] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      guideName: '',
      guidePhoto: '',
      guideCity: '',
      countryCode: COUNTRY_CODES[0].code,
      mobileNumber: '',
      serviceType: [],
      servicePrices: {},
      languages: '',
      experience: '',
      rating: '',
      status: 'Active',
      description: '',
      availabilitySchedule: '',
      qualifications: '',
      specializations: ''
    }
  });

  // Fetch guides from Supabase on mount
  useEffect(() => {
    fetchGuides();
  }, []);

  // Load face-api models once
  useEffect(() => {
    faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guide_services')
      .select('id,guide_name,guide_photo,guide_city,country_code,phone_number,service_type,service_prices,languages,experience,rating,status,description,availability_schedule,qualifications,specializations');
    if (!error && data) {
      // Transform the data to match our interface
      const transformedGuides = data.map(guide => ({
        ...guide,
        service_prices: guide.service_prices as { [service: string]: string } || {}
      }));
      setGuides(transformedGuides);
    }
    setLoading(false);
  };

  // Helper to get cropped image blob
  async function getCroppedImg(imageSrc: string, cropPixels: any) {
    const image = new window.Image();
    image.src = imageSrc;
    await new Promise(resolve => { image.onload = resolve; });
    const canvas = document.createElement('canvas');
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas is empty'));
      }, 'image/jpeg');
    });
  }

  // Face detection and crop auto-center
  const handleFileSelect = async (file: File) => {
    setFaceError('');
    setSelectedImage(file);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setImageUrl(URL.createObjectURL(file));
    setCropDialogOpen(true);
    setFaceLoading(true);
    try {
      const img = await faceapi.bufferToImage(file);
      const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());
      if (detections && detections.box) {
        // Center crop on face
        const { x, y, width, height } = detections.box;
        // Calculate crop area (square, centered on face)
        const size = Math.max(width, height) * 1.5;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const initialCrop = {
          x: Math.max(centerX - size / 2, 0),
          y: Math.max(centerY - size / 2, 0),
          width: size,
          height: size,
        };
        setCroppedAreaPixels(initialCrop);
      } else {
        // Default to center square crop if no face
        const image = new window.Image();
        image.src = URL.createObjectURL(file);
        await new Promise(resolve => { image.onload = resolve; });
        const minDim = Math.min(image.width, image.height);
        const initialCrop = {
          x: (image.width - minDim) / 2,
          y: (image.height - minDim) / 2,
          width: minDim,
          height: minDim,
        };
        setCroppedAreaPixels(initialCrop);
        setFaceError('No face detected. Please ensure the face is visible.');
      }
    } catch (err) {
      setFaceError('Face detection failed.');
    } finally {
      setFaceLoading(false);
    }
  };

  // Add uploadGuidePhoto helper
  const uploadGuidePhoto = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `guide_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('guide-photos').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      toast({ title: 'Image Upload Error', description: error.message, variant: 'destructive' });
      return null;
    }
    // Get public URL
    const { data: urlData } = supabase.storage.from('guide-photos').getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  };

  // Add or update guide
  const onSubmit = async (data: any) => {
    console.log('Form data on submit:', data); // Debug log
    // serviceType is already an array of labels
    const serviceTypes = (Array.isArray(data.serviceType) ? data.serviceType : []).map(label => SERVICE_TYPE_ENUM_MAP[label] || label);
    // Languages as array
    const languagesArr = typeof data.languages === 'string' ? data.languages.split(',').map((lang: string) => lang.trim()).filter(Boolean) : [];
    // service_prices as object or null
    const pricesObj = (servicePrices && Object.keys(servicePrices).length > 0) ? servicePrices : null;

    // Required fields
    if (!data.guideName || !data.guideCity || serviceTypes.length === 0 || !data.guidePhoto) {
      toast({
        title: 'Validation Error',
        description: 'Guide Name, Guide City, at least one Service Type, and Guide Photo are required.',
        variant: 'destructive',
      });
      return;
    }

    const newGuide = {
      guide_name: data.guideName,
      guide_photo: data.guidePhoto,
      guide_city: data.guideCity,
      country_code: data.countryCode,
      phone_number: data.mobileNumber,
      service_type: serviceTypes,
      service_prices: pricesObj,
      languages: languagesArr,
      experience: data.experience,
      rating: parseFloat(data.rating),
      status: data.status,
      description: data.description,
      availability_schedule: data.availabilitySchedule,
      qualifications: typeof data.qualifications === 'string' ? data.qualifications.split(',').map((q: string) => q.trim()).filter(Boolean) : [],
      specializations: typeof data.specializations === 'string' ? data.specializations.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    };

    console.log('Submitting guide:', newGuide);

    let error;
    if (editingGuide && editingGuide.id) {
      console.log('Updating guide with id:', editingGuide.id, 'editingGuide:', editingGuide);
      ({ error } = await supabase.from('guide_services').update(newGuide).eq('id', editingGuide.id));
    } else if (!editingGuide) {
      ({ error } = await supabase.from('guide_services').insert([newGuide]));
    } else {
      toast({
        title: 'Error',
        description: 'Invalid guide ID for update.',
        variant: 'destructive',
      });
      return;
    }
    if (!error) {
      await fetchGuides();
      setIsDialogOpen(false);
      setEditingGuide(null);
      setServicePrices({});
      form.reset();
    } else {
      toast({
        title: 'Supabase Error',
        description: error.message || 'Failed to save guide',
        variant: 'destructive',
      });
    }
  };

  // Edit handler unchanged, but will now edit DB
  const handleEdit = (guide: GuideService) => {
    console.log('handleEdit called with guide:', guide);
    if (!guide || !guide.id) {
      toast({
        title: 'Error',
        description: 'Invalid guide selected for editing.',
        variant: 'destructive',
      });
      return;
    }
    setEditingGuide(guide);
    setServicePrices(guide.service_prices || {});
    form.reset({
      guideName: guide.guide_name,
      guidePhoto: guide.guide_photo,
      guideCity: guide.guide_city,
      countryCode: guide.country_code,
      mobileNumber: guide.phone_number,
      serviceType: (guide.service_type || []).map(
        enumVal => Object.keys(SERVICE_TYPE_ENUM_MAP).find(key => SERVICE_TYPE_ENUM_MAP[key] === enumVal) || enumVal
      ),
      servicePrices: guide.service_prices || {},
      languages: guide.languages.join(', '),
      experience: guide.experience,
      rating: guide.rating.toString(),
      status: guide.status,
      description: guide.description,
      availabilitySchedule: guide.availability_schedule || '',
      qualifications: guide.qualifications ? guide.qualifications.join(', ') : '',
      specializations: guide.specializations ? guide.specializations.join(', ') : ''
    });
    setCountryCode(COUNTRY_CODES.find(c => c.code === guide.country_code) || COUNTRY_CODES[0]);
    setIsDialogOpen(true);
  };

  // Delete from DB
  const handleDelete = async (id: string) => {
    if (!id) {
      toast({
        title: 'Error',
        description: 'Invalid guide ID for delete.',
        variant: 'destructive',
      });
      return;
    }
    if (!window.confirm('Are you sure you want to delete this guide? This action cannot be undone.')) return;
    const { error } = await supabase.from('guide_services').delete().eq('id', id);
    if (!error) {
      await fetchGuides();
    }
  };

  const handleServicePriceChange = (serviceType: string, price: string) => {
    setServicePrices(prev => ({
      ...prev,
      [serviceType]: price
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Guide Services Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingGuide(null); setServicePrices({}); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingGuide ? 'Edit Guide Service' : 'Add New Guide Service'}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Fill in the details for the guide service. All fields marked * are required.
            </DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => {
                      // Find the selected country object
                      const selectedCountry = COUNTRY_CODES.find(c => c.code === field.value) || COUNTRY_CODES[0];
                      // Show search value if searching, otherwise show selected country
                      const displayValue = countryDropdownOpen && countrySearch ? countrySearch : `${selectedCountry.flag} ${selectedCountry.name} ${selectedCountry.code}`;
                      return (
                        <FormItem>
                          <FormLabel>Country Code</FormLabel>
                          <div className="relative">
                            <Input
                              placeholder="Search country"
                              value={displayValue}
                              readOnly={!countryDropdownOpen}
                              onFocus={() => setCountryDropdownOpen(true)}
                              onBlur={() => setTimeout(() => setCountryDropdownOpen(false), 150)}
                              onChange={e => {
                                setCountrySearch(e.target.value);
                                setCountryDropdownOpen(true);
                              }}
                              className="mb-2 cursor-pointer"
                              style={{ backgroundColor: countryDropdownOpen ? undefined : '#f9fafb' }}
                            />
                            {countryDropdownOpen && (
                              <div className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto">
                                {COUNTRY_CODES.filter(c =>
                                  c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                                  c.code.includes(countrySearch)
                                ).map(c => (
                                  <div
                                    key={c.code}
                                    className={`flex items-center px-2 py-1 cursor-pointer hover:bg-emerald-50 ${field.value === c.code ? 'bg-emerald-100 font-semibold' : ''}`}
                                    onMouseDown={() => {
                                      field.onChange(c.code);
                                      setCountryCode(c);
                                      setCountrySearch('');
                                      setCountryDropdownOpen(false);
                                    }}
                                  >
                                    <span className="mr-2 text-lg">{c.flag}</span>
                                    <span className="mr-2 text-sm">{c.name}</span>
                                    <span className="ml-auto text-xs text-gray-500">{c.code}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="501234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="guidePhoto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guide Photo</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={async e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                await handleFileSelect(file);
                              }}
                            />
                          </FormControl>
                          {field.value && (
                            <img src={field.value} alt="preview" className="w-24 h-24 object-cover rounded mt-2 border" />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Types & Prices</FormLabel>
                        <div className="flex flex-col gap-2">
                            {SERVICE_TYPES.map(type => (
                            <div key={type} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={field.value?.includes(type)}
                                  onChange={e => {
                                    let newTypes = field.value || [];
                                    if (e.target.checked) {
                                      newTypes = [...newTypes, type];
                                    } else {
                                      newTypes = newTypes.filter((t: string) => t !== type);
                                      // Remove price if unchecked
                                      const newPrices = { ...servicePrices };
                                      delete newPrices[type];
                                      setServicePrices(newPrices);
                                    }
                                    field.onChange(newTypes);
                                  }}
                                />
                              <span className="w-48">{type}</span>
                                <Input 
                                className="w-32"
                                placeholder={`Price`}
                                  value={servicePrices[type] || ''}
                                  onChange={e => handleServicePriceChange(type, e.target.value)}
                                disabled={!field.value?.includes(type)}
                                type="number"
                                min="0"
                                />
                              </div>
                            ))}
                        </div>
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
                        <Textarea placeholder="Guide description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availabilitySchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability Schedule (JSON or description)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='e.g. {"monday": "9am-5pm", ...}' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualifications (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Certified, 10+ years experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specializations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specializations (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Umrah, Ziarath" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={!form.watch('guidePhoto')}>
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
          {loading ? (
            <div className="text-center py-8">Loading guides...</div>
          ) : (
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
                          <img src={guide.guide_photo} alt={guide.guide_name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <div className="font-medium">{guide.guide_name}</div>
                            <div className="text-sm text-gray-500">{guide.country_code}{guide.phone_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">{guide.guide_city}</td>
                      <td className="p-2">{Array.isArray(guide.service_type) ? guide.service_type.map((type, idx) => <span key={guide.id + '-' + type + '-' + idx}>{type}{idx < guide.service_type.length - 1 ? ', ' : ''}</span>) : guide.service_type}</td>
                      <td className="p-2">⭐ {guide.rating}</td>
                      <td className="p-2">
                        <Badge variant={guide.status === 'Active' ? 'default' : 'secondary'}>
                          {guide.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => setViewingGuide(guide)}>
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
          )}
        </CardContent>
      </Card>

      {/* Viewing Guide Dialog */}
      <Dialog open={!!viewingGuide} onOpenChange={open => { if (!open) setViewingGuide(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Guide Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            View all details of the selected guide.
          </DialogDescription>
          {viewingGuide && (
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <img src={viewingGuide.guide_photo} alt={viewingGuide.guide_name} className="w-16 h-16 rounded-full object-cover border" />
                <div>
                  <div className="font-bold text-lg">{viewingGuide.guide_name}</div>
                  <div className="text-gray-500 text-sm">{viewingGuide.country_code}{viewingGuide.phone_number}</div>
                </div>
              </div>
              <div><b>City:</b> {viewingGuide.guide_city}</div>
              <div><b>Service Types:</b> {Array.isArray(viewingGuide.service_type) ? viewingGuide.service_type.map((type, idx) => <span key={viewingGuide.id + '-' + type + '-' + idx}>{type}{idx < viewingGuide.service_type.length - 1 ? ', ' : ''}</span>) : viewingGuide.service_type}</div>
              <div><b>Languages:</b> {viewingGuide.languages?.join(', ')}</div>
              <div><b>Experience:</b> {viewingGuide.experience}</div>
              <div><b>Rating:</b> {viewingGuide.rating}</div>
              <div><b>Status:</b> {viewingGuide.status}</div>
              <div><b>Description:</b> {viewingGuide.description}</div>
              <div><b>Qualifications:</b> {viewingGuide.qualifications?.map((q, idx) => <span key={viewingGuide.id + '-' + q + '-' + idx}>{q}{idx < viewingGuide.qualifications.length - 1 ? ', ' : ''}</span>)}</div>
              <div><b>Specializations:</b> {viewingGuide.specializations?.map((s, idx) => <span key={viewingGuide.id + '-' + s + '-' + idx}>{s}{idx < viewingGuide.specializations.length - 1 ? ', ' : ''}</span>)}</div>
              <div><b>Availability:</b> {viewingGuide.availability_schedule}</div>
              <div><b>Service Prices:</b> <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(viewingGuide.service_prices, null, 2)}</pre></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cropping Dialog */}
      {cropDialogOpen && (
        <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crop Guide Photo</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Please ensure the guide's face is clearly visible and centered.
            </DialogDescription>
            {imageUrl && (
              <div style={{ position: 'relative', width: 300, height: 300 }}>
                <Cropper
                  image={imageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                />
              </div>
            )}
            {faceLoading && <div>Detecting face...</div>}
            {faceError && <div className="text-red-500">{faceError}</div>}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                onClick={async () => {
                  if (!imageUrl || !croppedAreaPixels) return;
                  const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
                  const croppedFile = new File([croppedBlob], selectedImage?.name || 'cropped.jpg', { type: 'image/jpeg' });
                  const url = await uploadGuidePhoto(croppedFile);
                  if (url) {
                    form.setValue('guidePhoto', url);
                    setCropDialogOpen(false);
                    setSelectedImage(null);
                    setImageUrl(null);
                  }
                }}
                disabled={faceLoading || !!faceError}
              >
                Save
              </Button>
              <Button type="button" variant="outline" onClick={() => setCropDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GuideServicesManager;
