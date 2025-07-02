
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, Plus, Minus, ShoppingCart, Users, Calendar, MapPin, Plane, Building, Car, FileText, UserCheck, Mountain } from 'lucide-react';

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  quantity?: number;
  details?: any;
}

const BuildYourOwnUmrah = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [groupSize, setGroupSize] = useState({ adults: 2, children: 0, infants: 0 });
  const [selectedDates, setSelectedDates] = useState({ departure: '', return: '' });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();

  const steps = [
    { 
      id: 0, 
      title: 'Group Details', 
      subtitle: 'Set your travel details', 
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      id: 1, 
      title: 'Flights', 
      subtitle: 'Choose your flights', 
      icon: Plane,
      color: 'bg-sky-500'
    },
    { 
      id: 2, 
      title: 'Hotels', 
      subtitle: 'Select accommodation', 
      icon: Building,
      color: 'bg-emerald-500'
    },
    { 
      id: 3, 
      title: 'Transport', 
      subtitle: 'Book your rides', 
      icon: Car,
      color: 'bg-orange-500'
    },
    { 
      id: 4, 
      title: 'Visa', 
      subtitle: 'Get your visa', 
      icon: FileText,
      color: 'bg-purple-500'
    },
    { 
      id: 5, 
      title: 'Guide', 
      subtitle: 'Hire local guides', 
      icon: UserCheck,
      color: 'bg-pink-500'
    },
    { 
      id: 6, 
      title: 'Ziarath', 
      subtitle: 'Religious tours', 
      icon: Mountain,
      color: 'bg-teal-500'
    }
  ];

  const totalSteps = steps.length;
  const progress = ((completedSteps.length) / totalSteps) * 100;
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    toast({
      title: "Added to Package",
      description: `${item.name} has been added to your Umrah package.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Removed from Package",
      description: "Item has been removed from your package.",
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <GroupDetailsStep 
          groupSize={groupSize} 
          setGroupSize={setGroupSize}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          onComplete={() => {
            if (!completedSteps.includes(0)) {
              setCompletedSteps(prev => [...prev, 0]);
            }
          }}
        />;
      case 1:
        return <FlightStep onFlightSelect={addToCart} groupSize={groupSize} />;
      case 2:
        return <HotelStep onHotelSelect={addToCart} />;
      case 3:
        return <TransportStep onTransportSelect={addToCart} />;
      case 4:
        return <VisaStep onVisaSelect={addToCart} />;
      case 5:
        return <GuideStep onGuideSelect={addToCart} />;
      case 6:
        return <ZiarathStep onZiarathSelect={addToCart} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Build Your Umrah</h1>
            <Badge variant="secondary" className="text-xs px-2 py-1">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{completedSteps.length} completed</span>
              <span>{Math.round(progress)}% done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation - Mobile Optimized */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex space-x-3 min-w-max">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const StepIcon = step.icon;
            
            return (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`
                  flex-shrink-0 w-20 sm:w-24 text-center transition-all duration-200
                  ${isCurrent ? 'transform scale-105' : ''}
                `}
              >
                <div className={`
                  relative w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center transition-all duration-200
                  ${isCurrent 
                    ? `${step.color} text-white shadow-lg ring-4 ring-opacity-30 ring-offset-2` 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  {isCompleted && !isCurrent ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                  
                  {/* Step connector line */}
                  {index < steps.length - 1 && (
                    <div className={`
                      absolute left-full top-1/2 w-8 h-0.5 -translate-y-1/2 ml-2
                      ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
                
                <div className="text-xs font-medium text-gray-900 leading-tight">
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Current Step Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-8 h-8 rounded-full ${steps[currentStep].color} flex items-center justify-center`}>
                {React.createElement(steps[currentStep].icon, { className: "w-4 h-4 text-white" })}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {steps[currentStep].title}
                </h2>
                <p className="text-sm text-gray-600">{steps[currentStep].subtitle}</p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-6">
            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* Bottom Navigation & Cart Summary - Mobile Optimized */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {cart.length} item{cart.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">
                  ₹{totalPrice.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Package Cost</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="px-4 py-4">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex-1 h-12"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={currentStep === totalSteps - 1}
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          {currentStep === totalSteps - 1 && cart.length > 0 && (
            <Button className="w-full mt-3 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
              Complete Package - ₹{totalPrice.toLocaleString()}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Group Details Step Component
const GroupDetailsStep = ({ groupSize, setGroupSize, selectedDates, setSelectedDates, onComplete }: any) => {
  const updateGroupSize = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setGroupSize((prev: any) => {
      const newValue = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      if (type === 'adults' && newValue === 0) return prev; // At least 1 adult required
      return { ...prev, [type]: newValue };
    });
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Group Size Selection */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Group Size</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'adults', label: 'Adults', subtitle: '12+ years', min: 1 },
            { key: 'children', label: 'Children', subtitle: '2-12 years', min: 0 },
            { key: 'infants', label: 'Infants', subtitle: 'Under 2 years', min: 0 }
          ].map(({ key, label, subtitle, min }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-500">{subtitle}</div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateGroupSize(key as any, false)}
                  disabled={groupSize[key] <= min}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center font-medium">{groupSize[key]}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateGroupSize(key as any, true)}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Travel Dates */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Travel Dates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={selectedDates.departure}
                onChange={(e) => {
                  setSelectedDates((prev: any) => ({ ...prev, departure: e.target.value }));
                  onComplete();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date
              </label>
              <input
                type="date"
                value={selectedDates.return}
                onChange={(e) => {
                  setSelectedDates((prev: any) => ({ ...prev, return: e.target.value }));
                  onComplete();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Placeholder components for other steps
const FlightStep = ({ onFlightSelect, groupSize }: any) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6 text-center">
      <Plane className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Flight Selection</h3>
      <p className="text-gray-600 mb-4">Choose your flights for {groupSize.adults + groupSize.children + groupSize.infants} travelers</p>
      <Button onClick={() => onFlightSelect({
        id: 'flight-1',
        type: 'flight',
        name: 'Sample Flight',
        price: 45000
      })}>
        Add Sample Flight
      </Button>
    </CardContent>
  </Card>
);

const HotelStep = ({ onHotelSelect }: any) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6 text-center">
      <Building className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Hotel Selection</h3>
      <p className="text-gray-600 mb-4">Choose your accommodation</p>
      <Button onClick={() => onHotelSelect({
        id: 'hotel-1',
        type: 'hotel',
        name: 'Sample Hotel',
        price: 8000
      })}>
        Add Sample Hotel
      </Button>
    </CardContent>
  </Card>
);

const TransportStep = ({ onTransportSelect }: any) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6 text-center">
      <Car className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Transport Selection</h3>
      <p className="text-gray-600 mb-4">Book your transportation</p>
      <Button onClick={() => onTransportSelect({
        id: 'transport-1',
        type: 'transport',
        name: 'Sample Transport',
        price: 3000
      })}>
        Add Sample Transport
      </Button>
    </CardContent>
  </Card>
);

const VisaStep = ({ onVisaSelect }: any) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6 text-center">
      <FileText className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Visa Processing</h3>
      <p className="text-gray-600 mb-4">Get your visa processed</p>
      <Button onClick={() => onVisaSelect({
        id: 'visa-1',
        type: 'visa',
        name: 'Sample Visa',
        price: 12000
      })}>
        Add Sample Visa
      </Button>
    </CardContent>
  </Card>
);

const GuideStep = ({ onGuideSelect }: any) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6 text-center">
      <UserCheck className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Guide Services</h3>
      <p className="text-gray-600 mb-4">Hire experienced local guides</p>
      <Button onClick={() => onGuideSelect({
        id: 'guide-1',
        type: 'guide',
        name: 'Sample Guide',
        price: 5000
      })}>
        Add Sample Guide
      </Button>
    </CardContent>
  </Card>
);

const ZiarathStep = ({ onZiarathSelect }: any) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6 text-center">
      <Mountain className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Ziarath Tours</h3>
      <p className="text-gray-600 mb-4">Religious and historical site visits</p>
      <Button onClick={() => onZiarathSelect({
        id: 'ziarath-1',
        type: 'ziarath',
        name: 'Sample Ziarath',
        price: 2500
      })}>
        Add Sample Ziarath
      </Button>
    </CardContent>
  </Card>
);

export default BuildYourOwnUmrah;
