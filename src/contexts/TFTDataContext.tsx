
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllTFTData, TFTChampion, TFTItem } from '@/utils/tftDataFetcher';
import { useToast } from '@/components/ui/use-toast';

interface TFTDataContextType {
  champions: TFTChampion[];
  items: TFTItem[];
  loading: boolean;
  error: string | null;
  currentPatchVersion: string;
  refreshData: () => Promise<void>;
}

const TFTDataContext = createContext<TFTDataContextType | undefined>(undefined);

export const TFTDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [champions, setChampions] = useState<TFTChampion[]>([]);
  const [items, setItems] = useState<TFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPatchVersion, setCurrentPatchVersion] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { champions, items, version } = await fetchAllTFTData();
      
      setChampions(champions);
      setItems(items);
      setCurrentPatchVersion(version);
      
      console.log(`Loaded ${champions.length} champions and ${items.length} items from patch ${version}`);
      
      if (champions.length > 0 && items.length > 0) {
        toast({
          title: "TFT Data Loaded",
          description: `Successfully loaded ${champions.length} champions and ${items.length} items from patch ${version}`,
        });
      } else {
        throw new Error('Failed to load TFT data properly');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching TFT data';
      setError(errorMessage);
      
      toast({
        title: "Failed to load TFT data",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Error fetching TFT data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial mount
  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    champions,
    items,
    loading,
    error,
    currentPatchVersion,
    refreshData: fetchData,
  };

  return (
    <TFTDataContext.Provider value={value}>
      {children}
    </TFTDataContext.Provider>
  );
};

export const useTFTData = () => {
  const context = useContext(TFTDataContext);
  if (context === undefined) {
    throw new Error('useTFTData must be used within a TFTDataProvider');
  }
  return context;
};
