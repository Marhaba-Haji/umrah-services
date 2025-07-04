-- Add slug column to activities table if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='activities' AND column_name='slug'
    ) THEN
        ALTER TABLE activities ADD COLUMN slug TEXT UNIQUE;
    END IF;
END $$; 