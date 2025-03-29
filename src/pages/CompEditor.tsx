
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CompForm from '@/components/CompForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TFTComp } from '@/data/comps';
import { toast } from '@/components/ui/use-toast';

const CompEditor: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (compData: TFTComp) => {
    setIsSubmitting(true);
    
    // In a real application, this would save to a database
    // For now, we'll simulate a successful save with a timeout
    setTimeout(() => {
      // Log the data that would be saved
      console.log('Saving comp data:', compData);
      
      // Show success message
      toast({
        title: "Success",
        description: "Your composition has been saved!",
      });
      
      setIsSubmitting(false);
      
      // Navigate back to the main page
      navigate('/');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create New Composition</h1>
        </div>
        
        <div className="bg-card border border-border/40 rounded-lg shadow-sm p-6">
          <CompForm onSubmit={handleSubmit} />
        </div>
      </main>
      
      <footer className="bg-card py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">TFT</span>
              <span className="text-xl font-bold">Meta Wizard</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              TFT Meta Wizard is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompEditor;
