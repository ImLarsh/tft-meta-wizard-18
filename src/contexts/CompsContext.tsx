
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TFTComp } from '@/data/comps';
import { ChampionTraitMap } from '@/types/champion';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// TraitMappings interface to define the structure of traits data
interface TraitMappings {
  [setKey: string]: {
    name: string;
    traits: string[];
    championTraits: ChampionTraitMap;
  };
}

// CompsContext interface
interface CompsContextType {
  comps: TFTComp[];
  traitMappings: TraitMappings;
  setTraitMappings: React.Dispatch<React.SetStateAction<TraitMappings>>;
  addComp: (comp: TFTComp) => Promise<void>;
  updateComp: (comp: TFTComp) => Promise<void>;
  removeComp: (id: string) => Promise<void>;
  getComp: (id: string) => TFTComp | undefined;
  addTraitMapping: (setKey: string, setName: string, traits: string[], championTraits: ChampionTraitMap) => void;
  updateTraitMapping: (setKey: string, setName: string, traits: string[], championTraits: ChampionTraitMap) => void;
  removeTraitMapping: (setKey: string) => void;
  loading: boolean;
}

const CompsContext = createContext<CompsContextType | undefined>(undefined);

export const CompsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for comps and trait mappings, starting with empty arrays/objects
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [traitMappings, setTraitMappings] = useState<TraitMappings>({});
  const [loading, setLoading] = useState(true);

  // Load data from Supabase and localStorage on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch comps from Supabase
        const { data: compsData, error: compsError } = await supabase
          .from('tft_comps')
          .select('*')
          .order('created_at', { ascending: false })
          .single();
        
        if (compsError && compsError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching comps:', compsError);
          toast({
            title: "Error",
            description: "Could not load compositions from the database.",
            variant: "destructive",
          });
        }
        
        if (compsData) {
          // Parse the JSON data from Supabase
          const jsonComps = compsData.comps as Json;
          if (Array.isArray(jsonComps)) {
            // Type assertion to convert Json[] to TFTComp[]
            const parsedComps = jsonComps as unknown as TFTComp[];
            setComps(parsedComps);
          } else {
            setComps([]);
          }
        } else {
          // If no data in Supabase, try to load from localStorage as fallback
          const savedComps = localStorage.getItem('tftComps');
          
          if (savedComps) {
            try {
              const parsedComps = JSON.parse(savedComps) as TFTComp[];
              setComps(parsedComps);
              
              // Save the localStorage comps to Supabase
              await supabase
                .from('tft_comps')
                .insert({ comps: parsedComps as unknown as Json })
                .select();
              
              // Clear localStorage now that data is in Supabase
              localStorage.removeItem('tftComps');
            } catch (error) {
              console.error('Error parsing saved comps:', error);
              setComps([]);
            }
          } else {
            // Initialize with empty array if no data available
            await supabase
              .from('tft_comps')
              .insert({ comps: [] as unknown as Json })
              .select();
          }
        }
        
        // Fetch trait mappings
        const { data: mappingsData, error: mappingsError } = await supabase
          .from('tft_trait_mappings')
          .select('*')
          .order('created_at', { ascending: false })
          .single();
        
        if (mappingsError && mappingsError.code !== 'PGRST116') {
          console.error('Error fetching trait mappings:', mappingsError);
        }
        
        if (mappingsData) {
          // Parse the JSON data from Supabase
          const jsonMappings = mappingsData.mappings as Json;
          if (typeof jsonMappings === 'object' && jsonMappings !== null && !Array.isArray(jsonMappings)) {
            // Type assertion to convert Json to TraitMappings
            const parsedMappings = jsonMappings as unknown as TraitMappings;
            setTraitMappings(parsedMappings);
          } else {
            setTraitMappings({});
          }
        } else {
          // If no data in Supabase, try to load from localStorage as fallback
          const savedTraitMappings = localStorage.getItem('tftTraitMappings');
          
          if (savedTraitMappings) {
            try {
              const parsedMappings = JSON.parse(savedTraitMappings) as TraitMappings;
              setTraitMappings(parsedMappings);
              
              // Save the localStorage mappings to Supabase
              await supabase
                .from('tft_trait_mappings')
                .insert({ mappings: parsedMappings as unknown as Json })
                .select();
              
              // Clear localStorage now that data is in Supabase
              localStorage.removeItem('tftTraitMappings');
            } catch (error) {
              console.error('Error parsing saved trait mappings:', error);
              setTraitMappings({});
            }
          } else {
            // Initialize with empty object if no data available
            await supabase
              .from('tft_trait_mappings')
              .insert({ mappings: {} as unknown as Json })
              .select();
          }
        }
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
        toast({
          title: "Error",
          description: "Could not connect to the database.",
          variant: "destructive",
        });
        
        // Try to load from localStorage as fallback
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    // Fallback function to load from localStorage if Supabase fails
    const loadFromLocalStorage = () => {
      const savedComps = localStorage.getItem('tftComps');
      const savedTraitMappings = localStorage.getItem('tftTraitMappings');
      
      if (savedComps) {
        try {
          setComps(JSON.parse(savedComps) as TFTComp[]);
        } catch (error) {
          console.error('Error parsing saved comps:', error);
          setComps([]);
        }
      }
      
      if (savedTraitMappings) {
        try {
          setTraitMappings(JSON.parse(savedTraitMappings) as TraitMappings);
        } catch (error) {
          console.error('Error parsing saved trait mappings:', error);
          setTraitMappings({});
        }
      }
    };
    
    fetchData();
  }, []);

  // Save comps to Supabase whenever it changes
  useEffect(() => {
    const saveCompsToSupabase = async () => {
      if (loading || comps.length === 0) return;
      
      try {
        // Check if record exists
        const { data: existingData, error: checkError } = await supabase
          .from('tft_comps')
          .select('id')
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking for existing comps:', checkError);
          return;
        }
        
        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('tft_comps')
            .update({ comps: comps as unknown as Json })
            .eq('id', existingData.id);
          
          if (updateError) {
            console.error('Error updating comps:', updateError);
            // Fallback to localStorage if Supabase fails
            localStorage.setItem('tftComps', JSON.stringify(comps));
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('tft_comps')
            .insert({ comps: comps as unknown as Json })
            .select();
          
          if (insertError) {
            console.error('Error inserting comps:', insertError);
            // Fallback to localStorage if Supabase fails
            localStorage.setItem('tftComps', JSON.stringify(comps));
          }
        }
      } catch (error) {
        console.error('Error saving comps to Supabase:', error);
        // Fallback to localStorage if Supabase fails
        localStorage.setItem('tftComps', JSON.stringify(comps));
      }
    };
    
    saveCompsToSupabase();
  }, [comps, loading]);

  // Save trait mappings to Supabase whenever it changes
  useEffect(() => {
    const saveTraitMappingsToSupabase = async () => {
      if (loading || Object.keys(traitMappings).length === 0) return;
      
      try {
        // Check if record exists
        const { data: existingData, error: checkError } = await supabase
          .from('tft_trait_mappings')
          .select('id')
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking for existing trait mappings:', checkError);
          return;
        }
        
        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('tft_trait_mappings')
            .update({ mappings: traitMappings as unknown as Json })
            .eq('id', existingData.id);
          
          if (updateError) {
            console.error('Error updating trait mappings:', updateError);
            // Fallback to localStorage if Supabase fails
            localStorage.setItem('tftTraitMappings', JSON.stringify(traitMappings));
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('tft_trait_mappings')
            .insert({ mappings: traitMappings as unknown as Json })
            .select();
          
          if (insertError) {
            console.error('Error inserting trait mappings:', insertError);
            // Fallback to localStorage if Supabase fails
            localStorage.setItem('tftTraitMappings', JSON.stringify(traitMappings));
          }
        }
      } catch (error) {
        console.error('Error saving trait mappings to Supabase:', error);
        // Fallback to localStorage if Supabase fails
        localStorage.setItem('tftTraitMappings', JSON.stringify(traitMappings));
      }
    };
    
    saveTraitMappingsToSupabase();
  }, [traitMappings, loading]);

  // Add a new comp
  const addComp = async (comp: TFTComp) => {
    const updatedComps = [...comps, comp];
    setComps(updatedComps);
    
    toast({
      title: "Success",
      description: "Your composition has been saved and shared publicly!",
    });
  };

  // Update an existing comp
  const updateComp = async (updatedComp: TFTComp) => {
    const updatedComps = comps.map(comp => 
      comp.id === updatedComp.id ? updatedComp : comp
    );
    setComps(updatedComps);
    
    toast({
      title: "Success",
      description: "Your composition has been updated successfully!",
    });
  };

  // Remove a comp
  const removeComp = async (id: string) => {
    const updatedComps = comps.filter(comp => comp.id !== id);
    setComps(updatedComps);
    
    toast({
      title: "Success",
      description: "The composition has been removed successfully.",
    });
  };

  // Get a specific comp by ID
  const getComp = (id: string) => {
    return comps.find(comp => comp.id === id);
  };

  // Add a new trait mapping
  const addTraitMapping = (setKey: string, setName: string, traits: string[], championTraits: ChampionTraitMap) => {
    setTraitMappings(prev => ({
      ...prev,
      [setKey]: {
        name: setName,
        traits,
        championTraits
      }
    }));
    
    toast({
      title: "Set Added",
      description: `${setName} has been added successfully.`,
    });
  };

  // Update an existing trait mapping
  const updateTraitMapping = (setKey: string, setName: string, traits: string[], championTraits: ChampionTraitMap) => {
    setTraitMappings(prev => ({
      ...prev,
      [setKey]: {
        name: setName,
        traits,
        championTraits
      }
    }));
    
    toast({
      title: "Set Updated",
      description: `${setName} has been updated successfully.`,
    });
  };

  // Remove a trait mapping
  const removeTraitMapping = (setKey: string) => {
    // Create a new object without the specified key
    const { [setKey]: removed, ...rest } = traitMappings;
    setTraitMappings(rest);
    
    // Check if any comps use this set and update them
    const compsUsingSet = comps.filter(comp => comp.tftVersion === setKey);
    if (compsUsingSet.length > 0) {
      toast({
        title: "Warning",
        description: `Removed a set that was used by ${compsUsingSet.length} compositions.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Set Removed",
        description: "The set has been removed successfully.",
      });
    }
  };

  return (
    <CompsContext.Provider
      value={{
        comps,
        traitMappings,
        setTraitMappings,
        addComp,
        updateComp,
        removeComp,
        getComp,
        addTraitMapping,
        updateTraitMapping,
        removeTraitMapping,
        loading
      }}
    >
      {children}
    </CompsContext.Provider>
  );
};

export const useComps = () => {
  const context = useContext(CompsContext);
  if (context === undefined) {
    throw new Error('useComps must be used within a CompsProvider');
  }
  return context;
};
