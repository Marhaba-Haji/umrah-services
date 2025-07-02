
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

interface HotelStepProps {
  onHotelSelect: (hotel: Omit<CartItem, 'quantity'>) => void;
}

const HotelStep: React.FC<HotelStepProps> = ({ onHotelSelect }) => {
  const sampleHotels = [
    {
      id: 'hotel-1',
      name: 'Grand Mosque Hotel',
      location: 'Makkah',
      price: 15000,
      rating: 5,
      distance: '100m from Haram'
    },
    {
      id: 'hotel-2',
      name: 'Prophet\'s Mosque Hotel',
      location: 'Madinah',
      price: 12000,
      rating: 4,
      distance: '200m from Masjid an-Nabawi'
    }
  ];

  const handleSelectHotel = (hotel: any) => {
    onHotelSelect({
      id: hotel.id,
      type: 'hotel',
      name: hotel.name,
      price: hotel.price,
      details: hotel
    });
  };

  return (
    <div className="space-y-4">
      {sampleHotels.map((hotel) => (
        <Card key={hotel.id}>
          <CardHeader>
            <CardTitle>{hotel.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Location: {hotel.location}</p>
            <p>Distance: {hotel.distance}</p>
            <p>Rating: {hotel.rating} stars</p>
            <p>Price: ₹{hotel.price.toLocaleString()} per night</p>
            <Button onClick={() => handleSelectHotel(hotel)} className="mt-2">
              Select Hotel
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HotelStep;
