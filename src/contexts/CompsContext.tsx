import React, { createContext, useState, useContext, useEffect } from 'react';
import { TFTComp, Trait } from '@/data/comps';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { initialComps } from '@/data/initialComps';
import { traitMappingsData } from '@/data/traitMappings';
import { Json } from '@/integrations/supabase/types';
import { 
  fetchCompsFromSupabase, 
  saveCompsToSupabase,
  fetchTraitMappingsFromSupabase, 
  saveTraitMappingsToSupabase 
} from '@/utils/supabaseUtils';

interface ChampionTraitMap {
  [championName: string]: string[];
}

interface ChampionCostMap {
  [championName: string]: number;
}

interface TraitMapping {
  name: string;
  traits: string[];
  championTraits: ChampionTraitMap;
  championCosts: ChampionCostMap;
}

interface TraitMappings {
  [version: string]: TraitMapping;
}

interface CompsContextProps {
  comps: TFTComp[];
  isLoading: boolean;
  addComp: (comp: TFTComp) => Promise<void>;
  updateComp: (updatedComp: TFTComp) => Promise<void>;
  removeComp: (compId: string) => Promise<void>;
  getComp: (compId: string) => TFTComp | undefined;
  traitMappings: TraitMappings;
  updateTraitMappings: (mappings: TraitMappings) => Promise<void>;
  addVote: (compId: string, isUpvote: boolean) => Promise<void>;
  removeVote: (compId: string) => Promise<void>;
  getVotes: () => Record<string, boolean>;
}

// Extend TFTComp for voting functionality
interface TFTCompWithVotes extends TFTComp {
  upvotes?: number;
  downvotes?: number;
}

const CompsContext = createContext<CompsContextProps | undefined>(undefined);

export const CompsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comps, setComps] = useState<TFTCompWithVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
  const [traitMappings, setTraitMappings] = useState<TraitMappings>(traitMappingsData as TraitMappings);

  // Load trait mappings
  useEffect(() => {
    const loadTraitMappings = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from Supabase
        const mappingsData = await fetchTraitMappingsFromSupabase();
        
        if (Object.keys(mappingsData).length > 0) {
          console.log("Loaded trait mappings from Supabase:", Object.keys(mappingsData).length);
          setTraitMappings(mappingsData as TraitMappings);
        } else if (user) {
          console.log("No trait mappings found in Supabase, using default and saving");
          // If user is authenticated, save the default mappings
          await saveTraitMappingsToSupabase(traitMappingsData);
        } else {
          console.log("No trait mappings found in Supabase, using default");
        }
      } catch (err) {
        console.error("Error loading trait mappings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTraitMappings();
  }, [user]);

  // Load comps
  useEffect(() => {
    const loadComps = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from Supabase
        const tftComps = await fetchCompsFromSupabase();
        
        if (tftComps.length > 0) {
          console.log("Loaded comps from Supabase:", tftComps.length);
          setComps(tftComps as TFTCompWithVotes[]);
        } else if (user) {
          console.log("No comps found in Supabase, using initial and saving");
          // If user is authenticated, save the initial comps
          await saveCompsToSupabase(initialComps);
          setComps(initialComps as TFTCompWithVotes[]);
        } else {
          console.log("No comps found in Supabase, using initial");
          setComps(initialComps as TFTCompWithVotes[]);
        }
        
        // Load votes from localStorage
        const savedVotes = localStorage.getItem('tft-comp-votes');
        if (savedVotes) {
          setVotes(JSON.parse(savedVotes));
        }
      } catch (err) {
        console.error("Error in loadComps:", err);
        setComps(initialComps as TFTCompWithVotes[]);
      } finally {
        setIsLoading(false);
      }
    };

    loadComps();
  }, [user]);

  const updateTraitMappings = async (mappings: TraitMappings): Promise<void> => {
    try {
      // Update local state immediately for better UX
      setTraitMappings(mappings);
      
      // Save to Supabase
      const saved = await saveTraitMappingsToSupabase(mappings);
      
      if (!saved) {
        throw new Error("Failed to save trait mappings to database");
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating trait mappings:", error);
      
      // Restore previous state on error
      setTraitMappings(traitMappings);
      
      toast({
        title: "Error Updating Trait Mappings",
        description: error.message || "Failed to update trait mappings. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const addComp = async (comp: TFTComp) => {
    try {
      // Enforce unique ID
      if (comps.some(c => c.id === comp.id)) {
        const timestamp = new Date().getTime();
        comp.id = `${comp.id}-${timestamp}`;
      }
      
      // Add voting properties
      const compWithVotes: TFTCompWithVotes = {
        ...comp,
        upvotes: 0,
        downvotes: 0
      };
      
      // Update local state first for responsive UI
      const updatedComps = [compWithVotes, ...comps];
      setComps(updatedComps);
      
      // Save to Supabase
      const saved = await saveCompsToSupabase(updatedComps);
      
      if (!saved) {
        throw new Error("Failed to save comp to database");
      }
      
      toast({
        title: "Composition Added",
        description: `"${comp.name}" has been successfully created.`,
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error adding comp:", error);
      
      // Restore previous state on error
      setComps(comps);
      
      toast({
        title: "Error Adding Composition",
        description: error.message || "Failed to add composition. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const updateComp = async (updatedComp: TFTCompWithVotes) => {
    try {
      // Update local state first for responsive UI
      const updatedComps = comps.map(comp => 
        comp.id === updatedComp.id ? updatedComp : comp
      );
      
      setComps(updatedComps);
      
      // Save to Supabase
      const saved = await saveCompsToSupabase(updatedComps);
      
      if (!saved) {
        throw new Error("Failed to update comp in database");
      }
      
      toast({
        title: "Composition Updated",
        description: `"${updatedComp.name}" has been successfully updated.`,
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating comp:", error);
      
      // Restore previous state on error
      setComps(comps);
      
      toast({
        title: "Error Updating Composition",
        description: error.message || "Failed to update composition. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const removeComp = async (compId: string) => {
    try {
      // Keep a copy of the current comps for rollback if needed
      const previousComps = [...comps];
      
      // Update local state first for responsive UI
      const updatedComps = comps.filter(comp => comp.id !== compId);
      setComps(updatedComps);
      
      // Save to Supabase
      const saved = await saveCompsToSupabase(updatedComps);
      
      if (!saved) {
        throw new Error("Failed to remove comp from database");
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error removing comp:", error);
      
      // Restore previous state on error
      setComps(comps);
      
      toast({
        title: "Error Removing Composition",
        description: error.message || "Failed to remove composition. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const getComp = (compId: string) => {
    return comps.find(comp => comp.id === compId);
  };
  
  const addVote = async (compId: string, isUpvote: boolean) => {
    try {
      const newVotes = { ...votes, [compId]: isUpvote };
      setVotes(newVotes);
      localStorage.setItem('tft-comp-votes', JSON.stringify(newVotes));
      
      // Update the comp with the new vote count
      const comp = comps.find(c => c.id === compId);
      if (!comp) return;
      
      let updatedComp = { ...comp };
      
      if (!votes[compId]) {
        // New vote
        if (isUpvote) {
          updatedComp.upvotes = (comp.upvotes || 0) + 1;
        } else {
          updatedComp.downvotes = (comp.downvotes || 0) + 1;
        }
      } else if (votes[compId] !== isUpvote) {
        // Changed vote
        if (isUpvote) {
          updatedComp.upvotes = (comp.upvotes || 0) + 1;
          updatedComp.downvotes = Math.max(0, (comp.downvotes || 0) - 1);
        } else {
          updatedComp.downvotes = (comp.downvotes || 0) + 1;
          updatedComp.upvotes = Math.max(0, (comp.upvotes || 0) - 1);
        }
      }
      
      await updateComp(updatedComp);
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error adding vote:", error);
      return Promise.reject(error);
    }
  };
  
  const removeVote = async (compId: string) => {
    try {
      const newVotes = { ...votes };
      const wasUpvote = newVotes[compId];
      delete newVotes[compId];
      setVotes(newVotes);
      localStorage.setItem('tft-comp-votes', JSON.stringify(newVotes));
      
      // Update vote count
      const comp = comps.find(c => c.id === compId);
      if (!comp) return;
      
      let updatedComp = { ...comp };
      if (wasUpvote) {
        updatedComp.upvotes = Math.max(0, (comp.upvotes || 0) - 1);
      } else {
        updatedComp.downvotes = Math.max(0, (comp.downvotes || 0) - 1);
      }
      
      await updateComp(updatedComp);
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error removing vote:", error);
      return Promise.reject(error);
    }
  };
  
  const getVotes = () => votes;

  return (
    <CompsContext.Provider value={{ 
      comps, 
      isLoading, 
      addComp, 
      updateComp, 
      removeComp, 
      getComp,
      traitMappings,
      updateTraitMappings,
      addVote,
      removeVote,
      getVotes
    }}>
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
