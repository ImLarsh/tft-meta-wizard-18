
import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    
    // Simple animation on page load
    const letters = title.textContent?.split('') || [];
    title.textContent = '';
    
    letters.forEach((letter, i) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
      span.style.transitionDelay = `${i * 0.05}s`;
      title.appendChild(span);
      
      // Trigger the animation after a small delay
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 100);
    });
  }, []);
  
  return (
    <section className="relative overflow-hidden py-16 md:py-24 tft-gradient">
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.contentstack.io/v3/assets/blt76b5e73bfd1451ea/blt4776087682118d5e/60c34a5750e6a9762e8b0ea8/TFT_Web_Set5_Launch_Hero_1920x1080_01.jpg')] bg-cover bg-center animate-pulse-subtle"></div>
      
      {/* Animated decorative elements */}
      <div className="absolute top-20 left-[10%] w-10 h-10 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-20 right-[10%] w-6 h-6 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '1.2s' }}></div>
      <div className="absolute top-1/3 right-[15%] w-8 h-8 rounded-full bg-tft-gold/20 animate-float" style={{ animationDelay: '0.8s' }}></div>
      <div className="absolute bottom-1/3 left-[20%] w-12 h-12 rounded-full bg-tft-cyan/10 animate-bounce-subtle" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4 animate-fade-in">
            <Sparkles className="h-8 w-8 text-primary mr-2 animate-pulse-subtle" />
            <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold">
              TFT <span className="text-foreground glow-text">Genie</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl mb-8 text-foreground/90 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Your magical companion for Teamfight Tactics success. Discover the best team compositions and climb the ranks with our mystical meta insights.
          </p>
          
          {/* Animated button */}
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <button className="gaming-button py-3 px-6 rounded-lg text-lg font-medium animate-glow">
              <Sparkles className="h-5 w-5 inline-block mr-2" />
              Explore Compositions
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      
      {/* Animated floating orbs */}
      <div className="absolute bottom-10 left-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-tft-purple/10 to-transparent blur-xl animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
      <div className="absolute top-20 right-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-tft-gold/10 to-transparent blur-xl animate-float" style={{ animationDelay: '0.2s', animationDuration: '6s' }}></div>
    </section>
  );
};

export default HeroSection;
