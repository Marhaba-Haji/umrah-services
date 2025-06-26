import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus, Phone, Mail, MessageSquare, Search, Filter } from 'lucide-react';
import HotelEnquiriesManager from '../../pages/cms/HotelEnquiriesManager';
import { supabase } from '@/lib/supabaseClient';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  source: string;
  notes: string;
  date: string;
  followUpDate?: string;
}

const LeadManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [messageLead, setMessageLead] = useState<Lead | null>(null);
  const [messageText, setMessageText] = useState('');

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: 'Umrah Visa',
      status: 'New',
      source: 'Website',
      notes: '',
      followUpDate: ''
    }
  });

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setLeads(
          data.map((lead) => ({
            id: lead.id,
            name: lead.first_name + (lead.last_name ? ' ' + lead.last_name : ''),
            email: lead.email,
            phone: (lead.country_code ? lead.country_code + ' ' : '') + lead.phone,
            service: lead.service_interest,
            status: lead.status || 'New',
            source: lead.lead_source || 'Website',
            notes: lead.notes || '',
            date: lead.created_at ? lead.created_at.split('T')[0] : '',
            followUpDate: lead.follow_up_date ? lead.follow_up_date.split('T')[0] : undefined,
          }))
        );
      }
      if (error) {
        console.error('Error fetching leads:', error.message);
      }
    }
    fetchLeads();

    // Real-time subscription
    const channel = supabase.channel('leads-realtime');
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const onSubmit = (data: any) => {
    const newLead: Lead = {
      id: editingLead ? editingLead.id : Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      status: data.status,
      source: data.source,
      notes: data.notes,
      date: editingLead ? editingLead.date : new Date().toISOString().split('T')[0],
      followUpDate: data.followUpDate || undefined
    };

    if (editingLead) {
      setLeads(leads.map(lead => lead.id === editingLead.id ? newLead : lead));
    } else {
      setLeads([...leads, newLead]);
    }

    setIsDialogOpen(false);
    setEditingLead(null);
    form.reset();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    form.reset({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      followUpDate: lead.followUpDate || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'New': return 'default';
      case 'Contacted': return 'secondary';
      case 'Qualified': return 'outline';
      case 'Converted': return 'default';
      case 'Lost': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingLead(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+966501234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Interest</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Umrah Visa">Umrah Visa</SelectItem>
                            <SelectItem value="Umrah Package">Umrah Package</SelectItem>
                            <SelectItem value="Hotel Booking">Hotel Booking</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Group Flights">Group Flights</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Social Media">Social Media</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="followUpDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow-up Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add notes about the lead..." rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingLead ? 'Update Lead' : 'Create Lead'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search leads by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Service</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Source</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        {lead.followUpDate && (
                          <div className="text-xs text-red-600">Follow up: {lead.followUpDate}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{lead.service}</td>
                    <td className="p-2">
                      <Badge variant={getStatusBadgeVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{lead.source}</Badge>
                    </td>
                    <td className="p-2">{lead.date}</td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => setViewLead(lead)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(lead)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setMessageLead(lead)}>
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(lead.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Lead Dialog */}
      <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {viewLead && (
            <div className="space-y-2">
              <div><b>Name:</b> {viewLead.name}</div>
              <div><b>Email:</b> {viewLead.email}</div>
              <div><b>Phone:</b> {viewLead.phone}</div>
              <div><b>Service:</b> {viewLead.service}</div>
              <div><b>Status:</b> {viewLead.status}</div>
              <div><b>Source:</b> {viewLead.source}</div>
              <div><b>Date:</b> {viewLead.date}</div>
              {viewLead.followUpDate && <div><b>Follow Up:</b> {viewLead.followUpDate}</div>}
              <div><b>Notes:</b> {viewLead.notes}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Lead Dialog */}
      <Dialog open={!!messageLead} onOpenChange={() => setMessageLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Message / Log Note</DialogTitle>
          </DialogHeader>
          {messageLead && (
            <form onSubmit={e => {
              e.preventDefault();
              if (!messageText.trim()) return;
              setLeads(leads => leads.map(lead =>
                lead.id === messageLead.id
                  ? { ...lead, notes: (lead.notes ? lead.notes + '\n' : '') + messageText }
                  : lead
              ));
              setMessageText('');
              setMessageLead(null);
            }} className="space-y-4">
              <div><b>Lead:</b> {messageLead.name}</div>
              <Textarea
                placeholder="Type your message or note here..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <Button type="submit">Send / Log</Button>
                <Button type="button" variant="outline" onClick={() => setMessageLead(null)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Hotel Enquiries</h3>
        <HotelEnquiriesManager />
      </div>
    </div>
  );
};

export default LeadManager;
