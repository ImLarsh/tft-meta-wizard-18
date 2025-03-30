
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TFTComp, Trait } from '@/data/comps';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { initialComps } from '@/data/initialComps';
import { traitMappingsData } from '@/data/traitMappings';

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

const CompsContext = createContext<CompsContextProps | undefined>(undefined);

export const CompsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comps, setComps] = useState<TFTComp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
  const traitMappings = traitMappingsData as TraitMappings;

  // Load comps
  useEffect(() => {
    const loadComps = async () => {
      setIsLoading(true);
      try {
        if (supabase) {
          // Try to fetch from Supabase
          const { data, error } = await supabase
            .from('compositions')
            .select('*');
            
          if (error) {
            console.error("Error fetching comps from Supabase:", error);
            // Fall back to local data if there's an error
            setComps(initialComps);
          } else if (data && data.length > 0) {
            console.log("Fetched comps from Supabase:", data.length);
            setComps(data as TFTComp[]);
          } else {
            console.log("No comps in Supabase, using initial comps");
            setComps(initialComps);
            
            // If user is authenticated, let's insert the initial comps into Supabase
            if (user) {
              for (const comp of initialComps) {
                const { error: insertError } = await supabase
                  .from('compositions')
                  .insert(comp);
                  
                if (insertError) {
                  console.error(`Error inserting comp ${comp.id}:`, insertError);
                }
              }
            }
          }
        } else {
          // No Supabase, use local data
          setComps(initialComps);
        }
        
        // Load votes from localStorage
        const savedVotes = localStorage.getItem('tft-comp-votes');
        if (savedVotes) {
          setVotes(JSON.parse(savedVotes));
        }
      } catch (err) {
        console.error("Error in loadComps:", err);
        setComps(initialComps);
      } finally {
        setIsLoading(false);
      }
    };

    loadComps();
  }, [user]);

  const addComp = async (comp: TFTComp) => {
    try {
      // Enforce unique ID
      if (comps.some(c => c.id === comp.id)) {
        const timestamp = new Date().getTime();
        comp.id = `${comp.id}-${timestamp}`;
      }
      
      if (supabase && user) {
        const { error } = await supabase
          .from('compositions')
          .insert(comp);
          
        if (error) {
          throw error;
        }
      }
      
      setComps(prev => [comp, ...prev]);
      
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

  const updateComp = async (updatedComp: TFTComp) => {
    try {
      if (supabase && user) {
        const { error } = await supabase
          .from('compositions')
          .update(updatedComp)
          .eq('id', updatedComp.id);
          
        if (error) {
          throw error;
        }
      }
      
      setComps(prev => 
        prev.map(comp => 
          comp.id === updatedComp.id ? updatedComp : comp
        )
      );
      
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
      if (supabase && user) {
        const { error } = await supabase
          .from('compositions')
          .delete()
          .eq('id', compId);
          
        if (error) {
          throw error;
        }
      }
      
      setComps(prev => prev.filter(comp => comp.id !== compId));
      
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
      
      if (supabase && user) {
        // In a real app, we'd track votes in a separate table
        // For simplicity in this example, we're just incrementing/decrementing
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
      }
      
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
      
      if (supabase && user) {
        // Update vote count in Supabase
        const comp = comps.find(c => c.id === compId);
        if (!comp) return;
        
        let updatedComp = { ...comp };
        if (wasUpvote) {
          updatedComp.upvotes = Math.max(0, (comp.upvotes || 0) - 1);
        } else {
          updatedComp.downvotes = Math.max(0, (comp.downvotes || 0) - 1);
        }
        
        await updateComp(updatedComp);
      }
      
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
