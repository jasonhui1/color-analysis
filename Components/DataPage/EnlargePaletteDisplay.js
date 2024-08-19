import React, { useState, useRef, useEffect } from "react";

import { Form } from "../../Components/Form/Form";
import { ColorPicker, TriangularColorPickerDisplayColors } from "@/Components/Color/picker";

import ImageEditor from "@/Components/ImageEditor";
import ImageDisplay from "../ImageDisplay";
import { useColorPaletteInteractivity } from "@/hooks/useColorPalette";
import PaletteDisplay, { PaletteDisplaySimpleV2 } from "../Color/PaletteDisplay";
import { createImageFromUrl } from "@/utils/canvas";
import { setImageURL } from "@/lib/cloudinary/utils";


const EnlargePaletteDisplay = ({ imageURL, maskImageURL, colorPalette, ignorePalette, percentage, maxSize = 640, setSelectedColor }) => {
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

    useEffect(() => {
        const loadResizedImage = async (url, setF) => {
            const resized_url = setImageURL(url, maxSize, maxSize)
            const img = await createImageFromUrl(resized_url);
            setF(img);

        };
        if (imageURL) loadResizedImage(imageURL, setImage);
        if (maskImageURL) loadResizedImage(maskImageURL, setMaskImage);
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="flex flex-row gap-6 relative mb-3 p-4 " >
            <ImageDisplay canvasRef={canvasRef} maskedCanvasRef={maskCanvasRef}
                image={image} maskImage={maskImage}
                hoveringColor={hoveringColor} setSelectedColor={setSelectedColor}
                colorPalette={colorPalette} ignorePalette={ignorePalette}
                onlyHighlightMask={onlyHighlightMask}
            />

            <div className=" flex flex-col gap-4">

                <PaletteDisplaySimpleV2
                    colorPalette={colorPalette} colorPalettePercentage={percentage}
                    onPaletteColorHover={onPaletteColorHover}
                    onPaletteColorUnHover={onPaletteColorUnHover}
                    onPaletteColorClick={onPaletteColorClick}
                />
                {colorPalette.length > 0 && <TriangularColorPickerDisplayColors colors={colorPalette} highlightColor={hoveringColor} />}

            </div>
        </div>
    );
};
export default EnlargePaletteDisplay;

