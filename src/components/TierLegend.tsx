
import React from 'react';
import { Star, Triangle, Square, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TierLegendProps {
  className?: string;
}

const TierLegend: React.FC<TierLegendProps> = ({ className }) => {
  const tiers = [
    { 
      tier: 'S', 
      icon: <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />, 
      color: 'bg-tft-gold', 
      description: 'Strongest comps, consistent top 4',
      bgColor: 'bg-yellow-100 dark:bg-yellow-950/40'
    },
    { 
      tier: 'A', 
      icon: <Triangle className="h-5 w-5 text-cyan-400 fill-cyan-400" />, 
      color: 'bg-tft-cyan', 
      description: 'Strong comps, good for climbing',
      bgColor: 'bg-cyan-100 dark:bg-cyan-950/40'
    },
    { 
      tier: 'B', 
      icon: <Square className="h-5 w-5 text-purple-400 fill-purple-400" />, 
      color: 'bg-tft-purple', 
      description: 'Viable comps with specific conditions',
      bgColor: 'bg-purple-100 dark:bg-purple-950/40'
    },
    { 
      tier: 'C', 
      icon: <Circle className="h-5 w-5 text-red-400 fill-red-400" />, 
      color: 'bg-tft-red', 
      description: 'Situational comps, high risk',
      bgColor: 'bg-red-100 dark:bg-red-950/40'
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {tiers.map(({ tier, icon, color, description, bgColor }) => (
        <div key={tier} className={`flex items-center gap-3 p-3 rounded-lg border border-border/50 ${bgColor}`}>
          <div className={`flex items-center justify-center min-w-10 h-10 rounded-md bg-white/80 dark:bg-black/30 shadow-sm`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Tier {tier}</span>
              <div className={`h-2 w-2 rounded-full ${color}`}></div>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TierLegend;
