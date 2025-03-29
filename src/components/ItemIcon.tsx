
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
  
  // Format the item name for various URL formats
  const formatNameForUrl = (itemName: string) => {
    // Replace spaces with underscores and handle special characters
    return itemName
      .replace(/'/g, '')  // Remove apostrophes
      .replace(/\s+/g, '_'); // Replace spaces with underscores
  };
  
  // Format for dash-separated sources
  const dashedName = name
    .toLowerCase()
    .replace(/[']/g, '') // Remove apostrophes
    .replace(/\s+/g, '-'); // Replace spaces with dashes
  
  // For sources that don't use dashes or spaces
  const compactName = name
    .toLowerCase()
    .replace(/[']/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  // Display name for fallback text
  const displayName = name.replace(/([A-Z])/g, ' $1').trim();
  
  // Common item name mappings for consistent URL formatting
  const specialCaseMap: Record<string, string> = {
    "Bloodthirster": "bloodthirster",
    "Blue Buff": "bluebuff",
    "Jeweled Gauntlet": "jeweledgauntlet",
    "Giant Slayer": "giantslayer",
    "Spear of Shojin": "spearofshojin",
    "Guinsoo's Rageblade": "guinsoosrageblade",
    "Infinity Edge": "infinityedge",
    "Rapid Firecannon": "rapidfirecannon",
    "Runaan's Hurricane": "runaanshurricane",
    "Titan's Resolve": "titansresolve",
    "Hand of Justice": "handofjustice",
    "Quicksilver": "quicksilver",
    "Ionic Spark": "ionicspark",
    "Last Whisper": "lastwhisper",
    "Sunfire Cape": "sunfirecape",
    "Warmog's Armor": "warmogsarmor",
    "Hextech Gunblade": "hextechgunblade",
    "Bramble Vest": "bramblevest",
    "Dragon's Claw": "dragonsclaw",
    "Zeke's Herald": "zekesherald",
    "Zz'Rot Portal": "zzrotportal",
    "Gargoyle Stoneplate": "gargoylestoneplate",
    "Chalice of Power": "chaliceofpower",
    "Statikk Shiv": "statikkshiv",
    "Redemption": "redemption",
    "Shroud of Stillness": "shroudofstillness",
    "Banshee's Claw": "bansheesclaw",
    "Thief's Gloves": "thiefsgloves",
    "Archangel's Staff": "archangelsstaff",
    "Morellonomicon": "morellonomicon",
    "Deathblade": "deathblade",
    "Frozen Heart": "frozenheart",
    "Spirit Visage": "spiritvisage",
    "Edge of Night": "edgeofnight",
  };
  
  // Get the simplified name for URL
  const simplifiedName = specialCaseMap[name] || compactName;
  const formattedName = formatNameForUrl(name);
  
  // Image sources in priority order
  const sources = [
    // Direct link to Fandom wiki image for Bloodthirster and other items
    `https://static.wikia.nocookie.net/leagueoflegends/images/6/66/${formattedName}_TFT_item.png`,
    
    // League of Legends Fandom wiki - more reliable transparent images
    `https://static.wikia.nocookie.net/leagueoflegends/images/6/66/${formattedName}_TFT_item.png/revision/latest?cb=20190925202641`,
    
    // TFT specific sites
    `https://cdn.metatft.com/file/metatft/items/${dashedName}.png`,
    `https://tftactics.gg/itemicons/${simplifiedName}.png`,
    `https://rerollcdn.com/items/${simplifiedName}.png`,
    `https://tactics.tools/img/items/${dashedName}.png`,
    
    // Community Dragon source - reliable for some items
    `https://raw.communitydragon.org/latest/game/assets/items/icons/${dashedName}.png`,
    
    // Try with various patterns from external sites
    `https://tft.mobalytics.gg/images/items/${simplifiedName}.png`,
    `https://lolchess.gg/images/tft/items/${dashedName}.png`,
    `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${compactName}.png`,
  ];
  
  // Fallback item image that's very likely to exist
  const fallbackUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/6/66/Deathblade_TFT_item.png';
  
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
