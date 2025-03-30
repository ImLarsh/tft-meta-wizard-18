import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useImageToggle } from '@/contexts/ImageToggleContext';

interface ChampionIconProps {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isCarry?: boolean;
  onClick?: () => void;
}

const ChampionIcon: React.FC<ChampionIconProps> = ({ 
  name, 
  cost, 
  size = 'md',
  className,
  isCarry,
  onClick
}) => {
  const { useTftImages } = useImageToggle();
  const [imgError, setImgError] = useState(false);
  
  let normalizedName = '';
  
  if (!name) {
    console.error('ChampionIcon received undefined or null name');
  } else {
    const trimmedName = name.trim();
    
    if (trimmedName === "MissFortune" || trimmedName === "Miss Fortune") {
      normalizedName = "missfortune";
    } else if (trimmedName === "AurelionSol" || trimmedName === "Aurelion Sol") {
      normalizedName = "aurelionsol";
    } else if (trimmedName === "TahmKench" || trimmedName === "Tahm Kench") {
      normalizedName = "tahmkench";
    } else if (trimmedName === "XinZhao" || trimmedName === "Xin Zhao") {
      normalizedName = "xinzhao";
    } else if (trimmedName === "MasterYi" || trimmedName === "Master Yi") {
      normalizedName = "masteryi";
    } else if (trimmedName === "TwistedFate" || trimmedName === "Twisted Fate") {
      normalizedName = "twistedfate";
    } else if (trimmedName === "KSante" || trimmedName === "K'Sante") {
      normalizedName = "ksante";
    } else if (trimmedName === "JarvanIV" || trimmedName === "Jarvan IV") {
      normalizedName = "jarvaniv";
    } else if (trimmedName === "LeBlanc" || trimmedName === "Le Blanc") {
      normalizedName = "leblanc";
    } else if (trimmedName === "Kobuko") {
      normalizedName = "kobuko";
    } else if (trimmedName === "Rhaast") {
      normalizedName = "rhaast";
    } else if (trimmedName === "Kog'Maw" || trimmedName === "KogMaw") {
      normalizedName = "kogmaw";
    } else if (trimmedName === "Aurora") {
      normalizedName = "aurora";
    } else if (trimmedName === "Naafiri") {
      normalizedName = "naafiri";
    } else {
      normalizedName = trimmedName ? trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'unknown';
    }
  }
  
  const displayName = name ? name.trim().replace(/([A-Z])/g, ' $1').trim() : 'Unknown';
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11', 
    lg: 'w-full h-full'
  };
  
  const costTextColors = {
    1: 'text-cost-1',
    2: 'text-cost-2',
    3: 'text-cost-3',
    4: 'text-cost-4',
    5: 'text-cost-5'
  };
  
  const tftSources = [
    `https://raw.communitydragon.org/pbe/game/assets/characters/tft14_${normalizedName}/hud/tft14_${normalizedName}_square.tft_set14.png`,
    `https://raw.communitydragon.org/latest/game/assets/characters/tft14_${normalizedName}/hud/tft14_${normalizedName}_square.tft_set14.png`,
    `https://raw.communitydragon.org/pbe/game/assets/characters/tft10_${normalizedName}/hud/tft10_${normalizedName}_square.tft_set10.png`,
    `https://raw.communitydragon.org/latest/game/assets/characters/tft10_${normalizedName}/hud/tft10_${normalizedName}_square.tft_set10.png`,
    `https://cdn.metatft.com/file/metatft/champions/${normalizedName}.png`,
    `https://rerollcdn.com/characters/${normalizedName}.png`,
    `https://cdn.tft.tools/champions/${normalizedName}.png`,
  ];
  
  const lolSources = [
    `https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}.png`,
    `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}.png`,
    `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)}.png`,
    `https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/${name ? name.trim().replace(/\s+/g, '') : 'Unknown'}.png`,
    `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${name ? name.trim().replace(/\s+/g, '') : 'Unknown'}.png`,
    `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${name ? name.trim().replace(/\s+/g, '') : 'Unknown'}.png`,
    `https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${name ? name.trim().replace(/\s+/g, '') : 'Unknown'}_0.jpg`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${normalizedName}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${normalizedName}/${normalizedName}_0.jpg`,
    `https://cdn.mobalytics.gg/assets/common/images/lol/champions/standard/${normalizedName}.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/latest/scale-to-width-down/123?cb=20200412015006&path-prefix=${normalizedName}`,
    `https://lolg-cdn.porofessor.gg/img/champion-icons/${normalizedName}.png`
  ];
  
  const sources = useTftImages ? tftSources : lolSources;
  
  const fallbackUrl = 'https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Ryze_0.jpg';
  
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  const handleImageError = () => {
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < sources.length) {
      console.log(`Source ${currentSourceIndex} failed for ${name}, trying source ${nextIndex}`);
      setCurrentSourceIndex(nextIndex);
    } else {
      console.log(`All image sources failed for ${name}, using fallback`);
      setImgError(true);
    }
  };
  
  return (
    <div className="relative">
      {isCarry && (
        <div className="absolute -top-4 w-full flex justify-center">
          <div className="flex space-x-0.5">
            <Star size={10} fill="#FFD700" color="#FFD700" />
            <Star size={10} fill="#FFD700" color="#FFD700" />
            <Star size={10} fill="#FFD700" color="#FFD700" />
          </div>
        </div>
      )}
      
      <div 
        className={cn(
          sizeClasses[size], 
          'rounded overflow-hidden relative',
          className
        )}
        onClick={onClick}
      >
        {imgError ? (
          <div className={cn(
            "w-full h-full flex items-center justify-center text-[10px] font-medium text-white bg-secondary/60 p-0.5 text-center",
          )}>
            {displayName}
          </div>
        ) : (
          <div className="w-full h-full">
            <img
              src={sources[currentSourceIndex]}
              alt={name || 'Unknown Champion'}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        )}
        
        <div className={cn(
          "absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-black/70",
          costTextColors[cost]
        )}>
          {cost}
        </div>
      </div>
    </div>
  );
};

export default ChampionIcon;
