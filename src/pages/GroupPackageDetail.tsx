import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, Users, Plane, Landmark, Star, Check, X, Phone, Mail, Calendar, MapPin, Shield, Award, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const GroupPackageDetail = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTravelers, setSelectedTravelers] = useState({
    adults: 2,
    childWithBed: 0,
    childNoBed: 0,
    infants: 0
  });
  const [selectedRoomType, setSelectedRoomType] = useState('double');

  useEffect(() => {
    const fetchPackage = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }
      setLoading(true);
      let { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .filter('seo->slug', 'eq', slug)
        .single();
      if (error) {
        const { data: data2, error: error2 } = await supabase
          .from('umrah_packages')
          .select('*')
          .eq('seo->>slug', slug)
          .single();
        if (error2) {
          setError('Package not found.');
          setPkg(null);
        } else {
          setPkg(data2);
          setError(null);
        }
      } else {
        setPkg(data);
        setError(null);
      }
      setLoading(false);
    };
    fetchPackage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading package details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-lg text-red-600">{error || 'Package not found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getCurrencySymbol = (currency: string | undefined) => {
    switch ((currency || 'INR').toUpperCase()) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'SAR': return '﷼';
      default: return currency ? currency.toUpperCase() + ' ' : '₹';
    }
  };

  const maxCap = pkg.max_capacity || 0;
  const availableSpots = Math.min(pkg.available_spots ?? 0, maxCap);
  const isSoldOut = availableSpots === 0;
  const reviews = pkg.reviews || 847;
  const rating = pkg.rating || 4.9;

  const totalTravelers = selectedTravelers.adults + selectedTravelers.childWithBed + selectedTravelers.childNoBed + selectedTravelers.infants;
  const basePrice = pkg.price || 0;
  const totalCost = basePrice * totalTravelers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] md:h-[70vh] w-full">
          <img
            src={pkg.featured_image || '/placeholder.svg'}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Floating Badges */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-3 z-10">
            {pkg.is_group_package && (
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                <Users className="w-4 h-4 mr-1" />
                Group Package
              </Badge>
            )}
            {pkg.package_category && (
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                {pkg.package_category}
              </Badge>
            )}
            {isSoldOut && (
              <Badge className="bg-red-600 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg animate-pulse">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-white/20 backdrop-blur text-white border-white/30 px-3 py-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {pkg.duration}
                </Badge>
                <Badge className="bg-white/20 backdrop-blur text-white border-white/30 px-3 py-1">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {rating} ({reviews} reviews)
                </Badge>
                <Badge className="bg-white/20 backdrop-blur text-white border-white/30 px-3 py-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {pkg.makkah_hotel?.name && 'Makkah'}{pkg.makkah_hotel?.name && pkg.madinah_hotel?.name && ' & '}{pkg.madinah_hotel?.name && 'Madinah'}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{pkg.name}</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">{pkg.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 bg-white shadow-lg rounded-xl p-2 grid grid-cols-6 w-full">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="hotels" className="rounded-lg">Hotels</TabsTrigger>
                <TabsTrigger value="itinerary" className="rounded-lg">Itinerary</TabsTrigger>
                <TabsTrigger value="activities" className="rounded-lg">Activities</TabsTrigger>
                <TabsTrigger value="inclusions" className="rounded-lg">Inclusions</TabsTrigger>
                <TabsTrigger value="terms" className="rounded-lg">Terms</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="space-y-6">
                  {/* Package Type Selection */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        Package Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-4 border-2 border-emerald-200 bg-emerald-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
                            <div>
                              <h4 className="font-semibold text-emerald-800">Group Package</h4>
                              <p className="text-sm text-emerald-600">Join with other pilgrims for a shared spiritual journey</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 bg-gray-50 rounded-xl opacity-60">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                            <div>
                              <h4 className="font-semibold text-gray-600">Independent Package</h4>
                              <p className="text-sm text-gray-500">Private experience with personalized services</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flight Information */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="w-5 h-5 text-blue-600" />
                        Flight Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Route</h4>
                          <p className="text-sm text-gray-600">Delhi (DEL) → Jeddah (JED)</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Duration</h4>
                          <p className="text-sm text-gray-600">5h 30m</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Aircraft</h4>
                          <p className="text-sm text-gray-600">Boeing 737-800</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Airline</h4>
                          <p className="text-sm text-gray-600">Air India Express</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Type</h4>
                          <p className="text-sm text-gray-600">Direct Flight</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Baggage</h4>
                          <p className="text-sm text-gray-600">30kg checked + 7kg cabin</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Package Details */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Package Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Category:</span>
                            <span className="text-gray-600">{pkg.package_category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Season:</span>
                            <span className="text-gray-600">{pkg.season_category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Departure:</span>
                            <span className="text-gray-600">{pkg.departure_date ? format(new Date(pkg.departure_date), 'dd MMM yyyy') : '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Booking Deadline:</span>
                            <span className="text-gray-600">{pkg.booking_deadline ? format(new Date(pkg.booking_deadline), 'dd MMM yyyy') : '-'}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Meal Plan:</span>
                            <span className="text-gray-600">{pkg.meal_plan}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Max Capacity:</span>
                            <span className="text-gray-600">{maxCap} pilgrims</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Available Spots:</span>
                            <span className="text-emerald-600 font-semibold">{availableSpots} spots left</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Hotels Tab */}
              <TabsContent value="hotels">
                <div className="space-y-6">
                  {pkg.makkah_hotel && (
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Landmark className="w-5 h-5 text-emerald-600" />
                          Makkah Hotel
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-gray-900">{pkg.makkah_hotel.name}</h3>
                          {pkg.makkah_hotel.address && (
                            <p className="text-gray-600 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {pkg.makkah_hotel.address}
                            </p>
                          )}
                          {pkg.makkah_hotel.amenities && (
                            <div className="flex flex-wrap gap-2">
                              {pkg.makkah_hotel.amenities.map((amenity: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {pkg.madinah_hotel && (
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Landmark className="w-5 h-5 text-blue-600" />
                          Madinah Hotel
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-gray-900">{pkg.madinah_hotel.name}</h3>
                          {pkg.madinah_hotel.address && (
                            <p className="text-gray-600 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {pkg.madinah_hotel.address}
                            </p>
                          )}
                          {pkg.madinah_hotel.amenities && (
                            <div className="flex flex-wrap gap-2">
                              {pkg.madinah_hotel.amenities.map((amenity: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Other tabs remain the same as before */}
              
              
              <TabsContent value="itinerary">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Day-by-Day Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pkg.itinerary && Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 ? (
                      <div className="space-y-4">
                        {pkg.itinerary.map((item: any, idx: number) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold">
                                {item.day || idx + 1}
                              </div>
                              <h4 className="font-semibold text-gray-900">{item.location || 'Location TBA'}</h4>
                            </div>
                            <div className="ml-12">
                              {Array.isArray(item.activities) ? (
                                <ul className="list-disc pl-4 space-y-1">
                                  {item.activities.map((activity: string, i: number) => (
                                    <li key={i} className="text-gray-600">{activity}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-600">{item.activities || 'Activities TBA'}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Detailed itinerary will be provided upon booking confirmation.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Included Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pkg.activities && pkg.activities.length > 0 ? (
                      <div className="grid gap-3">
                        {pkg.activities.map((activity: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <span className="text-gray-700">{activity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Activity details will be shared before departure.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inclusions">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-emerald-600 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pkg.inclusions && pkg.inclusions.length > 0 ? (
                        <div className="space-y-3">
                          {pkg.inclusions.map((inclusion: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{inclusion}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Inclusion details not available.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-red-600 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        What's Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pkg.exclusions && pkg.exclusions.length > 0 ? (
                        <div className="space-y-3">
                          {pkg.exclusions.map((exclusion: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{exclusion}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Exclusion details not available.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="terms">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Terms & Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                        {pkg.terms_conditions || 'Terms and conditions will be provided during booking process.'}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Booking Summary Card */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">Customize Your Booking</span>
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Room Type Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Room Sharing Type</h4>
                    <select
                      value={selectedRoomType}
                      onChange={(e) => setSelectedRoomType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="double">Double Room (2 people)</option>
                      <option value="triple">Triple Room (3 people)</option>
                      <option value="quad">Quad Room (4 people)</option>
                    </select>
                  </div>

                  {/* Traveler Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Select Number of Travelers</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'adults', label: 'Adults', sublabel: '12+ years', min: 1 },
                        { key: 'childWithBed', label: 'Child (with bed)', sublabel: '2-11 years', min: 0 },
                        { key: 'childNoBed', label: 'Child (no bed)', sublabel: '2-11 years', min: 0 },
                        { key: 'infants', label: 'Infants', sublabel: '0-2 years', min: 0 }
                      ].map(({ key, label, sublabel, min }) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-700">{label}</div>
                            <div className="text-sm text-gray-500">{sublabel}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedTravelers(prev => ({
                                ...prev,
                                [key]: Math.max(min, prev[key as keyof typeof prev] - 1)
                              }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              disabled={selectedTravelers[key as keyof typeof selectedTravelers] <= min}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">
                              {selectedTravelers[key as keyof typeof selectedTravelers]}
                            </span>
                            <button
                              onClick={() => setSelectedTravelers(prev => ({
                                ...prev,
                                [key]: prev[key as keyof typeof prev] + 1
                              }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Package Type:</span>
                        <span className="font-medium">Group</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room Type:</span>
                        <span className="font-medium capitalize">{selectedRoomType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Travelers:</span>
                        <span className="font-medium">{totalTravelers}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Cost */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total Cost:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {getCurrencySymbol(pkg.currency)}{totalCost.toLocaleString()}
                      </span>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                      size="lg"
                      disabled={isSoldOut}
                    >
                      {isSoldOut ? 'Sold Out' : 'Book This Package Now'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full mt-3 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      Request Custom Quote
                    </Button>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold">Need Assistance?</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>Call Us: +91-78200-09800</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        <span>info@marhabahajj.com</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <div className="text-xs font-semibold">SSL Secured</div>
                    </div>
                    <div>
                      <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-xs font-semibold">IATA Approved</div>
                    </div>
                    <div>
                      <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-xs font-semibold">ISO Certified</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GroupPackageDetail;
