
import React, { useState, useEffect } from 'react';
import { useComps } from '@/contexts/CompsContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash, ChevronDown, ChevronUp, Settings, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SetManager: React.FC = () => {
  const { traitMappings, setTraitMappings, addTraitMapping } = useComps();
  
  const [activeTab, setActiveTab] = useState<string>("manage");
  const [activeSetTab, setActiveSetTab] = useState<string | null>(null);
  
  const [newSetName, setNewSetName] = useState("");
  const [newSetVersion, setNewSetVersion] = useState("");
  const [newSetTraits, setNewSetTraits] = useState<string[]>([]);
  const [newTraitInput, setNewTraitInput] = useState("");
  
  const [championTraitMapping, setChampionTraitMapping] = useState<Record<string, string[]>>({});
  const [newChampName, setNewChampName] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  // Initialize with existing set as active
  useEffect(() => {
    if (!activeSetTab && Object.keys(traitMappings).length > 0) {
      setActiveSetTab(Object.keys(traitMappings)[0]);
    }
  }, [traitMappings, activeSetTab]);
  
  // Function to add a new TFT set
  const handleAddSet = () => {
    if (!newSetVersion || !newSetName) {
      toast({
        title: "Missing Information",
        description: "Please provide both a set version and name",
        variant: "destructive",
      });
      return;
    }
    
    if (traitMappings[newSetVersion]) {
      toast({
        title: "Set Already Exists",
        description: `Set ${newSetVersion} already exists`,
        variant: "destructive",
      });
      return;
    }
    
    addTraitMapping(newSetVersion, {
      name: newSetName,
      traits: newSetTraits,
      championTraits: {}
    });
    
    toast({
      title: "Set Created",
      description: `Set ${newSetName} has been created successfully`,
    });
    
    // Reset form
    setNewSetVersion("");
    setNewSetName("");
    setNewSetTraits([]);
    setActiveSetTab(newSetVersion);
    setActiveTab("manage");
  };
  
  // Function to add a new trait to the list
  const handleAddTrait = () => {
    if (!newTraitInput) return;
    if (!newSetTraits.includes(newTraitInput)) {
      setNewSetTraits([...newSetTraits, newTraitInput]);
      setNewTraitInput("");
    }
  };
  
  // Function to remove a trait from the list
  const handleRemoveTrait = (index: number) => {
    setNewSetTraits(newSetTraits.filter((_, i) => i !== index));
  };
  
  // Function to update an existing set's traits
  const handleUpdateSet = (setKey: string) => {
    if (!traitMappings[setKey]) return;
    
    const updatedMappings = { ...traitMappings };
    updatedMappings[setKey].traits = newSetTraits;
    updatedMappings[setKey].championTraits = championTraitMapping;
    
    setTraitMappings(updatedMappings);
    
    toast({
      title: "Set Updated",
      description: `${traitMappings[setKey].name} has been updated successfully`,
    });
  };
  
  // Function to delete a set
  const handleDeleteSet = (setKey: string) => {
    if (!traitMappings[setKey]) return;
    
    const updatedMappings = { ...traitMappings };
    delete updatedMappings[setKey];
    
    setTraitMappings(updatedMappings);
    
    toast({
      title: "Set Deleted",
      description: `${traitMappings[setKey].name} has been deleted`,
    });
    
    if (setKey === activeSetTab) {
      const remainingSets = Object.keys(updatedMappings);
      setActiveSetTab(remainingSets.length > 0 ? remainingSets[0] : null);
    }
  };
  
  // Load trait mappings for a specific set
  const handleSelectSet = (setKey: string) => {
    setActiveSetTab(setKey);
    setNewSetTraits([...traitMappings[setKey].traits]);
    setChampionTraitMapping({ ...traitMappings[setKey].championTraits });
  };
  
  // Add champion to trait mapping
  const handleAddChampion = () => {
    if (!newChampName || selectedTraits.length === 0) return;
    
    setChampionTraitMapping(prev => ({
      ...prev,
      [newChampName]: selectedTraits
    }));
    
    setNewChampName("");
    setSelectedTraits([]);
  };
  
  // Remove champion from trait mapping
  const handleRemoveChampion = (champName: string) => {
    setChampionTraitMapping(prev => {
      const updated = { ...prev };
      delete updated[champName];
      return updated;
    });
  };
  
  // Toggle trait selection
  const handleToggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Settings className="mr-2 h-6 w-6 text-primary" />
              TFT Set Manager
            </h1>
            <p className="text-muted-foreground mt-1">Manage champions, traits, and sets for Teamfight Tactics</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setActiveTab("create")}>
              <Plus className="h-4 w-4 mr-1" />
              New Set
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="manage">Manage Sets</TabsTrigger>
            <TabsTrigger value="create">Create New Set</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="space-y-6">
            {Object.keys(traitMappings).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 space-y-2">
                  <h3 className="font-semibold mb-2">Available Sets</h3>
                  
                  {Object.keys(traitMappings).map((setKey) => (
                    <Button 
                      key={setKey}
                      variant={activeSetTab === setKey ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleSelectSet(setKey)}
                    >
                      <span>{traitMappings[setKey].name}</span>
                      <span className="ml-auto text-xs opacity-70">{setKey}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="lg:col-span-9">
                  {activeSetTab ? (
                    <div className="border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold">{traitMappings[activeSetTab].name}</h3>
                          <p className="text-sm text-muted-foreground">{activeSetTab}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleUpdateSet(activeSetTab)} 
                            className="flex items-center"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save Changes
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="border-destructive/30 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteSet(activeSetTab)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete Set
                          </Button>
                        </div>
                      </div>
                      
                      <Tabs defaultValue="traits">
                        <TabsList className="mb-4">
                          <TabsTrigger value="traits">Traits</TabsTrigger>
                          <TabsTrigger value="champions">Champions</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="traits" className="space-y-4">
                          <div className="flex gap-2">
                            <Input 
                              value={newTraitInput}
                              onChange={(e) => setNewTraitInput(e.target.value)}
                              placeholder="Add a trait (e.g., Guardian, Bruiser)"
                              className="flex-1"
                            />
                            <Button onClick={handleAddTrait} disabled={!newTraitInput}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {newSetTraits.map((trait, index) => (
                              <div 
                                key={index} 
                                className="flex items-center p-2 border border-border rounded bg-card"
                              >
                                <span>{trait}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 ml-auto"
                                  onClick={() => handleRemoveTrait(index)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="champions" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Champion Name</label>
                              <Input 
                                value={newChampName}
                                onChange={(e) => setNewChampName(e.target.value)}
                                placeholder="Champion name (e.g., Garen, Jinx)"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Traits</label>
                              <Select
                                onValueChange={(value) => handleToggleTrait(value)}
                                value={selectedTraits[0] || ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select traits" />
                                </SelectTrigger>
                                <SelectContent>
                                  {newSetTraits.map((trait) => (
                                    <SelectItem 
                                      key={trait} 
                                      value={trait}
                                      className={selectedTraits.includes(trait) ? "bg-primary/20" : ""}
                                    >
                                      {trait} {selectedTraits.includes(trait) ? "✓" : ""}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedTraits.map((trait, index) => (
                              <div 
                                key={index} 
                                className="px-2 py-1 bg-primary/20 rounded-full text-sm flex items-center"
                              >
                                <span>{trait}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0 ml-1"
                                  onClick={() => handleToggleTrait(trait)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <Button 
                            onClick={handleAddChampion} 
                            disabled={!newChampName || selectedTraits.length === 0}
                            className="mb-4"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Champion
                          </Button>
                          
                          <div className="border border-border rounded">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="text-left p-2">Champion</th>
                                  <th className="text-left p-2">Traits</th>
                                  <th className="p-2 w-10"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(championTraitMapping).map(([champ, traits], index) => (
                                  <tr key={index} className="border-t border-border">
                                    <td className="p-2">{champ}</td>
                                    <td className="p-2">
                                      <div className="flex flex-wrap gap-1">
                                        {traits.map((trait, i) => (
                                          <span key={i} className="px-1.5 py-0.5 bg-secondary/50 text-xs rounded">
                                            {trait}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="p-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleRemoveChampion(champ)}
                                      >
                                        <Trash className="h-3 w-3" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                                {Object.keys(championTraitMapping).length === 0 && (
                                  <tr>
                                    <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                      No champions added yet
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Set Selected</h3>
                      <p className="text-muted-foreground">Choose a set from the sidebar or create a new one</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No TFT Sets</h3>
                <p className="text-muted-foreground mb-4">You haven't created any TFT sets yet</p>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Your First Set
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="space-y-6">
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Create New TFT Set</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Set Version</label>
                  <Input 
                    value={newSetVersion}
                    onChange={(e) => setNewSetVersion(e.target.value)}
                    placeholder="e.g., Set 11"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is the version identifier (e.g., "Set 10", "Set 11")
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Set Name</label>
                  <Input 
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                    placeholder="e.g., Remix Rumble"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is the display name of the set (e.g., "Remix Rumble", "Inkborn Fables")
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Traits</label>
                <div className="flex gap-2">
                  <Input 
                    value={newTraitInput}
                    onChange={(e) => setNewTraitInput(e.target.value)}
                    placeholder="Add a trait (e.g., Guardian, Bruiser)"
                    className="flex-1"
                  />
                  <Button onClick={handleAddTrait} disabled={!newTraitInput}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {newSetTraits.map((trait, index) => (
                    <div 
                      key={index} 
                      className="flex items-center px-2 py-1 bg-secondary/50 rounded"
                    >
                      <span>{trait}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1"
                        onClick={() => handleRemoveTrait(index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveTab("manage");
                    setNewSetTraits([]);
                    setNewSetVersion("");
                    setNewSetName("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSet}
                  disabled={!newSetVersion || !newSetName || newSetTraits.length === 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Set
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SetManager;
