-- Create student registry table used during sign up / log in
CREATE TABLE IF NOT EXISTS public.student_registry (
  college_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  college TEXT NOT NULL,
  major TEXT,
  year TEXT,
  avatar_url TEXT
);

ALTER TABLE public.student_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Student registry is readable for auth flows." ON public.student_registry
  FOR SELECT USING (true);

-- Create a profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  skill_fingerprint JSONB, -- Stores the radar chart data
  bio TEXT,
  college TEXT,
  branch TEXT,
  year_of_study TEXT,
  is_discoverable BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

-- Backfill columns if table already existed without them
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS branch TEXT,
  ADD COLUMN IF NOT EXISTS year_of_study TEXT;

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, github_username, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'user_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
