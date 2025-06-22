
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  CheckCircle,
  Clock,
  Plane
} from 'lucide-react';

const GroupPackages = () => {
  const groupPackages = [
    {
      id: 1,
      title: "Essential Group Umrah",
      duration: "7 Days",
      price: "$1,299",
      rating: 4.8,
      reviews: 324,
      groupSize: "15-20 people",
      departure: "Every Friday",
      includes: ["3-star hotel", "Shared transport", "Group guide", "Breakfast included"],
      highlights: ["Makkah 4 nights", "Madinah 3 nights", "Ziarath tours", "Group prayers"],
      popular: false,
      image: "photo-1466442929976-97f336a657be"
    },
    {
      id: 2,
      title: "Premium Group Umrah",
      duration: "10 Days",
      price: "$1,899",
      rating: 4.9,
      reviews: 567,
      groupSize: "12-15 people",
      departure: "Twice weekly",
      includes: ["4-star hotel", "AC transport", "Expert guide", "All meals"],
      highlights: ["Makkah 6 nights", "Madinah 4 nights", "Historical tours", "Shopping tours"],
      popular: true,
      image: "photo-1523712999610-f77fbcfc3843"
    },
    {
      id: 3,
      title: "Luxury Group Umrah",
      duration: "14 Days",
      price: "$2,799",
      rating: 5.0,
      reviews: 189,
      groupSize: "8-12 people",
      departure: "Weekly",
      includes: ["5-star hotel", "Private transport", "Personal guide", "Premium dining"],
      highlights: ["Makkah 8 nights", "Madinah 6 nights", "VIP services", "Cultural experiences"],
      popular: false,
      image: "photo-1500673922987-e212871fec22"
    },
    {
      id: 4,
      title: "Extended Group Umrah",
      duration: "15 Days",
      price: "$2,199",
      rating: 4.7,
      reviews: 243,
      groupSize: "10-15 people",
      departure: "Monthly",
      includes: ["4-star hotel", "Comfortable transport", "Experienced guide", "Most meals"],
      highlights: ["Makkah 9 nights", "Madinah 6 nights", "Extended stay", "Spiritual sessions"],
      popular: false,
      image: "photo-1482938289607-e9573fc25ebb"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Users className="w-4 h-4 mr-1" />
              Group Packages
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Group Umrah Packages
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Join fellow pilgrims in our carefully crafted group packages
            </p>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {groupPackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white"
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}

                {/* Package Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/${pkg.image}?w=800&h=400&fit=crop`}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[1,2,3,4,5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= pkg.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm">({pkg.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {pkg.title}
                    </CardTitle>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">{pkg.price}</div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {pkg.groupSize}
                    </div>
                    <div className="flex items-center">
                      <Plane className="w-4 h-4 mr-1" />
                      {pkg.departure}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Highlights */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Package Highlights:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {pkg.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Includes */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Includes:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {pkg.includes.map((include, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-gray-700">{include}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link to={`/package-details/${pkg.id}`} className="flex-1">
                      <Button 
                        variant="outline"
                        className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/package-details/${pkg.id}`} className="flex-1">
                      <Button 
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90"
                      >
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GroupPackages;
