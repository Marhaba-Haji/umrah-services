import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CreditCard, Check, Briefcase, Building2, Bus, BadgeCheck, LucideIcon } from 'lucide-react';

interface SaudiVisa {
  id: string;
  visa_type: string;
  visa_category: string;
  price: number;
  requirements: string[];
  featured_image?: string;
  visa_format?: string;
  approval_rate?: number;
  agency_fees?: number;
  embassy_fees?: number;
  visa_validity: string;
  stay_validity: string;
  number_of_entries: string;
}

const OtherSaudiServices = () => {
  const [visas, setVisas] = useState<SaudiVisa[]>([]);
  const [loading, setLoading] = useState(true);

  const getVisaIcon = (visaType: string): LucideIcon => {
    switch (visaType.toLowerCase()) {
      case 'business visa':
        return Briefcase;
      case 'work visa':
        return Building2;
      case 'transit visa':
        return Bus;
      default:
        return BadgeCheck;
    }
  };

  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const { data, error } = await supabase
          .from('saudi_visas')
          .select(`
            id,
            visa_type,
            visa_category,
            description,
            visa_validity,
            stay_validity,
            processing_time,
            price,
            requirements,
            featured_image,
            approval_rate,
            visa_format,
            agency_fees,
            embassy_fees,
            number_of_entries
          `)
          .order('visa_category.asc');

        if (error) throw error;
        setVisas(data as SaudiVisa[]);
      } catch (error) {
        console.error('Error fetching visas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);

  const renderVisaCard = (visa: SaudiVisa) => {
    const passportRequired = visa.requirements?.includes('Passport') || visa.requirements?.includes('Original Passport');
    const photoRequired = visa.requirements?.includes('Photo') || visa.requirements?.includes('2 photos');
    const ticketsRequired = visa.requirements?.includes('Return Air Tickets') || visa.requirements?.includes('Flight tickets');
    const hotelRequired = visa.requirements?.includes('Hotel Booking') || visa.requirements?.includes('Hotel voucher');
    const aadhaarRequired = visa.requirements?.includes('Aadhaar') || visa.requirements?.includes('Aadhaar card');

    return (
      <div key={visa.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {visa.featured_image && (
          <div className="h-48 bg-gradient-to-r from-emerald-400 to-emerald-600">
            <img src={visa.featured_image} alt={`${visa.visa_type} - ${visa.visa_category}`} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="p-6">
          {visa.visa_format && (
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-3">
              {visa.visa_format}
            </div>
          )}
          
          {visa.approval_rate && (
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mb-3 ml-2">
              {visa.approval_rate}% Success Rate
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {getVisaIcon(visa.visa_type)}
            <h3 className="text-xl font-bold text-gray-900">{visa.visa_type}</h3>
          </div>

          {/* Fee Structure */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Fee Structure</h4>
            <div className="space-y-2 text-sm">
              {visa.agency_fees && (
                <div className="flex justify-between">
                  <span>Agency Fees:</span>
                  <span className="font-medium">₹{visa.agency_fees.toLocaleString('en-IN')}</span>
                </div>
              )}
              {visa.embassy_fees && (
                <div className="flex justify-between">
                  <span>Embassy Fees:</span>
                  <span className="font-medium">₹{visa.embassy_fees.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>Total:</span>
                <span className="text-emerald-600">₹{visa.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Visa Details */}
          <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Visa Validity:</span>
              <span className="font-medium">{visa.visa_validity}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Stay Validity:</span>
              <span className="font-medium">{visa.stay_validity}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Entries:</span>
              <span className="font-medium">{visa.number_of_entries}</span>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
            <div className="grid grid-cols-2 gap-2">
              {passportRequired && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Passport</span>
                </div>
              )}
              {photoRequired && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Photos</span>
                </div>
              )}
              {ticketsRequired && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Flight Tickets</span>
                </div>
              )}
              {hotelRequired && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Hotel Booking</span>
                </div>
              )}
              {aadhaarRequired && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Aadhaar Card</span>
                </div>
              )}
              {visa.requirements && visa.requirements.length > 5 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>+{visa.requirements.length - 5} more</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Apply for ₹{visa.price.toLocaleString('en-IN')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Other Saudi Visas
      </h2>

      {loading ? (
        <div className="text-center">Loading visas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visas.map(visa => renderVisaCard(visa))}
        </div>
      )}
    </div>
  );
};

export default OtherSaudiServices;
