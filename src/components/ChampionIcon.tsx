
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChampionIconProps {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ChampionIcon: React.FC<ChampionIconProps> = ({ 
  name, 
  cost, 
  size = 'md',
  className
}) => {
  const [imgError, setImgError] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  // Reset error state when name changes
  useEffect(() => {
    setImgError(false);
    setCurrentSourceIndex(0);
  }, [name]);
  
  // Normalize the champion name for different API formats
  let normalizedName;
  
  // Special case handling for champions with known naming issues
  if (name === "MissFortune" || name === "Miss Fortune") {
    normalizedName = "missfortune";
  } else if (name === "AurelionSol" || name === "Aurelion Sol") {
    normalizedName = "aurelionsol";
  } else if (name === "TahmKench" || name === "Tahm Kench") {
    normalizedName = "tahmkench";
  } else if (name === "XinZhao" || name === "Xin Zhao") {
    normalizedName = "xinzhao";
  } else if (name === "MasterYi" || name === "Master Yi") {
    normalizedName = "masteryi";
  } else if (name === "TwistedFate" || name === "Twisted Fate") {
    normalizedName = "twistedfate";
  } else if (name === "KSante" || name === "K'Sante") {
    normalizedName = "ksante";
  } else if (name === "JarvanIV" || name === "Jarvan IV") {
    normalizedName = "jarvaniv";
  } else if (name === "LeBlanc" || name === "Le Blanc") {
    normalizedName = "leblanc";
  } else if (name === "KhaZix" || name === "Kha'Zix") {
    normalizedName = "khazix";
  } else if (name === "ChoGath" || name === "Cho'Gath") {
    normalizedName = "chogath";
  } else if (name === "KaiSa" || name === "Kai'Sa") {
    normalizedName = "kaisa";
  } else if (name === "VelKoz" || name === "Vel'Koz") {
    normalizedName = "velkoz";
  } else if (name === "RekSai" || name === "Rek'Sai") {
    normalizedName = "reksai";
  } else {
    // Standard normalization for other champions
    // Remove spaces and special characters, convert to lowercase
    normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  
  // For display in fallback
  const displayName = name.replace(/([A-Z])/g, ' $1').trim(); // Add spaces before capital letters
  
  // Generate an array of possible patch versions to try
  const patchVersions = ['14.7.1', '14.6.1', '14.5.1', '14.1.1', '13.24.1'];
  
  // New and more reliable image sources
  const sources = [
    // Data Dragon TFT-specific image paths (most reliable)
    ...patchVersions.map(version => 
      `https://ddragon.leagueoflegends.com/cdn/${version}/img/tft-champion/${normalizedName}.png`
    ),
    
    // TFT set 10 specific sources
    `https://raw.communitydragon.org/pbe/game/assets/characters/tft10_${normalizedName}/hud/tft10_${normalizedName}_square.tft_set10.png`,
    `https://raw.communitydragon.org/latest/game/assets/characters/tft10_${normalizedName}/hud/tft10_${normalizedName}_square.tft_set10.png`,
    
    // TFT set 11 specific sources (for future-proofing)
    `https://raw.communitydragon.org/pbe/game/assets/characters/tft11_${normalizedName}/hud/tft11_${normalizedName}_square.tft_set11.png`,
    
    // Riot Data Dragon - Try with normalized name
    ...patchVersions.map(version => 
      `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}.png`
    ),
    
    // Try with original name (for Data Dragon which sometimes uses spaces)
    ...patchVersions.map(version => 
      `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${name.replace(/\s+/g, '')}.png`
    ),
    
    // Community Dragon fallbacks
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${normalizedName}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${normalizedName}/${normalizedName}_0.jpg`,
    
    // Mobalytics - try multiple format approaches
    `https://cdn.mobalytics.gg/assets/tft/images/champions/thumbnails/${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/common/images/lol/champions/standard/${normalizedName}.png`,
    
    // MetaTFT & Reroll
    `https://cdn.metatft.com/file/metatft/champions/${normalizedName}.png`,
    `https://rerollcdn.com/characters/${normalizedName}.png`,
    
    // TFT Tactics
    `https://cdn.tft.tools/champions/${normalizedName}.png`
  ];
  
  // Fallback image - use a more reliable placeholder
  const fallbackUrl = 'https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Ryze_0.jpg';
  
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
  
  const handleImageError = () => {
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < sources.length) {
      console.log(`Source ${currentSourceIndex} failed for ${name}, trying source ${nextIndex}`);
      setCurrentSourceIndex(nextIndex);
    } else {
      console.log(`All image sources failed for ${name}, using fallback`);
      setImgError(true);
    }
  };
  
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
      {imgError ? (
        <div className={cn(
          "w-full h-full flex items-center justify-center text-[10px] font-medium text-white bg-secondary p-0.5 text-center",
          sizeClasses[size]
        )}>
          {displayName}
        </div>
      ) : (
        <img
          src={sources[currentSourceIndex]}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
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
