import { useEffect, useState } from "react";
import convert from 'color-convert';
import { calculateBrightness } from "@/utils/color";

// type ColorSpace = 'rgb' | 'lab'
export default function SobelCanvas({ canvasRef, imageCanvas, reset, enabled = true, colorSpace = 'rgb' }) {

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
    }, [reset, colorSpace]);

    const applySobelFilter = () => {
        const ctx = imageCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);

        let sobelData;

        // if (colorSpace === 'rgb') {
        //     sobelData = sobelFilterRGB(imageData);
        // } 
        // else if (colorSpace === 'lab') {
        //     sobelData = sobelFilterLAB(imageData);
        // }

        sobelData = sobelFilterRGB(imageData);
        sobelData = invertFilter(sobelData);

        const canvas = canvasRef?.current;
        canvas.getContext('2d').putImageData(sobelData, 0, 0);
        setCalculated(true)
    };


    // code from chatgpt,
    const sobelFilterRGB = (imageData) => {
        const width = imageData.width;
        const height = imageData.height;
        const sobelData = new ImageData(width, height);

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
            // const r = imageData.data[(y * width + x) * 4]
            // const g = imageData.data[(y * width + x) * 4 + 1]
            // const b = imageData.data[(y * width + x) * 4 + 2]

            // const l = calculateBrightness([r, g, b])
            // return l
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

    // Block look and has much slower
    const sobelFilterLAB = (imageData) => {
        const width = imageData.width;
        const height = imageData.height;
        const sobelData = new ImageData(width, height);

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

        const getLabAt = (x, y) => {
            const index = (y * width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            return convert.rgb.lab.raw([r, g, b]);
        };

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let pixelX = [0, 0, 0];
                let pixelY = [0, 0, 0];

                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const lab = getLabAt(x + j, y + i);
                        for (let c = 0; c < 3; c++) {
                            pixelX[c] += kernelX[i + 1][j + 1] * lab[c];
                            pixelY[c] += kernelY[i + 1][j + 1] * lab[c];
                        }
                    }
                }


                const magnitude = Math.sqrt(
                    pixelX.reduce((sum, val) => sum + val * val, 0) +
                    pixelY.reduce((sum, val) => sum + val * val, 0)
                );

                // Convert magnitude to RGB
                const [l, a, b] = getLabAt(x, y);
                // const rgb = convert.lab.rgb([magnitude, a,b]); // Using only L channel for edge intensity
                const rgb = convert.lab.rgb([magnitude, 0, 0]); // Using only L channel for edge intensity

                const index = (y * width + x) * 4;
                sobelData.data[index] = rgb[0];
                sobelData.data[index + 1] = rgb[1];
                sobelData.data[index + 2] = rgb[2];
                sobelData.data[index + 3] = 255; // Set alpha channel to fully opaque
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

