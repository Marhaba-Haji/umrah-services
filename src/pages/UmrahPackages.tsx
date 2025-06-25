import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Package, Star, CheckCircle } from 'lucide-react';

const UmrahPackages = () => {
  const packageTypes = [
    {
      title: "Group Umrah Packages",
      description: "Join fellow pilgrims in comprehensive group packages with shared experiences and guided tours",
      icon: Users,
      route: "/group-packages",
      gradient: "from-emerald-500 to-teal-600",
      price: "Starting from $1,299",
      duration: "7-15 Days",
      features: [
        "Shared accommodations",
        "Group transportation",
        "Professional guide",
        "Group prayers",
        "Ziarath tours included",
        "24/7 group coordinator"
      ],
      benefits: [
        "Cost-effective pricing",
        "Social spiritual experience",
        "Expert guidance",
        "Safety in numbers"
      ],
      popular: true,
      image: "photo-1466442929976-97f336a657be"
    },
    {
      title: "Custom Umrah Packages",
      description: "Personalized pilgrimage experiences tailored to your specific needs, preferences, and budget",
      icon: Package,
      route: "/custom-packages",
      gradient: "from-blue-500 to-indigo-600",
      price: "Starting from $1,899",
      duration: "5-21 Days",
      features: [
        "Private accommodations",
        "Flexible itinerary",
        "Custom meal plans",
        "Private transportation",
        "Personalized services"
      ],
      benefits: [
        "Complete flexibility",
        "Privacy and comfort",
        "Customized experience",
        "Personal attention"
      ],
      popular: false,
      image: "photo-1523712999610-f77fbcfc3843"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2">
            ✨ Premium Umrah Experience
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your Umrah Package
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Select between our comprehensive group packages or create your own personalized pilgrimage experience
          </p>
        </div>
      </section>

      {/* Package Options */}
      <section className="py-20 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {packageTypes.map((packageType, index) => (
              <Card 
                key={index}
                className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-white"
              >
                {packageType.popular && (
                  <div className="absolute top-6 right-6 z-20">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <div 
                    className="w-full h-full bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/${packageType.image}?w=800&h=600&fit=crop)`
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${packageType.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                </div>

                <CardHeader className="relative z-10 p-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${packageType.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <packageType.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">
                    {packageType.title}
                  </CardTitle>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {packageType.description}
                  </p>

                  <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {packageType.price}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {packageType.duration}
                      </div>
                      <div className="text-sm text-gray-500">flexible</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 p-8 pt-0">
                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg">Package Includes:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {packageType.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg">Key Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {packageType.benefits.map((benefit, benefitIndex) => (
                        <Badge 
                          key={benefitIndex}
                          variant="outline" 
                          className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50"
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Link to={packageType.route}>
                    <Button 
                      className={`w-full bg-gradient-to-r ${packageType.gradient} hover:opacity-90 transform transition-all duration-300 hover:scale-105 shadow-lg text-lg py-6`}
                      size="lg"
                    >
                      Explore {packageType.title.split(' ')[0]} Packages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our Umrah Packages?
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">99% Success Rate</h4>
                  <p className="text-gray-600 text-sm">Guaranteed visa approval and seamless travel experience</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">10,000+ Pilgrims</h4>
                  <p className="text-gray-600 text-sm">Successfully served pilgrims from around the world</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">5-Star Service</h4>
                  <p className="text-gray-600 text-sm">Premium service with 24/7 support throughout your journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UmrahPackages;
