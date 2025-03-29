
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CompTierList from '@/components/CompTierList';
import { Sparkles, TrendingUp, Shield, Target, Award } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Simple animation trigger for when elements are in view
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Trigger initial visibility after page load
    setTimeout(() => setIsVisible(true), 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <CompTierList />
        </div>
        
        <section className="py-16 bg-muted/20 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/10 animate-pulse-subtle"></div>
            <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-tft-gold/10 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[30%] right-[20%] w-40 h-40 rounded-full bg-tft-cyan/10 animate-pulse-subtle" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center animate-fade-in">
                <Sparkles className="h-6 w-6 text-primary mr-2 animate-pulse-subtle" />
                <span className="gradient-text">Stay Ahead of the Meta</span>
              </h2>
              <p className="text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                TFT Genie helps you stay competitive with the latest team compositions, item builds, and strategies. 
                Our data is updated with each patch to ensure you're always playing the strongest comps.
              </p>
            </div>
            
            {/* Feature boxes with staggered animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[
                {
                  icon: <TrendingUp className="h-10 w-10 text-primary" />,
                  title: "Track the Meta",
                  description: "Stay updated with the most successful team compositions."
                },
                {
                  icon: <Shield className="h-10 w-10 text-tft-cyan" />,
                  title: "Optimal Positioning",
                  description: "Learn the best champion placements to maximize your defense."
                },
                {
                  icon: <Target className="h-10 w-10 text-tft-red" />,
                  title: "Item Optimization",
                  description: "Discover which items work best with each champion."
                },
                {
                  icon: <Award className="h-10 w-10 text-tft-gold" />,
                  title: "Climb the Ranks",
                  description: "Use pro strategies to reach your ranked goals."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="staggered-item bg-card hover:bg-card/80 border border-border/50 rounded-lg p-6 flex flex-col items-center text-center hover-lift hover-glow glass-effect"
                >
                  <div className="mb-4 p-3 rounded-full bg-background/50 animate-pulse-subtle">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 animate-pulse-subtle">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xl font-bold text-primary">TFT</span>
              <span className="text-xl font-bold glow-text">Genie</span>
            </div>
            
            <div className="text-sm text-muted-foreground max-w-2xl text-center md:text-right">
              TFT Genie is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
