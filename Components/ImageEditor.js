import useCanvas from "@/hooks/useCanvas";
import { useMaskUI } from "@/hooks/useMaskUI";
import useSAM from "@/hooks/useSAM";
import { useEffect, useRef } from "react";
import { invertImageAlpha, processCanvas } from "@/utils/canvas";
import { loadImage } from "@/utils/image";
import { MaskUI } from "./Canvas/MaskUI";
import Canvas from "./Canvas/Canvas";
import HighlightHoveringColorCanvas from "./Canvas/FilterCanvas";
import MaskedCanvas from "./Canvas/MaskedCanvas";
import SAMCanvas from "./Canvas/SAMCanvas";
import FileUpload from "./Form/FileUpload";
import CheckBox from "./General/CheckBox";
import ToggleComponent from "./General/ToggleComponent";
import SAMUI from "./Canvas/SAMUI";

const ImageEditor = ({ canvasRef, maskedCanvasRef,
    image, setImage, maskImage, setMaskImage, onImageSelected,
    hoveringColor, setSelectedColor, colorPalette, ignorePalette,
    invertMask, setInvertMask,
    onlyHighlightMask
}) => {

    const { reset: canvasReset, drawingComplete, setDrawingComplete, update: updateCanvas } = useCanvas()
    const { reset: maskReset, drawingComplete: maskDrawingComplete, setDrawingComplete: setMaskDrawingComplete, update: updateMaskCanvas } = useCanvas()
    const { ref: highlightCanvasRef, reset: highlightReset, drawingComplete: HighlightDrawingComplete, setDrawingComplete: setHighlightDrawingComplete, update: updateHighlightCanvas } = useCanvas()
    const { ref: SAMCanvasRef, reset: SAMReset, update: updateSAMCanvas } = useCanvas()

    const fileDropRef = useRef(null);
    const { enableMask, setEnableMask, maskMode, setMaskMode, reset: resetMaskUI } = useMaskUI();

    const { resetSAM, SAMImages,
        SAMEnableIndex, setSAMEnableIndex,
        SAMPositions, setSAMPositions,
        SAMIgnorePositions, setSAMIgnorePositions,
        SAMMode, setSAMMode,
        reconnectSAM, SAMconnected, processSAM
    } = useSAM();


    useEffect(() => {
        if (maskDrawingComplete && enableMask) updateCanvas()
    }, [maskDrawingComplete]);

    const onClickSAMIndex = async (index) => {
        setSAMEnableIndex(index);
        const maskSAMImage = await invertImageAlpha(SAMImages[index]);

        setMaskImage(maskSAMImage);
        updateMaskCanvas();
        setEnableMask(true);
        if (!SAMMode) {
            updateCanvas()
        }
    }

    const onApplyMask = async () => {
        const url = processCanvas({ canvas: canvasRef?.current, image, cropTransparent: true, useCurrentCanvas: false });
        const maskUrl = processCanvas({ canvas: maskedCanvasRef?.current, image, cropTransparent: true, useCurrentCanvas: true, isInverted: !invertMask });

        const croppedImage = await loadImage(url);
        const croppedMaskImage = await loadImage(maskUrl);

        setImage(croppedImage);
        setMaskImage(croppedMaskImage);

        updateCanvas()
        updateMaskCanvas()

        resetSAM()
        setEnableMask(false)
    }

    const handleImageSelection = (img, file, url) => {
        setImage(img);
        setMaskImage(null);

        updateCanvas();
        updateMaskCanvas()
        updateSAMCanvas()

        resetMaskUI()
        resetSAM()

        onImageSelected(img, file, url)
    }

    const maxSize = 640



    return (
        <div className="flex flex-col gap-3 min-w-fit">
            <div className="mb-4 relative  " ref={fileDropRef}  >
                {/* Drag and drop within the same dimension as canvas */}
                <div className={`${image ? 'absolute inset-0  pointer-events-none ' : ''} `} style={{ width: canvasRef?.current?.width ?? maxSize + 'px', height: canvasRef?.current?.height ?? maxSize + 'px' }}>
                    <FileUpload onImageSelected={handleImageSelection} imageSelected={image !== null} fileDropRef={fileDropRef} />
                </div>

                {/* Canvas Area */}
                {image &&
                    <>
                        <Canvas canvasRef={canvasRef} image={image} setDrawingComplete={setDrawingComplete} reset={canvasReset}
                            maskedImage={maskedCanvasRef.current} maskMode={maskMode} enableMask={enableMask} invertMask={invertMask}
                            setSelectedColor={setSelectedColor}
                            SAMImage={SAMCanvasRef.current} SAMMode={SAMMode} maskDrawingComplete={maskDrawingComplete}
                        />
                        <MaskedCanvas canvasRef={maskedCanvasRef} image={canvasRef?.current} maskImage={maskImage} reset={maskReset} maskMode={maskMode}
                            setDrawingComplete={setMaskDrawingComplete}
                        />
                        <SAMCanvas canvasRef={SAMCanvasRef} image={canvasRef?.current} reset={SAMReset} maskMode={SAMMode}
                            SAMPositions={SAMPositions} setSAMPositions={setSAMPositions}
                            SAMIgnorePositions={SAMIgnorePositions} setSAMIgnorePositions={setSAMIgnorePositions}
                            SAMImages={SAMImages} SAMEnableIndex={SAMEnableIndex}
                        />
                        <HighlightHoveringColorCanvas canvasRef={highlightCanvasRef} imageCanvas={canvasRef?.current} maskCanvas={maskedCanvasRef?.current} onlyInMask={onlyHighlightMask}
                            reset={highlightReset}
                            color={hoveringColor} colorPalette={colorPalette} ignorePalette={ignorePalette} />
                    </>
                }
            </div>
            {/* Use Context later? */}
            <MaskUI maskMode={maskMode} setMaskMode={setMaskMode}
                enableMask={enableMask} setEnableMask={setEnableMask}
                invertMask={invertMask} setInvertMask={setInvertMask}
                onApplyMask={onApplyMask} />

            <ToggleComponent label="SAM" >
                <SAMUI SAMMode={SAMMode} setSAMMode={setSAMMode} SAMImages={SAMImages}
                    processSAM={() => processSAM(canvasRef?.current)} onClickSAMIndex={onClickSAMIndex}

                />
            </ToggleComponent>
        </div>
    )
}

export default ImageEditor