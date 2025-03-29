
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iwetswbtmiankbgjmsxz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZXRzd2J0bWlhbmtiZ2ptc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMzIxNTYsImV4cCI6MjA1ODgwODE1Nn0.jmE5Nm5_5UYpZRdHQZxPCeXJlI6aCEpiyK0QYgeHAoU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the application is using the default credentials
 * This helps identify when users need to configure their own Supabase project
 */
export const isUsingDefaultCredentials = (): boolean => {
  // The default credentials are the ones in this file
  // In a real app, users would replace these with their own
  return SUPABASE_URL === "https://iwetswbtmiankbgjmsxz.supabase.co";
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
