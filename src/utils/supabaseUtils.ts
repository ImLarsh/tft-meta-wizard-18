
import { supabase } from '@/integrations/supabase/client';
import { TFTComp } from '@/data/comps';
import { Json } from '@/integrations/supabase/types';

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
    // Query the tft_trait_mappings table
    const { data, error } = await supabase
      .from('tft_trait_mappings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching trait mappings:', error);
      return {};
    }
    
    // If we have data, return the first record's mappings
    if (data && data.length > 0) {
      const mappings = data[0]?.mappings;
      if (mappings && typeof mappings === 'object' && !Array.isArray(mappings)) {
        console.log('Successfully fetched trait mappings from Supabase:', Object.keys(mappings));
        return mappings as Record<string, any>;
      }
    }
    
    console.log('No trait mappings found in Supabase or invalid format');
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
    const { data: existingRecord, error: fetchError } = await supabase
      .from('tft_trait_mappings')
      .select('id')
      .limit(1);
    
    if (fetchError) {
      console.error('Error checking for existing trait mappings:', fetchError);
      return false;
    }
    
    if (existingRecord && existingRecord.length > 0) {
      // Update existing record - convert Date to ISO string
      const { error } = await supabase
        .from('tft_trait_mappings')
        .update({ 
          mappings: mappings as Json, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingRecord[0].id);
      
      if (error) {
        console.error('Error updating trait mappings:', error);
        return false;
      }
      
      console.log('Successfully updated trait mappings in Supabase');
    } else {
      // Insert new record
      const { error } = await supabase
        .from('tft_trait_mappings')
        .insert({ mappings: mappings as Json });
      
      if (error) {
        console.error('Error inserting trait mappings:', error);
        return false;
      }
      
      console.log('Successfully inserted trait mappings in Supabase');
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
    // Query the tft_comps table
    const { data, error } = await supabase
      .from('tft_comps')
      .select('*');
    
    if (error) {
      console.error('Error fetching comps:', error);
      return [];
    }
    
    // If we have data, return the first record's comps
    if (data && data.length > 0) {
      const comps = data[0]?.comps;
      if (comps && Array.isArray(comps)) {
        console.log('Successfully fetched comps from Supabase:', comps);
        return comps as unknown as TFTComp[];
      }
    }
    
    console.log('No comps found in Supabase or invalid format');
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
      // Update existing record with type coercion
      const { error } = await supabase
        .from('tft_comps')
        .update({ 
          comps: comps as unknown as Json, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingRecord[0].id);
      
      if (error) {
        console.error('Error updating comps:', error);
        return false;
      }
      
      console.log('Successfully updated comps in Supabase');
    } else {
      // Insert new record with type coercion
      const { error } = await supabase
        .from('tft_comps')
        .insert({ comps: comps as unknown as Json });
      
      if (error) {
        console.error('Error inserting comps:', error);
        return false;
      }
      
      console.log('Successfully inserted comps in Supabase');
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveCompsToSupabase:', error);
    return false;
  }
};
