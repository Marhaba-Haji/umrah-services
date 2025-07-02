
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

interface VisaStepProps {
  onVisaSelect: (visa: Omit<CartItem, 'quantity'>) => void;
}

const VisaStep: React.FC<VisaStepProps> = ({ onVisaSelect }) => {
  const sampleVisas = [
    {
      id: 'visa-1',
      name: 'Umrah Visa - Standard Processing',
      type: 'Umrah Visa',
      price: 8000,
      processingTime: '7-10 days'
    },
    {
      id: 'visa-2',
      name: 'Umrah Visa - Express Processing',
      type: 'Umrah Visa',
      price: 12000,
      processingTime: '3-5 days'
    }
  ];

  const handleSelectVisa = (visa: any) => {
    onVisaSelect({
      id: visa.id,
      type: 'visa',
      name: visa.name,
      price: visa.price,
      details: visa
    });
  };

  return (
    <div className="space-y-4">
      {sampleVisas.map((visa) => (
        <Card key={visa.id}>
          <CardHeader>
            <CardTitle>{visa.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Type: {visa.type}</p>
            <p>Processing Time: {visa.processingTime}</p>
            <p>Price: ₹{visa.price.toLocaleString()}</p>
            <Button onClick={() => handleSelectVisa(visa)} className="mt-2">
              Select Visa
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VisaStep;
