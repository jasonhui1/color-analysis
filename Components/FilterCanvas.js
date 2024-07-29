import { useEffect, useRef } from "react";
import { closeToWhite, isColorEqual, nearestColorFromPalette } from "../utils/color";

export default function HighlightHoveringColorCanvas({ canvasRef, reset, baseCanvasRef, image, color, colorPalette, enable = true }) {
    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [image, reset]);


    useEffect(() => {
        if (!enable) return
        if (canvasRef && canvasRef.current) {
            if (!color) return

            // Image canvas
            const imageCanvas = baseCanvasRef.current;
            const imagectx = imageCanvas.getContext("2d");
            const imageData = imagectx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
            const data = imageData.data;

            // Current canvas
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const currentData = currentImageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                const nearestColor = nearestColorFromPalette([r, g, b], colorPalette);
                if (isColorEqual(color, nearestColor) || a === 0) {
                    // set to transparent
                    currentData[i + 3] = 0;
                }
            }
            ctx.putImageData(currentImageData, 0, 0);
        }
    }, [color]);

    return (<canvas ref={canvasRef} className="max-w-full h-auto pointer-events-none absolute top-0 left-0 mix-blend-multiply" style={{ opacity: (color && enable) ? 0.8 : 0 }} />);
}
