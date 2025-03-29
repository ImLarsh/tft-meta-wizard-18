
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash, Save, X, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useComps } from '@/contexts/CompsContext';
import PageLayout from '@/components/PageLayout';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Schema for the set form
const setFormSchema = z.object({
  id: z.string().min(1, { message: "Set ID is required" }),
  name: z.string().min(1, { message: "Set name is required" }),
});

// Schema for the trait form
const traitFormSchema = z.object({
  name: z.string().min(1, { message: "Trait name is required" }),
});

// Schema for the champion form
const championFormSchema = z.object({
  name: z.string().min(1, { message: "Champion name is required" }),
  cost: z.enum(['1', '2', '3', '4', '5'], { 
    required_error: "Champion cost is required" 
  }),
});

const SetManager = () => {
  const { traitMappings, saveTraitMappings } = useComps();
  const [activeSet, setActiveSet] = useState<string | null>(null);
  const [isAddingSet, setIsAddingSet] = useState(false);
  const [isAddingTrait, setIsAddingTrait] = useState(false);
  const [isAddingChampion, setIsAddingChampion] = useState(false);
  const [traitToEdit, setTraitToEdit] = useState<string | null>(null);

  // Set form
  const setForm = useForm<z.infer<typeof setFormSchema>>({
    resolver: zodResolver(setFormSchema),
    defaultValues: {
      id: "",
      name: "",
    },
  });

  // Trait form
  const traitForm = useForm<z.infer<typeof traitFormSchema>>({
    resolver: zodResolver(traitFormSchema),
    defaultValues: {
      name: "",
    },
  });

  // Champion form
  const championForm = useForm<z.infer<typeof championFormSchema>>({
    resolver: zodResolver(championFormSchema),
    defaultValues: {
      name: "",
      cost: "1",
    },
  });

  // Get all available sets
  const availableSets = Object.keys(traitMappings || {});

  useEffect(() => {
    if (availableSets.length > 0 && !activeSet) {
      setActiveSet(availableSets[0]);
    }
  }, [availableSets, activeSet]);

  // Get traits for active set
  const getTraitsForActiveSet = () => {
    if (!activeSet || !traitMappings[activeSet]) return [];
    return traitMappings[activeSet].traits || [];
  };

  // Get champions for active set
  const getChampionsForActiveSet = () => {
    if (!activeSet || !traitMappings[activeSet]) return [];
    const champions = [];
    const champTraits = traitMappings[activeSet].championTraits || {};
    const champCosts = traitMappings[activeSet].championCosts || {};
    
    for (const champName in champTraits) {
      champions.push({
        name: champName,
        traits: champTraits[champName],
        cost: champCosts[champName] || 1
      });
    }
    
    return champions;
  };

  // Get champion traits for active set
  const getChampionTraitsForActiveSet = (championName: string) => {
    if (!activeSet || !traitMappings[activeSet] || !traitMappings[activeSet].championTraits) return [];
    return traitMappings[activeSet].championTraits[championName] || [];
  };

  // Get champion cost for active set
  const getChampionCostForActiveSet = (championName: string) => {
    if (!activeSet || !traitMappings[activeSet] || !traitMappings[activeSet].championCosts) return 1;
    return traitMappings[activeSet].championCosts[championName] || 1;
  };

  // Handle add set
  const handleAddSet = (values: z.infer<typeof setFormSchema>) => {
    const newSetId = values.id;
    
    if (traitMappings[newSetId]) {
      toast({
        title: "Error",
        description: `Set with ID "${newSetId}" already exists`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedMappings = {
      ...traitMappings,
      [newSetId]: {
        name: values.name,
        traits: [],
        championTraits: {},
        championCosts: {}
      }
    };
    
    saveTraitMappings(updatedMappings);
    setActiveSet(newSetId);
    setIsAddingSet(false);
    setForm.reset();
    
    toast({
      title: "Set Added",
      description: `Set "${values.name}" has been added successfully`,
    });
  };

  // Handle delete set
  const handleDeleteSet = (setId: string) => {
    if (!window.confirm(`Are you sure you want to delete the set "${traitMappings[setId].name}"?`)) {
      return;
    }
    
    const { [setId]: _, ...restMappings } = traitMappings;
    saveTraitMappings(restMappings);
    
    if (activeSet === setId) {
      setActiveSet(Object.keys(restMappings)[0] || null);
    }
    
    toast({
      title: "Set Deleted",
      description: `Set "${traitMappings[setId].name}" has been deleted`,
    });
  };

  // Handle add trait
  const handleAddTrait = (values: z.infer<typeof traitFormSchema>) => {
    if (!activeSet) return;
    
    const traitName = values.name;
    const currentTraits = traitMappings[activeSet].traits || [];
    
    if (currentTraits.includes(traitName)) {
      toast({
        title: "Error",
        description: `Trait "${traitName}" already exists in this set`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedMappings = {
      ...traitMappings,
      [activeSet]: {
        ...traitMappings[activeSet],
        traits: [...currentTraits, traitName]
      }
    };
    
    saveTraitMappings(updatedMappings);
    setIsAddingTrait(false);
    traitForm.reset();
    
    toast({
      title: "Trait Added",
      description: `Trait "${traitName}" has been added to set "${traitMappings[activeSet].name}"`,
    });
  };

  // Handle delete trait
  const handleDeleteTrait = (traitName: string) => {
    if (!activeSet) return;
    
    const updatedTraits = (traitMappings[activeSet].traits || []).filter(t => t !== traitName);
    
    // Also remove this trait from any champions that have it
    const updatedChampionTraits = { ...traitMappings[activeSet].championTraits };
    
    for (const champion in updatedChampionTraits) {
      updatedChampionTraits[champion] = updatedChampionTraits[champion].filter(t => t !== traitName);
    }
    
    const updatedMappings = {
      ...traitMappings,
      [activeSet]: {
        ...traitMappings[activeSet],
        traits: updatedTraits,
        championTraits: updatedChampionTraits
      }
    };
    
    saveTraitMappings(updatedMappings);
    
    toast({
      title: "Trait Deleted",
      description: `Trait "${traitName}" has been deleted from set "${traitMappings[activeSet].name}"`,
    });
  };

  // Handle add champion
  const handleAddChampion = (values: z.infer<typeof championFormSchema>) => {
    if (!activeSet) return;
    
    const championName = values.name;
    const championCost = parseInt(values.cost);
    
    if (traitMappings[activeSet].championTraits && traitMappings[activeSet].championTraits[championName]) {
      toast({
        title: "Error",
        description: `Champion "${championName}" already exists in this set`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedMappings = {
      ...traitMappings,
      [activeSet]: {
        ...traitMappings[activeSet],
        championTraits: {
          ...traitMappings[activeSet].championTraits,
          [championName]: []
        },
        championCosts: {
          ...traitMappings[activeSet].championCosts,
          [championName]: championCost
        }
      }
    };
    
    saveTraitMappings(updatedMappings);
    setIsAddingChampion(false);
    championForm.reset();
    
    toast({
      title: "Champion Added",
      description: `Champion "${championName}" has been added to set "${traitMappings[activeSet].name}"`,
    });
  };

  // Handle delete champion
  const handleDeleteChampion = (championName: string) => {
    if (!activeSet) return;
    
    const { [championName]: _, ...restChampionTraits } = traitMappings[activeSet].championTraits;
    const { [championName]: __, ...restChampionCosts } = traitMappings[activeSet].championCosts || {};
    
    const updatedMappings = {
      ...traitMappings,
      [activeSet]: {
        ...traitMappings[activeSet],
        championTraits: restChampionTraits,
        championCosts: restChampionCosts
      }
    };
    
    saveTraitMappings(updatedMappings);
    
    toast({
      title: "Champion Deleted",
      description: `Champion "${championName}" has been deleted from set "${traitMappings[activeSet].name}"`,
    });
  };

  // Handle toggle trait for champion
  const handleToggleTraitForChampion = (championName: string, traitName: string) => {
    if (!activeSet) return;
    
    const currentTraits = getChampionTraitsForActiveSet(championName);
    let updatedTraits: string[];
    
    if (currentTraits.includes(traitName)) {
      updatedTraits = currentTraits.filter(t => t !== traitName);
    } else {
      updatedTraits = [...currentTraits, traitName];
    }
    
    const updatedMappings = {
      ...traitMappings,
      [activeSet]: {
        ...traitMappings[activeSet],
        championTraits: {
          ...traitMappings[activeSet].championTraits,
          [championName]: updatedTraits
        }
      }
    };
    
    saveTraitMappings(updatedMappings);
  };

  // Handle update champion cost
  const handleUpdateChampionCost = (championName: string, newCost: number) => {
    if (!activeSet) return;
    
    const updatedMappings = {
      ...traitMappings,
      [activeSet]: {
        ...traitMappings[activeSet],
        championCosts: {
          ...traitMappings[activeSet].championCosts,
          [championName]: newCost
        }
      }
    };
    
    saveTraitMappings(updatedMappings);
    
    toast({
      title: "Champion Updated",
      description: `${championName}'s cost updated to ${newCost}`,
    });
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage TFT Sets</h1>
          <Dialog open={isAddingSet} onOpenChange={setIsAddingSet}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Set
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New TFT Set</DialogTitle>
              </DialogHeader>
              <Form {...setForm}>
                <form onSubmit={setForm.handleSubmit(handleAddSet)} className="space-y-4">
                  <FormField
                    control={setForm.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Set ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Set10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={setForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Set Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Remix Rumble" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingSet(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Set</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {availableSets.length > 0 ? (
          <Tabs 
            value={activeSet || ''} 
            onValueChange={setActiveSet}
            className="space-y-4"
          >
            <TabsList className="w-full border-b">
              {availableSets.map((setId) => (
                <TabsTrigger key={setId} value={setId} className="relative">
                  {traitMappings[setId].name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-5 w-5 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSet(setId);
                    }}
                  >
                    <Trash className="h-3 w-3 text-destructive" />
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>

            {availableSets.map((setId) => (
              <TabsContent key={setId} value={setId} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Set Information</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="space-y-2">
                            <h4 className="font-medium">About Sets Management</h4>
                            <p className="text-sm text-muted-foreground">
                              Here you can manage TFT sets, traits, and champions. Add traits first, then add champions and assign traits to them.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Champion costs will be stored here to automatically populate in comp creation.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Traits</h3>
                        
                        {getTraitsForActiveSet().length > 0 ? (
                          <div className="space-y-2">
                            {getTraitsForActiveSet().map((trait) => (
                              <div key={trait} className="flex items-center justify-between p-2 bg-secondary/20 rounded-md">
                                <span>{trait}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTrait(trait)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-muted/30 rounded-md">
                            <p className="text-muted-foreground">No traits added yet</p>
                          </div>
                        )}
                        
                        <Dialog open={isAddingTrait} onOpenChange={setIsAddingTrait}>
                          <DialogTrigger asChild>
                            <Button className="w-full mt-4">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Trait
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Trait to {traitMappings[setId].name}</DialogTitle>
                            </DialogHeader>
                            <Form {...traitForm}>
                              <form onSubmit={traitForm.handleSubmit(handleAddTrait)} className="space-y-4">
                                <FormField
                                  control={traitForm.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Trait Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., K/DA" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button type="button" variant="outline" onClick={() => setIsAddingTrait(false)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit">Add Trait</Button>
                                </div>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Champions</h3>
                        
                        {getChampionsForActiveSet().length > 0 ? (
                          <div className="space-y-2">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Champion</TableHead>
                                  <TableHead>Cost</TableHead>
                                  <TableHead>Traits</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getChampionsForActiveSet().map((champion) => (
                                  <TableRow key={champion.name}>
                                    <TableCell>{champion.name}</TableCell>
                                    <TableCell>
                                      <Select
                                        value={champion.cost.toString()}
                                        onValueChange={(value) => handleUpdateChampionCost(champion.name, parseInt(value))}
                                      >
                                        <SelectTrigger className="w-16">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="1">1</SelectItem>
                                          <SelectItem value="2">2</SelectItem>
                                          <SelectItem value="3">3</SelectItem>
                                          <SelectItem value="4">4</SelectItem>
                                          <SelectItem value="5">5</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" size="sm" className="h-7">
                                            {champion.traits.length > 0 
                                              ? `${champion.traits.length} traits` 
                                              : "Assign traits"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-4">
                                          <div className="space-y-2">
                                            <h4 className="font-medium mb-2">Traits for {champion.name}</h4>
                                            <div className="space-y-1">
                                              {getTraitsForActiveSet().map((trait) => (
                                                <div key={trait} className="flex items-center space-x-2">
                                                  <input
                                                    type="checkbox"
                                                    id={`${champion.name}-${trait}`}
                                                    checked={champion.traits.includes(trait)}
                                                    onChange={() => handleToggleTraitForChampion(champion.name, trait)}
                                                    className="rounded"
                                                  />
                                                  <Label
                                                    htmlFor={`${champion.name}-${trait}`}
                                                    className="text-sm cursor-pointer"
                                                  >
                                                    {trait}
                                                  </Label>
                                                </div>
                                              ))}
                                            </div>
                                            {getTraitsForActiveSet().length === 0 && (
                                              <p className="text-sm text-muted-foreground">
                                                Add traits first to assign them to champions.
                                              </p>
                                            )}
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteChampion(champion.name)}
                                      >
                                        <Trash className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-muted/30 rounded-md">
                            <p className="text-muted-foreground">No champions added yet</p>
                          </div>
                        )}
                        
                        <Dialog open={isAddingChampion} onOpenChange={setIsAddingChampion}>
                          <DialogTrigger asChild>
                            <Button className="w-full mt-4">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Champion
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Champion to {traitMappings[setId].name}</DialogTitle>
                            </DialogHeader>
                            <Form {...championForm}>
                              <form onSubmit={championForm.handleSubmit(handleAddChampion)} className="space-y-4">
                                <FormField
                                  control={championForm.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Champion Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., Ahri" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={championForm.control}
                                  name="cost"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Champion Cost</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select cost" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="1">1 Cost</SelectItem>
                                          <SelectItem value="2">2 Cost</SelectItem>
                                          <SelectItem value="3">3 Cost</SelectItem>
                                          <SelectItem value="4">4 Cost</SelectItem>
                                          <SelectItem value="5">5 Cost</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button type="button" variant="outline" onClick={() => setIsAddingChampion(false)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit">Add Champion</Button>
                                </div>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Export / Import</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Button
                          onClick={() => {
                            const dataStr = JSON.stringify(traitMappings[setId], null, 2);
                            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                            const exportFileDefaultName = `${setId}_${traitMappings[setId].name.replace(/\s+/g, '_')}.json`;
                            
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                          }}
                        >
                          Export Set Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No TFT sets found. Add your first set to get started.</p>
                <Button onClick={() => setIsAddingSet(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Set
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default SetManager;
