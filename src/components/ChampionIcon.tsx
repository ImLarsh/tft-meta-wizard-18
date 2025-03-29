
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
  
  // Try multiple reliable sources in different formats
  const communityDragonUrlFull = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${normalizedName}.png`;
  const communityDragonUrlLowcase = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${normalizedName.toLowerCase()}.png`;
  const tftAssetsUrl = `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${name}.png`;
  const mobalyticsUrl = `https://cdn.mobalytics.gg/assets/tft/images/champions/thumbnails/${normalizedName.toLowerCase()}.png`;
  const mobalyticsChampionUrl = `https://cdn.mobalytics.gg/assets/common/images/lol/champions/standard/${normalizedName.toLowerCase()}.png`;
  const metaTFTUrl = `https://cdn.metatft.com/file/metatft/champions/${normalizedName.toLowerCase()}.png`;
  
  // Fallback image - use a generic placeholder
  const fallbackUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=40&h=40&fit=crop&auto=format';
  
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
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    // Try each fallback source in sequence
    if (target.src === communityDragonUrlFull) {
      console.log(`First source failed for ${name}, trying source 2`);
      target.src = communityDragonUrlLowcase;
    } else if (target.src === communityDragonUrlLowcase) {
      console.log(`Second source failed for ${name}, trying source 3`);
      target.src = tftAssetsUrl;
    } else if (target.src === tftAssetsUrl) {
      console.log(`Third source failed for ${name}, trying source 4`);
      target.src = mobalyticsUrl;
    } else if (target.src === mobalyticsUrl) {
      console.log(`Fourth source failed for ${name}, trying source 5`);
      target.src = mobalyticsChampionUrl;
    } else if (target.src === mobalyticsChampionUrl) {
      console.log(`Fifth source failed for ${name}, trying source 6`);
      target.src = metaTFTUrl;
    } else {
      console.log(`All image sources failed for ${name}, using fallback`);
      setImgError(true);
      target.src = fallbackUrl;
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
          src={communityDragonUrlFull}
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
