import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Plane, Landmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const GroupPackageDetail = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .eq('slug', slug)
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
    fetchPackage();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading package details...</div>;
  }
  if (error || !pkg) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-red-600">{error || 'Package not found.'}</div>;
  }

  // Helper for currency
  const getCurrencySymbol = (currency: string | undefined) => {
    switch ((currency || 'INR').toUpperCase()) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'SAR': return '﷼';
      default: return currency ? currency.toUpperCase() + ' ' : '₹';
    }
  };

  // Clamp values for business rules
  const maxCap = pkg.max_capacity || 0;
  const availableSpots = Math.min(pkg.available_spots ?? 0, maxCap);
  const minParticipants = Math.min(pkg.min_participants ?? 0, maxCap);
  const isSoldOut = availableSpots === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-white shadow-lg">
        {pkg.featured_image && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden">
            <img src={pkg.featured_image} alt={pkg.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {/* Tags on image */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              {pkg.is_group_package && <Badge className="bg-emerald-600 text-white shadow">Group</Badge>}
              {pkg.package_category && <Badge className="bg-amber-100 text-amber-800 border-amber-200 shadow">{pkg.package_category}</Badge>}
              {isSoldOut && <Badge className="bg-red-600 text-white shadow">Sold Out</Badge>}
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <Badge className="bg-white/80 text-emerald-700 border-emerald-200 flex items-center gap-1 shadow">
                <Clock className="w-4 h-4 text-emerald-500" />
                {pkg.duration}
              </Badge>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{pkg.name}</h1>
            <div className="flex flex-wrap gap-3 items-center text-sm text-gray-700 mb-2">
              {pkg.makkah_hotel?.name && (
                <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                  <Landmark className="w-4 h-4 mr-1 text-emerald-500" />
                  {pkg.makkah_hotel.name}
                </span>
              )}
              {pkg.madinah_hotel?.name && (
                <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                  <Landmark className="w-4 h-4 mr-1 text-emerald-500" />
                  {pkg.madinah_hotel.name}
                </span>
              )}
              {pkg.flight_details?.departure_from_airport && (
                <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                  <Plane className="w-4 h-4 mr-1 text-emerald-500" />
                  Dep: {pkg.flight_details.departure_from_airport}
                </span>
              )}
              {pkg.flight_details?.airline_name && (
                <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                  <Plane className="w-4 h-4 mr-1 text-emerald-500" />
                  {pkg.flight_details.airline_name}
                </span>
              )}
              {pkg.flight_details?.flight_type && (
                <span className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                  <Plane className="w-4 h-4 mr-1 text-emerald-500" />
                  {pkg.flight_details.flight_type}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold text-emerald-600">{getCurrencySymbol(pkg.currency)}{pkg.price}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Quick Facts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Facts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><b>Duration:</b> {pkg.duration}</div>
              <div><b>Group Type:</b> {pkg.is_group_package ? 'Group' : 'Individual'}</div>
              <div><b>Package Category:</b> {pkg.package_category || '-'}</div>
              <div><b>Status:</b> {pkg.status}</div>
              <div><b>Available Spots:</b> {availableSpots}</div>
              <div><b>Min Participants:</b> {minParticipants}</div>
              <div><b>Max Capacity:</b> {maxCap}</div>
              <div><b>Departure Date:</b> {pkg.departure_date || '-'}</div>
              <div><b>Return Date:</b> {pkg.return_date || '-'}</div>
              <div><b>Booking Deadline:</b> {pkg.booking_deadline || '-'}</div>
              <div><b>Meal Plan:</b> {pkg.meal_plan || '-'}</div>
              <div><b>Currency:</b> {pkg.currency || 'INR'}</div>
            </div>
          </CardContent>
        </Card>

        {/* Hotels Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pkg.makkah_hotel && (
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2"><Landmark className="w-5 h-5 text-emerald-500" /> Makkah Hotel</h4>
                  <div className="font-bold text-lg mb-1">{pkg.makkah_hotel.name}</div>
                  {pkg.makkah_hotel.address && <div className="text-xs text-gray-500 mb-1">{pkg.makkah_hotel.address}</div>}
                  {pkg.makkah_hotel.amenities && (
                    <div className="flex flex-wrap gap-2 mb-1">
                      {pkg.makkah_hotel.amenities.map((a: string, idx: number) => (
                        <Badge key={idx} className="bg-emerald-100 text-emerald-700 border-emerald-200">{a}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {pkg.madinah_hotel && (
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2"><Landmark className="w-5 h-5 text-emerald-500" /> Madinah Hotel</h4>
                  <div className="font-bold text-lg mb-1">{pkg.madinah_hotel.name}</div>
                  {pkg.madinah_hotel.address && <div className="text-xs text-gray-500 mb-1">{pkg.madinah_hotel.address}</div>}
                  {pkg.madinah_hotel.amenities && (
                    <div className="flex flex-wrap gap-2 mb-1">
                      {pkg.madinah_hotel.amenities.map((a: string, idx: number) => (
                        <Badge key={idx} className="bg-emerald-100 text-emerald-700 border-emerald-200">{a}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Flight Details Section */}
        {pkg.flight_details && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Flight Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><b>Departure Airport:</b> {pkg.flight_details.departure_from_airport || '-'}</div>
                <div><b>Return Airport:</b> {pkg.flight_details.return_from_airport || '-'}</div>
                <div><b>Airline:</b> {pkg.flight_details.airline_name || '-'}</div>
                <div><b>Flight Type:</b> {pkg.flight_details.flight_type || '-'}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meal Plan Section */}
        {pkg.meal_plan && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Meal Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{pkg.meal_plan}</div>
            </CardContent>
          </Card>
        )}

        {/* Inclusions/Exclusions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader><CardTitle>Inclusions</CardTitle></CardHeader>
            <CardContent>
              {pkg.inclusions && pkg.inclusions.length > 0 ? (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {pkg.inclusions.map((inc: string, idx: number) => (
                    <li key={idx}>{inc}</li>
                  ))}
                </ul>
              ) : <div className="text-xs text-gray-500">-</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Exclusions</CardTitle></CardHeader>
            <CardContent>
              {pkg.exclusions && pkg.exclusions.length > 0 ? (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {pkg.exclusions.map((exc: string, idx: number) => (
                    <li key={idx}>{exc}</li>
                  ))}
                </ul>
              ) : <div className="text-xs text-gray-500">-</div>}
            </CardContent>
          </Card>
        </div>

        {/* Activities Section */}
        {pkg.activities && pkg.activities.length > 0 && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Activities</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {pkg.activities.map((act: string, idx: number) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Itinerary Section */}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Itinerary</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="px-3 py-2 border">Day</th>
                      <th className="px-3 py-2 border">Location</th>
                      <th className="px-3 py-2 border">Activities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pkg.itinerary.map((item: any, idx: number) => (
                      <tr key={idx} className="even:bg-gray-50">
                        <td className="px-3 py-2 border">{item.day || idx + 1}</td>
                        <td className="px-3 py-2 border">{item.location || '-'}</td>
                        <td className="px-3 py-2 border">
                          {Array.isArray(item.activities) ? (
                            <ul className="list-disc pl-4">
                              {item.activities.map((a: string, i: number) => <li key={i}>{a}</li>)}
                            </ul>
                          ) : item.activities || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Table Section */}
        {pkg.pricing && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">{JSON.stringify(pkg.pricing, null, 2)}</pre>
              {/* You can replace this with a more beautiful table if you want */}
            </CardContent>
          </Card>
        )}

        {/* Contact/Lead Capture Section */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Enquire or Book</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
                <Link to="/custom-packages">Custom Package Request</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      <Footer />
    </div>
  );
};

export default GroupPackageDetail; 