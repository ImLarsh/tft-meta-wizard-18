
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CompForm from '@/components/CompForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { TFTComp } from '@/data/comps';
import { toast } from '@/components/ui/use-toast';
import { useComps } from '@/contexts/CompsContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthForm from '@/components/AuthForm';

const CompEditor: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComp, traitMappings } = useComps();
  const [user, setUser] = useState<any>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // Check for authentication
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Redirect to home if not logged in after a short delay
  useEffect(() => {
    if (user === null) {
      const timer = setTimeout(() => {
        setLoginOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleSubmit = async (compData: TFTComp) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Validate that the TFT version exists in trait mappings
      if (!traitMappings[compData.tftVersion]) {
        throw new Error(`Invalid TFT version: ${compData.tftVersion}`);
      }
      
      // Save the comp to our context (which will save to Supabase)
      await addComp(compData);
      
      // Log the data that would be saved
      console.log('Saving comp data:', compData);
      
      // Show success message
      toast({
        title: "Success",
        description: "Your composition has been saved and is now public!",
      });
      
      // Navigate back to the main page
      navigate('/');
    } catch (error) {
      console.error('Error saving comp:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem saving your composition.",
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
            className="hover:bg-primary/10 gaming-button"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Sparkles className="h-6 w-6 text-primary mr-2 animate-pulse-subtle" />
            Create New Composition
          </h1>
        </div>
        
        {user ? (
          <div className="bg-card border border-primary/20 rounded-lg shadow-md p-6 backdrop-blur-sm gaming-card">
            <CompForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        ) : (
          <div className="bg-card border border-primary/20 rounded-lg shadow-md p-6 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-6">You need to be logged in to create compositions.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setLoginOpen(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button onClick={() => setSignupOpen(true)} variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </div>
          </div>
        )}
      </main>
      
      {/* Auth Dialogs */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
            <DialogDescription>
              Sign in to create compositions
            </DialogDescription>
          </DialogHeader>
          <AuthForm mode="login" onSuccess={() => setLoginOpen(false)} />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => {
                setLoginOpen(false);
                setSignupOpen(true);
              }}
            >
              Create one
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new account</DialogTitle>
            <DialogDescription>
              Join TFT Genie to create compositions
            </DialogDescription>
          </DialogHeader>
          <AuthForm mode="signup" onSuccess={() => setSignupOpen(false)} />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => {
                setSignupOpen(false);
                setLoginOpen(true);
              }}
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
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

export default CompEditor;
