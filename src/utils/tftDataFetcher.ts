
/**
 * Utility for fetching TFT data from Riot's Data Dragon API
 */

// Types for TFT Data
export interface TFTChampion {
  id: string;
  name: string;
  cost: number;
  traits: string[];
  stats?: any;
  icon?: string;
}

export interface TFTItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

/**
 * Fetch the latest League of Legends patch version
 * @returns Promise<string> The latest patch version
 */
export const getLatestPatchVersion = async (): Promise<string> => {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (!response.ok) throw new Error('Failed to fetch versions');
    
    const versions = await response.json();
    return versions[0]; // First item is always the latest version
  } catch (error) {
    console.error('Error fetching latest patch version:', error);
    return '14.7.1'; // Fallback to a recent version if fetch fails
  }
};

/**
 * Fetch all TFT champions from Data Dragon
 * @param patchVersion Optional patch version, will fetch latest if not provided
 * @returns Promise<TFTChampion[]> Array of TFT champions
 */
export const fetchTFTChampions = async (patchVersion?: string): Promise<TFTChampion[]> => {
  try {
    const version = patchVersion || await getLatestPatchVersion();
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/tft-champion.json`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch TFT champions: ${response.statusText}`);
    
    const data = await response.json();
    
    // Transform the data into a more usable format
    return Object.values(data.data).map((champion: any) => ({
      id: champion.id,
      name: champion.name,
      cost: parseInt(champion.tier, 10),
      traits: champion.traits || [],
      stats: champion.stats,
      icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/tft-champion/${champion.id}.png`
    }));
  } catch (error) {
    console.error('Error fetching TFT champions:', error);
    return [];
  }
};

/**
 * Fetch all TFT items from Data Dragon
 * @param patchVersion Optional patch version, will fetch latest if not provided
 * @returns Promise<TFTItem[]> Array of TFT items
 */
export const fetchTFTItems = async (patchVersion?: string): Promise<TFTItem[]> => {
  try {
    const version = patchVersion || await getLatestPatchVersion();
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/tft-item.json`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch TFT items: ${response.statusText}`);
    
    const data = await response.json();
    
    // Transform the data into a more usable format
    return Object.values(data.data).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/tft-item/${item.id}.png`
    }));
  } catch (error) {
    console.error('Error fetching TFT items:', error);
    return [];
  }
};

/**
 * Fetch both champions and items at once
 * @returns Promise with champions and items
 */
export const fetchAllTFTData = async () => {
  try {
    const version = await getLatestPatchVersion();
    const [champions, items] = await Promise.all([
      fetchTFTChampions(version),
      fetchTFTItems(version)
    ]);
    
    return { champions, items, version };
  } catch (error) {
    console.error('Error fetching all TFT data:', error);
    return { champions: [], items: [], version: '14.7.1' };
  }
};
