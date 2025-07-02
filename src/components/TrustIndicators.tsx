
import React from 'react';
import { Badge } from '@/components/ui/badge';

const TrustIndicators = () => {
  const trustBadges = [
    {
      icon: '🏆',
      title: 'IATA Certified',
      description: 'International Air Transport Association',
      color: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
    },
    {
      icon: '🕋',
      title: 'Saudi Umrah Visa Licensed',
      description: 'Ministry of Hajj and Umrah',
      color: 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
    },
    {
      icon: '🏛️',
      title: 'Ministry Approved',
      description: 'Indian Ministry of Minority Affairs',
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
    },
    {
      icon: '🌟',
      title: 'Karnataka Tourism Certified',
      description: 'State Government Approved',
      color: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
    }
  ];

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-gray-50 via-white to-emerald-50 overflow-hidden">
      <div className="container mx-auto px-3 md:px-4 max-w-full overflow-hidden">
        <div className="text-center mb-8 md:mb-12">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3 md:mb-4 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium">
            🛡️ Licensed & Certified
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
            Trusted by Pilgrims Worldwide
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            We are officially licensed and certified by leading authorities to provide you with 
            safe, secure, and reliable Umrah services
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto px-2 md:px-0">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className={`${badge.color} rounded-2xl p-4 md:p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 text-center`}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl md:text-3xl">{badge.icon}</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                {badge.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-8 md:mt-12 text-center px-2">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-8 bg-white rounded-2xl px-4 md:px-8 py-4 md:py-6 shadow-lg border border-gray-100 max-w-full">
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl">🔒</span>
              <span className="text-xs md:text-sm font-medium text-gray-700">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl">💳</span>
              <span className="text-xs md:text-sm font-medium text-gray-700">Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl">🌍</span>
              <span className="text-xs md:text-sm font-medium text-gray-700">Global Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl">📞</span>
              <span className="text-xs md:text-sm font-medium text-gray-700">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
