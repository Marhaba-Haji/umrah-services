
import React from 'react';

const TrustIndicators = () => {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-600 font-medium">Trusted by 50,000+ pilgrims worldwide</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
          {/* Trust badges and certifications */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <span className="text-sm text-gray-600 text-center">ISO Certified</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <span className="text-sm text-gray-600 text-center">SSL Secured</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <span className="text-sm text-gray-600 text-center">IATA Approved</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
            <span className="text-sm text-gray-600 text-center">Govt. Authorized</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">50,000+</div>
            <div className="text-sm text-gray-600">Visas Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">99%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">3-5</div>
            <div className="text-sm text-gray-600">Days Processing</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
