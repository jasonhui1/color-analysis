import React, { useState, useRef, useEffect } from "react";
import ColorThief from "colorthief";
import { calculateBrightness, closeToWhite, isColorEqual, nearestColorFromPalette } from "@/utils/color";
import FileUpload from "@/Components/FileUpload";
import Canvas from "@/Components/Canvas";
import PaletteDisplay from "@/Components/PaletteDisplay";
import MaskedCanvas from "@/Components/MaskedCanvas";
import NextImage from "next/image";

const ColorAnalysis = () => {
    const [image, setImage] = useState(null);
    const [colorPalette, setColorPalette] = useState([]);
    const canvasRef = useRef(null);
    const maskedCanvasRef = useRef(null);

    const [reset, setReset] = useState(false);
    const [maskReset, setMaskReset] = useState(false);
    const [maskMode, setMaskMode] = useState(false);
    const [enableMask, setEnableMask] = useState(false);
    const [invertMask, setInvertMask] = useState(false);

    const [maskDataUrl, setMaskDataUrl] = useState(null);

    const onPaletteColorHover = (color) => {
        highlightColor(color);
    };

    const resetImage = () => {
        setReset(!reset);
    };

    const onPaletteColorUnHover = () => {
        resetImage();
    };

    const analyzeColors = (img) => {
        try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 8, 10);

            palette.sort((a, b) => calculateBrightness(b) - calculateBrightness(a));
            setColorPalette(palette);
        } catch (error) {
            console.error("Error analyzing colors:", error);
        }
    };

    // const onImageSelected = (img) => {
    const onImageSelected = (img) => {
        setImage(img);
        analyzeColors(img)

    }

    const highlightColor = (color) => {
        if (!color) return

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const step = 4; //rgba

        for (let i = 0; i < data.length; i += step) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const nearestColor = nearestColorFromPalette([r, g, b], colorPalette);
            if (isColorEqual(color, nearestColor)) {
                // Highlight matching colors
                data[i] = color[0];
                data[i + 1] = color[1];
                data[i + 2] = color[2];
                // data[i + 3] = 255; // Full opacity
            } else {
                // Dim non-matching colors
                data[i] = Math.floor(r * 0.2);
                data[i + 1] = Math.floor(g * 0.2);
                data[i + 2] = Math.floor(b * 0.2);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const saveAndExitMask = () => {
        setReset(!reset)
        setMaskMode(!maskMode)


    };

    const reAnalysis = () => {
        const url = canvasRef.current.toDataURL();
        const myImage = new Image();
        myImage.src = url;

        setMaskDataUrl(url);
        analyzeColors(myImage);
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Color Analysis
            </h1>

            <FileUpload onImageSelected={onImageSelected} />

            {/* {image && ( */}
            <div className="mb-4 relative " >
                <Canvas canvasRef={canvasRef} image={image} reset={reset} maskedImage={maskedCanvasRef.current} maskMode={maskMode} enableMask={enableMask} invertMask={invertMask} />
                <MaskedCanvas canvasRef={maskedCanvasRef} image={image} reset={maskReset} brushSize={10} maskMode={maskMode} />
            </div>

            <PaletteDisplay
                colorPalette={colorPalette}
                onPaletteColorHover={onPaletteColorHover}
                onPaletteColorUnHover={onPaletteColorUnHover}
            />

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => saveAndExitMask()}>Find Mask </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => reAnalysis()}>Update analysis color </button>

            <div>
                <input type="checkbox" checked={enableMask} onChange={() => setEnableMask(!enableMask)} />Enable mask
            </div>
            <input type="checkbox" checked={invertMask} onChange={() => setInvertMask(!invertMask)} />Invert mask
            {/* {maskDataUrl &&
                <NextImage
                    src={maskDataUrl} alt="Masked Image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 'auto', height: 'auto' }} // optional
                />
            } */}
        </div>
    );
};
export default ColorAnalysis;


