-- Migration: Split guide_contact into country_code and phone_number (idempotent)

-- 1. Add new columns if not exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='guide_services' AND column_name='country_code'
  ) THEN
    ALTER TABLE public.guide_services ADD COLUMN country_code text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='guide_services' AND column_name='phone_number'
  ) THEN
    ALTER TABLE public.guide_services ADD COLUMN phone_number text;
  END IF;
END $$;

-- 2. Migrate data if guide_contact exists and new columns are null
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='guide_services' AND column_name='guide_contact'
  ) THEN
    UPDATE public.guide_services
    SET
      country_code = COALESCE(country_code, SUBSTRING(guide_contact FROM '^\+\d+')),
      phone_number = COALESCE(phone_number, SUBSTRING(guide_contact FROM '\d+$'))
    WHERE (country_code IS NULL OR phone_number IS NULL) AND guide_contact IS NOT NULL;
  END IF;
END $$;

-- 3. Drop old guide_contact column if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='guide_services' AND column_name='guide_contact'
  ) THEN
    ALTER TABLE public.guide_services DROP COLUMN guide_contact;
  END IF;
END $$; 