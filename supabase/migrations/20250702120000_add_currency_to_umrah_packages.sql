-- Add currency column to umrah_packages if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='umrah_packages' AND column_name='currency'
  ) THEN
    ALTER TABLE public.umrah_packages ADD COLUMN currency text DEFAULT 'INR';
  END IF;
END $$;

-- Update existing rows to INR if null
UPDATE public.umrah_packages SET currency = 'INR' WHERE currency IS NULL; 