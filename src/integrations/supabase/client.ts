
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log missing environment variables as warnings but don't stop execution
if (!supabaseUrl) {
  console.warn('Missing VITE_SUPABASE_URL environment variable');
}
if (!supabaseAnonKey) {
  console.warn('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Set default values for development/testing when environment variables are missing
const defaultUrl = 'https://your-project.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdC1nZW5pZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2MDgwMDAwLCJleHAiOjE5MzE2NDAwMDB9.fake-key-for-dev';

// Ensure we always have string values (not undefined)
const url = supabaseUrl || defaultUrl;
const key = supabaseAnonKey || defaultKey;

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'tft-genie-auth-storage',
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Add a simple helper to check if we're using the default/dummy credentials
export const isUsingDefaultCredentials = () => {
  return !supabaseUrl || !supabaseAnonKey;
};
