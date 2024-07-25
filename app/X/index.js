import React, { useState, useRef, useEffect } from "react";
import ColorThief from "colorthief"; // Assume the provided code is in this file

const nearestColorFromPalette = (color, palette) => {
    return palette.reduce((closest, currentColor) => {
        const distance = Math.hypot(
            color[0] - currentColor[0],
            color[1] - currentColor[1],
            color[2] - currentColor[2]
        );

        if (distance < closest.distance || closest.distance === undefined) {
            return { color: currentColor, distance };
        } else {
            return closest;
        }
    }, { color: null, distance: undefined })
        .color;
}

const isColorEqual = (color1, color2) => {
    if (!color1 || !color2) return false;
    return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
}

const ColorAnalysis = () => {
    const [image, setImage] = useState(null);
    const [colorPalette, setColorPalette] = useState([]);
    const [hoveredColor, setHoveredColor] = useState(null);
    const [colorMap, setColorMap] = useState(null);
    const canvasRef = useRef(null);
    const colorThief = new ColorThief();

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                setImage(img);
                analyzeColors(img);
            };
        };

        reader.readAsDataURL(file);
    };

    const analyzeColors = (img) => {
        try {
            const palette = colorThief.getPalette(img, 5);
            setColorPalette(palette);
        } catch (error) {
            console.error("Error analyzing colors:", error);
        }
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
        }
    }, [image]);

    useEffect(() => {
        if (hoveredColor && canvasRef.current) {
            highlightColor(hoveredColor);
        }
    }, [hoveredColor]);

    const highlightColor = (color) => {
        if (!hoveredColor) return

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
            if (isColorEqual(hoveredColor, nearestColor)) {
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


    const resetImage = () => {
        if (image && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.drawImage(
                image,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Color Analysis
            </h1>
            <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="mb-4"
            />

            {image && (
                <div className="mb-4">
                    <canvas ref={canvasRef} className="max-w-full h-auto" />
                </div>
            )}

            {colorPalette.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
                    <div className="flex flex-wrap gap-4">
                        {colorPalette.map((color, index) => (
                            <div
                                key={index}
                                className="w-16 h-16 rounded-full cursor-pointer shadow-md flex items-center justify-center"
                                style={{ backgroundColor: `rgb(${color.join(",")})` }}
                                onMouseEnter={() => {
                                    setHoveredColor(color);
                                    highlightColor(color);
                                }}
                                onMouseLeave={() => {
                                    setHoveredColor(null);
                                    resetImage();
                                }}
                            >
                                {/* <span
                  className="text-xs font-semibold"
                  style={{
                    color: getLuminance(color) > 0.5 ? "black" : "white",
                  }}
                >
                  {index + 1}
                </span> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorAnalysis;
