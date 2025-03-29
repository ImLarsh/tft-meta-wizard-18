
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TFTComp } from '@/data/comps';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { ChampionTraitMap } from '@/types/champion';
import { fetchCompsFromSupabase, fetchTraitMappingsFromSupabase, saveCompsToSupabase, saveTraitMappingsToSupabase } from '@/utils/supabaseUtils';

// Define the saved structure for trait mappings
interface TraitMapping {
  name: string;
  traits: string[];
  championTraits: Record<string, string[]>;
  championCosts: Record<string, number>;
}

// Define the context type
interface CompsContextType {
  comps: TFTComp[];
  addComp: (comp: TFTComp) => void;
  updateComp: (comp: TFTComp) => void;
  removeComp: (compId: string) => void;
  getCompById: (compId: string) => TFTComp | undefined;
  traitMappings: Record<string, TraitMapping>;
  saveTraitMappings: (mappings: Record<string, TraitMapping>) => void;
  loading: boolean;
}

// Create the context with a default value
const CompsContext = createContext<CompsContextType | undefined>(undefined);

// Custom hook to use the context
export const useComps = () => {
  const context = useContext(CompsContext);
  if (context === undefined) {
    throw new Error('useComps must be used within a CompsProvider');
  }
  return context;
};

// CompsProvider component
export const CompsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [traitMappings, setTraitMappings] = useState<Record<string, TraitMapping>>({
    'Set 10': {
      name: 'Remix Rumble',
      traits: [
        'Big Shot', 'Crowd Diver', 'Dazzler', 'Edgelord', 'Executioner', 
        'Guardian', 'Heartsteel', 'Hyperpop', 'Jazz', 'K/DA', 'Pentakill', 
        'Sentinel', 'Spellweaver', 'True Damage'
      ],
      championTraits: {
        'Ahri': ['K/DA', 'Spellweaver'],
        'Akali': ['K/DA', 'True Damage', 'Executioner'],
        'Amumu': ['Pentakill', 'Guardian'],
        'Annie': ['Pentakill', 'Spellweaver'],
        'Bard': ['Jazz', 'Dazzler'],
        'Caitlyn': ['Jazz', 'Big Shot'],
        'Corki': ['Hyperpop', 'Big Shot'],
        'Ekko': ['True Damage', 'Sentinel'],
        'Evelynn': ['K/DA', 'Crowd Diver'],
        'Gragas': ['Hyperpop', 'Guardian'],
        'Gwen': ['Pentakill', 'Sentinel'],
        'Illaoi': ['Pentakill', 'Sentinel', 'Guardian'],
        'Jax': ['Edgelord', 'Heartsteel', 'Crowd Diver'],
        'Jhin': ['Jazz', 'Big Shot'],
        'Jinx': ['Pentakill', 'Crowd Diver'],
        'Kaisa': ['K/DA', 'Big Shot'],
        'Karthus': ['Pentakill', 'Dazzler'],
        'Kayle': ['Pentakill', 'Crowd Diver'],
        'Kayn': ['Heartsteel', 'Edgelord'],
        'Kennen': ['True Damage', 'Guardian'],
        'Lillia': ['K/DA', 'Sentinel'],
        'Lulu': ['Hyperpop', 'Spellweaver'],
        'Lux': ['Heartsteel', 'Spellweaver'],
        'Miss Fortune': ['Jazz', 'Big Shot', 'Spellweaver'],
        'Mordekaiser': ['Pentakill', 'Guardian'],
        'Nami': ['Jazz', 'Dazzler'],
        'Neeko': ['K/DA', 'Guardian'],
        'Pantheon': ['Pentakill', 'Guardian'],
        'Poppy': ['Heartsteel', 'Guardian'],
        'Qiyana': ['True Damage', 'Crowd Diver'],
        'Riven': ['Heartsteel', 'Edgelord'],
        'Samira': ['Jazz', 'Big Shot', 'Executioner'],
        'Seraphine': ['K/DA', 'Spellweaver'],
        'Sett': ['Heartsteel', 'Sentinel', 'Guardian'],
        'Sona': ['Hyperpop', 'Dazzler'],
        'Tahm Kench': ['Jazz', 'Guardian'],
        'Taric': ['Hyperpop', 'Sentinel'],
        'Twitch': ['Hyperpop', 'Executioner'],
        'Urgot': ['Jazz', 'Sentinel', 'Executioner'],
        'Vex': ['Edgelord', 'Emo', 'Spellweaver'],
        'Vi': ['True Damage', 'Sentinel'],
        'Viego': ['Pentakill', 'Edgelord'],
        'Yasuo': ['True Damage', 'Edgelord', 'Executioner'],
        'Yone': ['Heartsteel', 'Edgelord'],
        'Yorick': ['Pentakill', 'Guardian'],
        'Zac': ['Hyperpop', 'Guardian'],
        'Zed': ['Edgelord', 'Executioner'],
      },
      championCosts: {
        'Ahri': 4, 'Akali': 5, 'Amumu': 2, 'Annie': 1, 'Bard': 2, 'Caitlyn': 3,
        'Corki': 1, 'Ekko': 4, 'Evelynn': 2, 'Gragas': 1, 'Gwen': 3, 'Illaoi': 3,
        'Jax': 1, 'Jhin': 4, 'Jinx': 4, 'Kaisa': 3, 'Karthus': 3, 'Kayle': 3,
        'Kayn': 4, 'Kennen': 2, 'Lillia': 1, 'Lulu': 3, 'Lux': 2, 'Miss Fortune': 5,
        'Mordekaiser': 4, 'Nami': 1, 'Neeko': 1, 'Pantheon': 1, 'Poppy': 1, 'Qiyana': 3,
        'Riven': 2, 'Samira': 4, 'Seraphine': 3, 'Sett': 4, 'Sona': 5, 'Tahm Kench': 2,
        'Taric': 3, 'Twitch': 2, 'Urgot': 4, 'Vex': 3, 'Vi': 2, 'Viego': 5,
        'Yasuo': 5, 'Yone': 3, 'Yorick': 5, 'Zac': 3, 'Zed': 2
      }
    }
  });
  const [loading, setLoading] = useState(true);

  // Load comps and trait mappings from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Try to load from Supabase first
        const supabaseTraitMappings = await fetchTraitMappingsFromSupabase();
        if (Object.keys(supabaseTraitMappings).length > 0) {
          setTraitMappings(supabaseTraitMappings);
          console.log('Trait mappings loaded from Supabase');
        } else {
          // If no data in Supabase, try loading from localStorage
          const savedTraitMappings = localStorage.getItem('tftTraitMappings');
          if (savedTraitMappings) {
            try {
              const parsedMappings = JSON.parse(savedTraitMappings);
              setTraitMappings(parsedMappings);
              console.log('Trait mappings loaded from localStorage');
              
              // Save to Supabase for future use
              await saveTraitMappingsToSupabase(parsedMappings);
            } catch (error) {
              console.error('Error parsing saved trait mappings:', error);
            }
          }
        }
        
        // Try to load comps from Supabase
        const supabaseComps = await fetchCompsFromSupabase();
        if (supabaseComps.length > 0) {
          setComps(supabaseComps);
          console.log('Comps loaded from Supabase');
        } else {
          // If no data in Supabase, try loading from localStorage
          const savedComps = localStorage.getItem('tftComps');
          if (savedComps) {
            try {
              const parsedComps = JSON.parse(savedComps);
              setComps(parsedComps);
              console.log('Comps loaded from localStorage');
              
              // Save to Supabase for future use
              await saveCompsToSupabase(parsedComps);
            } catch (error) {
              console.error('Error parsing saved comps:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save comps to localStorage and Supabase whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tftComps', JSON.stringify(comps));
      saveCompsToSupabase(comps).catch(err => {
        console.error('Error saving comps to Supabase:', err);
      });
    }
  }, [comps, loading]);

  // Add a new comp
  const addComp = (comp: TFTComp) => {
    // Ensure the comp has an ID
    const compWithId = comp.id ? comp : { ...comp, id: uuidv4() };
    setComps([...comps, compWithId]);
    toast({
      title: "Comp Added",
      description: `"${comp.name}" has been successfully added.`,
    });
  };

  // Update an existing comp
  const updateComp = (updatedComp: TFTComp) => {
    setComps(comps.map(comp => comp.id === updatedComp.id ? updatedComp : comp));
    toast({
      title: "Comp Updated",
      description: `"${updatedComp.name}" has been successfully updated.`,
    });
  };

  // Remove a comp by ID
  const removeComp = (compId: string) => {
    setComps(comps.filter(comp => comp.id !== compId));
  };

  // Get a comp by ID
  const getCompById = (compId: string) => {
    return comps.find(comp => comp.id === compId);
  };

  // Save trait mappings
  const saveTraitMappings = (mappings: Record<string, TraitMapping>) => {
    setTraitMappings(mappings);
    localStorage.setItem('tftTraitMappings', JSON.stringify(mappings));
    saveTraitMappingsToSupabase(mappings).catch(err => {
      console.error('Error saving trait mappings to Supabase:', err);
    });
  };

  return (
    <CompsContext.Provider value={{ 
      comps, 
      addComp, 
      updateComp, 
      removeComp, 
      getCompById,
      traitMappings,
      saveTraitMappings,
      loading
    }}>
      {children}
    </CompsContext.Provider>
  );
};
