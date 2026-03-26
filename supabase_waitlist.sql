-- Waitlist table — stores early-interest signups from the landing page CTA
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts so unauthenticated visitors can join
CREATE POLICY "Anyone can join the waitlist." ON public.waitlist
  FOR INSERT WITH CHECK (true);
