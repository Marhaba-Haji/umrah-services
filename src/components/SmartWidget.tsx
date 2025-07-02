
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface WidgetState {
  mode: 'whatsapp' | 'build-umrah' | 'minimized';
  isOpen: boolean;
  hasInteracted: boolean;
  showPromotion: boolean;
}

const SmartWidget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [widget, setWidget] = useState<WidgetState>({
    mode: 'whatsapp',
    isOpen: false,
    hasInteracted: false,
    showPromotion: false
  });

  // Smart context detection
  useEffect(() => {
    const timer = setTimeout(() => {
      // Show Build Umrah promotion on relevant pages after 10 seconds
      const relevantPages = ['/', '/umrah-packages', '/services'];
      const isRelevantPage = relevantPages.some(page => 
        location.pathname === page || location.pathname.startsWith(page)
      );
      
      if (isRelevantPage && !widget.hasInteracted) {
        setWidget(prev => ({ 
          ...prev, 
          mode: 'build-umrah', 
          showPromotion: true 
        }));
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [location.pathname, widget.hasInteracted]);

  // Auto-minimize promotion after 8 seconds
  useEffect(() => {
    if (widget.showPromotion && widget.mode === 'build-umrah') {
      const timer = setTimeout(() => {
        setWidget(prev => ({ 
          ...prev, 
          mode: 'minimized',
          showPromotion: false 
        }));
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [widget.showPromotion, widget.mode]);

  const handleWhatsAppClick = () => {
    const prefilledMessage = `السلام عليكم! I'm interested in Marhaba Haji's Umrah services. 

I would like to know more about:
- Umrah visa processing
- Available packages
- Pricing and requirements

Please provide me with detailed information. JazakAllah Khair!`;

    const whatsappUrl = `https://wa.me/919008447887?text=${encodeURIComponent(prefilledMessage)}`;
    window.open(whatsappUrl, '_blank');
    setWidget(prev => ({ ...prev, hasInteracted: true }));
  };

  const handleBuildUmrahClick = () => {
    navigate('/build-your-own-umrah');
    setWidget(prev => ({ ...prev, hasInteracted: true }));
  };

  const toggleWidget = () => {
    if (widget.mode === 'minimized') {
      setWidget(prev => ({ 
        ...prev, 
        mode: 'whatsapp', 
        isOpen: !prev.isOpen 
      }));
    } else {
      setWidget(prev => ({ ...prev, isOpen: !prev.isOpen }));
    }
  };

  const switchMode = (mode: 'whatsapp' | 'build-umrah') => {
    setWidget(prev => ({ ...prev, mode, showPromotion: false }));
  };

  const renderButton = () => {
    if (widget.mode === 'minimized') {
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <Button
            onClick={toggleWidget}
            className="relative bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 p-0 shadow-2xl"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      );
    }

    if (widget.mode === 'build-umrah') {
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-[#023f3a] rounded-full animate-ping opacity-75"></div>
          <Button
            onClick={toggleWidget}
            className="relative bg-[#023f3a] hover:bg-[#023f3a]/90 text-white rounded-full w-14 h-14 p-0 shadow-2xl"
          >
            <Package className="w-6 h-6" />
          </Button>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        <Button
          onClick={toggleWidget}
          className="relative bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 p-0 shadow-2xl"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  };

  const renderPopup = () => {
    if (widget.mode === 'build-umrah') {
      return (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 animate-fade-in-scale">
          <div className="bg-[#023f3a] text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-[#023f3a]" />
              </div>
              <div>
                <h3 className="font-semibold">Build Your Own Umrah</h3>
                <p className="text-xs opacity-90">Customize your perfect journey</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWidget(prev => ({ ...prev, isOpen: false }))}
              className="text-white hover:bg-[#023f3a]/80 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-[#023f3a]/5 to-[#023f3a]/10 rounded-lg p-3">
              <p className="text-sm text-gray-700 font-medium">
                🎯 Create your perfect Umrah package!
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Choose your own flights, hotels, transport & more. Get exactly what you want at the best price.
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">✨ What you can customize:</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• ✈️ Flights from your city</p>
                <p>• 🏨 Hotels near Haram</p>
                <p>• 🚗 Transport & Airport transfers</p>
                <p>• 📋 Visa processing</p>
                <p>• 👨‍🏫 Personal guides & Ziarath tours</p>
              </div>
            </div>
            
            <Button
              onClick={handleBuildUmrahClick}
              className="w-full bg-[#023f3a] hover:bg-[#023f3a]/90 text-white"
            >
              <Package className="w-4 h-4 mr-2" />
              Start Building Package
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="flex justify-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchMode('whatsapp')}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Need Help? Chat with us
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 animate-fade-in-scale">
        <div className="bg-green-500 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold">Marhaba Haji Support</h3>
              <p className="text-xs opacity-90">Typically replies instantly</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWidget(prev => ({ ...prev, isOpen: false }))}
            className="text-white hover:bg-green-600 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              السلام عليكم! Welcome to Marhaba Haji Umrah Services! 👋
            </p>
            <p className="text-sm text-gray-700 mt-2">
              How can we assist you with your spiritual journey today?
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Quick Services:</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Umrah Visa Processing</p>
              <p>• Hotel & Transport Booking</p>
              <p>• Complete Umrah Packages</p>
              <p>• 24/7 Support & Guidance</p>
            </div>
          </div>
          
          <Button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Conversation
          </Button>
          
          <div className="flex justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => switchMode('build-umrah')}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Build Custom Package
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Click to continue on WhatsApp
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Smart Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {renderButton()}
      </div>

      {/* Smart Popup */}
      {widget.isOpen && renderPopup()}
    </>
  );
};

export default SmartWidget;
