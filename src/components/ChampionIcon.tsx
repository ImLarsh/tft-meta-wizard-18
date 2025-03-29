
import React from 'react';
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
  // Convert champion name to normalized format for image URLs
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Use ddragon CDN for champion images (this is more reliable)
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${normalizedName}.png`;
  
  // Alternative URL using Community Dragon for TFT-specific images
  const alternativeUrl = `https://raw.communitydragon.org/latest/game/assets/characters/${normalizedName.toLowerCase()}/hud/${normalizedName.toLowerCase()}_square.png`;
  
  // Fallback image in case the champion image is not found
  const fallbackImageUrl = '/placeholder.svg';
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <div 
      className={cn(
        sizeClasses[size],
        `champion-border-${cost}`,
        'rounded-md overflow-hidden relative border border-cost-${cost}/70',
        className
      )}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src !== alternativeUrl) {
            // Try the alternative URL first
            target.src = alternativeUrl;
          } else if (target.src !== fallbackImageUrl) {
            // If alternative also fails, use fallback
            target.src = fallbackImageUrl;
          }
        }}
      />
      <div className={`absolute bottom-0 right-0 w-3 h-3 bg-cost-${cost} rounded-tl-md flex items-center justify-center text-[8px] font-bold text-white`}>
        {cost}
      </div>
    </div>
  );
};

export default ChampionIcon;
