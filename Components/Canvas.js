import { useEffect, useRef } from "react";

export default function Canvas({ canvasRef, image, setDrawingComplete, reset, maskedImage,
    maskMode, enableMask, invertMask,
    setSelectedColor
}) {

    const isSelectingRef = useRef(false);

    useEffect(() => {
        // if (maskMode) return
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            let ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, 0, 0, image.width, image.height);

            if (enableMask && !maskMode && maskedImage ) {
                if (invertMask) {
                    ctx.globalCompositeOperation = 'destination-in';
                } else {
                    ctx.globalCompositeOperation = 'destination-out';
                }

                ctx.drawImage(maskedImage, 0, 0, image.width, image.height);
            }
            setDrawingComplete(true)
        }
    }, [canvasRef, image, reset, maskMode, maskedImage, enableMask, invertMask]);


    const startSelecting = (e) => {
        // if (e.button === 2) {
        isSelectingRef.current = true;
        // }
        selectColor(e);
    };

    const stopSelecting = (e) => {
        isSelectingRef.current = false;
    };

    const selectColor = (e) => {
        const isSelecting = isSelectingRef.current;
        if ((!isSelecting)) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const color = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b] = color.slice(0, 3);
        setSelectedColor([r, g, b]);
    }

    useEffect(() => {
        if (!maskMode) {
            const canvas = canvasRef.current;
            canvas.addEventListener('mousedown', startSelecting);
            canvas.addEventListener('mouseup', stopSelecting);
            canvas.addEventListener('mouseout', stopSelecting);
            canvas.addEventListener('mousemove', selectColor);
            canvas.addEventListener('contextmenu', (e) => e.preventDefault());
            return () => {
                canvas.removeEventListener('mousedown', startSelecting);
                canvas.removeEventListener('mouseup', startSelecting);
                canvas.removeEventListener('mouseout', startSelecting);
                canvas.removeEventListener('mousemove', selectColor);
                canvas.removeEventListener('contextMenu', (e) => e.preventDefault());
            };
        }
    }, [maskMode, canvasRef]);

    return (<canvas ref={canvasRef} className="max-w-full h-auto cursor-crosshair" />);
}


export function CanvasNoMask({ canvasRef, image, setDrawingComplete, setSelectedColor = null }) {

    const isSelectingRef = useRef(false);

    useEffect(() => {
        // if (maskMode) return
        //TODO: add a filter canvas instead?, so only need to draw base image once
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            let ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, 0, 0, image.width, image.height);
            // setDrawingComplete(true)
        }
    }, [canvasRef, image]);

    const startSelecting = (e) => {
        // if (e.button === 2) {
        isSelectingRef.current = true;
        // }
        selectColor(e);
    };

    const stopSelecting = (e) => {
        isSelectingRef.current = false;
    };

    const selectColor = (e) => {
        const isSelecting = isSelectingRef.current;
        if ((!isSelecting)) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const color = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b] = color.slice(0, 3);
        setSelectedColor([r, g, b]);
    }

    useEffect(() => {
        if (setSelectedColor) {
            const canvas = canvasRef.current;
            canvas.addEventListener('mousedown', startSelecting);
            canvas.addEventListener('mouseup', stopSelecting);
            canvas.addEventListener('mouseout', stopSelecting);
            canvas.addEventListener('mousemove', selectColor);
            canvas.addEventListener('contextmenu', (e) => e.preventDefault());
            return () => {
                canvas.removeEventListener('mousedown', startSelecting);
                canvas.removeEventListener('mouseup', startSelecting);
                canvas.removeEventListener('mouseout', startSelecting);
                canvas.removeEventListener('mousemove', selectColor);
                canvas.removeEventListener('contextMenu', (e) => e.preventDefault());
            };
        }
    }, [canvasRef]);

    return (<canvas ref={canvasRef} className="max-w-full h-auto cursor-crosshair absolute top-0 left-0" />);
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

