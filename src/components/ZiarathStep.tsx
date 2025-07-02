
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  details?: any;
}

interface ZiarathStepProps {
  onZiarathSelect: (ziarath: Omit<CartItem, 'quantity'>) => void;
}

const ZiarathStep: React.FC<ZiarathStepProps> = ({ onZiarathSelect }) => {
  const sampleZiarath = [
    {
      id: 'ziarath-1',
      name: 'Makkah Historical Sites Tour',
      type: 'Makkah Ziarath',
      price: 5000,
      duration: '4 hours'
    },
    {
      id: 'ziarath-2',
      name: 'Madinah Historical Sites Tour',
      type: 'Madinah Ziarath',
      price: 4500,
      duration: '3 hours'
    }
  ];

  const handleSelectZiarath = (ziarath: any) => {
    onZiarathSelect({
      id: ziarath.id,
      type: 'ziarath',
      name: ziarath.name,
      price: ziarath.price,
      details: ziarath
    });
  };

  return (
    <div className="space-y-4">
      {sampleZiarath.map((ziarath) => (
        <Card key={ziarath.id}>
          <CardHeader>
            <CardTitle>{ziarath.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Type: {ziarath.type}</p>
            <p>Duration: {ziarath.duration}</p>
            <p>Price: ₹{ziarath.price.toLocaleString()}</p>
            <Button onClick={() => handleSelectZiarath(ziarath)} className="mt-2">
              Select Ziarath
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ZiarathStep;
