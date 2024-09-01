import { useCallback, useEffect, useRef, useState } from "react";
import { calculateCanvasSize } from "../../utils/canvas";


export default function Canvas({ canvasRef, image, setDrawingComplete, reset, maskedImage,
    maskMode = false, enableMask, invertMask = false,
    setSelectedColor = null,
    maxSize = 640,
    extraDrawing = (ctx) => { },
}) {

    const isSelectingRef = useRef(false);
    useEffect(() => {
        // if (maskMode) return
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            let ctx = canvas.getContext("2d");

            // Set maximum width
            const { width, height } = calculateCanvasSize(image, maxSize);

            canvas.width = width;
            canvas.height = height;

            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, 0, 0, width, height);

            if (enableMask && !maskMode && maskedImage) {
                if (invertMask) {
                    ctx.globalCompositeOperation = 'destination-in';
                } else {
                    ctx.globalCompositeOperation = 'destination-out';
                }


                ctx.drawImage(maskedImage, 0, 0, maskedImage.width, maskedImage.height);
            }
            ctx.globalCompositeOperation = 'source-over';

            extraDrawing()

            // if (enableSAM && !SAMMode && SAMImage) {
            //     ctx.globalCompositeOperation = 'destination-in';
            //     ctx.drawImage(SAMImage, 0, 0, SAMImage.width, SAMImage.height);
            // }

            setDrawingComplete(true)
        }
    }, [canvasRef, image, reset, maskMode, enableMask, invertMask]);
    // }, [canvasRef, image, reset, maskMode, maskedImage?.width, maskedImage?.height, enableMask, invertMask]);


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
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        const color = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b] = color.slice(0, 3);
        setSelectedColor([r, g, b]);
    }

    useEffect(() => {
        if (!maskMode && setSelectedColor) {
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
    }, [maskMode, canvasRef, image]);

    return (<canvas ref={canvasRef} className={`max-w-full h-auto ${setSelectedColor ? 'cursor-crosshair' : ''}`} />);
}


export function CanvasNoMask({ canvasRef, image, setDrawingComplete = null, setSelectedColor = null, maxSize = 200 }) {

    useEffect(() => {
        // if (maskMode) return
        if (image && canvasRef.current && image.complete) {
            const canvas = canvasRef.current;
            let ctx = canvas.getContext("2d");

            // Set maximum width
            const { width, height } = calculateCanvasSize(image, maxSize);

            canvas.width = width;
            canvas.height = height;

            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, 0, 0, width, height);

        }
    }, [canvasRef, image, image?.complete]);

    return (<canvas ref={canvasRef} className="max-w-full h-auto  absolute top-0 left-0" />);
}

