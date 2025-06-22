
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency } from './Header';

const ServicesSection = () => {
  const { currency } = useCurrency();

  // Currency conversion rates (base INR)
  const exchangeRates = {
    INR: 1,
    USD: 0.012,
    SAR: 0.045
  };

  // Currency symbols
  const currencySymbols = {
    USD: '$',
    INR: '₹',
    SAR: 'ر.س'
  };

  const currencySymbol = currencySymbols[currency] || '₹';
  const rate = exchangeRates[currency] || 1;

  const services = [
    {
      title: "Basic Umrah Visa",
      description: "Standard visa processing for budget-conscious pilgrims",
      basePrice: 13000,
      duration: "7-10 days",
      validity: "30 days",
      approvalRate: "85%",
      features: [
        "Standard processing time",
        "Basic document verification",
        "Email support",
        "Visa application assistance",
        "No hotel/transport booking"
      ],
      popular: false,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Premium Umrah Visa",
      description: "Enhanced service with hotel booking included",
      basePrice: 15000,
      duration: "5-7 days",
      validity: "90 days",
      approvalRate: "95%",
      features: [
        "Priority processing",
        "1 day hotel booking included",
        "24/7 phone support",
        "Document collection service",
        "Travel insurance guidance",
        "Airport transfer assistance"
      ],
      popular: true,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Express Umrah Visa",
      description: "Guaranteed visa approval in less than 24 hours",
      basePrice: 17000,
      duration: "Less than 24 hours",
      validity: "90 days",
      approvalRate: "99%",
      features: [
        "Guaranteed 24-hour processing",
        "VIP processing service",
        "Dedicated visa consultant",
        "Express document verification",
        "Emergency hotline support",
        "Same-day collection"
      ],
      popular: false,
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-emerald-100 text-emerald-800 mb-4 px-4 py-2">
            🕋 Visa Services
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Umrah Visa Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect visa service for your spiritual journey with guaranteed approval rates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const convertedPrice = Math.round(service.basePrice * rate);
            return (
              <Card key={index} className={`relative ${service.popular ? 'ring-2 ring-emerald-500 shadow-xl scale-105' : 'shadow-lg'} overflow-hidden`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-emerald-500 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${service.gradient} p-4 text-white text-center`}>
                  <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                  <div className="text-2xl font-bold">
                    {currencySymbol}{convertedPrice.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    {service.approvalRate} Success Rate
                  </div>
                </div>

                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>⏱️ {service.duration}</span>
                    <span>📅 {service.validity}</span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <span className="text-emerald-500 mt-0.5 text-xs">✓</span>
                        <span className="text-gray-700 text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90`}
                    size="sm"
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              What's Included in Every Service
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
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
              <div className="space-y-2">
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
                  <span>Multilingual customer support</span>
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
