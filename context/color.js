import { createContext, useContext, useState } from 'react';

const ColorContext = createContext(null);

export const ColorProvider = ({ colorPalette_ = [], ignorePalette_ = [], hoveringColor_ = null, children }) => {
  const [colorPalette, setColorPalette] = useState(colorPalette_);
  const [ignorePalette, setIgnorePalette] = useState(ignorePalette_);
  const [hoveringColor, setHoveringColor] = useState(hoveringColor_);

  const value = {
    colorPalette,
    setColorPalette,
    ignorePalette,
    setIgnorePalette,
    hoveringColor,
    setHoveringColor,
  };

  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};

export const useColorContext = () => useContext(ColorContext);
