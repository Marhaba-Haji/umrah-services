
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, Clock, CheckCircle, Users, Briefcase, Plane, GraduationCap, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCurrency } from '../components/Header';

interface VisaType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  processingTime: string;
  validity: string;
  price: number;
  requirements: string[];
  features: string[];
  color: string;
}

const OtherSaudiVisas = () => {
  const { currency } = useCurrency();
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);
  const [applicationDate, setApplicationDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Currency conversion rates (base USD)
  const exchangeRates = {
    USD: 1,
    INR: 83.5,
    SAR: 3.75
  };

  const currencySymbols = {
    USD: '$',
    INR: '₹',
    SAR: 'ر.س'
  };

  const currencySymbol = currencySymbols[currency] || '$';
  const rate = exchangeRates[currency] || 1;

  const [applicationForm, setApplicationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    purpose: '',
    duration: '',
    specialRequests: ''
  });

  const visaTypes: VisaType[] = [
    {
      id: 'family-visit',
      name: 'Family Visit Visa',
      icon: Heart,
      description: 'Visit your family members residing in Saudi Arabia',
      processingTime: '5-7 days',
      validity: '90 days',
      price: 199,
      color: 'rose',
      requirements: [
        'Valid passport (6+ months validity)',
        'Family invitation letter',
        'Sponsor documents',
        'Relationship proof',
        'Accommodation details'
      ],
      features: [
        'Multiple entry options',
        'Extended validity',
        'Family reunion purpose',
        'Renewable'
      ]
    },
    {
      id: 'tourist',
      name: 'Tourist Visa',
      icon: Plane,
      description: 'Explore Saudi Arabia\'s heritage and modern attractions',
      processingTime: '3-5 days',
      validity: '1 year',
      price: 149,
      color: 'blue',
      requirements: [
        'Valid passport (6+ months validity)',
        'Travel itinerary',
        'Hotel bookings',
        'Return flight tickets',
        'Travel insurance'
      ],
      features: [
        'Multiple entry',
        'Tourism activities allowed',
        'Online application',
        '90 days per visit'
      ]
    },
    {
      id: 'business',
      name: 'Business Visa',
      icon: Briefcase,
      description: 'Conduct business meetings and commercial activities',
      processingTime: '3-5 days',
      validity: '90 days',
      price: 299,
      color: 'emerald',
      requirements: [
        'Valid passport (6+ months validity)',
        'Business invitation letter',
        'Company registration',
        'Purpose of visit letter',
        'Meeting schedules'
      ],
      features: [
        'Business activities allowed',
        'Company sponsorship',
        'Meeting attendance',
        'Commercial purposes'
      ]
    },
    {
      id: 'student',
      name: 'Student Visa',
      icon: GraduationCap,
      description: 'Study at recognized educational institutions',
      processingTime: '7-10 days',
      validity: '1 year',
      price: 179,
      color: 'purple',
      requirements: [
        'Valid passport (6+ months validity)',
        'University admission letter',
        'Academic transcripts',
        'Financial proof',
        'Medical certificate'
      ],
      features: [
        'University admission required',
        'Renewable annually',
        'Part-time work allowed',
        'Student benefits'
      ]
    },
    {
      id: 'job-waqala',
      name: 'Job Waqala Visa',
      icon: Users,
      description: 'Legal representation and business delegation',
      processingTime: '5-7 days',
      validity: '30 days',
      price: 399,
      color: 'orange',
      requirements: [
        'Valid passport (6+ months validity)',
        'Legal authorization letter',
        'Business delegation documents',
        'Sponsor company details',
        'Purpose specification'
      ],
      features: [
        'Legal representation',
        'Business delegation',
        'Special authorization',
        'Professional purposes'
      ]
    }
  ];

  const handleApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisa || !applicationDate) {
      toast({
        title: "Error",
        description: "Please select a visa type and application date",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const applicationData = {
        ...applicationForm,
        visaType: selectedVisa.id,
        applicationDate: applicationDate,
        status: 'pending'
      };

      console.log('Visa application data:', applicationData);
      
      toast({
        title: "Success",
        description: "Visa application submitted successfully! We'll contact you soon with next steps.",
      });

      // Reset form
      setApplicationForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nationality: '',
        passportNumber: '',
        dateOfBirth: '',
        purpose: '',
        duration: '',
        specialRequests: ''
      });
      setSelectedVisa(null);
      setApplicationDate(undefined);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit visa application",
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
          <Badge className="bg-blue-100 text-blue-800 mb-4 px-4 py-2">
            🇸🇦 Saudi Arabia Services
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Other Saudi Visa Services</h1>
          <p className="text-xl text-gray-600">Professional visa processing for all types of travel to Saudi Arabia</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visa Types */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Available Visa Types</h2>
            <div className="grid gap-6">
              {visaTypes.map((visa) => {
                const convertedPrice = Math.round(visa.price * rate);
                const IconComponent = visa.icon;
                return (
                  <Card 
                    key={visa.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedVisa?.id === visa.id ? `ring-2 ring-${visa.color}-500` : ''
                    }`}
                    onClick={() => setSelectedVisa(visa)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-16 h-16 rounded-full bg-${visa.color}-100 flex items-center justify-center`}>
                          <IconComponent className={`w-8 h-8 text-${visa.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold">{visa.name}</h3>
                            <div className="text-right">
                              <div className={`text-2xl font-bold text-${visa.color}-600`}>
                                {currencySymbol}{convertedPrice.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">from</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{visa.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span><strong>Processing:</strong> {visa.processingTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span><strong>Validity:</strong> {visa.validity}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Features:</h4>
                              <div className="flex flex-wrap gap-2">
                                {visa.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {visa.requirements.slice(0, 3).map((req, index) => (
                                  <li key={index} className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                                {visa.requirements.length > 3 && (
                                  <li className="text-gray-500">
                                    +{visa.requirements.length - 3} more requirements
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Apply for Visa</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedVisa ? (
                  <form onSubmit={handleApplication} className="space-y-4">
                    <div className={`p-4 bg-${selectedVisa.color}-50 rounded-lg mb-4`}>
                      <h4 className={`font-semibold text-${selectedVisa.color}-800`}>{selectedVisa.name}</h4>
                      <p className={`text-sm text-${selectedVisa.color}-600`}>
                        Processing: {selectedVisa.processingTime}
                      </p>
                      <p className={`text-sm text-${selectedVisa.color}-600`}>
                        Validity: {selectedVisa.validity}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={applicationForm.firstName}
                          onChange={(e) => setApplicationForm({...applicationForm, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={applicationForm.lastName}
                          onChange={(e) => setApplicationForm({...applicationForm, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={applicationForm.nationality}
                        onChange={(e) => setApplicationForm({...applicationForm, nationality: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <Input
                        id="passportNumber"
                        value={applicationForm.passportNumber}
                        onChange={(e) => setApplicationForm({...applicationForm, passportNumber: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={applicationForm.dateOfBirth}
                        onChange={(e) => setApplicationForm({...applicationForm, dateOfBirth: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label>Application Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !applicationDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {applicationDate ? format(applicationDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={applicationDate}
                            onSelect={setApplicationDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="purpose">Purpose of Visit</Label>
                      <Textarea
                        id="purpose"
                        value={applicationForm.purpose}
                        onChange={(e) => setApplicationForm({...applicationForm, purpose: e.target.value})}
                        placeholder="Describe the purpose of your visit..."
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration of Stay</Label>
                      <Input
                        id="duration"
                        value={applicationForm.duration}
                        onChange={(e) => setApplicationForm({...applicationForm, duration: e.target.value})}
                        placeholder="e.g., 2 weeks, 1 month"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={applicationForm.specialRequests}
                        onChange={(e) => setApplicationForm({...applicationForm, specialRequests: e.target.value})}
                        placeholder="Any special requirements or notes..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className={`w-full bg-${selectedVisa.color}-600 hover:bg-${selectedVisa.color}-700`} disabled={isLoading}>
                      {isLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a visa type to proceed with your application
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

export default OtherSaudiVisas;
