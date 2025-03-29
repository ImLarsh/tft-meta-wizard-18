
import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultComps, { TFTComp } from '@/data/comps';
import { ChampionTraitMap } from '@/types/champion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data from Supabase, fallback to localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get data from Supabase first
        const { data: compsData, error: compsError } = await supabase
          .from('tft_comps')
          .select('*')
          .single();
          
        const { data: mappingsData, error: mappingsError } = await supabase
          .from('tft_trait_mappings')
          .select('*')
          .single();
          
        let loadedComps = [];
        let loadedMappings = { ...defaultTraitMappings };
        
        // If Supabase data exists, use it
        if (compsData && !compsError) {
          // Ensure we're getting an array from the comps field
          if (compsData.comps && Array.isArray(compsData.comps)) {
            loadedComps = compsData.comps;
          }
        } else {
          // Try localStorage as fallback
          const savedComps = localStorage.getItem('tftComps');
          if (savedComps) {
            try {
              const parsedComps = JSON.parse(savedComps);
              
              // Check for boardPositions property and add it if it doesn't exist
              loadedComps = parsedComps.map((comp: TFTComp) => {
                if (!('boardPositions' in comp)) {
                  return {
                    ...comp,
                    boardPositions: comp.finalComp.some(champ => champ.position !== null),
                    tftVersion: comp.tftVersion || "Set 10"
                  };
                }
                return comp;
              });
            } catch (e) {
              console.error('Failed to parse saved comps', e);
              loadedComps = defaultComps;
            }
          } else {
            loadedComps = defaultComps;
          }
        }
        
        // If Supabase trait mappings exist, use it
        if (mappingsData && !mappingsError) {
          // Ensure we're getting an object from the mappings field
          if (mappingsData.mappings && typeof mappingsData.mappings === 'object') {
            loadedMappings = {
              ...defaultTraitMappings,
              ...mappingsData.mappings
            };
          }
        } else {
          // Try localStorage as fallback
          const savedTraitMappings = localStorage.getItem('tftTraitMappings');
          if (savedTraitMappings) {
            try {
              loadedMappings = {
                ...defaultTraitMappings,
                ...JSON.parse(savedTraitMappings)
              };
            } catch (e) {
              console.error('Failed to parse saved trait mappings', e);
            }
          }
        }
        
        setComps(loadedComps);
        setTraitMappings(loadedMappings);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Using default values.",
          variant: "destructive",
        });
        
        // Fallback to defaults if all else fails
        setComps(defaultComps);
        setTraitMappings(defaultTraitMappings);
        setIsInitialized(true);
      }
    };
    
    loadData();
  }, []);
  
  // When data changes and after initialization, save to Supabase
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveData = async () => {
      try {
        // Save to localStorage as backup
        localStorage.setItem('tftComps', JSON.stringify(comps));
        localStorage.setItem('tftTraitMappings', JSON.stringify(traitMappings));
        
        // Save to Supabase
        const { data: existingComps, error: checkError } = await supabase
          .from('tft_comps')
          .select('id, comps');
          
        if (existingComps && existingComps.length > 0) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('tft_comps')
            .update({ comps: comps })
            .eq('id', existingComps[0].id);
            
          if (updateError) {
            console.error('Error updating comps:', updateError);
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('tft_comps')
            .insert([{ comps: comps }]);
            
          if (insertError) {
            console.error('Error inserting comps:', insertError);
          }
        }
        
        // Save trait mappings
        const { data: existingMappings, error: checkMappingsError } = await supabase
          .from('tft_trait_mappings')
          .select('id, mappings');
          
        if (existingMappings && existingMappings.length > 0) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('tft_trait_mappings')
            .update({ mappings: traitMappings })
            .eq('id', existingMappings[0].id);
            
          if (updateError) {
            console.error('Error updating trait mappings:', updateError);
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('tft_trait_mappings')
            .insert([{ mappings: traitMappings }]);
            
          if (insertError) {
            console.error('Error inserting trait mappings:', insertError);
          }
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    
    saveData();
  }, [comps, traitMappings, isInitialized]);

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
  };

  // Remove a comp
  const removeComp = (compId: string) => {
    const updatedComps = comps.filter(comp => comp.id !== compId);
    setComps(updatedComps);
  };
  
  // Add or update a trait mapping
  const addTraitMapping = (version: string, mapping: TraitMapping) => {
    const updatedMappings = {
      ...traitMappings,
      [version]: mapping
    };
    
    setTraitMappings(updatedMappings);
  };

  // Update all trait mappings
  const updateTraitMappings = (mappings: Record<string, TraitMapping>) => {
    setTraitMappings(mappings);
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
