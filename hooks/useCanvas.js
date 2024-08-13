import { useEffect, useRef, useState } from "react";

export default function useCanvas() {
    const canvasRef = useRef(null);
    const [reset, setReset] = useState(false);
    const [drawingComplete, setDrawingComplete] = useState(false);

    useEffect(() => {
        if (drawingComplete) {
            setDrawingComplete(false); // Reset the flag for future drawings
        }
    }, [drawingComplete]);

    const updateCanvas = () => {
        setReset(state => !state);
    };

    return { canvasRef, reset, drawingComplete, setDrawingComplete, updateCanvas };

}