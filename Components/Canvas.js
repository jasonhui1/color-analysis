import { useEffect } from "react";

export default function Canvas({ canvasRef, image, reset, maskedImage, maskMode, enableMask, invertMask }) {
    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            let ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, 0, 0, image.width, image.height);

            if (!maskMode && maskedImage && enableMask) {
                if (invertMask) {
                    ctx.globalCompositeOperation = 'destination-in';
                } else {
                    ctx.globalCompositeOperation = 'destination-out';
                }

                ctx.drawImage(maskedImage, 0, 0, image.width, image.height);
            }

        }
    }, [image, reset, maskedImage, maskMode, enableMask, invertMask]);

    return (<canvas ref={canvasRef} className="max-w-full h-auto" />);
}

export const removeTransparentPixels = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const alpha = data[((y * canvas.width + x) * 4) + 3];
            if (alpha !== 0) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    // Add a small padding
    minX = Math.max(0, minX - 1);
    minY = Math.max(0, minY - 1);
    maxX = Math.min(canvas.width - 1, maxX + 1);
    maxY = Math.min(canvas.height - 1, maxY + 1);

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = width;
    croppedCanvas.height = height;

    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);

    return {
        canvas: croppedCanvas,
        width,
        height
    };
};

