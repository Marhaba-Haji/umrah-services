-- Standardize 'WiFi' to 'Free WiFi' and add missing amenities to existing hotels

-- Makkah Hotels
UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant', 'Room Service', 'Air Conditioning', 'Spa']
WHERE name = 'Swissôtel Al Maqam Makkah';

UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant', 'Air Conditioning', 'Breakfast', 'Parking']
WHERE name = 'Elaf Al Mashaer Hotel Makkah';

UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant', 'Gym', 'Room Service', 'Spa', 'Parking']
WHERE name = 'Al Ghufran Safwah Hotel Makkah';

UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant', 'Breakfast']
WHERE name = 'Ibis Styles Makkah';

UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant', 'Room Service', 'Air Conditioning', 'Parking']
WHERE name = 'Le Méridien Makkah';

-- Madinah Hotels
UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant', 'Gym', 'Room Service', 'Spa', 'Parking']
WHERE name = 'Dar Al Hijra InterContinental';

UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant', 'Air Conditioning', 'Breakfast', 'Parking']
WHERE name = 'Crowne Plaza Madinah';

UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant']
WHERE name = 'Emaar Royal Hotel Al Madinah';

UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Pool', 'Restaurant', 'Room Service', 'Gym', 'Spa', 'Parking']
WHERE name = 'Anwar Al Madinah Mövenpick Hotel';

UPDATE public.hotels
SET amenities = ARRAY['Free WiFi', 'Restaurant', 'Air Conditioning', 'Parking']
WHERE name = 'Taiba Front Hotel'; 