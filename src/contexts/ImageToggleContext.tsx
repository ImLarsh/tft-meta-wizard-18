
import React, { createContext, useContext, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';

type ImageToggleContextType = {
  useTftImages: boolean;
  toggleImageSource: () => void;
};

const ImageToggleContext = createContext<ImageToggleContextType | undefined>(undefined);

export const useImageToggle = () => {
  const context = useContext(ImageToggleContext);
  if (!context) {
    throw new Error('useImageToggle must be used within an ImageToggleProvider');
  }
  return context;
};

export const ImageToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [useTftImages, setUseTftImages] = useState<boolean>(true);

  const toggleImageSource = () => setUseTftImages(prev => !prev);

  return (
    <ImageToggleContext.Provider value={{ useTftImages, toggleImageSource }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2 bg-card/90 backdrop-blur-sm p-2 rounded-md shadow-lg border border-border/50">
        <Camera className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-1.5">
          <Label htmlFor="image-source" className={`text-xs ${useTftImages ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
            TFT
          </Label>
          <Switch
            id="image-source"
            checked={!useTftImages}
            onCheckedChange={() => toggleImageSource()}
          />
          <Label htmlFor="image-source" className={`text-xs ${!useTftImages ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
            LoL
          </Label>
        </div>
      </div>
    </ImageToggleContext.Provider>
  );
};
