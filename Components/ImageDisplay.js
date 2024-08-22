import useCanvas from "@/hooks/useCanvas";
import { useMaskUI } from "@/hooks/useMaskUI";
import { useEffect, useState } from "react";
import { MaskEnableButton, MaskUI } from "./Canvas/MaskUI";
import Canvas from "./Canvas/Canvas";
import HighlightHoveringColorCanvas from "./Canvas/FilterCanvas";
import MaskedCanvas from "./Canvas/MaskedCanvas";
import SobelCanvas from "./Canvas/SobelCanvas";
import ToggleComponent from "./General/ToggleComponent";

const ImageDisplay = ({ canvasRef, maskedCanvasRef,
    image, maskImage,
    hoveringColor, setSelectedColor,
    colorPalette, ignorePalette,
    onlyHighlightMask,
    maxSize = 640
}) => {

    const { reset: canvasReset, drawingComplete, setDrawingComplete, update: updateCanvas } = useCanvas()
    const { reset: maskReset, drawingComplete: maskDrawingComplete, setDrawingComplete: setMaskDrawingComplete, update: updateMaskCanvas } = useCanvas()
    const { ref: highlightCanvasRef, reset: highlightReset, drawingComplete: HighlightDrawingComplete, setDrawingComplete: setHighlightDrawingComplete, update: updateHighlightCanvas } = useCanvas()
    const { ref: sobelCanvasRef, reset: sobelReset, update: updateSobelCanvas } = useCanvas()

    const { enableMask, setEnableMask } = useMaskUI();
    const [enableSobel, setEnableSobel] = useState(false);

    useEffect(() => {
        if (maskDrawingComplete && enableMask) updateCanvas()
    }, [maskDrawingComplete]);


    useEffect(() => {
        if (drawingComplete) updateSobelCanvas()
    }, [drawingComplete]);

    return (
        <div className="flex flex-col gap-3 min-w-fit">
            <div className="mb-4 relative  ">
                {/* Canvas Area */}
                {image &&
                    <>
                        <Canvas canvasRef={canvasRef} image={image} setDrawingComplete={setDrawingComplete} reset={canvasReset}
                            maskedImage={maskedCanvasRef.current} enableMask={enableMask}
                            setSelectedColor={setSelectedColor}
                            maxSize={maxSize}
                        />
                        <SobelCanvas canvasRef={sobelCanvasRef} reset={sobelReset} imageCanvas={canvasRef?.current} enabled={enableSobel} colorSpace={'rgb'} />

                        <MaskedCanvas canvasRef={maskedCanvasRef} image={canvasRef?.current} maskImage={maskImage} reset={maskReset}
                            setDrawingComplete={setMaskDrawingComplete}
                        />
                        <HighlightHoveringColorCanvas canvasRef={highlightCanvasRef} imageCanvas={canvasRef?.current} maskCanvas={maskedCanvasRef?.current} onlyInMask={onlyHighlightMask}
                            reset={highlightReset}
                            color={hoveringColor} colorPalette={colorPalette} ignorePalette={ignorePalette} />
                    </>
                }
            </div>
            <div className="flex gap-4 items-center">
                <span> Mask</span><MaskEnableButton enableMask={enableMask} setEnableMask={setEnableMask} />
            </div>
            <div className="flex gap-4 items-center">
                <span> Sobel</span><MaskEnableButton enableMask={enableSobel} setEnableMask={setEnableSobel} />
            </div>

        </div>
    )
}

export default ImageDisplay