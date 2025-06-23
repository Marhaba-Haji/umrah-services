-- Create hotel_enquiries table for hotel enquiry form submissions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'closed');

CREATE TABLE public.hotel_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE SET NULL,
  hotel_name TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  country_code TEXT,
  phone TEXT,
  message TEXT,
  check_in DATE,
  check_out DATE,
  rooms JSONB, -- array of {guests: number}
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status enquiry_status DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE public.hotel_enquiries ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access" ON public.hotel_enquiries FOR ALL USING (public.is_admin(auth.uid()));

-- Allow authenticated users to insert
CREATE POLICY "Authenticated can insert hotel enquiries" ON public.hotel_enquiries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow admin to select all
CREATE POLICY "Admin can select hotel enquiries" ON public.hotel_enquiries
  FOR SELECT USING (public.is_admin(auth.uid())); 