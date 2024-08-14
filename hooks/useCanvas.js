import { useEffect, useRef, useState } from "react";

export default function useCanvas() {
    const ref = useRef(null);
    const [reset, setReset] = useState(false);
    const [drawingComplete, setDrawingComplete] = useState(false);

    useEffect(() => {
        if (drawingComplete) {
            setDrawingComplete(false); // Reset the flag for future drawings
        }
    }, [drawingComplete]);

    const update = () => {
        setReset(state => !state);
    };

    return { ref, reset, drawingComplete, setDrawingComplete, update };

}