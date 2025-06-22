
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for better data integrity
CREATE TYPE package_status AS ENUM ('active', 'inactive', 'draft');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE visa_status AS ENUM ('active', 'suspended', 'discontinued');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE transport_type AS ENUM ('bus', 'car', 'van', 'luxury_car');
CREATE TYPE flight_type AS ENUM ('direct', 'connecting');
CREATE TYPE guide_service_type AS ENUM ('personal_guide', 'group_guide', 'ziarath_guide', 'translation_service');
CREATE TYPE ziarath_type AS ENUM ('makkah_ziarath', 'madinah_ziarath', 'taif_ziarath', 'badr_ziarath', 'jeddah_ziarath');
CREATE TYPE hotel_rating AS ENUM ('3_star', '4_star', '5_star', 'luxury');
CREATE TYPE room_type AS ENUM ('single', 'double', 'triple', 'quad', 'family');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  city TEXT,
  passport_number TEXT,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Categories for organizing content
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotels management
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  location TEXT NOT NULL,
  rating hotel_rating NOT NULL,
  distance_from_haram TEXT,
  price_per_night DECIMAL(10,2) NOT NULL,
  description TEXT,
  amenities TEXT[],
  images TEXT[],
  contact_phone TEXT,
  contact_email TEXT,
  address TEXT,
  google_maps_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel rooms
CREATE TABLE public.hotel_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type room_type NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  description TEXT,
  amenities TEXT[],
  images TEXT[],
  available_rooms INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Umrah packages
CREATE TABLE public.umrah_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  makkah_hotel_id UUID REFERENCES public.hotels(id),
  madinah_hotel_id UUID REFERENCES public.hotels(id),
  description TEXT,
  itinerary JSONB,
  inclusions TEXT[],
  exclusions TEXT[],
  terms_conditions TEXT,
  images TEXT[],
  featured_image TEXT,
  category_id UUID REFERENCES public.categories(id),
  status package_status DEFAULT 'draft',
  max_capacity INTEGER,
  available_spots INTEGER,
  departure_date DATE,
  return_date DATE,
  booking_deadline DATE,
  is_group_package BOOLEAN DEFAULT FALSE,
  min_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transport services
CREATE TABLE public.transport_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_type transport_type NOT NULL,
  route TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  features TEXT[],
  driver_name TEXT,
  driver_contact TEXT,
  vehicle_details JSONB,
  is_ac BOOLEAN DEFAULT TRUE,
  luggage_capacity TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group flights
CREATE TABLE public.group_flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector TEXT NOT NULL,
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration TEXT NOT NULL,
  layover_duration TEXT,
  luggage_limit TEXT,
  flight_type flight_type DEFAULT 'direct',
  departure_date DATE,
  return_date DATE,
  available_seats INTEGER,
  max_capacity INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guide services
CREATE TABLE public.guide_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_name TEXT NOT NULL,
  guide_photo TEXT,
  guide_city TEXT NOT NULL,
  guide_contact TEXT,
  service_type guide_service_type NOT NULL,
  languages TEXT[],
  experience TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  description TEXT,
  service_prices JSONB,
  availability_schedule JSONB,
  qualifications TEXT[],
  specializations TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saudi visas
CREATE TABLE public.saudi_visas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type TEXT NOT NULL,
  visa_category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  processing_time TEXT NOT NULL,
  visa_validity TEXT NOT NULL,
  stay_validity TEXT NOT NULL,
  number_of_entries TEXT NOT NULL,
  requirements TEXT[],
  description TEXT,
  application_process JSONB,
  required_documents JSONB,
  status visa_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ziarath services
CREATE TABLE public.ziarath_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ziarath_type ziarath_type NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  inclusions TEXT[],
  significance TEXT,
  best_time TEXT,
  historical_importance TEXT,
  images TEXT[],
  guide_id UUID REFERENCES public.guide_services(id),
  max_participants INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  featured_image_alt TEXT,
  category_id UUID REFERENCES public.categories(id),
  author_id UUID REFERENCES public.profiles(id),
  status blog_status DEFAULT 'draft',
  publish_date TIMESTAMP WITH TIME ZONE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  schema_markup JSONB,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT,
  og_url TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  twitter_card_type TEXT,
  view_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog categories (using existing categories table with foreign key)
-- This allows for hierarchical blog categorization

-- Leads/CRM
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  country TEXT,
  city TEXT,
  service_interest TEXT,
  package_interest UUID REFERENCES public.umrah_packages(id),
  travel_dates JSONB,
  number_of_travelers INTEGER,
  budget_range TEXT,
  special_requirements TEXT,
  lead_source TEXT,
  status lead_status DEFAULT 'new',
  notes TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  follow_up_date TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id),
  package_id UUID REFERENCES public.umrah_packages(id),
  lead_id UUID REFERENCES public.leads(id),
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  status booking_status DEFAULT 'pending',
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  travel_date DATE,
  return_date DATE,
  number_of_travelers INTEGER NOT NULL,
  traveler_details JSONB,
  special_requests TEXT,
  payment_details JSONB,
  cancellation_reason TEXT,
  cancellation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking services (for additional services booked with packages)
CREATE TABLE public.booking_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'transport', 'guide', 'ziarath', 'visa', 'flight'
  service_id UUID, -- Generic reference to any service table
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  service_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel bookings (separate from package bookings)
CREATE TABLE public.hotel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id),
  hotel_id UUID REFERENCES public.hotels(id),
  room_id UUID REFERENCES public.hotel_rooms(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_rooms INTEGER DEFAULT 1,
  number_of_guests INTEGER NOT NULL,
  guest_details JSONB,
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  reviewable_type TEXT NOT NULL, -- 'package', 'hotel', 'guide', 'transport'
  reviewable_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ management
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO pages management
CREATE TABLE public.seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_url TEXT NOT NULL UNIQUE,
  page_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  canonical_url TEXT,
  schema_markup JSONB,
  robots_meta TEXT DEFAULT 'index, follow',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact inquiries
CREATE TABLE public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT,
  status TEXT DEFAULT 'new',
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES public.profiles(id),
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_photo TEXT,
  customer_location TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  service_type TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  setting_type TEXT DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umrah_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ziarath_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read access for most content tables (for website visitors)
CREATE POLICY "Public read access" ON public.hotels FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.hotel_rooms FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.umrah_packages FOR SELECT USING (status = 'active');
CREATE POLICY "Public read access" ON public.transport_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.group_flights FOR SELECT USING (status = 'active');
CREATE POLICY "Public read access" ON public.guide_services FOR SELECT USING (status = 'active');
CREATE POLICY "Public read access" ON public.saudi_visas FOR SELECT USING (status = 'active');
CREATE POLICY "Public read access" ON public.ziarath_services FOR SELECT USING (status = 'active');
CREATE POLICY "Public read access" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.reviews FOR SELECT USING (status = 'approved');

-- Admin full access policies
CREATE POLICY "Admin full access" ON public.hotels FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.hotel_rooms FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.umrah_packages FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.transport_services FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.group_flights FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.guide_services FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.saudi_visas FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.ziarath_services FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.blog_posts FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.categories FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.leads FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.bookings FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.booking_services FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.hotel_bookings FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.reviews FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.faqs FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.seo_pages FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.contact_inquiries FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.testimonials FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access" ON public.system_settings FOR ALL USING (public.is_admin(auth.uid()));

-- User-specific access policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own hotel bookings" ON public.hotel_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own hotel bookings" ON public.hotel_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own reviews" ON public.reviews FOR SELECT USING (auth.uid() = user_id);

-- Public contact form access
CREATE POLICY "Anyone can create contact inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_hotels_city ON public.hotels(city);
CREATE INDEX idx_hotels_rating ON public.hotels(rating);
CREATE INDEX idx_hotels_featured ON public.hotels(featured);
CREATE INDEX idx_umrah_packages_status ON public.umrah_packages(status);
CREATE INDEX idx_umrah_packages_departure_date ON public.umrah_packages(departure_date);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_reviews_reviewable ON public.reviews(reviewable_type, reviewable_id);
CREATE INDEX idx_leads_status ON public.leads(status);

-- Insert initial admin user role (replace with actual admin user ID)
-- This will need to be updated with the actual admin user ID after user creation
INSERT INTO public.categories (name, slug, description) VALUES 
('Umrah Packages', 'umrah-packages', 'All Umrah package categories'),
('Hotels', 'hotels', 'Hotel categories'),
('Guides', 'guides', 'Blog guides and tutorials'),
('Tips', 'tips', 'Travel tips and advice'),
('News', 'news', 'Latest news and updates'),
('Stories', 'stories', 'Customer stories and experiences');

-- Insert some system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', '"Marhaba Haji"', 'general', 'Website name', true),
('contact_email', '"info@marhabahaji.com"', 'contact', 'Contact email', true),
('contact_phone', '"+966501234567"', 'contact', 'Contact phone', true),
('currency', '"USD"', 'general', 'Default currency', true),
('booking_confirmation_email', 'true', 'booking', 'Send booking confirmation emails', false);
