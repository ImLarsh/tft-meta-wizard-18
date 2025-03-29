
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
  
  // Standard format (no spaces, lowercase)
  const normalizedName = name
    .replace(/\s+/g, '') // Remove spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]/g, ''); // Remove special characters
  
  // Kebab case format (spaces to dashes, lowercase)
  const normalizedNameKebab = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
    
  // Camel case format
  const normalizedNameCamelCase = name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index === 0 ? letter.toLowerCase() : letter.toUpperCase())
    .replace(/\s+/g, '');
  
  // Simple normalized (lowercase, no spaces or special chars, remove trailing 's')
  const normalizedNameSimple = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/s$/, ''); // Sometimes items like "Guinsoo's" are stored as "guinsoo"
    
  const displayName = name.replace(/([A-Z])/g, ' $1').trim(); 
  
  // Expanded special cases with more variations
  const specialCaseNames: Record<string, string[]> = {
    "Blue Buff": ["bluebuff", "blue", "blue-buff", "bluebuff", "blue_buff"],
    "Jeweled Gauntlet": ["jeweledgauntlet", "gauntlet", "jewelgauntlet", "jeweled-gauntlet", "jeweled_gauntlet", "jg"],
    "Giant Slayer": ["giantslayer", "giant", "giant-slayer", "giant_slayer", "gs"],
    "Spear of Shojin": ["spearofshojin", "shojin", "spear", "spear-of-shojin", "spear_of_shojin", "sos"],
    "Guinsoo's Rageblade": ["guinsoosrageblade", "guinsoo", "rageblade", "guinsoos-rageblade", "guinsoos_rageblade", "guinsoos"],
    "Infinity Edge": ["infinityedge", "ie", "infinity-edge", "infinity_edge", "infinity", "edge"],
    "Rapid Firecannon": ["rapidfirecannon", "rfc", "rapid-firecannon", "rapid_firecannon", "firecannon", "cannon"],
    "Runaan's Hurricane": ["runaanshurricane", "runaan", "hurricane", "runaans-hurricane", "runaans_hurricane", "runaans"],
    "Titan's Resolve": ["titansresolve", "titan", "resolve", "titans-resolve", "titans_resolve", "titans"],
    "Hand of Justice": ["handofjustice", "hoj", "justice", "hand-of-justice", "hand_of_justice", "hand"],
    "Bloodthirster": ["bloodthirster", "bt", "blood-thirster", "blood_thirster", "blood"],
    "Quicksilver": ["quicksilver", "qss", "quick-silver", "quick_silver", "silver"],
    "Ionic Spark": ["ionicspark", "ionic", "spark", "ionic-spark", "ionic_spark"],
    "Last Whisper": ["lastwhisper", "lw", "last-whisper", "last_whisper", "whisper"],
    "Sunfire Cape": ["sunfirecape", "sunfire", "cape", "sunfire-cape", "sunfire_cape"],
    "Warmog's Armor": ["warmogsarmor", "warmogs", "armor", "warmogs-armor", "warmogs_armor", "warmog"],
    "Death's Defiance": ["deathsdefiance", "deaths", "defiance", "deaths-defiance", "deaths_defiance", "death"],
    "Hextech Gunblade": ["hextechgunblade", "hextech", "gunblade", "hextech-gunblade", "hextech_gunblade"],
    "Bramble Vest": ["bramblevest", "bramble", "vest", "bramble-vest", "bramble_vest"],
    "Dragon's Claw": ["dragonsclaw", "dragon", "claw", "dragons-claw", "dragons_claw"],
    "Zeke's Herald": ["zekesherald", "zekes", "herald", "zekes-herald", "zekes_herald", "zeke"],
    "Zz'Rot Portal": ["zzrotportal", "zzrot", "portal", "zzrot-portal", "zzrot_portal"],
    "Gargoyle Stoneplate": ["gargoylestoneplate", "gargoyle", "stoneplate", "gargoyle-stoneplate", "gargoyle_stoneplate"],
    "Chalice of Power": ["chaliceofpower", "chalice", "power", "chalice-of-power", "chalice_of_power"],
    "Locket of the Iron Solari": ["locketoftheironsolari", "locket", "solari", "locket-of-the-iron-solari", "locket_of_the_iron_solari"],
    "Statikk Shiv": ["statikkshiv", "statikk", "shiv", "statikk-shiv", "statikk_shiv"],
    "Redemption": ["redemption", "redeem", "redemp", "redempt"],
    "Shroud of Stillness": ["shroudofstillness", "shroud", "stillness", "shroud-of-stillness", "shroud_of_stillness"],
    "Banshee's Claw": ["bansheesclaw", "banshee", "claw", "banshees-claw", "banshees_claw"],
    "Thief's Gloves": ["thiefsgloves", "thief", "gloves", "thiefs-gloves", "thiefs_gloves"],
    "Archangel's Staff": ["archangelsstaff", "archangel", "staff", "archangels-staff", "archangels_staff"],
    "Morellonomicon": ["morellonomicon", "morello", "nomicon", "morello-nomicon", "morello_nomicon"],
    "Deathblade": ["deathblade", "death", "blade", "death-blade", "death_blade"],
    "Frozen Heart": ["frozenheart", "frozen", "heart", "frozen-heart", "frozen_heart"],
    "Spirit Visage": ["spiritvisage", "spirit", "visage", "spirit-visage", "spirit_visage"],
    "Edge of Night": ["edgeofnight", "edge", "night", "edge-of-night", "edge_of_night"],
  };
  
  const specialCaseVariations = specialCaseNames[name] || [];
  
  // Prioritize Mobafire and reorder the sources list
  const sources = [
    // Mobafire sources (prioritized)
    `https://www.mobafire.com/images/tft/item/${normalizedNameKebab}.png`,
    `https://www.mobafire.com/images/tft/item/${normalizedName}.png`,
    
    // TFT Tools variations
    `https://cdn.tft.tools/items/${normalizedNameKebab}.png`,
    `https://cdn.tft.tools/items/${normalizedName}.png`,
    
    // Special case variations for TFT Tools
    ...specialCaseVariations.map(variant => `https://cdn.tft.tools/items/${variant}.png`),
    
    // TFT Tactics variations
    `https://tactics.tools/img/items/${normalizedNameKebab}.png`, 
    `https://tactics.tools/img/items/${normalizedName}.png`,
    `https://www.tftactics.gg/cdn-cgi/image/width=86,height=86,fit=cover,gravity=0.5x0.5/tft/items/${normalizedNameKebab}.png`,
    `https://www.tftactics.gg/cdn-cgi/image/width=86,height=86,fit=cover,gravity=0.5x0.5/tft/items/${normalizedName}.png`,
    
    // Mobalytics variations
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedNameKebab}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedNameKebab}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/${normalizedNameCamelCase}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/${normalizedNameCamelCase}.png`,
    
    // Community Dragon variations
    `https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/standard/${normalizedNameKebab}.png`,
    `https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/standard/${normalizedName}.png`,
    
    // Additional variations with special cases
    ...specialCaseVariations.map(variant => `https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/standard/${variant}.png`),
    
    // Additional Mobalytics prefixed variations
    `https://cdn.mobalytics.gg/assets/tft/images/items/set10/tft10_${normalizedNameKebab}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/tft_${normalizedNameKebab}.png`,
    
    // MetaTFT and Reroll variations
    `https://cdn.metatft.com/file/metatft/items/${normalizedNameKebab}.png`,
    `https://cdn.metatft.com/file/metatft/items/${normalizedNameSimple}.png`,
    `https://rerollcdn.com/items/${normalizedNameKebab}.png`,
    `https://rerollcdn.com/items/${normalizedName}.png`,
  ];
  
  const fallbackUrl = 'https://cdn.tft.tools/items/deathblade.png';
  
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
      console.log(`All sources failed for ${name}. Tried these variations:`, { 
        original: name,
        kebab: normalizedNameKebab,
        standard: normalizedName,
        camelCase: normalizedNameCamelCase,
        simple: normalizedNameSimple
      });
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
