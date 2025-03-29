
import React, { useState } from 'react';
import { TFTComp } from '@/data/comps';
import ChampionIcon from './ChampionIcon';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Star, Trophy, BarChart, Brain } from 'lucide-react';

interface CompCardProps {
  comp: TFTComp;
}

const CompCard: React.FC<CompCardProps> = ({ comp }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-tft-gold text-black';
      case 'A': return 'bg-tft-cyan text-black';
      case 'B': return 'bg-tft-purple text-white';
      case 'C': return 'bg-tft-red text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <div className={`tft-card ${expanded ? 'col-span-full' : 'col-span-1'} transition-all duration-300`}>
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-md ${getTierColor(comp.tier)}`}>
            {comp.tier}
          </div>
          <h3 className="text-lg font-bold">{comp.name}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="hover:bg-secondary/50"
        >
          {expanded ? 'Collapse' : 'Expand'}
          <ChevronRight className={`ml-1 h-4 w-4 transform transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </Button>
      </div>
      
      {/* Card Summary */}
      <div className="p-4">
        <div className="flex flex-wrap gap-3 items-center mb-4">
          {/* Traits */}
          {comp.traits.map((trait) => (
            <div key={trait.name} className="flex items-center px-2 py-1 bg-secondary/50 rounded text-xs">
              <span className="font-medium">{trait.name}</span>
              <span className="ml-1 text-primary">({trait.count})</span>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm">
            <Trophy className="h-4 w-4 text-primary" />
            <span>{comp.playstyle}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Brain className="h-4 w-4 text-primary" />
            <span>{comp.difficulty}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <BarChart className="h-4 w-4 text-primary" />
            <span>Patch {comp.patch}</span>
          </div>
        </div>
        
        {/* Champions Overview (always visible) */}
        <div className="flex flex-wrap gap-2 mb-3">
          {comp.finalComp.map((champion) => (
            <div key={champion.name} className={`relative ${champion.isCarry ? 'animate-pulse-subtle' : ''}`}>
              <ChampionIcon name={champion.name} cost={champion.cost} />
              {champion.isCarry && (
                <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                  <Star className="h-3 w-3 text-black" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border/40 p-4">
          <Tabs defaultValue="composition">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="composition">Composition</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
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
                      <div className={`relative ${champion.isCarry ? 'animate-pulse-subtle' : ''}`}>
                        <ChampionIcon name={champion.name} cost={champion.cost} />
                        {champion.isCarry && (
                          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                            <Star className="h-3 w-3 text-black" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-center">{champion.name}</span>
                      {champion.items && champion.items.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap justify-center">
                          {champion.items.map((item, idx) => (
                            <div key={idx} className="bg-secondary/50 px-1 py-0.5 rounded text-[8px] whitespace-nowrap">
                              {item}
                            </div>
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
                    <div key={idx} className="bg-secondary/70 px-2 py-1 rounded text-xs">
                      {item}
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
                          <div key={idx} className="bg-secondary/50 px-2 py-1 rounded text-xs flex items-center">
                            <span className="text-primary mr-1">{idx + 1}.</span> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
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
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Playstyle Tips</h4>
                <p className="text-sm">
                  {comp.playstyle === 'Fast 8' && 'Focus on economy to hit level 8 as quickly as possible. Look for pairs along the way, but prioritize econ.'}
                  {comp.playstyle === 'Slow Roll' && 'Stay at a specific level (usually 5, 6, or 7) and roll down excess gold above 50 to find your key units.'}
                  {comp.playstyle === 'Standard' && 'Balance leveling and rolling. Level when it makes sense for your composition\'s power spikes.'}
                  {comp.playstyle === 'Hyper Roll' && 'Roll aggressively at early levels to find your key units. Prioritize 3-starring your core champions.'}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default CompCard;
