
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
  
  // Create multiple normalizations to increase chances of finding the image
  const normalizedName = name
    .replace(/\s+/g, '') // Remove spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]/g, ''); // Remove special characters
  
  // Create alternative normalizations for items with specific naming conventions
  const normalizedNameCamelCase = name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index === 0 ? letter.toLowerCase() : letter.toUpperCase())
    .replace(/\s+/g, '');
  
  // For items with apostrophes like "Guinsoo's"
  const normalizedNameSimple = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/s$/, ''); // Sometimes items like "Guinsoo's" are stored as "guinsoo"
    
  // For display purposes in fallback
  const displayName = name.replace(/([A-Z])/g, ' $1').trim(); 
  
  // Special cases for common items with known issues
  let specialCaseNames = {
    "Blue Buff": ["bluebuff", "blue"],
    "Jeweled Gauntlet": ["jeweledgauntlet", "gauntlet", "jewelgauntlet"],
    "Giant Slayer": ["giantslayer", "giant"],
    "Spear of Shojin": ["spearofshojin", "shojin", "spear"],
    "Guinsoo's Rageblade": ["guinsoosrageblade", "guinsoo", "rageblade"],
    "Infinity Edge": ["infinityedge", "ie"],
    "Rapid Firecannon": ["rapidfirecannon", "rfc"],
    "Runaan's Hurricane": ["runaanshurricane", "runaan", "hurricane"],
    "Titan's Resolve": ["titansresolve", "titan", "resolve"],
    "Hand of Justice": ["handofjustice", "hoj", "justice"],
  };
  
  // Generate a list of specific variations for known problematic items
  const specialCaseVariations = specialCaseNames[name as keyof typeof specialCaseNames] || [];
  
  // Primary source from TFT Tactics
  const tftTacticsUrl = `https://cdn.tft.tools/items/${normalizedName}.png`;
  
  // Comprehensive list of image sources to try with different naming patterns
  const sources = [
    // Primary TFT Tactics source with multiple normalizations
    tftTacticsUrl,
    ...specialCaseVariations.map(variant => `https://cdn.tft.tools/items/${variant}.png`),
    
    // Alternative TFT Tactics format
    `https://www.tftactics.gg/cdn-cgi/image/width=86,height=86,fit=cover,gravity=0.5x0.5/tft/items/${normalizedName}.png`,
    ...specialCaseVariations.map(variant => `https://www.tftactics.gg/cdn-cgi/image/width=86,height=86,fit=cover,gravity=0.5x0.5/tft/items/${variant}.png`),
    
    // Primary Mobalytics sources with multiple normalizations
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedNameCamelCase}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedNameCamelCase}.png`,
    
    // Alternative item naming schemes for Mobalytics
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/tft10_${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/tft_${normalizedName}.png`,
    
    // MetaTFT and Reroll with multiple normalizations
    `https://cdn.metatft.com/file/metatft/items/${normalizedName}.png`,
    `https://cdn.metatft.com/file/metatft/items/${normalizedNameSimple}.png`,
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
