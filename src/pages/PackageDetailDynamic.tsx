import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Plane, Calendar, Star, CheckCircle, CreditCard, Info, MapPin, Utensils, X } from 'lucide-react';

const PackageDetailDynamic = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoomType, setSelectedRoomType] = useState('double');
  const [guestCount, setGuestCount] = useState({ adults: 2, childWithBed: 0, childWithoutBed: 0, infants: 0 });
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .eq('seo->>slug', slug)
        .single();
      if (error || !data) {
        setError('Package not found.');
        setPkg(null);
      } else {
        setPkg(data);
        setError(null);
      }
      setLoading(false);
    };
    if (slug) fetchPackage();
  }, [slug]);

  useEffect(() => {
    if (!pkg) return;
    // Calculate total cost based on selected room type and guest count
    const pricing = pkg.pricing?.[pkg.package_type || 'group']?.[selectedRoomType] || {};
    const cost =
      (guestCount.adults * (pricing.adult || 0)) +
      (guestCount.childWithBed * (pricing.childWithBed || 0)) +
      (guestCount.childWithoutBed * (pricing.childWithoutBed || 0)) +
      (guestCount.infants * (pricing.infant || 0));
    setTotalCost(cost);
  }, [pkg, selectedRoomType, guestCount]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-lg">Loading package details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-lg text-red-600">{error}</div>;
  if (!pkg) return null;

  // Helper for currency
  const getCurrencySymbol = (currency: string | undefined) => {
    switch ((currency || 'INR').toUpperCase()) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'SAR': return '﷼';
      default: return currency ? currency.toUpperCase() + ' ' : '₹';
    }
  };

  // Responsive layout, sticky sidebar, modern cards, tabs, etc.
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      <section className="relative h-[60vh] overflow-hidden flex items-end">
        <img src={pkg.image_url || `/placeholder.svg`} alt={pkg.title} className="w-full h-full object-cover absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="max-w-4xl">
            <Badge className="bg-emerald-600 text-white px-4 py-2 mb-4 text-lg shadow-lg">{pkg.package_type === 'group' ? 'Group Package' : 'Independent Package'}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">{pkg.title}</h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-lg">
              <div className="flex items-center"><Calendar className="w-5 h-5 mr-2" />{pkg.duration}</div>
              <div className="flex items-center"><Star className="w-5 h-5 mr-2 fill-current text-yellow-400" />{pkg.rating} ({pkg.reviews} reviews)</div>
              <div className="flex items-center"><MapPin className="w-5 h-5 mr-2" />{pkg.makkah_hotel?.name && 'Makkah'}{pkg.makkah_hotel?.name && pkg.madinah_hotel?.name && ' & '}{pkg.madinah_hotel?.name && 'Madinah'}</div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-14 mb-6">
                <TabsTrigger value="overview" className="data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="hotels" className="data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg">Hotels</TabsTrigger>
                <TabsTrigger value="itinerary" className="data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg">Itinerary</TabsTrigger>
                <TabsTrigger value="activities" className="data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg">Activities</TabsTrigger>
                <TabsTrigger value="pricing" className="data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg">Pricing</TabsTrigger>
                <TabsTrigger value="inclusions" className="data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg">Inclusions</TabsTrigger>
                <TabsTrigger value="terms" className="data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg">Terms</TabsTrigger>
              </TabsList>
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Flight Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><Plane className="w-6 h-6 mr-2 text-blue-600" />Flight Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div><span className="font-semibold text-gray-700">Route:</span><p className="text-gray-600">{pkg.flight_details?.departure} → {pkg.flight_details?.arrival}</p></div>
                      <div><span className="font-semibold text-gray-700">Duration:</span><p className="text-gray-600">{pkg.flight_details?.duration}</p></div>
                      <div><span className="font-semibold text-gray-700">Aircraft:</span><p className="text-gray-600">{pkg.flight_details?.aircraft}</p></div>
                      <div><span className="font-semibold text-gray-700">Airline:</span><p className="text-gray-600">{pkg.flight_details?.airline}</p></div>
                      <div><span className="font-semibold text-gray-700">Type:</span><p className="text-gray-600">{pkg.flight_details?.type}</p></div>
                      <div><span className="font-semibold text-gray-700">Baggage:</span><p className="text-gray-600">{pkg.flight_details?.baggage}</p></div>
                    </div>
                  </CardContent>
                </Card>
                {/* Meal Plan */}
                {pkg.meal_plan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center"><Utensils className="w-6 h-6 mr-2 text-orange-600" />Meal Plan - {pkg.meal_plan?.type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-orange-900 font-semibold">{pkg.meal_plan?.description}</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {pkg.meal_plan?.details?.map((item: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg"><CheckCircle className="w-4 h-4 text-orange-600" />{item}</div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Inclusions/Exclusions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="text-emerald-600 flex items-center gap-2"><CheckCircle className="w-5 h-5" />What's Included</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pkg.inclusions?.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-emerald-800"><CheckCircle className="w-4 h-4" />{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-red-600 flex items-center gap-2"><X className="w-5 h-5" />What's Not Included</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pkg.exclusions?.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-red-700"><X className="w-4 h-4" />{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              {/* Hotels Tab */}
              <TabsContent value="hotels">
                <div className="grid md:grid-cols-2 gap-8">
                  {pkg.makkah_hotel && (
                    <Card className="overflow-hidden">
                      <CardHeader><CardTitle className="flex items-center"><MapPin className="w-6 h-6 mr-2 text-emerald-600" />Makkah Accommodation ({pkg.makkah_hotel.nights} nights)</CardTitle></CardHeader>
                      <CardContent>
                        <img src={pkg.makkah_hotel.image || '/placeholder.svg'} alt={pkg.makkah_hotel.name} className="w-full h-64 object-cover rounded-lg shadow-lg mb-4" />
                        <div className="font-bold text-lg mb-2">{pkg.makkah_hotel.name}</div>
                        <div className="flex items-center mt-2 mb-2">{[...Array(pkg.makkah_hotel.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
                        <div className="mb-2 text-gray-700">{pkg.makkah_hotel.distance}</div>
                        <div className="grid grid-cols-2 gap-2">
                          {pkg.makkah_hotel.amenities?.map((amenity: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs justify-start">{amenity}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {pkg.madinah_hotel && (
                    <Card className="overflow-hidden">
                      <CardHeader><CardTitle className="flex items-center"><MapPin className="w-6 h-6 mr-2 text-blue-600" />Madinah Accommodation ({pkg.madinah_hotel.nights} nights)</CardTitle></CardHeader>
                      <CardContent>
                        <img src={pkg.madinah_hotel.image || '/placeholder.svg'} alt={pkg.madinah_hotel.name} className="w-full h-64 object-cover rounded-lg shadow-lg mb-4" />
                        <div className="font-bold text-lg mb-2">{pkg.madinah_hotel.name}</div>
                        <div className="flex items-center mt-2 mb-2">{[...Array(pkg.madinah_hotel.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
                        <div className="mb-2 text-gray-700">{pkg.madinah_hotel.distance}</div>
                        <div className="grid grid-cols-2 gap-2">
                          {pkg.madinah_hotel.amenities?.map((amenity: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs justify-start">{amenity}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              {/* Itinerary Tab */}
              <TabsContent value="itinerary">
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Calendar className="w-6 h-6 mr-2 text-purple-600" />Day-by-Day Itinerary</CardTitle></CardHeader>
                  <CardContent>
                    {pkg.itinerary && Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 ? (
                      <div className="space-y-4">
                        {pkg.itinerary.map((item: any, idx: number) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold">{item.day || idx + 1}</div>
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
              {/* Activities Tab */}
              <TabsContent value="activities">
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Info className="w-6 h-6 mr-2 text-purple-600" />Included Activities</CardTitle></CardHeader>
                  <CardContent>
                    {pkg.activities && pkg.activities.length > 0 ? (
                      <div className="grid gap-3">
                        {pkg.activities.map((activity: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /><span className="text-gray-700">{activity}</span></div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Activity details will be shared before departure.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Pricing Tab */}
              <TabsContent value="pricing">
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><CreditCard className="w-6 h-6 mr-2 text-green-600" />Comprehensive Pricing Chart</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {pkg.pricing && pkg.pricing[pkg.package_type || 'group'] && Object.entries(pkg.pricing[pkg.package_type || 'group']).map(([roomType, prices]: any) => (
                        <div key={roomType} className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border">
                          <h4 className="font-bold text-xl mb-4 capitalize text-gray-900">{roomType} Room Sharing</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div><span className="font-semibold">Adult:</span> {getCurrencySymbol(pkg.currency)}{prices.adult?.toLocaleString()}</div>
                            <div><span className="font-semibold">Child (with bed):</span> {getCurrencySymbol(pkg.currency)}{prices.childWithBed?.toLocaleString()}</div>
                            <div><span className="font-semibold">Child (no bed):</span> {getCurrencySymbol(pkg.currency)}{prices.childWithoutBed?.toLocaleString()}</div>
                            <div><span className="font-semibold">Infant:</span> {getCurrencySymbol(pkg.currency)}{prices.infant?.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Inclusions Tab */}
              <TabsContent value="inclusions">
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><CheckCircle className="w-6 h-6 mr-2 text-emerald-600" />What's Included</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.inclusions?.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-emerald-800"><CheckCircle className="w-4 h-4" />{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Terms Tab */}
              <TabsContent value="terms">
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Info className="w-6 h-6 mr-2 text-yellow-600" />Terms & Conditions</CardTitle></CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Payment Terms</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {pkg.terms?.payment?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {pkg.terms?.cancellation?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Responsibilities</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {pkg.terms?.responsibilities?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Disclaimers</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {pkg.terms?.disclaimers?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          {/* Sidebar Booking Widget */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center"><Users className="w-6 h-6 mr-2 text-emerald-600" />Customize Your Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Type Selection */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">Room Sharing Type</label>
                  <select className="w-full border rounded-lg p-2" value={selectedRoomType} onChange={e => setSelectedRoomType(e.target.value)}>
                    {pkg.pricing && pkg.pricing[pkg.package_type || 'group'] && Object.keys(pkg.pricing[pkg.package_type || 'group']).map(roomType => (
                      <option key={roomType} value={roomType}>{roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room</option>
                    ))}
                  </select>
                </div>
                {/* Guest Count Selection */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">Select Number of Travelers</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" />Adults</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}>-</Button>
                        <span className="font-bold text-lg">{guestCount.adults}</span>
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, adults: g.adults + 1 }))}>+</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-green-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-green-600" />Child (with bed)</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, childWithBed: Math.max(0, g.childWithBed - 1) }))}>-</Button>
                        <span className="font-bold text-lg">{guestCount.childWithBed}</span>
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, childWithBed: g.childWithBed + 1 }))}>+</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-yellow-600" />Child (no bed)</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, childWithoutBed: Math.max(0, g.childWithoutBed - 1) }))}>-</Button>
                        <span className="font-bold text-lg">{guestCount.childWithoutBed}</span>
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, childWithoutBed: g.childWithoutBed + 1 }))}>+</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" />Infants</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, infants: Math.max(0, g.infants - 1) }))}>-</Button>
                        <span className="font-bold text-lg">{guestCount.infants}</span>
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, infants: g.infants + 1 }))}>+</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between"><span>Package Type:</span><span className="font-medium capitalize">{pkg.package_type}</span></div>
                  <div className="flex justify-between"><span>Room Type:</span><span className="font-medium capitalize">{selectedRoomType}</span></div>
                  <div className="flex justify-between"><span>Total Travelers:</span><span className="font-medium">{guestCount.adults + guestCount.childWithBed + guestCount.childWithoutBed + guestCount.infants}</span></div>
                  <div className="flex justify-between items-center pt-2 border-t"><span className="font-semibold">Total Cost:</span><span className="text-2xl font-bold text-emerald-600">{getCurrencySymbol(pkg.currency)}{totalCost.toLocaleString()}</span></div>
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-lg py-6 shadow-lg">Book This Package Now</Button>
                  <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">Request Custom Quote</Button>
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

export default PackageDetailDynamic; 