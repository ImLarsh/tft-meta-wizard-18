
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ItemIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

const ItemIcon: React.FC<ItemIconProps> = ({ 
  name, 
  size = 'md',
  className,
  showTooltip = true
}) => {
  const [imgError, setImgError] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  // Reset error state when name changes
  useEffect(() => {
    setImgError(false);
    setCurrentSourceIndex(0);
  }, [name]);
  
  // Size classes for the icon container
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  // Format the item name for URL usage
  const formatItemId = (itemName: string): string => {
    // Map of common TFT item names to their item IDs
    const itemIdMap: Record<string, string> = {
      "Infinity Edge": "3031",
      "Giant Slayer": "3036",
      "Rapid Firecannon": "3094",
      "Runaan's Hurricane": "3085",
      "Guinsoo's Rageblade": "3124",
      "Bloodthirster": "3072",
      "Titan's Resolve": "3022",
      "Blue Buff": "3070",
      "Spear of Shojin": "3161",
      "Archangel's Staff": "3003",
      "Morellonomicon": "3165",
      "Sunfire Cape": "3068",
      "Warmog's Armor": "3083",
      "Dragon's Claw": "3156",
      "Gargoyle Stoneplate": "3193",
      "Redemption": "3107",
      "Hand of Justice": "3158",
      "Guardian Angel": "3026",
      "Jeweled Gauntlet": "3177",
      "Rabadon's Deathcap": "3089",
      "Zeke's Herald": "3050",
      "Ionic Spark": "3100",
      "Zz'Rot Portal": "3512",
      "Chalice of Power": "3222",
      "Thieves' Gloves": "3123",
      "Shroud of Stillness": "3190",
      "Banshee's Claw": "3102",
      "Last Whisper": "3035",
      "Statikk Shiv": "3087",
      "Bramble Vest": "3075",
      "Quicksilver": "3139",
      "Locket of the Iron Solari": "3190",
    };

    return itemIdMap[itemName] || "";
  };
  
  // Clean item name for URL paths
  const getCleanItemName = (itemName: string): string => {
    return itemName
      .replace(/'/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  };
  
  // Get item sources in order of reliability
  const getItemSources = (itemName: string): string[] => {
    const cleanName = getCleanItemName(itemName);
    const itemId = formatItemId(itemName);
    const displayName = itemName.replace(/'/g, '');
    
    return [
      // Riot Data Dragon - current patch (if item ID available)
      ...(itemId ? [
        `https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/${itemId}.png`,
        `https://ddragon.leagueoflegends.com/cdn/latest/img/item/${itemId}.png`,
      ] : []),
      
      // TFT-specific sources
      `https://rerollcdn.com/items/${cleanName.replace(/_/g, '')}.png`,
      `https://cdn.metatft.com/file/metatft/items/${cleanName}.png`,
      
      // Community Dragon and Wiki sources
      `https://raw.communitydragon.org/latest/game/assets/items/icons/${cleanName}.png`,
      `https://raw.communitydragon.org/latest/game/assets/items/icons/${cleanName.replace(/_/g, '')}.png`,
      
      // Mobalytics
      `https://cdn.mobalytics.gg/assets/tft/images/items/${cleanName}.png`,
      `https://cdn.mobalytics.gg/assets/tft/images/items/${cleanName.replace(/_/g, '')}.png`,
      
      // League Wiki specific pattern
      `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/9/9d/${displayName.replace(/\s+/g, '_')}_TFT_item.png/revision/latest/scale-to-width-down/42?cb=20190708222736`,
      
      // TFT Tactics
      `https://cdn.tft.tools/items/${cleanName.replace(/_/g, '')}.png`,
      
      // General Pattern
      `https://rerollcdn.com/items/${cleanName.replace(/_/g, '')}.png`
    ];
  };

  const sources = getItemSources(name);
  
  // Fallback (always use a reliable default image)
  const fallbackUrl = 'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/3089.png';
  
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
  
  // Display name for fallback text, used if images fail to load
  const displayName = name.length > 12 ? name.substring(0, 10) + '...' : name;

  const icon = (
    <div 
      className={cn(
        sizeClasses[size],
        'rounded overflow-hidden relative border border-border/50 shadow-sm bg-secondary/30',
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
          src={sources[currentSourceIndex] || fallbackUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
          title={name}
        />
      )}
    </div>
  );
  
  if (!showTooltip) {
    return icon;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {icon}
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ItemIcon;
