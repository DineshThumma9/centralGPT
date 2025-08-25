// src/contexts/ColorModeContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { colors } from '../theme/styleDefinitions';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  colors: typeof colors.light | typeof colors.dark;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const saved = localStorage.getItem('color-mode');
    return (saved as ColorMode) || 'dark';
  });

  const toggleColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newMode);
    localStorage.setItem('color-mode', newMode);
  };

  const currentColors = useMemo(() => 
    colorMode === 'light' ? colors.light : colors.dark, 
    [colorMode]
  );

  useEffect(() => {
    // Apply color mode to document
    document.documentElement.setAttribute('data-color-mode', colorMode);
    document.body.style.background = currentColors.background.body;
  }, [colorMode, currentColors]);

  const value = useMemo(() => ({
    colorMode,
    toggleColorMode,
    colors: currentColors
  }), [colorMode, toggleColorMode, currentColors]);

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
};
