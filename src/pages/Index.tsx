
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CompTierList from '@/components/CompTierList';
import { Sparkles } from 'lucide-react';

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
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-xl border border-border/40">
                <img 
                  src="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt493aca2f3aecea48/66077f26e4bc39c8f0c487b2/TFT_Set14_CyberCity_Header.jpg" 
                  alt="TFT Cyber City Set 14" 
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
