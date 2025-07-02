
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

interface TransportStepProps {
  onTransportSelect: (transport: Omit<CartItem, 'quantity'>) => void;
}

const TransportStep: React.FC<TransportStepProps> = ({ onTransportSelect }) => {
  const sampleTransports = [
    {
      id: 'transport-1',
      name: 'Airport Transfer - Private Car',
      type: 'Private Car',
      price: 3000,
      capacity: '4 passengers'
    },
    {
      id: 'transport-2',
      name: 'Makkah to Madinah - AC Bus',
      type: 'AC Bus',
      price: 1500,
      capacity: '45 passengers'
    }
  ];

  const handleSelectTransport = (transport: any) => {
    onTransportSelect({
      id: transport.id,
      type: 'transport',
      name: transport.name,
      price: transport.price,
      details: transport
    });
  };

  return (
    <div className="space-y-4">
      {sampleTransports.map((transport) => (
        <Card key={transport.id}>
          <CardHeader>
            <CardTitle>{transport.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Type: {transport.type}</p>
            <p>Capacity: {transport.capacity}</p>
            <p>Price: ₹{transport.price.toLocaleString()}</p>
            <Button onClick={() => handleSelectTransport(transport)} className="mt-2">
              Select Transport
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransportStep;
