import React, { useState, useEffect } from 'react';
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
import { supabase } from '../lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useToast } from '@/components/ui/use-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

// Import CMS components
import BlogManager from '../components/cms/BlogManager';
import CategoryManager from '../components/cms/CategoryManager';
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
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activityForm, setActivityForm] = useState({
    featured_image: '',
    is_featured: false,
    city: '',
    name: '',
    description: '',
    duration: '',
    price: '',
  });
  const [activityLoading, setActivityLoading] = useState(false);
  const { toast } = useToast();
  const [activityImageFile, setActivityImageFile] = useState<File | null>(null);
  const [activityImagePreview, setActivityImagePreview] = useState<string>('');
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

  const handleActivityChange = (field, value) => {
    setActivityForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddActivity = () => {
    setEditingActivity(null);
    setActivityDialogOpen(true);
  };

  const openEditActivity = (activity) => {
    setEditingActivity(activity);
    setActivityForm({
      featured_image: activity.featured_image || '',
      is_featured: activity.is_featured || false,
      city: activity.city || '',
      name: activity.name || '',
      description: activity.description || '',
      duration: activity.duration || '',
      price: activity.price ? String(activity.price) : '',
    });
    setActivityImagePreview(activity.featured_image || '');
    setActivityDialogOpen(true);
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Deleted', description: 'Activity deleted.' });
      fetchActivities();
    } else {
      toast({ title: 'Error', description: 'Failed to delete activity', variant: 'destructive' });
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    setActivityLoading(true);
    try {
      let error;
      if (editingActivity) {
        ({ error } = await supabase.from('activities').update({
          featured_image: activityForm.featured_image,
          is_featured: activityForm.is_featured,
          city: activityForm.city,
          name: activityForm.name,
          description: activityForm.description,
          duration: activityForm.duration,
          price: activityForm.price ? parseFloat(activityForm.price) : null,
        }).eq('id', editingActivity.id));
      } else {
        ({ error } = await supabase.from('activities').insert([
          {
            featured_image: activityForm.featured_image,
            is_featured: activityForm.is_featured,
            city: activityForm.city,
            name: activityForm.name,
            description: activityForm.description,
            duration: activityForm.duration,
            price: activityForm.price ? parseFloat(activityForm.price) : null,
          },
        ]));
      }
      if (error) throw error;
      toast({ title: 'Success', description: editingActivity ? 'Activity updated!' : 'Activity saved successfully!' });
      setActivityForm({
        featured_image: '',
        is_featured: false,
        city: '',
        name: '',
        description: '',
        duration: '',
        price: '',
      });
      setActivityImagePreview('');
      setActivityDialogOpen(false);
      setEditingActivity(null);
      fetchActivities();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save activity', variant: 'destructive' });
    } finally {
      setActivityLoading(false);
    }
  };

  const handleActivityImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setActivityImageFile(file);
    setActivityImagePreview(URL.createObjectURL(file));
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('activities-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      toast({ title: 'Error', description: 'Image upload failed', variant: 'destructive' });
      return;
    }
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('activities-images').getPublicUrl(fileName);
    if (publicUrlData?.publicUrl) {
      setActivityForm((prev) => ({ ...prev, featured_image: publicUrlData.publicUrl }));
    }
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    if (!error) setActivities(data || []);
    setActivitiesLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'activities') fetchActivities();
  }, [activeTab]);

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']}
            theme="default"
          />
        </div>
      </div>
    );
  }

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
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <Settings className="w-4 h-4 mr-2" />
                Logout
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
            <TabsTrigger value="activities" className="text-xs">Activities</TabsTrigger>
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
            <HotelManager session={session} />
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

          <TabsContent value="activities">
            <Card className="max-w-5xl mx-auto mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Activities</CardTitle>
                <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openAddActivity}>Add Activity</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
                      <DialogDescription>
                        {editingActivity ? 'Edit the details of this activity.' : 'Fill in the details to add a new activity.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleActivitySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Featured Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleActivityImageChange}
                            className="block w-full text-sm text-gray-700"
                          />
                          {activityImagePreview && (
                            <img src={activityImagePreview} alt="Preview" className="mt-2 rounded shadow max-h-32" />
                          )}
                        </div>
                        <div className="flex items-center mt-6 md:mt-0">
                          <input
                            type="checkbox"
                            checked={activityForm.is_featured}
                            onChange={e => handleActivityChange('is_featured', e.target.checked)}
                            id="is_featured"
                            className="mr-2"
                          />
                          <label htmlFor="is_featured" className="text-sm font-medium">Featured</label>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">City</label>
                          <Input
                            value={activityForm.city}
                            onChange={e => handleActivityChange('city', e.target.value)}
                            placeholder="Enter city"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Activity Name</label>
                          <Input
                            value={activityForm.name}
                            onChange={e => handleActivityChange('name', e.target.value)}
                            placeholder="Enter activity name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <ReactQuill
                          theme="snow"
                          value={activityForm.description}
                          onChange={val => handleActivityChange('description', val)}
                          className="bg-white"
                          style={{ minHeight: 120 }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Duration</label>
                          <Input
                            value={activityForm.duration}
                            onChange={e => handleActivityChange('duration', e.target.value)}
                            placeholder="e.g. 2 hours"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Price</label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={activityForm.price}
                            onChange={e => handleActivityChange('price', e.target.value)}
                            placeholder="e.g. 49.99"
                          />
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button type="submit" disabled={activityLoading} className="w-full">
                          {activityLoading ? (editingActivity ? 'Saving...' : 'Saving...') : (editingActivity ? 'Update Activity' : 'Save Activity')}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading...</div>
                ) : activities.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">No activities found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border">Image</th>
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">City</th>
                          <th className="p-2 border">Duration</th>
                          <th className="p-2 border">Price</th>
                          <th className="p-2 border">Featured</th>
                          <th className="p-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((a) => (
                          <tr key={a.id} className="hover:bg-gray-50">
                            <td className="p-2 border text-center">
                              {a.featured_image ? <img src={a.featured_image} alt="" className="h-12 w-12 object-cover rounded mx-auto" /> : '-'}
                            </td>
                            <td className="p-2 border">{a.name}</td>
                            <td className="p-2 border">{a.city}</td>
                            <td className="p-2 border">{a.duration}</td>
                            <td className="p-2 border">{a.price ? `$${a.price}` : '-'}</td>
                            <td className="p-2 border text-center">{a.is_featured ? 'Yes' : 'No'}</td>
                            <td className="p-2 border text-center">
                              <Button size="sm" variant="outline" className="mr-2" onClick={() => openEditActivity(a)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteActivity(a.id)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ControlPanel;
