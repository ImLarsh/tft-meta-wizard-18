
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageToggleContextType {
  useTftImages: boolean;
  toggleImageSource: () => void;
}

const ImageToggleContext = createContext<ImageToggleContextType | undefined>(undefined);

export const ImageToggleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [useTftImages, setUseTftImages] = useState(true);

  const toggleImageSource = () => {
    setUseTftImages(prev => !prev);
  };

  return (
    <ImageToggleContext.Provider value={{ useTftImages, toggleImageSource }}>
      {children}
    </ImageToggleContext.Provider>
  );
};

export const useImageToggle = (): ImageToggleContextType => {
  const context = useContext(ImageToggleContext);
  if (context === undefined) {
    throw new Error('useImageToggle must be used within an ImageToggleProvider');
  }
  return context;
};
