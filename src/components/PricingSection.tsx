
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const [currency, setCurrency] = useState('USD');

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' }
  ];

  const getCurrencySymbol = () => {
    return currencies.find(curr => curr.code === currency)?.symbol || '$';
  };

  const convertPrice = (baseUSD: number) => {
    const rates = { USD: 1, INR: 83.5, SAR: 3.75 };
    const rate = rates[currency as keyof typeof rates];
    return Math.round(baseUSD * rate);
  };

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
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-emerald-100 text-emerald-800 mb-4 px-4 py-2">
            💰 Transparent Pricing
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Umrah Visa Package
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Select the perfect package for your sacred journey. All prices include government fees, 
            processing charges, and our service fee.
          </p>
          
          {/* Currency Selector */}
          <div className="flex justify-center mb-8">
            <div className="w-64">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-emerald-500 shadow-xl scale-105' : 'shadow-lg'} hover:shadow-xl transition-all`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-1">
                  🌟 Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-lg text-gray-500 line-through">
                      {getCurrencySymbol()}{convertPrice(plan.originalPrice).toLocaleString()}
                    </span>
                    <Badge className="bg-red-100 text-red-800 text-xs">Save {getCurrencySymbol()}{convertPrice(plan.originalPrice - plan.price).toLocaleString()}</Badge>
                  </div>
                  <div className="text-4xl font-bold text-emerald-600 mb-1">
                    {getCurrencySymbol()}{convertPrice(plan.price).toLocaleString()}
                  </div>
                  <p className="text-gray-600">per person</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
                  ⚡ {plan.processing}
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full py-3 ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}
                  size="lg"
                >
                  Apply Now - {getCurrencySymbol()}{convertPrice(plan.price).toLocaleString()}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom package? Our visa experts are here to help.
          </p>
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            💬 Chat with Expert
          </Button>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">No Hidden Charges</h4>
            <p className="text-sm text-gray-600">All fees included in the price shown. What you see is what you pay.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Money Back Guarantee</h4>
            <p className="text-sm text-gray-600">100% refund if your visa application is rejected due to our error.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📞</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Expert Support</h4>
            <p className="text-sm text-gray-600">Get help from visa experts throughout the application process.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
