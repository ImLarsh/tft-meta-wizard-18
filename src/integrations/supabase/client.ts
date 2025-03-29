
import { createClient } from '@supabase/supabase-js';

// Get environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}
if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with explicit empty string fallback (instead of undefined)
export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co', 
  supabaseAnonKey || '',  // Empty string fallback to avoid "supabaseKey is required" error
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'tft-genie-auth-storage',
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);
