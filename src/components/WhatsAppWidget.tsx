
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const prefilledMessage = `السلام عليكم! I'm interested in Marhaba Haji's Umrah services. 

I would like to know more about:
- Umrah visa processing
- Available packages
- Pricing and requirements

Please provide me with detailed information. JazakAllah Khair!`;

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/919008447887?text=${encodeURIComponent(prefilledMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="relative bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 p-0 shadow-2xl"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* WhatsApp Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200">
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
              onClick={() => setIsOpen(false)}
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
            
            <p className="text-xs text-gray-500 text-center">
              Click to continue on WhatsApp
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
