import React, { useState, useRef, useEffect } from "react";
import ColorThief from "colorthief";
import { isColorEqual, nearestColorFromPalette } from "@/utils/color";
import FileUpload from "@/Components/FileUpload";
import Canvas from "@/Components/Canvas";
import PaletteDisplay from "@/Components/PaletteDisplay";

const ColorAnalysis = () => {
    const [image, setImage] = useState(null);
    const [colorPalette, setColorPalette] = useState([]);
    const canvasRef = useRef(null);
    const [reset, setReset] = useState(false);

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
            const palette = colorThief.getPalette(img, 5);
            setColorPalette(palette);
        } catch (error) {
            console.error("Error analyzing colors:", error);
        }
    };

    const onImageSelected = (img) => {
        setImage(img);
        analyzeColors(img);
    }

    const highlightColor = (color) => {
        if (!color) return

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        // const maxIterations = 10000; // Adjust this value based on performance
        const step = 4; // Process every 4th pixel to reduce iterations
        // const len = Math.min(data.length, maxIterations * 4);

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
                data[i + 3] = 255; // Full opacity
            } else {
                // Dim non-matching colors
                data[i] = Math.floor(r * 0.1);
                data[i + 1] = Math.floor(g * 0.1);
                data[i + 2] = Math.floor(b * 0.1);
            }
        }

        ctx.putImageData(imageData, 0, 0);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Color Analysis
            </h1>

            <FileUpload onImageSelected={onImageSelected} />

            {image && (
                <div className="mb-4">
                    <Canvas canvasRef={canvasRef} image={image} reset={reset} />
                </div>
            )}

            <PaletteDisplay
                colorPalette={colorPalette}
                onPaletteColorHover={onPaletteColorHover}
                onPaletteColorUnHover={onPaletteColorUnHover}
            />

        </div>
    );
};

export default ColorAnalysis;


