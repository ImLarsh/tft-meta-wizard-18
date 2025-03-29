import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChampionIconProps {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ChampionIcon: React.FC<ChampionIconProps> = ({ 
  name, 
  cost, 
  size = 'md',
  className
}) => {
  const [imgError, setImgError] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  useEffect(() => {
    setCurrentSourceIndex(0);
    setImgError(false);
  }, [name]);
  
  const championNameMap: Record<string, string> = {
    "MissFortune": "missfortune",
    "Miss Fortune": "missfortune",
    "AurelionSol": "aurelionsol",
    "Aurelion Sol": "aurelionsol",
    "TahmKench": "tahmkench",
    "Tahm Kench": "tahmkench",
    "XinZhao": "xinzhao",
    "Xin Zhao": "xinzhao",
    "MasterYi": "masteryi",
    "Master Yi": "masteryi",
    "TwistedFate": "twistedfate",
    "Twisted Fate": "twistedfate",
    "KSante": "ksante",
    "K'Sante": "ksante",
    "JarvanIV": "jarvaniv",
    "Jarvan IV": "jarvaniv",
    "LeBlanc": "leblanc",
    "Le Blanc": "leblanc",
    "RekSai": "reksai",
    "Rek'Sai": "reksai",
    "KaiSa": "kaisa",
    "Kai'Sa": "kaisa",
    "KhaZix": "khazix",
    "Kha'Zix": "khazix",
    "ChoGath": "chogath",
    "Cho'Gath": "chogath"
  };
  
  const getNormalizedName = (championName: string) => {
    if (championNameMap[championName]) {
      return championNameMap[championName];
    }
    
    return championName.toLowerCase().replace(/[^a-z0-9]/g, '');
  };
  
  const normalizedName = getNormalizedName(name);
  
  const getWikiName = (championName: string) => {
    return championName
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('_')
      .replace(/'/g, '%27');
  };
  
  const wikiName = getWikiName(name);
  
  const displayName = name.replace(/([A-Z])/g, ' $1').trim();
  
  const sources = [
    `https://static.wikia.nocookie.net/leagueoflegends/images/thumb/3/35/${wikiName}/120px-${wikiName}.png`,
    `https://static.wikia.nocookie.net/leagueoflegends/images/3/35/${wikiName}.png`,
    
    `https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${name.replace(/\s+/g, '')}.png`,
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${name.replace(/\s+/g, '')}_0.jpg`,
    
    `https://raw.communitydragon.org/latest/game/assets/characters/tft10_${normalizedName}/hud/tft10_${normalizedName}_square.tft_set10.png`,
    
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${normalizedName}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${normalizedName}/${normalizedName}_0.jpg`,
    
    `https://cdn.mobalytics.gg/assets/tft/images/champions/thumbnails/${normalizedName}.png`,
    `https://cdn.metatft.com/file/metatft/champions/${normalizedName}.png`,
    `https://rerollcdn.com/characters/${normalizedName}.png`
  ];
  
  const fallbackUrl = 'https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/Ryze.png';
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const costClasses = {
    1: 'border-cost-1/70',
    2: 'border-cost-2/70',
    3: 'border-cost-3/70',
    4: 'border-cost-4/70',
    5: 'border-cost-5/70'
  };
  
  const costBgClasses = {
    1: 'bg-cost-1',
    2: 'bg-cost-2',
    3: 'bg-cost-3',
    4: 'bg-cost-4',
    5: 'bg-cost-5'
  };
  
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
    <div 
      className={cn(
        sizeClasses[size],
        `champion-border-${cost}`,
        'rounded-md overflow-hidden relative border',
        costClasses[cost],
        className
      )}
    >
      {imgError ? (
        <div className={cn(
          "w-full h-full flex items-center justify-center text-[10px] font-medium text-white bg-secondary p-0.5 text-center",
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
        />
      )}
      <div className={cn(
        "absolute bottom-0 right-0 w-3 h-3 rounded-tl-md flex items-center justify-center text-[8px] font-bold text-white",
        costBgClasses[cost]
      )}>
        {cost}
      </div>
    </div>
  );
};

export default ChampionIcon;
