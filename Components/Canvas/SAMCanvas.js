import React, { useCallback, useEffect, useRef, useState } from 'react';
import { calculateCanvasSize } from '../../utils/canvas';
import { CircleIndicator } from '../Color/PositionIndicators';

const SAMCanvas = ({ canvasRef, image, reset, SAM,
    displayRadius = 20, maxSize = 640,
}) => {

    const {mode: maskMode, images = [], enableIndex = -1, positions, setPositions, ignorePositions, setIgnorePositions, } = SAM

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const mousePositionRef = useRef(null);

    useEffect(() => {
        mousePositionRef.current = mousePosition
    }, [mousePosition])

    useEffect(() => {
        if (enableIndex === -1 || (images && images.length) === 0) return

        if (canvasRef.current) {
            const image = images[enableIndex]

            const canvas = canvasRef.current;
            let ctx = canvas.getContext("2d");

            const { width, height } = calculateCanvasSize(image, maxSize);
            canvas.width = width;
            canvas.height = height;

            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, 0, 0, width, height);
            // setDrawingComplete(true)
        }
    }, [enableIndex])

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            // ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [image?.width, image?.height, reset]);

    const getMousePosition = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }


    const addPositions = (e, positive = true) => {
        const { x, y } = getMousePosition(e)

        // SAM 0 and 1 (include/ exclude)
        if (positive) {
            setPositions(positions => [...positions, [x, y]])
        } else {
            setIgnorePositions(positions => [...positions, [x, y]])
        }
    }

    const removePosition = (e) => {
        let { x, y } = mousePositionRef.current;

        const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        const checkFilter = (position) => distance(x, y, position[0], position[1]) < displayRadius

        setPositions(positions => positions.filter(position => !checkFilter(position)))
        setIgnorePositions(positions => positions.filter(position => !checkFilter(position)))
    }

    const onLeftClick = (e) => {
        addPositions(e, true)
    }


    const onRightClick = (e) => {
        e.preventDefault()
        addPositions(e, false)
    }

    const onMiddleClick = (e) => {
        e.preventDefault()
        removePosition(e)
    }

    const onMouseDown = (e) => {
        if (e.button === 0) { // Left mouse button{
            onLeftClick(e)
        } else if (e.button === 2) { // Right mouse button
            onRightClick(e)
        } else if (e.button === 1) { // Middle mouse button
            onMiddleClick(e)
        }
    }

    // Handler for key press as an alternative to middle mouse button
    const onKeyPress = (e) => {
        console.log('e.key :>> ', e.key);
        if (e.key === 'w' || e.key === 'W') { // Key "M" or "m"
            onMiddleClick(e);
        }
    };

    const onMouseMove = (e) => {
        setMousePosition(getMousePosition(e))
    }

    // Only trigger when maskMode, so other canvas can listen too
    useEffect(() => {
        if (maskMode) {
            const canvas = canvasRef.current;
            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('contextmenu', (e) => e.preventDefault());;
            document.addEventListener('keydown', onKeyPress);;

            return () => {
                canvas.removeEventListener('mousedown', onMouseDown);
                canvas.removeEventListener('mousemove', onMouseMove);
                canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
                document.removeEventListener('keydown', onKeyPress);

            };
        }
    }, [maskMode, canvasRef]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className={`max-w-full h-auto cursor-crosshair absolute top-0 left-0 ${!maskMode ? 'pointer-events-none' : ''}`}
                style={{ opacity: maskMode ? 0.2 : 0 }}
            />
            {maskMode &&
                <>
                    {positions && positions.map((position, index) => <CircleIndicator key={index} position={{ x: position[0], y: position[1] }} diameter={displayRadius} color={'green'} />)}
                    {ignorePositions && ignorePositions.map((position, index) => <CircleIndicator key={index} position={{ x: position[0], y: position[1] }} diameter={displayRadius} color={'red'} />)}
                </>
            }

        </>
    );
};

export default SAMCanvas;