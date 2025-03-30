import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Save, Trash2, Edit, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useComps } from '@/contexts/CompsContext';
import { toast } from '@/components/ui/use-toast';
import { fetchTraitMappingsFromSupabase, saveTraitMappingsToSupabase } from '@/utils/supabaseUtils';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseData } from '@/hooks/use-supabase';

const SetManager: React.FC = () => {
  const { traitMappings: contextTraitMappings } = useComps();
  const { traitMappings: supabaseTraitMappings, loading: supabaseLoading } = useSupabaseData();
  const [sets, setSets] = useState<Record<string, any>>({});
  const [newSetName, setNewSetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [newTrait, setNewTrait] = useState('');
  const [newChampion, setNewChampion] = useState('');
  const [newChampionTraits, setNewChampionTraits] = useState<string[]>([]);
  const [newChampionCost, setNewChampionCost] = useState<number>(1);
  const [searchText, setSearchText] = useState('');
  
  useEffect(() => {
    if (Object.keys(supabaseTraitMappings).length > 0) {
      setSets(supabaseTraitMappings);
      console.log('Using trait mappings from Supabase:', Object.keys(supabaseTraitMappings));
    } else if (!supabaseLoading) {
      loadSets();
    }
  }, [supabaseTraitMappings, supabaseLoading]);

  const loadSets = async () => {
    setLoading(true);
    try {
      const mappingsData = await fetchTraitMappingsFromSupabase();
      if (Object.keys(mappingsData).length > 0) {
        setSets(mappingsData);
        console.log('Successfully loaded sets from Supabase:', Object.keys(mappingsData));
      } else {
        setSets({});
        console.log('No data found in Supabase, initialized with empty object');
      }
    } catch (error) {
      console.error('Error loading sets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sets from Supabase',
        variant: 'destructive'
      });
      setSets({});
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddSet = () => {
    if (!newSetName.trim()) {
      toast({
        title: "Validation Error",
        description: "Set name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (sets[newSetName]) {
      toast({
        title: "Validation Error",
        description: "A set with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    const newSets = {
      ...sets,
      [newSetName]: {
        name: newSetName,
        traits: [],
        championTraits: {},
        championCosts: {}
      }
    };
    
    setSets(newSets);
    setNewSetName('');
    
    toast({
      title: "Set Added",
      description: `Set "${newSetName}" has been added. You can now add traits and champions.`
    });
  };
  
  const handleSaveSets = async () => {
    setLoading(true);
    try {
      const saved = await saveTraitMappingsToSupabase(sets);
      
      if (saved) {
        toast({
          title: "Sets Saved",
          description: "Your TFT sets have been saved successfully."
        });
      } else {
        throw new Error("Failed to save sets");
      }
    } catch (error) {
      console.error("Error saving sets:", error);
      toast({
        title: "Error",
        description: "Failed to save sets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteSet = (setName: string) => {
    if (!window.confirm(`Are you sure you want to delete set "${setName}"? This cannot be undone.`)) {
      return;
    }
    
    const newSets = {...sets};
    delete newSets[setName];
    setSets(newSets);
    
    toast({
      title: "Set Deleted",
      description: `Set "${setName}" has been deleted.`
    });
  };

  const handleAddTrait = (setKey: string) => {
    if (!newTrait.trim()) {
      toast({
        title: "Validation Error",
        description: "Trait name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (sets[setKey].traits.includes(newTrait)) {
      toast({
        title: "Validation Error",
        description: `Trait "${newTrait}" already exists in this set`,
        variant: "destructive"
      });
      return;
    }

    const updatedSets = {
      ...sets,
      [setKey]: {
        ...sets[setKey],
        traits: [...sets[setKey].traits, newTrait]
      }
    };

    setSets(updatedSets);
    setNewTrait('');
    
    toast({
      title: "Trait Added",
      description: `Trait "${newTrait}" has been added to set "${setKey}".`
    });
  };

  const handleDeleteTrait = (setKey: string, traitName: string) => {
    if (!window.confirm(`Are you sure you want to delete trait "${traitName}"? Champions with this trait will be affected.`)) {
      return;
    }

    const updatedSets = {
      ...sets,
      [setKey]: {
        ...sets[setKey],
        traits: sets[setKey].traits.filter(trait => trait !== traitName)
      }
    };

    const championTraits = sets[setKey].championTraits;
    Object.keys(championTraits).forEach(champion => {
      if (championTraits[champion].includes(traitName)) {
        updatedSets[setKey].championTraits[champion] = championTraits[champion].filter(trait => trait !== traitName);
      }
    });

    setSets(updatedSets);
    
    toast({
      title: "Trait Deleted",
      description: `Trait "${traitName}" has been deleted from set "${setKey}".`
    });
  };

  const handleAddChampion = (setKey: string) => {
    const normalizedChampName = newChampion.trim();
    
    if (!normalizedChampName) {
      toast({
        title: "Validation Error",
        description: "Champion name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (sets[setKey].championTraits[normalizedChampName]) {
      toast({
        title: "Validation Error",
        description: `Champion "${normalizedChampName}" already exists in this set`,
        variant: "destructive"
      });
      return;
    }

    if (newChampionTraits.length === 0) {
      toast({
        title: "Validation Error",
        description: "Champion must have at least one trait",
        variant: "destructive"
      });
      return;
    }

    const updatedSets = {
      ...sets,
      [setKey]: {
        ...sets[setKey],
        championTraits: {
          ...sets[setKey].championTraits,
          [normalizedChampName]: newChampionTraits
        },
        championCosts: {
          ...sets[setKey].championCosts,
          [normalizedChampName]: newChampionCost
        }
      }
    };

    setSets(updatedSets);
    setNewChampion('');
    setNewChampionTraits([]);
    setNewChampionCost(1);
    
    toast({
      title: "Champion Added",
      description: `Champion "${normalizedChampName}" has been added to set "${setKey}".`
    });
  };

  const handleChampionTraitToggle = (trait: string) => {
    setNewChampionTraits(prev => 
      prev.includes(trait) 
        ? prev.filter(t => t !== trait) 
        : [...prev, trait]
    );
  };

  const handleDeleteChampion = (setKey: string, championName: string) => {
    if (!window.confirm(`Are you sure you want to delete champion "${championName}"?`)) {
      return;
    }

    const updatedSets = {
      ...sets,
      [setKey]: {
        ...sets[setKey],
        championTraits: { ...sets[setKey].championTraits },
        championCosts: { ...sets[setKey].championCosts }
      }
    };

    delete updatedSets[setKey].championTraits[championName];
    delete updatedSets[setKey].championCosts[championName];

    setSets(updatedSets);
    
    toast({
      title: "Champion Deleted",
      description: `Champion "${championName}" has been deleted from set "${setKey}".`
    });
  };

  const getChampionCost = (setKey: string, championName: string) => {
    return sets[setKey]?.championCosts?.[championName] || 1;
  };
  
  const filteredChampions = (setKey: string) => {
    if (!searchText) return Object.keys(sets[setKey]?.championTraits || {});
    
    return Object.keys(sets[setKey]?.championTraits || {}).filter(
      champion => champion.toLowerCase().includes(searchText.toLowerCase())
    );
  };
  
  return (
    <PageLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Manage TFT Sets</h1>
          </div>
          
          <Button 
            onClick={handleSaveSets} 
            className="gap-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save All Sets
              </>
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="sets">
          <TabsList className="mb-4">
            <TabsTrigger value="sets">Manage Sets</TabsTrigger>
            <TabsTrigger value="info">Database Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sets">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Set</CardTitle>
                  <CardDescription>
                    Add a new TFT set, like "Set 10" or "Set 10.5"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="flex-grow">
                      <Label htmlFor="setName">Set Name</Label>
                      <Input
                        id="setName"
                        placeholder="e.g. Set10"
                        value={newSetName}
                        onChange={(e) => setNewSetName(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddSet} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Set
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {(supabaseLoading || loading) && Object.keys(sets).length === 0 && (
                <div className="text-center py-8 border border-dashed border-border rounded-md">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-2" />
                  <p className="text-lg">Loading sets from Supabase...</p>
                </div>
              )}
              
              {Object.keys(sets).length === 0 && !supabaseLoading && !loading && (
                <div className="text-center py-8 border border-dashed border-border rounded-md">
                  <p className="text-lg text-muted-foreground">No sets found in database</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your first set to get started
                  </p>
                </div>
              )}
              
              {Object.keys(sets).map((setKey) => (
                <Card key={setKey} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">{sets[setKey].name}</CardTitle>
                      <CardDescription>
                        {sets[setKey].traits?.length || 0} traits, {Object.keys(sets[setKey].championTraits || {}).length} champions
                      </CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteSet(setKey)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          className="w-full" 
                          onClick={() => setSelectedSet(setKey)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Manage Set Details
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto w-[95%] sm:w-[90%] md:max-w-[600px]" side="right">
                        <SheetHeader>
                          <SheetTitle>Manage Set: {sets[setKey]?.name}</SheetTitle>
                        </SheetHeader>
                        
                        <div className="mt-6 space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Traits</h3>
                            <div className="flex gap-2 mb-3">
                              <Input 
                                placeholder="New trait name" 
                                value={newTrait}
                                onChange={(e) => setNewTrait(e.target.value)}
                              />
                              <Button onClick={() => handleAddTrait(setKey)}>Add</Button>
                            </div>
                            
                            {sets[setKey]?.traits && sets[setKey]?.traits.length > 0 ? (
                              <div className="border rounded-md overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Trait Name</TableHead>
                                      <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {sets[setKey]?.traits.map((trait: string) => (
                                      <TableRow key={trait}>
                                        <TableCell>{trait}</TableCell>
                                        <TableCell>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="h-8 w-8 p-0 text-destructive" 
                                            onClick={() => handleDeleteTrait(setKey, trait)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">No traits added yet</p>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Champions</h3>
                            <div className="space-y-3 mb-3">
                              <div>
                                <Label htmlFor="championName">Champion Name</Label>
                                <Input 
                                  id="championName" 
                                  placeholder="Champion name" 
                                  value={newChampion}
                                  onChange={(e) => setNewChampion(e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="championCost">Cost</Label>
                                <Input 
                                  id="championCost" 
                                  type="number" 
                                  min="1" 
                                  max="5"
                                  value={newChampionCost}
                                  onChange={(e) => setNewChampionCost(Number(e.target.value))}
                                />
                              </div>
                              
                              <div>
                                <Label className="block mb-2">Traits</Label>
                                {sets[setKey]?.traits && sets[setKey]?.traits.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {sets[setKey]?.traits.map((trait: string) => (
                                      <Button
                                        key={trait}
                                        type="button"
                                        size="sm"
                                        variant={newChampionTraits.includes(trait) ? "default" : "outline"}
                                        onClick={() => handleChampionTraitToggle(trait)}
                                      >
                                        {trait}
                                      </Button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground italic">No traits available. Add traits first.</p>
                                )}
                              </div>
                              
                              <Button 
                                onClick={() => handleAddChampion(setKey)}
                                disabled={!newChampion || newChampionTraits.length === 0}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Champion
                              </Button>
                            </div>
                            
                            {Object.keys(sets[setKey]?.championTraits || {}).length > 0 ? (
                              <div>
                                <div className="mb-3">
                                  <Input
                                    placeholder="Search champions..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="mb-2"
                                  />
                                </div>
                                <div className="border rounded-md overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Champion</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Traits</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {filteredChampions(setKey).map((champion) => (
                                        <TableRow key={champion}>
                                          <TableCell>{champion}</TableCell>
                                          <TableCell>{getChampionCost(setKey, champion)}</TableCell>
                                          <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                              {sets[setKey]?.championTraits[champion].map((trait: string) => (
                                                <span 
                                                  key={trait} 
                                                  className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs"
                                                >
                                                  {trait}
                                                </span>
                                              ))}
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <Button 
                                              variant="ghost" 
                                              size="sm"
                                              className="h-8 w-8 p-0 text-destructive" 
                                              onClick={() => handleDeleteChampion(setKey, champion)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                              <span className="sr-only">Delete</span>
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">No champions added yet</p>
                            )}
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Database Information</CardTitle>
                <CardDescription>
                  Information about your Supabase trait mappings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Data Source:</h3>
                    <p className="text-sm text-muted-foreground">
                      {Object.keys(supabaseTraitMappings).length > 0 
                        ? "Using data from Supabase tft_trait_mappings table" 
                        : "No data found in Supabase tft_trait_mappings table"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Available Sets:</h3>
                    {Object.keys(sets).length > 0 ? (
                      <ul className="list-disc pl-5 text-sm">
                        {Object.keys(sets).map(setKey => (
                          <li key={setKey}>
                            {sets[setKey].name} - {sets[setKey].traits?.length || 0} traits, 
                            {Object.keys(sets[setKey].championTraits || {}).length} champions
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No sets available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default SetManager;
