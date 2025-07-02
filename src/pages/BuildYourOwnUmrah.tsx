import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import FlightStep from '@/components/FlightStep';
import HotelStep from '@/components/HotelStep';
import TransportStep from '@/components/TransportStep';
import VisaStep from '@/components/VisaStep';
import GuideStep from '@/components/GuideStep';
import ZiarathStep from '@/components/ZiarathStep';
import { Separator } from "@/components/ui/separator"
import CartValueWidget from '@/components/CartValueWidget';

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  quantity: number;
  details?: any;
}

interface GroupSize {
  adults: number;
  children: number;
  infants: number;
}

type Step = 'groupSize' | 'flights' | 'hotels' | 'transport' | 'visa' | 'guide' | 'ziarath' | 'summary';

const BuildYourOwnUmrah = () => {
  const [step, setStep] = useState<Step>('groupSize');
  const [groupSize, setGroupSize] = useState<GroupSize>({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [budget, setBudget] = useState<number>(50000);
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(cartItem => cartItem.id === item.id && cartItem.type === item.type);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...item, quantity: updated[existingIndex].quantity + 1 };
        return updated;
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to Package",
      description: `${item.name} has been added to your package.`,
    });
  };

  const handleRemoveFromCart = (id: string, type: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
    
    toast({
      title: "Removed from Package",
      description: "Item has been removed from your package.",
    });
  };

  const handleNextStep = () => {
    switch (step) {
      case 'groupSize':
        setStep('flights');
        break;
      case 'flights':
        setStep('hotels');
        break;
      case 'hotels':
        setStep('transport');
        break;
      case 'transport':
        setStep('visa');
        break;
      case 'visa':
        setStep('guide');
        break;
      case 'guide':
        setStep('ziarath');
        break;
      case 'ziarath':
        setStep('summary');
        break;
      case 'summary':
        // Handle submission or final step logic
        break;
      default:
        break;
    }
  };

  const handlePrevStep = () => {
    switch (step) {
      case 'flights':
        setStep('groupSize');
        break;
      case 'hotels':
        setStep('flights');
        break;
      case 'transport':
        setStep('hotels');
        break;
      case 'visa':
        setStep('transport');
        break;
       case 'guide':
        setStep('visa');
        break;
      case 'ziarath':
        setStep('guide');
        break;
      case 'summary':
        setStep('ziarath');
        break;
      default:
        break;
    }
  };

  const handleSkip = () => {
    switch (step) {
      case 'flights':
        setStep('hotels');
        break;
      case 'hotels':
        setStep('transport');
        break;
      case 'transport':
        setStep('visa');
        break;
      case 'visa':
        setStep('guide');
        break;
      case 'guide':
        setStep('ziarath');
        break;
      default:
        break;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'groupSize':
        return renderGroupSizeStep();
      case 'flights':
        return renderFlightStep();
      case 'hotels':
        return renderHotelStep();
      case 'transport':
        return renderTransportStep();
      case 'visa':
        return renderVisaStep();
      case 'guide':
        return renderGuideStep();
      case 'ziarath':
        return renderZiarathStep();
      case 'summary':
        return renderSummaryStep();
      default:
        return <div>Invalid step</div>;
    }
  };

  const renderGroupSizeStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Configure Group Size and Budget</h2>
      <Card>
        <CardHeader>
          <CardTitle>Group Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults">Adults (12+)</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="10"
                defaultValue={String(groupSize.adults)}
                onChange={(e) => setGroupSize({ ...groupSize, adults: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children">Children (2-11)</Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="10"
                defaultValue={String(groupSize.children)}
                onChange={(e) => setGroupSize({ ...groupSize, children: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="infants">Infants (Under 2)</Label>
              <Input
                id="infants"
                type="number"
                min="0"
                max="10"
                defaultValue={String(groupSize.infants)}
                onChange={(e) => setGroupSize({ ...groupSize, infants: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Set Your Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="budget">Target Budget: ₹{budget.toLocaleString()}</Label>
            </div>
            <Slider
              id="budget"
              defaultValue={[budget]}
              max={100000}
              step={1000}
              onValueChange={(value) => setBudget(value[0])}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleNextStep} className="mt-8">
        Next: Select Flights
      </Button>
    </div>
  );

  const renderFlightStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Flights</h2>
      <FlightStep 
        onFlightSelect={handleAddToCart}
        groupSize={{
          adults: groupSize.adults,
          children: groupSize.children,
          infants: groupSize.infants
        }}
      />
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevStep} variant="outline">
          Previous
        </Button>
        <Button onClick={handleSkip} variant="ghost" className="text-gray-500">
          Skip Flights
        </Button>
        <Button onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );

  const renderHotelStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Hotels</h2>
      <HotelStep onHotelSelect={handleAddToCart} />
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevStep} variant="outline">
          Previous
        </Button>
        <Button onClick={handleSkip} variant="ghost" className="text-gray-500">
          Skip Hotels
        </Button>
        <Button onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );

  const renderTransportStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Transport</h2>
      <TransportStep onTransportSelect={handleAddToCart} />
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevStep} variant="outline">
          Previous
        </Button>
         <Button onClick={handleSkip} variant="ghost" className="text-gray-500">
          Skip Transport
        </Button>
        <Button onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );

  const renderVisaStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Visa Options</h2>
      <VisaStep onVisaSelect={handleAddToCart} />
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevStep} variant="outline">
          Previous
        </Button>
        <Button onClick={handleSkip} variant="ghost" className="text-gray-500">
          Skip Visa
        </Button>
        <Button onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );

   const renderGuideStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Guide Options</h2>
      <GuideStep onGuideSelect={handleAddToCart} />
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevStep} variant="outline">
          Previous
        </Button>
        <Button onClick={handleSkip} variant="ghost" className="text-gray-500">
          Skip Guide
        </Button>
        <Button onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );

  const renderZiarathStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Ziarath Options</h2>
      <ZiarathStep onZiarathSelect={handleAddToCart} />
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevStep} variant="outline">
          Previous
        </Button>
        <Button onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Package Summary</h2>
      {cartItems.length === 0 ? (
        <p>No items added to the package yet.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={`${item.id}-${item.type}`}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Type: {item.type}</p>
                <p>Price: ₹{item.price.toLocaleString()}</p>
                {item.details && (
                  <details>
                    <summary>Details</summary>
                    <pre>{JSON.stringify(item.details, null, 2)}</pre>
                  </details>
                )}
                <Button onClick={() => handleRemoveFromCart(item.id, item.type)} variant="destructive" size="sm">
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
          <Separator className="my-4" />
          <div className="text-xl font-semibold">
            Total: ₹{cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
          </div>
        </div>
      )}
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevStep} variant="outline">
          Previous
        </Button>
        <Button>Book Now</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">Build Your Own Umrah Package</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>
      </main>

      {/* Cart Value Widget */}
      <CartValueWidget 
        cartItems={cartItems}
        onToggleCart={() => {
          // Optional: implement cart modal/drawer
          console.log('Cart items:', cartItems);
        }}
      />
    </div>
  );
};

export default BuildYourOwnUmrah;
