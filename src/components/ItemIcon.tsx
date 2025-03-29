
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
  
  // Primary source from TFT Tactics
  const tftTacticsUrl = `https://cdn.tft.tools/items/${normalizedName}.png`;
  
  // More comprehensive list of image sources to try with different naming patterns
  const sources = [
    // Primary TFT Tactics source
    tftTacticsUrl,
    
    // Alternative TFT Tactics format
    `https://www.tftactics.gg/cdn-cgi/image/width=86,height=86,fit=cover,gravity=0.5x0.5/tft/items/${normalizedName}.png`,
    
    // Primary Mobalytics sources
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedName}.png`,
    
    // Alternative item naming schemes for Mobalytics
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/tft10_${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/tft_${normalizedName}.png`,
    
    // MetaTFT and Reroll
    `https://cdn.metatft.com/file/metatft/items/${normalizedName}.png`,
    `https://rerollcdn.com/items/${normalizedName}.png`,
    
    // League sources
    `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${normalizedName}.png`,
    `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${normalizedName}.png`,
    
    // Community Dragon with different naming patterns
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${normalizedName}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons/standard/${normalizedName}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons/set10/${normalizedName}.png`,
    `https://raw.communitydragon.org/pbe/game/assets/items/icons2d/tft_item_${normalizedName}.tft_set10.png`,
  ];
  
  // Fallback image - generic item icon from TFT Tactics
  const fallbackUrl = 'https://cdn.tft.tools/items/deathblade.png';
  
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
      // Try next source
      setCurrentSourceIndex(nextIndex);
    } else {
      // All sources failed, use fallback text
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
