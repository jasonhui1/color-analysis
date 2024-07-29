import { Calistoga } from 'next/font/google';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircleIndicator } from './Color/picker';

const MaskedCanvas = ({ canvasRef, image, reset, maskMode = true }) => {

    const isDrawingRef = useRef(false);
    const isErasingRef = useRef(false);
    // const [isDrawing, setIsDrawing] = useState(false);
    // const [isErasing, setIsErasing] = useState(false);
    const [brushSize, setBrushSize] = useState(100);
    const brushSizeRef = useRef(brushSize);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [image?.width, image?.height, reset]);

    useEffect(() => {
        brushSizeRef.current = brushSize;
    }, [brushSize]);

    const startDrawing = (e) => {
        if (e.button === 2) {
            isErasingRef.current = true;
        } else {
            isDrawingRef.current = true;
        }
        draw(e);
    };

    const stopDrawing = () => {
        isDrawingRef.current = false;
        isErasingRef.current = false;
    };

    const draw = (e) => {
        const isDrawing = isDrawingRef.current;
        const isErasing = isErasingRef.current;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });

        if ((!isDrawing && !isErasing)) return;

        const ctx = canvas.getContext('2d');

        ctx.globalCompositeOperation = isErasing ? 'source-over' : 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSizeRef.current / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    const handleWheel = (e) => {
        e.preventDefault()
        const speed = 1 / 10
        const newBrushSize = Math.floor(Math.max(10, Math.min(200, brushSizeRef.current - e.deltaY * speed)))
        brushSizeRef.current = newBrushSize
        setBrushSize(newBrushSize)
    };

    // Only trigger when maskMode, so other canvas can listen too
    useEffect(() => {
        if (maskMode) {
            const canvas = canvasRef.current;
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('contextmenu', (e) => e.preventDefault());
            canvas.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mouseup', stopDrawing);
                canvas.removeEventListener('mouseout', stopDrawing);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('contextMenu', (e) => e.preventDefault());
                canvas.removeEventListener('wheel', handleWheel);

            };
        }
    }, [maskMode, canvasRef]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className={`max-w-full h-auto cursor-crosshair absolute top-0 left-0 ${!maskMode ? 'pointer-events-none' : ''}`}
                // onMouseDown={startDrawing}
                // onMouseUp={stopDrawing}
                // onMouseOut={stopDrawing}
                // onMouseMove={draw}
                // onContextMenu={(e) => e.preventDefault()}
                style={{ opacity: maskMode ? 0.6 : 0 }}
            />
            {/* <div className='absolute' style={{ top: mousePosition.y, left: mousePosition.x }}></div> */}
            {maskMode && <CircleIndicator position={mousePosition} diameter={brushSize} color={'white'} border_width={1} />}
            {maskMode && <CircleIndicator position={mousePosition} diameter={brushSize+2} color={'black'} />}
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