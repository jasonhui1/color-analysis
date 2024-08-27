import React, { useState, useRef, useEffect } from "react";

import { ColorPicker, TriangularColorPickerDisplayColors } from "@/Components/Color/picker";

import ImageDisplay from "../ImageDisplay";
import { useColorPaletteInteractivity } from "@/hooks/useColorPalette";
import PaletteDisplay, { PaletteDisplaySimpleV2 } from "../Color/PaletteDisplay";
import { setImageURL } from "@/lib/cloudinary/utils";
import { IoMdClose } from "react-icons/io";
import ToggleComponent from "../General/ToggleComponent";
import CheckBox from "../General/CheckBox";
import { loadImage } from "@/utils/image";


const EnlargePaletteDisplay = ({ imageURL, maskImageURL, colorPalette, ignorePalette, percentage, maxSize = 640, selectedColor, setSelectedColor, onClose }) => {
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);

    //Resets, use canvas hook
    const [hoveringColor, setHoveringColor] = useState();
    const [onlyHighlightMask, setOnlyHighlightMask] = useState(true);

    const { onPaletteColorHover,
        onPaletteColorUnHover,
        onPaletteColorClick
    } = useColorPaletteInteractivity({ setSelectedColor, setHoveringColor, });

    const [image, setImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [replacePalette, setReplacePalette] = useState([]);
    const [enableReplacePalette, setEnableReplacePalette] = useState(false);

    useEffect(() => {
        const loadResizedImage = async (url, setF) => {
            const resized_url = setImageURL(url, maxSize, maxSize)
            const img = await loadImage(resized_url);
            setF(img);

        };
        if (imageURL) loadResizedImage(imageURL, setImage);
        if (maskImageURL) loadResizedImage(maskImageURL, setMaskImage);

        setReplacePalette(colorPalette)
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className='flex items-center justify-center fixed inset-0 vh-100 w-full z-10 bg-red-50 '>
            <div className="flex flex-row gap-6 relative mb-3 p-4 " >
                <ImageDisplay canvasRef={canvasRef} maskedCanvasRef={maskCanvasRef}
                    image={image} maskImage={maskImage}
                    hoveringColor={hoveringColor} setSelectedColor={setSelectedColor}
                    colorPalette={colorPalette} ignorePalette={ignorePalette} replacePalette={replacePalette} enableReplacePalette={enableReplacePalette}
                    onlyHighlightMask={onlyHighlightMask}
                />

                <div className=" flex flex-col gap-4">
                    <CheckBox label='Only highlight mask' checked={onlyHighlightMask} onChange={() => setOnlyHighlightMask  (!onlyHighlightMask)} />

                    <PaletteDisplaySimpleV2
                        colorPalette={colorPalette} colorPalettePercentage={percentage}
                        onPaletteColorHover={onPaletteColorHover}
                        onPaletteColorUnHover={onPaletteColorUnHover}
                        onPaletteColorClick={onPaletteColorClick}
                    />

                    <ToggleComponent label='Replace Color Palette'  >

                        <PaletteDisplay
                            title='Replace Color Palette'
                            colorPalette={replacePalette} setColorPalette={setReplacePalette} colorPalettePercentage={[]}
                            onPaletteColorClick={onPaletteColorClick}
                            selectedColor={selectedColor} enableAdd={false} enableDelete={false} />
                        <CheckBox label='Enable Replace Color Palette' checked={enableReplacePalette} onChange={() => setEnableReplacePalette(!enableReplacePalette)} />
                    </ToggleComponent>
                    {colorPalette.length > 0 && <TriangularColorPickerDisplayColors colors={colorPalette} highlightColor={hoveringColor} />}

                </div>
            </div>
            <IoMdClose className='absolute top-0 right-0 p-2 cursor-pointer' onClick={onClose} size={48} />

        </div>
    );
};
export default EnlargePaletteDisplay;

