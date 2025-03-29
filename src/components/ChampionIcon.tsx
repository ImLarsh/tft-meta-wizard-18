
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
  
  // New, more reliable sources
  const ddragonUrl = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${normalizedName}.png`;
  const communityDragonUrl = `https://raw.communitydragon.org/latest/game/assets/characters/${normalizedName.toLowerCase()}/hud/${normalizedName.toLowerCase()}_square.png`;
  const tftUrl = `https://cdn.metatft.com/file/metatft/champions/${normalizedName.toLowerCase()}.png`;
  const rerollUrl = `https://rerollcdn.com/characters/${normalizedName.toLowerCase()}.png`;
  const cdnGamepediaUrl = `https://cdn.mobalytics.gg/assets/tft/images/champions/set9/${normalizedName.toLowerCase()}.png`;
  
  // Fallback image
  const fallbackUrl = '/placeholder.svg';
  
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
    if (target.src === ddragonUrl) {
      console.log(`DDragon failed for ${name}, trying Community Dragon`);
      target.src = communityDragonUrl;
    } else if (target.src === communityDragonUrl) {
      console.log(`Community Dragon failed for ${name}, trying TFT source`);
      target.src = tftUrl;
    } else if (target.src === tftUrl) {
      console.log(`TFT source failed for ${name}, trying Reroll CDN`);
      target.src = rerollUrl;
    } else if (target.src === rerollUrl) {
      console.log(`Reroll CDN failed for ${name}, trying Mobalytics`);
      target.src = cdnGamepediaUrl;
    } else if (target.src === cdnGamepediaUrl) {
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
          src={ddragonUrl}
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
