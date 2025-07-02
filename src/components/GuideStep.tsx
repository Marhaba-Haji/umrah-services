
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

interface GuideStepProps {
  onGuideSelect: (guide: Omit<CartItem, 'quantity'>) => void;
}

const GuideStep: React.FC<GuideStepProps> = ({ onGuideSelect }) => {
  const sampleGuides = [
    {
      id: 'guide-1',
      name: 'Islamic Scholar Guide - Full Journey',
      type: 'Scholar Guide',
      price: 25000,
      languages: ['English', 'Urdu', 'Arabic']
    },
    {
      id: 'guide-2',
      name: 'Local Guide - Makkah & Madinah',
      type: 'Local Guide',
      price: 15000,
      languages: ['English', 'Hindi']
    }
  ];

  const handleSelectGuide = (guide: any) => {
    onGuideSelect({
      id: guide.id,
      type: 'guide',
      name: guide.name,
      price: guide.price,
      details: guide
    });
  };

  return (
    <div className="space-y-4">
      {sampleGuides.map((guide) => (
        <Card key={guide.id}>
          <CardHeader>
            <CardTitle>{guide.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Type: {guide.type}</p>
            <p>Languages: {guide.languages.join(', ')}</p>
            <p>Price: ₹{guide.price.toLocaleString()}</p>
            <Button onClick={() => handleSelectGuide(guide)} className="mt-2">
              Select Guide
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GuideStep;
