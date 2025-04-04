
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, List, Sparkles, Settings, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header className={`bg-card/80 backdrop-blur-md sticky top-0 z-10 border-b transition-all duration-300 ${scrolled ? 'shadow-md border-primary/20' : 'shadow-sm border-primary/10'}`}>
      <div className="container py-2 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className={`flex items-center space-x-2 transition-transform duration-300 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              <div className="flex items-center group">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse-subtle group-hover:animate-spin-slow transition-all duration-300" />
                <Link to="/">
                  <span className="text-xl md:text-2xl font-bold ml-2 gradient-text group-hover:opacity-80 transition-opacity duration-300">TFT</span>
                  <span className="text-xl md:text-2xl font-bold glow-text group-hover:text-primary transition-colors duration-300">Genie</span>
                </Link>
              </div>
            </Link>
            
            {!isMobile && (
              <Link to="/" className={`ml-2 p-2 rounded-full hover:bg-primary/10 transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`} aria-label="Home">
                <Home className={`h-5 w-5 text-muted-foreground hover:text-primary transition-colors 
                    ${location.pathname === '/' ? 'text-primary' : ''}`} />
              </Link>
            )}
          </div>
          
          <div className="flex items-center">
            {/* Theme Toggle Button */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className={`mr-2 hover:bg-primary/10 hover-glow transition-all duration-300 ease-in-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{
              transitionDelay: '100ms'
            }} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun className="h-5 w-5 text-primary animate-pulse-subtle" /> : <Moon className="h-5 w-5 text-primary animate-pulse-subtle" />}
            </Button>
            
            {/* Mobile menu button */}
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="h-10 w-10 p-2 ml-1">
                {mobileMenuOpen ? 
                  <X className="h-5 w-5 text-primary" /> : 
                  <Menu className="h-5 w-5 text-primary" />
                }
              </Button>
            )}
            
            {/* Desktop Nav Items */}
            {!isMobile && (
              <nav className="flex items-center space-x-2">
                <Link to="/sets">
                  <Button variant="ghost" size="sm" className={`hover:bg-primary/10 hover-glow transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${location.pathname === '/sets' ? 'bg-primary/10' : ''}`} style={{
                    transitionDelay: '200ms'
                  }}>
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="relative">
                      Manage Sets
                      {location.pathname === '/sets' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-shimmer"></span>}
                    </span>
                  </Button>
                </Link>
                
                <Link to="/">
                  <Button variant="ghost" size="sm" className={`hover:bg-primary/10 hover-glow transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${location.pathname === '/' ? 'bg-primary/10' : ''}`} style={{
                    transitionDelay: '300ms'
                  }}>
                    <List className="h-4 w-4 mr-2" />
                    <span className="relative">
                      Comps
                      {location.pathname === '/' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-shimmer"></span>}
                    </span>
                  </Button>
                </Link>
              </nav>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <nav className="pt-4 pb-2 border-t border-border/20 mt-2 flex flex-col space-y-2 animate-fade-in">
            <Link to="/">
              <Button variant="ghost" size="sm" className={`w-full justify-start hover:bg-primary/10 ${location.pathname === '/' ? 'bg-primary/10' : ''}`}>
                <Home className="h-4 w-4 mr-2" />
                <span>Home</span>
              </Button>
            </Link>
            <Link to="/sets">
              <Button variant="ghost" size="sm" className={`w-full justify-start hover:bg-primary/10 ${location.pathname === '/sets' ? 'bg-primary/10' : ''}`}>
                <Settings className="h-4 w-4 mr-2" />
                <span>Manage Sets</span>
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className={`w-full justify-start hover:bg-primary/10 ${location.pathname === '/' ? 'bg-primary/10' : ''}`}>
                <List className="h-4 w-4 mr-2" />
                <span>Comps</span>
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
export default Header;
