-- Add seo column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='umrah_packages' AND column_name='seo'
  ) THEN
    ALTER TABLE public.umrah_packages ADD COLUMN seo jsonb;
  END IF;
END $$;

-- Add hotels column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='umrah_packages' AND column_name='hotels'
  ) THEN
    ALTER TABLE public.umrah_packages ADD COLUMN hotels jsonb;
  END IF;
END $$;

-- Add season_category column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='umrah_packages' AND column_name='season_category'
  ) THEN
    ALTER TABLE public.umrah_packages ADD COLUMN season_category text;
  END IF;
END $$; 