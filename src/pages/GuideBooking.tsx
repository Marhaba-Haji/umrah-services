
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
  service_type: string;
  languages: string[];
  rating: number;
  experience: string;
  specializations: string[];
  service_prices: any;
  description: string;
  availability_schedule: any;
}

const GuideBooking = () => {
  const [guides, setGuides] = useState<GuideService[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<GuideService | null>(null);
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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuide || !bookingDate) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        ...bookingForm,
        guide_id: selectedGuide.id,
        service_date: bookingDate,
        status: 'pending'
      };

      console.log('Booking data:', bookingData);
      
      toast({
        title: "Success",
        description: "Your guide booking request has been submitted! We'll contact you within 24 hours to confirm details.",
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
      setSelectedGuide(null);
      setBookingDate(undefined);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedGuide) {
      toast({
        title: "Selection Required",
        description: "Please select a guide to continue",
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
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Licensed Professional Guides</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Expert Guide Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the holy cities with certified multilingual guides who'll enrich your spiritual journey with deep knowledge and personalized attention.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ${currentStep > step ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-emerald-600" />
                  Choose Your Guide
                </h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : guides.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">No guides available at the moment.</p>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {guides.map((guide) => (
                      <Card 
                        key={guide.id} 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                          selectedGuide?.id === guide.id 
                            ? 'ring-2 ring-emerald-500 shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedGuide(guide)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center overflow-hidden">
                              {guide.guide_photo ? (
                                <img src={guide.guide_photo} alt={guide.guide_name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-10 h-10 text-emerald-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-semibold text-gray-900">{guide.guide_name}</h3>
                                <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm font-medium">{guide.rating}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{guide.guide_city}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Languages className="w-4 h-4" />
                                  <span className="text-sm">{guide.languages?.join(', ')}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{guide.experience}</span>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-4">{guide.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {guide.specializations?.map((spec, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && selectedGuide && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Service Details</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-emerald-800 mb-2">{selectedGuide.guide_name}</h4>
                      <p className="text-emerald-700 text-sm">{selectedGuide.guide_city} • {selectedGuide.experience}</p>
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
                            <SelectItem value="translation">Translation Service</SelectItem>
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

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedGuide ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-semibold text-emerald-800">{selectedGuide.guide_name}</h4>
                      <p className="text-sm text-emerald-600">{selectedGuide.guide_city}</p>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm">{selectedGuide.rating} Rating</span>
                      </div>
                    </div>

                    {bookingForm.serviceType && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Service Type</p>
                        <p className="font-medium capitalize">{bookingForm.serviceType.replace('_', ' ')}</p>
                      </div>
                    )}

                    {bookingDate && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{format(bookingDate, "PPP")}</p>
                      </div>
                    )}

                    {bookingForm.numberOfPeople > 0 && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Group Size</p>
                        <p className="font-medium">{bookingForm.numberOfPeople} {bookingForm.numberOfPeople === 1 ? 'Person' : 'People'}</p>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">What's Included:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Professional licensed guide</li>
                        <li>• Multilingual assistance</li>
                        <li>• Historical & religious insights</li>
                        <li>• Prayer time guidance</li>
                        <li>• Local recommendations</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a guide to see booking details</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                      Previous
                    </Button>
                  )}
                  {currentStep < 3 && (
                    <Button onClick={nextStep} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
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
