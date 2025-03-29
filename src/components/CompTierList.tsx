
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TFTComp } from '@/data/comps';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CompTierListProps {
  comps: TFTComp[];
}

// This component renders a tier list of compositions
const CompTierList: React.FC<CompTierListProps> = ({ comps }) => {
  // Sort comps by tier (S, A, B, C)
  const getTierValue = (tier: string): number => {
    switch (tier.toUpperCase()) {
      case 'S': return 0;
      case 'A': return 1;
      case 'B': return 2;
      case 'C': return 3;
      default: return 4;
    }
  };

  const sortedComps = [...comps].sort((a, b) => {
    return getTierValue(a.tier) - getTierValue(b.tier);
  });

  const getColorForTier = (tier: string): string => {
    switch (tier.toUpperCase()) {
      case 'S': return 'bg-purple-500 hover:bg-purple-600';
      case 'A': return 'bg-blue-500 hover:bg-blue-600';
      case 'B': return 'bg-green-500 hover:bg-green-600';
      case 'C': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Group comps by tier
  const compsByTier: Record<string, TFTComp[]> = {};
  for (const comp of sortedComps) {
    const tier = comp.tier.toUpperCase();
    if (!compsByTier[tier]) {
      compsByTier[tier] = [];
    }
    compsByTier[tier].push(comp);
  }

  // Get all tiers sorted
  const tiers = Object.keys(compsByTier).sort((a, b) => getTierValue(a) - getTierValue(b));

  // Helper function to convert difficulty string to number
  const getDifficultyValue = (difficulty: string): number => {
    switch (difficulty) {
      case 'Easy': return 1;
      case 'Medium': return 3;
      case 'Hard': return 5;
      default: return 3; // Default to medium if unknown
    }
  };

  return (
    <div className="space-y-6">
      {tiers.length > 0 ? (
        tiers.map((tier) => (
          <div key={tier} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`${getColorForTier(tier)} text-white px-3 py-1 text-xs`}>
                {tier}
              </Badge>
              <h3 className="font-bold text-lg">Tier {tier}</h3>
            </div>
            {compsByTier[tier].map((comp) => (
              <Card key={comp.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comp.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {comp.playstyle}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{comp.difficulty}/5</span>
                  <Progress value={getDifficultyValue(comp.difficulty) * 20} className="w-20" />
                </div>
              </Card>
            ))}
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No compositions found
        </div>
      )}
    </div>
  );
};

export default CompTierList;
