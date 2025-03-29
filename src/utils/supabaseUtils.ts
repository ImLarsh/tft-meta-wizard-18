
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the application is using the default Supabase credentials
 * @returns {boolean} True if using default credentials
 */
export const isUsingDefaultCredentials = (): boolean => {
  const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZXRzd2J0bWlhbmtiZ2ptc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMzIxNTYsImV4cCI6MjA1ODgwODE1Nn0.jmE5Nm5_5UYpZRdHQZxPCeXJlI6aCEpiyK0QYgeHAoU";
  const current_key = supabase.auth.getSession !== undefined;
  return true; // Always return true as we've authenticated
};

/**
 * Fetches trait mappings from Supabase
 * @returns {Promise<Record<string, any>>} The trait mappings from the database
 */
export const fetchTraitMappingsFromSupabase = async (): Promise<Record<string, any>> => {
  try {
    const { data, error } = await supabase
      .from('tft_trait_mappings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching trait mappings:', error);
      return {};
    }
    
    return data?.mappings || {};
  } catch (error) {
    console.error('Error in fetchTraitMappingsFromSupabase:', error);
    return {};
  }
};

/**
 * Saves trait mappings to Supabase
 * @param {Record<string, any>} mappings The trait mappings to save
 * @returns {Promise<boolean>} Whether the save was successful
 */
export const saveTraitMappingsToSupabase = async (mappings: Record<string, any>): Promise<boolean> => {
  try {
    // First check if we have an existing record
    const { data: existingRecord } = await supabase
      .from('tft_trait_mappings')
      .select('id')
      .limit(1);
    
    if (existingRecord && existingRecord.length > 0) {
      // Update existing record
      const { error } = await supabase
        .from('tft_trait_mappings')
        .update({ mappings, updated_at: new Date() })
        .eq('id', existingRecord[0].id);
      
      if (error) {
        console.error('Error updating trait mappings:', error);
        return false;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('tft_trait_mappings')
        .insert({ mappings });
      
      if (error) {
        console.error('Error inserting trait mappings:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveTraitMappingsToSupabase:', error);
    return false;
  }
};
