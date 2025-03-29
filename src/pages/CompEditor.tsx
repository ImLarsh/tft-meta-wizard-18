
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { TFTComp } from '@/data/comps';
import SimpleCompForm from '@/components/SimpleCompForm';
import { useComps } from '@/contexts/CompsContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const CompEditor = () => {
  const { addComp } = useComps();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComp = (comp: TFTComp) => {
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID if not provided
      if (!comp.id || comp.id.trim() === '') {
        comp.id = nanoid(8);
      }
      
      // Add comp to context
      addComp(comp);
      
      toast({
        title: "Comp Created",
        description: `"${comp.name}" has been created successfully!`,
      });
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Error creating comp:', error);
      toast({
        title: "Error",
        description: "Failed to create composition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Create New Composition</h1>
          </div>
        </div>
        
        <Alert className="mb-6">
          <AlertTitle>Create a new TFT Comp</AlertTitle>
          <AlertDescription>
            Fill out the form to create a new team composition for Teamfight Tactics.
          </AlertDescription>
        </Alert>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <SimpleCompForm 
            onSubmit={handleAddComp}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default CompEditor;
