
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iwetswbtmiankbgjmsxz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZXRzd2J0bWlhbmtiZ2ptc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMzIxNTYsImV4cCI6MjA1ODgwODE1Nn0.jmE5Nm5_5UYpZRdHQZxPCeXJlI6aCEpiyK0QYgeHAoU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Get the current URL for proper redirect handling
const getRedirectURL = () => {
  try {
    // In browser environments
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      return `${url.protocol}//${url.host}/auth/callback`;
    }
  } catch (error) {
    console.error('Error creating redirect URL:', error);
  }
  // Fallback to relative path if URL can't be determined
  return '/auth/callback';
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true,
    redirectTo: getRedirectURL(),
  }
});

// Helper function to check if default credentials are being used
export const isUsingDefaultCredentials = (): boolean => {
  // This is just a basic check to see if we're using the project-specific URL
  // In a real application, you might want a more robust check
  return false; // Since we have actual credentials from your Supabase project, this is false
};

