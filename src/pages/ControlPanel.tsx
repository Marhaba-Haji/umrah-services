
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Hotel, 
  Package, 
  Car, 
  Plane, 
  User, 
  FileText, 
  MapPin, 
  MessageSquare,
  Users,
  Star,
  Settings,
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  PenTool,
  Folder
} from 'lucide-react';

// Import CMS components
import BlogManager from '../components/cms/BlogManager';
import CategoryManager from './CategoryManager';
import HotelManager from '../components/cms/HotelManager';
import PackageManager from '../components/cms/PackageManager';
import TransportManager from '../components/cms/TransportManager';
import GroupFlightsManager from '../components/cms/GroupFlightsManager';
import GuideServicesManager from '../components/cms/GuideServicesManager';
import SaudiVisasManager from '../components/cms/SaudiVisasManager';
import ZiarathManager from '../components/cms/ZiarathManager';
import LeadManager from '../components/crm/LeadManager';
import SEOManager from '../components/seo/SEOManager';

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { title: 'Total Bookings', value: '1,234', icon: Calendar, color: 'text-blue-600' },
    { title: 'Revenue', value: '$125,000', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Packages', value: '45', icon: Package, color: 'text-purple-600' },
    { title: 'Total Leads', value: '567', icon: Users, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { action: 'New booking received', time: '2 minutes ago', type: 'booking' },
    { action: 'Lead converted to customer', time: '15 minutes ago', type: 'lead' },
    { action: 'New hotel added', time: '1 hour ago', type: 'hotel' },
    { action: 'Package updated', time: '2 hours ago', type: 'package' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marhaba Haji Control Panel</h1>
              <p className="text-gray-600">Manage your Umrah travel services</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                System Online
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 gap-1">
            <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
            <TabsTrigger value="blogs" className="text-xs">Blogs</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs">Categories</TabsTrigger>
            <TabsTrigger value="hotels" className="text-xs">Hotels</TabsTrigger>
            <TabsTrigger value="packages" className="text-xs">Packages</TabsTrigger>
            <TabsTrigger value="transport" className="text-xs">Transport</TabsTrigger>
            <TabsTrigger value="flights" className="text-xs">Flights</TabsTrigger>
            <TabsTrigger value="guides" className="text-xs">Guides</TabsTrigger>
            <TabsTrigger value="visas" className="text-xs">Visas</TabsTrigger>
            <TabsTrigger value="ziarath" className="text-xs">Ziarath</TabsTrigger>
            <TabsTrigger value="leads" className="text-xs">Leads</TabsTrigger>
            <TabsTrigger value="seo" className="text-xs">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Revenue Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Revenue data visualization
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('blogs')}>
                    <PenTool className="w-6 h-6" />
                    <span className="text-xs">New Blog</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('packages')}>
                    <Package className="w-6 h-6" />
                    <span className="text-xs">Add Package</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('hotels')}>
                    <Hotel className="w-6 h-6" />
                    <span className="text-xs">Add Hotel</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('leads')}>
                    <Users className="w-6 h-6" />
                    <span className="text-xs">View Leads</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('categories')}>
                    <Folder className="w-6 h-6" />
                    <span className="text-xs">Categories</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('seo')}>
                    <Settings className="w-6 h-6" />
                    <span className="text-xs">SEO Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs">
            <BlogManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="hotels">
            <HotelManager />
          </TabsContent>

          <TabsContent value="packages">
            <PackageManager />
          </TabsContent>

          <TabsContent value="transport">
            <TransportManager />
          </TabsContent>

          <TabsContent value="flights">
            <GroupFlightsManager />
          </TabsContent>

          <TabsContent value="guides">
            <GuideServicesManager />
          </TabsContent>

          <TabsContent value="visas">
            <SaudiVisasManager />
          </TabsContent>

          <TabsContent value="ziarath">
            <ZiarathManager />
          </TabsContent>

          <TabsContent value="leads">
            <LeadManager />
          </TabsContent>

          <TabsContent value="seo">
            <SEOManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ControlPanel;
