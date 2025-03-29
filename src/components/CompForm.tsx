import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TFTComp, Champion, Trait } from '@/data/comps';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash, X, Loader2, MapPin, Crown, Shield } from 'lucide-react';
import ChampionIcon from './ChampionIcon';
import BoardPositioning from './BoardPositioning';
import { useComps } from '@/contexts/CompsContext';
import { ChampionTraitMap, PositionedChampion } from '@/types/champion';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const commonItems = [
  "Infinity Edge", "Giant Slayer", "Rapid Firecannon", "Runaan's Hurricane", 
  "Guinsoo's Rageblade", "Bloodthirster", "Titan's Resolve", "Blue Buff", 
  "Spear of Shojin", "Archangel's Staff", "Morellonomicon", "Sunfire Cape",
  "Warmog's Armor", "Dragon's Claw", "Gargoyle Stoneplate", "Redemption",
  "Hand of Justice", "Guardian Angel", "Jeweled Gauntlet", "Rabadon's Deathcap",
  "Zeke's Herald", "Ionic Spark", "Zz'Rot Portal", "Chalice of Power",
  "Thieves' Gloves", "Shroud of Stillness", "Banshee's Claw", "Last Whisper"
];

const formSchema = z.object({
  id: z.string().min(3, { message: "ID must be at least 3 characters" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  tier: z.enum(['S', 'A', 'B', 'C']),
  playstyle: z.enum(['Fast 8', 'Slow Roll', 'Standard', 'Hyper Roll']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  patch: z.string(),
  tftVersion: z.string(),
});

interface CompFormProps {
  initialData?: TFTComp;
  onSubmit: (data: TFTComp) => void;
  isSubmitting?: boolean;
}

const CompForm: React.FC<CompFormProps> = ({ initialData, onSubmit, isSubmitting = false }) => {
  const [earlyGame, setEarlyGame] = useState<Champion[]>(initialData?.earlyGame || []);
  const [finalComp, setFinalComp] = useState<Champion[]>(initialData?.finalComp || []);
  const [keyItems, setKeyItems] = useState<string[]>(initialData?.keyItems || []);
  const [traits, setTraits] = useState<Trait[]>(initialData?.traits || []);
  const [strengths, setStrengths] = useState<string[]>(initialData?.strengthsWeaknesses?.strengths || []);
  const [weaknesses, setWeaknesses] = useState<string[]>(initialData?.strengthsWeaknesses?.weaknesses || []);
  
  const [newChampName, setNewChampName] = useState("");
  const [newChampCost, setNewChampCost] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [newChampItems, setNewChampItems] = useState<string[]>([]);
  const [newChampIsCarry, setNewChampIsCarry] = useState(false);
  const [newChampType, setNewChampType] = useState<"early" | "final">("early");
  
  const [newItemName, setNewItemName] = useState("");
  const [newTraitName, setNewTraitName] = useState("");
  const [newTraitCount, setNewTraitCount] = useState(2);
  const [newStrength, setNewStrength] = useState("");
  const [newWeakness, setNewWeakness] = useState("");
  const [newTraitVersion, setNewTraitVersion] = useState<string>(initialData?.tftVersion || "Set 10");

  const [activeTab, setActiveTab] = useState("general");
  const [filteredChampions, setFilteredChampions] = useState<string[]>([]);

  const { traitMappings } = useComps();
  const availableSets = Object.keys(traitMappings);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      id: initialData.id,
      name: initialData.name,
      tier: initialData.tier,
      playstyle: initialData.playstyle,
      difficulty: initialData.difficulty,
      description: initialData.description,
      patch: initialData.patch,
      tftVersion: initialData.tftVersion || "Set 10",
    } : {
      id: "",
      name: "",
      tier: "A",
      playstyle: "Standard",
      difficulty: "Medium",
      description: "",
      patch: "14.1",
      tftVersion: availableSets[0] || "Set 10",
    },
  });

  const currentTftVersion = form.watch("tftVersion") || availableSets[0] || "Set 10";
  
  const availableTraits = traitMappings[currentTftVersion]?.traits || [];
  
  const currentTraitMap = traitMappings[currentTftVersion]?.championTraits || {};

  useEffect(() => {
    const championsInCurrentSet = Object.keys(currentTraitMap);
    setFilteredChampions(championsInCurrentSet);
    
    if (newChampName && !championsInCurrentSet.includes(newChampName)) {
      setNewChampName("");
    }
    
    setNewTraitVersion(currentTftVersion);
  }, [currentTftVersion, currentTraitMap, newChampName]);

  const handleUpdatePositions = (updatedChampions: Champion[]) => {
    setFinalComp(updatedChampions);
  };

  const getChampionTraits = (championName: string): string[] => {
    return currentTraitMap[championName] || [];
  };

  const handleAddChampion = (champType: "early" | "final") => {
    if (!newChampName) return;
    
    const newChampion: Champion = {
      name: newChampName,
      cost: newChampCost,
      items: newChampItems.length > 0 ? [...newChampItems] : undefined,
      isCarry: newChampIsCarry,
      position: null,
    };
    
    if (champType === "early") {
      setEarlyGame([...earlyGame, newChampion]);
    } else if (champType === "final") {
      setFinalComp([...finalComp, newChampion]);
    }
    
    const championTraits = getChampionTraits(newChampName);
    if (championTraits && championTraits.length > 0) {
      const newTraits = [...traits];
      
      championTraits.forEach(traitName => {
        const existingTrait = newTraits.find(t => t.name === traitName);
        
        if (existingTrait) {
          existingTrait.count += 1;
        } else if (availableTraits.includes(traitName)) {
          newTraits.push({
            name: traitName,
            count: 1,
            version: currentTftVersion
          });
        }
      });
      
      setTraits(newTraits);
      
      toast({
        title: "Traits Auto-Added",
        description: `Added traits for ${newChampName}: ${championTraits.join(', ')}`,
      });
    }
    
    setNewChampName("");
    setNewChampCost(1);
    setNewChampItems([]);
    setNewChampIsCarry(false);
  };

  const removeChampion = (index: number, type: "early" | "final") => {
    if (type === "early") {
      setEarlyGame(earlyGame.filter((_, i) => i !== index));
    } else {
      setFinalComp(finalComp.filter((_, i) => i !== index));
    }
  };

  const handleAddItem = () => {
    if (!newItemName || keyItems.includes(newItemName)) return;
    setKeyItems([...keyItems, newItemName]);
    setNewItemName("");
  };

  const removeItem = (index: number) => {
    setKeyItems(keyItems.filter((_, i) => i !== index));
  };

  const handleAddTrait = () => {
    if (!newTraitName) return;
    setTraits([...traits, { 
      name: newTraitName, 
      count: newTraitCount,
      version: newTraitVersion 
    }]);
    setNewTraitName("");
    setNewTraitCount(2);
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const handleAddStrength = () => {
    if (!newStrength || strengths.includes(newStrength)) return;
    setStrengths([...strengths, newStrength]);
    setNewStrength("");
  };

  const handleAddWeakness = () => {
    if (!newWeakness || weaknesses.includes(newWeakness)) return;
    setWeaknesses([...weaknesses, newWeakness]);
    setNewWeakness("");
  };

  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };

  const removeWeakness = (index: number) => {
    setWeaknesses(weaknesses.filter((_, i) => i !== index));
  };

  const handleAddChampionItem = () => {
    if (!newItemName || newChampItems.includes(newItemName)) return;
    setNewChampItems([...newChampItems, newItemName]);
    setNewItemName("");
  };

  const removeChampionItem = (index: number) => {
    setNewChampItems(newChampItems.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    if (finalComp.length === 0) {
      toast({
        title: "Validation Error",
        description: "You must add at least one champion to the final comp",
        variant: "destructive",
      });
      return;
    }

    if (traits.length === 0) {
      toast({
        title: "Validation Error",
        description: "You must add at least one trait",
        variant: "destructive",
      });
      return;
    }

    const newComp: TFTComp = {
      id: values.id,
      name: values.name,
      tier: values.tier,
      playstyle: values.playstyle,
      difficulty: values.difficulty,
      description: values.description,
      patch: values.patch,
      tftVersion: values.tftVersion,
      earlyGame,
      finalComp,
      keyItems,
      traits,
      boardPositions: finalComp.some(champ => champ.position !== null),
      strengthsWeaknesses: {
        strengths,
        weaknesses,
      },
    };

    onSubmit(newComp);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="champions">Champions</TabsTrigger>
            <TabsTrigger value="traits">Traits</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="positioning">Positioning</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comp Name</FormLabel>
                    <FormControl>
                      <Input placeholder="8-Bit Disco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID (for URL)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="8bit-disco" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
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
                name="playstyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Playstyle</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
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
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
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
              
              <FormField
                control={form.control}
                name="tftVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TFT Version</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setNewTraitVersion(value);
                      }} 
                      defaultValue={field.value || availableSets[0] || "Set 10"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select TFT version" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSets.map((setName) => (
                          <SelectItem key={setName} value={setName}>
                            {traitMappings[setName]?.name || setName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="This comp focuses on..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patch</FormLabel>
                  <FormControl>
                    <Input placeholder="14.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="champions" className="space-y-6">
            <Card className="p-6 border border-primary/20 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-medium">Early Game Champions</h3>
              </div>
              
              {earlyGame.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-6">
                  {earlyGame.map((champ, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-2 bg-card border border-border rounded-md group hover:border-primary/40 transition-all"
                    >
                      <ChampionIcon name={champ.name} cost={champ.cost} size="md" />
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{champ.name}</p>
                        <p className="text-xs text-muted-foreground">{champ.cost} Cost</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeChampion(index, "early")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/40 rounded-md mb-6">
                  <p className="text-muted-foreground">No early game champions added yet</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <Label className="mb-2 block">Champion Name</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Input 
                        value={newChampName} 
                        onChange={(e) => setNewChampName(e.target.value)}
                        placeholder={filteredChampions.length > 0 ? "Search champions..." : `No champions for ${currentTftVersion}`}
                        disabled={filteredChampions.length === 0}
                        className="w-full"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredChampions
                          .filter(name => name.toLowerCase().includes(newChampName.toLowerCase()))
                          .map((name, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start rounded-none text-left font-normal"
                              onClick={() => setNewChampName(name)}
                            >
                              {name}
                            </Button>
                          ))
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-full sm:w-2/3">
                    <Label className="mb-2 block">Cost</Label>
                    <Select 
                      value={newChampCost.toString()} 
                      onValueChange={(val) => setNewChampCost(parseInt(val) as 1 | 2 | 3 | 4 | 5)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Cost" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Cost</SelectItem>
                        <SelectItem value="2">2 Cost</SelectItem>
                        <SelectItem value="3">3 Cost</SelectItem>
                        <SelectItem value="4">4 Cost</SelectItem>
                        <SelectItem value="5">5 Cost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="button" 
                    onClick={() => handleAddChampion("early")}
                    disabled={!newChampName || filteredChampions.length === 0}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-primary/20 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-medium">Final Composition</h3>
              </div>
              
              {finalComp.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {finalComp.map((champ, index) => (
                    <div 
                      key={index} 
                      className={`flex p-3 rounded-md group transition-all border ${
                        champ.isCarry 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-card border-border hover:border-primary/40'
                      }`}
                    >
                      <ChampionIcon name={champ.name} cost={champ.cost} size="lg" />
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{champ.name}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeChampion(index, "final")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs">
                          <span className={`px-1.5 py-0.5 rounded ${
                            champ.cost >= 4 ? 'bg-primary/20 text-primary' : 'bg-muted'
                          }`}>
                            {champ.cost} Cost
                          </span>
                          
                          {champ.isCarry && (
                            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded flex items-center">
                              <Crown className="h-3 w-3 mr-0.5" />
                              Carry
                            </span>
                          )}
                        </div>
                        
                        {champ.items && champ.items.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Items:</p>
                            <div className="flex flex-wrap gap-1">
                              {champ.items.map((item, idx) => (
                                <span key={idx} className="text-xs bg-secondary/30 px-1.5 py-0.5 rounded">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/40 rounded-md mb-6">
                  <p className="text-muted-foreground">No final comp champions added yet</p>
                </div>
              )}
              
              <div className="space-y-4 border border-border rounded-md p-4 bg-card/50">
                <h4 className="font-medium text-sm">Add Champion to Final Comp</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Champion Name</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input 
                          value={newChampName} 
                          onChange={(e) => setNewChampName(e.target.value)}
                          placeholder={filteredChampions.length > 0 ? "Search champions..." : `No champions for ${currentTftVersion}`}
                          disabled={filteredChampions.length === 0}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredChampions
                            .filter(name => name.toLowerCase().includes(newChampName.toLowerCase()))
                            .map((name, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start rounded-none text-left font-normal"
                                onClick={() => setNewChampName(name)}
                              >
                                {name}
                              </Button>
                            ))
                          }
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Cost</Label>
                      <Select 
                        value={newChampCost.toString()} 
                        onValueChange={(val) => setNewChampCost(parseInt(val) as 1 | 2 | 3 | 4 | 5)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Cost" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Cost</SelectItem>
                          <SelectItem value="2">2 Cost</SelectItem>
                          <SelectItem value="3">3 Cost</SelectItem>
                          <SelectItem value="4">4 Cost</SelectItem>
                          <SelectItem value="5">5 Cost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end mb-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="carry-checkbox"
                          checked={newChampIsCarry}
                          onChange={(e) => setNewChampIsCarry(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="carry-checkbox" className="cursor-pointer">
                          Is Carry?
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Items</Label>
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                    {newChampItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary/30 rounded-md px-2 py-1">
                        <span className="text-xs">{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeChampionItem(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input 
                          value={newItemName} 
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="Search for an item..."
                          className="flex-1"
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="max-h-[200px] overflow-y-auto">
                          {commonItems
                            .filter(name => name.toLowerCase().includes(newItemName.toLowerCase()))
                            .map((name, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start rounded-none text-left font-normal"
                                onClick={() => setNewItemName(name)}
                              >
                                {name}
                              </Button>
                            ))
                          }
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button 
                      type="button" 
                      onClick={handleAddChampionItem}
                      disabled={!newItemName || newChampItems.includes(newItemName)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  onClick={() => handleAddChampion("final")}
                  disabled={!newChampName || filteredChampions.length === 0}
                  className="w-full"
                >
                  Add Champion to Final Comp
                </Button>
              </div>
              
              {filteredChampions.length > 0 && (
                <div className="mt-4 bg-secondary/20 p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Champions in {traitMappings[currentTftVersion]?.name || currentTftVersion}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {filteredChampions.length} champions available in this set
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="traits" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Traits</h3>
              
              <div className="flex flex-wrap gap-2">
                {traits.map((trait, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary/50 rounded-md p-1 pr-2">
                    <span className="text-sm">{trait.name} ({trait.count})</span>
                    {trait.version && (
                      <span className="text-xs text-muted-foreground ml-1">{trait.version}</span>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => removeTrait(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="md:col-span-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Input 
                        value={newTraitName} 
                        onChange={(e) => setNewTraitName(e.target.value)}
                        placeholder="Trait name"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="max-h-[200px] overflow-y-auto">
                        {availableTraits
                          .filter(name => name.toLowerCase().includes(newTraitName.toLowerCase()))
                          .map((name, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start rounded-none text-left font-normal"
                              onClick={() => setNewTraitName(name)}
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
                  <Input 
                    type="number" 
                    min="1" 
                    max="9"
                    value={newTraitCount} 
                    onChange={(e) => setNewTraitCount(parseInt(e.target.value))}
                    placeholder="Count"
                  />
                </div>
                
                <div>
                  <Button 
                    type="button" 
                    onClick={handleAddTrait}
                    disabled={!newTraitName}
                    className="w-full"
                  >
                    Add Trait
                  </Button>
                </div>
              </div>
              
              <div className="bg-secondary/20 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Available Traits for {traitMappings[currentTftVersion]?.name || currentTftVersion}</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTraits.length > 0 ? (
                    availableTraits.map((trait) => (
                      <div 
                        key={trait} 
                        className="px-2 py-1 bg-secondary/50 rounded text-xs cursor-pointer hover:bg-secondary"
                        onClick={() => setNewTraitName(trait)}
                      >
                        {trait}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No traits available for this set. Please add traits in the Set Manager.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Items</h3>
              
              <div className="flex flex-wrap gap-2">
                {keyItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary/50 rounded-md p-1 pr-2">
                    <span className="text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => removeItem(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Input 
                      value={newItemName} 
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Item name"
                      className="flex-1"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-[200px] overflow-y-auto">
                      {commonItems
                        .filter(name => name.toLowerCase().includes(newItemName.toLowerCase()))
                        .map((name, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start rounded-none text-left font-normal"
                            onClick={() => setNewItemName(name)}
                          >
                            {name}
                          </Button>
                        ))
                      }
                    </div>
                  </PopoverContent>
                </Popover>
                <Button 
                  type="button" 
                  onClick={handleAddItem}
                  disabled={!newItemName || keyItems.includes(newItemName)}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="positioning" className="space-y-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5" />
                Champion Positioning
              </h3>
              
              <div className="bg-card/50 border border-border rounded-lg p-6">
                <BoardPositioning 
                  champions={finalComp} 
                  onUpdatePositions={handleUpdatePositions}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Strengths</h3>
              
              <div className="flex flex-wrap gap-2">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary/50 rounded-md p-1 pr-2">
                    <span className="text-sm">{strength}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => removeStrength(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={newStrength} 
                  onChange={(e) => setNewStrength(e.target.value)}
                  placeholder="Add a strength"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddStrength}
                  disabled={!newStrength || strengths.includes(newStrength)}
                >
                  Add Strength
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Weaknesses</h3>
              
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary/50 rounded-md p-1 pr-2">
                    <span className="text-sm">{weakness}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => removeWeakness(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={newWeakness} 
                  onChange={(e) => setNewWeakness(e.target.value)}
                  placeholder="Add a weakness"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddWeakness}
                  disabled={!newWeakness || weaknesses.includes(newWeakness)}
                >
                  Add Weakness
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6 border-t border-border">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full md:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Comp
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompForm;
