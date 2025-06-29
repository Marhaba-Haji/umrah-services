
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Edit, Phone, Mail } from 'lucide-react';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service_interest: string;
  status: string;
  lead_source: string;
  notes: string;
  created_at: string;
  follow_up_date: string;
}

const LeadManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(lead => ({
        id: lead.id,
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        service_interest: lead.service_interest || '',
        status: lead.status || '',
        lead_source: lead.lead_source || '',
        notes: lead.notes || '',
        created_at: lead.created_at || '',
        follow_up_date: lead.follow_up_date || ''
      })) || [];
      
      setLeads(formattedData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchLeads();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Management</h2>
      </div>

      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{lead.first_name} {lead.last_name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge>{lead.status}</Badge>
                  <Badge variant="outline">{lead.service_interest}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadManager;
