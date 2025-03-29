
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TFTComp, Champion } from '@/data/comps';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash, X } from 'lucide-react';
import ChampionIcon from './ChampionIcon';

// Schema for form validation
const formSchema = z.object({
  id: z.string().min(3, { message: "ID must be at least 3 characters" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  tier: z.enum(['S', 'A', 'B', 'C']),
  playstyle: z.enum(['Fast 8', 'Slow Roll', 'Standard', 'Hyper Roll']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  patch: z.string(),
});

interface CompFormProps {
  initialData?: TFTComp;
  onSubmit: (data: TFTComp) => void;
}

// Common champion names for dropdown suggestions
const commonChampions = [
  "Ahri", "Akali", "Amumu", "Annie", "Aphelios", "Bard", "Caitlyn", 
  "Corki", "Ekko", "Evelynn", "Garen", "Gragas", "Illaoi", "Jax", 
  "Jhin", "Jinx", "Kayle", "Kayn", "Kennen", "Karthus", "Lillia", 
  "Lucian", "Lulu", "Lux", "Miss Fortune", "Mordekaiser", "Neeko", 
  "Olaf", "Pantheon", "Poppy", "Qiyana", "Samira", "Senna", "Seraphine", 
  "Sett", "Sona", "Tahm Kench", "Taric", "Thresh", "Twisted Fate", 
  "Twitch", "Urgot", "Vex", "Vi", "Viego", "Yasuo", "Yone", "Yorick", "Zac", "Ziggs"
];

// Common traits for dropdown suggestions
const commonTraits = [
  "8-Bit", "K/DA", "True Damage", "Disco", "Heartsteel", "Hyperpop", 
  "Pentakill", "Country", "EDM", "Punk", "Jazz", "Emo", "Illbeats", 
  "Maestro", "Guardian", "Bruiser", "Crowd Diver", "Big Shot", "Superfan", "Edgelord"
];

// Common items for dropdown suggestions
const commonItems = [
  "Blue Buff", "Infinity Edge", "Jeweled Gauntlet", "Giant Slayer", 
  "Bloodthirster", "Titan's Resolve", "Last Whisper", "Runaan's Hurricane", 
  "Spear of Shojin", "Warmog's Armor", "Dragon's Claw", "Gargoyle Stoneplate", 
  "Quicksilver", "Archangel's Staff", "Hextech Gunblade", "Guinsoo's Rageblade", 
  "Sunfire Cape", "Bramble Vest", "Ionic Spark", "Redemption", "Chalice of Power"
];

const CompForm: React.FC<CompFormProps> = ({ initialData, onSubmit }) => {
  const [earlyGame, setEarlyGame] = useState<Champion[]>(initialData?.earlyGame || []);
  const [finalComp, setFinalComp] = useState<Champion[]>(initialData?.finalComp || []);
  const [keyItems, setKeyItems] = useState<string[]>(initialData?.keyItems || []);
  const [traits, setTraits] = useState<{ name: string; count: number }[]>(initialData?.traits || []);
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

  // Initialize form with initial data if provided
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
    } : {
      id: "",
      name: "",
      tier: "A",
      playstyle: "Standard",
      difficulty: "Medium",
      description: "",
      patch: "14.1",
    },
  });

  const handleAddChampion = () => {
    if (!newChampName) return;
    
    const newChampion: Champion = {
      name: newChampName,
      cost: newChampCost,
      items: newChampItems.length > 0 ? [...newChampItems] : undefined,
      isCarry: newChampIsCarry,
    };
    
    if (newChampType === "early") {
      setEarlyGame([...earlyGame, newChampion]);
    } else {
      setFinalComp([...finalComp, newChampion]);
    }
    
    // Reset form fields
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
    setTraits([...traits, { name: newTraitName, count: newTraitCount }]);
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
    // Validate that we have at least some champions
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

    // Construct the final comp object
    const newComp: TFTComp = {
      ...values,
      earlyGame,
      finalComp,
      keyItems,
      traits,
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Early Game Champions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Early Game Champions</h3>
          
          <div className="flex flex-wrap gap-2">
            {earlyGame.map((champ, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary/50 rounded-md p-1 pr-2">
                <ChampionIcon name={champ.name} cost={champ.cost} size="sm" />
                <span className="text-sm">{champ.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => removeChampion(index, "early")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Add Champion Form */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 border border-border rounded-md bg-card/50">
            <div className="flex-1">
              <FormLabel className="text-xs">Champion Name</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Input 
                    value={newChampName} 
                    onChange={(e) => setNewChampName(e.target.value)}
                    placeholder="Champion Name"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="max-h-[200px] overflow-y-auto">
                    {commonChampions
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
            
            <div className="w-24">
              <FormLabel className="text-xs">Cost</FormLabel>
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
            
            <div className="flex-shrink-0">
              <FormLabel className="text-xs invisible sm:visible">Add</FormLabel>
              <Button 
                type="button" 
                onClick={() => {
                  setNewChampType("early");
                  handleAddChampion();
                }}
                disabled={!newChampName}
              >
                Add Champion
              </Button>
            </div>
          </div>
        </div>

        {/* Final Comp Champions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Final Comp</h3>
          
          <div className="flex flex-wrap gap-2">
            {finalComp.map((champ, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-1 ${champ.isCarry ? 'bg-primary/20' : 'bg-secondary/50'} rounded-md p-1 pr-2`}
              >
                <ChampionIcon name={champ.name} cost={champ.cost} size="sm" />
                <div className="flex flex-col text-sm">
                  <span>{champ.name}{champ.isCarry && ' (Carry)'}</span>
                  {champ.items && champ.items.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {champ.items.join(', ')}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => removeChampion(index, "final")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Add Final Comp Champion Form */}
          <div className="space-y-4 p-4 border border-border rounded-md bg-card/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FormLabel className="text-xs">Champion Name</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input 
                      value={newChampName} 
                      onChange={(e) => setNewChampName(e.target.value)}
                      placeholder="Champion Name"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-[200px] overflow-y-auto">
                      {commonChampions
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
                <div className="w-full sm:w-24">
                  <FormLabel className="text-xs">Cost</FormLabel>
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
                
                <div className="flex items-end">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-xs">Carry?</FormLabel>
                    <input
                      type="checkbox"
                      checked={newChampIsCarry}
                      onChange={(e) => setNewChampIsCarry(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Champion Items */}
            <div>
              <FormLabel className="text-xs">Items</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {newChampItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary/50 rounded-md p-1 pr-2">
                    <span className="text-xs">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
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
              onClick={() => {
                setNewChampType("final");
                handleAddChampion();
              }}
              disabled={!newChampName}
              className="w-full"
            >
              Add Champion to Final Comp
            </Button>
          </div>
        </div>

        {/* Traits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Traits</h3>
          
          <div className="flex flex-wrap gap-2">
            {traits.map((trait, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary/50 rounded-md p-1 pr-2">
                <span className="text-sm">{trait.name} ({trait.count})</span>
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
          
          <div className="flex gap-2">
            <div className="flex-1">
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
                    {commonTraits
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
            
            <div className="w-20">
              <Input 
                type="number" 
                min="1" 
                max="9"
                value={newTraitCount} 
                onChange={(e) => setNewTraitCount(parseInt(e.target.value))}
                placeholder="Count"
              />
            </div>
            
            <Button 
              type="button" 
              onClick={handleAddTrait}
              disabled={!newTraitName}
            >
              Add Trait
            </Button>
          </div>
        </div>

        {/* Key Items */}
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

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
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
                placeholder="Strength"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddStrength}
                disabled={!newStrength}
              >
                Add
              </Button>
            </div>
          </div>
          
          {/* Weaknesses */}
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
                placeholder="Weakness"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddWeakness}
                disabled={!newWeakness}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-6 space-x-2 flex justify-end">
          <Button type="submit" size="lg">Save Composition</Button>
        </div>
      </form>
    </Form>
  );
};

export default CompForm;
