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
  
  const normalizedName = name
    .replace(/\s+/g, '') // Remove spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]/g, ''); // Remove special characters
  
  const normalizedNameKebab = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
    
  const normalizedNameCamelCase = name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index === 0 ? letter.toLowerCase() : letter.toUpperCase())
    .replace(/\s+/g, '');
  
  const normalizedNameSimple = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/s$/, ''); // Sometimes items like "Guinsoo's" are stored as "guinsoo"
    
  const displayName = name.replace(/([A-Z])/g, ' $1').trim(); 
  
  const specialCaseNames: Record<string, string[]> = {
    "Blue Buff": ["bluebuff", "blue", "blue-buff"],
    "Jeweled Gauntlet": ["jeweledgauntlet", "gauntlet", "jewelgauntlet", "jeweled-gauntlet"],
    "Giant Slayer": ["giantslayer", "giant", "giant-slayer"],
    "Spear of Shojin": ["spearofshojin", "shojin", "spear", "spear-of-shojin"],
    "Guinsoo's Rageblade": ["guinsoosrageblade", "guinsoo", "rageblade", "guinsoos-rageblade"],
    "Infinity Edge": ["infinityedge", "ie", "infinity-edge"],
    "Rapid Firecannon": ["rapidfirecannon", "rfc", "rapid-firecannon"],
    "Runaan's Hurricane": ["runaanshurricane", "runaan", "hurricane", "runaans-hurricane"],
    "Titan's Resolve": ["titansresolve", "titan", "resolve", "titans-resolve"],
    "Hand of Justice": ["handofjustice", "hoj", "justice", "hand-of-justice"],
    "Bloodthirster": ["bloodthirster", "bt"],
    "Quicksilver": ["quicksilver", "qss"],
    "Ionic Spark": ["ionicspark", "ionic", "spark", "ionic-spark"],
    "Last Whisper": ["lastwhisper", "lw", "last-whisper"],
    "Sunfire Cape": ["sunfirecape", "sunfire", "cape", "sunfire-cape"],
    "Warmog's Armor": ["warmogsarmor", "warmogs", "armor", "warmogs-armor"],
    "Death's Defiance": ["deathsdefiance", "deaths", "defiance", "deaths-defiance"],
    "Hextech Gunblade": ["hextechgunblade", "hextech", "gunblade", "hextech-gunblade"],
  };
  
  const specialCaseVariations = specialCaseNames[name] || [];
  
  const sources = [
    `https://cdn.tft.tools/items/${normalizedName}.png`,
    `https://cdn.tft.tools/items/${normalizedNameKebab}.png`,
    ...specialCaseVariations.map(variant => `https://cdn.tft.tools/items/${variant}.png`),
    
    `https://www.tftactics.gg/cdn-cgi/image/width=86,height=86,fit=cover,gravity=0.5x0.5/tft/items/${normalizedName}.png`,
    `https://www.tftactics.gg/cdn-cgi/image/width=86,height=86,fit=cover,gravity=0.5x0.5/tft/items/${normalizedNameKebab}.png`,
    ...specialCaseVariations.map(variant => `https://www.tftactics.gg/cdn-cgi/image/width=86,height=86,fit=cover,gravity=0.5x0.5/tft/items/${variant}.png`),
    
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedNameCamelCase}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedNameCamelCase}.png`,
    
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/tft10_${normalizedName}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/tft_${normalizedName}.png`,
    
    `https://cdn.metatft.com/file/metatft/items/${normalizedName}.png`,
    `https://cdn.metatft.com/file/metatft/items/${normalizedNameSimple}.png`,
    `https://rerollcdn.com/items/${normalizedName}.png`,
    `https://rerollcdn.com/items/${normalizedNameKebab}.png`,
    
    `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${normalizedName}.png`,
    `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${normalizedName}.png`,
    
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${normalizedName}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons/standard/${normalizedName}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons/set10/${normalizedName}.png`,
    `https://raw.communitydragon.org/pbe/game/assets/items/icons2d/tft_item_${normalizedName}.tft_set10.png`,
  ];
  
  const fallbackUrl = 'https://cdn.tft.tools/items/deathblade.png';
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const handleImageError = () => {
    console.log(`Source ${currentSourceIndex} failed for ${name}, trying source ${currentSourceIndex + 1}`);
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
