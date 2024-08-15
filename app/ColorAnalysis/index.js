import React, { useState, useRef, useEffect } from "react";

import HighlightHoveringColorCanvas, { processImageColors } from "../../Components/Canvas/FilterCanvas";

import GoogleLogin from "../../Components/Auth/GoogleLogin";
import Canvas from "../../Components/Canvas/Canvas";
import FileUpload from "../../Components/Form/FileUpload";
import MaskedCanvas from "../../Components/Canvas/MaskedCanvas";

import { Form } from "../../Components/Form/Form";
import { MaskUI } from "../../Components/Canvas/MaskUI";
import SAMCanvas from "../../Components/Canvas/SAMCanvas";
import { invertImageAlpha, processCanvas } from "../../utils/canvas";
import { ColorPicker, TriangularColorPickerDisplayColors } from "@/Components/Color/picker";
import useCanvas from "@/hooks/useCanvas";
import useSAM from "@/hooks/useSAM";
import { useMaskUI } from "@/hooks/useMaskUI";
import { useColorPalette } from "@/hooks/useColorPalette";
import { loadImage } from "@/utils/image";
import ImageEditor from "@/Components/ImageEditor";


const ColorAnalysis = () => {
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);

    const [image, setImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);

    const [imageSourceURL, setImageSourceURL] = useState('');

    //Resets, use canvas hook
    const [formResetToggle, setFormResetToggle] = useState(false);

    const [colorPalette, setColorPalette] = useState([]);
    const [ignorePalette, setIgnorePalette] = useState([]);
    const [selectedColor, setSelectedColor] = useState([0, 0, 0]);
    const [hoveringColor, setHoveringColor] = useState();

    const [invertMask, setInvertMask] = useState(false);

    const resetForm = (img, file, url) => {
        setFormResetToggle(state => !state);
        if (url) {
            setImageSourceURL(url);
        } else {
            setImageSourceURL('');
        }
    }

    return (
        <div className="p-4">
            <GoogleLogin />
            <h1 className="text-2xl font-bold mb-4">
                Color Analysis
            </h1>

            {/* {image && ( */}
            <div className="flex flex-row gap-6 relative mb-3 " >
                <ImageEditor canvasRef={canvasRef} maskedCanvasRef={maskCanvasRef}
                    image={image} setImage={setImage}
                    maskImage={maskImage} setMaskImage={setMaskImage}
                    onImageSelected={resetForm}
                    hoveringColor={hoveringColor} setSelectedColor={setSelectedColor}
                    colorPalette={colorPalette} ignorePalette={ignorePalette}
                    invertMask={invertMask} setInvertMask={setInvertMask}
                />

                <ColorPicker selectedColor={{ r: selectedColor[0], g: selectedColor[1], b: selectedColor[2] }} isRGBSpace={true} />

                {/* Use Context */}
                <Form
                    canvas={canvasRef?.current} maskCanvas={maskCanvasRef?.current} image={image} invertMask={invertMask}
                    hoveringColor={hoveringColor} setHoveringColor={setHoveringColor}
                    selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                    imageSourceURL={imageSourceURL} setImageSourceURL={setImageSourceURL}
                    colorPalette={colorPalette} setColorPalette={setColorPalette}
                    ignorePalette={ignorePalette} setIgnorePalette={setIgnorePalette}
                    formReset={formResetToggle}
                />
            </div>

        </div>
    );
};
export default ColorAnalysis;
