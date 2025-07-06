import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Activity {
  id: string;
  name: string;
  city: string;
  description: string;
  duration?: string;
  price?: number;
  featured_image?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  gallery?: any;
  inclusions?: string;
  exclusions?: string;
  sites?: string;
  features?: string;
  faqs?: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  page_schema?: any;
  vehicle_prices?: { [vehicleId: string]: number };
  slug?: string;
  terms_and_conditions?: string;
  disclaimer?: string;
}

const ActivityManager = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
      } else {
        setActivities(data?.map((a: any) => ({
          ...a,
          slug: a.slug || '',
          vehicle_prices: typeof a.vehicle_prices === 'string' ? JSON.parse(a.vehicle_prices) : (a.vehicle_prices || {}),
          gallery: typeof a.gallery === 'string' ? JSON.parse(a.gallery) : (a.gallery || []),
          faqs: typeof a.faqs === 'string' ? JSON.parse(a.faqs) : (a.faqs || []),
          page_schema: typeof a.page_schema === 'string' ? JSON.parse(a.page_schema) : (a.page_schema || {}),
          id: a.id,
          name: a.name,
          city: a.city,
          description: a.description,
          duration: a.duration || '',
          price: a.price || 0,
          featured_image: a.featured_image || '',
          is_featured: a.is_featured,
          created_at: a.created_at,
          updated_at: a.updated_at,
          inclusions: a.inclusions || '',
          exclusions: a.exclusions || '',
          sites: a.sites || '',
          features: a.features || '',
          meta_title: a.meta_title || '',
          meta_description: a.meta_description || '',
          meta_keywords: a.meta_keywords || '',
          og_title: a.og_title || '',
          og_description: a.og_description || '',
          og_image: a.og_image || '',
          canonical_url: a.canonical_url || '',
          terms_and_conditions: a.terms_and_conditions || '',
          disclaimer: a.disclaimer || ''
        })) || []);
      }
      setIsLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading activities...</p>}
      {!isLoading && activities.length === 0 && <p>No activities found.</p>}
      {!isLoading && activities.length > 0 && (
        <ul>
          {activities.map(activity => (
            <li key={activity.id}>
              <h3>{activity.name}</h3>
              <p>{activity.city}</p>
              <p>{activity.description}</p>
              {/* Additional activity details can be rendered here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityManager;
