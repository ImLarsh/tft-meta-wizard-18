
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
  
  useEffect(() => {
    setCurrentSourceIndex(0);
    setImgError(false);
  }, [name]);
  
  // Format the item name for wiki URL
  const formatNameForWiki = (itemName: string) => {
    return itemName
      .replace(/'/g, '%27') // Replace apostrophes with URL encoding
      .replace(/\s+/g, '_'); // Replace spaces with underscores
  };
  
  // Format for other sources
  const dashedName = name
    .toLowerCase()
    .replace(/[']/g, '') // Remove apostrophes
    .replace(/\s+/g, '-'); // Replace spaces with dashes
  
  // For sources that use simple names
  const simplifiedName = name
    .toLowerCase()
    .replace(/[']/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  // Display name for fallback text
  const displayName = name.replace(/([A-Z])/g, ' $1').trim();
  
  // Get the formatted name for wiki URL
  const wikiName = formatNameForWiki(name);
  
  // Special mappings for commonly confused item names
  const specialWikiMappings: Record<string, string> = {
    "Bloodthirster": "Bloodthirster_TFT_item",
    "Blue Buff": "Blue_Buff_TFT_item",
    "Jeweled Gauntlet": "Jeweled_Gauntlet_TFT_item",
    "Giant Slayer": "Giant_Slayer_TFT_item",
    "Infinity Edge": "Infinity_Edge_TFT_item",
    "Deathblade": "Deathblade_TFT_item",
    "Spear of Shojin": "Spear_of_Shojin_TFT_item",
    "Rapid Firecannon": "Rapid_Firecannon_TFT_item",
    "Runaan's Hurricane": "Runaan%27s_Hurricane_TFT_item",
    "Guinsoo's Rageblade": "Guinsoo%27s_Rageblade_TFT_item",
    "Dragon's Claw": "Dragon%27s_Claw_TFT_item",
    "Titan's Resolve": "Titan%27s_Resolve_TFT_item"
  };
  
  // Get the correct wiki file name
  const wikiFileName = specialWikiMappings[name] || `${wikiName}_TFT_item`;
  
  // Image sources in priority order
  const sources = [
    // Primary source: LoL Wiki with revision/latest
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/archive/${wikiFileName}.png/120px-${wikiFileName}.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/archive/${wikiFileName}.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/${wikiFileName}.png/revision/latest`,
    
    // Secondary sources
    `https://tftactics.gg/img/items/${dashedName}.png`,
    `https://cdn.metatft.com/file/metatft/items/${dashedName}.png`,
    `https://rerollcdn.com/items/${simplifiedName}.png`,
    `https://raw.communitydragon.org/latest/game/assets/items/icons/${dashedName}.png`,
    `https://tft.mobalytics.gg/images/items/${simplifiedName}.png`,
    `https://lolchess.gg/images/tft/items/${dashedName}.png`
  ];
  
  // Guaranteed fallback image (Bloodthirster direct link)
  const fallbackUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/6/66/Bloodthirster_TFT_item.png/revision/latest';
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const handleImageError = () => {
    console.log(`Image source failed for ${name} at index ${currentSourceIndex}: ${sources[currentSourceIndex]}`);
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < sources.length) {
      setCurrentSourceIndex(nextIndex);
    } else {
      console.log(`All image sources failed for ${name}, using fallback text`);
      setImgError(true);
    }
  };
  
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
