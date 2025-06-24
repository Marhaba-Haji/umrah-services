
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
import { CalendarIcon, User, Star, Languages, MapPin } from 'lucide-react';
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
        description: "Please select a guide and date",
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

      // Here you would typically save to a bookings table
      console.log('Booking data:', bookingData);
      
      toast({
        title: "Success",
        description: "Guide booking request submitted successfully! We'll contact you soon.",
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Guide Services</h1>
          <p className="text-xl text-gray-600">Book experienced multilingual guides for your spiritual journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Guides */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Available Guides</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading guides...</div>
            ) : guides.length === 0 ? (
              <div className="text-center py-8">No guides available</div>
            ) : (
              <div className="grid gap-6">
                {guides.map((guide) => (
                  <Card 
                    key={guide.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedGuide?.id === guide.id ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {guide.guide_photo ? (
                            <img src={guide.guide_photo} alt={guide.guide_name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold">{guide.guide_name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{guide.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{guide.guide_city}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Languages className="w-4 h-4" />
                              <span>{guide.languages?.join(', ')}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{guide.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {guide.specializations?.map((spec, index) => (
                              <Badge key={index} variant="outline">{spec}</Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Experience:</strong> {guide.experience}
                          </div>
                        </div>
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
                <CardTitle>Book Your Guide</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedGuide ? (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg mb-4">
                      <h4 className="font-semibold text-emerald-800">{selectedGuide.guide_name}</h4>
                      <p className="text-sm text-emerald-600">{selectedGuide.guide_city}</p>
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
                      <Label htmlFor="serviceType">Service Type</Label>
                      <Select value={bookingForm.serviceType} onValueChange={(value) => setBookingForm({...bookingForm, serviceType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ziarath">Ziarath Tour</SelectItem>
                          <SelectItem value="city_tour">City Tour</SelectItem>
                          <SelectItem value="religious_guidance">Religious Guidance</SelectItem>
                          <SelectItem value="translation">Translation Service</SelectItem>
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
                      <Label htmlFor="numberOfPeople">Number of People</Label>
                      <Input
                        id="numberOfPeople"
                        type="number"
                        min="1"
                        value={bookingForm.numberOfPeople}
                        onChange={(e) => setBookingForm({...bookingForm, numberOfPeople: parseInt(e.target.value)})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                        placeholder="Any special requirements or preferences..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Submitting...' : 'Book Guide'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a guide to proceed with booking
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

export default GuideBooking;
