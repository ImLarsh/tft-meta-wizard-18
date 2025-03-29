
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, List, Sparkles, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-card/90 backdrop-blur sticky top-0 z-10 border-b border-primary/10">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-primary animate-pulse-subtle" />
              <span className="text-2xl font-bold ml-2 text-primary">TFT</span>
              <span className="text-2xl font-bold glow-text">Genie</span>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-2">
            <Link to="/sets">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Settings className="h-4 w-4 mr-2" />
                Manage Sets
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <List className="h-4 w-4 mr-2" />
                Comps
              </Button>
            </Link>
            <Link to="/create">
              <Button size="sm" className="gaming-button">
                <Plus className="h-4 w-4 mr-2" />
                Create Comp
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
