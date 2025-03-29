
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
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary mr-2" />
                Stay Ahead of the Meta
              </h2>
              <p className="text-muted-foreground mb-6">
                TFT Genie helps you stay competitive with the latest team compositions, item builds, and strategies. 
                Our data is updated with each patch to ensure you're always playing the strongest comps.
              </p>
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
