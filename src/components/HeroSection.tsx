
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import AnimatedCounter from './AnimatedCounter';
import { useCurrency } from './Header';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

const HeroSection = () => {
  const [nationality, setNationality] = useState('');
  const { currency } = useCurrency();
  const [basePriceUSD, setBasePriceUSD] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const popularCountries = ['United States', 'United Kingdom', 'India', 'Pakistan', 'Bangladesh', 'Indonesia', 'Malaysia', 'Turkey', 'Nigeria', 'Egypt'];
  
  // Currency conversion rates (base USD)
  const exchangeRates = {
    USD: 1,
    INR: 83.5,
    SAR: 3.75
  };

  // Currency symbols
  const currencySymbols = {
    USD: '$',
    INR: '₹',
    SAR: 'ر.س'
  };

  useEffect(() => {
    async function fetchVisaPrice() {
      setLoading(true);
      const { data, error } = await supabase
        .from('saudi_visas')
        .select('price')
        .eq('visa_type', 'Umrah Visa')
        .eq('visa_category', 'Standard')
        .eq('status', 'active')
        .limit(1)
        .single();
      if (!error && data && typeof data.price === 'number') {
        setBasePriceUSD(data.price);
      } else {
        setBasePriceUSD(null);
      }
      setLoading(false);
    }
    fetchVisaPrice();
  }, []);

  const currencySymbol = currencySymbols[currency] || '$';
  let convertedPrice: number | null = null;
  if (basePriceUSD !== null) {
    if (currency === 'INR') {
      convertedPrice = basePriceUSD;
    } else {
      const inrToTarget = exchangeRates[currency] ? 1 / exchangeRates['INR'] * exchangeRates[currency] : 1;
      convertedPrice = Math.round(basePriceUSD * inrToTarget);
    }
  }

  const handleWhatsAppClick = () => {
    const prefilledMessage = `السلام عليكم! I'm interested in Marhaba Haji's Umrah services. 

I would like to know more about:
- Umrah visa processing
- Available packages
- Pricing and requirements

Please provide me with detailed information. JazakAllah Khair!`;

    const whatsappUrl = `https://wa.me/919008447887?text=${encodeURIComponent(prefilledMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-6 md:py-20 lg:-mt-16 overflow-hidden min-h-screen flex items-center">
      {/* Background Islamic patterns - hidden on mobile to reduce clutter */}
      <div className="absolute inset-0 opacity-5 hidden md:block">
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

      <div className="container mx-auto px-3 md:px-4 relative z-10 lg:pt-8 w-full max-w-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left Section - Content */}
          <div className="order-2 lg:order-1">
            {/* Trust Badge */}
            <div className="flex justify-center lg:justify-start mb-4 md:mb-6">
              <Badge className="bg-emerald-100 text-emerald-800 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium animate-pulse text-center">
                🕋 99% Visa Approval Rate | ⚡ 2-4 Days Processing
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight text-center lg:text-left">
              Apply for Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">
                Umrah Visa
              </span>{' '}
              Online
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed text-center lg:text-left px-2 md:px-0">
              🕋 Start your sacred journey to Mecca and Medina. Fast, secure, and hassle-free Umrah visa processing 
              with guaranteed approval and expert support.
            </p>

            {/* Animated Trust Statistics */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 px-2 md:px-0">
              <div className="text-center lg:text-left">
                <div className="text-xl md:text-2xl lg:text-3xl mb-1 font-bold text-emerald-600">
                  <AnimatedCounter end={50000} suffix="+" />
                </div>
                <div className="text-xs md:text-sm text-gray-600">Visas Processed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl md:text-2xl lg:text-3xl mb-1 font-bold text-emerald-600">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <div className="text-xs md:text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl md:text-2xl lg:text-3xl mb-1 text-emerald-600 font-bold">7 Days</div>
                <div className="text-xs md:text-sm text-gray-600">Support Available</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl md:text-2xl lg:text-3xl mb-1 font-bold text-emerald-600">
                  <AnimatedCounter end={4} prefix="2-" />
                </div>
                <div className="text-xs md:text-sm text-gray-600">Days Processing</div>
              </div>
            </div>
          </div>

          {/* Right Section - CTA Form */}
          <div className="order-1 lg:order-2 w-full">
            {/* Quick Application Form */}
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm mx-2 md:mx-0">
              <CardContent className="p-4 md:p-6 lg:p-8">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 text-gray-900 text-center">
                  🎯 Apply for Umrah Visa
                </h3>
                <p className="text-gray-600 mb-4 md:mb-6 text-center text-sm">
                  Check eligibility and get instant pricing
                </p>
                
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                      🌍 Your Nationality
                    </label>
                    <select 
                      id="nationality" 
                      value={nationality} 
                      onChange={e => setNationality(e.target.value)} 
                      className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base"
                    >
                      <option value="">Select your country</option>
                      {popularCountries.map(country => 
                        <option key={country} value={country}>
                          {country}
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Dynamic Pricing Display */}
                  <div className="bg-emerald-50 p-3 md:p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-emerald-700 mb-1">Starting from</p>
                      <p className="text-2xl md:text-3xl font-bold text-emerald-800">
                        {loading ? (
                          <span className="animate-pulse text-gray-400">Loading...</span>
                        ) : convertedPrice !== null ? (
                          `${currencySymbol}${convertedPrice.toLocaleString()}`
                        ) : (
                          <span className="text-red-500">N/A</span>
                        )}
                      </p>
                      <p className="text-xs text-emerald-600">Per person • All inclusive</p>
                    </div>
                  </div>

                  <Link to="/apply-umrah-visa-online" className="block">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 md:py-3 text-sm md:text-lg font-medium transform hover:scale-105 transition-all duration-200" size="lg">
                      🚀 Apply Now - {loading ? (
                        <span className="animate-pulse text-gray-200">Loading...</span>
                      ) : convertedPrice !== null ? (
                        `${currencySymbol}${convertedPrice.toLocaleString()}`
                      ) : (
                        <span className="text-red-200">N/A</span>
                      )}
                    </Button>
                  </Link>

                  <Button 
                    variant="outline" 
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-2 md:py-3 text-sm md:text-base" 
                    size="lg"
                    onClick={handleWhatsAppClick}
                  >
                    💬 Chat on WhatsApp
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-6 text-xs text-gray-500">
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
      </div>
    </section>
  );
};

export default HeroSection;
