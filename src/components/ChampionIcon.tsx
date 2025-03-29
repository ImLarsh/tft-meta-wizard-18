
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTFTData } from '@/contexts/TFTDataContext';

interface ChampionIconProps {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Create a cache for successful image URLs
const imageCache: Record<string, string> = {};

const ChampionIcon: React.FC<ChampionIconProps> = ({ 
  name, 
  cost, 
  size = 'md',
  className
}) => {
  const { currentPatchVersion } = useTFTData();
  const [imgError, setImgError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const isMounted = useRef(true);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  // Cost-specific classes
  const costClasses = {
    1: 'border-cost-1/70',
    2: 'border-cost-2/70',
    3: 'border-cost-3/70',
    4: 'border-cost-4/70',
    5: 'border-cost-5/70'
  };
  
  const costBgClasses = {
    1: 'bg-cost-1',
    2: 'bg-cost-2',
    3: 'bg-cost-3',
    4: 'bg-cost-4',
    5: 'bg-cost-5'
  };

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);
  
  // Reset error state and load image when name changes
  useEffect(() => {
    if (!name) return;
    
    setImgError(false);
    
    // Check if this image is already in our cache
    const cacheKey = `champion:${name}`;
    if (imageCache[cacheKey]) {
      setImageSrc(imageCache[cacheKey]);
      return;
    }
    
    // Normalize the champion name for different API formats
    let normalizedName = normalizeChampionName(name);
    
    // Generate possible image sources
    const sources = getImageSources(normalizedName, currentPatchVersion);
    
    // Try to load each source in sequence until one works
    let currentIndex = 0;
    
    const tryNextSource = () => {
      if (currentIndex >= sources.length) {
        if (isMounted.current) {
          setImgError(true);
        }
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        if (isMounted.current) {
          const successfulSource = sources[currentIndex];
          imageCache[cacheKey] = successfulSource; // Cache the successful URL
          setImageSrc(successfulSource);
        }
      };
      
      img.onerror = () => {
        if (isMounted.current) {
          currentIndex++;
          tryNextSource();
        }
      };
      
      img.src = sources[currentIndex];
    };
    
    tryNextSource();
  }, [name, currentPatchVersion]);
  
  // Normalize champion name
  const normalizeChampionName = (champName: string): string => {
    // Special case handling for champions with known naming issues
    const specialCases: Record<string, string> = {
      "MissFortune": "missfortune",
      "Miss Fortune": "missfortune",
      "AurelionSol": "aurelionsol",
      "Aurelion Sol": "aurelionsol",
      "TahmKench": "tahmkench",
      "Tahm Kench": "tahmkench",
      "XinZhao": "xinzhao",
      "Xin Zhao": "xinzhao",
      "MasterYi": "masteryi",
      "Master Yi": "masteryi",
      "TwistedFate": "twistedfate",
      "Twisted Fate": "twistedfate",
      "KSante": "ksante",
      "K'Sante": "ksante",
      "JarvanIV": "jarvaniv",
      "Jarvan IV": "jarvaniv",
      "LeBlanc": "leblanc",
      "Le Blanc": "leblanc",
      "KhaZix": "khazix",
      "Kha'Zix": "khazix",
      "ChoGath": "chogath",
      "Cho'Gath": "chogath",
      "KaiSa": "kaisa",
      "Kai'Sa": "kaisa",
      "VelKoz": "velkoz",
      "Vel'Koz": "velkoz",
      "RekSai": "reksai",
      "Rek'Sai": "reksai"
    };
    
    if (specialCases[champName]) {
      return specialCases[champName];
    }
    
    // Standard normalization for other champions
    return champName.toLowerCase().replace(/[^a-z0-9]/g, '');
  };
  
  // Generate image sources in order of likely reliability
  const getImageSources = (normalizedName: string, patchVersion: string): string[] => {
    const versions = [patchVersion, '15.6.1', '15.5.1', '14.7.1', '14.6.1', '14.5.1', '14.1.1', '13.24.1'];
    
    return [
      // Data Dragon TFT-specific with current version
      ...versions.map(version => 
        `https://ddragon.leagueoflegends.com/cdn/${version}/img/tft-champion/${normalizedName}.png`
      ),
      
      // TFT set specific sources
      `https://raw.communitydragon.org/latest/game/assets/characters/tft10_${normalizedName}/hud/tft10_${normalizedName}_square.tft_set10.png`,
      `https://raw.communitydragon.org/latest/game/assets/characters/tft11_${normalizedName}/hud/tft11_${normalizedName}_square.tft_set11.png`,
      
      // Regular LoL champion sources
      ...versions.map(version => 
        `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}.png`
      ),
      
      // Community sources
      `https://cdn.metatft.com/file/metatft/champions/${normalizedName}.png`,
      `https://rerollcdn.com/characters/${normalizedName}.png`,
      `https://cdn.tft.tools/champions/${normalizedName}.png`,
      
      // Standard LoL community resources
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${normalizedName}.png`,
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${normalizedName}/${normalizedName}_0.jpg`,
    ];
  };
  
  // For display in fallback
  const displayName = name.replace(/([A-Z])/g, ' $1').trim();
  
  return (
    <div 
      className={cn(
        sizeClasses[size],
        `champion-border-${cost}`,
        'rounded-md overflow-hidden relative border',
        costClasses[cost],
        className
      )}
    >
      {imgError || !imageSrc ? (
        <div className={cn(
          "w-full h-full flex items-center justify-center text-[10px] font-medium text-white bg-secondary p-0.5 text-center",
          sizeClasses[size]
        )}>
          {displayName}
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
          loading="eager"
        />
      )}
      <div className={cn(
        "absolute bottom-0 right-0 w-3 h-3 rounded-tl-md flex items-center justify-center text-[8px] font-bold text-white",
        costBgClasses[cost]
      )}>
        {cost}
      </div>
    </div>
  );
};

export default ChampionIcon;
