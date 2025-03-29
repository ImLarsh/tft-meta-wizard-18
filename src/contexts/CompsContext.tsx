
import React, { createContext, useContext, useEffect, useState } from 'react';
import { TFTComp } from '@/data/comps';
import { ChampionTraitMap } from '@/types/champion';

// Define the structure for trait mappings
interface TraitMapping {
  name: string;
  traits: string[];
  championTraits: ChampionTraitMap;
}

interface TraitMappingsState {
  [key: string]: TraitMapping;
}

interface CompsContextType {
  comps: TFTComp[];
  addComp: (comp: TFTComp) => void;
  updateComp: (compId: string, updatedComp: TFTComp) => void;
  removeComp: (compId: string) => void;
  getCompById: (compId: string) => TFTComp | undefined;
  traitMappings: TraitMappingsState;
  updateTraitMappings: (tftVersion: string, mapping: TraitMapping) => void;
  removeSet: (tftVersion: string) => void;
  setTraitMappings: (mappings: TraitMappingsState) => void;
  addTraitMapping: (tftVersion: string, mapping: TraitMapping) => void;
}

const CompsContext = createContext<CompsContextType | undefined>(undefined);

export const useComps = () => {
  const context = useContext(CompsContext);
  if (context === undefined) {
    throw new Error('useComps must be used within a CompsProvider');
  }
  return context;
};

export const CompsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [traitMappings, setTraitMappings] = useState<TraitMappingsState>({
    "Set 10": {
      name: "Remix Rumble",
      traits: ["8-bit", "Big Shot", "Breakout", "Country", "Disco", "EDM", "Emo", "Funk", "Heartsteel", "Hyperpop", "Illbeats", "Jazz", "K/DA", "Metal", "Mixmaster", "Pentakill", "Pop", "Punk", "True Damage", "Wildcard"],
      championTraits: {
        "Ahri": ["K/DA", "Wildcard"],
        "Akali": ["K/DA", "True Damage"],
        "Amumu": ["Emo", "Punk"],
        "Annie": ["Emo", "Hyperpop"],
        "Bard": ["Jazz"],
        "Blitzcrank": ["Disco", "Punk"],
        "Caitlyn": ["Heartsteel", "True Damage"],
        "Corki": ["Big Shot", "8-bit"],
        "Evelynn": ["K/DA", "Funk"],
        "Ekko": ["True Damage"],
        "Garen": ["Pentakill", "8-bit"],
        "Gnar": ["EDM", "Wildcard"],
        "Gragas": ["Disco", "Country"],
        "Illaoi": ["Illbeats", "Country"],
        "Jax": ["EDM", "Punk"],
        "Jhin": ["Maestro", "Country"],
        "Jinx": ["Punk", "Pentakill"],
        "Kai'Sa": ["K/DA", "Big Shot"],
        "Karthus": ["Pentakill", "Disco"],
        "Katarina": ["Country", "K/DA"],
        "Kayle": ["Pentakill", "Big Shot"],
        "Kayn": ["Heartsteel", "Wildcard"],
        "Kennen": ["Disco", "True Damage"],
        "Lillia": ["K/DA", "EDM"],
        "Lucian": ["Jazz", "Big Shot"],
        "Lulu": ["Hyperpop", "EDM"],
        "Lux": ["Pop", "EDM"],
        "Miss Fortune": ["Jazz", "Big Shot"],
        "Mordekaiser": ["Pentakill"],
        "Nami": ["Jazz", "Disco"],
        "Neeko": ["Hyperpop", "K/DA"],
        "Olaf": ["Pentakill", "Punk"],
        "Pantheon": ["Punk", "Pentakill"],
        "Poppy": ["Emo", "Heartsteel"],
        "Qiyana": ["True Damage"],
        "Riven": ["8-bit", "Heartsteel"],
        "Samira": ["Country", "Jazz"],
        "Senna": ["True Damage", "Heartsteel"],
        "Seraphine": ["K/DA", "Heartsteel"],
        "Sett": ["Heartsteel", "Mosher"],
        "Sona": ["Mixmaster", "Jazz"],
        "Tahm Kench": ["Country", "Jazz"],
        "Taric": ["Disco", "Pop"],
        "Thresh": ["Pentakill", "Country"],
        "Twitch": ["Punk", "Jazz"],
        "Twisted Fate": ["Disco", "Heartsteel"],
        "Urgot": ["Country", "Metal"],
        "Vex": ["Emo", "Pentakill"],
        "Vi": ["Punk", "Funk"],
        "Viego": ["Pentakill", "EDM"],
        "Yasuo": ["True Damage", "Heartsteel"],
        "Yone": ["Heartsteel", "EDM"],
        "Yorick": ["Pentakill", "Disco"],
        "Zac": ["EDM", "Pop"],
        "Zed": ["EDM", "Heartsteel"],
        "Ziggs": ["Hyperpop", "8-bit"],
        "Zilean": ["Funk", "Disco"]
      }
    }
  });

  // Load previously saved comps from localStorage on component mount
  useEffect(() => {
    const savedComps = localStorage.getItem('tftComps');
    if (savedComps) {
      setComps(JSON.parse(savedComps));
    }

    const savedTraitMappings = localStorage.getItem('tftTraitMappings');
    if (savedTraitMappings) {
      setTraitMappings(JSON.parse(savedTraitMappings));
    }
  }, []);

  // Save comps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tftComps', JSON.stringify(comps));
  }, [comps]);

  // Save trait mappings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tftTraitMappings', JSON.stringify(traitMappings));
    console.info('Successfully saved trait mappings');
  }, [traitMappings]);

  const addComp = (comp: TFTComp) => {
    setComps((prevComps) => [...prevComps, comp]);
  };

  const updateComp = (compId: string, updatedComp: TFTComp) => {
    setComps((prevComps) => 
      prevComps.map((comp) => 
        comp.id === compId ? updatedComp : comp
      )
    );
  };

  const removeComp = (compId: string) => {
    setComps((prevComps) => prevComps.filter((comp) => comp.id !== compId));
  };

  const getCompById = (compId: string) => {
    return comps.find((comp) => comp.id === compId);
  };

  const updateTraitMappings = (tftVersion: string, mapping: TraitMapping) => {
    setTraitMappings((prev) => ({
      ...prev,
      [tftVersion]: mapping
    }));
  };

  const addTraitMapping = (tftVersion: string, mapping: TraitMapping) => {
    setTraitMappings((prev) => ({
      ...prev,
      [tftVersion]: mapping
    }));
  };

  const removeSet = (tftVersion: string) => {
    setTraitMappings((prev) => {
      const updated = { ...prev };
      delete updated[tftVersion];
      return updated;
    });

    // Also remove comps associated with the deleted set
    setComps((prevComps) => prevComps.filter((comp) => comp.tftVersion !== tftVersion));
  };

  return (
    <CompsContext.Provider 
      value={{ 
        comps, 
        addComp, 
        updateComp, 
        removeComp, 
        getCompById,
        traitMappings,
        updateTraitMappings,
        removeSet,
        setTraitMappings,
        addTraitMapping
      }}
    >
      {children}
    </CompsContext.Provider>
  );
};
