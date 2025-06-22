import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header, { useCurrency } from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import LeadCapturePopup from '../components/LeadCapturePopup';
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
  Building,
  Globe,
  Shield,
  CreditCard,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react';

interface GuestCount {
  adults: number;
  childWithBed: number;
  childWithoutBed: number;
  infants: number;
}

const PackageDetails = () => {
  const { id } = useParams();
  const { currency } = useCurrency();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [guestCount, setGuestCount] = useState<GuestCount>({
    adults: 2,
    childWithBed: 0,
    childWithoutBed: 0,
    infants: 0
  });

  const [selectedRoomType, setSelectedRoomType] = useState('double');
  const [packageType, setPackageType] = useState('group');
  const [totalCost, setTotalCost] = useState(0);

  // Check if popup was already shown on this page
  useEffect(() => {
    const currentPage = window.location.pathname;
    const popupShownKey = `popup-shown-${currentPage}`;
    const wasShown = sessionStorage.getItem(popupShownKey);
    
    if (!wasShown) {
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    const currentPage = window.location.pathname;
    const popupShownKey = `popup-shown-${currentPage}`;
    sessionStorage.setItem(popupShownKey, 'true');
  };

  // Mock package data
  const packageData = {
    title: "Premium Deluxe Umrah Experience",
    duration: "12 Days / 11 Nights",
    rating: 4.9,
    reviews: 847,
    image: "photo-1466442929976-97f336a657be",
    
    makkahHotel: {
      name: "Makkah Hilton Convention Hotel",
      rating: 5,
      distance: "200m from Haram",
      nights: 7,
      image: "photo-1487958449943-2429e8be8625",
      amenities: ["Free WiFi", "AC", "Room Service", "Buffet Breakfast", "Prayer Area", "24/7 Reception", "Laundry Service", "Elevator Access"]
    },
    
    madinahHotel: {
      name: "Madinah Movenpick Hotel",
      rating: 5,
      distance: "150m from Masjid Nabawi",
      nights: 4,
      image: "photo-1492321936769-b49830bc1d1e",
      amenities: ["Free WiFi", "AC", "Room Service", "Buffet Breakfast", "Prayer Area", "24/7 Reception", "Concierge Service", "Business Center"]
    },

    flightDetails: {
      departure: "Delhi (DEL)",
      arrival: "Jeddah (JED)",
      airline: "Air India Express",
      duration: "5h 30m",
      type: "Direct Flight",
      aircraft: "Boeing 737-800",
      baggage: "30kg checked + 7kg cabin"
    },

    mealPlan: {
      type: "Half Board",
      description: "Breakfast & Dinner included in hotels",
      details: ["Buffet breakfast daily", "3-course dinner", "Halal certified meals", "Vegetarian options available"]
    },
    
    inclusions: [
      "Return economy class airfare",
      "7 nights accommodation in Makkah (5-star)",
      "4 nights accommodation in Madinah (5-star)",
      "Airport transfers in AC vehicles",
      "Makkah to Madinah transfer in AC bus",
      "Ziarath tours in both cities",
      "English/Urdu speaking guide",
      "Travel insurance coverage",
      "Breakfast & dinner at hotels",
      "Visa processing assistance",
      "Group coordination services",
      "24/7 emergency support"
    ],
    
    exclusions: [
      "Saudi Arabia visa fees ($120 per person)",
      "Lunch meals during stay",
      "Personal expenses & shopping",
      "Laundry & room service charges",
      "Tips for guides & drivers",
      "Medical expenses & medications",
      "Optional tours not mentioned",
      "Excess baggage charges",
      "Phone calls & internet charges",
      "Items of personal nature"
    ],

    activities: [
      "Umrah ritual guidance with expert scholars",
      "Historical Makkah city tour",
      "Cave Hira spiritual visit",
      "Jabal Noor mountain expedition",
      "Masjid Quba blessed visit",
      "Mount Uhud historical tour",
      "Baqi cemetery respectful visit",
      "Traditional shopping assistance",
      "Islamic lectures & discussions",
      "Group prayer sessions",
      "Cultural exchange programs",
      "Photography guidance tours"
    ],

    itinerary: [
      { day: 1, location: "Departure Day", activities: ["Airport departure ceremony", "Direct flight to Jeddah", "VIP airport reception", "Comfortable transfer to Makkah", "Hotel check-in process", "Welcome orientation session"] },
      { day: 2, location: "Makkah - First Umrah", activities: ["Early morning preparation", "First sacred Umrah", "Tawaf with guidance", "Sa'i completion ritual", "Rest & spiritual reflection", "Evening group prayers"] },
      { day: 3, location: "Makkah - Spiritual Tours", activities: ["Additional blessed Tawaf", "Sacred Cave Hira visit", "Historical sites exploration", "Traditional shopping time", "Islamic knowledge sessions", "Group dinner & discussions"] },
      { day: 4, location: "Makkah - Mountain Tour", activities: ["Jabal Noor spiritual expedition", "Religious lectures by scholars", "Collective group prayers", "Free time for worship", "Cultural exchange activities", "Traditional evening meal"] },
      { day: 5, location: "Makkah - Final Rituals", activities: ["Final blessed Umrah", "Farewell Tawaf ceremony", "Last-minute shopping", "Packing & preparation", "Group photo sessions", "Spiritual reflection time"] },
      { day: 6, location: "Travel to Madinah", activities: ["Hotel checkout process", "Scenic Makkah to Madinah journey", "Welcome to Madinah arrival", "Hotel check-in ceremony", "First Masjid Nabawi visit", "Evening orientation session"] },
      { day: 7, location: "Madinah - Sacred Visits", activities: ["Blessed Masjid Nabawi prayers", "Sacred Rawdah experience", "Comprehensive Ziarath tours", "Evening collective prayers", "Islamic history lessons", "Group spiritual discussions"] },
      { day: 8, location: "Madinah - Historical Sites", activities: ["Beautiful Quba Mosque visit", "Mount Uhud expedition", "Historical battlefields tour", "Group learning sessions", "Cultural exploration activities", "Traditional dinner experience"] },
      { day: 9, location: "Madinah - Cultural Day", activities: ["Respectful Baqi cemetery visit", "Final Masjid Nabawi prayers", "Traditional shopping excursion", "Cultural heritage tours", "Photography sessions", "Farewell group activities"] },
      { day: 10, location: "Madinah - Reflection", activities: ["Free morning for worship", "Final blessed Masjid Nabawi", "Farewell dinner ceremony", "Packing & preparation", "Group sharing sessions", "Rest & spiritual reflection"] },
      { day: 11, location: "Departure Preparation", activities: ["Hotel checkout ceremony", "Airport transfer journey", "Flight departure process", "Journey home begins", "In-flight services", "Travel completion prayers"] },
      { day: 12, location: "Safe Arrival", activities: ["Home country arrival", "Airport reception ceremony", "Journey completion celebration", "Cherished memories collection", "Spiritual fulfillment achieved", "New life chapter begins"] }
    ],

    pricing: {
      group: {
        single: { adult: 89999, childWithBed: 67499, childWithoutBed: 44999, infant: 12000 },
        double: { adult: 69999, childWithBed: 52499, childWithoutBed: 34999, infant: 10000 },
        triple: { adult: 59999, childWithBed: 44999, childWithoutBed: 29999, infant: 8000 },
        quad: { adult: 54999, childWithBed: 41249, childWithoutBed: 27499, infant: 7000 },
        quint: { adult: 52999, childWithBed: 39749, childWithoutBed: 26499, infant: 6500 },
        six: { adult: 49999, childWithBed: 37499, childWithoutBed: 24999, infant: 6000 }
      },
      independent: {
        single: { adult: 109999, childWithBed: 82499, childWithoutBed: 54999, infant: 15000 },
        double: { adult: 89999, childWithBed: 67499, childWithoutBed: 44999, infant: 12000 },
        triple: { adult: 79999, childWithBed: 59999, childWithoutBed: 39999, infant: 10000 },
        quad: { adult: 74999, childWithBed: 56249, childWithoutBed: 37499, infant: 9000 },
        quint: { adult: 72999, childWithBed: 54749, childWithoutBed: 36499, infant: 8500 },
        six: { adult: 69999, childWithBed: 52499, childWithoutBed: 34999, infant: 8000 }
      }
    },

    terms: {
      payment: [
        "25% advance payment required for booking confirmation",
        "Balance payment due 30 days before departure",
        "All payments non-refundable once visa processing begins",
        "Payment can be made via bank transfer, credit card, or cash",
        "EMI options available for bookings above ₹50,000"
      ],
      cancellation: [
        "60+ days before departure: 75% refund (excluding visa fees)",
        "30-59 days before departure: 50% refund",
        "15-29 days before departure: 25% refund",
        "Less than 15 days before departure: No refund",
        "Visa rejection: Full refund except processing fees"
      ],
      responsibilities: [
        "Valid passport with minimum 6 months validity required",
        "Complete visa documentation as per Saudi requirements",
        "Travel insurance strongly recommended for all travelers",
        "Adherence to Saudi Arabia laws, customs, and regulations",
        "Respectful behavior at all holy sites and accommodations",
        "Timely arrival for all group activities and transfers"
      ],
      disclaimers: [
        "Hotel rooms subject to availability at time of booking",
        "Flight schedules may change due to operational requirements",
        "Weather conditions may affect outdoor activities",
        "Company not responsible for personal belongings or losses",
        "Medical facilities available but travelers should carry medications",
        "Company reserves right to modify itinerary if necessary"
      ]
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
    const roomPricing = packageData.pricing[packageType as keyof typeof packageData.pricing][selectedRoomType as keyof typeof packageData.pricing.group];
    const cost = 
      (guestCount.adults * roomPricing.adult) +
      (guestCount.childWithBed * roomPricing.childWithBed) +
      (guestCount.childWithoutBed * roomPricing.childWithoutBed) +
      (guestCount.infants * roomPricing.infant);
    setTotalCost(cost);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [guestCount, selectedRoomType, packageType]);

  const totalGuests = guestCount.adults + guestCount.childWithBed + guestCount.childWithoutBed + guestCount.infants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      
      <LeadCapturePopup isOpen={isPopupOpen} onClose={handlePopupClose} />
      
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
              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-emerald-600 text-white px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  {packageType === 'group' ? 'Group Package' : 'Independent Package'}
                </Badge>
                <Badge className="bg-blue-600 text-white px-4 py-2">
                  <Globe className="w-4 h-4 mr-2" />
                  Premium Experience
                </Badge>
              </div>
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
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Package Type Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-6 h-6 mr-2 text-emerald-600" />
                      Package Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={packageType} onValueChange={setPackageType} className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-emerald-50 transition-colors">
                        <RadioGroupItem value="group" id="group" />
                        <Label htmlFor="group" className="flex-1 cursor-pointer">
                          <div>
                            <h4 className="font-semibold">Group Package</h4>
                            <p className="text-sm text-gray-600">Join with other pilgrims for a shared spiritual journey</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                        <RadioGroupItem value="independent" id="independent" />
                        <Label htmlFor="independent" className="flex-1 cursor-pointer">
                          <div>
                            <h4 className="font-semibold">Independent Package</h4>
                            <p className="text-sm text-gray-600">Private experience with personalized services</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Flight Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plane className="w-6 h-6 mr-2 text-blue-600" />
                      Flight Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-700">Route:</span>
                          <p className="text-gray-600">{packageData.flightDetails.departure} → {packageData.flightDetails.arrival}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Airline:</span>
                          <p className="text-gray-600">{packageData.flightDetails.airline}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-700">Duration:</span>
                          <p className="text-gray-600">{packageData.flightDetails.duration}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Type:</span>
                          <p className="text-gray-600">{packageData.flightDetails.type}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-700">Aircraft:</span>
                          <p className="text-gray-600">{packageData.flightDetails.aircraft}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Baggage:</span>
                          <p className="text-gray-600">{packageData.flightDetails.baggage}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Meal Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Utensils className="w-6 h-6 mr-2 text-orange-600" />
                      Meal Plan - {packageData.mealPlan.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700 font-medium">{packageData.mealPlan.description}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.mealPlan.details.map((detail, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Inclusions & Exclusions */}
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-600">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {packageData.inclusions.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
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
                        What's Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {packageData.exclusions.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <X className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Hotels Tab */}
              <TabsContent value="hotels" className="space-y-8">
                <div className="grid gap-8">
                  {/* Makkah Hotel */}
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="w-6 h-6 mr-2 text-emerald-600" />
                        Makkah Accommodation ({packageData.makkahHotel.nights} nights)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={`https://images.unsplash.com/${packageData.makkahHotel.image}?w=500&h=300&fit=crop`}
                            alt={packageData.makkahHotel.name}
                            className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{packageData.makkahHotel.name}</h3>
                            <div className="flex items-center mt-2">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                              ))}
                              <span className="ml-2 text-sm text-gray-600 font-medium">({packageData.makkahHotel.rating}/5)</span>
                            </div>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-lg">
                            <p className="text-emerald-700 font-semibold flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {packageData.makkahHotel.distance}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Hotel Amenities:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {packageData.makkahHotel.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs justify-start">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Madinah Hotel */}
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="w-6 h-6 mr-2 text-blue-600" />
                        Madinah Accommodation ({packageData.madinahHotel.nights} nights)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={`https://images.unsplash.com/${packageData.madinahHotel.image}?w=500&h=300&fit=crop`}
                            alt={packageData.madinahHotel.name}
                            className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{packageData.madinahHotel.name}</h3>
                            <div className="flex items-center mt-2">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                              ))}
                              <span className="ml-2 text-sm text-gray-600 font-medium">({packageData.madinahHotel.rating}/5)</span>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-blue-700 font-semibold flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {packageData.madinahHotel.distance}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Hotel Amenities:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {packageData.madinahHotel.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs justify-start">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Other tabs with existing content */}
              <TabsContent value="itinerary">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                      Detailed Day-by-Day Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {packageData.itinerary.map((day, index) => (
                        <div key={index} className="relative">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                {day.day}
                              </div>
                            </div>
                            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                              <h4 className="font-bold text-xl text-gray-900 mb-3">{day.location}</h4>
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {day.activities.map((activity, actIndex) => (
                                  <div key={actIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">{activity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {index < packageData.itinerary.length - 1 && (
                            <div className="absolute left-6 top-16 w-px h-12 bg-gradient-to-b from-emerald-300 to-transparent"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-6 h-6 mr-2 text-purple-600" />
                      Spiritual & Cultural Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.activities.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg hover:shadow-md transition-all duration-300 border border-purple-100">
                          <Mountain className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                        Comprehensive Pricing Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {Object.entries(packageData.pricing[packageType as keyof typeof packageData.pricing]).map(([roomType, prices]) => (
                          <div key={roomType} className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border">
                            <h4 className="font-bold text-xl mb-4 capitalize text-gray-900">{roomType} Room Sharing</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                <p className="text-sm font-semibold text-gray-700">Adult</p>
                                <p className="text-xl font-bold text-blue-600">{convertPrice(prices.adult)}</p>
                                <p className="text-xs text-gray-500">per person</p>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <Bed className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                <p className="text-sm font-semibold text-gray-700">Child (with bed)</p>
                                <p className="text-xl font-bold text-green-600">{convertPrice(prices.childWithBed)}</p>
                                <p className="text-xs text-gray-500">per child</p>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <User className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                                <p className="text-sm font-semibold text-gray-700">Child (no bed)</p>
                                <p className="text-xl font-bold text-orange-600">{convertPrice(prices.childWithoutBed)}</p>
                                <p className="text-xs text-gray-500">per child</p>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <Baby className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                <p className="text-sm font-semibold text-gray-700">Infant</p>
                                <p className="text-xl font-bold text-purple-600">{convertPrice(prices.infant)}</p>
                                <p className="text-xs text-gray-500">per infant</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <CreditCard className="w-6 h-6 mr-2" />
                        Payment Terms
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {packageData.terms.payment.map((term, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{term}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <X className="w-6 h-6 mr-2" />
                        Cancellation Policy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {packageData.terms.cancellation.map((policy, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{policy}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Shield className="w-6 h-6 mr-2" />
                        Traveler Responsibilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {packageData.terms.responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Info className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{responsibility}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-yellow-600">
                        <FileText className="w-6 h-6 mr-2" />
                        Important Disclaimers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {packageData.terms.disclaimers.map((disclaimer, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 hover:bg-yellow-50 rounded-lg transition-colors">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{disclaimer}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Guest Selection & Booking */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2 text-emerald-600" />
                  Customize Your Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Type Selection */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Room Sharing Type</Label>
                  <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Room (1 person)</SelectItem>
                      <SelectItem value="double">Double Room (2 people)</SelectItem>
                      <SelectItem value="triple">Triple Room (3 people)</SelectItem>
                      <SelectItem value="quad">Quad Room (4 people)</SelectItem>
                      <SelectItem value="quint">Quint Room (5 people)</SelectItem>
                      <SelectItem value="six">6 in a Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Guest Count Selection */}
                <div>
                  <Label className="text-sm font-semibold mb-4 block">Select Number of Travelers</Label>
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-900">Adults</span>
                          <p className="text-xs text-gray-600">18+ years</p>
                        </div>
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
                        <span className="font-bold text-lg w-8 text-center">{guestCount.adults}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateGuestCount('adults', true)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Child with bed */}
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bed className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-medium text-gray-900">Child (with bed)</span>
                          <p className="text-xs text-gray-600">2-11 years</p>
                        </div>
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
                        <span className="font-bold text-lg w-8 text-center">{guestCount.childWithBed}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateGuestCount('childWithBed', true)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Child without bed */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-orange-600" />
                        <div>
                          <span className="font-medium text-gray-900">Child (no bed)</span>
                          <p className="text-xs text-gray-600">2-11 years</p>
                        </div>
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
                        <span className="font-bold text-lg w-8 text-center">{guestCount.childWithoutBed}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateGuestCount('childWithoutBed', true)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Baby className="w-5 h-5 text-purple-600" />
                        <div>
                          <span className="font-medium text-gray-900">Infants</span>
                          <p className="text-xs text-gray-600">0-2 years</p>
                        </div>
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
                        <span className="font-bold text-lg w-8 text-center">{guestCount.infants}</span>
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
                </div>

                <Separator />

                {/* Booking Summary */}
                <div className="space-y-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Package Type:</span>
                      <span className="font-medium capitalize">{packageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Type:</span>
                      <span className="font-medium capitalize">{selectedRoomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Travelers:</span>
                      <span className="font-medium">{totalGuests}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Total Cost:</span>
                      <span className="text-2xl font-bold text-emerald-600">{convertPrice(totalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-lg py-6 shadow-lg">
                    Book This Package Now
                  </Button>
                  <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Request Custom Quote
                  </Button>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Need Assistance?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium">Call Us</p>
                        <p className="text-sm text-gray-600">+91-78920-09800</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <p className="text-sm text-gray-600">info@marhabahaji.com</p>
                      </div>
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

export default PackageDetails;
