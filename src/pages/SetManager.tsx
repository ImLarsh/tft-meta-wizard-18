
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useComps } from '@/contexts/CompsContext';
import { Link, Trash, Save, Plus, X, LinkIcon, Check } from 'lucide-react';

interface ChampionTraitForm {
  championName: string;
  traits: string[];
}

const SetManager: React.FC = () => {
  const { traitMappings, addTraitMapping, setTraitMappings } = useComps();
  const navigate = useNavigate();
  
  const [activeSet, setActiveSet] = useState<string>("Set 10");
  const [setName, setSetName] = useState<string>("");
  const [traits, setTraits] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState<string>("");
  
  const [champions, setChampions] = useState<string[]>([]);
  const [newChampion, setNewChampion] = useState<string>("");
  
  const [championTraits, setChampionTraits] = useState<Record<string, string[]>>({});
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Load initial data for the active set
  useEffect(() => {
    if (traitMappings[activeSet]) {
      const mapping = traitMappings[activeSet];
      setSetName(mapping.name || "");
      setTraits(mapping.traits || []);
      
      // Extract champions from trait mappings
      const champList = Object.keys(mapping.championTraits || {});
      setChampions(champList);
      
      // Set champion traits mapping
      setChampionTraits(mapping.championTraits || {});
    } else {
      // Initialize with empty data for a new set
      setSetName("");
      setTraits([]);
      setChampions([]);
      setChampionTraits({});
    }
    
    setIsEditing(false);
  }, [activeSet, traitMappings]);
  
  const handleAddTrait = () => {
    if (!newTrait || traits.includes(newTrait)) return;
    
    setTraits([...traits, newTrait]);
    setNewTrait("");
  };
  
  const handleRemoveTrait = (index: number) => {
    const newTraits = [...traits];
    newTraits.splice(index, 1);
    setTraits(newTraits);
    
    // Also remove this trait from all champions
    const updatedChampionTraits = { ...championTraits };
    Object.keys(updatedChampionTraits).forEach(champion => {
      updatedChampionTraits[champion] = updatedChampionTraits[champion].filter(
        trait => trait !== traits[index]
      );
    });
    
    setChampionTraits(updatedChampionTraits);
  };
  
  const handleAddChampion = () => {
    if (!newChampion || champions.includes(newChampion)) return;
    
    setChampions([...champions, newChampion]);
    setChampionTraits({
      ...championTraits,
      [newChampion]: [] // Initialize with no traits
    });
    setNewChampion("");
  };
  
  const handleRemoveChampion = (index: number) => {
    const champToRemove = champions[index];
    const newChampions = [...champions];
    newChampions.splice(index, 1);
    setChampions(newChampions);
    
    // Remove this champion from trait mappings
    const { [champToRemove]: _, ...remainingChampionTraits } = championTraits;
    setChampionTraits(remainingChampionTraits);
    
    // Reset selection if the removed champion was selected
    if (selectedChampion === champToRemove) {
      setSelectedChampion("");
      setSelectedTraits([]);
    }
  };
  
  const handleChampionSelect = (champion: string) => {
    setSelectedChampion(champion);
    setSelectedTraits(championTraits[champion] || []);
  };
  
  const handleTraitToggle = (trait: string) => {
    if (!selectedChampion) return;
    
    let newTraits: string[];
    
    if (selectedTraits.includes(trait)) {
      // Remove trait
      newTraits = selectedTraits.filter(t => t !== trait);
    } else {
      // Add trait
      newTraits = [...selectedTraits, trait];
    }
    
    setSelectedTraits(newTraits);
    
    // Update champion traits mapping
    setChampionTraits({
      ...championTraits,
      [selectedChampion]: newTraits
    });
  };
  
  const handleSaveSet = () => {
    if (!setName) {
      toast({
        title: "Validation Error",
        description: "Set name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (traits.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one trait is required",
        variant: "destructive",
      });
      return;
    }
    
    // Create updated trait mapping
    const updatedMapping = {
      name: setName,
      traits: traits,
      championTraits: championTraits
    };
    
    // Save to context
    addTraitMapping(activeSet, updatedMapping);
    
    toast({
      title: "Success",
      description: `Set "${activeSet}" has been saved`,
    });
    
    setIsEditing(false);
  };
  
  const handleNewSet = () => {
    // Create a new set name based on the next available set number
    const existingSets = Object.keys(traitMappings);
    const setNumbers = existingSets
      .map(set => parseInt(set.replace("Set ", "")))
      .filter(num => !isNaN(num));
    
    const nextSetNumber = setNumbers.length > 0 
      ? Math.max(...setNumbers) + 1 
      : 1;
    
    const newSetName = `Set ${nextSetNumber}`;
    
    // Initialize the new set with empty data
    const newTraitMappings = {
      ...traitMappings,
      [newSetName]: {
        name: "New Set",
        traits: [],
        championTraits: {}
      }
    };
    
    setTraitMappings(newTraitMappings);
    setActiveSet(newSetName);
    setIsEditing(true);
  };
  
  const handleDeleteSet = () => {
    if (Object.keys(traitMappings).length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "At least one set must exist",
        variant: "destructive",
      });
      return;
    }
    
    // Create a copy of trait mappings without the current set
    const { [activeSet]: _, ...remainingMappings } = traitMappings;
    
    // Update the context
    setTraitMappings(remainingMappings);
    
    // Switch to the first available set
    setActiveSet(Object.keys(remainingMappings)[0]);
    
    toast({
      title: "Set Deleted",
      description: `"${activeSet}" has been deleted`,
    });
  };
  
  return (
    <>
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Set Manager</h1>
            <p className="text-muted-foreground">
              Manage TFT sets, traits, and champion associations
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={activeSet} 
              onValueChange={setActiveSet}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Set" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(traitMappings).map((set) => (
                  <SelectItem key={set} value={set}>
                    {set} - {traitMappings[set].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={handleNewSet}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Set
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleDeleteSet}
              disabled={Object.keys(traitMappings).length <= 1}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Set Details</span>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Basic information about the {activeSet}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Set ID</label>
                    <Input value={activeSet} disabled className="bg-muted/50" />
                  </div>
                  
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-sm font-medium">Set Name</label>
                    <Input 
                      value={setName} 
                      onChange={(e) => setSetName(e.target.value)} 
                      disabled={!isEditing}
                      placeholder="e.g., Remix Rumble"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="justify-end space-x-2 border-t pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original values
                    if (traitMappings[activeSet]) {
                      setSetName(traitMappings[activeSet].name);
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveSet}
                  className="gaming-button"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Traits</CardTitle>
              <CardDescription>
                Manage traits for this set
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    value={newTrait} 
                    onChange={(e) => setNewTrait(e.target.value)} 
                    placeholder="Add new trait..."
                    disabled={!isEditing}
                  />
                  <Button 
                    onClick={handleAddTrait} 
                    disabled={!isEditing || !newTrait}
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {traits.length > 0 ? (
                    traits.map((trait, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 bg-secondary/20 rounded-md"
                      >
                        <span>{trait}</span>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTrait(index)}
                            className="h-7 w-7 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No traits added yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Champions</CardTitle>
              <CardDescription>
                Manage champions for this set
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    value={newChampion} 
                    onChange={(e) => setNewChampion(e.target.value)} 
                    placeholder="Add new champion..."
                    disabled={!isEditing}
                  />
                  <Button 
                    onClick={handleAddChampion} 
                    disabled={!isEditing || !newChampion}
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {champions.length > 0 ? (
                    champions.map((champion, index) => (
                      <div 
                        key={index} 
                        className={`
                          flex items-center justify-between p-2 rounded-md cursor-pointer
                          ${selectedChampion === champion ? 'bg-primary/20 border border-primary/40' : 'bg-secondary/20 hover:bg-secondary/30'}
                        `}
                        onClick={() => handleChampionSelect(champion)}
                      >
                        <div>
                          <span>{champion}</span>
                          {championTraits[champion]?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {championTraits[champion].map((trait, i) => (
                                <span key={i} className="text-xs bg-primary/20 px-1 py-0.5 rounded">
                                  {trait}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveChampion(index);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No champions added yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                Champion Traits
              </CardTitle>
              <CardDescription>
                Link traits to champions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedChampion ? (
                <div className="space-y-4">
                  <div className="bg-secondary/20 p-3 rounded-md">
                    <h3 className="font-medium mb-2">Editing: {selectedChampion}</h3>
                    <p className="text-xs text-muted-foreground">
                      Select traits to associate with this champion
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-[430px] overflow-y-auto">
                    {traits.length > 0 ? (
                      traits.map((trait, index) => (
                        <div 
                          key={index} 
                          className={`
                            flex items-center justify-between p-2 rounded-md cursor-pointer
                            ${selectedTraits.includes(trait) ? 'bg-primary/20' : 'bg-secondary/10 hover:bg-secondary/20'}
                          `}
                          onClick={() => isEditing && handleTraitToggle(trait)}
                        >
                          <span>{trait}</span>
                          {selectedTraits.includes(trait) ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <div className="w-4 h-4 border border-border rounded-sm" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No traits available to link
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Select a champion from the list to link traits
                  </p>
                  {champions.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add champions first to link traits to them
                    </p>
                  )}
                </div>
              )}
            </CardContent>
            {selectedChampion && isEditing && (
              <CardFooter className="border-t pt-4">
                <Button 
                  onClick={() => {
                    setSelectedChampion("");
                    setSelectedTraits([]);
                  }}
                  variant="outline"
                  className="mr-auto"
                >
                  Close
                </Button>
                <Button
                  onClick={handleSaveSet}
                  className="gaming-button"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Back to Comps
          </Button>
          
          {isEditing && (
            <Button 
              onClick={handleSaveSet}
              className="gaming-button"
            >
              <Save className="h-4 w-4 mr-1" />
              Save All Changes
            </Button>
          )}
        </div>
      </main>
    </>
  );
};

export default SetManager;
