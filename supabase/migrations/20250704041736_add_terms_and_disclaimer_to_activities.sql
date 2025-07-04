-- Add 'terms_and_conditions' and 'disclaimer' columns to activities table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='activities' AND column_name='terms_and_conditions'
  ) THEN
    ALTER TABLE activities ADD COLUMN terms_and_conditions text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='activities' AND column_name='disclaimer'
  ) THEN
    ALTER TABLE activities ADD COLUMN disclaimer text;
  END IF;
END $$;
