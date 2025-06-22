
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ServicesSection = () => {
  const services = [
    {
      title: "Single Entry Umrah Visa",
      description: "Perfect for first-time pilgrims planning a single visit to perform Umrah",
      price: "From $149",
      duration: "3-5 days",
      validity: "30 days",
      features: [
        "Single entry to Saudi Arabia",
        "30 days validity",
        "Visit Mecca and Medina",
        "24/7 support included",
        "Document verification"
      ],
      popular: false
    },
    {
      title: "Multiple Entry Umrah Visa",
      description: "Ideal for frequent pilgrims or those planning multiple visits within a year",
      price: "From $299",
      duration: "3-5 days",
      validity: "1 year",
      features: [
        "Multiple entries allowed",
        "1 year validity",
        "Extended stay options",
        "Priority processing",
        "Dedicated visa specialist",
        "Free consultation"
      ],
      popular: true
    },
    {
      title: "Express Umrah Visa",
      description: "Fast-track processing for urgent travel plans",
      price: "From $249",
      duration: "24-48 hours",
      validity: "30 days",
      features: [
        "Express 24-48 hour processing",
        "Single entry visa",
        "Emergency support hotline",
        "Instant status updates",
        "Same-day document review"
      ],
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Umrah Visa Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect visa service for your spiritual journey. All packages include 
            expert guidance, document verification, and guaranteed approval.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className={`relative ${service.popular ? 'ring-2 ring-emerald-500 shadow-xl transform scale-105' : 'shadow-lg'}`}>
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </CardTitle>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-emerald-600">{service.price}</div>
                  <div className="flex justify-center space-x-4 text-sm text-gray-500">
                    <span>⏱️ {service.duration}</span>
                    <span>📅 {service.validity}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${service.popular 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  size="lg"
                >
                  Choose This Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              What's Included in Every Service
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Document review and verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Form filling assistance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Photo specification compliance</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Real-time application tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Email and SMS notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Customer support in multiple languages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
