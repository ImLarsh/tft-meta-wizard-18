import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import CompForm from '@/components/CompForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Save } from 'lucide-react';
import { TFTComp } from '@/data/comps';
import { toast } from '@/components/ui/use-toast';
import { useComps } from '@/contexts/CompsContext';

const CompEditExisting: React.FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams<{ compId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { comps, updateComp } = useComps();
  const [currentComp, setCurrentComp] = useState<TFTComp | null>(null);

  // Find the comp to edit
  useEffect(() => {
    if (compId) {
      const comp = comps.find(c => c.id === compId);
      if (comp) {
        setCurrentComp(comp);
      } else {
        toast({
          title: "Error",
          description: "Composition not found",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [compId, comps, navigate]);

  const handleSubmit = (compData: TFTComp) => {
    setIsSubmitting(true);
    
    try {
      // Make sure we keep the original ID
      const updatedComp = { ...compData, id: compId! };
      
      // Save the updated comp to our context/localStorage
      updateComp(updatedComp);
      
      // Log the data that would be saved
      console.log('Updating comp data:', updatedComp);
      
      // Show success message
      toast({
        title: "Success",
        description: "Your composition has been updated!",
      });
      
      // Navigate back to the main page
      navigate('/');
    } catch (error) {
      console.error('Error saving comp:', error);
      toast({
        title: "Error",
        description: "There was a problem updating your composition.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!currentComp) {
    return (
      <div className="min-h-screen flex flex-col bg-background/95 bg-[url('/hexagon-pattern.png')] bg-repeat">
        <Header />
        <main className="flex-1 container py-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-2xl">Loading composition...</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return Home
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
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
            Edit Composition: {currentComp.name}
          </h1>
        </div>
        
        <div className="bg-card border border-primary/20 rounded-lg shadow-md p-6 backdrop-blur-sm gaming-card">
          <CompForm initialData={currentComp} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
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

export default CompEditExisting;
