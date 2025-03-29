
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
  
  // Multiple image sources to try with different naming patterns
  const mobalyticsUrl = `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedName.toLowerCase()}.png`;
  const mobalyticsItemsUrl = `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedName.toLowerCase()}.png`;
  const metaTftUrl = `https://cdn.metatft.com/file/metatft/items/${normalizedName.toLowerCase()}.png`;
  const rerollUrl = `https://rerollcdn.com/items/${normalizedName.toLowerCase()}.png`;
  const ddragonUrl = `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${normalizedName.toLowerCase()}.png`;
  const communityDragonUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${normalizedName.toLowerCase()}.png`;
  
  // Fallback image - use a generic placeholder
  const fallbackUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=30&h=30&fit=crop&auto=format';
  
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    // Try each fallback source in sequence
    if (target.src === mobalyticsUrl) {
      console.log(`First source failed for item ${name}, trying source 2`);
      target.src = mobalyticsItemsUrl;
    } else if (target.src === mobalyticsItemsUrl) {
      console.log(`Second source failed for item ${name}, trying source 3`);
      target.src = metaTftUrl;
    } else if (target.src === metaTftUrl) {
      console.log(`Third source failed for item ${name}, trying source 4`);
      target.src = rerollUrl;
    } else if (target.src === rerollUrl) {
      console.log(`Fourth source failed for item ${name}, trying source 5`);
      target.src = ddragonUrl;
    } else if (target.src === ddragonUrl) {
      console.log(`Fifth source failed for item ${name}, trying source 6`);
      target.src = communityDragonUrl;
    } else {
      console.log(`All image sources failed for item ${name}, using fallback`);
      setImgError(true);
      target.src = fallbackUrl;
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
          src={mobalyticsUrl}
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
