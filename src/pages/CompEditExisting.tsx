
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TFTComp } from '@/data/comps';
import SimpleCompForm from '@/components/SimpleCompForm';
import { useComps } from '@/contexts/CompsContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const CompEditExisting = () => {
  const { compId } = useParams<{ compId: string }>();
  const { comps, updateComp } = useComps();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comp, setComp] = useState<TFTComp | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (compId && comps) {
      const foundComp = comps.find((c) => c.id === compId);
      if (foundComp) {
        setComp(foundComp);
      } else {
        setNotFound(true);
      }
    }
  }, [compId, comps]);

  const handleUpdateComp = (updatedComp: TFTComp) => {
    setIsSubmitting(true);
    
    try {
      updatedComp.id = compId || updatedComp.id;
      
      updateComp(updatedComp)
        .then(() => {
          toast({
            title: "Comp Updated",
            description: `"${updatedComp.name}" has been updated successfully!`,
          });
          navigate('/');
        })
        .catch((error) => {
          console.error('Error updating comp:', error);
          toast({
            title: "Error",
            description: "Failed to update composition. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error('Error updating comp:', error);
      toast({
        title: "Error",
        description: "Failed to update composition. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Composition Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The composition you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Homepage
          </Button>
        </div>
      </PageLayout>
    );
  }

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
            <h1 className="text-2xl font-bold">Edit Composition</h1>
          </div>
        </div>
        
        <Alert className="mb-6">
          <AlertTitle>Edit TFT Comp</AlertTitle>
          <AlertDescription>
            Make changes to your team composition and save to update it.
          </AlertDescription>
        </Alert>
        
        {comp && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <SimpleCompForm 
              initialData={comp}
              onSubmit={handleUpdateComp}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CompEditExisting;
