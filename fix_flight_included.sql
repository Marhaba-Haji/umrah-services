-- Fix flight_included field consistency for existing packages
-- This script updates flight_included based on whether flight details are present

-- Update packages that have flight details but flight_included is false
UPDATE umrah_packages 
SET flight_included = true 
WHERE (
  flight_details->>'airline_name' IS NOT NULL AND flight_details->>'airline_name' != '' OR
  flight_details->>'flight_type' IS NOT NULL AND flight_details->>'flight_type' != '' OR
  flight_details->>'departure_from_airport' IS NOT NULL AND flight_details->>'departure_from_airport' != '' OR
  flight_details->>'return_from_airport' IS NOT NULL AND flight_details->>'return_from_airport' != ''
) AND (flight_included = false OR flight_included IS NULL);

-- Update packages that have no flight details but flight_included is true
UPDATE umrah_packages 
SET flight_included = false 
WHERE (
  flight_details->>'airline_name' IS NULL OR flight_details->>'airline_name' = '' AND
  flight_details->>'flight_type' IS NULL OR flight_details->>'flight_type' = '' AND
  flight_details->>'departure_from_airport' IS NULL OR flight_details->>'departure_from_airport' = '' AND
  flight_details->>'return_from_airport' IS NULL OR flight_details->>'return_from_airport' = ''
) AND flight_included = true;

-- Show summary of changes
SELECT 
  'Packages with flight details' as category,
  COUNT(*) as count
FROM umrah_packages 
WHERE flight_included = true
UNION ALL
SELECT 
  'Packages without flight details' as category,
  COUNT(*) as count
FROM umrah_packages 
WHERE flight_included = false OR flight_included IS NULL; 