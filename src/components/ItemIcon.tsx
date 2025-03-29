
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ItemIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ItemIcon: React.FC<ItemIconProps> = ({ 
  name, 
  size = 'md',
  className
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Normalize the item name for URLs
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');
  const displayName = name.replace(/([A-Z])/g, ' $1').trim(); // Add spaces before capital letters
  
  // Multiple image sources to try
  const primarySource = `https://cdn.metatft.com/file/metatft/items/${normalizedName.toLowerCase()}.png`;
  const secondarySource = `https://rerollcdn.com/items/${normalizedName.toLowerCase()}.png`;
  const tertiarySource = `https://cdn.communitydragon.org/latest/item/${normalizedName.toLowerCase()}/icon`;
  
  // Fallback image
  const fallbackUrl = '/placeholder.svg';
  
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    // Try each fallback source in sequence
    if (target.src === primarySource) {
      console.log(`Primary source failed for item ${name}, trying secondary`);
      target.src = secondarySource;
    } else if (target.src === secondarySource) {
      console.log(`Secondary source failed for item ${name}, trying tertiary`);
      target.src = tertiarySource;
    } else if (target.src === tertiarySource) {
      console.log(`All image sources failed for item ${name}, using fallback`);
      setImgError(true);
      target.src = fallbackUrl;
    }
  };
  
  return (
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
          src={primarySource}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
          title={name}
        />
      )}
    </div>
  );
};

export default ItemIcon;
