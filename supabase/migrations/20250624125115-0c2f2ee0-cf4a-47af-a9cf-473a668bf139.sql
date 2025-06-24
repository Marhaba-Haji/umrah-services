
-- Create database_backups table for storing backup metadata and data
CREATE TABLE public.database_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name TEXT NOT NULL,
  backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'schema', 'data')),
  size_bytes BIGINT NOT NULL DEFAULT 0,
  table_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'failed')),
  backup_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.database_backups ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Admin full access to backups" ON public.database_backups FOR ALL USING (public.is_admin(auth.uid()));

-- Enable pg_cron extension for scheduled backups
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily backups at 2 AM UTC
SELECT cron.schedule(
  'daily-database-backup',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rjyhoikoqhephrkjgebo.supabase.co/functions/v1/schedule-backups',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeWhvaWtvcWhlcGhya2pnZWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDMxNjQsImV4cCI6MjA2NjE3OTE2NH0.Fjc89LevH6lXllWRjZSt-iNGBCzBgrACGt5nWKTPtlI"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  );
  $$
);

-- Create index for better performance
CREATE INDEX idx_database_backups_created_at ON public.database_backups(created_at DESC);
CREATE INDEX idx_database_backups_backup_type ON public.database_backups(backup_type);
