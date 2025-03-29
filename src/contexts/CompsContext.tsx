import React, { createContext, useContext, useState, useEffect } from 'react';
import { TFTComp, Champion, Trait } from '@/data/comps';
import { ChampionTraitMap } from '@/types/champion';
import { useSupabase } from '@/hooks/use-supabase';
import { 
  fetchTraitMappingsFromSupabase, 
  saveTraitMappingsToSupabase,
  fetchCompsFromSupabase,
  saveCompsToSupabase
} from '@/utils/supabaseUtils';
import { toast } from '@/components/ui/use-toast';

interface ChampionSet {
  name: string;
  traits: string[];
  championTraits: Record<string, string[]>;
}

interface CompsContextType {
  comps: TFTComp[];
  addComp: (comp: TFTComp) => void;
  updateComp: (comp: TFTComp) => void; 
  removeComp: (id: string) => void;
  traitMappings: Record<string, ChampionSet>;
  addTraitMappings: (setName: string, mapping: ChampionSet) => void;
  removeTraitMappings: (setName: string) => void;
  addTraitMapping: (setKey: string, setName: string, traits: string[], championTraits: Record<string, string[]>) => void;
  updateTraitMapping: (setKey: string, setName: string, traits: string[], championTraits: Record<string, string[]>) => void;
  removeTraitMapping: (setKey: string) => void;
  loading: boolean;
}

const CompsContext = createContext<CompsContextType | undefined>(undefined);

interface CompsProviderProps {
  children: React.ReactNode;
}

export const CompsProvider: React.FC<CompsProviderProps> = ({ children }) => {
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [traitMappings, setTraitMappings] = useState<Record<string, ChampionSet>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const mappingsFromSupabase = await fetchTraitMappingsFromSupabase();
        
        if (Object.keys(mappingsFromSupabase).length > 0) {
          setTraitMappings(mappingsFromSupabase);
          console.log('Trait mappings loaded from Supabase:', mappingsFromSupabase);
        } else {
          const savedMappings = localStorage.getItem('tftTraitMappings');
          if (savedMappings) {
            const parsedMappings = JSON.parse(savedMappings);
            setTraitMappings(parsedMappings);
            
            await saveTraitMappingsToSupabase(parsedMappings);
            console.log('Trait mappings loaded from localStorage and saved to Supabase');
          }
        }
        
        const compsFromSupabase = await fetchCompsFromSupabase();
        
        if (compsFromSupabase.length > 0) {
          setComps(compsFromSupabase);
          console.log('Comps loaded from Supabase:', compsFromSupabase);
        } else {
          const savedComps = localStorage.getItem('tftComps');
          if (savedComps) {
            const parsedComps = JSON.parse(savedComps);
            setComps(parsedComps);
            
            await saveCompsToSupabase(parsedComps);
            console.log('Comps loaded from localStorage and saved to Supabase');
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        
        try {
          const savedMappings = localStorage.getItem('tftTraitMappings');
          if (savedMappings) {
            setTraitMappings(JSON.parse(savedMappings));
          }
          
          const savedComps = localStorage.getItem('tftComps');
          if (savedComps) {
            setComps(JSON.parse(savedComps));
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!loading && comps.length > 0) {
      try {
        localStorage.setItem('tftComps', JSON.stringify(comps));
        
        saveCompsToSupabase(comps).then(success => {
          if (!success) {
            console.warn('Failed to save comps to Supabase, but saved to localStorage');
          }
        });
      } catch (error) {
        console.error('Error saving comps:', error);
      }
    }
  }, [comps, loading]);

  useEffect(() => {
    if (Object.keys(traitMappings).length > 0 && !loading) {
      try {
        localStorage.setItem('tftTraitMappings', JSON.stringify(traitMappings));
        
        saveTraitMappingsToSupabase(traitMappings).then(success => {
          if (!success) {
            console.warn('Failed to save trait mappings to Supabase, but saved to localStorage');
          }
        });
      } catch (error) {
        console.error('Error saving trait mappings:', error);
      }
    }
  }, [traitMappings, loading]);

  const addComp = (comp: TFTComp) => {
    setComps(prevComps => {
      const existingIndex = prevComps.findIndex(c => c.id === comp.id);
      if (existingIndex >= 0) {
        const updatedComps = [...prevComps];
        updatedComps[existingIndex] = comp;
        return updatedComps;
      } else {
        return [...prevComps, comp];
      }
    });
  };

  const updateComp = (comp: TFTComp) => {
    setComps(prevComps => 
      prevComps.map(c => c.id === comp.id ? comp : c)
    );
  };

  const removeComp = (id: string) => {
    setComps(prevComps => prevComps.filter(comp => comp.id !== id));
  };

  const addTraitMappings = (setName: string, mapping: ChampionSet) => {
    setTraitMappings(prev => ({
      ...prev,
      [setName]: mapping,
    }));
  };

  const removeTraitMappings = (setName: string) => {
    setTraitMappings(prev => {
      const newMappings = {...prev};
      delete newMappings[setName];
      return newMappings;
    });
  };

  const addTraitMapping = (setKey: string, setName: string, traits: string[], championTraits: Record<string, string[]>) => {
    setTraitMappings(prev => {
      const newMappings = {
        ...prev,
        [setKey]: {
          name: setName,
          traits: traits,
          championTraits: championTraits
        }
      };
      return newMappings;
    });
    
    toast({
      title: "Set Added",
      description: `${setName} has been added successfully`,
    });
  };

  const updateTraitMapping = (setKey: string, setName: string, traits: string[], championTraits: Record<string, string[]>) => {
    setTraitMappings(prev => ({
      ...prev,
      [setKey]: {
        name: setName,
        traits: traits,
        championTraits: championTraits
      }
    }));
    
    toast({
      title: "Set Updated",
      description: `${setName} has been updated successfully`,
    });
  };

  const removeTraitMapping = (setKey: string) => {
    setTraitMappings(prev => {
      const newMappings = {...prev};
      delete newMappings[setKey];
      
      toast({
        title: "Set Removed",
        description: `Set has been removed successfully`,
      });
      
      return newMappings;
    });
  };

  return (
    <CompsContext.Provider
      value={{
        comps,
        addComp,
        updateComp,
        removeComp,
        traitMappings,
        addTraitMappings,
        removeTraitMappings,
        addTraitMapping,
        updateTraitMapping,
        removeTraitMapping,
        loading,
      }}
    >
      {children}
    </CompsContext.Provider>
  );
};

export const useComps = (): CompsContextType => {
  const context = useContext(CompsContext);
  if (context === undefined) {
    throw new Error('useComps must be used within a CompsProvider');
  }
  return context;
};
