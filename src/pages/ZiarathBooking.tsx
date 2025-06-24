
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
import { CalendarIcon, MapPin, Clock, Users, Star } from 'lucide-react';
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
        description: "Please select a service and date",
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
        description: "Ziarath booking request submitted successfully! We'll contact you soon.",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ziarath Services</h1>
          <p className="text-xl text-gray-600">Visit historical and religious sites with expert guidance</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Services */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Available Ziarath Tours</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading services...</div>
            ) : ziarathServices.length === 0 ? (
              <div className="text-center py-8">No ziarath services available</div>
            ) : (
              <div className="grid gap-6">
                {ziarathServices.map((service) => (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedService?.id === service.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{service.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{service.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>Max {service.max_participants} people</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">${service.price}</div>
                          <div className="text-sm text-gray-500">per person</div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{service.description}</p>

                      <div className="mb-4">
                        <Badge variant="outline" className="mr-2">{service.ziarath_type}</Badge>
                        <Badge variant="secondary">Best time: {service.best_time}</Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Historical Significance:</h4>
                          <p className="text-sm text-gray-600">{service.historical_importance}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Religious Significance:</h4>
                          <p className="text-sm text-gray-600">{service.significance}</p>
                        </div>

                        {service.inclusions && service.inclusions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Inclusions:</h4>
                            <div className="flex flex-wrap gap-1">
                              {service.inclusions.map((inclusion, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {inclusion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Ziarath Tour</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedService ? (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg mb-4">
                      <h4 className="font-semibold text-purple-800">{selectedService.title}</h4>
                      <p className="text-sm text-purple-600">{selectedService.location}</p>
                      <p className="text-sm text-purple-600">Duration: {selectedService.duration}</p>
                    </div>

                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                        required
                      />
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
                            {bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
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
                        Max {selectedService.max_participants} participants
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-xl font-bold text-purple-600">
                          ${(selectedService.price * bookingForm.numberOfPeople).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                        placeholder="Any special requirements or questions..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                      {isLoading ? 'Submitting...' : 'Book Ziarath Tour'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a ziarath service to proceed with booking
                  </div>
                )}
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
