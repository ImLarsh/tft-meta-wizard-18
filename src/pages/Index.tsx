
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import CompTierList from '@/components/CompTierList';
import { Button } from '@/components/ui/button';
import { Sparkles, Edit, Trash2 } from 'lucide-react';
import { useComps } from '@/contexts/CompsContext';
import AppLogo from '@/components/AppLogo';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const { comps, traitMappings, removeComp } = useComps();
  const hasTraitMappings = Object.keys(traitMappings).length > 0;
  const isMobile = useIsMobile();
  
  const handleDeleteComp = (compId: string, compName: string) => {
    if (window.confirm(`Are you sure you want to delete "${compName}"?`)) {
      removeComp(compId);
      toast({
        title: "Composition Deleted",
        description: `"${compName}" has been successfully deleted.`,
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section with Logo */}
      <section className="relative py-8 md:py-16 mb-4 md:mb-8">
        <div className="container mx-auto text-center">
          <AppLogo size={isMobile ? "medium" : "large"} className="mx-auto mb-4 md:mb-6" />
          
          <p className="max-w-2xl mx-auto text-base md:text-lg text-foreground/90 mb-6 md:mb-8 px-2">
            Your magical companion for Teamfight Tactics success. Create, share, and discover 
            the best team compositions to dominate the game and climb the ranked ladder.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/create">
              <Button 
                className="gap-2 hover-lift gaming-button w-full sm:w-auto"
                size={isMobile ? "default" : "lg"}
                disabled={!hasTraitMappings}
              >
                <Sparkles className="h-5 w-5" />
                Create Comp
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <main className="flex-grow">
        {!hasTraitMappings && (
          <div className="container my-6 md:my-12 p-4 md:p-8 border border-border rounded-lg bg-card/50 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Welcome to TFT Genie!</h2>
            <p className="mb-4 md:mb-6 text-muted-foreground">
              You need to add at least one TFT set before you can create compositions.
            </p>
            <Link to="/sets">
              <Button variant="default" size={isMobile ? "default" : "lg"}>
                Add Your First Set
              </Button>
            </Link>
          </div>
        )}
        
        {hasTraitMappings && comps.length === 0 && (
          <div className="container my-6 md:my-12 p-4 md:p-8 border border-border rounded-lg bg-card/50 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">No Compositions Yet</h2>
            <p className="mb-4 md:mb-6 text-muted-foreground">
              Create your first team composition to get started.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/create">
                <Button variant="default" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
                  Create Your First Comp
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {comps.length > 0 && (
          <div className="container">
            <CompTierList comps={comps} onDelete={handleDeleteComp} />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="py-8 md:py-12 mt-6 md:mt-8 border-t border-border/30 relative z-10">
        <div className="container mx-auto text-center">
          <p className="mb-4 md:mb-6 text-foreground/90 text-sm md:text-base px-3">
            This is a fan-made project created to help the TFT community. If you find it helpful, please consider supporting the development.
          </p>
          
          <a href={`https://www.paypal.com/paypalme/jakelarsh`} target="_blank" rel="noopener noreferrer">
            <Button variant="default" className="hover-lift shine-effect mb-6 md:mb-8" size={isMobile ? "default" : "lg"}>
              Support the Developer
            </Button>
          </a>
          
          <div className="text-center max-w-3xl mx-auto px-2">
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs md:text-sm text-muted-foreground">
                <strong>Disclaimer:</strong> TFT Genie is not affiliated with, endorsed, sponsored, or specifically 
                approved by Riot Games, Inc. or League of Legends. All game assets and trademarks are property 
                of their respective owners.
              </p>
            </div>
            
            <p className="text-xs text-muted-foreground mt-6 md:mt-8">
              © {new Date().getFullYear()} TFT Genie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
