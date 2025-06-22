import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
const PricingSection = () => {
  const plans = [{
    name: 'Standard Umrah Visa',
    originalPrice: 399,
    price: 299,
    processing: '5-7 Days',
    features: ['Single Entry Visa', 'Valid for 30 days', 'Document verification', 'Email support', 'Hotel booking assistance', 'Flight booking guidance'],
    popular: false
  }, {
    name: 'Express Umrah Visa',
    originalPrice: 599,
    price: 449,
    processing: '3-5 Days',
    features: ['Single Entry Visa', 'Valid for 90 days', 'Priority processing', '24/7 phone support', 'Hotel booking included', 'Airport transfer assistance', 'Travel insurance', 'Document collection service'],
    popular: true
  }, {
    name: 'Premium Umrah Package',
    originalPrice: 899,
    price: 699,
    processing: '1-3 Days',
    features: ['Multiple Entry Visa', 'Valid for 180 days', 'VIP processing', 'Dedicated visa consultant', 'Premium hotel booking', 'Airport transfer included', 'Comprehensive travel insurance', 'Ziyarath tour booking', 'Local SIM card', 'Concierge service'],
    popular: false
  }];
  return;
};
export default PricingSection;