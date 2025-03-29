
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import TFTBoardBuilder from '@/components/TFTBoardBuilder';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, HelpCircle, Save, Crown, Plus, Search } from 'lucide-react';
import { Champion, TFTComp } from '@/data/comps';
import { toast } from '@/components/ui/use-toast';
import { useComps } from '@/contexts/CompsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ChampionDetailCard from '@/components/ChampionDetailCard';
import ItemSearchBar from '@/components/ItemSearchBar';
import ItemIcon from '@/components/ItemIcon';

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  tier: z.enum(["S", "A", "B", "C"]),
  playstyle: z.enum(["Fast 8", "Slow Roll", "Standard", "Hyper Roll"]),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  tftVersion: z.string().min(1, { message: "Please select a TFT version" }),
});

const CompBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { addComp, traitMappings } = useComps();
  const [availableChampions, setAvailableChampions] = useState<Champion[]>([]);
  const [boardChampions, setBoardChampions] = useState<Champion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('board');
  
  // New state for champion selection and item management
  const [selectedChampionName, setSelectedChampionName] = useState('');
  const [selectedChampionCost, setSelectedChampionCost] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isCarry, setIsCarry] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showChampionSelector, setShowChampionSelector] = useState(false);
  const [championSearchQuery, setChampionSearchQuery] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tier: "B",
      playstyle: "Standard",
      difficulty: "Medium",
      tftVersion: Object.keys(traitMappings)[0] || "",
    },
  });

  // Generate champions for the available pool based on the selected TFT version
  useEffect(() => {
    const tftVersion = form.watch("tftVersion");
    if (!tftVersion || !traitMappings[tftVersion]) return;
    
    const mappings = traitMappings[tftVersion];
    const champions: Champion[] = [];
    
    if (mappings && mappings.championTraits) {
      // Convert to array of champions with costs from the Set Manager
      Object.keys(mappings.championTraits).forEach(championName => {
        // Get cost from championCosts in the mappings
        const cost = mappings.championCosts?.[championName] || 1;
        champions.push({
          name: championName,
          cost: cost as 1 | 2 | 3 | 4 | 5,
          isCarry: false,
          position: null,
          items: [],
        });
      });
    }
    
    setAvailableChampions(champions);
  }, [form.watch("tftVersion"), traitMappings]);

  // Handle saving the board champions
  const handleSaveBoard = (champions: Champion[]) => {
    setBoardChampions(champions);
    toast({
      title: "Board Saved",
      description: `${champions.length} champions saved to your composition.`,
    });
  };

  // Update champion details
  const updateChampion = (index: number, updatedChampion: Champion) => {
    const newChampions = [...boardChampions];
    newChampions[index] = updatedChampion;
    setBoardChampions(newChampions);
  };

  // Remove champion
  const removeChampion = (index: number) => {
    const newChampions = [...boardChampions];
    newChampions.splice(index, 1);
    setBoardChampions(newChampions);
  };

  // Add selected item to the champion before adding to board
  const addItemToSelection = (item: string) => {
    if (selectedItems.length < 3) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Remove item from selection
  const removeItemFromSelection = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  // Select champion from the available list
  const selectChampion = (champion: Champion) => {
    setSelectedChampionName(champion.name);
    setSelectedChampionCost(champion.cost);
    setShowChampionSelector(false);
  };

  // Add champion with selected items to the board
  const addChampionToBoard = () => {
    if (!selectedChampionName) return;
    
    const newChampion: Champion = {
      name: selectedChampionName,
      cost: selectedChampionCost,
      isCarry: isCarry,
      position: null,
      items: selectedItems.length > 0 ? [...selectedItems] : undefined,
    };
    
    // Add to the board champions
    setBoardChampions([...boardChampions, newChampion]);
    
    // Reset the selection
    setSelectedChampionName('');
    setSelectedChampionCost(1);
    setIsCarry(false);
    setSelectedItems([]);
    
    toast({
      title: "Champion Added",
      description: `${newChampion.name} added to your composition.`,
    });
  };

  // Filter champions based on search query
  const filteredChampions = availableChampions.filter(champion => 
    champion.name.toLowerCase().includes(championSearchQuery.toLowerCase())
  );

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (boardChampions.length === 0) {
      toast({
        title: "No Champions",
        description: "Please add at least one champion to your board.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Extract traits from the placed champions
      const tftVersion = data.tftVersion;
      const championTraits = traitMappings[tftVersion]?.championTraits || {};
      
      // Count traits
      const traitCounts: Record<string, number> = {};
      boardChampions.forEach(champion => {
        const traits = championTraits[champion.name] || [];
        traits.forEach(trait => {
          traitCounts[trait] = (traitCounts[trait] || 0) + 1;
        });
      });
      
      // Convert to trait array
      const traits = Object.entries(traitCounts).map(([name, count]) => ({
        name,
        count,
        version: tftVersion,
      }));
      
      // Create comp object
      const comp: TFTComp = {
        id: uuidv4(),
        name: data.name,
        tier: data.tier as "S" | "A" | "B" | "C",
        description: data.description,
        playstyle: data.playstyle as "Fast 8" | "Slow Roll" | "Standard" | "Hyper Roll",
        difficulty: data.difficulty as "Easy" | "Medium" | "Hard",
        patch: "current",
        tftVersion: data.tftVersion,
        earlyGame: [],
        finalComp: boardChampions,
        keyItems: [],
        traits: traits,
        boardPositions: true,
        strengthsWeaknesses: {
          strengths: [],
          weaknesses: [],
        },
      };
      
      // Save the comp
      await addComp(comp);
      
      toast({
        title: "Success",
        description: "Your composition has been saved!",
      });
      
      // Navigate back to the home page
      navigate('/');
    } catch (error) {
      console.error("Error saving comp:", error);
      toast({
        title: "Error",
        description: "Failed to save your composition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Sparkles className="h-6 w-6 text-primary mr-2 animate-pulse-subtle" />
            Build Your Composition
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Board Builder & Champion Details - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border border-primary/20 shadow-md backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="board">Board Builder</TabsTrigger>
                    <TabsTrigger value="champions">Champion Details</TabsTrigger>
                    <TabsTrigger value="add">Add Champion</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <TabsContent value="board" className="mt-0">
                  <TFTBoardBuilder 
                    availableChampions={availableChampions} 
                    onSave={handleSaveBoard}
                    initialChampions={boardChampions}
                  />
                </TabsContent>
                <TabsContent value="champions" className="mt-0">
                  {boardChampions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {boardChampions.map((champion, index) => (
                        <ChampionDetailCard 
                          key={index}
                          champion={champion}
                          onUpdate={(updated) => updateChampion(index, updated)}
                          onRemove={() => removeChampion(index)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="bg-muted/50 p-8 rounded-lg border border-border">
                        <Crown className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Champions Added</h3>
                        <p className="text-muted-foreground mt-2 mb-4">
                          Use the Board Builder tab to add champions to your composition.
                        </p>
                        <Button variant="default" onClick={() => setActiveTab('add')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Champions
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="add" className="mt-0">
                  <div className="space-y-6">
                    {/* Champion selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Select Champion</h3>
                      
                      <div className="relative">
                        <div className="flex gap-3 mb-3">
                          <div className="flex-1">
                            <Input
                              type="text"
                              placeholder="Search champions..."
                              value={championSearchQuery}
                              onChange={(e) => setChampionSearchQuery(e.target.value)}
                              className="w-full"
                              onClick={() => setShowChampionSelector(true)}
                            />
                            {showChampionSelector && (
                              <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-md max-h-80 overflow-y-auto">
                                {filteredChampions.length > 0 ? (
                                  filteredChampions.map((champion, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                                      onClick={() => selectChampion(champion)}
                                    >
                                      <div className="flex-shrink-0">
                                        <ChampionIcon name={champion.name} cost={champion.cost} size="sm" />
                                      </div>
                                      <div>
                                        <div className="font-medium">{champion.name}</div>
                                        <div className="text-xs text-muted-foreground">Cost: {champion.cost}</div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-muted-foreground">
                                    No champions found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {selectedChampionName && (
                            <div className="flex items-center">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isCarry}
                                  onChange={(e) => setIsCarry(e.target.checked)}
                                  className="rounded text-primary"
                                />
                                <span className="text-sm">Carry</span>
                              </label>
                            </div>
                          )}
                        </div>
                        
                        {selectedChampionName && (
                          <div className="bg-card/50 border border-border p-4 rounded-md mb-4">
                            <div className="flex items-center gap-3">
                              <ChampionIcon
                                name={selectedChampionName}
                                cost={selectedChampionCost}
                                isCarry={isCarry}
                                size="md"
                              />
                              <div>
                                <h4 className="font-medium">{selectedChampionName}</h4>
                                <p className="text-sm text-muted-foreground">Cost: {selectedChampionCost}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Item selection */}
                    {selectedChampionName && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Select Items (Max 3)</h3>
                        
                        <ItemSearchBar
                          onSelectItem={addItemToSelection}
                          currentItemCount={selectedItems.length}
                          placeholder="Search for items..."
                        />
                        
                        {selectedItems.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-3">
                            {selectedItems.map((item, index) => (
                              <div key={index} className="relative group">
                                <ItemIcon name={item} />
                                <button
                                  className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeItemFromSelection(index)}
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <Button
                          onClick={addChampionToBoard}
                          disabled={!selectedChampionName}
                          className="w-full mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Champion to Board
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
          
          {/* Comp Details Form - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-primary/20 shadow-md backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Composition Details
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        Provide details about your composition to help others understand how to use it.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>Fill out the information to complete your composition</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Composition Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Reroll Rangers" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Explain how this comp works and why it's effective..."
                              {...field} 
                              className="min-h-20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tier</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select tier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="S">S Tier</SelectItem>
                                <SelectItem value="A">A Tier</SelectItem>
                                <SelectItem value="B">B Tier</SelectItem>
                                <SelectItem value="C">C Tier</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tftVersion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TFT Set</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select set" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.keys(traitMappings).map(version => (
                                  <SelectItem key={version} value={version}>
                                    {traitMappings[version].name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="playstyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Playstyle</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select playstyle" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Fast 8">Fast 8</SelectItem>
                                <SelectItem value="Slow Roll">Slow Roll</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Hyper Roll">Hyper Roll</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || boardChampions.length === 0} 
                      className="w-full hover-lift shine-effect mt-6"
                    >
                      {isSubmitting ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Composition
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="py-12 mt-8 border-t border-border/30 relative z-10">
        <div className="container mx-auto text-center">
          <p className="mb-6 text-foreground/90">
            This is a fan-made project created to help the TFT community. If you find it helpful, please consider supporting the development.
          </p>
          
          <a href={`https://www.paypal.com/paypalme/jakelarsh`} target="_blank" rel="noopener noreferrer">
            <Button variant="default" className="hover-lift shine-effect mb-8" size="lg">
              Support the Developer
            </Button>
          </a>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground">
                <strong>Disclaimer:</strong> TFT Genie is not affiliated with, endorsed, sponsored, or specifically 
                approved by Riot Games, Inc. or League of Legends. All game assets and trademarks are property 
                of their respective owners.
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">
              © {new Date().getFullYear()} TFT Genie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompBuilder;
