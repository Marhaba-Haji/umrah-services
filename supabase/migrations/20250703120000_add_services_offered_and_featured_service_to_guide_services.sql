-- Migration: Add services_offered and featured_service to guide_services (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='guide_services' AND column_name='services_offered'
  ) THEN
    ALTER TABLE public.guide_services ADD COLUMN services_offered TEXT[];
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='guide_services' AND column_name='featured_service'
  ) THEN
    ALTER TABLE public.guide_services ADD COLUMN featured_service TEXT;
  END IF;
END $$; 