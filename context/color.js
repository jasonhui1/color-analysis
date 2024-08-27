import { createContext, useContext, useState } from 'react';

const ColorContext = createContext(null);

export const ColorProvider = ({ children }) => {
  const [colorPalette, setColorPalette] = useState([]);
  const [ignorePalette, setIgnorePalette] = useState([]);
  const [hoveringColor, setHoveringColor] = useState();

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
