
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
  const getWikiName = (itemName: string) => {
    // Replace spaces with underscores and preserve apostrophes for wiki URLs
    return itemName
      .replace(/\s+/g, '_');
  };
  
  // Special mappings for commonly confused item names 
  // Maps from display name to the actual file name on the wiki
  const specialMappings: Record<string, string> = {
    "Bloodthirster": "Bloodthirster_(Teamfight_Tactics)",
    "Blue Buff": "Blue_Buff_(Teamfight_Tactics)",
    "Bramble Vest": "Bramble_Vest_(Teamfight_Tactics)",
    "Deathblade": "Deathblade_(Teamfight_Tactics)",
    "Dragon's Claw": "Dragon%27s_Claw_(Teamfight_Tactics)",
    "Edge of Night": "Edge_of_Night_(Teamfight_Tactics)",
    "Giant Slayer": "Giant_Slayer_(Teamfight_Tactics)",
    "Guinsoo's Rageblade": "Guinsoo%27s_Rageblade_(Teamfight_Tactics)",
    "Hand of Justice": "Hand_of_Justice_(Teamfight_Tactics)",
    "Infinity Edge": "Infinity_Edge_(Teamfight_Tactics)",
    "Ionic Spark": "Ionic_Spark_(Teamfight_Tactics)",
    "Jeweled Gauntlet": "Jeweled_Gauntlet_(Teamfight_Tactics)",
    "Last Whisper": "Last_Whisper_(Teamfight_Tactics)",
    "Locket of the Iron Solari": "Locket_of_the_Iron_Solari_(Teamfight_Tactics)",
    "Morellonomicon": "Morellonomicon_(Teamfight_Tactics)",
    "Quicksilver": "Quicksilver_(Teamfight_Tactics)",
    "Rabadon's Deathcap": "Rabadon%27s_Deathcap_(Teamfight_Tactics)",
    "Rapid Firecannon": "Rapid_Firecannon_(Teamfight_Tactics)",
    "Redemption": "Redemption_(Teamfight_Tactics)",
    "Runaan's Hurricane": "Runaan%27s_Hurricane_(Teamfight_Tactics)",
    "Spear of Shojin": "Spear_of_Shojin_(Teamfight_Tactics)",
    "Statikk Shiv": "Statikk_Shiv_(Teamfight_Tactics)",
    "Sunfire Cape": "Sunfire_Cape_(Teamfight_Tactics)",
    "Thief's Gloves": "Thief%27s_Gloves_(Teamfight_Tactics)",
    "Titan's Resolve": "Titan%27s_Resolve_(Teamfight_Tactics)",
    "Warmog's Armor": "Warmog%27s_Armor_(Teamfight_Tactics)",
    "Zeke's Herald": "Zeke%27s_Herald_(Teamfight_Tactics)",
    "Zephyr": "Zephyr_(Teamfight_Tactics)",
    "Zz'Rot Portal": "Zz%27Rot_Portal_(Teamfight_Tactics)",
  };
  
  // Get the appropriate wiki page name
  const wikiPageName = specialMappings[name] || `${getWikiName(name)}_(Teamfight_Tactics)`;
  
  // Main image URL using the League of Legends wiki
  const imageUrl = `https://static.wikia.nocookie.net/leagueoflegends/images/${wikiPageName}.png/revision/latest`;
  
  // Alternative direct URLs for popular items
  const directImageUrls: Record<string, string> = {
    "Bloodthirster": "https://static.wikia.nocookie.net/leagueoflegends/images/6/66/Bloodthirster_%28Teamfight_Tactics%29.png/revision/latest",
    "Blue Buff": "https://static.wikia.nocookie.net/leagueoflegends/images/e/e7/Blue_Buff_%28Teamfight_Tactics%29.png/revision/latest",
    "Infinity Edge": "https://static.wikia.nocookie.net/leagueoflegends/images/5/5a/Infinity_Edge_%28Teamfight_Tactics%29.png/revision/latest",
    "Jeweled Gauntlet": "https://static.wikia.nocookie.net/leagueoflegends/images/9/9c/Jeweled_Gauntlet_%28Teamfight_Tactics%29.png/revision/latest",
    "Rabadon's Deathcap": "https://static.wikia.nocookie.net/leagueoflegends/images/4/46/Rabadon%27s_Deathcap_%28Teamfight_Tactics%29.png/revision/latest",
    "Runaan's Hurricane": "https://static.wikia.nocookie.net/leagueoflegends/images/e/eb/Runaan%27s_Hurricane_%28Teamfight_Tactics%29.png/revision/latest",
    "Spear of Shojin": "https://static.wikia.nocookie.net/leagueoflegends/images/1/1e/Spear_of_Shojin_%28Teamfight_Tactics%29.png/revision/latest",
  };
  
  // Final URL to use for the image
  const finalImageUrl = directImageUrls[name] || imageUrl;
  
  // Guaranteed fallback image in case all else fails (using Bloodthirster as fallback)
  const fallbackUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/6/66/Bloodthirster_%28Teamfight_Tactics%29.png/revision/latest';
  
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
          src={finalImageUrl}
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
