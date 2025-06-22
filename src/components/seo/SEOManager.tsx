
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SEOSettings {
  global: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogType: string;
    twitterCard: string;
    twitterHandle: string;
    schemaMarkup: string;
  };
  pages: {
    [key: string]: {
      metaTitle: string;
      metaDescription: string;
      metaKeywords: string;
      canonicalUrl: string;
    };
  };
}

const SEOManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('global');
  const [selectedPage, setSelectedPage] = useState('home');
  
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    global: {
      metaTitle: 'Marhaba Haji - Your Trusted Umrah Partner',
      metaDescription: 'Complete Umrah services including visa processing, packages, hotels, and transport. Experience the spiritual journey with professional guidance.',
      metaKeywords: 'umrah, hajj, saudi visa, makkah, madinah, pilgrimage',
      canonicalUrl: 'https://marhabahaji.com',
      ogTitle: 'Marhaba Haji - Your Trusted Umrah Partner',
      ogDescription: 'Complete Umrah services including visa processing, packages, hotels, and transport.',
      ogImage: 'https://marhabahaji.com/og-image.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterHandle: '@marhabahaji',
      schemaMarkup: '{"@context": "https://schema.org", "@type": "Organization", "name": "Marhaba Haji"}'
    },
    pages: {
      home: {
        metaTitle: 'Marhaba Haji - Complete Umrah Services',
        metaDescription: 'Your trusted partner for Umrah journey with visa processing, packages, and professional guidance.',
        metaKeywords: 'umrah services, saudi visa, umrah packages',
        canonicalUrl: 'https://marhabahaji.com'
      },
      'umrah-packages': {
        metaTitle: 'Umrah Packages - Affordable & Premium Options',
        metaDescription: 'Choose from our carefully crafted Umrah packages including accommodation, transport, and guidance.',
        metaKeywords: 'umrah packages, makkah packages, madinah packages',
        canonicalUrl: 'https://marhabahaji.com/umrah-packages'
      }
    }
  });

  const pages = [
    { value: 'home', label: 'Home Page' },
    { value: 'umrah-packages', label: 'Umrah Packages' },
    { value: 'hotel-booking', label: 'Hotel Booking' },
    { value: 'transport-booking', label: 'Transport Booking' },
    { value: 'umrah-application', label: 'Umrah Application' },
    { value: 'group-flights', label: 'Group Flights' },
    { value: 'services', label: 'Services' },
    { value: 'blog', label: 'Blog' },
    { value: 'contact', label: 'Contact' },
    { value: 'about', label: 'About Us' }
  ];

  const handleGlobalSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "SEO Settings Saved",
      description: "Global SEO settings have been updated successfully.",
    });
  };

  const handlePageSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Page SEO Saved",
      description: `SEO settings for ${selectedPage} page have been updated successfully.`,
    });
  };

  const updateGlobalSetting = (key: keyof SEOSettings['global'], value: string) => {
    setSeoSettings(prev => ({
      ...prev,
      global: {
        ...prev.global,
        [key]: value
      }
    }));
  };

  const updatePageSetting = (page: string, key: string, value: string) => {
    setSeoSettings(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [page]: {
          ...prev.pages[page],
          [key]: value
        }
      }
    }));
  };

  const generatePageSEO = (page: string) => {
    const pageTitles: { [key: string]: string } = {
      'home': 'Complete Umrah Services - Marhaba Haji',
      'umrah-packages': 'Umrah Packages - Affordable & Premium Options',
      'hotel-booking': 'Hotel Booking in Makkah & Madinah',
      'transport-booking': 'Transport Services for Umrah',
      'umrah-application': 'Apply for Umrah Visa Online',
      'group-flights': 'Group Flight Bookings for Umrah',
      'services': 'Our Umrah Services',
      'blog': 'Umrah Blog & Guides',
      'contact': 'Contact Us - Marhaba Haji',
      'about': 'About Marhaba Haji'
    };

    const pageDescriptions: { [key: string]: string } = {
      'home': 'Your trusted partner for complete Umrah services including visa processing, packages, hotels, and transport with professional guidance.',
      'umrah-packages': 'Choose from our carefully crafted Umrah packages including luxury and economy options with accommodation and transport.',
      'hotel-booking': 'Book verified hotels in Makkah and Madinah with best rates and locations near Haram.',
      'transport-booking': 'Reliable transport services for your Umrah journey including airport transfers and inter-city travel.',
      'umrah-application': 'Apply for your Umrah visa online with guaranteed approval in 2-4 business days.',
      'group-flights': 'Special group flight packages for Umrah with competitive rates and flexible schedules.',
      'services': 'Comprehensive Umrah services including visa processing, accommodation, transport, and spiritual guidance.',
      'blog': 'Read our comprehensive guides and tips for your Umrah journey.',
      'contact': 'Contact Marhaba Haji for all your Umrah service needs. We are here to help you.',
      'about': 'Learn about Marhaba Haji, your trusted partner for spiritual journey to the holy cities.'
    };

    updatePageSetting(page, 'metaTitle', pageTitles[page] || `${page} - Marhaba Haji`);
    updatePageSetting(page, 'metaDescription', pageDescriptions[page] || `${page} page description`);
    updatePageSetting(page, 'canonicalUrl', `https://marhabahaji.com/${page === 'home' ? '' : page}`);
    
    toast({
      title: "SEO Generated",
      description: `SEO content has been auto-generated for ${page} page.`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SEO Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="pages">Page-Level SEO</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Default Meta Title</label>
                  <Input 
                    placeholder="Enter default meta title" 
                    value={seoSettings.global.metaTitle}
                    onChange={(e) => updateGlobalSetting('metaTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Canonical URL</label>
                  <Input 
                    placeholder="https://marhabahaji.com" 
                    value={seoSettings.global.canonicalUrl}
                    onChange={(e) => updateGlobalSetting('canonicalUrl', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Default Meta Description</label>
                <Textarea 
                  placeholder="Enter default meta description" 
                  rows={3} 
                  value={seoSettings.global.metaDescription}
                  onChange={(e) => updateGlobalSetting('metaDescription', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Default Meta Keywords</label>
                <Input 
                  placeholder="Enter keywords separate

d by commas" 
                  value={seoSettings.global.metaKeywords}
                  onChange={(e) => updateGlobalSetting('metaKeywords', e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Open Graph Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">OG Title</label>
                    <Input 
                      placeholder="Open Graph title" 
                      value={seoSettings.global.ogTitle}
                      onChange={(e) => updateGlobalSetting('ogTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">OG Image URL</label>
                    <Input 
                      placeholder="https://example.com/og-image.jpg" 
                      value={seoSettings.global.ogImage}
                      onChange={(e) => updateGlobalSetting('ogImage', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">OG Type</label>
                    <Select value={seoSettings.global.ogType} onValueChange={(value) => updateGlobalSetting('ogType', value)}>
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                    <Input 
                      placeholder="@marhabahaji" 
                      value={seoSettings.global.twitterHandle}
                      onChange={(e) => updateGlobalSetting('twitterHandle', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">OG Description</label>
                  <Textarea 
                    placeholder="Open Graph description" 
                    rows={3} 
                    value={seoSettings.global.ogDescription}
                    onChange={(e) => updateGlobalSetting('ogDescription', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Schema Markup</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">JSON-LD Schema</label>
                  <Textarea 
                    placeholder='{"@context": "https://schema.org", "@type": "Organization", "name": "Marhaba Haji"}'
                    rows={6}
                    value={seoSettings.global.schemaMarkup}
                    onChange={(e) => updateGlobalSetting('schemaMarkup', e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleGlobalSave} className="w-full">Save Global SEO Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page-Level SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Page</label>
                  <Select value={selectedPage} onValueChange={setSelectedPage}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map(page => (
                        <SelectItem key={page.value} value={page.value}>
                          {page.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => generatePageSEO(selectedPage)}
                >
                  Auto-Generate SEO
                </Button>
              </div>

              {seoSettings.pages[selectedPage] && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Page Meta Title</label>
                    <Input 
                      placeholder="Page specific meta title" 
                      value={seoSettings.pages[selectedPage].metaTitle || ''}
                      onChange={(e) => updatePageSetting(selectedPage, 'metaTitle', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Page Meta Description</label>
                    <Textarea 
                      placeholder="Page specific meta description" 
                      rows={3}
                      value={seoSettings.pages[selectedPage].metaDescription || ''}
                      onChange={(e) => updatePageSetting(selectedPage, 'metaDescription', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Page Meta Keywords</label>
                    <Input 
                      placeholder="Page specific keywords separated by commas" 
                      value={seoSettings.pages[selectedPage].metaKeywords || ''}
                      onChange={(e) => updatePageSetting(selectedPage, 'metaKeywords', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Canonical URL</label>
                    <Input 
                      placeholder="Page canonical URL" 
                      value={seoSettings.pages[selectedPage].canonicalUrl || ''}
                      onChange={(e) => updatePageSetting(selectedPage, 'canonicalUrl', e.target.value)}
                    />
                  </div>

                  <Button onClick={handlePageSave} className="w-full">
                    Save Page SEO Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Analytics & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <p className="text-sm text-gray-600">SEO Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">2.3s</div>
                    <p className="text-sm text-gray-600">Page Load Time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">98%</div>
                    <p className="text-sm text-gray-600">Mobile Score</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">SEO Recommendations</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">Meta descriptions are properly set</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm">Consider adding more internal links</span>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">All images have alt text</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">Good</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOManager;
