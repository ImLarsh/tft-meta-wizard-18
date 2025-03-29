
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
  color: string;
  glow: boolean;
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
      
      const count = Math.floor(window.innerWidth / 20); // Increase density
      
      const colors = theme === 'dark' 
        ? ['rgba(155, 135, 245, 0.3)', 'rgba(138, 43, 226, 0.2)', 'rgba(186, 85, 211, 0.25)']
        : ['rgba(155, 135, 245, 0.4)', 'rgba(138, 43, 226, 0.3)', 'rgba(186, 85, 211, 0.35)'];
      
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties for each particle
        const size = Math.random() * 6 + 2; // Size between 2-8px
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1; // Start above viewport
        const speedY = Math.random() * 0.3 + 0.1; // Increase fall speed variety
        const speedX = (Math.random() - 0.5) * 0.2; // More horizontal drift
        const animationDuration = Math.random() * 40 + 15; // Between 15-55s
        const color = colors[Math.floor(Math.random() * colors.length)];
        const glow = Math.random() > 0.7; // 30% of particles will glow
        
        // Apply custom styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = (Math.random() * 0.6 + 0.4).toString(); // More opaque
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.backgroundColor = color;
        
        if (glow) {
          particle.style.boxShadow = `0 0 ${size * 1.5}px ${color}`;
          particle.classList.add('particle-glow');
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
          animationDuration,
          color,
          glow
        });
      }
      
      // Add some larger, special particles that move slower
      for (let i = 0; i < Math.floor(count / 10); i++) {
        const particle = document.createElement('div');
        particle.className = 'particle special-particle';
        
        const size = Math.random() * 10 + 8; // Larger particles
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1;
        const speedY = Math.random() * 0.1 + 0.05; // Slower
        const speedX = (Math.random() - 0.5) * 0.05;
        const animationDuration = Math.random() * 60 + 30; // Longer duration
        const color = theme === 'dark' 
          ? 'rgba(155, 135, 245, 0.15)'
          : 'rgba(155, 135, 245, 0.25)';
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = (Math.random() * 0.5 + 0.5).toString();
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '30%';
        
        containerRef.current.appendChild(particle);
        particles.current.push({
          x,
          y,
          size,
          speedY,
          speedX,
          element: particle,
          animationDuration,
          color,
          glow: true
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
