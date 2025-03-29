
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  element: HTMLDivElement;
  animationDuration: number;
}

const ParticlesBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Create particles
    const createParticles = () => {
      if (!containerRef.current) return;
      
      // Clear existing particles
      containerRef.current.innerHTML = '';
      particles.current = [];
      
      const count = Math.floor(window.innerWidth / 25); // Adjust density based on screen width
      
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties for each particle
        const size = Math.random() * 4 + 2; // Size between 2-6px
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1; // Start above viewport
        const speedY = Math.random() * 0.2 + 0.1; // Fall speed
        const speedX = (Math.random() - 0.5) * 0.1; // Slight horizontal drift
        const animationDuration = Math.random() * 30 + 20; // Between 20-50s
        
        // Apply custom styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = (Math.random() * 0.5 + 0.3).toString(); // Semi-transparent
        particle.style.animationDuration = `${animationDuration}s`;
        
        // Apply different styles for dark/light mode
        if (theme === 'dark') {
          particle.style.backgroundColor = `rgba(155, 135, 245, ${Math.random() * 0.2 + 0.1})`;
        } else {
          particle.style.backgroundColor = `rgba(155, 135, 245, ${Math.random() * 0.3 + 0.2})`;
        }
        
        // Add to container and track in ref
        containerRef.current.appendChild(particle);
        particles.current.push({
          x,
          y,
          size,
          speedY,
          speedX,
          element: particle,
          animationDuration
        });
      }
    };
    
    // Handle resize to adjust particles count
    const handleResize = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      createParticles();
    };
    
    // Initial creation
    createParticles();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);
  
  return <div ref={containerRef} className="particles-container" />;
};

export default ParticlesBackground;
