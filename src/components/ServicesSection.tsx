
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency } from './Header';

const ServicesSection = () => {
  const { currency } = useCurrency();

  // Currency conversion rates (base INR)
  const exchangeRates = {
    USD: 0.012,
    INR: 1,
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
      description: "Essential visa processing with standard approval timeline",
      basePrice: 13000,
      duration: "5-7 days",
      validity: "30 days",
      approvalRate: "85%",
      features: [
        "Single entry to Saudi Arabia",
        "30 days validity",
        "Standard processing",
        "Document verification",
        "Email support"
      ],
      limitations: [
        "No hotel booking assistance",
        "No transport arrangement",
        "Standard approval rate"
      ],
      popular: false
    },
    {
      title: "Premium Umrah Visa",
      description: "Enhanced service with hotel booking and higher approval rate",
      basePrice: 15000,
      duration: "3-5 days",
      validity: "30 days",
      approvalRate: "95%",
      features: [
        "Single entry visa",
        "1 day hotel booking included",
        "Priority processing",
        "Higher approval rate",
        "Dedicated support",
        "Document review assistance"
      ],
      limitations: [],
      popular: true
    },
    {
      title: "Express Umrah Visa",
      description: "Guaranteed fast-track processing in less than 24 hours",
      basePrice: 17000,
      duration: "Under 24 hours",
      validity: "30 days",
      approvalRate: "98%",
      features: [
        "Guaranteed 24-hour processing",
        "Express approval",
        "Emergency support hotline",
        "Instant status updates",
        "Same-day document review",
        "Priority consultation"
      ],
      limitations: [],
      popular: false
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Our Umrah Visa Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect visa service for your spiritual journey. All packages include 
            expert guidance and guaranteed processing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const convertedPrice = Math.round(service.basePrice * rate);
            return (
              <Card key={index} className={`relative h-full flex flex-col ${service.popular ? 'ring-2 ring-emerald-500 shadow-xl transform scale-105' : 'shadow-lg'}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-3 flex-shrink-0">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-emerald-600">
                      {currencySymbol}{convertedPrice.toLocaleString()}
                    </div>
                    <div className="flex justify-center space-x-3 text-xs text-gray-500">
                      <span>⏱️ {service.duration}</span>
                      <span>📅 {service.validity}</span>
                      <span>✅ {service.approvalRate}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-700 mb-2 text-sm">✓ What's Included:</h4>
                    <ul className="space-y-1 mb-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <span className="text-emerald-500 mt-0.5 text-xs">✓</span>
                          <span className="text-gray-700 text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {service.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2 text-sm">⚠️ Limitations:</h4>
                        <ul className="space-y-1">
                          {service.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-start space-x-2">
                              <span className="text-orange-500 mt-0.5 text-xs">•</span>
                              <span className="text-gray-600 text-xs">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Button 
                    className={`w-full mt-auto ${service.popular 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    Choose This Service
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              What's Included in Every Service
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-emerald-500">✓</span>
                  <span>Document review and verification</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-emerald-500">✓</span>
                  <span>Form filling assistance</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-emerald-500">✓</span>
                  <span>Photo specification compliance</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-emerald-500">✓</span>
                  <span>Real-time application tracking</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-emerald-500">✓</span>
                  <span>Email and SMS notifications</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
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
