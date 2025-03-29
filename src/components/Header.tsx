
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">TFT</span>
          <span className="text-xl font-bold">Meta Wizard</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/editor" className="text-sm font-medium hover:text-primary transition-colors">
            Editor
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link to="/editor">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
              <PenSquare className="h-4 w-4" />
              <span>Create Comp</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
