
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ItemIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ItemIcon: React.FC<ItemIconProps> = ({ 
  name, 
  size = 'md',
  className
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Normalize the item name for URLs
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');
  const displayName = name.replace(/([A-Z])/g, ' $1').trim(); // Add spaces before capital letters
  
  // More comprehensive list of image sources to try with different naming patterns
  const sources = [
    // TFT Set 10 specific
    `https://raw.communitydragon.org/pbe/game/assets/items/icons2d/tft_item_${normalizedName.toLowerCase()}.tft_set10.png`,
    
    // Mobalytics sources
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedName.toLowerCase()}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedName.toLowerCase()}.png`,
    
    // MetaTFT and Reroll
    `https://cdn.metatft.com/file/metatft/items/${normalizedName.toLowerCase()}.png`,
    `https://rerollcdn.com/items/${normalizedName.toLowerCase()}.png`,
    
    // League sources
    `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${normalizedName.toLowerCase()}.png`,
    `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${normalizedName.toLowerCase()}.png`,
    
    // Community Dragon with different naming patterns
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${normalizedName.toLowerCase()}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons/standard/${normalizedName.toLowerCase()}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons/set10/${normalizedName.toLowerCase()}.png`,
    
    // Alternative item naming schemes
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/tft10_${normalizedName.toLowerCase()}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/tft_${normalizedName.toLowerCase()}.png`,
    `https://lolg-cdn.porofessor.gg/img/tft/items/${normalizedName.toLowerCase()}.png`
  ];
  
  // Fallback image - use a reliable generic item
  const fallbackUrl = 'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/3094.png';
  
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  const handleImageError = () => {
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < sources.length) {
      console.log(`Source ${currentSourceIndex} failed for item ${name}, trying source ${nextIndex}`);
      setCurrentSourceIndex(nextIndex);
    } else {
      console.log(`All image sources failed for item ${name}, using fallback`);
      setImgError(true);
    }
  };
  
  return (
    <div 
      className={cn(
        sizeClasses[size],
        'rounded overflow-hidden relative border border-border/50 shadow-sm',
        className
      )}
    >
      {imgError ? (
        <div className={cn(
          "w-full h-full flex items-center justify-center text-[8px] font-medium text-white bg-secondary p-0.5 text-center",
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
          title={name}
        />
      )}
    </div>
  );
};

export default ItemIcon;
