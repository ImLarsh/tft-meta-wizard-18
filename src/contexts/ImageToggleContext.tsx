
import React, { createContext, useContext, useState } from 'react';

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
    </ImageToggleContext.Provider>
  );
};
