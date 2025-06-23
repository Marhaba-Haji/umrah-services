import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface Package {
  id: number;
  name: string;
  price: string;
  duration: string;
  status: string;
  description: string;
  includes: string[];
  category: string;
  packageType: 'group' | 'independent';
  packageCategory: string;
  inclusions: string[];
  mealPlan: string;
  makkahHotel: {
    image: string;
    name: string;
    starCategory: string;
    distanceFromHaram: string;
  };
  madinahHotel: {
    image: string;
    name: string;
    starCategory: string;
    distanceFromMasjid: string;
  };
  flightIncluded: boolean;
  flightDetails: {
    airlineName: string;
    flightType: 'direct' | 'connecting';
  };
  departureDate: string;
  returnDate: string;
  durationCategory: 'short' | 'standard' | 'long';
  itinerary: ItineraryDay[];
  pricing: {
    adult: string;
    childWithBed: string;
    childWithoutBed: string;
    infant: string;
  };
  roomTypePricing: {
    adult: {
      sixSharing: string;
      fiveSharing: string;
      fourSharing: string;
      triplePrivate: string;
      doublePrivate: string;
      singlePrivate: string;
    };
    childWithBed: {
      sixSharing: string;
      fiveSharing: string;
      fourSharing: string;
      triplePrivate: string;
      doublePrivate: string;
      singlePrivate: string;
    };
  };
}

interface Hotel {
  id: string;
  name: string;
  city: string;
  rating: string;
  distance_from_haram?: string;
  distance_from_masjid_e_nabawi?: string;
}

interface Activity {
  id: string;
  name: string;
  city: string;
  duration: string;
  price: number;
}

const PackageManager = () => {
  const [packages, setPackages] = useState<Package[]>([
    { 
      id: 1, 
      name: '5-Star Umrah Package', 
      price: '$2999', 
      duration: '14 days', 
      status: 'Active', 
      description: 'Luxury Umrah experience', 
      includes: ['5-star hotel', 'VIP transport', 'Guide service'], 
      category: 'luxury',
      packageType: 'group',
      packageCategory: 'luxury',
      inclusions: ['Umrah visa', 'Insurance', 'Air tickets'],
      mealPlan: 'full board',
      makkahHotel: {
        image: '',
        name: 'Pullman Makkah',
        starCategory: '5',
        distanceFromHaram: '200m'
      },
      madinahHotel: {
        image: '',
        name: 'Madinah Hilton',
        starCategory: '5',
        distanceFromMasjid: '300m'
      },
      flightIncluded: true,
      flightDetails: {
        airlineName: 'Emirates',
        flightType: 'direct'
      },
      departureDate: '2024-03-01',
      returnDate: '2024-03-15',
      durationCategory: 'standard',
      itinerary: [],
      pricing: {
        adult: '2999',
        childWithBed: '2499',
        childWithoutBed: '1999',
        infant: '299'
      },
      roomTypePricing: {
        adult: {
          sixSharing: '2999',
          fiveSharing: '3299',
          fourSharing: '3599',
          triplePrivate: '3999',
          doublePrivate: '4499',
          singlePrivate: '5999'
        },
        childWithBed: {
          sixSharing: '2499',
          fiveSharing: '2799',
          fourSharing: '3099',
          triplePrivate: '3399',
          doublePrivate: '3899',
          singlePrivate: '5099'
        }
      }
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  const [copyAdultToChild, setCopyAdultToChild] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [packageImage, setPackageImage] = useState<File | null>(null);
  const [packageImagePreview, setPackageImagePreview] = useState('');
  const [useCustomMakkahHotel, setUseCustomMakkahHotel] = useState(false);
  const [useCustomMadinahHotel, setUseCustomMadinahHotel] = useState(false);
  const { toast } = useToast();

  const inclusionOptions = [
    'Umrah visa', 'Insurance', 'Air tickets', 'Accommodation', 'Makkah ziarath',
    'Madinah ziarath', 'Taif ziarath', 'Badr ziarath', 'Zamzam', 'Umrah kit',
    'Laundry', 'Meals', 'Arrival airport transfer', 'Departure airport transfer',
    'Makkah to Madinah transfer', 'Guide', 'GST', 'TCS', 'Sim card', 'Lanyard'
  ];

  const cities = [
    { id: 'makkah', label: 'Makkah' },
    { id: 'madinah', label: 'Madinah' },
    { id: 'taif', label: 'Taif' },
    { id: 'jeddah', label: 'Jeddah' },
  ];

  useEffect(() => {
    fetchHotels();
    fetchActivities();
  }, []);

  const fetchHotels = async () => {
    const { data, error } = await supabase
      .from('hotels')
      .select('id, name, city, rating, distance_from_haram, distance_from_masjid_e_nabawi')
      .order('name');
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch hotels',
        variant: 'destructive',
      });
    } else {
      setHotels(data || []);
    }
  };

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('id, name, city, duration, price')
      .order('name');
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch activities',
        variant: 'destructive',
      });
    } else {
      setActivities(data || []);
    }
  };

  const form = useForm({
    defaultValues: {
      name: '',
      durationCategory: 'standard',
      price: '',
      duration: '',
      status: 'Active',
      description: '',
      includes: '',
      category: 'economy',
      packageType: 'group',
      packageCategory: 'economy',
      inclusions: [],
      mealPlan: 'room only',
      makkahHotelId: '',
      makkahHotelImage: '',
      makkahHotelName: '',
      makkahHotelStar: '3',
      makkahHotelDistance: '',
      madinahHotelId: '',
      madinahHotelImage: '',
      madinahHotelName: '',
      madinahHotelStar: '3',
      madinahHotelDistance: '',
      flightIncluded: true,
      airlineName: '',
      flightType: 'direct',
      departureCity: '',
      destinationCity: '',
      departureDate: '',
      returnDate: '',
      selectedActivities: [],
      citiesCovered: [],
      featuredImage: '',
      adultPrice: '',
      childWithBedPrice: '',
      childWithoutBedPrice: '',
      infantPrice: '',
      adultSixSharingPrice: '',
      adultFiveSharingPrice: '',
      adultFourSharingPrice: '',
      adultTriplePrivatePrice: '',
      adultDoublePrivatePrice: '',
      adultSinglePrivatePrice: '',
      childSixSharingPrice: '',
      childFiveSharingPrice: '',
      childFourSharingPrice: '',
      childTriplePrivatePrice: '',
      childDoublePrivatePrice: '',
      childSinglePrivatePrice: ''
    }
  });

  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: itineraryDays.length + 1,
      title: '',
      description: ''
    };
    setItineraryDays([...itineraryDays, newDay]);
  };

  const removeItineraryDay = (index: number) => {
    const updatedDays = itineraryDays.filter((_, i) => i !== index);
    // Renumber days
    const renumberedDays = updatedDays.map((day, i) => ({ ...day, day: i + 1 }));
    setItineraryDays(renumberedDays);
  };

  const updateItineraryDay = (index: number, field: 'title' | 'description', value: string) => {
    const updatedDays = [...itineraryDays];
    updatedDays[index][field] = value;
    setItineraryDays(updatedDays);
  };

  const handleCopyAdultToChild = (checked: boolean) => {
    setCopyAdultToChild(checked);
    if (checked) {
      const adultPrices = form.getValues();
      form.setValue('childSixSharingPrice', adultPrices.adultSixSharingPrice);
      form.setValue('childFiveSharingPrice', adultPrices.adultFiveSharingPrice);
      form.setValue('childFourSharingPrice', adultPrices.adultFourSharingPrice);
      form.setValue('childTriplePrivatePrice', adultPrices.adultTriplePrivatePrice);
      form.setValue('childDoublePrivatePrice', adultPrices.adultDoublePrivatePrice);
      form.setValue('childSinglePrivatePrice', adultPrices.adultSinglePrivatePrice);
    }
  };

  const handlePackageImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPackageImage(file);
    setPackageImagePreview(URL.createObjectURL(file));

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('package-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('package-images')
      .getPublicUrl(fileName);

    if (publicUrlData?.publicUrl) {
      form.setValue('featuredImage', publicUrlData.publicUrl);
    }
  };

  const handleMakkahHotelChange = (hotelId: string) => {
    const selectedHotel = hotels.find(h => h.id === hotelId);
    if (selectedHotel) {
      form.setValue('makkahHotelName', selectedHotel.name);
      form.setValue('makkahHotelDistance', selectedHotel.distance_from_haram || '');
    }
  };

  const handleMadinahHotelChange = (hotelId: string) => {
    const selectedHotel = hotels.find(h => h.id === hotelId);
    if (selectedHotel) {
      form.setValue('madinahHotelName', selectedHotel.name);
      form.setValue('madinahHotelDistance', selectedHotel.distance_from_masjid_e_nabawi || '');
    }
  };

  function isValidUuid(val: string | null | undefined) {
    return typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
  }

  const cleanDate = (value: string) => value && value.trim() !== '' ? value : null;
  const cleanNumber = (value: string) => value && value.trim() !== '' ? Number(value) : null;

  const onSubmit = async (data: any) => {
    const newPackage: any = {
      name: data.name,
      price: cleanNumber(data.price),
      duration: data.duration,
      status: data.status ? data.status.toLowerCase() : 'active',
      description: data.description,
      includes: data.includes.split(',').map((item: string) => item.trim()),
      category: data.category,
      package_type: data.packageType,
      package_category: data.packageCategory,
      inclusions: data.inclusions,
      meal_plan: data.mealPlan,
      featured_image: data.featuredImage,
      makkah_hotel: useCustomMakkahHotel ? {
        image: data.makkahHotelImage,
        name: data.makkahHotelName,
        starCategory: data.makkahHotelStar,
        distanceFromHaram: data.makkahHotelDistance
      } : {
        id: isValidUuid(data.makkahHotelId) ? data.makkahHotelId : null,
        name: data.makkahHotelName,
        distanceFromHaram: data.makkahHotelDistance
      },
      madinah_hotel: useCustomMadinahHotel ? {
        image: data.madinahHotelImage,
        name: data.madinahHotelName,
        starCategory: data.madinahHotelStar,
        distanceFromMasjid: data.madinahHotelDistance
      } : {
        id: isValidUuid(data.madinahHotelId) ? data.madinahHotelId : null,
        name: data.madinahHotelName,
        distanceFromMasjid: data.madinahHotelDistance
      },
      flight_included: data.flightIncluded,
      flight_details: data.flightIncluded ? {
        airlineName: data.airlineName,
        flightType: data.flightType,
        departureCity: data.departureCity,
        destinationCity: data.destinationCity
      } : null,
      departure_date: cleanDate(data.departureDate),
      return_date: cleanDate(data.returnDate),
      booking_deadline: cleanDate(data.bookingDeadline),
      duration_category: data.durationCategory,
      itinerary: itineraryDays,
      activities: data.selectedActivities,
      cities_covered: data.citiesCovered,
      pricing: {
        adult: cleanNumber(data.adultPrice),
        childWithBed: cleanNumber(data.childWithBedPrice),
        childWithoutBed: cleanNumber(data.childWithoutBedPrice),
        infant: cleanNumber(data.infantPrice)
      },
      room_type_pricing: {
        adult: {
          sixSharing: cleanNumber(data.adultSixSharingPrice),
          fiveSharing: cleanNumber(data.adultFiveSharingPrice),
          fourSharing: cleanNumber(data.adultFourSharingPrice),
          triplePrivate: cleanNumber(data.adultTriplePrivatePrice),
          doublePrivate: cleanNumber(data.adultDoublePrivatePrice),
          singlePrivate: cleanNumber(data.adultSinglePrivatePrice)
        },
        childWithBed: {
          sixSharing: cleanNumber(data.childSixSharingPrice),
          fiveSharing: cleanNumber(data.childFiveSharingPrice),
          fourSharing: cleanNumber(data.childFourSharingPrice),
          triplePrivate: cleanNumber(data.childTriplePrivatePrice),
          doublePrivate: cleanNumber(data.childDoublePrivatePrice),
          singlePrivate: cleanNumber(data.childSinglePrivatePrice)
        }
      },
      makkah_hotel_id: isValidUuid(data.makkahHotelId) ? data.makkahHotelId : null,
      madinah_hotel_id: isValidUuid(data.madinahHotelId) ? data.madinahHotelId : null,
      category_id: isValidUuid(data.categoryId) ? data.categoryId : null
    };

    if (editingPackage && isValidUuid(editingPackage.id)) {
      newPackage.id = editingPackage.id;
    }

    try {
      if (editingPackage) {
        const { error } = await supabase
          .from('umrah_packages')
          .update(newPackage)
          .eq('id', editingPackage.id);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Package updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('umrah_packages')
          .insert([newPackage]);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Package created successfully',
        });
      }

      setPackages(editingPackage 
        ? packages.map(pkg => pkg.id === editingPackage.id ? newPackage : pkg)
        : [...packages, newPackage]
      );

      setIsDialogOpen(false);
      setEditingPackage(null);
      setItineraryDays([]);
      setCopyAdultToChild(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save package',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setItineraryDays(pkg.itinerary);
    form.reset({
      name: pkg.name,
      durationCategory: pkg.durationCategory,
      price: pkg.price,
      duration: pkg.duration,
      status: pkg.status,
      description: pkg.description,
      includes: pkg.includes.join(', '),
      category: pkg.category,
      packageType: pkg.packageType,
      packageCategory: pkg.packageCategory,
      inclusions: pkg.inclusions,
      mealPlan: pkg.mealPlan,
      makkahHotelImage: pkg.makkahHotel.image,
      makkahHotelName: pkg.makkahHotel.name,
      makkahHotelStar: pkg.makkahHotel.starCategory,
      makkahHotelDistance: pkg.makkahHotel.distanceFromHaram,
      madinahHotelImage: pkg.madinahHotel.image,
      madinahHotelName: pkg.madinahHotel.name,
      madinahHotelStar: pkg.madinahHotel.starCategory,
      madinahHotelDistance: pkg.madinahHotel.distanceFromMasjid,
      flightIncluded: pkg.flightIncluded,
      airlineName: pkg.flightDetails.airlineName,
      flightType: pkg.flightDetails.flightType,
      departureDate: pkg.departureDate,
      returnDate: pkg.returnDate,
      adultPrice: pkg.pricing.adult,
      childWithBedPrice: pkg.pricing.childWithBed,
      childWithoutBedPrice: pkg.pricing.childWithoutBed,
      infantPrice: pkg.pricing.infant,
      adultSixSharingPrice: pkg.roomTypePricing.adult.sixSharing,
      adultFiveSharingPrice: pkg.roomTypePricing.adult.fiveSharing,
      adultFourSharingPrice: pkg.roomTypePricing.adult.fourSharing,
      adultTriplePrivatePrice: pkg.roomTypePricing.adult.triplePrivate,
      adultDoublePrivatePrice: pkg.roomTypePricing.adult.doublePrivate,
      adultSinglePrivatePrice: pkg.roomTypePricing.adult.singlePrivate,
      childSixSharingPrice: pkg.roomTypePricing.childWithBed.sixSharing,
      childFiveSharingPrice: pkg.roomTypePricing.childWithBed.fiveSharing,
      childFourSharingPrice: pkg.roomTypePricing.childWithBed.fourSharing,
      childTriplePrivatePrice: pkg.roomTypePricing.childWithBed.triplePrivate,
      childDoublePrivatePrice: pkg.roomTypePricing.childWithBed.doublePrivate,
      childSinglePrivatePrice: pkg.roomTypePricing.childWithBed.singlePrivate
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
            <Button onClick={() => { setEditingPackage(null); setItineraryDays([]); setCopyAdultToChild(false); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Featured Image */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Featured Image</h4>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePackageImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {packageImagePreview && (
                      <img src={packageImagePreview} alt="Preview" className="mt-2 max-h-40 rounded-md" />
                    )}
                  </div>
                </div>

                {/* Basic Package Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Basic Information</h4>
                  <div className="grid grid-cols-3 gap-4">
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
                      name="durationCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="short">Short</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="long">Long</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price</FormLabel>
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
                      name="packageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="group" id="group" />
                                <label htmlFor="group">Group</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="independent" id="independent" />
                                <label htmlFor="independent">Independent</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="packageCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="super saver">Super Saver</SelectItem>
                              <SelectItem value="budget">Budget</SelectItem>
                              <SelectItem value="economy">Economy</SelectItem>
                              <SelectItem value="economy plus">Economy Plus</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="deluxe">Deluxe</SelectItem>
                              <SelectItem value="super deluxe">Super Deluxe</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="hilton">Hilton</SelectItem>
                              <SelectItem value="luxury">Luxury</SelectItem>
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
                </div>

                {/* Inclusions */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Package Inclusions</h4>
                  <FormField
                    control={form.control}
                    name="inclusions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Inclusions</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border p-4 rounded">
                            {inclusionOptions.map((inclusion) => (
                              <div key={inclusion} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={inclusion}
                                  checked={field.value?.includes(inclusion)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([...(field.value || []), inclusion]);
                                    } else {
                                      field.onChange(field.value?.filter((item: string) => item !== inclusion) || []);
                                    }
                                  }}
                                />
                                <label htmlFor={inclusion} className="text-sm">{inclusion}</label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mealPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Plan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select meal plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="room only">Room Only</SelectItem>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="half board">Half Board</SelectItem>
                            <SelectItem value="full board">Full Board</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hotel Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Hotel Details</h4>
                  
                  {/* Makkah Hotel */}
                  <div className="border p-4 rounded space-y-3">
                    <h5 className="font-medium">Makkah Hotel</h5>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        checked={useCustomMakkahHotel}
                        onCheckedChange={(checked) => setUseCustomMakkahHotel(checked as boolean)}
                      />
                      <label className="text-sm">Enter hotel details manually</label>
                    </div>

                    {!useCustomMakkahHotel ? (
                      <FormField
                        control={form.control}
                        name="makkahHotelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Hotel</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleMakkahHotelChange(value);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a hotel" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {hotels
                                  .filter(hotel => hotel.city.toLowerCase() === 'makkah')
                                  .map(hotel => (
                                    <SelectItem key={hotel.id} value={hotel.id}>
                                      {hotel.name} ({hotel.rating}★)
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="makkahHotelName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hotel Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter hotel name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="makkahHotelStar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Star Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="3">3 Star</SelectItem>
                                  <SelectItem value="4">4 Star</SelectItem>
                                  <SelectItem value="5">5 Star</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* Madinah Hotel */}
                  <div className="border p-4 rounded space-y-3">
                    <h5 className="font-medium">Madinah Hotel</h5>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        checked={useCustomMadinahHotel}
                        onCheckedChange={(checked) => setUseCustomMadinahHotel(checked as boolean)}
                      />
                      <label className="text-sm">Enter hotel details manually</label>
                    </div>

                    {!useCustomMadinahHotel ? (
                      <FormField
                        control={form.control}
                        name="madinahHotelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Hotel</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleMadinahHotelChange(value);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a hotel" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {hotels
                                  .filter(hotel => hotel.city.toLowerCase() === 'madinah')
                                  .map(hotel => (
                                    <SelectItem key={hotel.id} value={hotel.id}>
                                      {hotel.name} ({hotel.rating}★)
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="madinahHotelName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hotel Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter hotel name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="madinahHotelStar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Star Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="3">3 Star</SelectItem>
                                  <SelectItem value="4">4 Star</SelectItem>
                                  <SelectItem value="5">5 Star</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Day-wise Itinerary */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Day-wise Itinerary</h4>
                    <Button type="button" onClick={addItineraryDay} variant="outline" size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Day
                    </Button>
                  </div>
                  
                  {itineraryDays.map((day, index) => (
                    <div key={index} className="border p-4 rounded space-y-3">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Day {day.day}</h5>
                        <Button 
                          type="button" 
                          onClick={() => removeItineraryDay(index)}
                          variant="outline" 
                          size="sm"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            placeholder="Day title"
                            value={day.title}
                            onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            placeholder="Day description"
                            value={day.description}
                            onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Flight Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Flight Details</h4>
                  <FormField
                    control={form.control}
                    name="flightIncluded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Flight Included</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('flightIncluded') && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="departureCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Departure City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter departure city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="destinationCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Destination City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter destination city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="airlineName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Airline Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Emirates" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="flightType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Flight Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="direct">Direct</SelectItem>
                                  <SelectItem value="connecting">Connecting</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="departureDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Departure Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="returnDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Return Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Activities */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Activities</h4>
                  <FormField
                    control={form.control}
                    name="selectedActivities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Activities</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="flex items-start space-x-3 p-3 border rounded-md hover:bg-accent/5"
                              >
                                <Checkbox
                                  checked={field.value?.includes(activity.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), activity.id]
                                      : field.value?.filter((id) => id !== activity.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                                <div className="space-y-1">
                                  <label className="text-sm font-medium leading-none">
                                    {activity.name}
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                    {activity.city} • {activity.duration} • ${activity.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Cities Covered */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Cities Covered</h4>
                  <FormField
                    control={form.control}
                    name="citiesCovered"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {cities.map((city) => (
                              <div
                                key={city.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={field.value?.includes(city.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), city.id]
                                      : field.value?.filter((id) => id !== city.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                                <label className="text-sm">{city.label}</label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Pricing Details</h4>
                  
                  {/* Room Type Pricing - Adult */}
                  <div className="border p-4 rounded space-y-3">
                    <h5 className="font-medium">Adult Room Type Pricing</h5>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="adultSixSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>6 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="2999" {...field} onChange={(e) => {
                                field.onChange(e);
                                if (copyAdultToChild) {
                                  form.setValue('childSixSharingPrice', e.target.value);
                                }
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="adultFiveSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>5 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3299" {...field} onChange={(e) => {
                                field.onChange(e);
                                if (copyAdultToChild) {
                                  form.setValue('childFiveSharingPrice', e.target.value);
                                }
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="adultFourSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>4 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3599" {...field} onChange={(e) => {
                                field.onChange(e);
                                if (copyAdultToChild) {
                                  form.setValue('childFourSharingPrice', e.target.value);
                                }
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="adultTriplePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Triple Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3999" {...field} onChange={(e) => {
                                field.onChange(e);
                                if (copyAdultToChild) {
                                  form.setValue('childTriplePrivatePrice', e.target.value);
                                }
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="adultDoublePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Double Private</FormLabel>
                            <FormControl>
                              <Input placeholder="4499" {...field} onChange={(e) => {
                                field.onChange(e);
                                if (copyAdultToChild) {
                                  form.setValue('childDoublePrivatePrice', e.target.value);
                                }
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="adultSinglePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Single Private</FormLabel>
                            <FormControl>
                              <Input placeholder="5999" {...field} onChange={(e) => {
                                field.onChange(e);
                                if (copyAdultToChild) {
                                  form.setValue('childSinglePrivatePrice', e.target.value);
                                }
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Room Type Pricing - Child with Bed */}
                  <div className="border p-4 rounded space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Child with Bed Room Type Pricing</h5>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={copyAdultToChild}
                          onCheckedChange={handleCopyAdultToChild}
                        />
                        <label className="text-sm">Same as Adult</label>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="childSixSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>6 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="2499" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childFiveSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>5 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="2799" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childFourSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>4 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3099" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childTriplePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Triple Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3399" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childDoublePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Double Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3899" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childSinglePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Single Private</FormLabel>
                            <FormControl>
                              <Input placeholder="5099" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Fixed Pricing for Child without Bed and Infant */}
                  <div className="border p-4 rounded space-y-3">
                    <h5 className="font-medium">Fixed Pricing (No Room Type Variation)</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="childWithoutBedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Child without Bed</FormLabel>
                            <FormControl>
                              <Input placeholder="1999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="infantPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Infant</FormLabel>
                            <FormControl>
                              <Input placeholder="299" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
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
                  <Button type="button" variant="outline"
                      onClick={() => setIsDialogOpen(false)}>
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
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Flight</th>
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
                      <Badge variant="outline">{pkg.packageCategory}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">{pkg.packageType}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={pkg.flightIncluded ? 'default' : 'outline'}>
                        {pkg.flightIncluded ? 'Included' : 'Not Included'}
                      </Badge>
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
