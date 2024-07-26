import { Calistoga } from 'next/font/google';
import React, { useEffect, useRef, useState } from 'react';

const MaskedCanvas = ({ canvasRef, image, reset, maskMode = true }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [brushSize, setBrushSize] = useState(100);

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
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
    };

    const handleWheel = (e) => {
        e.preventDefault()
        const speed = 1 / 10
        setBrushSize(prevSize => Math.floor(Math.max(10, Math.min(200, prevSize - e.deltaY * speed))));
    };

    // Need to set to passive to false to prevent scrolling
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <>

            <canvas
                ref={canvasRef}
                className="max-w-full h-auto cursor-crosshair absolute top-0 left-0"
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
                onContextMenu={(e) => e.preventDefault()}
                style={{ opacity: maskMode ? 0.6 : 0 }}
            />
            {maskMode && <div className=" bg-white p-4 rounded shadow w-96">
                <input
                    type="range"
                    min="10"
                    max="200"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full"
                />
                <div className="text-center mt-2">Brush Size: {brushSize}px</div>
            </div>}
        </>
    );
};

export default MaskedCanvas;