
import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultComps, { TFTComp } from '@/data/comps';

interface CompsContextType {
  comps: TFTComp[];
  addComp: (comp: TFTComp) => void;
  removeComp: (compId: string) => void;
}

const CompsContext = createContext<CompsContextType | undefined>(undefined);

export function CompsProvider({ children }: { children: React.ReactNode }) {
  const [comps, setComps] = useState<TFTComp[]>([]);

  // Load comps from localStorage or use defaults
  useEffect(() => {
    const savedComps = localStorage.getItem('tftComps');
    if (savedComps) {
      try {
        const parsedComps = JSON.parse(savedComps);
        
        // Check for boardPositions property and add it if it doesn't exist
        const updatedComps = parsedComps.map((comp: TFTComp) => {
          if (!('boardPositions' in comp)) {
            return {
              ...comp,
              boardPositions: comp.finalComp.some(champ => champ.position !== null),
              tftVersion: comp.tftVersion || "Set 10"
            };
          }
          return comp;
        });
        
        setComps(updatedComps);
      } catch (e) {
        console.error('Failed to parse saved comps', e);
        setComps(defaultComps);
        localStorage.setItem('tftComps', JSON.stringify(defaultComps));
      }
    } else {
      setComps(defaultComps);
      localStorage.setItem('tftComps', JSON.stringify(defaultComps));
    }
  }, []);

  // Add a new comp
  const addComp = (comp: TFTComp) => {
    // Check if the comp already exists (by ID)
    const exists = comps.some(c => c.id === comp.id);
    
    let updatedComps;
    if (exists) {
      // Replace the existing comp
      updatedComps = comps.map(c => c.id === comp.id ? comp : c);
    } else {
      // Add the new comp
      updatedComps = [...comps, comp];
    }
    
    setComps(updatedComps);
    localStorage.setItem('tftComps', JSON.stringify(updatedComps));
  };

  // Remove a comp
  const removeComp = (compId: string) => {
    const updatedComps = comps.filter(comp => comp.id !== compId);
    setComps(updatedComps);
    localStorage.setItem('tftComps', JSON.stringify(updatedComps));
  };

  return (
    <CompsContext.Provider value={{ comps, addComp, removeComp }}>
      {children}
    </CompsContext.Provider>
  );
}

export function useComps() {
  const context = useContext(CompsContext);
  if (context === undefined) {
    throw new Error('useComps must be used within a CompsProvider');
  }
  return context;
}
