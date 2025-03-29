
import React, { useState } from 'react';
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
  
  // Normalize the champion name for different API formats
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const displayName = name.replace(/([A-Z])/g, ' $1').trim(); // Add spaces before capital letters
  
  // New and more reliable image sources
  const sources = [
    // TFT set 10 specific sources
    `https://raw.communitydragon.org/pbe/game/assets/characters/tft10_${normalizedName.toLowerCase()}/hud/tft10_${normalizedName.toLowerCase()}_square.tft_set10.png`,
    `https://raw.communitydragon.org/latest/game/assets/characters/tft10_${normalizedName.toLowerCase()}/hud/tft10_${normalizedName.toLowerCase()}_square.tft_set10.png`,
    
    // Riot Data Dragon
    `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${name}.png`,
    `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${name}.png`,
    `https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${name}_0.jpg`,
    
    // Community Dragon
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${normalizedName.toLowerCase()}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${normalizedName.toLowerCase()}/${normalizedName.toLowerCase()}_0.jpg`,
    
    // Mobalytics
    `https://cdn.mobalytics.gg/assets/tft/images/champions/thumbnails/${normalizedName.toLowerCase()}.png`,
    `https://cdn.mobalytics.gg/assets/common/images/lol/champions/standard/${normalizedName.toLowerCase()}.png`,
    
    // MetaTFT & Reroll
    `https://cdn.metatft.com/file/metatft/champions/${normalizedName.toLowerCase()}.png`,
    `https://rerollcdn.com/characters/${normalizedName.toLowerCase()}.png`,
    
    // League of Legends asset links
    `https://static.wikia.nocookie.net/leagueoflegends/images/latest/scale-to-width-down/123?cb=20200412015006&path-prefix=${normalizedName.toLowerCase()}`,
    `https://lolg-cdn.porofessor.gg/img/champion-icons/${normalizedName.toLowerCase()}.png`
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
  
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
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
