
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import TFTBoardBuilder from '@/components/TFTBoardBuilder';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, HelpCircle, Save } from 'lucide-react';
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

  // Generate sample champions for the available pool
  useEffect(() => {
    const tftVersion = form.watch("tftVersion");
    if (!tftVersion || !traitMappings[tftVersion]) return;
    
    const mappings = traitMappings[tftVersion];
    const champions: Champion[] = [];
    
    if (mappings && mappings.championTraits) {
      // Convert to array of champions with costs
      Object.keys(mappings.championTraits).forEach(championName => {
        // Assign a cost between 1-5 based on a simple pattern
        const cost = (championName.length % 5) + 1 as 1 | 2 | 3 | 4 | 5;
        champions.push({
          name: championName,
          cost: cost,
          isCarry: false,
          position: null,
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
          {/* Board Builder - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border border-primary/20 shadow-md backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Champion Board</CardTitle>
                <CardDescription>Drag and drop champions to create your team composition</CardDescription>
              </CardHeader>
              <CardContent>
                <TFTBoardBuilder 
                  availableChampions={availableChampions} 
                  onSave={handleSaveBoard}
                  initialChampions={boardChampions}
                />
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
