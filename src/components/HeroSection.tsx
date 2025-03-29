
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 tft-gradient">
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.contentstack.io/v3/assets/blt76b5e73bfd1451ea/blt4776087682118d5e/60c34a5750e6a9762e8b0ea8/TFT_Web_Set5_Launch_Hero_1920x1080_01.jpg')] bg-cover bg-center"></div>
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
            TFT Meta Wizard
          </h1>
          <p className="text-lg md:text-xl mb-8 text-foreground/90">
            Discover the best team compositions for Teamfight Tactics and climb the ranks with our up-to-date meta analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base">
              View Top Comps
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Latest Updates
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
