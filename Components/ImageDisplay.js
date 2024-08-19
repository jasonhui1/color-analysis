import useCanvas from "@/hooks/useCanvas";
import { useMaskUI } from "@/hooks/useMaskUI";
import { useEffect } from "react";
import { MaskEnableButton, MaskUI } from "./Canvas/MaskUI";
import Canvas from "./Canvas/Canvas";
import HighlightHoveringColorCanvas from "./Canvas/FilterCanvas";
import MaskedCanvas from "./Canvas/MaskedCanvas";

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

    const { enableMask, setEnableMask } = useMaskUI();

    useEffect(() => {
        if (maskDrawingComplete && enableMask) updateCanvas()
    }, [maskDrawingComplete]);

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

                        <MaskedCanvas canvasRef={maskedCanvasRef} image={canvasRef?.current} maskImage={maskImage} reset={maskReset}
                            setDrawingComplete={setMaskDrawingComplete}
                        />
                        <HighlightHoveringColorCanvas canvasRef={highlightCanvasRef} imageCanvas={canvasRef?.current} maskCanvas={maskedCanvasRef?.current} onlyInMask={onlyHighlightMask}
                            reset={highlightReset}
                            color={hoveringColor} colorPalette={colorPalette} ignorePalette={ignorePalette} />
                    </>
                }
            </div>
            <MaskEnableButton enableMask={enableMask} setEnableMask={setEnableMask} />

        </div>
    )
}

export default ImageDisplay