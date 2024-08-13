import { dataURLtoFile, loadBase64Image } from "@/utils/image";
import { useEffect, useState } from "react";

export default function useSAM() {
    const [SAMImages, setSAMImages] = useState([]);
    const [SAMEnableIndex, setSAMEnableIndex] = useState(-1);
    const [SAMPositions, setSAMPositions] = useState([]);
    const [SAMIgnorePositions, setSAMIgnorePositions] = useState([]);
    const [SAMMode, setSAMMode] = useState(false);

    // Test if SAM connected
    const [SAMconnected, setSAMConnected] = useState(false);
    const [SAMreconnect, setSAMReconnect] = useState(false);

    const resetSAM = () => {
        setSAMImages([]);
        setSAMEnableIndex(-1);
        setSAMPositions([]);
        setSAMIgnorePositions([]);
    }

    // Test if SAM connected
    useEffect(() => {
        // fetch('http://localhost:5000/api/hello')
        //     .then(response => response.json())
        //     .then(data => console.log(data))
        // If return , SAM is connected

        setSAMConnected(true);
    }, [SAMreconnect])

    const reconnectSAM = () => {
        setSAMReconnect(state => !state);
    }


    const processSAM = async (canvas,) => {
        // if (!file) return
        if (!canvas) return
        if (SAMPositions.length === 0 && SAMIgnorePositions.length === 0) { console.log('SAM: No position selected'); return }
        const dataURL = canvas.toDataURL('image/png');
        const file = dataURLtoFile(dataURL, `canvas.png`);
        const scale = 1

        // const file = imageFileRef.current
        // const scale = image.width / canvasRef.current.width
        const positivePosition = SAMPositions.map(([x, y]) => [x * scale, y * scale])
        const negativePosition = SAMIgnorePositions.map(([x, y]) => [x * scale, y * scale])

        const formData = new FormData()
        formData.append('image', file);
        formData.append('positions', JSON.stringify(positivePosition))
        formData.append('ignorePositions', JSON.stringify(negativePosition))

        setSAMEnableIndex(-1);
        setSAMImages([]);

        try {
            const response = await fetch('http://localhost:5000/api/process-image', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()
            if (!data.images) throw new Error('No images in response')
            const maskedImages = await Promise.all(data.images.map(loadBase64Image));
            setSAMImages(maskedImages)

        } catch (error) {
            console.error('Error:', error)
        }
    }

    return {
        resetSAM, SAMImages, setSAMImages, SAMEnableIndex, setSAMEnableIndex, SAMPositions, setSAMPositions, SAMIgnorePositions, setSAMIgnorePositions, SAMMode, setSAMMode,
        processSAM, reconnectSAM, SAMconnected
    };
}
