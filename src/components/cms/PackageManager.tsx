
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus, Upload } from 'lucide-react';

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
  flightDetails: {
    airlineName: string;
    flightType: 'direct' | 'connecting';
  };
  departureDate: string;
  returnDate: string;
  durationCategory: 'short' | 'standard' | 'long';
  pricing: {
    adult: string;
    childWithBed: string;
    childWithoutBed: string;
    infant: string;
  };
  roomTypePricing: {
    sixSharing: string;
    fiveSharing: string;
    fourSharing: string;
    triplePrivate: string;
    doublePrivate: string;
    singlePrivate: string;
  };
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
      flightDetails: {
        airlineName: 'Emirates',
        flightType: 'direct'
      },
      departureDate: '2024-03-01',
      returnDate: '2024-03-15',
      durationCategory: 'standard',
      pricing: {
        adult: '2999',
        childWithBed: '2499',
        childWithoutBed: '1999',
        infant: '299'
      },
      roomTypePricing: {
        sixSharing: '2999',
        fiveSharing: '3299',
        fourSharing: '3599',
        triplePrivate: '3999',
        doublePrivate: '4499',
        singlePrivate: '5999'
      }
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const inclusionOptions = [
    'Umrah visa', 'Insurance', 'Air tickets', 'Accommodation', 'Makkah ziarath',
    'Madinah ziarath', 'Taif ziarath', 'Badr ziarath', 'Zamzam', 'Umrah kit',
    'Laundry', 'Meals', 'Arrival airport transfer', 'Departure airport transfer',
    'Makkah to Madinah transfer', 'Guide', 'GST', 'TCS'
  ];

  const form = useForm({
    defaultValues: {
      name: '',
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
      makkahHotelImage: '',
      makkahHotelName: '',
      makkahHotelStar: '3',
      makkahHotelDistance: '',
      madinahHotelImage: '',
      madinahHotelName: '',
      madinahHotelStar: '3',
      madinahHotelDistance: '',
      airlineName: '',
      flightType: 'direct',
      departureDate: '',
      returnDate: '',
      durationCategory: 'standard',
      adultPrice: '',
      childWithBedPrice: '',
      childWithoutBedPrice: '',
      infantPrice: '',
      sixSharingPrice: '',
      fiveSharingPrice: '',
      fourSharingPrice: '',
      triplePrivatePrice: '',
      doublePrivatePrice: '',
      singlePrivatePrice: ''
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
      category: data.category,
      packageType: data.packageType,
      packageCategory: data.packageCategory,
      inclusions: data.inclusions,
      mealPlan: data.mealPlan,
      makkahHotel: {
        image: data.makkahHotelImage,
        name: data.makkahHotelName,
        starCategory: data.makkahHotelStar,
        distanceFromHaram: data.makkahHotelDistance
      },
      madinahHotel: {
        image: data.madinahHotelImage,
        name: data.madinahHotelName,
        starCategory: data.madinahHotelStar,
        distanceFromMasjid: data.madinahHotelDistance
      },
      flightDetails: {
        airlineName: data.airlineName,
        flightType: data.flightType
      },
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      durationCategory: data.durationCategory,
      pricing: {
        adult: data.adultPrice,
        childWithBed: data.childWithBedPrice,
        childWithoutBed: data.childWithoutBedPrice,
        infant: data.infantPrice
      },
      roomTypePricing: {
        sixSharing: data.sixSharingPrice,
        fiveSharing: data.fiveSharingPrice,
        fourSharing: data.fourSharingPrice,
        triplePrivate: data.triplePrivatePrice,
        doublePrivate: data.doublePrivatePrice,
        singlePrivate: data.singlePrivatePrice
      }
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
      airlineName: pkg.flightDetails.airlineName,
      flightType: pkg.flightDetails.flightType,
      departureDate: pkg.departureDate,
      returnDate: pkg.returnDate,
      durationCategory: pkg.durationCategory,
      adultPrice: pkg.pricing.adult,
      childWithBedPrice: pkg.pricing.childWithBed,
      childWithoutBedPrice: pkg.pricing.childWithoutBed,
      infantPrice: pkg.pricing.infant,
      sixSharingPrice: pkg.roomTypePricing.sixSharing,
      fiveSharingPrice: pkg.roomTypePricing.fiveSharing,
      fourSharingPrice: pkg.roomTypePricing.fourSharing,
      triplePrivatePrice: pkg.roomTypePricing.triplePrivate,
      doublePrivatePrice: pkg.roomTypePricing.doublePrivate,
      singlePrivatePrice: pkg.roomTypePricing.singlePrivate
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Package Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Basic Information</h4>
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
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="makkahHotelName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hotel Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Hotel name" {...field} />
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
                    <FormField
                      control={form.control}
                      name="makkahHotelDistance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance from Haram</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 200m" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Madinah Hotel */}
                  <div className="border p-4 rounded space-y-3">
                    <h5 className="font-medium">Madinah Hotel</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="madinahHotelName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hotel Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Hotel name" {...field} />
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
                    <FormField
                      control={form.control}
                      name="madinahHotelDistance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance from Masjid-e-Nabawi</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 300m" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Flight & Travel Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Flight & Travel Details</h4>
                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-3 gap-4">
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
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Pricing Details</h4>
                  
                  {/* Per Person Pricing */}
                  <div className="border p-4 rounded space-y-3">
                    <h5 className="font-medium">Per Person Pricing</h5>
                    <div className="grid grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="adultPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adult</FormLabel>
                            <FormControl>
                              <Input placeholder="2999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childWithBedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Child with Bed</FormLabel>
                            <FormControl>
                              <Input placeholder="2499" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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

                  {/* Room Type Pricing */}
                  <div className="border p-4 rounded space-y-3">
                    <h5 className="font-medium">Room Type Pricing</h5>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="sixSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>6 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="2999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fiveSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>5 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3299" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fourSharingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>4 Sharing/Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3599" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="triplePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Triple Private</FormLabel>
                            <FormControl>
                              <Input placeholder="3999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="doublePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Double Private</FormLabel>
                            <FormControl>
                              <Input placeholder="4499" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="singlePrivatePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Single Private</FormLabel>
                            <FormControl>
                              <Input placeholder="5999" {...field} />
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
