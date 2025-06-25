-- Migration: Change service_type to TEXT[] for multiple service types per guide (idempotent)

-- 1. Add new column if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='guide_services' AND column_name='service_type_array'
  ) THEN
    ALTER TABLE public.guide_services ADD COLUMN service_type_array TEXT[];
  END IF;
END $$;

-- 2. Migrate existing data
UPDATE public.guide_services
SET service_type_array = ARRAY[service_type::text]
WHERE service_type IS NOT NULL AND (service_type_array IS NULL OR array_length(service_type_array, 1) IS NULL);

-- 3. Drop old column and rename new one
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='guide_services' AND column_name='service_type'
  ) THEN
    ALTER TABLE public.guide_services DROP COLUMN service_type;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='guide_services' AND column_name='service_type_array'
  ) THEN
    ALTER TABLE public.guide_services RENAME COLUMN service_type_array TO service_type;
  END IF;
END $$; 