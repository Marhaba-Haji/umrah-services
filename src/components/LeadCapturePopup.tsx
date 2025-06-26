import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface LeadCapturePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadCapturePopup = ({ isOpen, onClose }: LeadCapturePopupProps) => {
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    mobile: '',
    service: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const countryCodes = [
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' }
  ];

  const filteredCountries = countryCodes.filter(country =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  const services = [
    'Umrah Visa',
    'Umrah Group Package',
    'Umrah Custom Package',
    'Hotel Booking',
    'Transport Booking',
    'Group Flights',
    'Ziarath Booking',
    'Guide Booking',
    'Other Saudi Visas'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // WhatsApp message
    const whatsappMessage = `Hello Marhaba Haji Team,

I would like to request a free Umrah consultation. Here are my details:
Name: ${formData.name}
Mobile: ${formData.countryCode} ${formData.mobile}
Service Interested: ${formData.service}
Time: ${new Date().toLocaleString()}

Please contact me to discuss my requirements. Thank you!`;
    
    const whatsappUrl1 = `https://wa.me/919008447887?text=${encodeURIComponent(whatsappMessage)}`;
    const whatsappUrl2 = `https://wa.me/917892009800?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp links
    window.open(whatsappUrl1, '_blank');
    setTimeout(() => {
      window.open(whatsappUrl2, '_blank');
    }, 1000);
    
    // Insert lead into Supabase leads table
    await supabase.from('leads').insert({
      first_name: formData.name,
      phone: formData.mobile,
      country_code: formData.countryCode,
      service_interest: formData.service,
      lead_source: 'Website',
      created_at: new Date().toISOString(),
    });
    // Here you would typically send email via your backend
    console.log('Lead captured:', formData);
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#023f3a] rounded-full flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#023f3a]">
                Get FREE Consultation
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              ✕
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600">
              Connect with our Umrah experts and get personalized assistance for your spiritual journey!
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <Input
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                <Select value={formData.countryCode} onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    <div className="p-2">
                      <Input
                        placeholder="Search country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {filteredCountries.map((country, index) => (
                      <SelectItem key={`${country.code}-${country.country}-${index}`} value={country.code}>
                        {country.flag} {country.code} {country.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <Input
                  required
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Interested In *</label>
              <Select required value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#023f3a] hover:bg-[#023f3a]/90 text-white"
            >
              Get FREE Consultation
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By submitting, you agree to receive WhatsApp messages from our team.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCapturePopup;
