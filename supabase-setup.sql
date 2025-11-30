-- 1. Enable extension required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Drop existing table if you want to start fresh (OPTIONAL - comment out if you want to keep existing data)
-- DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;

-- 3. Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  source TEXT DEFAULT 'website',
  metadata JSONB,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Add is_active column if it doesn't exist (for existing tables)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'newsletter_subscribers'
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.newsletter_subscribers ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- 5. Unique lower(email) index to enforce case-insensitive uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS ux_newsletter_subscribers_email_lower
  ON public.newsletter_subscribers (LOWER(email));

-- 6. Optional: faster email queries
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email
  ON public.newsletter_subscribers (email);

-- 7. Create index on is_active for filtering active subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active
  ON public.newsletter_subscribers (is_active);

-- 8. Create index on subscribed_at for sorting
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at
  ON public.newsletter_subscribers (subscribed_at DESC);

-- 9. Add RLS (Row Level Security) policies
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 10. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public inserts" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.newsletter_subscribers;

-- 11. Allow inserts from authenticated and anonymous users
CREATE POLICY "Allow public inserts" ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 12. Allow select only for authenticated users (admin access)
CREATE POLICY "Allow authenticated select" ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- 13. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON public.newsletter_subscribers;

-- 15. Trigger to automatically update updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
