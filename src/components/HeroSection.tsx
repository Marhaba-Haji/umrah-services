import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnimatedCounter from './AnimatedCounter';
const HeroSection = () => {
  const [nationality, setNationality] = useState('');
  const [currency, setCurrency] = useState('USD');
  const popularCountries = ['United States', 'United Kingdom', 'India', 'Pakistan', 'Bangladesh', 'Indonesia', 'Malaysia', 'Turkey', 'Nigeria', 'Egypt'];
  const currencies = [{
    code: 'USD',
    symbol: '$',
    name: 'US Dollar'
  }, {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee'
  }, {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal'
  }];
  const getCurrencySymbol = () => {
    return currencies.find(curr => curr.code === currency)?.symbol || '$';
  };
  const getPricing = () => {
    const basePriceUSD = 299;
    const rates = {
      USD: 1,
      INR: 83.5,
      SAR: 3.75
    };
    const rate = rates[currency as keyof typeof rates];
    return Math.round(basePriceUSD * rate);
  };
  return <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-8 md:py-20 overflow-hidden min-h-screen flex items-center">
      {/* Background Islamic patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-emerald-600 rounded-full transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-amber-600 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-emerald-600 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border border-emerald-200 transform rotate-45">
            <div className="w-full h-full border border-emerald-200 transform rotate-45 scale-75">
              <div className="w-full h-full border border-emerald-200 transform rotate-45 scale-75"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Section - Content */}
          <div className="order-2 lg:order-1">
            {/* Trust Badge */}
            <div className="flex justify-center lg:justify-start mb-6">
              <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium animate-pulse">
                🕋 99% Visa Approval Rate | ⚡ 3-5 Days Processing
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-center lg:text-left">
              Apply for Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">
                Umrah Visa
              </span>{' '}
              Online
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed text-center lg:text-left">
              🕋 Start your sacred journey to Mecca and Medina. Fast, secure, and hassle-free Umrah visa processing 
              with guaranteed approval and 24/7 expert support.
            </p>

            {/* Animated Trust Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl mb-1">
                  <AnimatedCounter end={50000} suffix="+" />
                </div>
                <div className="text-sm text-gray-600">Visas Processed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl mb-1">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl mb-1 text-emerald-600 font-bold">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl mb-1">
                  <AnimatedCounter end={5} prefix="3-" />
                </div>
                <div className="text-sm text-gray-600">Days Processing</div>
              </div>
            </div>

            {/* Key Benefits - Mobile Only */}
            
          </div>

          {/* Right Section - CTA Form */}
          <div className="order-1 lg:order-2">
            {/* Hero Image */}
            

            {/* Quick Application Form */}
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 text-center">
                  🎯 Apply for Umrah Visa
                </h3>
                <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
                  Check eligibility and get instant pricing in your preferred currency
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                      🌍 Your Nationality
                    </label>
                    <select id="nationality" value={nationality} onChange={e => setNationality(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="">Select your country</option>
                      {popularCountries.map(country => <option key={country} value={country}>
                          {country}
                        </option>)}
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
                        {currencies.map(curr => <SelectItem key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name} ({curr.code})
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dynamic Pricing Display */}
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-emerald-700 mb-1">Starting from</p>
                      <p className="text-3xl font-bold text-emerald-800">
                        {getCurrencySymbol()}{getPricing().toLocaleString()}
                      </p>
                      <p className="text-xs text-emerald-600">Per person • All inclusive</p>
                    </div>
                  </div>

                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-medium transform hover:scale-105 transition-all duration-200" size="lg">
                    🚀 Apply Now - {getCurrencySymbol()}{getPricing().toLocaleString()}
                  </Button>

                  <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3" size="lg">
                    💬 Chat on WhatsApp
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-4 mt-6 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    🔒 Secure SSL
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    💯 No Hidden Fees
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    💰 Money Back
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Benefits - Desktop Only */}
        
      </div>
    </section>;
};
export default HeroSection;