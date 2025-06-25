import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User, Star, Languages, MapPin, Clock, Shield, Award, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface GuideService {
  id: string;
  guide_name: string;
  guide_photo?: string;
  guide_city: string;
  guide_contact?: string;
  service_type: string;
  languages?: string[];
  experience?: string;
  rating?: number;
  description?: string;
  service_prices?: any;
  availability_schedule?: any;
  qualifications?: string[];
  specializations?: string[];
  status?: string;
  created_at?: string;
}

const GuideBooking = () => {
  const [guides, setGuides] = useState<GuideService[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<GuideService[]>([]);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfPeople: 1,
    specialRequests: '',
    serviceType: ''
  });

  // 1. Add filter and sort state
  const [filterLanguage, setFilterLanguage] = useState<string[]>([]);
  const [filterExperience, setFilterExperience] = useState<string>('any');
  const [filterServiceType, setFilterServiceType] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('rating_desc');

  // 2. Extract unique filter options from guides
  const allLanguages = Array.from(new Set(guides.flatMap(g => g.languages || [])));
  const allServiceTypes = Array.from(
    new Set(
      guides.flatMap(g => Array.isArray(g.service_type) ? g.service_type : (g.service_type ? [g.service_type] : []))
    )
  );
  const experienceOptions = [
    { label: 'Any', value: 'any' },
    { label: '0-1 years', value: '0-1' },
    { label: '2-5 years', value: '2-5' },
    { label: '6-10 years', value: '6-10' },
    { label: '10+ years', value: '10+' },
  ];

  // Add selectedGuidesDetails state
  const [selectedGuidesDetails, setSelectedGuidesDetails] = useState<{
    [guideId: string]: {
      serviceType: string;
      date?: string;
      numberOfPeople?: number;
      specialRequests?: string;
    }
  }>({});

  // Helper to get price for a guide and selected service type
  const getGuideServicePrice = (guide, serviceType) => {
    if (!guide.service_prices || !serviceType) return 0;
    const price = guide.service_prices[serviceType];
    return price ? (typeof price === 'string' ? parseFloat(price) : Number(price)) : 0;
  };

  // Helper to get subtotal for a guide
  const getGuideSubtotal = (guide, details) => {
    const price = getGuideServicePrice(guide, details?.serviceType);
    const qty = details?.numberOfPeople || 1;
    return price * qty;
  };

  // Helper to get total order value
  const getOrderTotal = () => {
    return selectedGuides.reduce((sum, guide) => {
      const details = selectedGuidesDetails[guide.id];
      return sum + getGuideSubtotal(guide, details);
    }, 0);
  };

  // Helper to get the minimum price for a guide (used in guide card rendering)
  const getMinPrice = (guide) => {
    if (!guide.service_prices) return Infinity;
    const prices = Object.values(guide.service_prices)
      .map(p => typeof p === 'string' ? parseFloat(p) : Number(p))
      .filter(p => !isNaN(p));
    return prices.length > 0 ? Math.min(...prices) : Infinity;
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guide_services')
        .select('*')
        .eq('status', 'active')
        .order('rating', { ascending: false });

      if (error) throw error;
      setGuides(data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
      toast({
        title: "Error",
        description: "Failed to fetch guide services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Filter and sort guides
  const filteredGuides = guides.filter(guide => {
    // Language filter
    if (filterLanguage.length > 0 && !(guide.languages || []).some(l => filterLanguage.includes(l))) return false;
    // Service type filter (handle array or string)
    if (
      filterServiceType.length > 0 &&
      !(
        Array.isArray(guide.service_type)
          ? guide.service_type.some(type => filterServiceType.includes(type))
          : filterServiceType.includes(guide.service_type)
      )
    ) return false;
    // Experience filter (assume guide.experience is a string like '5 years')
    if (filterExperience !== 'any') {
      const years = parseInt((guide.experience || '').split(' ')[0]);
      if (filterExperience === '0-1' && !(years >= 0 && years <= 1)) return false;
      if (filterExperience === '2-5' && !(years >= 2 && years <= 5)) return false;
      if (filterExperience === '6-10' && !(years >= 6 && years <= 10)) return false;
      if (filterExperience === '10+' && !(years > 10)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortOption === 'price_asc') {
      return getMinPrice(a) - getMinPrice(b);
    } else if (sortOption === 'price_desc') {
      return getMinPrice(b) - getMinPrice(a);
    } else if (sortOption === 'rating_asc') {
      return (a.rating || 0) - (b.rating || 0);
    } else {
      // Default: rating_desc
      return (b.rating || 0) - (a.rating || 0);
    }
  });

  // Filter out unwanted service types from the filter UI
  const filteredServiceTypes = allServiceTypes.filter(type => !['Group Guide', 'Personal Guide', 'Ziarath Guide'].includes(type));

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGuides.length === 0 || !bookingDate) {
      toast({
        title: "Error",
        description: "Please select at least one guide and a date",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      for (const guide of selectedGuides) {
      const bookingData = {
        ...bookingForm,
          guide_id: guide.id,
        service_date: bookingDate,
        status: 'pending'
      };
        // TODO: submit bookingData to backend (Supabase or API)
      }
      toast({
        title: "Success",
        description: "Your guide booking request(s) have been submitted! We'll contact you within 24 hours to confirm details.",
      });
      // Reset form
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        numberOfPeople: 1,
        specialRequests: '',
        serviceType: ''
      });
      setSelectedGuides([]);
      setBookingDate(undefined);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking request(s)",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedGuides.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one guide to continue",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(Math.min(currentStep + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Licensed Professional Guides</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
            Expert Guide Services
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Certified multilingual guides for your spiritual journey.
          </p>
        </div>
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= step 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-10 h-0.5 ${currentStep > step ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Filter Bar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters Card */}
            <Card className="sticky top-4 mb-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Filter Guides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <div className="flex flex-wrap gap-2">
                    {allLanguages.map(lang => (
                      <Button
                        key={lang}
                        size="sm"
                        variant={filterLanguage.includes(lang) ? 'default' : 'outline'}
                        onClick={() => setFilterLanguage(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])}
                        className="text-xs"
                      >
                        {lang}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <Select value={filterExperience} onValueChange={setFilterExperience}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Service Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <div className="flex flex-wrap gap-2">
                    {filteredServiceTypes.map(type => (
                      <Button
                        key={type}
                        size="sm"
                        variant={filterServiceType.includes(type) ? 'default' : 'outline'}
                        onClick={() => setFilterServiceType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                        className="text-xs capitalize"
                      >
                        {type.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Clear Filters Button */}
                <Button variant="outline" onClick={() => { setFilterLanguage([]); setFilterExperience('any'); setFilterServiceType([]); }} className="w-full border-gray-300 text-gray-600 text-xs">Clear All</Button>
              </CardContent>
            </Card>
        </div>

          {/* Guide Cards */}
          <div className="lg:col-span-6">
            {currentStep === 1 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Award className="w-5 h-5 mr-2 text-emerald-600" />
                    Choose Your Guide(s)
                </h2>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
                      <SelectItem value="rating_asc">Rating: Low to High</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : filteredGuides.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-gray-500">No guides match your filters.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredGuides.map((guide) => {
                      const isSelected = selectedGuides.some(g => g.id === guide.id);
                      // Calculate the lowest price for this guide
                      const minPrice = getMinPrice(guide);
                      return (
                      <Card 
                        key={guide.id} 
                          className={`transition-all duration-300 hover:shadow-xl ${
                            isSelected ? 'ring-2 ring-emerald-500 shadow-lg' : 'hover:shadow-md'
                          }`}
                        >
                          <CardContent className="p-4 flex items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center overflow-hidden mr-4">
                              {guide.guide_photo ? (
                                <img src={guide.guide_photo} alt={guide.guide_name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-8 h-8 text-emerald-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">{guide.guide_name}</h3>
                                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  <span className="text-xs font-medium">{guide.rating}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{guide.guide_city}</span>
                                <span className="flex items-center"><Languages className="w-3 h-3 mr-1" />{guide.languages?.join(', ')}</span>
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{guide.experience}</span>
                              </div>
                              <p className="text-gray-700 text-xs mb-1 line-clamp-2">{guide.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {guide.specializations?.map((spec, index) => (
                                  <Badge key={index} variant="outline" className="text-[10px]">{spec}</Badge>
                                ))}
                              </div>
                              {/* Show starting price above Add/Remove button */}
                              {minPrice !== Infinity && (
                                <div className="text-xs font-semibold text-emerald-700 mb-2">
                                  Starting from <span className="font-bold text-base">${minPrice}</span>
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant={isSelected ? 'secondary' : 'outline'}
                              className="ml-4"
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedGuides(prev =>
                                  isSelected
                                    ? prev.filter(g => g.id !== guide.id)
                                    : [...prev, guide]
                                );
                                if (!isSelected) {
                                  const availableTypes = Array.isArray(guide.service_type) ? guide.service_type : (guide.service_type ? [guide.service_type] : []);
                                  setSelectedGuidesDetails(prev => ({
                                    ...prev,
                                    [guide.id]: {
                                      ...prev[guide.id],
                                      serviceType: availableTypes[0] || '',
                                      numberOfPeople: 1,
                                      specialRequests: '',
                                    }
                                  }));
                                }
                              }}
                            >
                              {isSelected ? 'Remove' : 'Add'}
                            </Button>
                        </CardContent>
                      </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && selectedGuides.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Service Details</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-emerald-800 mb-2">{selectedGuides[0].guide_name}</h4>
                      <p className="text-emerald-700 text-sm">{selectedGuides[0].guide_city} • {selectedGuides[0].experience}</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="serviceType">Service Type</Label>
                        <Select value={bookingForm.serviceType} onValueChange={(value) => setBookingForm({...bookingForm, serviceType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ziarath">Ziarath Tour Guide</SelectItem>
                            <SelectItem value="city_tour">City Tour Guide</SelectItem>
                            <SelectItem value="religious_guidance">Religious Guidance</SelectItem>
                            <SelectItem value="airport_assistance">Airport Assistance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Preferred Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !bookingDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {bookingDate ? format(bookingDate, "PPP") : "Select your preferred date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={bookingDate}
                              onSelect={setBookingDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="numberOfPeople">Number of People</Label>
                        <Input
                          id="numberOfPeople"
                          type="number"
                          min="1"
                          max="20"
                          value={bookingForm.numberOfPeople}
                          onChange={(e) => setBookingForm({...bookingForm, numberOfPeople: parseInt(e.target.value)})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Special Requirements</Label>
                        <Textarea
                          id="specialRequests"
                          value={bookingForm.specialRequests}
                          onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                          placeholder="Any specific needs, accessibility requirements, or preferences..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && selectedGuides.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleBooking} className="space-y-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                          required
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                        {isLoading ? 'Submitting Request...' : 'Confirm Booking Request'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Selected Guides Cart (right) */}
          <div className="lg:col-span-3">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Selected Guides ({selectedGuides.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedGuides.length > 0 ? (
                  <div className="space-y-4">
                    {selectedGuides.map(guide => {
                      const details = selectedGuidesDetails[guide.id] || {};
                      const availableTypes = Array.isArray(guide.service_type) ? guide.service_type : (guide.service_type ? [guide.service_type] : []);
                      const price = getGuideServicePrice(guide, details.serviceType);
                      const subtotal = getGuideSubtotal(guide, details);
                      return (
                        <div key={guide.id} className="bg-emerald-50 rounded p-3 mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-emerald-800 text-sm">{guide.guide_name}</span>
                            <Button size="icon" variant="ghost" onClick={() => setSelectedGuides(prev => prev.filter(g => g.id !== guide.id))}>
                              ✕
                            </Button>
                          </div>
                          <div className="text-xs text-emerald-600 mb-2">{guide.guide_city}</div>
                          {/* Service Type Dropdown */}
                          <div className="mb-2">
                            <label className="block text-xs font-medium mb-1">Service Type</label>
                            <Select
                              value={details.serviceType || ''}
                              onValueChange={val => setSelectedGuidesDetails(prev => ({
                                ...prev,
                                [guide.id]: { ...prev[guide.id], serviceType: val }
                              }))}
                            >
                              <SelectTrigger className="w-full text-xs">
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTypes.map(type => (
                                  <SelectItem key={type} value={type} className="capitalize text-xs">
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                      </div>
                          {/* Number of People */}
                          <div className="mb-2">
                            <label className="block text-xs font-medium mb-1">Number of People</label>
                            <Input
                              type="number"
                              min={1}
                              value={details.numberOfPeople || 1}
                              onChange={e => setSelectedGuidesDetails(prev => ({
                                ...prev,
                                [guide.id]: { ...prev[guide.id], numberOfPeople: parseInt(e.target.value) || 1 }
                              }))}
                              className="w-20 text-xs"
                            />
                    </div>
                          {/* Show price for selected type */}
                          {details.serviceType && (
                            <div className="text-xs mb-1">
                              Price: <span className="font-semibold">${price}</span>
                      </div>
                    )}
                          {/* Subtotal */}
                          {details.serviceType && (
                            <div className="text-xs font-bold text-emerald-700">
                              Subtotal: ${subtotal}
                      </div>
                    )}
                      </div>
                      );
                    })}
                    {/* Order Total */}
                    <div className="border-t pt-3 mt-3 text-right">
                      <span className="font-semibold text-emerald-800">Order Total: ${getOrderTotal()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <User className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No guides selected</p>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                      Previous
                    </Button>
                  )}
                  {currentStep < 3 && (
                    <Button onClick={nextStep} className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={selectedGuides.length === 0}>
                      Next Step
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GuideBooking;
