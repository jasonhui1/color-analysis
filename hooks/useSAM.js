import { invertImageAlpha } from "@/utils/canvas";
import { dataURLtoFile, loadBase64Image } from "@/utils/image";
import { useEffect, useState } from "react";

export default function useSAM() {
    const [images, setImages] = useState([]);
    const [enableIndex, setEnableIndex] = useState(-1);
    const [positions, setPositions] = useState([]);
    const [ignorePositions, setIgnorePositions] = useState([]);
    const [mode, setMode] = useState(false);

    // Test if  connected
    const [connected, setConnected] = useState(false);
    const [reconnectToggle, setReconnectToggle] = useState(false);

    const reset = () => {
        setImages([]);
        setEnableIndex(-1);
        setPositions([]);
        setIgnorePositions([]);
    }

    // Test if  connected
    useEffect(() => {
        // fetch('http://localhost:5000/api/hello')
        //     .then(response => response.json())
        //     .then(data => console.log(data))
        // If return ,  is connected

        setConnected(true);
    }, [reconnectToggle])

    const reconnect = () => {
        setReconnectToggle(state => !state);
    }


    const process = async (canvas,) => {
        // if (!file) return
        if (!canvas) return new Error('No canvas provided')
        if (positions.length === 0 && ignorePositions.length === 0) { console.log(': No position selected'); return }
        const dataURL = canvas.toDataURL('image/png');
        const file = dataURLtoFile(dataURL, `canvas.png`);
        const scale = 1

        // const file = imageFileRef.current
        // const scale = image.width / canvasRef.current.width
        const positivePosition = positions.map(([x, y]) => [x * scale, y * scale])
        const negativePosition = ignorePositions.map(([x, y]) => [x * scale, y * scale])

        const formData = new FormData()
        formData.append('image', file);
        formData.append('positions', JSON.stringify(positivePosition))
        formData.append('ignorePositions', JSON.stringify(negativePosition))

        setEnableIndex(-1);
        setImages([]);

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
            setImages(maskedImages)

        } catch (error) {
            console.error('Error:', error)
        }
    }


    const onChangeIndex = async (index) => {
        setEnableIndex(index);
        // store as inverted in database
        const image = await invertImageAlpha(images[index]);
        return image
    }


    return {
        reset, images, setImages, enableIndex, onChangeIndex, positions, setPositions, ignorePositions, setIgnorePositions, mode, setMode,
        process, reconnect, connected
    };
}
