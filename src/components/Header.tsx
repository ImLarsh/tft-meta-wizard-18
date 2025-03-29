
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, List, Sparkles, Settings, Moon, Sun, SwitchCamera } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { useImageToggle } from '@/contexts/ImageToggleContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { useTftImages, toggleImageSource } = useImageToggle();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Trigger mount animation
    setTimeout(() => setMounted(true), 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-card/80 backdrop-blur-md sticky top-0 z-10 border-b transition-all duration-300 ${scrolled ? 'shadow-md border-primary/20' : 'shadow-sm border-primary/10'}`}>
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className={`flex items-center space-x-2 transition-transform duration-300 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              <div className="flex items-center group">
                <Sparkles className="h-6 w-6 text-primary animate-pulse-subtle group-hover:animate-spin-slow transition-all duration-300" />
                <Link to="/">
                  <span className="text-2xl font-bold ml-2 gradient-text group-hover:opacity-80 transition-opacity duration-300">TFT</span>
                  <span className="text-2xl font-bold glow-text group-hover:text-primary transition-colors duration-300">Genie</span>
                </Link>
              </div>
            </Link>
            
            <Link 
              to="/" 
              className={`ml-2 p-2 rounded-full hover:bg-primary/10 transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
              aria-label="Home"
            >
              <Home 
                className={`h-5 w-5 text-muted-foreground hover:text-primary transition-colors 
                  ${location.pathname === '/' ? 'text-primary' : ''}`} 
              />
            </Link>
          </div>
          
          <nav className="flex items-center space-x-2">
            {/* Image Source Toggle */}
            <div className={`flex items-center space-x-2 mr-2 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '50ms' }}>
              <span className="text-sm text-muted-foreground hidden sm:inline">Image Source:</span>
              <div className="flex items-center">
                <SwitchCamera className="h-4 w-4 mr-2 text-muted-foreground" />
                <Switch
                  checked={useTftImages}
                  onCheckedChange={toggleImageSource}
                  aria-label="Toggle between TFT and LoL images"
                />
                <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
                  {useTftImages ? 'TFT' : 'LoL'}
                </span>
              </div>
            </div>
            
            {/* Theme Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme} 
              className={`mr-2 hover:bg-primary/10 hover-glow transition-all duration-300 ease-in-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: '100ms' }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-primary animate-pulse-subtle" />
              ) : (
                <Moon className="h-5 w-5 text-primary animate-pulse-subtle" />
              )}
            </Button>
            
            {/* Nav Items with staggered animation */}
            <Link to="/sets">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-primary/10 hover-glow transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${location.pathname === '/sets' ? 'bg-primary/10' : ''}`}
                style={{ transitionDelay: '200ms' }}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span className="relative">
                  Manage Sets
                  {location.pathname === '/sets' && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-shimmer"></span>
                  )}
                </span>
              </Button>
            </Link>
            
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-primary/10 hover-glow transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${location.pathname === '/' ? 'bg-primary/10' : ''}`}
                style={{ transitionDelay: '300ms' }}
              >
                <List className="h-4 w-4 mr-2" />
                <span className="relative">
                  Comps
                  {location.pathname === '/' && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-shimmer"></span>
                  )}
                </span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
