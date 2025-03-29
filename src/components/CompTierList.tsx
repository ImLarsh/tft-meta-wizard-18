import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TFTComp } from '@/data/comps';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowUpDown, ArrowDownAZ, ThumbsUp, ArrowDownZA, ArrowUp } from 'lucide-react';
import BoardPositioning from './BoardPositioning';
import ChampionIcon from './ChampionIcon';
import ItemIcon from './ItemIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CompVoteSystem from './CompVoteSystem';

interface CompTierListProps {
  comps: TFTComp[];
}

type SortOption = 'tier' | 'name-asc' | 'name-desc' | 'difficulty' | 'most-liked';

const CompTierList: React.FC<CompTierListProps> = ({ comps }) => {
  const [expandedCompId, setExpandedCompId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('tier');

  const toggleExpand = (compId: string) => {
    setExpandedCompId(expandedCompId === compId ? null : compId);
  };

  const getTierValue = (tier: string): number => {
    switch (tier.toUpperCase()) {
      case 'S': return 0;
      case 'A': return 1;
      case 'B': return 2;
      case 'C': return 3;
      default: return 4;
    }
  };

  const getSortedComps = () => {
    switch (sortBy) {
      case 'tier':
        return [...comps].sort((a, b) => getTierValue(a.tier) - getTierValue(b.tier));
      case 'name-asc':
        return [...comps].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...comps].sort((a, b) => b.name.localeCompare(a.name));
      case 'difficulty':
        return [...comps].sort((a, b) => {
          const diffValues = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return diffValues[a.difficulty] - diffValues[b.difficulty];
        });
      case 'most-liked':
        return [...comps].sort((a, b) => getTierValue(a.tier) - getTierValue(b.tier));
      default:
        return [...comps];
    }
  };

  const sortedComps = getSortedComps();

  const getColorForTier = (tier: string): string => {
    switch (tier.toUpperCase()) {
      case 'S': return 'bg-purple-500 hover:bg-purple-600';
      case 'A': return 'bg-blue-500 hover:bg-blue-600';
      case 'B': return 'bg-green-500 hover:bg-green-600';
      case 'C': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getCompsByTier = () => {
    if (sortBy !== 'tier') return null;
    
    const byTier: Record<string, TFTComp[]> = {};
    for (const comp of sortedComps) {
      const tier = comp.tier.toUpperCase();
      if (!byTier[tier]) {
        byTier[tier] = [];
      }
      byTier[tier].push(comp);
    }
    return byTier;
  };

  const compsByTier = getCompsByTier();
  const tiers = compsByTier ? Object.keys(compsByTier).sort((a, b) => getTierValue(a) - getTierValue(b)) : [];

  const getDifficultyValue = (difficulty: string): number => {
    switch (difficulty) {
      case 'Easy': return 1;
      case 'Medium': return 3;
      case 'Hard': return 5;
      default: return 3;
    }
  };

  const hasPositioningData = (comp: TFTComp) => {
    return comp.boardPositions || comp.finalComp.some(champ => champ.position);
  };

  const renderCompCard = (comp: TFTComp) => (
    <Collapsible 
      key={comp.id} 
      open={expandedCompId === comp.id}
      onOpenChange={() => toggleExpand(comp.id)}
      className="border rounded-md overflow-hidden mb-4"
    >
      <div className="bg-card">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={`${getColorForTier(comp.tier)} text-white px-3 py-1 text-xs`}>
              {comp.tier}
            </Badge>
            <span className="font-medium">{comp.name}</span>
            <Badge variant="outline" className="text-xs">
              {comp.playstyle}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{comp.difficulty}</span>
            <Progress value={getDifficultyValue(comp.difficulty) * 20} className="w-20" />
            <CompVoteSystem compId={comp.id} />
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {expandedCompId === comp.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="p-4 border-t">
            <Tabs defaultValue="composition">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="composition">Composition</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="positioning">Positioning</TabsTrigger>
                <TabsTrigger value="strategy">Strategy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="composition" className="pt-2">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Early Game</h4>
                  <div className="flex flex-wrap gap-3">
                    {comp.earlyGame.map((champion) => (
                      <div key={champion.name} className="flex flex-col items-center gap-1">
                        <ChampionIcon name={champion.name} cost={champion.cost} size="sm" />
                        <span className="text-xs">{champion.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Final Composition</h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {comp.finalComp.map((champion) => (
                      <div key={champion.name} className="flex flex-col items-center gap-1 pt-4">
                        <ChampionIcon 
                          name={champion.name} 
                          cost={champion.cost}
                          isCarry={champion.isCarry} 
                        />
                        <span className="text-xs text-center">{champion.name}</span>
                        {champion.items && champion.items.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap justify-center">
                            {champion.items.map((item, idx) => (
                              <ItemIcon key={idx} name={item} size="sm" />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="items" className="pt-2">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {comp.keyItems.map((item, idx) => (
                      <div key={idx} className="bg-secondary/70 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <ItemIcon name={item} size="sm" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Item Priority</h4>
                  {comp.finalComp
                    .filter(champ => champ.items && champ.items.length > 0)
                    .map((champion) => (
                      <div key={champion.name} className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <ChampionIcon name={champion.name} cost={champion.cost} size="sm" />
                          <span className="text-sm font-medium">{champion.name}</span>
                          {champion.isCarry && (
                            <span className="text-xs bg-primary/20 text-primary px-1 rounded">Carry</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 ml-10">
                          {champion.items && champion.items.map((item, idx) => (
                            <div key={idx} className="bg-secondary/50 px-2 py-1 rounded text-xs flex items-center gap-1">
                              <span className="text-primary mr-1">{idx + 1}.</span>
                              <ItemIcon name={item} size="sm" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="positioning" className="pt-2">
                {hasPositioningData(comp) ? (
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-4">Recommended Positioning</h4>
                    <BoardPositioning
                      champions={comp.finalComp.map(champ => ({ ...champ, position: champ.position || null }))}
                      readonly={true}
                      compact={true}
                    />
                  </div>
                ) : comp.positioning ? (
                  <div className="text-center">
                    <img 
                      src={comp.positioning} 
                      alt="Positioning" 
                      className="max-w-full mx-auto border border-border rounded-md"
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No positioning information available for this comp</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="strategy" className="pt-2">
                <p className="text-sm mb-4">{comp.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Strengths</h4>
                    <ul className="list-disc list-inside text-sm">
                      {comp.strengthsWeaknesses.strengths.map((strength, idx) => (
                        <li key={idx} className="mb-1">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-destructive mb-2">Weaknesses</h4>
                    <ul className="list-disc list-inside text-sm">
                      {comp.strengthsWeaknesses.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="mb-1">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={sortBy === 'tier' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('tier')}
          className="flex items-center gap-1"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span>By Tier</span>
        </Button>
        <Button
          variant={sortBy === 'name-asc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('name-asc')}
          className="flex items-center gap-1"
        >
          <ArrowDownAZ className="h-4 w-4" />
          <span>A-Z</span>
        </Button>
        <Button
          variant={sortBy === 'name-desc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('name-desc')}
          className="flex items-center gap-1"
        >
          <ArrowDownZA className="h-4 w-4" />
          <span>Z-A</span>
        </Button>
        <Button
          variant={sortBy === 'difficulty' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('difficulty')}
          className="flex items-center gap-1"
        >
          <ArrowUp className="h-4 w-4" />
          <span>By Difficulty</span>
        </Button>
        <Button
          variant={sortBy === 'most-liked' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('most-liked')}
          className="flex items-center gap-1"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>Most Liked</span>
        </Button>
      </div>

      {sortBy === 'tier' && tiers.length > 0 ? (
        tiers.map((tier) => (
          <div key={tier} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`${getColorForTier(tier)} text-white px-3 py-1 text-xs`}>
                {tier}
              </Badge>
              <h3 className="font-bold text-lg">Tier {tier}</h3>
            </div>
            {compsByTier[tier].map(renderCompCard)}
          </div>
        ))
      ) : sortedComps.length > 0 ? (
        <div className="space-y-4">
          {sortedComps.map(renderCompCard)}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No compositions found
        </div>
      )}
    </div>
  );
};

export default CompTierList;
