-- Add vehicle_prices column to activities table if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='activities' AND column_name='vehicle_prices'
    ) THEN
        ALTER TABLE activities ADD COLUMN vehicle_prices JSONB;
    END IF;
END $$; 