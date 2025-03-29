
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CompTierList from '@/components/CompTierList';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CompTierList />
        
        <section className="py-12 bg-muted/20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Sparkles className="h-6 w-6 text-primary mr-2" />
                  Stay Ahead of the Meta
                </h2>
                <p className="text-muted-foreground mb-6">
                  TFT Genie helps you stay competitive with the latest team compositions, item builds, and strategies. 
                  Our data is updated with each patch to ensure you're always playing the strongest comps.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="gaming-button">View All Comps</Button>
                  <Button variant="outline" className="border-primary/40 hover:bg-primary/10">
                    Latest Patch Notes
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-xl border border-border/40">
                <img 
                  src="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt9a2616eca3a3a659/62069156f731423017fa0a60/021422_TFTNews_Article_Banner.jpg" 
                  alt="TFT Gameplay" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xl font-bold text-primary">TFT</span>
              <span className="text-xl font-bold">Genie</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              TFT Genie is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
