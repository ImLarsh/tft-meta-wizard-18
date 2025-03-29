
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TFTComp, Champion, Trait } from '@/data/comps';
import { ChampionTraitMap, ChampionSet } from '@/types/champion';
import { useSupabase } from '@/hooks/use-supabase';

// Define the context type
interface CompsContextType {
  comps: TFTComp[];
  addComp: (comp: TFTComp) => void;
  updateComp: (comp: TFTComp) => void; 
  removeComp: (id: string) => void;
  traitMappings: Record<string, ChampionSet>;
  addTraitMappings: (setName: string, mapping: ChampionSet) => void;
  removeTraitMappings: (setName: string) => void;
}

// Create the context
const CompsContext = createContext<CompsContextType | undefined>(undefined);

// Define the provider props
interface CompsProviderProps {
  children: React.ReactNode;
}

export const CompsProvider: React.FC<CompsProviderProps> = ({ children }) => {
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [traitMappings, setTraitMappings] = useState<Record<string, ChampionSet>>({});
  const { supabase } = useSupabase();

  // Load comps and trait mappings from localStorage on component mount
  useEffect(() => {
    try {
      const savedComps = localStorage.getItem('tftComps');
      if (savedComps) {
        setComps(JSON.parse(savedComps));
      }
      
      const savedMappings = localStorage.getItem('tftTraitMappings');
      if (savedMappings) {
        setTraitMappings(JSON.parse(savedMappings));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save comps to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tftComps', JSON.stringify(comps));
    } catch (error) {
      console.error('Error saving comps to localStorage:', error);
    }
  }, [comps]);

  // Save trait mappings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tftTraitMappings', JSON.stringify(traitMappings));
    } catch (error) {
      console.error('Error saving trait mappings to localStorage:', error);
    }
  }, [traitMappings]);

  const addComp = (comp: TFTComp) => {
    setComps(prevComps => {
      // Check if this is an update to an existing comp
      const existingIndex = prevComps.findIndex(c => c.id === comp.id);
      if (existingIndex >= 0) {
        const updatedComps = [...prevComps];
        updatedComps[existingIndex] = comp;
        return updatedComps;
      } else {
        // It's a new comp
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
