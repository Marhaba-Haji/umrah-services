
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const OtherSaudiServices = () => {
  const visaServices = [
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Visit Visa',
      description: 'Visit your family members residing in Saudi Arabia',
      duration: '90 days',
      processing: '5-7 days',
      price: 'From $199',
      features: ['Multiple entry options', 'Extended validity', 'Family invitation required']
    },
    {
      icon: '🏖️',
      title: 'Tourist Visa',
      description: 'Explore Saudi Arabia\'s heritage and modern attractions',
      duration: '1 year',
      processing: '3-5 days',
      price: 'From $149',
      features: ['Multiple entry', 'Online application', 'Tourism activities allowed']
    },
    {
      icon: '💼',
      title: 'Business Visa',
      description: 'Conduct business meetings and commercial activities',
      duration: '90 days',
      processing: '3-5 days',
      price: 'From $299',
      features: ['Business activities', 'Company sponsorship', 'Meeting attendance']
    },
    {
      icon: '🎓',
      title: 'Student Visa',
      description: 'Study at recognized educational institutions',
      duration: '1 year',
      processing: '7-10 days',
      price: 'From $179',
      features: ['University admission required', 'Renewable', 'Part-time work allowed']
    },
    {
      icon: '🤝',
      title: 'Waqala Visa',
      description: 'Legal representation and business delegation',
      duration: '30 days',
      processing: '5-7 days',
      price: 'From $399',
      features: ['Legal representation', 'Business delegation', 'Special authorization']
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4 px-4 py-2">
            🇸🇦 Saudi Arabia Services
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Other Saudi Visa Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beyond Umrah, we offer comprehensive visa services for all types of travel to Saudi Arabia. 
            Professional processing with guaranteed approval.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {visaServices.map((service, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </CardTitle>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">⏰ Duration:</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">🚀 Processing:</span>
                    <span className="font-medium">{service.processing}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">💰 Price:</span>
                    <span className="font-bold text-blue-600">{service.price}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <span className="text-blue-500 text-sm">✓</span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a different type of visa or have special requirements?</p>
          <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            📞 Contact Our Visa Experts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OtherSaudiServices;
