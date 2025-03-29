import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TFTComp, Champion } from '@/data/comps';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MapPin, Crown, Plus, X } from 'lucide-react';
import ChampionIcon from './ChampionIcon';
import { useComps } from '@/contexts/CompsContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import BoardPositioning from './BoardPositioning';

const commonItems = [
  "B.F. Sword", "Recurve Bow", "Needlessly Large Rod", "Tear of the Goddess", 
  "Chain Vest", "Negatron Cloak", "Giant's Belt", "Spatula", "Sparring Gloves",
  "Infinity Edge", "Giant Slayer", "Bloodthirster", "Deathblade", 
  "Rapid Firecannon", "Guinsoo's Rageblade", "Runaan's Hurricane", "Statikk Shiv", 
  "Hextech Gunblade", "Archangel's Staff", "Rabadon's Deathcap", "Morellonomicon", "Jeweled Gauntlet",
  "Blue Buff", "Frozen Heart", "Chalice of Power", "Spear of Shojin",
  "Bramble Vest", "Gargoyle Stoneplate", "Sunfire Cape", "Locket of the Iron Solari",
  "Dragon's Claw", "Quicksilver", "Zephyr", "Ionic Spark",
  "Warmog's Armor", "Redemption", "Zz'Rot Portal", "Banshee's Claw",
  "Thief's Gloves", "Hand of Justice", "Titan's Resolve", "Last Whisper"
];

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  tier: z.enum(['S', 'A', 'B', 'C']),
  playstyle: z.enum(['Fast 8', 'Slow Roll', 'Standard', 'Hyper Roll']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  patch: z.string(),
  tftVersion: z.string(),
});

const championFormSchema = z.object({
  name: z.string().min(1, { message: "Please select a champion" }),
  isCarry: z.boolean().default(false)
});

interface SimpleCompFormProps {
  initialData?: TFTComp;
  onSubmit: (data: TFTComp) => void;
  isSubmitting?: boolean;
}

const SimpleCompForm: React.FC<SimpleCompFormProps> = ({ initialData, onSubmit, isSubmitting = false }) => {
  const [finalComp, setFinalComp] = useState<Champion[]>(initialData?.finalComp || []);
  const [activeTab, setActiveTab] = useState("general");
  const [newChampName, setNewChampName] = useState("");
  const [newChampIsCarry, setNewChampIsCarry] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
  const currentTraitMap = traitMappings[currentTftVersion]?.championTraits || {};
  const currentCostMap = traitMappings[currentTftVersion]?.championCosts || {};
  
  useEffect(() => {
    if (initialData?.finalComp) {
      setFinalComp(initialData.finalComp);
    }
  }, [initialData]);

  const handleAddChampion = () => {
    if (!newChampName) return;
    
    const cost = currentCostMap[newChampName] || 1;
    
    const newChampion: Champion = {
      name: newChampName,
      cost: cost as 1 | 2 | 3 | 4 | 5,
      isCarry: newChampIsCarry,
      position: null,
      items: selectedItems.length > 0 ? [...selectedItems] : undefined,
    };
    
    setFinalComp(prevComp => [...prevComp, newChampion]);
    setNewChampName("");
    setNewChampIsCarry(false);
    setSelectedItems([]);
  };

  const addItemToChampion = () => {
    if (!selectedItem || selectedItems.length >= 3) return;
    setSelectedItems(prevItems => [...prevItems, selectedItem]);
    setSelectedItem("");
  };

  const removeItemFromSelection = (index: number) => {
    setSelectedItems(prevItems => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const removeChampion = (index: number) => {
    setFinalComp(prevComp => prevComp.filter((_, i) => i !== index));
  };

  const handleUpdatePositions = (champions: Champion[]) => {
    setFinalComp(champions);
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    if (finalComp.length === 0) {
      return;
    }

    const detectedTraits: { [key: string]: number } = {};
    finalComp.forEach(champion => {
      const championTraits = currentTraitMap[champion.name] || [];
      championTraits.forEach(trait => {
        detectedTraits[trait] = (detectedTraits[trait] || 0) + 1;
      });
    });

    const traitsArray = Object.entries(detectedTraits).map(([name, count]) => ({
      name,
      count,
      version: currentTftVersion
    }));

    const newComp: TFTComp = {
      id: values.id || "",
      name: values.name,
      tier: values.tier,
      playstyle: values.playstyle,
      difficulty: values.difficulty,
      description: values.description,
      patch: values.patch,
      tftVersion: values.tftVersion,
      finalComp,
      traits: traitsArray,
      boardPositions: finalComp.some(champ => champ.position !== null),
      earlyGame: [],
      keyItems: [],
      strengthsWeaknesses: {
        strengths: [],
        weaknesses: [],
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
            <TabsTrigger value="positioning">Positioning</TabsTrigger>
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
                      onValueChange={field.onChange} 
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
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-medium">Team Composition</h3>
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
                      <ChampionIcon name={champ.name} cost={champ.cost} size="lg" isCarry={champ.isCarry} />
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{champ.name}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeChampion(index)}
                          >
                            <span className="sr-only">Remove</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs mt-1">
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
                        
                        {champ.position && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            Position: ({champ.position.row}, {champ.position.col})
                          </div>
                        )}

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
                  <p className="text-muted-foreground">No champions added yet. Add champions below or use the Positioning tab to place champions on the board.</p>
                </div>
              )}
              
              <div className="space-y-4 border border-border rounded-md p-4 bg-card/50">
                <h4 className="font-medium text-sm">Add Champion</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Champion Name</Label>
                    <select
                      value={newChampName}
                      onChange={(e) => setNewChampName(e.target.value)}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    >
                      <option value="">Select a champion</option>
                      {Object.keys(currentTraitMap).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end gap-4">
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

                    <div className="flex-1">
                      <Select
                        value={selectedItem}
                        onValueChange={setSelectedItem}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Item" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonItems.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={addItemToChampion}
                      disabled={!selectedItem || selectedItems.length >= 3}
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {selectedItems.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Selected Items ({selectedItems.length}/3)</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-1 bg-secondary/30 rounded-md px-2 py-1">
                          <span className="text-xs">{item}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => removeItemFromSelection(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  type="button" 
                  onClick={handleAddChampion}
                  disabled={!newChampName}
                  className="w-full"
                >
                  Add Champion
                </Button>
              </div>
              
              <div className="mt-4 bg-secondary/20 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Need to position your champions?</h4>
                <p className="text-xs text-muted-foreground">
                  Use the Positioning tab to drag and drop champions onto the board to create your ideal team formation.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="positioning" className="space-y-6">
            <div className="bg-card/50 border border-border rounded-lg p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Champion Positioning
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag champions to place them on the board in optimal positions.
                </p>
              </div>
              
              <BoardPositioning 
                champions={finalComp}
                onUpdatePositions={handleUpdatePositions}
                readonly={false}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6 border-t border-border">
          <Button 
            type="submit" 
            disabled={isSubmitting || finalComp.length === 0} 
            className="w-full md:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Composition
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SimpleCompForm;
