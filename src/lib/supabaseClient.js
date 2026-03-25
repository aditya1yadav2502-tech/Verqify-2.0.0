import { createClient } from '@supabase/supabase-js';

// These environment variables will be provided in a .env local file and in Vercel Deployment settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
