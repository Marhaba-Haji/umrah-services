
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
import { CalendarIcon, MapPin, Clock, Users, Star, Bookmark, CheckCircle, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ZiarathService {
  id: string;
  title: string;
  location: string;
  ziarath_type: string;
  description: string;
  duration: string;
  price: number;
  max_participants: number;
  inclusions: string[];
  significance: string;
  historical_importance: string;
  best_time: string;
  images: string[];
}

const ZiarathBooking = () => {
  const [ziarathServices, setZiarathServices] = useState<ZiarathService[]>([]);
  const [selectedService, setSelectedService] = useState<ZiarathService | null>(null);
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
    preferredTime: ''
  });

  useEffect(() => {
    fetchZiarathServices();
  }, []);

  const fetchZiarathServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ziarath_services')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });

      if (error) throw error;
      setZiarathServices(data || []);
    } catch (error) {
      console.error('Error fetching ziarath services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ziarath services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !bookingDate) {
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
        service_id: selectedService.id,
        service_date: bookingDate,
        total_amount: selectedService.price * bookingForm.numberOfPeople,
        status: 'pending'
      };

      console.log('Ziarath booking data:', bookingData);
      
      toast({
        title: "Success",
        description: "Your ziarath booking has been submitted! We'll send you confirmation details within 24 hours.",
      });

      // Reset form
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        numberOfPeople: 1,
        specialRequests: '',
        preferredTime: ''
      });
      setSelectedService(null);
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
    if (currentStep === 1 && !selectedService) {
      toast({
        title: "Selection Required",
        description: "Please select a ziarath tour to continue",
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 rounded-full px-4 py-2 mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Sacred Journey Tours</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ziarath Tours
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Walk in the footsteps of our beloved Prophet (PBUH) and explore the sacred sites that shaped Islamic history with our expertly guided ziarath tours.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ${currentStep > step ? 'bg-purple-600' : 'bg-gray-200'}`} />
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
                  <Bookmark className="w-6 h-6 mr-3 text-purple-600" />
                  Select Your Sacred Journey
                </h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : ziarathServices.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">No ziarath tours available at the moment.</p>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {ziarathServices.map((service) => (
                      <Card 
                        key={service.id} 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                          selectedService?.id === service.id 
                            ? 'ring-2 ring-purple-500 shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedService(service)}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{service.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{service.duration}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Users className="w-4 h-4" />
                                  <span className="text-sm">Max {service.max_participants} people</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <div className="text-2xl font-bold text-purple-600">${service.price}</div>
                              <div className="text-sm text-gray-500">per person</div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">{service.description}</p>

                          <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h4 className="font-semibold text-sm mb-2 text-purple-800">Historical Significance:</h4>
                              <p className="text-sm text-gray-600">{service.historical_importance}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm mb-2 text-purple-800">Religious Significance:</h4>
                              <p className="text-sm text-gray-600">{service.significance}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline">{service.ziarath_type}</Badge>
                              <Badge variant="secondary">Best: {service.best_time}</Badge>
                            </div>
                            
                            {service.inclusions && service.inclusions.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {service.inclusions.slice(0, 3).map((inclusion, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {inclusion}
                                  </Badge>
                                ))}
                                {service.inclusions.length > 3 && (
                                  <span className="text-xs text-gray-500">+{service.inclusions.length - 3} more</span>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && selectedService && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Tour Details</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-purple-800 mb-2">{selectedService.title}</h4>
                      <p className="text-purple-700 text-sm">{selectedService.location} • {selectedService.duration}</p>
                    </div>

                    <div className="space-y-6">
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
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Select value={bookingForm.preferredTime} onValueChange={(value) => setBookingForm({...bookingForm, preferredTime: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (1:00 PM - 5:00 PM)</SelectItem>
                            <SelectItem value="evening">Evening (6:00 PM - 10:00 PM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="numberOfPeople">Number of People</Label>
                        <Input
                          id="numberOfPeople"
                          type="number"
                          min="1"
                          max={selectedService.max_participants}
                          value={bookingForm.numberOfPeople}
                          onChange={(e) => setBookingForm({...bookingForm, numberOfPeople: parseInt(e.target.value)})}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum {selectedService.max_participants} participants per tour
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Special Requirements</Label>
                        <Textarea
                          id="specialRequests"
                          value={bookingForm.specialRequests}
                          onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                          placeholder="Any special needs, accessibility requirements, or questions..."
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

                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                        {isLoading ? 'Submitting Request...' : 'Confirm Ziarath Booking'}
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
                {selectedService ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">{selectedService.title}</h4>
                      <p className="text-sm text-purple-600">{selectedService.location}</p>
                      <p className="text-sm text-purple-600">Duration: {selectedService.duration}</p>
                    </div>

                    {bookingDate && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{format(bookingDate, "PPP")}</p>
                      </div>
                    )}

                    {bookingForm.preferredTime && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-medium capitalize">{bookingForm.preferredTime}</p>
                      </div>
                    )}

                    {bookingForm.numberOfPeople > 0 && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Group Size</p>
                        <p className="font-medium">{bookingForm.numberOfPeople} {bookingForm.numberOfPeople === 1 ? 'Person' : 'People'}</p>
                      </div>
                    )}

                    <div className="p-3 bg-gray-50 rounded-lg border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-xl font-bold text-purple-600">
                          ${(selectedService.price * bookingForm.numberOfPeople).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Tour Includes:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Expert religious guide</li>
                        <li>• Historical context & stories</li>
                        <li>• Prayer time coordination</li>
                        <li>• Transportation (if applicable)</li>
                        <li>• Group coordination</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a tour to see booking details</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                      Previous
                    </Button>
                  )}
                  {currentStep < 3 && (
                    <Button onClick={nextStep} className="flex-1 bg-purple-600 hover:bg-purple-700">
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

export default ZiarathBooking;
