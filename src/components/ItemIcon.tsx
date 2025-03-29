
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
  
  // Item name mapping for LoL Fandom wiki
  const wikiNameMap: Record<string, string> = {
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
    "Quicksilver": "Quicksilver",
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
  
  // Use the wiki name mapping if available or create a properly formatted wiki name
  const getWikiName = (itemName: string) => {
    if (wikiNameMap[itemName]) {
      return wikiNameMap[itemName];
    }
    
    // Format for wiki URL: replace spaces with underscores and encode special characters
    return itemName
      .replace(/\s+/g, '_')
      .replace(/'/g, '%27');
  };
  
  const wikiName = getWikiName(name);
  
  // Special case mapping for other sources
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
  
  // Updated sources with enhanced LoL Fandom wiki URLs
  const sources = [
    // Primary LoL Fandom wiki sources with different URL patterns
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/e/e6/${wikiName}_TFT_item.png/64px-${wikiName}_TFT_item.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/e/e6/${wikiName}_TFT_item.png`,
    
    // Alternative formats from the wiki
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/e/e6/${wikiName}.png/64px-${wikiName}.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/e/e6/${wikiName}.png`,
    
    // Try with different hash values
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/1/1b/${wikiName}_TFT_item.png/64px-${wikiName}_TFT_item.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/1/1b/${wikiName}_TFT_item.png`,
    
    // TFT Set 10 specific sources as fallbacks
    `https://raw.communitydragon.org/latest/game/assets/items/icons/${specialCaseName.toLowerCase()}.png`,
    `https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/${specialCaseName.toLowerCase()}.png`,
    
    // Other fallback sources
    `https://tftactics.gg/cdn-cgi/image/width=160,height=160/itemicons/${specialCaseName.toLowerCase()}.png`,
    `https://www.mobafire.com/images/tft/item/${specialCaseName}.png`,
    `https://lolchess.gg/images/tft/items/${specialCaseName}.png`,
  ];
  
  // Use Deathblade as fallback that's likely to exist
  const fallbackUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/thumb/e/e6/Deathblade_TFT_item.png/64px-Deathblade_TFT_item.png';
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const handleImageError = () => {
    console.log(`Image error for item: ${name}, trying next source (${currentSourceIndex + 1}/${sources.length})`);
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < sources.length) {
      setCurrentSourceIndex(nextIndex);
    } else {
      console.log(`All sources failed for item: ${name}, using fallback display`);
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
