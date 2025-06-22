
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  Hotel, 
  Car, 
  Plane, 
  User, 
  FileText, 
  Map,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedModule, setSelectedModule] = useState('packages');

  // Sample data for demonstration
  const leads = [
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '+966501234567', service: 'Umrah Visa', status: 'New', date: '2024-01-15' },
    { id: 2, name: 'Fatima Ali', email: 'fatima@email.com', phone: '+971501234567', service: 'Umrah Package', status: 'Contacted', date: '2024-01-14' },
    { id: 3, name: 'Mohammed Khan', email: 'mohammed@email.com', phone: '+92301234567', service: 'Hotel Booking', status: 'Converted', date: '2024-01-13' }
  ];

  const packages = [
    { id: 1, name: '5-Star Umrah Package', price: '$2999', duration: '14 days', status: 'Active' },
    { id: 2, name: 'Economy Umrah Package', price: '$1999', duration: '10 days', status: 'Active' },
    { id: 3, name: 'Family Umrah Package', price: '$8999', duration: '21 days', status: 'Draft' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-emerald-600">1,234</p>
              </div>
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Packages</p>
                <p className="text-3xl font-bold text-blue-600">56</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-green-600">$45.2K</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-purple-600">12.3%</p>
              </div>
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.slice(0, 5).map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-gray-600">{lead.service}</p>
                  </div>
                  <Badge variant={lead.status === 'New' ? 'default' : lead.status === 'Contacted' ? 'secondary' : 'outline'}>
                    {lead.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Umrah Visa</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Umrah Packages</span>
                <span className="font-bold">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hotel Booking</span>
                <span className="font-bold">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transport</span>
                <span className="font-bold">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCRM = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Phone</th>
                  <th className="text-left p-2">Service</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{lead.name}</td>
                    <td className="p-2">{lead.email}</td>
                    <td className="p-2">{lead.phone}</td>
                    <td className="p-2">{lead.service}</td>
                    <td className="p-2">
                      <Badge variant={lead.status === 'New' ? 'default' : lead.status === 'Contacted' ? 'secondary' : 'outline'}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-2">{lead.date}</td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
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
    </div>
  );

  const renderCMSModule = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management - {selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1)}</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'packages', label: 'Umrah Packages', icon: Package },
          { key: 'hotels', label: 'Hotels', icon: Hotel },
          { key: 'transport', label: 'Transport', icon: Car },
          { key: 'flights', label: 'Group Flights', icon: Plane },
          { key: 'guides', label: 'Guide Services', icon: User },
          { key: 'visas', label: 'Saudi Visas', icon: FileText },
          { key: 'ziarath', label: 'Ziarath', icon: Map },
          { key: 'blogs', label: 'Blogs', icon: FileText }
        ].map(module => (
          <Card 
            key={module.key}
            className={`cursor-pointer transition-all ${selectedModule === module.key ? 'ring-2 ring-emerald-500' : ''}`}
            onClick={() => setSelectedModule(module.key)}
          >
            <CardContent className="p-4 text-center">
              <module.icon className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <p className="text-sm font-medium">{module.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedModule === 'packages' && (
        <Card>
          <CardHeader>
            <CardTitle>Umrah Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Duration</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(pkg => (
                    <tr key={pkg.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{pkg.name}</td>
                      <td className="p-2">{pkg.price}</td>
                      <td className="p-2">{pkg.duration}</td>
                      <td className="p-2">
                        <Badge variant={pkg.status === 'Active' ? 'default' : 'secondary'}>
                          {pkg.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
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
      )}
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SEO Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Global SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Default Meta Title</label>
              <Input placeholder="Enter default meta title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Default Meta Description</label>
              <Textarea placeholder="Enter default meta description" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Default Meta Keywords</label>
              <Input placeholder="Enter keywords separated by commas" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Canonical URL</label>
              <Input placeholder="https://marhabahaji.com" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Open Graph Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">OG Title</label>
                <Input placeholder="Open Graph title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OG Description</label>
                <Textarea placeholder="Open Graph description" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OG Image URL</label>
                <Input placeholder="https://example.com/og-image.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OG Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OG type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Twitter Card Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Twitter Card Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                <Input placeholder="@marhabahaji" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Schema Markup</h3>
            <div>
              <label className="block text-sm font-medium mb-2">JSON-LD Schema</label>
              <Textarea 
                placeholder='{"@context": "https://schema.org", "@type": "Organization", "name": "Marhaba Haji"}'
                rows={6}
              />
            </div>
          </div>

          <Button className="w-full">Save SEO Settings</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Control Panel</h1>
          <p className="text-gray-600">Manage your website content and customer relationships</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="crm">
            {renderCRM()}
          </TabsContent>

          <TabsContent value="cms">
            {renderCMSModule()}
          </TabsContent>

          <TabsContent value="seo">
            {renderSEOSettings()}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ControlPanel;
