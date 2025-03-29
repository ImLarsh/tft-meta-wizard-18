import React, { createContext, useContext, useState, useEffect } from 'react';
import { TFTComp } from '@/data/comps';
import { ChampionTraitMap } from '@/types/champion';
import { toast } from '@/components/ui/use-toast';

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
  addComp: (comp: TFTComp) => void;
  updateComp: (comp: TFTComp) => void;
  removeComp: (id: string) => void;
  getComp: (id: string) => TFTComp | undefined;
  addTraitMapping: (setKey: string, setName: string, traits: string[], championTraits: ChampionTraitMap) => void;
  updateTraitMapping: (setKey: string, setName: string, traits: string[], championTraits: ChampionTraitMap) => void;
  removeTraitMapping: (setKey: string) => void;
}

const CompsContext = createContext<CompsContextType | undefined>(undefined);

export const CompsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for comps and trait mappings, starting with empty arrays/objects
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [traitMappings, setTraitMappings] = useState<TraitMappings>({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedComps = localStorage.getItem('tftComps');
    const savedTraitMappings = localStorage.getItem('tftTraitMappings');
    
    if (savedComps) {
      try {
        setComps(JSON.parse(savedComps));
      } catch (error) {
        console.error('Error parsing saved comps:', error);
        setComps([]);
      }
    }
    
    if (savedTraitMappings) {
      try {
        setTraitMappings(JSON.parse(savedTraitMappings));
      } catch (error) {
        console.error('Error parsing saved trait mappings:', error);
        setTraitMappings({});
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tftComps', JSON.stringify(comps));
  }, [comps]);
  
  useEffect(() => {
    localStorage.setItem('tftTraitMappings', JSON.stringify(traitMappings));
  }, [traitMappings]);

  // Add a new comp
  const addComp = (comp: TFTComp) => {
    setComps(prevComps => [...prevComps, comp]);
  };

  // Update an existing comp
  const updateComp = (updatedComp: TFTComp) => {
    setComps(prevComps => 
      prevComps.map(comp => 
        comp.id === updatedComp.id ? updatedComp : comp
      )
    );
  };

  // Remove a comp
  const removeComp = (id: string) => {
    setComps(prevComps => prevComps.filter(comp => comp.id !== id));
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
        removeTraitMapping
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
