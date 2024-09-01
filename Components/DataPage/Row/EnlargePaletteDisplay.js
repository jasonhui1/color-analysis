import React, { useState, useRef, useEffect } from "react";

import { ColorPicker, TriangularColorPickerDisplayColors } from "@/Components/Color/picker";

import ImageDisplay from "../../ImageDisplay";
import { useColorPaletteInteractivity } from "@/hooks/useColorPalette";
import PaletteDisplay, { PaletteDisplaySimpleV2 } from "../../Color/PaletteDisplay";
import { loadCloudinaryImage } from "@/lib/cloudinary/utils";
import { IoMdClose } from "react-icons/io";
import ToggleComponent from "../../General/ToggleComponent";
import CheckBox from "../../General/CheckBox";
import { loadImage } from "@/utils/image";
import { sortPaletteAndPercentage } from "@/utils/color";
import { ImageProvider, useImageContext } from "@/context/image";
import { ColorProvider, useColorContext } from "@/context/color";

const EnlargePaletteDisplay = ({ paletteData, maxSize = 640, selectedColor, setSelectedColor, onClose }) => {
    const { palette, ignorePalette } = paletteData

    return (
        <ColorProvider colorPalette_={palette} ignorePalette_={ignorePalette}>
            <ImageProvider>
                <EnlargePaletteDisplay_ paletteData={paletteData} maxSize={maxSize} selectedColor={selectedColor} setSelectedColor={setSelectedColor} onClose={onClose} />
            </ImageProvider>
        </ColorProvider>
    )
}

const EnlargePaletteDisplay_ = ({ paletteData, maxSize = 640, selectedColor, setSelectedColor, onClose }) => {
    const { imageURL, maskImageURL, palette: colorPalette, ignorePalette, percentage } = paletteData
    const { palette: sorted_palette, percentage: sorted_percentage } = sortPaletteAndPercentage(colorPalette, percentage)

    const [onlyHighlightMask, setOnlyHighlightMask] = useState(true);

    const { hoveringColor, setHoveringColor } = useColorContext()
    const { setImage, setMaskImage } = useImageContext()

    const [replacePalette, setReplacePalette] = useState([]);
    const [enableReplacePalette, setEnableReplacePalette] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            if (imageURL) setImage(await loadCloudinaryImage(imageURL, maxSize))
            if (maskImageURL) setMaskImage(await loadCloudinaryImage(maskImageURL, maxSize))
        };

        loadImages()
        setReplacePalette(sorted_palette)
    }, []);

    // Disable scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className='flex items-center justify-center fixed inset-0 vh-100 w-full z-10 bg-red-50 '>
            <div className="flex flex-row gap-6 relative mb-3 p-4 " >
                <ImageDisplay setSelectedColor={setSelectedColor}
                    replacePalette={replacePalette} enableReplacePalette={enableReplacePalette}
                    onlyHighlightMask={onlyHighlightMask}
                />

                <div className=" flex flex-col gap-4">
                    <CheckBox label='Only highlight mask' checked={onlyHighlightMask} onChange={() => setOnlyHighlightMask(!onlyHighlightMask)} />

                    <PaletteDisplay
                        colorPalette={sorted_palette} colorPalettePercentage={sorted_percentage}
                        setSelectedColor={setSelectedColor}
                        setHoveringColor={setHoveringColor}
                        enableAdd={false} enableDelete={false} enableEdit={false}
                    />

                    <ToggleComponent label='Replace Color Palette'  >

                        <PaletteDisplay
                            title='Replace Color Palette'
                            colorPalette={replacePalette} setColorPalette={setReplacePalette} colorPalettePercentage={[]}
                            setSelectedColor={setSelectedColor}
                            selectedColor={selectedColor} enableAdd={false} enableDelete={false}
                        />
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

