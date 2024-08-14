import { useEffect, useRef } from "react";
import { calculateBrightness, closeToWhite, isColorEqual, nearestColorFromPalette } from "../../utils/color";

export default function HighlightHoveringColorCanvas({ canvasRef, reset, imageCanvas = null, maskCanvas = null, onlyInMask = false,
    color = null, colorPalette, ignorePalette = [], enable = true
}) {
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

    const checkFilter = ({ maskData, i, nearestColor, alpha }) => {
        let maskCheck = true
        if (maskCanvas && onlyInMask) {
            const maskAlpha = maskData[i + 3]
            if (maskAlpha != 0) maskCheck = false
        }

        const colorCheck = isColorEqual(color, nearestColor)
        return (maskCheck && colorCheck) || alpha === 0
    }


    useEffect(() => {
        if (!enable) return
        console.log('color :>> ', color);
        if (imageCanvas) {
            if (!color) return

            // Current canvas
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const currentData = currentImageData.data;
            const combinedPalette = [...colorPalette, ...ignorePalette];

            let maskData;
            if (maskCanvas && onlyInMask) {
                const maskCtx = maskCanvas.getContext('2d');
                maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
            }

            processImageColors(imageCanvas, combinedPalette, ({ nearestColor, alpha, i }) => {
                if (checkFilter({ maskData, i, nearestColor, alpha })) {
                    // set current to transparent 
                    currentData[i + 3] = 0;
                } else {
                    currentData[i + 3] = 255;
                }
            })
            ctx.putImageData(currentImageData, 0, 0);
        }
    }, [color]);

    let opacity;
    if (enable && color) {
        opacity = (calculateBrightness(color) / 255 > 0.3) ? 0.8 : 0.95;
    } else {
        opacity = 0;
    }

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
