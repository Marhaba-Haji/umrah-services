import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://rjyhoikoqhephrkjgebo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeWhvaWtvcWhlcGhya2pnZWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDMxNjQsImV4cCI6MjA2NjE3OTE2NH0.Fjc89LevH6lXllWRjZSt-iNGBCzBgrACGt5nWKTPtlI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 