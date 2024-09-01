import useCanvas from "@/hooks/useCanvas";
import { useMaskUI } from "@/hooks/useMaskUI";
import { useEffect, useState } from "react";
import { MaskEnableButton } from "./Canvas/MaskUI";
import { replaceCanvasColor } from "@/utils/canvas";
import CanvasArea from "./Canvas/CanvasArea";
import { useColorContext } from "@/context/color";

const ImageDisplay = ({ setSelectedColor,
    replacePalette = null, enableReplacePalette = false, onlyHighlightMask = true,
    maxSize = 640
}) => {

    const BaseCanvas = useCanvas()
    const MaskCanvas = useCanvas()
    const HLCanvas = useCanvas()
    const SobelCanvas = useCanvas()

    const { enableMask, setEnableMask } = useMaskUI();
    const [enableSobel, setEnableSobel] = useState(false);

    const { colorPalette } = useColorContext();


    useEffect(() => {
        if (MaskCanvas.drawingComplete && enableMask) BaseCanvas.update()
    }, [MaskCanvas.drawingComplete]);

    useEffect(() => {
        BaseCanvas.update()
    }, [replacePalette, enableReplacePalette]);

    const extraDrawing = () => {
        if (!enableReplacePalette) return
        replaceCanvasColor(BaseCanvas.ref.current, colorPalette, replacePalette)
    }

    return (
        <div className="flex flex-col gap-3 min-w-fit">
            <div className="mb-4 relative  ">
                <CanvasArea Canvas_={BaseCanvas} MaskCanvas={MaskCanvas} HLCanvas={HLCanvas} SobelCanvas_={SobelCanvas}
                    enableMask={enableMask} enableSobel={enableSobel} onlyHighlightMask={onlyHighlightMask}
                    setSelectedColor={setSelectedColor} 
                    maxSize={maxSize}
                    extraDrawing={extraDrawing}
                />
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