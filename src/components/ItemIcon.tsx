
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
  
  // Format the item name for LoL Fandom wiki URL
  const formatNameForFandom = (itemName: string) => {
    // Replace spaces with underscores and handle special characters
    return itemName
      .replace(/'/g, '%27')  // Replace apostrophes with URL encoding
      .replace(/\s+/g, '_'); // Replace spaces with underscores
  };
  
  // Format for other sources as fallback
  const normalizedName = name
    .toLowerCase()
    .replace(/[']/g, '') // Remove apostrophes
    .replace(/\s+/g, '-'); // Replace spaces with dashes
  
  // For fallback sources that don't use dashes
  const normalizedNameNoDashes = name
    .toLowerCase()
    .replace(/[']/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  // Display name for fallback text
  const displayName = name.replace(/([A-Z])/g, ' $1').trim();
  
  // Common item name mappings for consistent URL formatting
  const specialCaseMap: Record<string, string> = {
    "Blue Buff": "Blue_Buff",
    "Jeweled Gauntlet": "Jeweled_Gauntlet",
    "Giant Slayer": "Giant_Slayer",
    "Spear of Shojin": "Spear_of_Shojin",
    "Guinsoo's Rageblade": "Guinsoo%27s_Rageblade",
    "Infinity Edge": "Infinity_Edge",
    "Rapid Firecannon": "Rapid_Firecannon",
    "Runaan's Hurricane": "Runaan%27s_Hurricane",
    "Titan's Resolve": "Titan%27s_Resolve",
    "Hand of Justice": "Hand_of_Justice",
    "Bloodthirster": "Bloodthirster",
    "Quicksilver": "Quicksilver_Sash", // Note: Full name might be needed
    "Ionic Spark": "Ionic_Spark",
    "Last Whisper": "Last_Whisper",
    "Sunfire Cape": "Sunfire_Cape",
    "Warmog's Armor": "Warmog%27s_Armor",
    "Death's Defiance": "Death%27s_Defiance",
    "Hextech Gunblade": "Hextech_Gunblade",
    "Bramble Vest": "Bramble_Vest",
    "Dragon's Claw": "Dragon%27s_Claw",
    "Zeke's Herald": "Zeke%27s_Herald",
    "Zz'Rot Portal": "Zz%27Rot_Portal",
    "Gargoyle Stoneplate": "Gargoyle_Stoneplate",
    "Chalice of Power": "Chalice_of_Power",
    "Locket of the Iron Solari": "Locket_of_the_Iron_Solari",
    "Statikk Shiv": "Statikk_Shiv",
    "Redemption": "Redemption",
    "Shroud of Stillness": "Shroud_of_Stillness",
    "Banshee's Claw": "Banshee%27s_Claw",
    "Thief's Gloves": "Thief%27s_Gloves",
    "Archangel's Staff": "Archangel%27s_Staff",
    "Morellonomicon": "Morellonomicon",
    "Deathblade": "Deathblade",
    "Frozen Heart": "Frozen_Heart",
    "Spirit Visage": "Spirit_Visage",
    "Edge of Night": "Edge_of_Night",
  };
  
  // Get the formatted name for wiki URL
  const wikiName = specialCaseMap[name] || formatNameForFandom(name);
  
  // Image sources in priority order
  const sources = [
    // LoL Fandom TFT item icons - primary source
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/5/55/${wikiName}_TFT_item.png/64px-${wikiName}_TFT_item.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/5/55/${wikiName}_TFT_item.png`,
    
    // Try with different resolutions
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/5/55/${wikiName}_TFT_item.png/120px-${wikiName}_TFT_item.png`,
    
    // Try with slightly different naming patterns
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/5/55/${wikiName}_TFT.png/64px-${wikiName}_TFT.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/5/55/TFT_${wikiName}.png/64px-TFT_${wikiName}.png`,
    
    // Try standard image name without specifying thumbnail
    `https://static.wikia.nocookie.net/leagueoflegends/images/5/55/${wikiName}_TFT_item.png`,
    
    // Fallback to older reliable sources
    `https://raw.communitydragon.org/latest/game/assets/items/icons/${normalizedName.toLowerCase()}.png`,
    `https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/${normalizedName.toLowerCase()}.png`,
    `https://tftactics.gg/cdn-cgi/image/width=160,height=160/itemicons/${normalizedName.toLowerCase()}.png`,
    `https://www.mobafire.com/images/tft/item/${normalizedName}.png`,
    `https://cdn.metatft.com/file/metatft/items/${normalizedName}.png`,
    `https://tactics.tools/img/items/${normalizedName}.png`,
    `https://lolchess.gg/images/tft/items/${normalizedName}.png`,
  ];
  
  // Fallback item image that's likely to exist
  const fallbackUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/thumb/5/55/Deathblade_TFT_item.png/64px-Deathblade_TFT_item.png';
  
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
          src={sources[currentSourceIndex]}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
          title={name}
          crossOrigin="anonymous"
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
