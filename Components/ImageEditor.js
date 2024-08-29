import useCanvas from "@/hooks/useCanvas";
import { useMaskUI } from "@/hooks/useMaskUI";
import useSAM from "@/hooks/useSAM";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas/Canvas";
import HighlightHoveringColorCanvas from "./Canvas/FilterCanvas";
import MaskedCanvas from "./Canvas/MaskedCanvas";
import SAMCanvas from "./Canvas/SAMCanvas";
import FileUpload from "./Form/FileUpload";
import SobelCanvas from "./Canvas/SobelCanvas";
import { useImageContext } from "@/context/image";
import { useMainCanvasContext } from "@/context/mainCanvas";
import { useColorContext } from "@/context/color";
import ImageEditorUI from "./ImageEditorUI";

const ImageEditor = ({
    onImageSelected,
    setSelectedColor,
    invertMask, setInvertMask,
    onlyHighlightMask,
    maxSize = 640
}) => {

    const { canvasRef, maskCanvasRef } = useMainCanvasContext();
    const [canvas, maskCanvas] = [canvasRef.current, maskCanvasRef.current];

    const { reset: canvasReset, drawingComplete, setDrawingComplete, update: updateCanvas } = useCanvas()
    const { reset: maskReset, drawingComplete: maskDrawingComplete, setDrawingComplete: setMaskDrawingComplete, update: updateMaskCanvas } = useCanvas()
    const { ref: highlightCanvasRef, reset: highlightReset, drawingComplete: HighlightDrawingComplete, setDrawingComplete: setHighlightDrawingComplete, update: updateHighlightCanvas } = useCanvas()
    const { ref: SAMCanvasRef, reset: SAMReset, update: updateSAMCanvas } = useCanvas()
    const { ref: sobelCanvasRef, reset: sobelReset, update: updateSobelCanvas } = useCanvas()

    const { colorPalette, ignorePalette, hoveringColor } = useColorContext();

    const { image, setImage, maskImage, setMaskImage } = useImageContext();

    const fileDropRef = useRef(null);
    const { enableMask, setEnableMask, maskMode, setMaskMode, reset: resetMaskUI } = useMaskUI();
    const [enableSobel, setEnableSobel] = useState(false);

    const SAM = useSAM();

    const [sobelColorSpace, setSobelColorSpace] = useState('rgb');


    useEffect(() => {
        if (drawingComplete) updateSobelCanvas()
    }, [drawingComplete]);

    useEffect(() => {
        if (maskDrawingComplete && enableMask) updateCanvas()
    }, [maskDrawingComplete]);



    const handleImageSelection = (img, file, url) => {
        setImage(img);
        setMaskImage(null);

        updateAllCanvas()
        resetMaskUI()
        SAM.resetSAM()

        onImageSelected(img, file, url)
    }

    const updateAllCanvas = () => {
        updateCanvas();
        updateMaskCanvas()
        updateSAMCanvas()
        updateSobelCanvas()
    }


    return (
        <div className="flex flex-col gap-3 min-w-fit">
            <div className="mb-4 relative  " ref={fileDropRef}  >
                {/* Drag and drop within the same dimension as canvas */}
                <div className={`${image ? 'absolute inset-0  pointer-events-none ' : ''} `} style={{ width: canvas?.width ?? maxSize + 'px', height: canvas?.height ?? maxSize + 'px' }}>
                    <FileUpload onImageSelected={handleImageSelection} imageSelected={image !== null} fileDropRef={fileDropRef} />
                </div>

                {/* Canvas Area */}
                {image &&
                    <>
                        <Canvas canvasRef={canvasRef} image={image} setDrawingComplete={setDrawingComplete} reset={canvasReset}
                            maskedImage={maskCanvas} maskMode={maskMode} enableMask={enableMask} invertMask={invertMask}
                            setSelectedColor={setSelectedColor}
                        />
                        <SobelCanvas canvasRef={sobelCanvasRef} reset={sobelReset} imageCanvas={canvas} enabled={enableSobel} colorSpace={sobelColorSpace} />
                        <MaskedCanvas canvasRef={maskCanvasRef} image={canvas} maskImage={maskImage} reset={maskReset} maskMode={maskMode}
                            setDrawingComplete={setMaskDrawingComplete}
                        />
                        <SAMCanvas canvasRef={SAMCanvasRef} image={canvas} reset={SAMReset} SAM={SAM} />
                        <HighlightHoveringColorCanvas canvasRef={highlightCanvasRef} imageCanvas={canvas} maskCanvas={maskCanvas} reset={highlightReset}
                            color={hoveringColor} colorPalette={colorPalette} ignorePalette={ignorePalette}
                            onlyInMask={onlyHighlightMask}
                        />

                    </>
                }
            </div>

            <ImageEditorUI
                enableMask={enableMask}
                invertMask={invertMask} setInvertMask={setInvertMask}
                maskMode={maskMode} setMaskMode={setMaskMode}
                SAM={SAM}
                setEnableMask={setEnableMask}
                enableSobel={enableSobel} setEnableSobel={setEnableSobel}
                updateCanvas={updateCanvas} updateMaskCanvas={updateMaskCanvas} updateAllCanvas={updateAllCanvas}
            />

        </div>
    )
}

export default ImageEditor


