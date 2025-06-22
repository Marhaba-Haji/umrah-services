
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HeroSection = () => {
  const [nationality, setNationality] = useState('');
  const [currency, setCurrency] = useState('USD');

  const popularCountries = [
    'United States', 'United Kingdom', 'India', 'Pakistan', 'Bangladesh', 
    'Indonesia', 'Malaysia', 'Turkey', 'Nigeria', 'Egypt'
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-20 overflow-hidden">
      {/* Background with Islamic patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-emerald-600 rounded-full transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-amber-600 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-emerald-600 rounded-full"></div>
        {/* Islamic geometric pattern */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border border-emerald-200 transform rotate-45">
            <div className="w-full h-full border border-emerald-200 transform rotate-45 scale-75">
              <div className="w-full h-full border border-emerald-200 transform rotate-45 scale-75"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=1000&fit=crop" 
          alt="Masjid al-Haram Mecca" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="flex justify-center mb-6">
            <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium">
              🕋 99% Visa Approval Rate | ⚡ 3-5 Days Processing
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Apply for Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">
              Umrah Visa
            </span>{' '}
            Online
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            🕋 Start your sacred journey to Mecca and Medina. Fast, secure, and hassle-free Umrah visa processing 
            with guaranteed approval and 24/7 expert support.
          </p>

          {/* Quick Checker Card */}
          <Card className="max-w-2xl mx-auto mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                🎯 Check Your Umrah Visa Eligibility
              </h3>
              <p className="text-gray-600 mb-6">Select your nationality and preferred currency to see requirements and pricing</p>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                      🌍 Your Nationality
                    </label>
                    <select
                      id="nationality"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select your country</option>
                      {popularCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                      💰 Preferred Currency
                    </label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
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

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-medium"
                  size="lg"
                >
                  🚀 Check Eligibility & Apply Now
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  🔒 Secure SSL Encryption
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  💯 No Hidden Fees
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  💰 Money Back Guarantee
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Fast Processing</h4>
              <p className="text-sm text-gray-600">Get your visa in 3-5 business days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">100% Secure</h4>
              <p className="text-sm text-gray-600">Bank-level security for your data</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">24/7 Support</h4>
              <p className="text-sm text-gray-600">Expert help whenever you need it</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
