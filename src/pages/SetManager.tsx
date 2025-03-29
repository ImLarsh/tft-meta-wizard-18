import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useComps } from '@/contexts/CompsContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChampionTraitMap } from '@/types/champion';

const setSchema = z.object({
  name: z.string().min(3, { message: "Set name must be at least 3 characters" }),
  version: z.string().min(3, { message: "Version must be at least 3 characters" }),
});

const SetManager: React.FC = () => {
  const navigate = useNavigate();
  const { traitMappings, setTraitMappings, addTraitMapping } = useComps();
  const [activeTab, setActiveTab] = useState('sets');
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [traitName, setTraitName] = useState('');
  const [championName, setChampionName] = useState('');
  const [availableTraits, setAvailableTraits] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState('');
  const [mappings, setMappings] = useState<{ champion: string; traits: string[] }[]>([]);

  const commonChampions = [
    "Ahri", "Akali", "Amumu", "Annie", "Aphelios", "Bard", "Caitlyn", 
    "Corki", "Ekko", "Evelynn", "Garen", "Gragas", "Illaoi", "Jax", 
    "Jhin", "Jinx", "Kayle", "Kayn", "Kennen", "Karthus", "Lillia", 
    "Lucian", "Lulu", "Lux", "Miss Fortune", "Mordekaiser", "Neeko", 
    "Olaf", "Pantheon", "Poppy", "Qiyana", "Samira", "Senna", "Seraphine", 
    "Sett", "Sona", "Tahm Kench", "Taric", "Thresh", "Twisted Fate", 
    "Twitch", "Urgot", "Vex", "Vi", "Viego", "Yasuo", "Yone", "Yorick", "Zac", "Ziggs"
  ];

  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues: {
      name: '',
      version: '',
    },
  });

  const handleSetSelect = (set: string) => {
    setSelectedSet(set);
    // Load traits and mappings for this set
    const setTraits = traitMappings[set]?.traits || [];
    setAvailableTraits(setTraits);
    
    // Create mapping display
    const champMappings: { champion: string; traits: string[] }[] = [];
    const traitMap = traitMappings[set]?.championTraits || {};
    
    Object.entries(traitMap).forEach(([champion, traits]) => {
      champMappings.push({
        champion,
        traits: Array.isArray(traits) ? traits : []
      });
    });
    
    setMappings(champMappings);
  };

  const handleAddSet = (values: z.infer<typeof setSchema>) => {
    if (traitMappings[values.version]) {
      toast({
        title: "Error",
        description: `Set ${values.version} already exists`,
        variant: "destructive",
      });
      return;
    }

    addTraitMapping(values.version, {
      name: values.name,
      traits: [],
      championTraits: {}
    });

    toast({
      title: "Success",
      description: `Set ${values.name} (${values.version}) has been added`,
    });

    form.reset();
    setSelectedSet(values.version);
  };

  const handleAddTrait = () => {
    if (!newTrait || !selectedSet) return;
    
    if (availableTraits.includes(newTrait)) {
      toast({
        title: "Error",
        description: `Trait ${newTrait} already exists in this set`,
        variant: "destructive",
      });
      return;
    }
    
    const updatedTraits = [...availableTraits, newTrait];
    setAvailableTraits(updatedTraits);
    
    const updatedMappings = { ...traitMappings };
    if (!updatedMappings[selectedSet]) {
      updatedMappings[selectedSet] = {
        name: selectedSet,
        traits: [],
        championTraits: {}
      };
    }
    
    updatedMappings[selectedSet].traits = updatedTraits;
    setTraitMappings(updatedMappings);
    
    setNewTrait('');
    
    toast({
      title: "Success",
      description: `Trait ${newTrait} has been added to ${selectedSet}`,
    });
  };

  const handleRemoveTrait = (trait: string) => {
    if (!selectedSet) return;
    
    const updatedTraits = availableTraits.filter(t => t !== trait);
    setAvailableTraits(updatedTraits);
    
    const updatedMappings = { ...traitMappings };
    updatedMappings[selectedSet].traits = updatedTraits;
    
    // Also remove this trait from any champion mappings
    const championTraits = updatedMappings[selectedSet].championTraits || {};
    Object.keys(championTraits).forEach(champion => {
      championTraits[champion] = championTraits[champion].filter(t => t !== trait);
    });
    
    updatedMappings[selectedSet].championTraits = championTraits;
    setTraitMappings(updatedMappings);
    
    // Update local mappings display
    setMappings(mappings.map(m => ({
      ...m,
      traits: m.traits.filter(t => t !== trait)
    })));
    
    toast({
      title: "Success",
      description: `Trait ${trait} has been removed from ${selectedSet}`,
    });
  };

  const handleAddChampionTrait = () => {
    if (!championName || !traitName || !selectedSet) return;
    
    const updatedMappings = { ...traitMappings };
    if (!updatedMappings[selectedSet].championTraits) {
      updatedMappings[selectedSet].championTraits = {};
    }
    
    if (!updatedMappings[selectedSet].championTraits[championName]) {
      updatedMappings[selectedSet].championTraits[championName] = [];
    }
    
    // Check if trait is already assigned to this champion
    if (updatedMappings[selectedSet].championTraits[championName].includes(traitName)) {
      toast({
        title: "Error",
        description: `${championName} already has the ${traitName} trait`,
        variant: "destructive",
      });
      return;
    }
    
    updatedMappings[selectedSet].championTraits[championName].push(traitName);
    setTraitMappings(updatedMappings);
    
    // Update local mappings display
    const existingMapping = mappings.find(m => m.champion === championName);
    if (existingMapping) {
      setMappings(mappings.map(m => 
        m.champion === championName 
          ? { ...m, traits: [...m.traits, traitName] }
          : m
      ));
    } else {
      setMappings([...mappings, { champion: championName, traits: [traitName] }]);
    }
    
    setChampionName('');
    setTraitName('');
    
    toast({
      title: "Success",
      description: `Added ${traitName} trait to ${championName}`,
    });
  };

  const handleRemoveChampionTrait = (champion: string, trait: string) => {
    if (!selectedSet) return;
    
    const updatedMappings = { ...traitMappings };
    if (
      updatedMappings[selectedSet].championTraits && 
      updatedMappings[selectedSet].championTraits[champion]
    ) {
      updatedMappings[selectedSet].championTraits[champion] = 
        updatedMappings[selectedSet].championTraits[champion].filter(t => t !== trait);
      
      setTraitMappings(updatedMappings);
      
      // Update local mappings display
      setMappings(mappings.map(m => 
        m.champion === champion 
          ? { ...m, traits: m.traits.filter(t => t !== trait) }
          : m
      ));
      
      toast({
        title: "Success",
        description: `Removed ${trait} trait from ${champion}`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background/95 bg-[url('/hexagon-pattern.png')] bg-repeat">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')} 
            className="hover:bg-primary/10 gaming-button"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Sparkles className="h-6 w-6 text-primary mr-2 animate-pulse-subtle" />
            TFT Set Manager
          </h1>
        </div>
        
        <div className="bg-card border border-primary/20 rounded-lg shadow-md p-6 backdrop-blur-sm gaming-card">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="sets">Sets</TabsTrigger>
              <TabsTrigger value="traits" disabled={!selectedSet}>Traits</TabsTrigger>
              <TabsTrigger value="champions" disabled={!selectedSet || availableTraits.length === 0}>Champions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sets">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Available Sets</h2>
                  {Object.keys(traitMappings).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(traitMappings).map(([version, setData]) => (
                        <Button 
                          key={version}
                          variant={selectedSet === version ? "default" : "outline"}
                          className={`justify-start ${selectedSet === version ? 'gaming-button' : ''}`}
                          onClick={() => handleSetSelect(version)}
                        >
                          {setData.name || version}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No sets defined yet. Add your first TFT set.</p>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Add New Set</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddSet)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Set Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Runeterra Reforged" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Set Version</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Set A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Set
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="traits">
              {selectedSet && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Available Traits for {selectedSet}</h2>
                    {availableTraits.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {availableTraits.map(trait => (
                          <div key={trait} className="flex items-center gap-1 bg-secondary/50 rounded-md p-1 pr-2">
                            <span className="text-sm">{trait}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() => handleRemoveTrait(trait)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No traits defined yet. Add your first trait for this set.</p>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold mb-4">Add New Trait</h2>
                    <div className="flex gap-2">
                      <Input 
                        value={newTrait} 
                        onChange={(e) => setNewTrait(e.target.value)}
                        placeholder="Trait name (e.g. Bruiser, Ninja, etc.)"
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddTrait}
                        disabled={!newTrait}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="champions">
              {selectedSet && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Assign Traits to Champions</h2>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <FormLabel>Champion</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  {championName || "Select champion"}
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0" align="start">
                                <div className="max-h-[200px] overflow-y-auto p-1">
                                  {commonChampions
                                    .filter(name => !championName || name.toLowerCase().includes(championName.toLowerCase()))
                                    .map((name) => (
                                      <Button
                                        key={name}
                                        variant="ghost"
                                        className="w-full justify-start rounded-sm text-left font-normal"
                                        onClick={() => setChampionName(name)}
                                      >
                                        {name}
                                      </Button>
                                    ))
                                  }
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div>
                            <FormLabel>Trait</FormLabel>
                            <Select 
                              value={traitName} 
                              onValueChange={setTraitName}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select trait" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTraits.map(trait => (
                                  <SelectItem key={trait} value={trait}>{trait}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleAddChampionTrait}
                          disabled={!championName || !traitName}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Assign Trait
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold mb-4">Current Trait Mappings</h2>
                      {mappings.length > 0 ? (
                        <div className="space-y-2">
                          {mappings.map((mapping, idx) => (
                            <div key={idx} className="bg-secondary/30 p-3 rounded-md">
                              <div className="font-medium">{mapping.champion}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {mapping.traits.map(trait => (
                                  <div key={trait} className="flex items-center gap-1 bg-primary/20 rounded-md px-2 py-0.5 text-xs">
                                    {trait}
                                    <button 
                                      onClick={() => handleRemoveChampionTrait(mapping.champion, trait)}
                                      className="text-destructive hover:text-destructive/80"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No champion trait mappings defined yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-card/90 backdrop-blur py-8 border-t border-primary/10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse-subtle" />
              <span className="text-xl font-bold text-primary">TFT</span>
              <span className="text-xl font-bold glow-text">Genie</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              TFT Genie is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SetManager;
