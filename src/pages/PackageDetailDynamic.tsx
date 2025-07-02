import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Plane, Calendar, Star, CheckCircle, CreditCard, Info, MapPin, Utensils, X, Bed, Sparkles } from 'lucide-react';
import ResponsiveBanner from '../components/ResponsiveBanner';

const PackageDetailDynamic = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [guestCount, setGuestCount] = useState({ adults: 2, childWithBed: 0, childWithoutBed: 0, infants: 0 });
  const [totalCost, setTotalCost] = useState(0);
  const [activityDetails, setActivityDetails] = useState<unknown[]>([]);
  const [hotelDetails, setHotelDetails] = useState<{ makkah?: unknown; madinah?: unknown }>({});

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

  useEffect(() => {
    if (!pkg) return;
    const fetchHotels = async () => {
      let newHotelDetails: Record<string, unknown> = {};
      // Fetch Makkah hotel if needed
      if (pkg.makkah_hotel && (typeof pkg.makkah_hotel === 'string' || !pkg.makkah_hotel.featured_image)) {
        const makkahId = typeof pkg.makkah_hotel === 'string' ? pkg.makkah_hotel : pkg.makkah_hotel.id;
        if (makkahId) {
          const { data } = await supabase.from('hotels').select('*').eq('id', makkahId).single();
          if (data) newHotelDetails.makkah = data;
        }
      } else if (pkg.makkah_hotel) {
        newHotelDetails.makkah = pkg.makkah_hotel;
      }
      // Fetch Madinah hotel if needed
      if (pkg.madinah_hotel && (typeof pkg.madinah_hotel === 'string' || !pkg.madinah_hotel.featured_image)) {
        const madinahId = typeof pkg.madinah_hotel === 'string' ? pkg.madinah_hotel : pkg.madinah_hotel.id;
        if (madinahId) {
          const { data } = await supabase.from('hotels').select('*').eq('id', madinahId).single();
          if (data) newHotelDetails.madinah = data;
        }
      } else if (pkg.madinah_hotel) {
        newHotelDetails.madinah = pkg.madinah_hotel;
      }
      setHotelDetails(newHotelDetails);
    };
    fetchHotels();
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    // If activities are already objects with name, skip fetch
    if (typeof pkg.activities[0] === 'object' && pkg.activities[0].name) {
      setActivityDetails(pkg.activities);
      return;
    }
    // Otherwise, fetch activity details by IDs
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('id, name, description, featured_image')
        .in('id', pkg.activities);
      if (!error && data) setActivityDetails(data);
    };
    fetchActivities();
  }, [pkg]);

  useEffect(() => {
    if (selectedRoomType === 'sharing') {
      setGuestCount({ sharing: 1, childWithoutBed: 0, infants: 0 });
    }
  }, []);

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

  // Helper to format currency
  const formatCurrency = (amount: number | undefined) =>
    amount !== undefined && amount !== null ? getCurrencySymbol(pkg.currency) + amount.toLocaleString() : '-';

  // Responsive layout, sticky sidebar, modern cards, tabs, etc.
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      <section className="relative h-[60vh] overflow-hidden flex items-end">
        {/* Overlayed badges for package type and category */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {pkg.package_type && (
            <Badge className="bg-emerald-600 text-white shadow font-bold px-3 py-1 text-base rounded-full">
              {pkg.package_type === 'group' ? 'Group Package' : pkg.package_type === 'independent' ? 'Independent Package' : pkg.package_type}
            </Badge>
          )}
          {pkg.package_category && (
            <Badge className="bg-blue-700 text-white shadow font-bold px-3 py-1 text-base rounded-full">
              {pkg.package_category}
            </Badge>
          )}
        </div>
        <ResponsiveBanner alt={pkg.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">{pkg.title}</h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {pkg.duration || 'Duration not specified'}
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 fill-current text-yellow-400" />
                {pkg.rating ? `${pkg.rating} (${pkg.reviews} reviews)` : '(No reviews)'}
              </div>
              <div className="flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                {pkg.flight_details?.departure_from_airport || 'Departure City not specified'}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {Array.isArray(pkg.cities_covered) && pkg.cities_covered.length > 0
                  ? pkg.cities_covered.join(' & ')
                  : 'Cities not specified'}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="flex justify-between items-center bg-amber-50 rounded-xl p-2 w-full mb-6 gap-2">
                <TabsTrigger value="overview" className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3">Overview</TabsTrigger>
                <TabsTrigger value="hotels" className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3">Hotels</TabsTrigger>
                <TabsTrigger value="itinerary" className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3">Itinerary</TabsTrigger>
                <TabsTrigger value="activities" className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3">Activities</TabsTrigger>
                <TabsTrigger value="pricing" className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3">Pricing</TabsTrigger>
                <TabsTrigger value="terms" className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3">Terms</TabsTrigger>
              </TabsList>
              {/* Enhanced Overview Tab Layout */}
              <TabsContent value="overview" className="space-y-8">
                {/* Hero Card */}
                <div className="mb-8 bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-xl p-8 border border-emerald-200 animate-fade-in-up">
                  <div className="flex flex-wrap gap-3 items-center mb-2">
                    {pkg.package_type && (
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-blue-200">
                        🕋 {pkg.package_type === 'group' ? 'Group Package' : pkg.package_type === 'independent' ? 'Independent Package' : pkg.package_type}
                      </span>
                    )}
                    {pkg.package_category && (
                      <span className="inline-flex items-center bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-emerald-200">
                        {pkg.package_category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 leading-tight drop-shadow mb-2">{pkg.name}</h1>
                  {pkg.description && (
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4 prose max-w-none">{pkg.description}</p>
                  )}
                  {/* Quick Facts Row */}
                  <div className="flex flex-wrap gap-3 items-center mt-4">
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium gap-1"><Calendar className="w-4 h-4" />{pkg.duration}</span>
                    {pkg.departure_date && (
                      <span className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium gap-1"><Plane className="w-4 h-4" />{new Date(pkg.departure_date).toLocaleDateString()}</span>
                    )}
                    {pkg.cities_covered && pkg.cities_covered.length > 0 && (
                      <span className="inline-flex items-center bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium gap-1"><MapPin className="w-4 h-4" />{pkg.cities_covered.join(' & ')}</span>
                    )}
                    <span className="inline-flex items-center bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-sm font-bold gap-1"><CreditCard className="w-4 h-4" />{getCurrencySymbol(pkg.currency)}{pkg.price?.toLocaleString()}</span>
                  </div>
                </div>
                {/* Info Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                  {/* Flight Info Card */}
                  <div className="bg-blue-50 rounded-xl shadow p-6 border border-blue-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2"><Plane className="w-5 h-5 text-blue-500" /><span className="font-bold text-blue-900">Flight Info</span></div>
                    <div className="text-blue-900 font-medium">Airline: <span className="font-normal">{pkg.flight_details?.airline_name || '-'}</span></div>
                    <div className="text-blue-900 font-medium">Type: <span className="font-normal">{pkg.flight_details?.flight_type || '-'}</span></div>
                  </div>
                  {/* Meal Plan Card */}
                  <div className="bg-yellow-50 rounded-xl shadow p-6 border border-yellow-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2"><Utensils className="w-5 h-5 text-yellow-600" /><span className="font-bold text-yellow-900">Meal Plan</span></div>
                    <div className="text-yellow-900 font-medium">{pkg.meal_plan || '-'}</div>
                  </div>
                </div>
                {/* Inclusions/Exclusions Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                  {/* Inclusions Card */}
                  <div className="bg-emerald-50 rounded-xl shadow p-6 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-emerald-600" /><span className="font-bold text-emerald-900">Inclusions</span></div>
                    <ul className="list-disc pl-5 text-emerald-900 space-y-1">
                      {(pkg.inclusions || []).slice(0, 5).map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                      {pkg.inclusions && pkg.inclusions.length > 5 && (
                        <li className="text-xs text-emerald-700 font-semibold">+{pkg.inclusions.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                  {/* Exclusions Card */}
                  <div className="bg-rose-50 rounded-xl shadow p-6 border border-rose-200">
                    <div className="flex items-center gap-2 mb-2"><X className="w-5 h-5 text-rose-600" /><span className="font-bold text-rose-900">Exclusions</span></div>
                    <ul className="list-disc pl-5 text-rose-900 space-y-1">
                      {(pkg.exclusions || []).slice(0, 5).map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                      {pkg.exclusions && pkg.exclusions.length > 5 && (
                        <li className="text-xs text-rose-700 font-semibold">+{pkg.exclusions.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              {/* Hotels Tab */}
              <TabsContent value="hotels">
                <div className="grid md:grid-cols-2 gap-8">
                  {hotelDetails.makkah && (
                    <Card className="overflow-hidden">
                      <CardHeader><CardTitle className="flex items-center"><MapPin className="w-6 h-6 mr-2 text-emerald-600" />Makkah Accommodation</CardTitle></CardHeader>
                      <CardContent>
                        <img src={hotelDetails.makkah.featured_image || (hotelDetails.makkah.images && hotelDetails.makkah.images[0]) || '/placeholder.svg'} alt={hotelDetails.makkah.name} className="w-full h-64 object-cover rounded-lg shadow-lg mb-4" />
                        <div className="font-bold text-lg mb-2">{hotelDetails.makkah.name}</div>
                        <div className="flex items-center mt-2 mb-2">{[...Array(hotelDetails.makkah.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
                        {(hotelDetails.makkah.distance_from_haram || hotelDetails.makkah.distance) && (
                          <div className="mb-2 text-gray-700 font-medium">
                            Distance: {hotelDetails.makkah.distance_from_haram || hotelDetails.makkah.distance} metres
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {hotelDetails.makkah.amenities?.map((amenity: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs justify-start">{amenity}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {hotelDetails.madinah && (
                    <Card className="overflow-hidden">
                      <CardHeader><CardTitle className="flex items-center"><MapPin className="w-6 h-6 mr-2 text-blue-600" />Madinah Accommodation</CardTitle></CardHeader>
                      <CardContent>
                        <img src={hotelDetails.madinah.featured_image || (hotelDetails.madinah.images && hotelDetails.madinah.images[0]) || '/placeholder.svg'} alt={hotelDetails.madinah.name} className="w-full h-64 object-cover rounded-lg shadow-lg mb-4" />
                        <div className="font-bold text-lg mb-2">{hotelDetails.madinah.name}</div>
                        <div className="flex items-center mt-2 mb-2">{[...Array(hotelDetails.madinah.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
                        {(hotelDetails.madinah.distance_from_masjid_e_nabawi || hotelDetails.madinah.distance) && (
                          <div className="mb-2 text-gray-700 font-medium">
                            Distance: {hotelDetails.madinah.distance_from_masjid_e_nabawi || hotelDetails.madinah.distance} metres
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {hotelDetails.madinah.amenities?.map((amenity: string, i: number) => (
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
                      <div className="relative pl-8">
                        <div className="absolute left-2 top-0 bottom-0 w-1 bg-emerald-100 rounded" />
                        {pkg.itinerary.map((item: unknown, idx: number) => {
                          // Determine day type and icon
                          const dayTitle = (item.location || item.title || '').toLowerCase();
                          let dotColor = 'bg-emerald-500';
                          let borderColor = 'border-emerald-100';
                          let Icon = MapPin;
                          if (dayTitle.includes('arrival') || dayTitle.includes('depart')) {
                            dotColor = 'bg-blue-500';
                            borderColor = 'border-blue-100';
                            Icon = Plane;
                          } else if (dayTitle.includes('ziyarah') || dayTitle.includes('special')) {
                            dotColor = 'bg-yellow-500';
                            borderColor = 'border-yellow-100';
                            Icon = Star;
                          } else if (dayTitle.includes('free')) {
                            dotColor = 'bg-purple-500';
                            borderColor = 'border-purple-100';
                            Icon = Sparkles;
                          }
                          return (
                            <div key={idx} className="relative mb-8 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                              <div className={`absolute -left-4 top-2 w-8 h-8 ${dotColor} text-white rounded-full flex items-center justify-center font-bold shadow transition-colors duration-300`}>
                                {item.day || idx + 1}
                              </div>
                              <div className={`ml-8 bg-white rounded-xl shadow p-6 border ${borderColor} transition-colors duration-300 flex flex-col gap-2`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon className="w-5 h-5" />
                                  <span className="font-semibold text-lg">{item.location || item.title || 'Location TBA'}</span>
                                </div>
                                <div className="text-gray-700">
                                  {Array.isArray(item.activities) ? (
                                    <ul className="list-disc pl-5">
                                      {item.activities.map((activity: string, i: number) => <li key={i}>{activity}</li>)}
                                    </ul>
                                  ) : (
                                    <p>{item.activities || item.description || 'Activities TBA'}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                    {activityDetails && activityDetails.length > 0 ? (
                      <div className="space-y-8">
                        {activityDetails.map((activity: unknown, idx: number) => {
                          return (
                            <div key={activity.id || idx} className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 p-6">
                              <div className="clearfix">
                                <img
                                  src={activity.featured_image || '/placeholder.svg'}
                                  alt={activity.name}
                                  className="float-left w-32 h-32 object-cover rounded-lg mr-6 mb-2 border border-emerald-100 shadow"
                                  style={{ maxWidth: '8rem', maxHeight: '8rem' }}
                                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
                                />
                                <div className="flex flex-col gap-1">
                                  <span className="text-xl font-bold text-emerald-900">{activity.name}</span>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {activity.city && <span className="text-xs text-white bg-emerald-500 rounded px-2 py-1">{activity.city}</span>}
                                    {activity.duration && <span className="text-xs text-white bg-blue-500 rounded px-2 py-1">{activity.duration}</span>}
                                  </div>
                                </div>
                                {activity.description && (
                                  <div className="text-gray-700 text-base leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: activity.description }} />
                                )}
                              </div>
                            </div>
                          );
                        })}
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
                      {/* Sharing Room Card - always on its own row */}
                      {pkg.pricing?.sharing?.pricePerTraveler && (
                        <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-emerald-200">
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">Most Popular</div>
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-emerald-600" />
                            <span className="text-lg font-bold">Sharing Room</span>
                          </div>
                          <div className="text-3xl font-extrabold text-emerald-700 mb-1">{getCurrencySymbol(pkg.currency)}{pkg.pricing.sharing.pricePerTraveler.toLocaleString()}</div>
                          <div className="text-gray-500 mb-2">per traveler</div>
                          <div className="flex gap-4 mt-2">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                Child (no bed)
                                <span title="Ages 2-9, no separate bed"><Info className="w-3 h-3 text-gray-400" /></span>
                              </span>
                              <span className="font-semibold text-emerald-600">{formatCurrency(pkg.pricing.childWithoutBed)}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                Infant
                                <span title="Below 2 years"><Info className="w-3 h-3 text-gray-400" /></span>
                              </span>
                              <span className="font-semibold text-emerald-600">{formatCurrency(pkg.pricing.infant)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 bg-emerald-100 rounded px-3 py-2">
                            <Info className="w-4 h-4 text-emerald-500" />
                            <span>
                              Sharing is typically <span className="font-semibold">4 or 5 in a room</span>. During <span className="font-semibold">Ramadan</span>, sharing may be up to <span className="font-semibold">6 in a room</span>.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-6 justify-center">
                      {['quint', 'quad', 'triple', 'double', 'single'].map(type => (
                        pkg.pricing?.private?.[type] ? (
                          <div key={type} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow p-5 flex flex-col items-center border border-blue-200 min-w-[220px] flex-1 max-w-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <Bed className="w-6 h-6 text-blue-600" />
                              <span className="font-semibold text-base">{type.charAt(0).toUpperCase() + type.slice(1)} Room</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-700 mb-1">{getCurrencySymbol(pkg.currency)}{pkg.pricing.private[type].toLocaleString()}</div>
                            <div className="text-gray-500 mb-2">per room ({type === 'quint' ? 5 : type === 'quad' ? 4 : type === 'triple' ? 3 : type === 'double' ? 2 : 1} travelers)</div>
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  Child (no bed)
                                  <span title="Ages 2-9, no separate bed"><Info className="w-3 h-3 text-gray-400" /></span>
                                </span>
                                <span className="font-semibold text-blue-600">{formatCurrency(pkg.pricing.childWithoutBed)}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  Infant
                                  <span title="Below 2 years"><Info className="w-3 h-3 text-gray-400" /></span>
                                </span>
                                <span className="font-semibold text-blue-600">{formatCurrency(pkg.pricing.infant)}</span>
                              </div>
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Terms Tab */}
              <TabsContent value="terms">
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Info className="w-6 h-6 mr-2 text-yellow-600" />Terms & Conditions</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Payment Terms Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">🧾 Payment Terms</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li><strong>Booking Amount:</strong> A minimum of 50% of the total package value must be paid at the time of booking to secure seats and initiate visa, flight, and hotel arrangements.</li>
                          <li><strong>Balance Payment:</strong> Full payment must be cleared at least 15 days before the departure date. For bookings made within 15 days of departure, 100% upfront payment is required.</li>
                          <li><strong>Non-Refundable Charges:</strong> A flat amount of ₹5,000 per traveler is non-refundable under any circumstances (covers administrative, processing, and service charges).</li>
                          <li><strong>Payment Methods & Surcharges:</strong> Payments can be made via bank transfer, UPI, payment gateways, or credit/debit cards. Payments made via card swipe or payment gateways will incur an additional 2% service charge.</li>
                          <li><strong>Foreign Currency & Pricing Disclaimer:</strong> All package costs are quoted in Indian Rupees (INR). Prices may vary based on forex fluctuations, airline surcharges, or visa fee changes.</li>
                        </ul>
                      </section>
                      <hr />
                      {/* Cancellation Policy Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">❌ Cancellation Policy</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li><strong>Cancellation by Traveler:</strong></li>
                          <ul className="list-disc pl-8">
                            <li>30+ days before departure: ₹5,000 per traveler retained.</li>
                            <li>15–29 days before departure: 25% of the package cost retained.</li>
                            <li>8–14 days before departure: 50% of the package cost retained.</li>
                            <li>0–7 days before departure: 100% of the package cost retained (no refund).</li>
                          </ul>
                          <li><strong>Cancellation by Agency:</strong> In the rare event that we cancel the tour for any reason other than the traveler's fault, a full refund or suitable travel credit will be offered.</li>
                        </ul>
                      </section>
                      <hr />
                      {/* Refund Policy Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">💰 Refund Policy</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li><strong>Refund Processing Time:</strong> All eligible refunds will be processed within 15 to 30 working days after deduction of applicable fees and actual costs already incurred.</li>
                          <li><strong>Non-Refundable Components Include:</strong>
                            <ul className="list-disc pl-8">
                              <li>Visa fee (once applied)</li>
                              <li>Airline ticket charges (if non-refundable or issued)</li>
                              <li>Hotel cancellation fees (as per hotel policy)</li>
                              <li>Service and processing charges (₹5,000 minimum)</li>
                            </ul>
                          </li>
                          <li><strong>No Refund Will Be Issued For:</strong>
                            <ul className="list-disc pl-8">
                              <li>Voluntary withdrawal after visa issuance</li>
                              <li>Missed departures or missed services due to personal delays</li>
                              <li>Unused services (meals, transfers, hotel nights, etc.)</li>
                            </ul>
                          </li>
                        </ul>
                      </section>
                      <hr />
                      {/* Traveler Responsibilities Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">🧍🏽 Traveler Responsibilities</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li><strong>Valid Travel Documents:</strong> Travelers must hold a passport valid for at least 6 months beyond the travel date and must submit required documents (passport, photographs, vaccine certificate, etc.) on time.</li>
                          <li><strong>Information Accuracy:</strong> It is the traveler's responsibility to provide correct and complete information for visa processing. Any errors may lead to visa rejection or delays.</li>
                          <li><strong>Group Discipline & Conduct:</strong> All travelers must maintain respectful behavior, observe group timings, and follow tour leader instructions. Disruptive or disrespectful behavior may result in removal from the group with no refund.</li>
                          <li><strong>Health Disclosure & Fitness:</strong> Please inform us in advance of any medical condition or physical limitation. Travelers must be fit for walking during Ziyarah and Umrah rituals.</li>
                          <li><strong>Arrival Timeliness:</strong> Travelers must ensure they are punctual for airport check-ins, group departures, Ziyarah, and rituals. Delays may lead to missed components with no reimbursement.</li>
                        </ul>
                      </section>
                      <hr />
                      {/* Disclaimers Section */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">⚠️ Disclaimers</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li><strong>Force Majeure:</strong> The agency is not liable for delays, disruptions, or cancellations caused by factors beyond our control — including but not limited to natural calamities, political unrest, pandemics, government restrictions, airline/visa rejections, or acts of God.</li>
                          <li><strong>Itinerary Flexibility:</strong> While we strive to honor the planned itinerary, we reserve the right to modify hotels, flights, or travel dates based on operational or logistic necessities. Service quality will remain equivalent or better.</li>
                          <li><strong>Minimum Group Size:</strong> Certain features (e.g. tour leader, shared transport) may require a minimum number of participants. If unmet, we may revise service inclusions or offer an adjusted itinerary.</li>
                          <li><strong>Religious Disclaimer:</strong> The spiritual outcome of Umrah is solely with Allah. We serve as facilitators and cannot guarantee spiritual experiences or acceptance of worship.</li>
                        </ul>
                      </section>
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
                  <select className="w-full border rounded-lg p-2" value={selectedRoomType} onChange={e => {
                    const value = e.target.value;
                    setSelectedRoomType(value);
                    if (value === 'sharing') {
                      setGuestCount({ sharing: 1, childWithoutBed: 0, infants: 0 });
                    } else if (value === 'private') {
                      setGuestCount({ quint: 0, quad: 0, triple: 0, double: 0, single: 0, childWithoutBed: 0, infants: 0 });
                    }
                  }}>
                    <option value="" disabled>Select room type</option>
                    <option value="sharing">Sharing room</option>
                    <option value="private">Private room</option>
                  </select>
                </div>
                {/* Guest Count Selection - only show if sharing */}
                {selectedRoomType === 'sharing' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" />Adult</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, sharing: Math.max(1, (g.sharing || 1) - 1) }))}>-</Button>
                        <span className="w-8 text-center font-bold">{guestCount.sharing || 1}</span>
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, sharing: (g.sharing || 1) + 1 }))}>+</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2 text-yellow-700"><Users className="w-5 h-5 text-yellow-500" />Child (no bed)</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, childWithoutBed: Math.max(0, g.childWithoutBed - 1) }))}>-</Button>
                        <span className="w-8 text-center font-bold">{guestCount.childWithoutBed}</span>
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, childWithoutBed: g.childWithoutBed + 1 }))}>+</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                      <span className="font-medium flex items-center gap-2 text-purple-700"><Users className="w-5 h-5 text-purple-500" />Infant</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, infants: Math.max(0, g.infants - 1) }))}>-</Button>
                        <span className="w-8 text-center font-bold">{guestCount.infants}</span>
                        <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, infants: g.infants + 1 }))}>+</Button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Guest Count Selection - only show if private */}
                {selectedRoomType === 'private' && (
                  <div>
                    <label className="text-sm font-semibold mb-3 block">Select Number of Rooms</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" />Quint Bed</span>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, quint: Math.max(0, (g.quint || 0) - 1) }))}>-</Button>
                          <span className="w-8 text-center font-bold">{guestCount.quint || 0}</span>
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, quint: (g.quint || 0) + 1 }))}>+</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" />Quad Bed</span>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, quad: Math.max(0, (g.quad || 0) - 1) }))}>-</Button>
                          <span className="w-8 text-center font-bold">{guestCount.quad || 0}</span>
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, quad: (g.quad || 0) + 1 }))}>+</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" />Triple Bed</span>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, triple: Math.max(0, (g.triple || 0) - 1) }))}>-</Button>
                          <span className="w-8 text-center font-bold">{guestCount.triple || 0}</span>
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, triple: (g.triple || 0) + 1 }))}>+</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" />Double Bed</span>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, double: Math.max(0, (g.double || 0) - 1) }))}>-</Button>
                          <span className="w-8 text-center font-bold">{guestCount.double || 0}</span>
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, double: (g.double || 0) + 1 }))}>+</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" />Single Bed</span>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, single: Math.max(0, (g.single || 0) - 1) }))}>-</Button>
                          <span className="w-8 text-center font-bold">{guestCount.single || 0}</span>
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, single: (g.single || 0) + 1 }))}>+</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2 text-yellow-700"><Users className="w-5 h-5 text-yellow-500" />Child (no bed)</span>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, childWithoutBed: Math.max(0, g.childWithoutBed - 1) }))}>-</Button>
                          <span className="w-8 text-center font-bold">{guestCount.childWithoutBed}</span>
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, childWithoutBed: g.childWithoutBed + 1 }))}>+</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                        <span className="font-medium flex items-center gap-2 text-purple-700"><Users className="w-5 h-5 text-purple-500" />Infants</span>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, infants: Math.max(0, g.infants - 1) }))}>-</Button>
                          <span className="w-8 text-center font-bold">{guestCount.infants}</span>
                          <Button size="icon" variant="outline" onClick={() => setGuestCount(g => ({ ...g, infants: g.infants + 1 }))}>+</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedRoomType === 'private' && (
                  (() => {
                    const capacities = { quint: 5, quad: 4, triple: 3, double: 2, single: 1 };
                    const roomTypes = ['quint', 'quad', 'triple', 'double', 'single'];
                    let totalRoomTravelers = 0;
                    let totalRooms = 0;
                    let roomBreakdown = [];
                    let roomsCost = 0;
                    roomTypes.forEach(type => {
                      const count = guestCount[type] || 0;
                      const cap = capacities[type];
                      const price = pkg.pricing?.private?.[type] || 0;
                      if (count > 0) {
                        const subtotal = count * price;
                        roomBreakdown.push({
                          type: type.charAt(0).toUpperCase() + type.slice(1),
                          count,
                          cap,
                          price,
                          subtotal
                        });
                        totalRoomTravelers += count * cap;
                        totalRooms += count;
                        roomsCost += subtotal;
                      }
                    });
                    const childWithoutBed = guestCount.childWithoutBed || 0;
                    const infants = guestCount.infants || 0;
                    const childWithoutBedCost = (pkg.pricing?.childWithoutBed || 0) * childWithoutBed;
                    const infantsCost = (pkg.pricing?.infant || 0) * infants;
                    const totalTravelers = totalRoomTravelers + childWithoutBed + infants;
                    const totalCost = roomsCost + childWithoutBedCost + infantsCost;
                    return (
                      <div className="space-y-4 bg-green-50 rounded-lg p-4">
                        <div className="font-semibold mb-2">Room Breakdown</div>
                        <div className="space-y-2">
                          {roomBreakdown.map((r, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{r.type} Room × {r.count} <span className="text-gray-500">({r.cap} guests/room)</span></span>
                              <span>{getCurrencySymbol(pkg.currency)}{r.price.toLocaleString()} × {r.count} = <span className="font-semibold">{getCurrencySymbol(pkg.currency)}{r.subtotal.toLocaleString()}</span></span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm mt-2"><span>Total Rooms:</span><span className="font-semibold">{totalRooms}</span></div>
                        <div className="flex justify-between text-sm"><span>Child (no bed):</span><span>{childWithoutBed} × {getCurrencySymbol(pkg.currency)}{(pkg.pricing?.childWithoutBed || 0).toLocaleString()} = <span className="font-semibold">{getCurrencySymbol(pkg.currency)}{childWithoutBedCost.toLocaleString()}</span></span></div>
                        <div className="flex justify-between text-sm"><span>Infant:</span><span>{infants} × {getCurrencySymbol(pkg.currency)}{(pkg.pricing?.infant || 0).toLocaleString()} = <span className="font-semibold">{getCurrencySymbol(pkg.currency)}{infantsCost.toLocaleString()}</span></span></div>
                        <div className="flex justify-between text-base mt-2"><span>Total Travelers:</span><span className="font-semibold">{totalTravelers}</span></div>
                        <div className="flex justify-between items-center pt-2 border-t text-lg"><span className="font-semibold">Total Cost:</span><span className="text-2xl font-bold text-emerald-600">{getCurrencySymbol(pkg.currency)}{totalCost.toLocaleString()}</span></div>
                      </div>
                    );
                  })()
                )}
                {selectedRoomType === 'sharing' && (() => {
                  const adultCount = guestCount.sharing || 1;
                  const childWithoutBed = guestCount.childWithoutBed || 0;
                  const infants = guestCount.infants || 0;
                  const adultPrice = pkg.pricing?.sharing?.pricePerTraveler || 0;
                  const childWithoutBedPrice = pkg.pricing?.childWithoutBed || 0;
                  const infantPrice = pkg.pricing?.infant || 0;
                  const adultSubtotal = adultCount * adultPrice;
                  const childWithoutBedSubtotal = childWithoutBed * childWithoutBedPrice;
                  const infantSubtotal = infants * infantPrice;
                  const totalTravelers = adultCount + childWithoutBed + infants;
                  const totalCost = adultSubtotal + childWithoutBedSubtotal + infantSubtotal;
                  return (
                    <div className="space-y-4 bg-green-50 rounded-lg p-4 mt-4">
                      <div className="font-semibold mb-2">Booking Breakdown</div>
                      <div className="flex justify-between text-sm"><span>Adult:</span><span>{adultCount} × {getCurrencySymbol(pkg.currency)}{adultPrice.toLocaleString()} = <span className="font-semibold">{getCurrencySymbol(pkg.currency)}{adultSubtotal.toLocaleString()}</span></span></div>
                      <div className="flex justify-between text-sm"><span>Child (no bed):</span><span>{childWithoutBed} × {getCurrencySymbol(pkg.currency)}{childWithoutBedPrice.toLocaleString()} = <span className="font-semibold">{getCurrencySymbol(pkg.currency)}{childWithoutBedSubtotal.toLocaleString()}</span></span></div>
                      <div className="flex justify-between text-sm"><span>Infant:</span><span>{infants} × {getCurrencySymbol(pkg.currency)}{infantPrice.toLocaleString()} = <span className="font-semibold">{getCurrencySymbol(pkg.currency)}{infantSubtotal.toLocaleString()}</span></span></div>
                      <div className="flex justify-between text-base mt-2"><span>Total Travelers:</span><span className="font-semibold">{totalTravelers}</span></div>
                      <div className="flex justify-between items-center pt-2 border-t text-lg"><span className="font-semibold">Total Cost:</span><span className="text-2xl font-bold text-emerald-600">{getCurrencySymbol(pkg.currency)}{totalCost.toLocaleString()}</span></div>
                    </div>
                  );
                })()}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-lg py-6 shadow-lg">Book This Package Now</Button>
                  <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">Request Custom Quote</Button>
                </div>
                {/* Need Assistance Section */}
                <hr className="my-6" />
                <div className="space-y-4">
                  <div className="font-semibold text-lg">Need Assistance?</div>
                  <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z" /></svg>
                    <div>
                      <div className="font-semibold">Call Us</div>
                      <div className="text-gray-700">+91-78920-09800</div>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 008 0zm-8 0V8a4 4 0 018 0v4" /></svg>
                    <div>
                      <div className="font-semibold">Email Us</div>
                      <div className="text-gray-700">support@marhabahaji.com</div>
                    </div>
                  </div>
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