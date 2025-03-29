
import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type AppLogoProps = {
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

const AppLogo: React.FC<AppLogoProps> = ({ size = 'medium', className }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-24 h-24"
  };
  
  const textSizeClasses = {
    small: "text-sm",
    medium: "text-lg",
    large: "text-3xl"
  };
  
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-primary to-purple-300 p-1",
        "shadow-lg animate-pulse-subtle",
        sizeClasses[size]
      )}>
        <div className="absolute inset-0 rounded-full animate-spin-slow opacity-50 bg-gradient-to-tr from-primary-foreground/0 via-primary-foreground/30 to-primary-foreground/0"></div>
        <div className="absolute inset-0 rounded-full animate-pulse-subtle blur-md bg-primary/50"></div>
        
        <div className={cn(
          "relative bg-gradient-to-br from-background via-background/95 to-background/90 rounded-full flex items-center justify-center",
          "w-full h-full overflow-hidden"
        )}>
          <Sparkles 
            className={cn(
              "text-primary animate-pulse", 
              size === 'small' ? "w-4 h-4" : size === 'medium' ? "w-6 h-6" : "w-12 h-12"
            )} 
          />
        </div>
      </div>
      
      {size === 'large' && (
        <div className="mt-2 font-bold text-foreground">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-purple-400">
            TFT Genie
          </span>
        </div>
      )}
    </div>
  );
};

export default AppLogo;
