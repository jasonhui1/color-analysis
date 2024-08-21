import { useEffect, useState } from "react";

export default function SobelCanvas({ canvasRef, imageCanvas, reset, enabled = true
}) {

    const [calculated, setCalculated] = useState(false);

    useEffect(() => {
        if (imageCanvas && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = imageCanvas.width;
            canvas.height = imageCanvas.height;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

        }
    }, [imageCanvas?.width, imageCanvas?.height]);

    useEffect(() => {
        if (enabled && !calculated) {
            applySobelFilter();
        }
    }, [enabled]);

    useEffect(() => {
        setCalculated(false);
        if (enabled) applySobelFilter()
    }, [reset]);

    const applySobelFilter = () => {
        // if (calculated) return
        const canvas = imageCanvas;
        const ctx = imageCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const sobelData = sobelFilter(imageData);
        const invertedData = invertFilter(sobelData);
        canvasRef.current.getContext('2d').putImageData(invertedData, 0, 0);
        setCalculated(true);
    };

    // code from chatgpt, apply to each color channel, but idk why it is inverted 
    const sobelFilter = (imageData) => {
        const ctx = imageCanvas.getContext('2d');
        const width = imageData.width;
        const height = imageData.height;
        const sobelData = ctx.createImageData(width, height);

        const kernelX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];

        const kernelY = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];

        const getColorAt = (x, y, colorChannel) => {
            const index = (y * width + x) * 4 + colorChannel;
            return imageData.data[index];
        };

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) { // Apply to R, G, B channels
                    let pixelX = (
                        (kernelX[0][0] * getColorAt(x - 1, y - 1, c)) +
                        (kernelX[0][1] * getColorAt(x, y - 1, c)) +
                        (kernelX[0][2] * getColorAt(x + 1, y - 1, c)) +
                        (kernelX[1][0] * getColorAt(x - 1, y, c)) +
                        (kernelX[1][1] * getColorAt(x, y, c)) +
                        (kernelX[1][2] * getColorAt(x + 1, y, c)) +
                        (kernelX[2][0] * getColorAt(x - 1, y + 1, c)) +
                        (kernelX[2][1] * getColorAt(x, y + 1, c)) +
                        (kernelX[2][2] * getColorAt(x + 1, y + 1, c))
                    );

                    let pixelY = (
                        (kernelY[0][0] * getColorAt(x - 1, y - 1, c)) +
                        (kernelY[0][1] * getColorAt(x, y - 1, c)) +
                        (kernelY[0][2] * getColorAt(x + 1, y - 1, c)) +
                        (kernelY[1][0] * getColorAt(x - 1, y, c)) +
                        (kernelY[1][1] * getColorAt(x, y, c)) +
                        (kernelY[1][2] * getColorAt(x + 1, y, c)) +
                        (kernelY[2][0] * getColorAt(x - 1, y + 1, c)) +
                        (kernelY[2][1] * getColorAt(x, y + 1, c)) +
                        (kernelY[2][2] * getColorAt(x + 1, y + 1, c))
                    );

                    const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
                    const index = (y * width + x) * 4;
                    sobelData.data[index + c] = magnitude;
                }
                sobelData.data[(y * width + x) * 4 + 3] = 255; // Set alpha channel to fully opaque
            }
        }

        return sobelData;
    };

    const invertFilter = (imageData) => {
        const ctx = imageCanvas.getContext('2d');
        const width = imageData.width;
        const height = imageData.height;
        const invertedData = ctx.createImageData(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                invertedData.data[index] = 255 - imageData.data[index];
                invertedData.data[index + 1] = 255 - imageData.data[index + 1];
                invertedData.data[index + 2] = 255 - imageData.data[index + 2];
                invertedData.data[index + 3] = imageData.data[index + 3];
            }
        }
        return invertedData;
    };

    return (
        <canvas ref={canvasRef}
            className={`max-w-full h-auto absolute top-0 left-0 pointer-events-none ${enabled ? 'opacity-100' : 'opacity-0'}`}
        />
    );
}

