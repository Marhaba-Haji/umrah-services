-- Migration: Add process, total_stay_allowed, and eligibility columns to saudi_visas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='saudi_visas' AND column_name='process'
  ) THEN
    ALTER TABLE saudi_visas ADD COLUMN process TEXT;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='saudi_visas' AND column_name='total_stay_allowed'
  ) THEN
    ALTER TABLE saudi_visas ADD COLUMN total_stay_allowed INTEGER;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='saudi_visas' AND column_name='eligibility'
  ) THEN
    ALTER TABLE saudi_visas ADD COLUMN eligibility TEXT;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='saudi_visas' AND column_name='visa_format'
  ) THEN
    ALTER TABLE saudi_visas ADD COLUMN visa_format TEXT;
  END IF;
END$$;

-- Add agency_fees column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='saudi_visas' AND column_name='agency_fees'
  ) THEN
    ALTER TABLE saudi_visas ADD COLUMN agency_fees NUMERIC;
  END IF;
END$$;

-- Add embassy_fees column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='saudi_visas' AND column_name='embassy_fees'
  ) THEN
    ALTER TABLE saudi_visas ADD COLUMN embassy_fees NUMERIC;
  END IF;
END$$;

-- Add featured_image column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='saudi_visas' AND column_name='featured_image'
  ) THEN
    ALTER TABLE saudi_visas ADD COLUMN featured_image text;
  END IF;
END$$; 