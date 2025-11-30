-- Fix RLS policies for newsletter_subscribers

-- 1. Drop existing policies
DROP POLICY IF EXISTS "Allow public inserts" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.newsletter_subscribers;

-- 2. Create new policy that allows anyone (including anonymous) to insert
CREATE POLICY "Enable insert for all users" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- 3. Allow authenticated users to read (admin access)
CREATE POLICY "Enable read for authenticated users" ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Verify RLS is enabled
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
