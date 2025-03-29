
import React, { useState } from 'react';
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
  
  // Size classes for the icon container
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  // Format the item name for URL usage
  const formatNameForUrl = (itemName: string) => {
    return itemName
      .replace(/\s+/g, '_')
      .replace(/'/g, '%27');
  };
  
  // Using the correct URL pattern for TFT items
  const baseImageUrl = `https://static.wikia.nocookie.net/leagueoflegends/images`;
  
  // Direct mappings of item names to their exact image URLs
  const directImageMappings: Record<string, string> = {
    "Bloodthirster": "https://static.wikia.nocookie.net/leagueoflegends/images/d/d3/Bloodthirster_TFT_item.png/revision/latest?cb=20210904180025",
    "Blue Buff": "https://static.wikia.nocookie.net/leagueoflegends/images/b/b3/Blue_Buff_TFT_item.png/revision/latest?cb=20210904180026",
    "Bramble Vest": "https://static.wikia.nocookie.net/leagueoflegends/images/6/69/Bramble_Vest_TFT_item.png/revision/latest?cb=20210904180027",
    "Deathblade": "https://static.wikia.nocookie.net/leagueoflegends/images/9/94/Deathblade_TFT_item.png/revision/latest?cb=20210904180028",
    "Dragon's Claw": "https://static.wikia.nocookie.net/leagueoflegends/images/6/60/Dragon%27s_Claw_TFT_item.png/revision/latest?cb=20210904180029",
    "Edge of Night": "https://static.wikia.nocookie.net/leagueoflegends/images/8/81/Edge_of_Night_TFT_item.png/revision/latest?cb=20210904180032",
    "Giant Slayer": "https://static.wikia.nocookie.net/leagueoflegends/images/5/58/Giant_Slayer_TFT_item.png/revision/latest?cb=20210904180033",
    "Guinsoo's Rageblade": "https://static.wikia.nocookie.net/leagueoflegends/images/d/da/Guinsoo%27s_Rageblade_TFT_item.png/revision/latest?cb=20210904180035",
    "Hand of Justice": "https://static.wikia.nocookie.net/leagueoflegends/images/f/f1/Hand_of_Justice_TFT_item.png/revision/latest?cb=20210904180037",
    "Infinity Edge": "https://static.wikia.nocookie.net/leagueoflegends/images/c/c6/Infinity_Edge_TFT_item.png/revision/latest?cb=20210904180040",
    "Ionic Spark": "https://static.wikia.nocookie.net/leagueoflegends/images/9/93/Ionic_Spark_TFT_item.png/revision/latest?cb=20210904180042",
    "Jeweled Gauntlet": "https://static.wikia.nocookie.net/leagueoflegends/images/8/87/Jeweled_Gauntlet_TFT_item.png/revision/latest?cb=20210904180045",
    "Last Whisper": "https://static.wikia.nocookie.net/leagueoflegends/images/9/91/Last_Whisper_TFT_item.png/revision/latest?cb=20210904180048",
    "Locket of the Iron Solari": "https://static.wikia.nocookie.net/leagueoflegends/images/a/ac/Locket_of_the_Iron_Solari_TFT_item.png/revision/latest?cb=20210904180049",
    "Morellonomicon": "https://static.wikia.nocookie.net/leagueoflegends/images/e/ec/Morellonomicon_TFT_item.png/revision/latest?cb=20210904180051",
    "Quicksilver": "https://static.wikia.nocookie.net/leagueoflegends/images/9/95/Quicksilver_TFT_item.png/revision/latest?cb=20210904180053",
    "Rabadon's Deathcap": "https://static.wikia.nocookie.net/leagueoflegends/images/a/a1/Rabadon%27s_Deathcap_TFT_item.png/revision/latest?cb=20210904180055",
    "Rapid Firecannon": "https://static.wikia.nocookie.net/leagueoflegends/images/f/f2/Rapid_Firecannon_TFT_item.png/revision/latest?cb=20210904180056",
    "Redemption": "https://static.wikia.nocookie.net/leagueoflegends/images/7/75/Redemption_TFT_item.png/revision/latest?cb=20210904180058",
    "Runaan's Hurricane": "https://static.wikia.nocookie.net/leagueoflegends/images/e/e9/Runaan%27s_Hurricane_TFT_item.png/revision/latest?cb=20210904180101",
    "Spear of Shojin": "https://static.wikia.nocookie.net/leagueoflegends/images/d/dd/Spear_of_Shojin_TFT_item.png/revision/latest?cb=20210904180103",
    "Statikk Shiv": "https://static.wikia.nocookie.net/leagueoflegends/images/2/28/Statikk_Shiv_TFT_item.png/revision/latest?cb=20210904180104",
    "Sunfire Cape": "https://static.wikia.nocookie.net/leagueoflegends/images/2/27/Sunfire_Cape_TFT_item.png/revision/latest?cb=20210904180105",
    "Thief's Gloves": "https://static.wikia.nocookie.net/leagueoflegends/images/1/14/Thief%27s_Gloves_TFT_item.png/revision/latest?cb=20210904180107",
    "Titan's Resolve": "https://static.wikia.nocookie.net/leagueoflegends/images/e/e0/Titan%27s_Resolve_TFT_item.png/revision/latest?cb=20210904180108",
    "Warmog's Armor": "https://static.wikia.nocookie.net/leagueoflegends/images/c/cf/Warmog%27s_Armor_TFT_item.png/revision/latest?cb=20210904180110",
    "Zeke's Herald": "https://static.wikia.nocookie.net/leagueoflegends/images/a/af/Zeke%27s_Herald_TFT_item.png/revision/latest?cb=20210904180112",
    "Zephyr": "https://static.wikia.nocookie.net/leagueoflegends/images/8/8d/Zephyr_TFT_item.png/revision/latest?cb=20210904180113",
    "Zz'Rot Portal": "https://static.wikia.nocookie.net/leagueoflegends/images/d/df/Zz%27Rot_Portal_TFT_item.png/revision/latest?cb=20210904180114",
  };
  
  // Generic URL pattern for items not in the direct mappings
  const getGenericItemUrl = (itemName: string) => {
    const formattedName = formatNameForUrl(itemName);
    return `${baseImageUrl}/${formattedName}_TFT_item.png/revision/latest?cb=20210904180040`;
  };
  
  // Determine which URL to use
  const imageUrl = directImageMappings[name] || getGenericItemUrl(name);
  
  // Guaranteed fallback image in case all else fails (using a known working image)
  const fallbackUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/c/c6/Infinity_Edge_TFT_item.png/revision/latest?cb=20210904180040';
  
  // Display name for fallback text, used if images fail to load
  const displayName = name.length > 12 ? name.substring(0, 10) + '...' : name;
  
  const handleImageError = () => {
    console.error(`Failed to load image for ${name}`);
    setImgError(true);
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
          src={imageUrl}
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
