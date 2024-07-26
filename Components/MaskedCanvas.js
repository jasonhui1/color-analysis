import React, { useEffect, useRef, useState } from 'react';

const MaskedCanvas = ({ canvasRef, image, reset, brushSize = 100, maskMode = true }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [image, reset]);

    const startDrawing = (e) => {
        if (e.button === 2) {
            setIsErasing(true);
        } else {
            setIsDrawing(true);
        }
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setIsErasing(false);
    };
    const draw = (e) => {
        if ((!isDrawing && !isErasing) || !maskMode) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.globalCompositeOperation = isErasing ? 'source-over' : 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fill();
    };

    return (
        <canvas
            ref={canvasRef}
            className="max-w-full h-auto cursor-crosshair absolute top-0 left-0"
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            onContextMenu={(e) => e.preventDefault()}
            style={{ opacity: maskMode ? 0.5 : 0 }}
        />
    );
};

export default MaskedCanvas;