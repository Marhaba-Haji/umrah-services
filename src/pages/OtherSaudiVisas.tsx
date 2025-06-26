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
import { CalendarIcon, FileText, Clock, CheckCircle, Users, Briefcase, Plane, GraduationCap, Heart, Shield, Award } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCurrency } from '../components/Header';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../integrations/supabase/types';

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
  category: string;
}

const OtherSaudiVisas = () => {
  const { currency } = useCurrency();
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);
  const [applicationDate, setApplicationDate] = useState<Date>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [umrahVisas, setUmrahVisas] = useState<Database['public']['Tables']['saudi_visas']['Row'][]>([]);
  const [umrahLoading, setUmrahLoading] = useState(true);
  const [otherVisas, setOtherVisas] = useState<Database['public']['Tables']['saudi_visas']['Row'][]>([]);
  const [otherVisasLoading, setOtherVisasLoading] = useState(true);

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
      processingTime: '5-7 business days',
      validity: '90 days',
      price: 199,
      color: 'rose',
      category: 'Personal',
      requirements: [
        'Valid passport (6+ months validity)',
        'Family invitation letter with attestation',
        'Sponsor employment certificate',
        'Family relationship proof documents',
        'Accommodation details and address',
        'Sponsor salary certificate',
        'Medical insurance coverage'
      ],
      features: [
        'Multiple entry options available',
        'Extendable validity period',
        'Family reunion purposes',
        'Renewable under conditions'
      ]
    },
    {
      id: 'tourist',
      name: 'Tourist Visa',
      icon: Plane,
      description: 'Explore Saudi Arabia\'s heritage and modern attractions',
      processingTime: '3-5 business days',
      validity: '1 year',
      price: 149,
      color: 'blue',
      category: 'Tourism',
      requirements: [
        'Valid passport (6+ months validity)',
        'Detailed travel itinerary',
        'Hotel bookings confirmation',
        'Return flight tickets',
        'Travel insurance policy',
        'Bank statements (3 months)',
        'Employment certificate'
      ],
      features: [
        'Multiple entry permitted',
        'Tourism activities allowed',
        'Online application process',
        '90 days per visit maximum'
      ]
    },
    {
      id: 'business',
      name: 'Business Visa',
      icon: Briefcase,
      description: 'Conduct business meetings and commercial activities',
      processingTime: '3-5 business days',
      validity: '90 days',
      price: 299,
      color: 'emerald',
      category: 'Business',
      requirements: [
        'Valid passport (6+ months validity)',
        'Business invitation letter',
        'Company registration documents',
        'Purpose of visit detailed letter',
        'Meeting schedules and contacts',
        'Financial guarantee documents',
        'Chamber of Commerce certificate'
      ],
      features: [
        'Business activities permitted',
        'Company sponsorship support',
        'Meeting attendance allowed',
        'Commercial negotiation purposes'
      ]
    },
    {
      id: 'student',
      name: 'Student Visa',
      icon: GraduationCap,
      description: 'Study at recognized educational institutions',
      processingTime: '7-10 business days',
      validity: '1 year',
      price: 179,
      color: 'purple',
      category: 'Education',
      requirements: [
        'Valid passport (6+ months validity)',
        'University admission letter',
        'Academic transcripts and certificates',
        'Financial capability proof',
        'Medical examination certificate',
        'Educational background verification',
        'Guardian consent (if under 18)'
      ],
      features: [
        'University admission required',
        'Renewable annually',
        'Part-time work permissions',
        'Student support services'
      ]
    },
    {
      id: 'job-waqala',
      name: 'Job Waqala Visa',
      icon: Users,
      description: 'Legal representation and business delegation',
      processingTime: '5-7 business days',
      validity: '30 days',
      price: 399,
      color: 'orange',
      category: 'Professional',
      requirements: [
        'Valid passport (6+ months validity)',
        'Legal authorization letter',
        'Business delegation documents',
        'Sponsor company details',
        'Purpose specification letter',
        'Professional qualifications',
        'Legal representation agreement'
      ],
      features: [
        'Legal representation rights',
        'Business delegation authority',
        'Special authorization privileges',
        'Professional service purposes'
      ]
    }
  ];

  useEffect(() => {
    async function fetchUmrahVisas() {
      setUmrahLoading(true);
      const { data, error } = await supabase
        .from('saudi_visas')
        .select('*')
        .eq('visa_type', 'Umrah Visa')
        .in('visa_category', ['Standard', 'Premium', 'Express'])
        .eq('status', 'active');
      if (error) {
        console.error('Supabase error:', error);
      }
      if (!error && data) {
        setUmrahVisas(data);
        console.log('Umrah Visas:', data);
      } else {
        setUmrahVisas([]);
        console.log('No Umrah visas found or error occurred.');
      }
      setUmrahLoading(false);
    }
    console.log('Fetching Umrah visas...');
    fetchUmrahVisas();
  }, []);

  useEffect(() => {
    async function fetchOtherVisas() {
      setOtherVisasLoading(true);
      const { data, error } = await supabase
        .from('saudi_visas')
        .select('*')
        .neq('visa_type', 'Umrah Visa')
        .eq('status', 'active');
      if (error) {
        console.error('Supabase error (other visas):', error);
      }
      if (!error && data) {
        setOtherVisas(data);
        console.log('Other Visas:', data);
      } else {
        setOtherVisas([]);
        console.log('No other visas found or error occurred.');
      }
      setOtherVisasLoading(false);
    }
    fetchOtherVisas();
  }, []);

  const handleApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisa || !applicationDate) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
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
        estimatedCost: Math.round(selectedVisa.price * rate),
        status: 'pending'
      };

      console.log('Visa application data:', applicationData);
      
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application and contact you within 24 hours with next steps and document requirements.",
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
      setCurrentStep(1);
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

  const nextStep = () => {
    if (currentStep === 1 && !selectedVisa) {
      toast({
        title: "Selection Required",
        description: "Please select a visa type to continue",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(Math.min(currentStep + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const groupedVisas = visaTypes.reduce((acc, visa) => {
    if (!acc[visa.category]) acc[visa.category] = [];
    acc[visa.category].push(visa);
    return acc;
  }, {} as Record<string, VisaType[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">🇸🇦 Official Saudi Arabia Services</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Saudi Visa Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional visa processing for all types of travel to Saudi Arabia. Fast, reliable, and hassle-free service with expert guidance.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <>
                {/* Existing Visa Cards */}
                <div>
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Award className="w-6 h-6 mr-3 text-blue-600" />
                    Choose Your Visa Type
                  </h2>
                  {otherVisasLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : otherVisas.length === 0 ? (
                    <div className="text-center text-red-500 py-8">No other visa options found. Please check your Supabase data for non-Umrah Visa records with status = 'active'.</div>
                  ) : (
                    <div>
                      {/* Group by visa_category for section headers if desired, or just list all */}
                      {otherVisas.map((visa) => {
                        // Pick an icon based on category or fallback
                        let IconComponent = Heart;
                        if (visa.visa_category?.toLowerCase().includes('business')) IconComponent = Briefcase;
                        if (visa.visa_category?.toLowerCase().includes('tourist')) IconComponent = Plane;
                        if (visa.visa_category?.toLowerCase().includes('student')) IconComponent = GraduationCap;
                        if (visa.visa_category?.toLowerCase().includes('job')) IconComponent = Users;
                        // Color logic (optional)
                        let color = 'emerald';
                        if (visa.visa_category === 'Business') color = 'emerald';
                        if (visa.visa_category === 'Tourist') color = 'blue';
                        if (visa.visa_category === 'Student') color = 'purple';
                        if (visa.visa_category === 'Job') color = 'orange';
                        return (
                          <Card key={visa.id} className="mb-8">
                            <CardContent className="p-8">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <IconComponent className="w-10 h-10 text-gray-700" />
                                  <div>
                                    <h3 className="text-2xl font-bold mb-1">{visa.visa_category ? visa.visa_category + ' Visa' : visa.visa_type}</h3>
                                    <p className="text-gray-600 text-lg">{visa.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-bold text-emerald-700">₹{Math.round(visa.price * rate).toLocaleString()}</div>
                                  <div className="text-sm text-gray-500">processing fee</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center space-x-2 text-base">
                                  <Clock className="w-5 h-5 text-gray-500" />
                                  <span><strong>Processing:</strong> {visa.processing_time}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-base">
                                  <FileText className="w-5 h-5 text-gray-500" />
                                  <span><strong>Validity:</strong> {visa.visa_validity || visa.stay_validity}</span>
                                </div>
                              </div>
                              <div className="mb-4">
                                <h4 className="font-semibold text-base mb-2">Key Features:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {(visa.features || []).map((feature, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-base mb-2">Required Documents:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {(visa.requirements || []).map((req, idx) => (
                                    <li key={idx} className="flex items-center space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {currentStep === 2 && selectedVisa && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Application Details</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className={`bg-${selectedVisa.color}-50 p-4 rounded-lg mb-6`}>
                      <h4 className={`font-semibold text-${selectedVisa.color}-800 mb-2`}>{selectedVisa.name}</h4>
                      <p className={`text-${selectedVisa.color}-700 text-sm`}>
                        Processing: {selectedVisa.processingTime} • Validity: {selectedVisa.validity}
                      </p>
                    </div>

                    <div className="space-y-6">
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
                              {applicationDate ? format(applicationDate, "PPP") : "Select application date"}
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
                          placeholder="Provide detailed purpose of your visit to Saudi Arabia..."
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="duration">Duration of Stay</Label>
                        <Input
                          id="duration"
                          value={applicationForm.duration}
                          onChange={(e) => setApplicationForm({...applicationForm, duration: e.target.value})}
                          placeholder="e.g., 2 weeks, 1 month, 90 days"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Additional Information</Label>
                        <Textarea
                          id="specialRequests"
                          value={applicationForm.specialRequests}
                          onChange={(e) => setApplicationForm({...applicationForm, specialRequests: e.target.value})}
                          placeholder="Any special circumstances, expedited processing needs, or additional information..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleApplication} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={applicationForm.firstName}
                            onChange={(e) => setApplicationForm({...applicationForm, firstName: e.target.value})}
                            required
                            placeholder="First name as in passport"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={applicationForm.lastName}
                            onChange={(e) => setApplicationForm({...applicationForm, lastName: e.target.value})}
                            required
                            placeholder="Last name as in passport"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={applicationForm.email}
                          onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={applicationForm.phone}
                          onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                          required
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nationality">Nationality *</Label>
                          <Input
                            id="nationality"
                            value={applicationForm.nationality}
                            onChange={(e) => setApplicationForm({...applicationForm, nationality: e.target.value})}
                            required
                            placeholder="Your nationality"
                          />
                        </div>
                        <div>
                          <Label htmlFor="passportNumber">Passport Number *</Label>
                          <Input
                            id="passportNumber"
                            value={applicationForm.passportNumber}
                            onChange={(e) => setApplicationForm({...applicationForm, passportNumber: e.target.value})}
                            required
                            placeholder="Passport number"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={applicationForm.dateOfBirth}
                          onChange={(e) => setApplicationForm({...applicationForm, dateOfBirth: e.target.value})}
                          required
                        />
                      </div>

                      <Button type="submit" className={`w-full bg-${selectedVisa?.color}-600 hover:bg-${selectedVisa?.color}-700`} disabled={isLoading}>
                        {isLoading ? 'Submitting Application...' : 'Submit Visa Application'}
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
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedVisa ? (
                  <div className="space-y-4">
                    <div className={`p-4 bg-${selectedVisa.color}-50 rounded-lg`}>
                      <h4 className={`font-semibold text-${selectedVisa.color}-800`}>{selectedVisa.name}</h4>
                      <p className={`text-sm text-${selectedVisa.color}-600`}>
                        {selectedVisa.category} Category
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Time:</span>
                        <span className="font-medium">{selectedVisa.processingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Validity Period:</span>
                        <span className="font-medium">{selectedVisa.validity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Fee:</span>
                        <span className="font-medium">
                          {currencySymbol}{Math.round(selectedVisa.price * rate).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {applicationDate && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Application Date</p>
                        <p className="font-medium">{format(applicationDate, "PPP")}</p>
                      </div>
                    )}

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Service Includes:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Application review & processing</li>
                        <li>• Document verification</li>
                        <li>• Embassy liaison services</li>
                        <li>• Status updates & tracking</li>
                        <li>• Expert consultation</li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h5 className="font-medium text-amber-800 mb-2">Next Steps:</h5>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>1. Complete application form</li>
                        <li>2. Submit required documents</li>
                        <li>3. Make payment</li>
                        <li>4. Track application status</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a visa type to see application details</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                      Previous
                    </Button>
                  )}
                  {currentStep < 3 && (
                    <Button onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700">
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

export default OtherSaudiVisas;
