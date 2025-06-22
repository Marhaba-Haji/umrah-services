
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Standard Umrah Visa',
      originalPrice: 399,
      price: 299,
      processing: '5-7 Days',
      features: [
        'Single Entry Visa',
        'Valid for 30 days',
        'Document verification',
        'Email support',
        'Hotel booking assistance',
        'Flight booking guidance'
      ],
      popular: false
    },
    {
      name: 'Express Umrah Visa',
      originalPrice: 599,
      price: 449,
      processing: '3-5 Days',
      features: [
        'Single Entry Visa',
        'Valid for 90 days',
        'Priority processing',
        '24/7 phone support',
        'Hotel booking included',
        'Airport transfer assistance',
        'Travel insurance',
        'Document collection service'
      ],
      popular: true
    },
    {
      name: 'Premium Umrah Package',
      originalPrice: 899,
      price: 699,
      processing: '1-3 Days',
      features: [
        'Multiple Entry Visa',
        'Valid for 180 days',
        'VIP processing',
        'Dedicated visa consultant',
        'Premium hotel booking',
        'Airport transfer included',
        'Comprehensive travel insurance',
        'Ziyarath tour booking',
        'Local SIM card',
        'Concierge service'
      ],
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Umrah Visa Package
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, reliable, and affordable Umrah visa processing with guaranteed approval
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-2 border-emerald-500 shadow-xl scale-105' : 'border shadow-lg'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-emerald-600">₹{plan.price.toLocaleString()}</span>
                  <span className="text-lg text-gray-500 line-through ml-2">₹{plan.originalPrice.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
                  Processing: {plan.processing}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.popular 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                  }`}
                  size="lg"
                >
                  Apply Now - ₹{plan.price.toLocaleString()}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a custom package or have questions?</p>
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            Contact Our Visa Experts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
