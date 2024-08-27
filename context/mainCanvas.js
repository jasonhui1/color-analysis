import { createContext, useContext, useRef } from 'react';

const MainCanvasContext = createContext(null);

export const MainCanvasProvider = ({ children }) => {

    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);

    const value = { canvasRef: canvasRef, maskCanvasRef: maskCanvasRef};
    // Not updated when ref is assigned
    // const value = { canvasRef: canvasRef, maskCanvasRef: maskCanvasRef, canvas: canvasRef.current, maskCanvas: maskCanvasRef.current };

    return <MainCanvasContext.Provider value={value}>{children}</MainCanvasContext.Provider>;
};

export const useMainCanvasContext = () => useContext(MainCanvasContext);
