-- Add country_code column (already present)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS country_code text null;

-- Allow anyone to insert a lead
DROP POLICY IF EXISTS "Allow insert for all" ON public.leads;
CREATE POLICY "Allow insert for all" ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select leads
DROP POLICY IF EXISTS "Allow select for all" ON public.leads;
CREATE POLICY "Allow select for all" ON public.leads
  FOR SELECT
  USING (true); 