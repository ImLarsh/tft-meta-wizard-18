
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
  
  // Base URL for TFT champion images (this uses the League of Legends Data Dragon)
  const imageUrl = `https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/${normalizedName}.tft_set10.png`;
  
  // Fallback image in case the champion image is not found
  const fallbackImageUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/tft/champions-unknown.png';
  
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
        'rounded-md overflow-hidden relative',
        className
      )}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image fails to load
          (e.target as HTMLImageElement).src = fallbackImageUrl;
        }}
      />
      <div className={`absolute bottom-0 right-0 w-3 h-3 bg-cost-${cost} rounded-tl-md flex items-center justify-center text-[8px] font-bold text-white`}>
        {cost}
      </div>
    </div>
  );
};

export default ChampionIcon;
