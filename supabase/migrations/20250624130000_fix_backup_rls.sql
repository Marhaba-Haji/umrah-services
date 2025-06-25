-- Update RLS policy to allow service role access for database backups
DROP POLICY IF EXISTS "Admin full access to backups" ON public.database_backups;

-- Create policy that allows service role and admin users
CREATE POLICY "Service role and admin access to backups" ON public.database_backups FOR ALL 
USING (
  auth.role() = 'service_role' OR 
  public.is_admin(auth.uid())
);

-- Allow all authenticated users to view backups
CREATE POLICY "Authenticated users can view backups" ON public.database_backups
FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role' OR public.is_admin(auth.uid()));
