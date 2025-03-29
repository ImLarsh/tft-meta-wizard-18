
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
  shape?: string;
  rotation?: number;
  rotationSpeed?: number;
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
      
      const count = Math.min(40, Math.floor(window.innerWidth / 40)); // Fewer particles
      
      const colors = theme === 'dark' 
        ? [
            'rgba(155, 135, 245, 0.2)', 
            'rgba(138, 43, 226, 0.15)', 
            'rgba(186, 85, 211, 0.2)',
            'rgba(123, 104, 238, 0.2)', 
            'rgba(106, 90, 205, 0.15)',
            'rgba(147, 112, 219, 0.15)'
          ]
        : [
            'rgba(155, 135, 245, 0.15)', 
            'rgba(138, 43, 226, 0.1)', 
            'rgba(186, 85, 211, 0.15)',
            'rgba(123, 104, 238, 0.15)', 
            'rgba(106, 90, 205, 0.1)',
            'rgba(147, 112, 219, 0.1)'
          ];
      
      const shapes = ['circle', 'square'];
      
      // Create regular particles
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties for each particle
        const size = Math.random() * 6 + 2; // Size between 2-8px
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1; // Start above viewport
        const speedY = Math.random() * 0.2 + 0.1; // Reduced fall speed
        const speedX = (Math.random() - 0.5) * 0.1; // Less horizontal drift
        const animationDuration = Math.random() * 40 + 15; // Between 15-55s
        const color = colors[Math.floor(Math.random() * colors.length)];
        const glow = Math.random() > 0.8; // 20% of particles will glow
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const rotation = Math.random() * 360;
        const rotationSpeed = (Math.random() - 0.5) * 1;
        
        // Apply custom styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = (Math.random() * 0.4 + 0.1).toString(); // More transparent
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.backgroundColor = color;
        particle.style.transform = `rotate(${rotation}deg)`;
        
        // Apply shape
        if (shape === 'circle') {
          particle.style.borderRadius = '50%';
        } else if (shape === 'square') {
          particle.style.borderRadius = '0';
        }
        
        if (glow) {
          particle.style.boxShadow = `0 0 ${size}px ${color}`;
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
          glow,
          shape,
          rotation,
          rotationSpeed
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
  
  return (
    <>
      <div 
        ref={containerRef} 
        className="particles-container fixed inset-0 pointer-events-none z-0" 
      />
      <style jsx>{`
        .particles-container {
          overflow: hidden;
        }
        .particle {
          position: absolute;
          will-change: transform;
          animation: float-down linear infinite;
        }
        @keyframes float-down {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity, 0.2);
          }
          90% {
            opacity: var(--opacity, 0.2);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ParticlesBackground;
