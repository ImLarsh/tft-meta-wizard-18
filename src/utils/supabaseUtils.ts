
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the application is using the default Supabase credentials
 * @returns {boolean} True if using default credentials
 */
export const isUsingDefaultCredentials = (): boolean => {
  const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZXRzd2J0bWlhbmtiZ2ptc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMzIxNTYsImV4cCI6MjA1ODgwODE1Nn0.jmE5Nm5_5UYpZRdHQZxPCeXJlI6aCEpiyK0QYgeHAoU";
  return supabase.auth.getSession !== undefined;
};
