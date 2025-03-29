
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TFTComp } from '@/data/comps';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import BoardPositioning from './BoardPositioning';
import ChampionIcon from './ChampionIcon';
import ItemIcon from './ItemIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CompTierListProps {
  comps: TFTComp[];
}

// This component renders a tier list of compositions
const CompTierList: React.FC<CompTierListProps> = ({ comps }) => {
  const [expandedCompId, setExpandedCompId] = useState<string | null>(null);

  // Toggle expanded state for a composition
  const toggleExpand = (compId: string) => {
    setExpandedCompId(expandedCompId === compId ? null : compId);
  };

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

  // Check if a composition has positioning data
  const hasPositioningData = (comp: TFTComp) => {
    return comp.boardPositions || comp.finalComp.some(champ => champ.position);
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
              <Collapsible 
                key={comp.id} 
                open={expandedCompId === comp.id}
                onOpenChange={() => toggleExpand(comp.id)}
                className="border rounded-md overflow-hidden"
              >
                <div className="bg-card">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comp.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {comp.playstyle}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{comp.difficulty}/5</span>
                      <Progress value={getDifficultyValue(comp.difficulty) * 20} className="w-20" />
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
                                <div key={champion.name} className="flex flex-col items-center gap-1">
                                  <ChampionIcon name={champion.name} cost={champion.cost} />
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
