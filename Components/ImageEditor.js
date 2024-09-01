import useCanvas from "@/hooks/useCanvas";
import { useMaskUI } from "@/hooks/useMaskUI";
import useSAM from "@/hooks/useSAM";
import { useRef, useState } from "react";
import FileUpload from "./Form/FileUpload";
import { useImageContext } from "@/context/image";
import { useMainCanvasContext } from "@/context/mainCanvas";
import ImageEditorUI from "./ImageEditorUI";
import CanvasArea from "./Canvas/CanvasArea";

const ImageEditor = ({
    onImageSelected,
    setSelectedColor,
    invertMask, setInvertMask,
    onlyHighlightMask,
    maxSize = 640
}) => {

    const { canvasRef, maskCanvasRef } = useMainCanvasContext();
    const [canvas, maskCanvas] = [canvasRef.current, maskCanvasRef.current];

    const BaseCanvas = useCanvas()
    BaseCanvas.ref = canvasRef
    const MaskCanvas = useCanvas()
    MaskCanvas.ref = maskCanvasRef

    const HLCanvas = useCanvas()
    const SobelCanvas = useCanvas()
    const SAMCanvas = useCanvas()

    const { image, setImage, maskImage, setMaskImage } = useImageContext();

    const fileDropRef = useRef(null);
    const { enableMask, setEnableMask, maskMode, setMaskMode, reset: resetMaskUI } = useMaskUI();
    const [enableSobel, setEnableSobel] = useState(false);

    const SAM = useSAM();
    const [sobelColorSpace, setSobelColorSpace] = useState('rgb');

    const handleImageSelection = (img, file, url) => {
        setImage(img);
        setMaskImage(null);

        updateAllCanvas()
        resetMaskUI()
        SAM.reset()

        onImageSelected(img, file, url)
    }

    const updateAllCanvas = () => {
        BaseCanvas.update()
        MaskCanvas.update()
        SobelCanvas.update()
        SAMCanvas.update()
    }


    return (
        <div className="flex flex-col gap-3 min-w-fit">
            <div className="mb-4 relative  " ref={fileDropRef}  >
                {/* Drag and drop within the same dimension as canvas */}
                <div className={`${image ? 'absolute inset-0  pointer-events-none ' : ''} `} style={{ width: canvas?.width ?? maxSize + 'px', height: canvas?.height ?? maxSize + 'px' }}>
                    <FileUpload onImageSelected={handleImageSelection} imageSelected={image !== null} fileDropRef={fileDropRef} />
                </div>

                <CanvasArea Canvas_={BaseCanvas} MaskCanvas={MaskCanvas} HLCanvas={HLCanvas} SobelCanvas_={SobelCanvas} sobelColorSpace={sobelColorSpace}
                    enableMask={enableMask} enableSobel={enableSobel} onlyHighlightMask={onlyHighlightMask}
                    inMaskMode={maskMode} invertMask={invertMask}
                    setSelectedColor={setSelectedColor}
                />


            </div>

            <ImageEditorUI
                enableMask={enableMask}
                invertMask={invertMask} setInvertMask={setInvertMask}
                maskMode={maskMode} setMaskMode={setMaskMode}
                SAM={SAM}
                setEnableMask={setEnableMask}
                enableSobel={enableSobel} setEnableSobel={setEnableSobel}
                updateCanvas={BaseCanvas.update} updateMaskCanvas={MaskCanvas.update} updateAllCanvas={updateAllCanvas}
            />

        </div>
    )
}

export default ImageEditor


