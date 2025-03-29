
import React from 'react';
import { Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 tft-gradient">
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.contentstack.io/v3/assets/blt76b5e73bfd1451ea/blt4776087682118d5e/60c34a5750e6a9762e8b0ea8/TFT_Web_Set5_Launch_Hero_1920x1080_01.jpg')] bg-cover bg-center"></div>
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
              TFT <span className="text-foreground glow-text">Genie</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl mb-8 text-foreground/90">
            Your magical companion for Teamfight Tactics success. Discover the best team compositions and climb the ranks with our mystical meta insights.
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
