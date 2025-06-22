
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Mail
} from 'lucide-react';

const PackageDetails = () => {
  const { id } = useParams();
  
  // Mock data - in real app, fetch based on ID
  const packageData = {
    title: "Premium Group Umrah",
    duration: "10 Days",
    price: "$1,899",
    rating: 4.9,
    reviews: 567,
    groupSize: "12-15 people",
    departure: "Twice weekly",
    image: "photo-1523712999610-f77fbcfc3843",
    description: "Experience the spiritual journey of Umrah with our premium group package. This carefully crafted 10-day itinerary combines comfort, spirituality, and cultural exploration.",
    
    itinerary: [
      { day: 1, location: "Departure", activities: ["Airport pickup", "Flight to Jeddah", "Transfer to Makkah", "Hotel check-in"] },
      { day: 2, location: "Makkah", activities: ["First Umrah", "Tawaf and Sa'i", "Haram prayers", "Rest and reflection"] },
      { day: 3, location: "Makkah", activities: ["Additional Tawaf", "Ziarath tours", "Shopping time", "Group prayers"] },
      { day: 4, location: "Makkah", activities: ["Visit to historical sites", "Cave Hira", "Jabal Noor", "Evening prayers"] },
      { day: 5, location: "Makkah", activities: ["Final Umrah", "Farewell Tawaf", "Shopping", "Departure preparation"] },
      { day: 6, location: "Madinah", activities: ["Travel to Madinah", "Hotel check-in", "Masjid Nabawi visit", "First prayers"] },
      { day: 7, location: "Madinah", activities: ["Rawdah prayers", "Ziarath tours", "Quba Mosque", "Mount Uhud"] },
      { day: 8, location: "Madinah", activities: ["Historical sites", "Baqi cemetery", "Cultural tours", "Rest time"] },
      { day: 9, location: "Madinah", activities: ["Final prayers", "Shopping", "Group activities", "Farewell dinner"] },
      { day: 10, location: "Departure", activities: ["Hotel checkout", "Airport transfer", "Flight home", "Safe arrival"] }
    ],
    
    includes: [
      "Return flights from major cities",
      "4-star hotel accommodation",
      "Daily breakfast and dinner",
      "AC transportation",
      "Expert religious guide",
      "Ziarath tours included",
      "24/7 customer support",
      "Travel insurance"
    ],
    
    hotels: [
      { name: "Makkah Hilton Convention", distance: "200m from Haram", rating: 4.5 },
      { name: "Madinah Movenpick", distance: "150m from Masjid Nabawi", rating: 4.6 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src={`https://images.unsplash.com/${packageData.image}?w=1200&h=600&fit=crop`}
          alt={packageData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{packageData.title}</h1>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {packageData.duration}
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {packageData.groupSize}
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 fill-current text-yellow-400" />
                {packageData.rating} ({packageData.reviews} reviews)
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Package Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {packageData.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    <div className="space-y-2">
                      {packageData.includes.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Accommodation:</h4>
                    <div className="space-y-3">
                      {packageData.hotels.map((hotel, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-gray-900">{hotel.name}</h5>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">{hotel.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">{hotel.distance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Detailed Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packageData.itinerary.map((day, index) => (
                    <div key={index} className="border-l-4 border-emerald-500 pl-6 pb-6">
                      <div className="flex items-center space-x-4 mb-2">
                        <Badge className="bg-emerald-100 text-emerald-800">Day {day.day}</Badge>
                        <h4 className="font-semibold text-gray-900">{day.location}</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {packageData.price}
                </div>
                <p className="text-gray-600">per person</p>
                <Badge className="bg-emerald-100 text-emerald-800 mt-2">
                  Next departure: {packageData.departure}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      <span>+1-234-567-8900</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>info@marhabahaji.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-gray-600">{packageData.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Group Size</p>
                    <p className="text-sm text-gray-600">{packageData.groupSize}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Plane className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Departure</p>
                    <p className="text-sm text-gray-600">{packageData.departure}</p>
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
