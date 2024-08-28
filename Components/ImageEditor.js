import useCanvas from "@/hooks/useCanvas";
import { useMaskUI } from "@/hooks/useMaskUI";
import useSAM from "@/hooks/useSAM";
import { useEffect, useRef, useState } from "react";
import { loadImage } from "@/utils/image";
import { MaskEnableButton, MaskUI } from "./Canvas/MaskUI";
import Canvas from "./Canvas/Canvas";
import HighlightHoveringColorCanvas from "./Canvas/FilterCanvas";
import MaskedCanvas from "./Canvas/MaskedCanvas";
import SAMCanvas from "./Canvas/SAMCanvas";
import FileUpload from "./Form/FileUpload";
import CheckBox from "./General/CheckBox";
import ToggleComponent from "./General/ToggleComponent";
import SAMUI from "./Canvas/SAMUI";
import SobelCanvas from "./Canvas/SobelCanvas";
import { useImageContext } from "@/context/image";
import { useMainCanvasContext } from "@/context/mainCanvas";
import { useColorContext } from "@/context/color";
import { exportCanvasImage, processCanvas } from "@/utils/canvas";

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

    const SAM = useSAM();

    const [enableSobel, setEnableSobel] = useState(false);
    const [sobelColorSpace, setSobelColorSpace] = useState('rgb');

    const [exportUseMask, setExportUseMask] = useState(false);


    useEffect(() => {
        if (drawingComplete) updateSobelCanvas()
    }, [drawingComplete]);

    useEffect(() => {
        if (maskDrawingComplete && enableMask) updateCanvas()
    }, [maskDrawingComplete]);

    const onClickSAMIndex = async (index) => {
        const SAMMask = await SAM.onChangeIndex(index)

        setMaskImage(SAMMask);
        updateMaskCanvas();
        setEnableMask(true);
        if (!SAM.mode) {
            updateCanvas()
        }
    }

    const exportAndOpenImage = async (useMask = false) => {
        const url = await exportCanvasImage({ canvas: canvas, maskCanvas: maskCanvas, image, useMask });

        // Open the URL in a new tab
        window.open(url, '_blank');
        // Clean up the URL object after a delay
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    };

    const onApplyMask = async () => {
        const url = processCanvas({ canvas: canvas, image, cropTransparent: true, useCurrentCanvas: false });
        const maskUrl = processCanvas({ canvas: maskCanvas, image, cropTransparent: true, useCurrentCanvas: true, isInverted: !invertMask });

        const [croppedImage, croppedMaskImage] = await Promise.all([
            loadImage(url),
            loadImage(maskUrl)
        ]);

        setImage(croppedImage);
        setMaskImage(croppedMaskImage);

        resetAllCanvas()
        SAM.resetSAM()
        setEnableMask(false)
        setEnableSobel(false)

    }

    const handleImageSelection = (img, file, url) => {
        setImage(img);
        setMaskImage(null);

        resetAllCanvas()
        resetMaskUI()
        SAM.resetSAM()

        onImageSelected(img, file, url)
    }

    const resetAllCanvas = () => {
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
            {/* Use Context later? */}
            <MaskUI maskMode={maskMode} setMaskMode={setMaskMode}
                enableMask={enableMask} setEnableMask={setEnableMask}
                invertMask={invertMask} setInvertMask={setInvertMask}
                onApplyMask={onApplyMask} />

            <ToggleComponent label="SAM" >
                <SAMUI canvas={canvas} SAM={SAM} onClickIndex={onClickSAMIndex} />
            </ToggleComponent>

            <ToggleComponent label="Filter" >
                <div className="flex flex-row gap-3">
                    <MaskEnableButton enableMask={enableSobel} setEnableMask={setEnableSobel} />
                </div>
            </ToggleComponent>
            <ToggleComponent label="Export image" >
                <>
                    <CheckBox checked={exportUseMask} onChange={() => setExportUseMask(!exportUseMask)} label="Use Mask" />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => exportAndOpenImage(exportUseMask)}>Export and Open Image</button>
                </>
            </ToggleComponent>

        </div>
    )
}

export default ImageEditor