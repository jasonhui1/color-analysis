import { useImageContext } from "@/context/image";
import { useMainCanvasContext } from "@/context/mainCanvas";
import { exportCanvasImage, processCanvas } from "@/utils/canvas";
import { loadImage } from "@/utils/image";
import { useState } from "react";
import { MaskUI, MaskEnableButton } from "./Canvas/MaskUI";
import SAMUI from "./Canvas/SAMUI";
import CheckBox from "./General/CheckBox";
import ToggleComponent from "./General/ToggleComponent";

export default function ImageEditorUI({
    enableMask, setEnableMask,
    invertMask, setInvertMask,
    maskMode, setMaskMode,
    SAM,
    enableSobel, setEnableSobel,

    updateCanvas, updateMaskCanvas, updateAllCanvas,
}) {

    const { canvasRef, maskCanvasRef } = useMainCanvasContext();
    const [canvas, maskCanvas] = [canvasRef.current, maskCanvasRef.current];
    const { image, setImage, maskImage, setMaskImage } = useImageContext()
    const [exportUseMask, setExportUseMask] = useState(false);

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

        updateAllCanvas()
        SAM.reset()
        setEnableMask(false)
        setEnableSobel(false)
    }

    const onClickSAMIndex = async (index) => {
        const SAMMask = await SAM.onChangeIndex(index)

        setMaskImage(SAMMask);
        updateMaskCanvas();
        setEnableMask(true);
        if (!SAM.mode) {
            updateCanvas()
        }
    }


    return (
        <>
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

        </>
    );
}