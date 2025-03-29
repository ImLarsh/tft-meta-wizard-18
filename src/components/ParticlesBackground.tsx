
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
      
      const count = Math.floor(window.innerWidth / 20); // Slightly fewer particles for better performance
      
      const colors = theme === 'dark' 
        ? [
            'rgba(155, 135, 245, 0.4)', 
            'rgba(138, 43, 226, 0.3)', 
            'rgba(186, 85, 211, 0.35)',
            'rgba(123, 104, 238, 0.4)', 
            'rgba(106, 90, 205, 0.35)',
            'rgba(147, 112, 219, 0.3)'
          ]
        : [
            'rgba(155, 135, 245, 0.5)', 
            'rgba(138, 43, 226, 0.4)', 
            'rgba(186, 85, 211, 0.45)',
            'rgba(123, 104, 238, 0.5)', 
            'rgba(106, 90, 205, 0.45)',
            'rgba(147, 112, 219, 0.4)'
          ];
      
      const shapes = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
      
      // Create CSS for animation
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        .particle {
          position: absolute;
          pointer-events: none;
        }
        
        .particle-glow {
          filter: blur(1px);
        }
        
        .special-particle {
          animation-name: special-fall, float;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
        }
        
        .geometric-line {
          animation-name: geometric-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        
        .light-ray {
          position: absolute;
          transform-origin: top center;
          animation: ray-animation 60s linear infinite;
          pointer-events: none;
        }
        
        @keyframes special-fall {
          from { transform: translateY(0); }
          to { transform: translateY(${window.innerHeight * 2}px); }
        }
        
        @keyframes geometric-fall {
          from { transform: translateY(0) rotate(var(--rotation)); }
          to { transform: translateY(${window.innerHeight * 2}px) rotate(var(--rotation)); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        
        @keyframes ray-animation {
          0% { opacity: 0; transform: translateY(-100%) rotate(var(--rotation)); }
          10% { opacity: var(--base-opacity); }
          90% { opacity: var(--base-opacity); }
          100% { opacity: 0; transform: translateY(100vh) rotate(var(--rotation)); }
        }
      `;
      document.head.appendChild(styleElement);
      
      // Create regular particles
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties for each particle
        const size = Math.random() * 8 + 2; // Size between 2-10px
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1; // Start above viewport
        const speedY = Math.random() * 0.4 + 0.1; // Increase fall speed variety
        const speedX = (Math.random() - 0.5) * 0.3; // More horizontal drift
        const animationDuration = Math.random() * 40 + 15; // Between 15-55s
        const color = colors[Math.floor(Math.random() * colors.length)];
        const glow = Math.random() > 0.6; // 40% of particles will glow
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const rotation = Math.random() * 360;
        const rotationSpeed = (Math.random() - 0.5) * 2;
        
        // Apply custom styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = (Math.random() * 0.7 + 0.3).toString(); // More opaque
        particle.style.backgroundColor = color;
        particle.style.transform = `rotate(${rotation}deg)`;
        particle.style.transition = 'transform 0.2s linear';
        particle.style.animation = `special-fall ${animationDuration}s linear infinite`;
        
        // Apply shape
        if (shape === 'circle') {
          particle.style.borderRadius = '50%';
        } else if (shape === 'square') {
          particle.style.borderRadius = '0';
        } else if (shape === 'triangle') {
          particle.style.width = '0';
          particle.style.height = '0';
          particle.style.backgroundColor = 'transparent';
          particle.style.borderLeft = `${size/2}px solid transparent`;
          particle.style.borderRight = `${size/2}px solid transparent`;
          particle.style.borderBottom = `${size}px solid ${color}`;
        } else if (shape === 'diamond') {
          particle.style.transform = `rotate(45deg) scale(${size/10})`;
          particle.style.width = '10px';
          particle.style.height = '10px';
          particle.style.borderRadius = '2px';
        } else if (shape === 'hexagon') {
          particle.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        }
        
        if (glow) {
          particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
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
      
      // Add some abstract geometric lines/paths
      for (let i = 0; i < Math.floor(count / 20); i++) {
        const line = document.createElement('div');
        line.className = 'particle geometric-line';
        
        const width = Math.random() * 100 + 50; // Line width between 50-150px
        const height = Math.random() * 1 + 1; // Line height between 1-2px
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1;
        const speedY = Math.random() * 0.05 + 0.02; // Very slow
        const speedX = (Math.random() - 0.5) * 0.03;
        const animationDuration = Math.random() * 80 + 50; // Very long duration
        const color = theme === 'dark' 
          ? 'rgba(155, 135, 245, 0.15)'
          : 'rgba(155, 135, 245, 0.25)';
        const rotation = Math.random() * 360;
        
        line.style.width = `${width}px`;
        line.style.height = `${height}px`;
        line.style.left = `${x}px`;
        line.style.top = `${y}px`;
        line.style.opacity = (Math.random() * 0.4 + 0.2).toString();
        line.style.setProperty('--rotation', `${rotation}deg`);
        line.style.transform = `rotate(${rotation}deg)`;
        line.style.animation = `geometric-fall ${animationDuration}s linear infinite`;
        line.style.backgroundColor = color;
        line.style.boxShadow = `0 0 10px ${color}`;
        
        containerRef.current.appendChild(line);
        particles.current.push({
          x,
          y,
          size: width, // Use width as size
          speedY,
          speedX,
          element: line,
          animationDuration,
          color,
          glow: true,
          rotation
        });
      }
      
      // Add abstract light rays
      for (let i = 0; i < 3; i++) {
        const ray = document.createElement('div');
        ray.className = 'light-ray';
        
        const width = Math.random() * 300 + 200; // Ray width between 200-500px
        const height = Math.random() * 800 + 600; // Ray height between 600-1400px
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1;
        const rotation = Math.random() * 40 - 20;
        const opacity = Math.random() * 0.1 + 0.05; // Very transparent
        
        ray.style.width = `${width}px`;
        ray.style.height = `${height}px`;
        ray.style.left = `${x}px`;
        ray.style.top = `${y}px`;
        ray.style.setProperty('--base-opacity', opacity.toString());
        ray.style.setProperty('--rotation', `${rotation}deg`);
        ray.style.backgroundImage = `linear-gradient(to bottom, ${theme === 'dark' ? 'rgba(155, 135, 245, 0.6)' : 'rgba(155, 135, 245, 0.8)'}, transparent)`;
        ray.style.filter = `blur(${Math.random() * 40 + 30}px)`;
        
        containerRef.current.appendChild(ray);
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
      
      // Remove style element
      const styleElement = document.querySelector('style[data-particles]');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [theme]);
  
  return (
    <>
      <div 
        ref={containerRef} 
        className="particles-container fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0" 
      />
      <div className="abstract-background fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="blur-circle circle-1 absolute rounded-full bg-primary/10 w-[70vw] h-[70vw] blur-[120px] top-[-20vw] left-[-20vw]"></div>
        <div className="blur-circle circle-2 absolute rounded-full bg-primary/10 w-[50vw] h-[50vw] blur-[100px] bottom-[-10vw] right-[-10vw]"></div>
        <div className="blur-circle circle-3 absolute rounded-full bg-primary/5 w-[40vw] h-[40vw] blur-[80px] top-[30vh] right-[10vw]"></div>
        <div className="blur-circle circle-4 absolute rounded-full bg-primary/5 w-[60vw] h-[60vw] blur-[100px] bottom-[10vh] left-[20vw]"></div>
      </div>
    </>
  );
};

export default ParticlesBackground;
