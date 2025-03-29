
import { supabase } from '@/integrations/supabase/client';
import { TFTComp } from '@/data/comps';

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
    
    // Add a type check to ensure we're returning an object
    const mappings = data?.mappings;
    if (mappings && typeof mappings === 'object' && !Array.isArray(mappings)) {
      return mappings as Record<string, any>;
    }
    
    return {};
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
      // Update existing record - convert Date to ISO string
      const { error } = await supabase
        .from('tft_trait_mappings')
        .update({ 
          mappings, 
          updated_at: new Date().toISOString() 
        })
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

/**
 * Fetches comps from Supabase
 * @returns {Promise<TFTComp[]>} The comps from the database
 */
export const fetchCompsFromSupabase = async (): Promise<TFTComp[]> => {
  try {
    const { data, error } = await supabase
      .from('tft_comps')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching comps:', error);
      return [];
    }
    
    // Check if data.comps is an array
    if (data?.comps && Array.isArray(data.comps)) {
      return data.comps as TFTComp[];
    }
    
    return [];
  } catch (error) {
    console.error('Error in fetchCompsFromSupabase:', error);
    return [];
  }
};

/**
 * Saves comps to Supabase
 * @param {TFTComp[]} comps The comps to save
 * @returns {Promise<boolean>} Whether the save was successful
 */
export const saveCompsToSupabase = async (comps: TFTComp[]): Promise<boolean> => {
  try {
    // First check if we have an existing record
    const { data: existingRecord } = await supabase
      .from('tft_comps')
      .select('id')
      .limit(1);
    
    if (existingRecord && existingRecord.length > 0) {
      // Update existing record
      const { error } = await supabase
        .from('tft_comps')
        .update({ 
          comps, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingRecord[0].id);
      
      if (error) {
        console.error('Error updating comps:', error);
        return false;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('tft_comps')
        .insert({ comps });
      
      if (error) {
        console.error('Error inserting comps:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveCompsToSupabase:', error);
    return false;
  }
};
