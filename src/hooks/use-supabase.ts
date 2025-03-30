
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TFTComp } from '@/data/comps';
import { toast } from '@/components/ui/use-toast';
import { 
  fetchCompsFromSupabase, 
  fetchTraitMappingsFromSupabase 
} from '@/utils/supabaseUtils';

export const useSupabase = () => {
  return { supabase };
};

export const useSupabaseData = () => {
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [traitMappings, setTraitMappings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading data from Supabase...");
      
      // Fetch trait mappings
      const mappings = await fetchTraitMappingsFromSupabase();
      if (Object.keys(mappings).length > 0) {
        setTraitMappings(mappings);
        console.log('Trait mappings loaded from Supabase:', Object.keys(mappings).length);
      } else {
        console.log('No trait mappings found in Supabase');
      }
      
      // Fetch comps
      const tftComps = await fetchCompsFromSupabase();
      if (tftComps.length > 0) {
        setComps(tftComps);
        console.log('Comps loaded from Supabase:', tftComps.length);
      } else {
        console.log('No comps found in Supabase');
      }
      
      setError(null);
      setIsInitialized(true);
    } catch (err) {
      console.error('Error loading data from Supabase:', err);
      setError('Failed to load data from Supabase');
      toast({
        title: 'Error',
        description: 'Failed to load data from Supabase. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only load data once to prevent constant refreshes
    if (isInitialized) return;
    loadData();
  }, [isInitialized, loadData]);

  // Add a refresh function to reload data when needed
  const refreshData = async () => {
    if (loading) return;
    await loadData();
  };

  return { comps, traitMappings, loading, error, refreshData };
};
