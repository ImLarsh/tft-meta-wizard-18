
import React from 'react';
import { Star, Triangle, Square, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TierLegendProps {
  className?: string;
}

const TierLegend: React.FC<TierLegendProps> = ({ className }) => {
  const tiers = [
    { tier: 'S', icon: <Star className="h-5 w-5 text-yellow-400" />, color: 'bg-tft-gold', description: 'Strongest comps, consistent top 4' },
    { tier: 'A', icon: <Triangle className="h-5 w-5 text-cyan-400" />, color: 'bg-tft-cyan', description: 'Strong comps, good for climbing' },
    { tier: 'B', icon: <Square className="h-5 w-5 text-purple-400" />, color: 'bg-tft-purple', description: 'Viable comps with specific conditions' },
    { tier: 'C', icon: <Circle className="h-5 w-5 text-red-400" />, color: 'bg-tft-red', description: 'Situational comps, high risk' },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {tiers.map(({ tier, icon, color, description }) => (
        <div key={tier} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
          <div className="flex items-center justify-center min-w-10 h-10 rounded-md">
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
