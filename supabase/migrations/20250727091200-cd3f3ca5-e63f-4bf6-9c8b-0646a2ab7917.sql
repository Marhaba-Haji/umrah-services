
-- Add new columns to umrah_packages table
ALTER TABLE umrah_packages 
ADD COLUMN disclaimer text,
ADD COLUMN traveler_responsibilities text,
ADD COLUMN cancellation_policy text,
ADD COLUMN refund_policy text;
