
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header, { useCurrency } from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Star, 
  CheckCircle,
  Clock,
  Users,
  Plane,
  Hotel,
  Car,
  User,
  Phone,
  Mail,
  X,
  Plus,
  Minus,
  Bed,
  Baby,
  UserCheck,
  Utensils,
  Camera,
  Mountain,
  Building
} from 'lucide-react';

interface GuestCount {
  adults: number;
  childWithBed: number;
  childWithoutBed: number;
  infants: number;
}

interface PriceChart {
  adult: number;
  childWithBed: number;
  childWithoutBed: number;
  infant: number;
}

const AdvancedPackageDetails = () => {
  const { id } = useParams();
  const { currency } = useCurrency();
  const [guestCount, setGuestCount] = useState<GuestCount>({
    adults: 2,
    childWithBed: 0,
    childWithoutBed: 0,
    infants: 0
  });

  const [selectedRoomType, setSelectedRoomType] = useState('double');
  const [totalCost, setTotalCost] = useState(0);

  // Mock package data
  const packageData = {
    title: "Premium Deluxe Umrah Experience",
    duration: "12 Days / 11 Nights",
    packageType: "Group",
    rating: 4.9,
    reviews: 847,
    image: "photo-1466442929976-97f336a657be",
    
    makkahHotel: {
      name: "Makkah Hilton Convention Hotel",
      rating: 5,
      distance: "200m from Haram",
      nights: 7,
      image: "photo-1487958449943-2429e8be8625",
      amenities: ["Free WiFi", "AC", "Room Service", "Buffet Breakfast", "Prayer Area"]
    },
    
    madinahHotel: {
      name: "Madinah Movenpick Hotel",
      rating: 5,
      distance: "150m from Masjid Nabawi",
      nights: 4,
      image: "photo-1492321936769-b49830bc1d1e",
      amenities: ["Free WiFi", "AC", "Room Service", "Buffet Breakfast", "Prayer Area"]
    },

    flightDetails: {
      departure: "Delhi (DEL)",
      arrival: "Jeddah (JED)",
      airline: "Air India Express",
      duration: "5h 30m",
      type: "Direct Flight"
    },

    mealPlan: "Breakfast & Dinner included in hotels",
    
    inclusions: [
      "Return economy class airfare",
      "7 nights accommodation in Makkah (5-star)",
      "4 nights accommodation in Madinah (5-star)",
      "Airport transfers in AC vehicles",
      "Makkah to Madinah transfer in AC bus",
      "Ziarath tours in both cities",
      "English/Urdu speaking guide",
      "Travel insurance coverage",
      "Breakfast & dinner at hotels"
    ],
    
    exclusions: [
      "Saudi Arabia visa fees",
      "Lunch meals",
      "Personal expenses",
      "Laundry services",
      "Shopping expenses",
      "Tips and gratuities",
      "Medical expenses",
      "Optional tours not mentioned"
    ],

    activities: [
      "Umrah ritual guidance",
      "Historical Makkah tour",
      "Cave Hira visit",
      "Jabal Noor expedition",
      "Masjid Quba visit",
      "Mount Uhud tour",
      "Baqi cemetery visit",
      "Shopping assistance"
    ],

    itinerary: [
      { day: 1, location: "Departure", activities: ["Airport departure", "Flight to Jeddah", "Makkah transfer", "Hotel check-in"] },
      { day: 2, location: "Makkah", activities: ["First Umrah", "Tawaf guidance", "Sa'i completion", "Rest & prayers"] },
      { day: 3, location: "Makkah", activities: ["Additional Tawaf", "Cave Hira visit", "Historical sites", "Shopping time"] },
      { day: 4, location: "Makkah", activities: ["Jabal Noor tour", "Religious lectures", "Group prayers", "Free time"] },
      { day: 5, location: "Makkah", activities: ["Final Umrah", "Farewell Tawaf", "Shopping", "Preparation"] },
      { day: 6, location: "Travel Day", activities: ["Hotel checkout", "Makkah to Madinah", "Madinah arrival", "Hotel check-in"] },
      { day: 7, location: "Madinah", activities: ["Masjid Nabawi", "Rawdah prayers", "Ziarath tours", "Evening prayers"] },
      { day: 8, location: "Madinah", activities: ["Quba Mosque", "Mount Uhud", "Historical sites", "Group discussions"] },
      { day: 9, location: "Madinah", activities: ["Baqi cemetery", "Final prayers", "Shopping", "Cultural tours"] },
      { day: 10, location: "Madinah", activities: ["Free morning", "Final Masjid Nabawi", "Farewell dinner", "Rest"] },
      { day: 11, location: "Departure", activities: ["Hotel checkout", "Airport transfer", "Flight departure", "Journey home"] },
      { day: 12, location: "Arrival", activities: ["Home arrival", "Journey complete", "Memories cherished", "Spiritual fulfillment"] }
    ],

    pricing: {
      single: { adult: 89999, childWithBed: 67499, childWithoutBed: 44999, infant: 12000 },
      double: { adult: 69999, childWithBed: 52499, childWithoutBed: 34999, infant: 10000 },
      triple: { adult: 59999, childWithBed: 44999, childWithoutBed: 29999, infant: 8000 },
      quad: { adult: 54999, childWithBed: 41249, childWithoutBed: 27499, infant: 7000 },
      quint: { adult: 52999, childWithBed: 39749, childWithoutBed: 26499, infant: 6500 },
      six: { adult: 49999, childWithBed: 37499, childWithoutBed: 24999, infant: 6000 }
    }
  };

  const currencyRates = { INR: 1, USD: 0.012, SAR: 0.045 };
  const currencySymbols = { INR: '₹', USD: '$', SAR: 'ر.س' };

  const convertPrice = (price: number) => {
    const rate = currencyRates[currency as keyof typeof currencyRates] || 1;
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '₹';
    return `${symbol}${Math.round(price * rate).toLocaleString()}`;
  };

  const updateGuestCount = (type: keyof GuestCount, increment: boolean) => {
    setGuestCount(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
    }));
  };

  const calculateTotalCost = () => {
    const roomPricing = packageData.pricing[selectedRoomType as keyof typeof packageData.pricing];
    const cost = 
      (guestCount.adults * roomPricing.adult) +
      (guestCount.childWithBed * roomPricing.childWithBed) +
      (guestCount.childWithoutBed * roomPricing.childWithoutBed) +
      (guestCount.infants * roomPricing.infant);
    setTotalCost(cost);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [guestCount, selectedRoomType]);

  const totalGuests = guestCount.adults + guestCount.childWithBed + guestCount.childWithoutBed + guestCount.infants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <img 
          src={`https://images.unsplash.com/${packageData.image}?w=1400&h=800&fit=crop`}
          alt={packageData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <Badge className="bg-emerald-600 text-white mb-4 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                {packageData.packageType} Package
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {packageData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {packageData.duration}
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 fill-current text-yellow-400" />
                  {packageData.rating} ({packageData.reviews} reviews)
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Makkah & Madinah
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Flight Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plane className="w-6 h-6 mr-2 text-blue-600" />
                      Flight Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold">Route:</span>
                          <p className="text-gray-600">{packageData.flightDetails.departure} → {packageData.flightDetails.arrival}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Airline:</span>
                          <p className="text-gray-600">{packageData.flightDetails.airline}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold">Duration:</span>
                          <p className="text-gray-600">{packageData.flightDetails.duration}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Type:</span>
                          <p className="text-gray-600">{packageData.flightDetails.type}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inclusions & Exclusions */}
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-600">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Inclusions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {packageData.inclusions.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <X className="w-6 h-6 mr-2" />
                        Exclusions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {packageData.exclusions.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <X className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Meal Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Utensils className="w-6 h-6 mr-2 text-orange-600" />
                      Meal Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-gray-700">{packageData.mealPlan}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hotels Tab */}
              <TabsContent value="hotels" className="space-y-8">
                <div className="grid gap-8">
                  {/* Makkah Hotel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="w-6 h-6 mr-2 text-emerald-600" />
                        Makkah Accommodation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={`https://images.unsplash.com/${packageData.makkahHotel.image}?w=400&h=300&fit=crop`}
                            alt={packageData.makkahHotel.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-xl font-bold">{packageData.makkahHotel.name}</h3>
                            <div className="flex items-center mt-1">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">({packageData.makkahHotel.rating}/5)</span>
                            </div>
                          </div>
                          <p className="text-emerald-600 font-semibold">{packageData.makkahHotel.distance}</p>
                          <p className="text-gray-600">{packageData.makkahHotel.nights} nights stay</p>
                          <div className="flex flex-wrap gap-2">
                            {packageData.makkahHotel.amenities.map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Madinah Hotel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="w-6 h-6 mr-2 text-blue-600" />
                        Madinah Accommodation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={`https://images.unsplash.com/${packageData.madinahHotel.image}?w=400&h=300&fit=crop`}
                            alt={packageData.madinahHotel.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-xl font-bold">{packageData.madinahHotel.name}</h3>
                            <div className="flex items-center mt-1">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">({packageData.madinahHotel.rating}/5)</span>
                            </div>
                          </div>
                          <p className="text-blue-600 font-semibold">{packageData.madinahHotel.distance}</p>
                          <p className="text-gray-600">{packageData.madinahHotel.nights} nights stay</p>
                          <div className="flex flex-wrap gap-2">
                            {packageData.madinahHotel.amenities.map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Itinerary Tab */}
              <TabsContent value="itinerary">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {packageData.itinerary.map((day, index) => (
                        <div key={index} className="relative">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                                {day.day}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-gray-900 mb-2">{day.location}</h4>
                              <div className="grid md:grid-cols-2 gap-2">
                                {day.activities.map((activity, actIndex) => (
                                  <div key={actIndex} className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700">{activity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {index < packageData.itinerary.length - 1 && (
                            <div className="absolute left-5 top-12 w-px h-8 bg-gray-300"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activities Tab */}
              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-6 h-6 mr-2 text-purple-600" />
                      Package Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <Mountain className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-700">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(packageData.pricing).map(([roomType, prices]) => (
                        <div key={roomType} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-lg mb-3 capitalize">{roomType} Room</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <UserCheck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                              <p className="text-sm font-medium">Adult</p>
                              <p className="text-lg font-bold text-blue-600">{convertPrice(prices.adult)}</p>
                            </div>
                            <div className="text-center">
                              <Bed className="w-6 h-6 mx-auto mb-2 text-green-600" />
                              <p className="text-sm font-medium">Child (with bed)</p>
                              <p className="text-lg font-bold text-green-600">{convertPrice(prices.childWithBed)}</p>
                            </div>
                            <div className="text-center">
                              <User className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                              <p className="text-sm font-medium">Child (no bed)</p>
                              <p className="text-lg font-bold text-orange-600">{convertPrice(prices.childWithoutBed)}</p>
                            </div>
                            <div className="text-center">
                              <Baby className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                              <p className="text-sm font-medium">Infant</p>
                              <p className="text-lg font-bold text-purple-600">{convertPrice(prices.infant)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Terms Tab */}
              <TabsContent value="terms" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Terms & Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Payment Terms</h4>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• 25% advance payment required for booking confirmation</li>
                        <li>• Balance payment due 30 days before departure</li>
                        <li>• All payments non-refundable once visa processing begins</li>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• 60+ days: 75% refund (excluding visa fees)</li>
                        <li>• 30-59 days: 50% refund</li>
                        <li>• 15-29 days: 25% refund</li>
                        <li>• Less than 15 days: No refund</li>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Traveler Responsibilities</h4>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• Valid passport with minimum 6 months validity</li>
                        <li>• Complete visa documentation as required</li>
                        <li>• Travel insurance recommended</li>
                        <li>• Adherence to Saudi Arabia laws and customs</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Guest Selection */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Select Guests & Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Type Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Room Type</label>
                  <select 
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="single">Single Room</option>
                    <option value="double">Double Room</option>
                    <option value="triple">Triple Room</option>
                    <option value="quad">Quad Room</option>
                    <option value="quint">Quint Room</option>
                    <option value="six">6 in a Room</option>
                  </select>
                </div>

                {/* Guest Count */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Adults</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGuestCount('adults', false)}
                        disabled={guestCount.adults <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-medium">{guestCount.adults}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGuestCount('adults', true)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Child (with bed)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGuestCount('childWithBed', false)}
                        disabled={guestCount.childWithBed <= 0}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-medium">{guestCount.childWithBed}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGuestCount('childWithBed', true)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Child (no bed)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGuestCount('childWithoutBed', false)}
                        disabled={guestCount.childWithoutBed <= 0}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-medium">{guestCount.childWithoutBed}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGuestCount('childWithoutBed', true)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Baby className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Infants</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGuestCount('infants', false)}
                        disabled={guestCount.infants <= 0}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-medium">{guestCount.infants}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateGuestCount('infants', true)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Guests:</span>
                    <span className="font-medium">{totalGuests}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-emerald-600">
                    <span>Total Cost:</span>
                    <span>{convertPrice(totalCost)}</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-lg py-6">
                  Book This Package
                </Button>
                <Button variant="outline" className="w-full border-emerald-600 text-emerald-600">
                  Request Quote
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>+91-78920-09800</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>info@marhabahaji.com</span>
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

export default AdvancedPackageDetails;
