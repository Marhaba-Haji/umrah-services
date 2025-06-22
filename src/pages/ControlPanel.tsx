import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  BarChart3
} from 'lucide-react';

// Import the new modular components
import PackageManager from '../components/cms/PackageManager';
import HotelManager from '../components/cms/HotelManager';
import BlogManager from '../components/cms/BlogManager';
import TransportManager from '../components/cms/TransportManager';
import GroupFlightsManager from '../components/cms/GroupFlightsManager';
import GuideServicesManager from '../components/cms/GuideServicesManager';
import SaudiVisasManager from '../components/cms/SaudiVisasManager';
import ZiarathManager from '../components/cms/ZiarathManager';
import LeadManager from '../components/crm/LeadManager';
import SEOManager from '../components/seo/SEOManager';

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedModule, setSelectedModule] = useState('packages');

  // Sample data for demonstration
  const leads = [
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '+966501234567', service: 'Umrah Visa', status: 'New', date: '2024-01-15' },
    { id: 2, name: 'Fatima Ali', email: 'fatima@email.com', phone: '+971501234567', service: 'Umrah Package', status: 'Contacted', date: '2024-01-14' },
    { id: 3, name: 'Mohammed Khan', email: 'mohammed@email.com', phone: '+92301234567', service: 'Hotel Booking', status: 'Converted', date: '2024-01-13' }
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

  const renderCMSModule = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management - {selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1)}</h2>
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

      {selectedModule === 'packages' && <PackageManager />}
      {selectedModule === 'hotels' && <HotelManager />}
      {selectedModule === 'transport' && <TransportManager />}
      {selectedModule === 'flights' && <GroupFlightsManager />}
      {selectedModule === 'guides' && <GuideServicesManager />}
      {selectedModule === 'visas' && <SaudiVisasManager />}
      {selectedModule === 'ziarath' && <ZiarathManager />}
      {selectedModule === 'blogs' && <BlogManager />}
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
            <LeadManager />
          </TabsContent>

          <TabsContent value="cms">
            {renderCMSModule()}
          </TabsContent>

          <TabsContent value="seo">
            <SEOManager />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ControlPanel;
