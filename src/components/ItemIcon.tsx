
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
  
  // Normalize the item name for URL usage
  const normalizedName = name
    .toLowerCase()
    .replace(/[']/g, '') // Remove apostrophes
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, ''); // Remove other special characters
  
  // Alternative without dashes
  const normalizedNameNoDashes = name
    .toLowerCase()
    .replace(/[']/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  // Basic display name formatting
  const displayName = name.replace(/([A-Z])/g, ' $1').trim();
  
  // Special case mapping (exact matches that might have different image names)
  const specialCaseMap: Record<string, string> = {
    "Blue Buff": "bluebuff",
    "Jeweled Gauntlet": "jeweled-gauntlet",
    "Giant Slayer": "giant-slayer",
    "Spear of Shojin": "spear-of-shojin",
    "Guinsoo's Rageblade": "guinsoos-rageblade",
    "Infinity Edge": "infinity-edge",
    "Rapid Firecannon": "rapid-firecannon",
    "Runaan's Hurricane": "runaans-hurricane",
    "Titan's Resolve": "titans-resolve",
    "Hand of Justice": "hand-of-justice",
    "Bloodthirster": "bloodthirster",
    "Quicksilver": "quicksilver",
    "Ionic Spark": "ionic-spark",
    "Last Whisper": "last-whisper",
    "Sunfire Cape": "sunfire-cape",
    "Warmog's Armor": "warmogs-armor",
    "Death's Defiance": "deaths-defiance",
    "Hextech Gunblade": "hextech-gunblade",
    "Bramble Vest": "bramble-vest",
    "Dragon's Claw": "dragons-claw",
    "Zeke's Herald": "zekes-herald",
    "Zz'Rot Portal": "zzrot-portal",
    "Gargoyle Stoneplate": "gargoyle-stoneplate",
    "Chalice of Power": "chalice-of-power",
    "Locket of the Iron Solari": "locket-of-the-iron-solari",
    "Statikk Shiv": "statikk-shiv",
    "Redemption": "redemption",
    "Shroud of Stillness": "shroud-of-stillness",
    "Banshee's Claw": "banshees-claw",
    "Thief's Gloves": "thiefs-gloves",
    "Archangel's Staff": "archangels-staff",
    "Morellonomicon": "morellonomicon",
    "Deathblade": "deathblade",
    "Frozen Heart": "frozen-heart",
    "Spirit Visage": "spirit-visage",
    "Edge of Night": "edge-of-night",
  };
  
  // Use the special case mapping if available
  const specialCaseName = specialCaseMap[name] || normalizedName;
  
  // Add more reliable image sources
  const sources = [
    // TFT Set 10 specific sources
    `https://raw.communitydragon.org/latest/game/assets/items/icons/${specialCaseName.toLowerCase()}.png`,
    
    // Riot Community Dragon
    `https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/${specialCaseName.toLowerCase()}.png`,
    
    // TFTactics.gg
    `https://tftactics.gg/cdn-cgi/image/width=160,height=160/itemicons/${specialCaseName.toLowerCase()}.png`,
    
    // Mobafire sources
    `https://www.mobafire.com/images/tft/item/${specialCaseName}.png`,
    `https://www.mobafire.com/images/tft/item/${normalizedName}.png`,
    `https://www.mobafire.com/images/tft/item/${normalizedNameNoDashes}.png`,
    
    // Alternate sources
    `https://cdn.metatft.com/file/metatft/items/${specialCaseName}.png`,
    `https://cdn.metatft.com/file/metatft/items/${normalizedName}.png`,
    `https://cdn.metatft.com/file/metatft/items/${normalizedNameNoDashes}.png`,
    
    // More fallback sources  
    `https://cdn.tft.tools/items/${specialCaseName}.png`,
    `https://cdn.tft.tools/items/${normalizedName}.png`,
    `https://cdn.tft.tools/items/${normalizedNameNoDashes}.png`,
    
    // Tactics.tools
    `https://tactics.tools/img/items/${specialCaseName}.png`,
    `https://tactics.tools/img/items/${normalizedName}.png`,
    `https://tactics.tools/img/items/${normalizedNameNoDashes}.png`,
    
    // Lolchess
    `https://lolchess.gg/images/tft/items/${specialCaseName}.png`,
    `https://lolchess.gg/images/tft/items/${normalizedName}.png`,
  ];
  
  // Use a common item as fallback that's likely to exist
  const fallbackUrl = 'https://raw.communitydragon.org/latest/game/assets/items/icons/deathblade.png';
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const handleImageError = () => {
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < sources.length) {
      setCurrentSourceIndex(nextIndex);
    } else {
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
