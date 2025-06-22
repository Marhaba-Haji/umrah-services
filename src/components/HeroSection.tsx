
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  const [nationality, setNationality] = useState('');

  const popularCountries = [
    'United States', 'United Kingdom', 'India', 'Pakistan', 'Bangladesh', 
    'Indonesia', 'Malaysia', 'Turkey', 'Nigeria', 'Egypt'
  ];

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-emerald-600 rounded-full transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-amber-600 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-emerald-600 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="flex justify-center mb-6">
            <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium">
              🎯 99% Visa Approval Rate | ⚡ 3-5 Days Processing
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
            Start your sacred journey to Mecca and Medina. Fast, secure, and hassle-free Umrah visa processing 
            with guaranteed approval and 24/7 expert support.
          </p>

          {/* Quick Checker Card */}
          <Card className="max-w-2xl mx-auto mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Check Your Umrah Visa Eligibility
              </h3>
              <p className="text-gray-600 mb-6">Select your nationality to see requirements and processing time</p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Nationality
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

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-medium"
                  size="lg"
                >
                  Check Eligibility & Apply Now
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Secure SSL Encryption
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  No Hidden Fees
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Money Back Guarantee
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
