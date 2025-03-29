
import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultComps, { TFTComp } from '@/data/comps';
import { ChampionTraitMap } from '@/types/champion';

interface TraitMapping {
  name: string;
  traits: string[];
  championTraits: ChampionTraitMap;
}

interface CompsContextType {
  comps: TFTComp[];
  addComp: (comp: TFTComp) => void;
  removeComp: (compId: string) => void;
  traitMappings: Record<string, TraitMapping>;
  setTraitMappings: (mappings: Record<string, TraitMapping>) => void;
  addTraitMapping: (version: string, mapping: TraitMapping) => void;
}

// Default trait mappings for current sets
const defaultTraitMappings: Record<string, TraitMapping> = {
  "Set 9": {
    name: "Ruination",
    traits: [
      "8-Bit", "Disco", "Superfan", "Guardian", "Bruiser", "Crowd Diver", 
      "Big Shot", "Edgelord", "Renegade", "Bastion", "Strategist", "Multicaster"
    ],
    championTraits: {
      "Ahri": ["Ionia", "Sorcerer"],
      "Akali": ["Ionia", "Assassin"],
      "Amumu": ["Guardian", "Empath"],
      "Annie": ["Fiddle", "Sorcerer"],
      "Aphelios": ["Deadeye", "Targon"],
      "Bard": ["Wanderer", "Support"],
      "Caitlyn": ["Deadeye", "Piltover"],
      "Corki": ["Big Shot", "Yordle"],
      "Ekko": ["Piltover", "Rogue"],
      "Garen": ["Demacia", "Juggernaut"],
      "Gragas": ["Freljord", "Bruiser"],
      "Illaoi": ["Illaoi", "Bruiser"],
      "Jax": ["Wanderer", "Juggernaut"],
      "Jinx": ["Zaun", "Gunner"],
      "Kayle": ["Demacia", "Slayer"],
      "Kennen": ["Ionia", "Ninja"],
      "Lux": ["Demacia", "Sorcerer"],
      "Mordekaiser": ["Shadow Isles", "Juggernaut"],
      "Olaf": ["Freljord", "Berserker"],
      "Pantheon": ["Shurima", "Guardian"],
      "Sett": ["Ionia", "Juggernaut"]
    }
  },
  "Set 10": {
    name: "Remix Rumble",
    traits: [
      "K/DA", "True Damage", "Heartsteel", "Hyperpop", "Pentakill", "Country", 
      "EDM", "Punk", "Jazz", "Emo", "Illbeats", "Maestro", "Guardian", "Bruiser", 
      "Crowd Diver", "Big Shot", "Superfan", "Edgelord"
    ],
    championTraits: {
      "Ahri": ["K/DA", "Spellweaver"],
      "Akali": ["K/DA", "Assassin"],
      "Amumu": ["Pentakill", "Guardian"],
      "Annie": ["Hyperpop", "Spellweaver"],
      "Aphelios": ["Heartsteel", "Deadeye"],
      "Bard": ["Jazz", "Support"],
      "Caitlyn": ["True Damage", "Deadeye"],
      "Corki": ["8-Bit", "Big Shot"],
      "Ekko": ["True Damage", "Superfan"],
      "Evelynn": ["K/DA", "Crowd Diver"],
      "Garen": ["Pentakill", "Juggernaut"],
      "Gragas": ["Disco", "Bruiser"],
      "Illaoi": ["Pentakill", "Bruiser"],
      "Jax": ["EDM", "Mosher"],
      "Jhin": ["Maestro", "Big Shot"],
      "Jinx": ["Punk", "Rapidfire"],
      "Kayle": ["Pentakill", "Slayer"],
      "Kayn": ["Heartsteel", "Edgelord"],
      "Kennen": ["True Damage", "Superfan"],
      "Karthus": ["Pentakill", "Executioner"],
      "Lillia": ["K/DA", "Guardian"],
      "Lucian": ["Jazz", "Deadeye"],
      "Lulu": ["Hyperpop", "Support"],
      "Lux": ["EDM", "Spellweaver"],
      "Miss Fortune": ["Jazz", "Big Shot"],
      "Mordekaiser": ["Pentakill", "Sentinel"],
      "Neeko": ["K/DA", "Guardian"],
      "Olaf": ["Pentakill", "Bruiser"],
      "Pantheon": ["Punk", "Guardian"],
      "Poppy": ["Emo", "Guardian"],
      "Qiyana": ["True Damage", "Crowd Diver"],
      "Samira": ["Country", "Challenger"],
      "Senna": ["True Damage", "Rapidfire"],
      "Seraphine": ["K/DA", "Spellweaver"],
      "Sett": ["Heartsteel", "Bruiser"],
      "Sona": ["Mixer", "Spellweaver"],
      "Tahm Kench": ["Country", "Bruiser"],
      "Taric": ["Disco", "Guardian"],
      "Thresh": ["Country", "Guardian"],
      "Twisted Fate": ["Disco", "Spellweaver"],
      "Twitch": ["Punk", "Executioner"],
      "Urgot": ["Country", "Mosher"],
      "Vex": ["Emo", "Executioner"],
      "Vi": ["Punk", "Mosher"],
      "Viego": ["Pentakill", "Edgelord"],
      "Yasuo": ["True Damage", "Edgelord"],
      "Yone": ["Heartsteel", "Challenger"],
      "Yorick": ["Pentakill", "Guardian"],
      "Zac": ["EDM", "Bruiser"],
      "Ziggs": ["Hyperpop", "Spellweaver"]
    }
  },
  "Set 11": {
    name: "Inkborn Fables",
    traits: [
      "Darkin", "Slayer", "Empress", "Void", "Deadeye", "Juggernaut", 
      "Duskwalker", "Quickdraw", "Tactician", "Gunner", "Armored", "Mythic"
    ],
    championTraits: {
      "Ahri": ["Mythic", "Spellweaver"],
      "Akali": ["Empress", "Assassin"],
      "Amumu": ["Darkin", "Guardian"],
      "Annie": ["Void", "Sorcerer"],
      "Aphelios": ["Darkin", "Deadeye"],
      "Caitlyn": ["Quickdraw", "Deadeye"],
      "Ekko": ["Slayer", "Tactician"],
      "Garen": ["Juggernaut", "Slayer"],
      "Illaoi": ["Void", "Juggernaut"],
      "Jax": ["Darkin", "Slayer"],
      "Jhin": ["Mythic", "Deadeye"],
      "Jinx": ["Gunner", "Duskwalker"],
      "Kayle": ["Empress", "Slayer"],
      "Kayn": ["Slayer", "Assassin"],
      "Karthus": ["Void", "Sorcerer"],
      "Lux": ["Mythic", "Sorcerer"],
      "Mordekaiser": ["Darkin", "Juggernaut"],
      "Olaf": ["Juggernaut", "Berserker"],
      "Pantheon": ["Mythic", "Guardian"],
      "Samira": ["Empress", "Gunner"],
      "Sett": ["Juggernaut", "Brawler"],
      "Vi": ["Armored", "Brawler"],
      "Viego": ["Slayer", "Assassin"],
      "Yasuo": ["Empress", "Duskwalker"],
      "Zac": ["Void", "Guardian"]
    }
  }
};

const CompsContext = createContext<CompsContextType | undefined>(undefined);

export function CompsProvider({ children }: { children: React.ReactNode }) {
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [traitMappings, setTraitMappings] = useState<Record<string, TraitMapping>>(defaultTraitMappings);

  // Load comps and trait mappings from localStorage or use defaults
  useEffect(() => {
    // Load comps
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
    
    // Load trait mappings
    const savedTraitMappings = localStorage.getItem('tftTraitMappings');
    if (savedTraitMappings) {
      try {
        const parsedMappings = JSON.parse(savedTraitMappings);
        setTraitMappings(parsedMappings);
      } catch (e) {
        console.error('Failed to parse saved trait mappings', e);
        setTraitMappings(defaultTraitMappings);
        localStorage.setItem('tftTraitMappings', JSON.stringify(defaultTraitMappings));
      }
    } else {
      setTraitMappings(defaultTraitMappings);
      localStorage.setItem('tftTraitMappings', JSON.stringify(defaultTraitMappings));
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
  
  // Add or update a trait mapping
  const addTraitMapping = (version: string, mapping: TraitMapping) => {
    const updatedMappings = {
      ...traitMappings,
      [version]: mapping
    };
    
    setTraitMappings(updatedMappings);
    localStorage.setItem('tftTraitMappings', JSON.stringify(updatedMappings));
  };

  // Update all trait mappings
  const updateTraitMappings = (mappings: Record<string, TraitMapping>) => {
    setTraitMappings(mappings);
    localStorage.setItem('tftTraitMappings', JSON.stringify(mappings));
  };

  return (
    <CompsContext.Provider value={{ 
      comps, 
      addComp, 
      removeComp, 
      traitMappings, 
      setTraitMappings: updateTraitMappings,
      addTraitMapping
    }}>
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
