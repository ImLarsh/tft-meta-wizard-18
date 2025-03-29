
import React, { createContext, useContext } from 'react';

type ImageToggleContextType = {
  useTftImages: boolean;
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
  // Always use TFT images
  const useTftImages = true;

  return (
    <ImageToggleContext.Provider value={{ useTftImages }}>
      {children}
    </ImageToggleContext.Provider>
  );
};
