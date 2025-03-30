
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useComps } from '@/contexts/CompsContext';
import { toast } from '@/components/ui/use-toast';
import PageLayout from '@/components/PageLayout';

const SetDetail: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { traitMappings, updateTraitMappings } = useComps();
  
  const [setData, setSetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [traits, setTraits] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState('');
  
  const [champions, setChampions] = useState<{name: string, traits: string[], cost: number}[]>([]);
  const [newChampion, setNewChampion] = useState('');
  const [newChampionTraits, setNewChampionTraits] = useState<string[]>([]);
  const [newChampionCost, setNewChampionCost] = useState(1);
  
  useEffect(() => {
    if (!setId || !traitMappings) {
      setIsLoading(false);
      return;
    }
    
    if (traitMappings[setId]) {
      const currentSet = traitMappings[setId];
      setSetData(currentSet);
      setTraits(currentSet.traits || []);
      
      // Convert champion data from objects to array
      const championsArray = Object.entries(currentSet.championTraits || {}).map(([name, championTraits]) => ({
        name,
        traits: championTraits as string[],
        cost: currentSet.championCosts?.[name] || 1
      }));
      
      setChampions(championsArray);
    } else {
      toast({
        title: "Set Not Found",
        description: `No set found with ID "${setId}"`,
        variant: "destructive"
      });
      navigate('/sets');
    }
    
    setIsLoading(false);
  }, [setId, traitMappings, navigate]);
  
  const handleAddTrait = () => {
    if (!newTrait.trim()) {
      toast({
        title: "Validation Error",
        description: "Trait name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (traits.includes(newTrait)) {
      toast({
        title: "Validation Error",
        description: "This trait already exists in the set",
        variant: "destructive"
      });
      return;
    }
    
    setTraits([...traits, newTrait]);
    setNewTrait('');
  };
  
  const handleRemoveTrait = (trait: string) => {
    setTraits(traits.filter(t => t !== trait));
    
    // Also remove this trait from any champions that have it
    setChampions(champions.map(champ => ({
      ...champ,
      traits: champ.traits.filter(t => t !== trait)
    })));
  };
  
  const handleAddChampion = () => {
    if (!newChampion.trim()) {
      toast({
        title: "Validation Error",
        description: "Champion name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (champions.some(c => c.name === newChampion)) {
      toast({
        title: "Validation Error",
        description: "This champion already exists in the set",
        variant: "destructive"
      });
      return;
    }
    
    setChampions([...champions, {
      name: newChampion,
      traits: newChampionTraits,
      cost: newChampionCost
    }]);
    
    setNewChampion('');
    setNewChampionTraits([]);
    setNewChampionCost(1);
  };
  
  const handleRemoveChampion = (championName: string) => {
    setChampions(champions.filter(c => c.name !== championName));
  };
  
  const handleTraitSelection = (trait: string) => {
    if (newChampionTraits.includes(trait)) {
      setNewChampionTraits(newChampionTraits.filter(t => t !== trait));
    } else {
      setNewChampionTraits([...newChampionTraits, trait]);
    }
  };
  
  const handleSaveSet = async () => {
    if (!setId || !setData) return;
    
    try {
      setIsSaving(true);
      
      // Convert champions array back to objects
      const championTraits: Record<string, string[]> = {};
      const championCosts: Record<string, number> = {};
      
      champions.forEach(champ => {
        championTraits[champ.name] = champ.traits;
        championCosts[champ.name] = champ.cost;
      });
      
      const updatedSet = {
        ...setData,
        traits,
        championTraits,
        championCosts
      };
      
      const updatedMappings = {
        ...traitMappings,
        [setId]: updatedSet
      };
      
      await updateTraitMappings(updatedMappings);
      
      toast({
        title: "Set Updated",
        description: `Set "${setData.name}" has been updated successfully.`
      });
    } catch (error) {
      console.error("Error saving set:", error);
      toast({
        title: "Error",
        description: "Failed to save set. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading set details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!setData) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Set Not Found</h2>
          <p className="text-muted-foreground mb-6">The set you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/sets')}>Back to Set Manager</Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => navigate('/sets')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Edit Set: {setData.name}</h1>
          </div>
          
          <Button 
            onClick={handleSaveSet} 
            className="gap-2"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Traits</CardTitle>
              <CardDescription>
                Add and manage traits for this TFT set
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <div className="flex-grow">
                  <Input
                    placeholder="e.g. Gunslinger"
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddTrait}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Trait
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                {traits.map((trait) => (
                  <div 
                    key={trait}
                    className="flex items-center justify-between py-1 px-3 bg-secondary/50 rounded-md"
                  >
                    <span>{trait}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveTrait(trait)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {traits.length === 0 && (
                <div className="text-center py-4 border border-dashed border-border rounded-md">
                  <p className="text-sm text-muted-foreground">No traits added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Champions</CardTitle>
              <CardDescription>
                Add and manage champions for this TFT set
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="championName">Champion Name</Label>
                  <Input
                    id="championName"
                    placeholder="e.g. Lulu"
                    value={newChampion}
                    onChange={(e) => setNewChampion(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Champion Cost</Label>
                  <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((cost) => (
                      <Button
                        key={cost}
                        type="button"
                        variant={newChampionCost === cost ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setNewChampionCost(cost)}
                      >
                        {cost}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Champion Traits</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                    {traits.map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`trait-${trait}`}
                          checked={newChampionTraits.includes(trait)}
                          onChange={() => handleTraitSelection(trait)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`trait-${trait}`}>{trait}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleAddChampion} className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Champion
                </Button>
              </div>
              
              <div className="mt-6 divide-y divide-border">
                {champions.map((champion) => (
                  <div key={champion.name} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{champion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Cost: {champion.cost} ⭐ | 
                        Traits: {champion.traits.join(', ') || 'None'}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveChampion(champion.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {champions.length === 0 && (
                  <div className="text-center py-4 border border-dashed border-border rounded-md">
                    <p className="text-sm text-muted-foreground">No champions added yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SetDetail;
