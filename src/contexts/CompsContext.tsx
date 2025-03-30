
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TFTComp, Trait } from '@/data/comps';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { initialComps } from '@/data/initialComps';
import { traitMappingsData } from '@/data/traitMappings';
import { fetchCompsFromSupabase, fetchTraitMappingsFromSupabase, saveCompsToSupabase } from '@/utils/supabaseUtils';
import { Json } from '@/integrations/supabase/types';

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
  const [traitMappings, setTraitMappings] = useState<TraitMappings>({});
  const { user } = useAuth();

  // Load comps and trait mappings from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load trait mappings
        const mappingsData = await fetchTraitMappingsFromSupabase();
        if (Object.keys(mappingsData).length > 0) {
          setTraitMappings(mappingsData as TraitMappings);
          console.log('Trait mappings loaded from Supabase:', Object.keys(mappingsData));
        } else {
          console.log('No trait mappings in Supabase, using default data');
          setTraitMappings(traitMappingsData as TraitMappings);
        }

        // Load comps
        const compsData = await fetchCompsFromSupabase();
        if (compsData.length > 0) {
          console.log('Loaded comps from Supabase:', compsData.length);
          setComps(compsData as TFTCompWithVotes[]);
        } else {
          // Empty array if no comps found, don't use initialComps
          console.log('No comps found in Supabase, using empty array');
          setComps([]);
        }
        
        // Load votes from localStorage
        const savedVotes = localStorage.getItem('tft-comp-votes');
        if (savedVotes) {
          setVotes(JSON.parse(savedVotes));
        }
      } catch (err) {
        console.error("Error in loadData:", err);
        setComps([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

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
      
      // Update local state first
      const updatedComps = [compWithVotes, ...comps];
      setComps(updatedComps);

      if (supabase) {
        // Save to Supabase
        const success = await saveCompsToSupabase(updatedComps as TFTComp[]);
        
        if (!success) {
          throw new Error("Failed to save to Supabase");
        }
      }
      
      toast({
        title: "Composition Added",
        description: `"${comp.name}" has been successfully created.`,
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error adding comp:", error);
      
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
      // Update local state first
      const updatedComps = comps.map(comp => 
        comp.id === updatedComp.id ? updatedComp : comp
      );
      setComps(updatedComps);

      if (supabase) {
        // Save to Supabase
        const success = await saveCompsToSupabase(updatedComps as TFTComp[]);
        
        if (!success) {
          throw new Error("Failed to save to Supabase");
        }
      }
      
      toast({
        title: "Composition Updated",
        description: `"${updatedComp.name}" has been successfully updated.`,
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error updating comp:", error);
      
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
      // Update local state first
      const updatedComps = comps.filter(comp => comp.id !== compId);
      setComps(updatedComps);

      if (supabase) {
        // Save to Supabase
        const success = await saveCompsToSupabase(updatedComps as TFTComp[]);
        
        if (!success) {
          throw new Error("Failed to save to Supabase");
        }
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error removing comp:", error);
      
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
