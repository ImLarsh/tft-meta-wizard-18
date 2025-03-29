
import React from 'react';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">TFT</span>
          <span className="text-xl font-bold">Meta Wizard</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Comps
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Champions
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Items
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Tier List
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="default" className="hidden md:inline-flex">
            Latest Patch
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
