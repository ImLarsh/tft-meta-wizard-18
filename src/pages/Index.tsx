
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import CompTierList from '@/components/CompTierList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useComps } from '@/contexts/CompsContext';

const Index: React.FC = () => {
  const { comps, traitMappings } = useComps();
  const hasTraitMappings = Object.keys(traitMappings).length > 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mt-8 mb-4 flex justify-end">
          <Link to="/create">
            <Button 
              className="gap-2 hover-lift hover:translate-y-0 hover:shadow-primary/20"
              disabled={!hasTraitMappings}
            >
              <Plus className="h-4 w-4" />
              Create New Comp
            </Button>
          </Link>
        </div>
        
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
    </div>
  );
};

export default Index;
