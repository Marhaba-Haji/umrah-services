-- Create the table if it doesn't exist (optional, for safety)
CREATE TABLE IF NOT EXISTS public.hotels (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NULL,
    location text NULL,
    city text NULL,
    rating integer NULL,
    price_per_night numeric NULL,
    description text NULL,
    amenities text[] NULL,
    distance_from_haram integer NULL,
    distance_from_masjid_e_nabawi integer NULL,
    images text[] NULL,
    latitude text NULL,
    longitude text NULL,
    is_shuttle boolean NULL,
    is_walkable boolean NULL,
    status text NULL
);

-- Ensure RLS is enabled on the table
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON public.hotels;
DROP POLICY IF EXISTS "Allow authenticated users to manage hotels" ON public.hotels;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.hotels;


-- Create policy for public read access
CREATE POLICY "Allow public read access"
ON public.hotels
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users to manage hotels"
ON public.hotels
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated'); 