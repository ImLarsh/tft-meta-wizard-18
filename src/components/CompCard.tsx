
import React, { useState } from 'react';
import { TFTComp } from '@/data/comps';
import ChampionIcon from './ChampionIcon';
import ItemIcon from './ItemIcon';
import BoardPositioning from './BoardPositioning';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronRight, Star, Trophy, BarChart, Brain, MapPin, Triangle, Square, Circle, Edit, Trash2 } from 'lucide-react';
import { useComps } from '@/contexts/CompsContext';
import CompVoteSystem from './CompVoteSystem';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface CompCardProps {
  comp: TFTComp;
}

const CompCard: React.FC<CompCardProps> = ({ comp }) => {
  const [expanded, setExpanded] = useState(false);
  const { traitMappings, removeComp } = useComps();
  
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'S': return <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />;
      case 'A': return <Triangle className="h-5 w-5 text-cyan-400 fill-cyan-400" />;
      case 'B': return <Square className="h-5 w-5 text-purple-400 fill-purple-400" />;
      case 'C': return <Circle className="h-5 w-5 text-red-400 fill-red-400" />;
      default: return null;
    }
  };
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-tft-gold text-black';
      case 'A': return 'bg-tft-cyan text-black';
      case 'B': return 'bg-tft-purple text-white';
      case 'C': return 'bg-tft-red text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getSetName = () => {
    if (!comp.tftVersion) return null;
    return traitMappings[comp.tftVersion]?.name || comp.tftVersion;
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the "${comp.name}" composition?`)) {
      removeComp(comp.id);
      toast({
        title: "Composition Deleted",
        description: `"${comp.name}" has been successfully deleted.`
      });
    }
  };
  
  const hasPositioningData = comp.boardPositions || comp.finalComp.some(champ => champ.position);
  
  return (
    <div className={`tft-card ${expanded ? 'col-span-full' : 'col-span-1'} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-md ${getTierColor(comp.tier)}`}>
            {getTierIcon(comp.tier)}
          </div>
          <h3 className="text-lg font-bold">{comp.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          {comp.tftVersion && (
            <span className="text-xs bg-secondary/70 px-2 py-1 rounded">
              {getSetName()}
            </span>
          )}
          <div className="flex items-center gap-1">
            <Link to={`/edit/${comp.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-3 items-center mb-4">
          {comp.traits.map((trait) => (
            <div key={trait.name} className="flex items-center px-2 py-1 bg-secondary/50 rounded text-xs">
              <span className="font-medium">{trait.name}</span>
              <span className="ml-1 text-primary">({trait.count})</span>
              {trait.version && (
                <span className="ml-1 text-[10px] text-muted-foreground">
                  {traitMappings[trait.version]?.name || trait.version}
                </span>
              )}
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
        
        <div className="flex flex-wrap gap-2 mb-3">
          {comp.finalComp.map((champion) => (
            <ChampionIcon 
              key={champion.name}
              name={champion.name} 
              cost={champion.cost} 
              isCarry={champion.isCarry}
            />
          ))}
        </div>
      </div>
      
      <div className="border-t border-border/40 px-4 py-2 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          {expanded ? (
            <>
              <span>Collapse</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Expand</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="flex items-center">
          <CompVoteSystem compId={comp.id} className="mr-2" />
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-border/40 p-4">
          <Tabs defaultValue="composition">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="composition">Composition</TabsTrigger>
              <TabsTrigger value="positioning" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Positioning</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="composition" className="pt-2">
              <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                  {comp.earlyGame.map((champion) => (
                    <div key={champion.name} className="flex flex-col items-center gap-1">
                      <ChampionIcon name={champion.name} cost={champion.cost} size="sm" />
                      <span className="text-xs">{champion.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Final Composition</h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {comp.finalComp.map((champion) => (
                    <div key={champion.name} className="flex flex-col items-center gap-1 pt-2">
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
              
              <div>
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
              </div>
            </TabsContent>
            
            <TabsContent value="positioning" className="pt-2">
              {hasPositioningData ? (
                <div>
                  <h4 className="text-sm font-medium text-primary mb-4">Recommended Positioning</h4>
                  <BoardPositioning
                    champions={comp.finalComp.map(champ => ({ ...champ, position: champ.position || null }))}
                    readonly={true}
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    This shows the recommended positioning for the late game board.
                  </p>
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
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No positioning information available for this comp</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default CompCard;
