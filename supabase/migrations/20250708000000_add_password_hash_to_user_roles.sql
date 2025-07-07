-- Add password_hash column to user_roles table
ALTER TABLE public.user_roles ADD COLUMN password_hash TEXT; 