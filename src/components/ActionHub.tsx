
import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ActionHub = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const prefilledMessage = `السلام عليكم! I'm interested in Marhaba Haji's Umrah services. 

I would like to know more about:
- Umrah visa processing
- Available packages
- Pricing and requirements

Please provide me with detailed information. JazakAllah Khair!`;

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/919008447887?text=${encodeURIComponent(prefilledMessage)}`;
    window.open(whatsappUrl, '_blank');
    setIsExpanded(false);
  };

  const handleBuildUmrahClick = () => {
    navigate('/build-your-own-umrah');
    setIsExpanded(false);
  };

  return (
    <>
      {/* Backdrop for mobile - closes expanded state */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Main Action Hub */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {/* Expanded Actions */}
          {isExpanded && (
            <div className="absolute bottom-16 right-0 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-scale-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Quick Actions</h3>
                    <p className="text-xs opacity-90">How can we help you?</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-emerald-600 p-1 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-4 space-y-3">
                {/* Build Your Own Umrah Action */}
                <div 
                  onClick={handleBuildUmrahClick}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        🎯 Build Your Custom Umrah
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Create your perfect Umrah journey with our interactive package builder
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          ✨ New Feature
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Action */}
                <div 
                  onClick={handleWhatsAppClick}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        💬 WhatsApp Support
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Get instant help from our Umrah experts
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🟢 Online Now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Toggle Button */}
          <div className="relative">
            {/* Pulse animation ring */}
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
            
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full w-14 h-14 p-0 shadow-2xl transition-all duration-300 ${
                isExpanded ? 'rotate-45' : 'rotate-0'
              }`}
            >
              {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionHub;
