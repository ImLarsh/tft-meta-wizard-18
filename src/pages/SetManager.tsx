
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useComps } from '@/contexts/CompsContext';
import { toast } from '@/components/ui/use-toast';
import { saveTraitMappingsToSupabase } from '@/utils/supabaseUtils';
import PageLayout from '@/components/PageLayout';

const SetManager: React.FC = () => {
  const { traitMappings } = useComps();
  const [sets, setSets] = useState(traitMappings || {});
  const [newSetName, setNewSetName] = useState('');
  
  // Update local state when traitMappings change
  useEffect(() => {
    if (Object.keys(traitMappings).length > 0) {
      setSets(traitMappings);
    }
  }, [traitMappings]);
  
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
    try {
      // Save to Supabase
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
          
          <Button onClick={handleSaveSets} className="gap-2">
            <Save className="h-4 w-4" />
            Save All Sets
          </Button>
        </div>
        
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
                    placeholder="e.g. Set 10"
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
          
          {Object.keys(sets).length === 0 && (
            <div className="text-center py-8 border border-dashed border-border rounded-md">
              <p className="text-lg text-muted-foreground">No sets added yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first set to get started
              </p>
            </div>
          )}
          
          {Object.keys(sets).map((setKey) => (
            <Card key={setKey}>
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
              
              <CardContent className="mt-2">
                <Link to={`/sets/${setKey}`}>
                  <Button className="w-full">Edit Set Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default SetManager;
