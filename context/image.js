import { createContext, useContext, useState } from 'react';

const ImageContext = createContext(null);

export const ImageProvider = ({ children }) => {
    const [image, setImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);

    const value = {
        image,
        setImage,
        maskImage,
        setMaskImage,
    };

    return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};

export const useImageContext = () => useContext(ImageContext);
