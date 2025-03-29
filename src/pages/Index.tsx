
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import CompTierList from '@/components/CompTierList';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useComps } from '@/contexts/CompsContext';
import AppLogo from '@/components/AppLogo';

const Index: React.FC = () => {
  const { comps, traitMappings } = useComps();
  const hasTraitMappings = Object.keys(traitMappings).length > 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section with Logo */}
      <section className="relative py-16 mb-8">
        <div className="container mx-auto text-center">
          <AppLogo size="large" className="mx-auto mb-6" />
          
          <p className="max-w-2xl mx-auto text-lg text-foreground/90 mb-8">
            Your magical companion for Teamfight Tactics success. Create, share, and discover 
            the best team compositions to dominate the game and climb the ranked ladder.
          </p>
          
          <div className="flex justify-center">
            <Link to="/create">
              <Button 
                className="gap-2 hover-lift gaming-button"
                size="lg"
                disabled={!hasTraitMappings}
              >
                <Sparkles className="h-5 w-5" />
                Create New Comp
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <main className="flex-grow">
        {!hasTraitMappings && (
          <div className="container my-12 p-8 border border-border rounded-lg bg-card/50 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to TFT Genie!</h2>
            <p className="mb-6 text-muted-foreground">
              You need to add at least one TFT set before you can create compositions.
            </p>
            <Link to="/sets">
              <Button variant="default" size="lg">
                Add Your First Set
              </Button>
            </Link>
          </div>
        )}
        
        {hasTraitMappings && comps.length === 0 && (
          <div className="container my-12 p-8 border border-border rounded-lg bg-card/50 text-center">
            <h2 className="text-2xl font-bold mb-4">No Compositions Yet</h2>
            <p className="mb-6 text-muted-foreground">
              Create your first team composition to get started.
            </p>
            <Link to="/create">
              <Button variant="default" size="lg">
                Create Your First Comp
              </Button>
            </Link>
          </div>
        )}
        
        {comps.length > 0 && <CompTierList />}
      </main>
      
      {/* Footer */}
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

export default Index;
