import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle, Clock, FileText, Globe, Shield, Star, Users, DollarSign, Calendar, Award, MapPin, Phone, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SaudiVisa {
  id: string;
  visa_type: string;
  visa_category: string;
  description: string;
  price: number;
  processing_time: string;
  visa_validity: string;
  stay_validity: string;
  number_of_entries: string;
  requirements: string[];
  required_documents: any;
  application_process: any;
  status: string;
  approval_rate: number;
  created_at: string;
}

const OtherSaudiVisas = () => {
  const [visas, setVisas] = useState<SaudiVisa[]>([]);
  const [filteredVisas, setFilteredVisas] = useState<SaudiVisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    processingTime: ''
  });

  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const { data, error } = await supabase
          .from('saudi_visas')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVisas(data || []);
        setFilteredVisas(data || []);
      } catch (error) {
        console.error('Error fetching visas:', error);
        toast.error('Failed to load visa information');
      } finally {
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);

  const applyFilters = () => {
    let newFilteredVisas = [...visas];

    if (filters.category) {
      newFilteredVisas = newFilteredVisas.filter(visa =>
        visa.visa_category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    setFilteredVisas(newFilteredVisas);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading visa information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Saudi Arabia Visa Services</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Get your Saudi Arabia visa processed quickly and efficiently with our expert assistance
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-white/20 text-white px-4 py-2 text-lg">
              <Shield className="w-5 h-5 mr-2" />
              Trusted Service
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2 text-lg">
              <Clock className="w-5 h-5 mr-2" />
              Quick Processing
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2 text-lg">
              <Award className="w-5 h-5 mr-2" />
              Expert Support
            </Badge>
          </div>
        </div>
      </section>

      {/* Visa Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredVisas.map((visa) => (
            <Card key={visa.id} className="shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CardTitle className="flex items-center justify-between">
                  <span>{visa.visa_type}</span>
                  <Badge className="bg-white/20 text-white">
                    {visa.visa_category}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-emerald-600">
                    ${visa.price}
                  </span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                    {visa.approval_rate}% Success Rate
                  </Badge>
                </div>

                <p className="text-gray-600">{visa.description}</p>

                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="text-center">
                    <Clock className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <div className="text-sm font-medium">Processing Time</div>
                    <div className="text-sm text-gray-600">{visa.processing_time}</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <div className="text-sm font-medium">Validity</div>
                    <div className="text-sm text-gray-600">{visa.visa_validity}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Requirements:</h4>
                  <div className="space-y-1">
                    {visa.requirements?.slice(0, 3).map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{req}</span>
                      </div>
                    )) || (
                      <div className="text-sm text-gray-500">Requirements will be provided during consultation</div>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Need Help with Your Visa Application?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our visa experts are here to assist you with your Saudi Arabia visa application process
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-emerald-600">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">+91-78200-09800</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">info@marhabahajj.com</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OtherSaudiVisas;
