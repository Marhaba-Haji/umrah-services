import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from './Header';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const OtherSaudiServices = () => {
  const { currency } = useCurrency();
  const [visaServices, setVisaServices] = React.useState<unknown[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Currency conversion rates (base INR)
  const exchangeRates = {
    USD: 1 / 83.5,
    INR: 1,
    SAR: 1 / 22.3
  };
  const currencySymbols = { USD: '$', INR: '₹', SAR: 'ر.س' };
  const currencySymbol = currencySymbols[currency] || '₹';
  const rate = exchangeRates[currency] || 1;

  React.useEffect(() => {
    async function fetchVisas() {
      setLoading(true);
      const { data, error } = await supabase
        .from('saudi_visas')
        .select('id, visa_category, description, visa_validity, stay_validity, processing_time, price, requirements')
        // .in('visa_category', ['Family Visit Visa', 'Tourist Visa', 'Business Visa']) // TEMP: fetch all
        .order('visa_category');
      console.log('Visa fetch:', { data, error });
      if (!error && data) setVisaServices(data);
      setLoading(false);
    }
    fetchVisas();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4 px-4 py-2">
            🇸🇦 Saudi Arabia Services
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Other Saudi Visa Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beyond Umrah, we offer comprehensive visa services for all types of travel to Saudi Arabia. 
            Professional processing with guaranteed approval.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-3 text-center py-8">Loading visa options...</div>
          ) : visaServices.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-red-600 font-semibold">No visa data found. Check your database, filter, or permissions.</div>
          ) : visaServices.filter(service => service.visa_type !== 'Umrah Visa').map((service, index) => {
            const convertedPrice = Math.round((service.price || 0) * rate);
            // Handle requirements as array or string (for features display)
            let requirementsArr: string[] = [];
            if (Array.isArray(service.requirements)) {
              requirementsArr = service.requirements;
            } else if (typeof service.requirements === 'string') {
              try {
                requirementsArr = JSON.parse(service.requirements);
              } catch {
                requirementsArr = service.requirements.split(',').map((f: string) => f.trim());
              }
            }
            return (
              <Card key={service.id || index} className="bg-white shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛂</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {service.visa_category}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">⏰ Validity:</span>
                      <span className="font-medium">{service.visa_validity || service.stay_validity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">🚀 Processing:</span>
                      <span className="font-medium">{service.processing_time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">💰 Price:</span>
                      <span className="font-bold text-blue-600">
                        From {currencySymbol}{convertedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {requirementsArr.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {requirementsArr.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <span className="text-blue-500 text-sm">✓</span>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/other-visas" className="block w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Apply Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a different type of visa or have special requirements?</p>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => {
              const message = `Hello, I need assistance with a Saudi visa. Please connect me with a visa expert.`;
              const whatsappUrl = `https://wa.me/919008447887?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            📞 Contact Our Visa Experts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OtherSaudiServices;
