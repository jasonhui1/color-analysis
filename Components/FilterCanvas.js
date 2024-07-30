import { useEffect, useRef } from "react";
import { calculateBrightness, closeToWhite, isColorEqual, nearestColorFromPalette } from "../utils/color";

export default function HighlightHoveringColorCanvas({ canvasRef, reset, imageCanvas = null, color = [0, 0, 0], colorPalette, ignorePalette, enable = true }) {
    useEffect(() => {
        if (imageCanvas && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = imageCanvas.width;
            canvas.height = imageCanvas.height;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [imageCanvas?.width, imageCanvas?.height, reset]);


    useEffect(() => {
        if (!enable) return
        if (imageCanvas) {
            if (!color) return

            // Current canvas
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const currentData = currentImageData.data;
            const combinedPalette = [...colorPalette, ...ignorePalette];

            processImageColors(imageCanvas, combinedPalette, ({ nearestColor, alpha, i }) => {
                if (alpha === 0 || (isColorEqual(color, nearestColor))) {
                    // set current to transparent
                    currentData[i + 3] = 0;
                }
            })
            ctx.putImageData(currentImageData, 0, 0);
        }
    }, [color]);

    let opacity = (color && enable) ? 0.8 : 0;
    if (color) opacity = (calculateBrightness(color) / 255 > 0.3) ? 0.8 : 0.95;

    return (<canvas ref={canvasRef} className={`max-w-full h-auto pointer-events-none absolute top-0 left-0 mix-blend-multiply`} style={{ opacity: opacity }} />);
}

export const processImageColors = (imageCanvas, colorPalette, applyColorFunction) => {
    const imagectx = imageCanvas.getContext("2d");
    const imageData = imagectx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        const nearestColor = nearestColorFromPalette([r, g, b], colorPalette);
        applyColorFunction({ nearestColor, alpha, i })
    }
}
