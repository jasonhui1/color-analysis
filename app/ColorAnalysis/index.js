import React, { useState, useRef, useEffect } from "react";

import HighlightHoveringColorCanvas, { processImageColors } from "../../Components/Canvas/FilterCanvas";

import GoogleLogin from "../../Components/Auth/GoogleLogin";
import Canvas from "../../Components/Canvas/Canvas";
import FileUpload from "../../Components/Form/FileUpload";
import MaskedCanvas from "../../Components/Canvas/MaskedCanvas";

import { Form } from "../../Components/Form/Form";
import { MaskUI } from "../../Components/Canvas/MaskUI";
import SAMCanvas from "../../Components/Canvas/SAMCanvas";
import { invertImageAlpha, processCanvas } from "../../utils/canvas";
import { ColorPicker, TriangularColorPickerDisplayColors } from "@/Components/Color/picker";
import useCanvas from "@/hooks/useCanvas";
import useSAM from "@/hooks/useSAM";
import { useMaskUI } from "@/hooks/useMaskUI";
import { useColorPalette } from "@/hooks/useColorPalette";
import { loadImage } from "@/utils/image";


const ColorAnalysis = () => {
    const { canvasRef, reset, drawingComplete, setDrawingComplete, updateCanvas } = useCanvas()
    const { canvasRef: maskedCanvasRef, reset: maskReset, drawingComplete: maskDrawingComplete, setDrawingComplete: setMaskDrawingComplete, updateCanvas: updateMaskCanvas } = useCanvas()
    const { canvasRef: highlightCanvasRef, reset: highlightReset, drawingComplete: HighlightDrawingComplete, setDrawingComplete: setHighlightDrawingComplete, updateCanvas: updateHighlightCanvas } = useCanvas()
    const { canvasRef: SAMCanvasRef, reset: SAMReset, updateCanvas: updateSAMCanvas } = useCanvas()

    const fileDropRef = useRef(null);

    const [image, setImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const imageFileRef = useRef(null);
    const [imageSourceURL, setImageSourceURL] = useState('');

    //Resets, use canvas hook
    const [formReset, setFormReset] = useState(false);
    const { colorPalette, ignorePalette, selectedColor, hoveringColor,
        setColorPalette, setIgnorePalette, setSelectedColor,
        onPaletteColorHover, onPaletteColorUnHover, onPaletteColorDelete, onPaletteColorClick } = useColorPalette({ onUnhover: updateHighlightCanvas });

    const { maskMode, setMaskMode, enableMask, setEnableMask, invertMask, setInvertMask, resetMaskUI } = useMaskUI();

    const { resetSAM, SAMImages, setSAMImages,
        SAMEnableIndex, setSAMEnableIndex,
        SAMPositions, setSAMPositions,
        SAMIgnorePositions, setSAMIgnorePositions,
        SAMMode, setSAMMode,
        reconnectSAM, SAMconnected, processSAM
    } = useSAM();


    useEffect(() => {
        if (maskDrawingComplete && enableMask) updateCanvas()
    }, [maskDrawingComplete]);


    const onImageSelected = (img, file) => {
        imageFileRef.current = file
        setImage(img);
        setMaskImage(null);

        setFormReset(!reset);
        resetMaskUI()
        updateCanvas();
        updateMaskCanvas()

        resetSAM()
        updateSAMCanvas()
    }

    const onChangeMaskMode = () => {
        setMaskMode(!maskMode)
        if (maskMode) setEnableMask(true)
    };

    const onApplyMask = async () => {

        const maskUrl = processCanvas({ canvas: maskedCanvasRef?.current, image, cropTransparent: true, useCurrentCanvas: true, isInverted: !invertMask });
        const croppedMaskImage = await loadImage(maskUrl);

        const url = processCanvas({ canvas: canvasRef?.current, image, cropTransparent: true, useCurrentCanvas: false });
        const croppedImage = await loadImage(url);


        setMaskImage(croppedMaskImage);
        updateMaskCanvas()

        setImage(croppedImage);
        setEnableMask(false)
        updateCanvas()
        resetSAM()
    }

    const onClickSAMIndex = async (index) => {
        setSAMEnableIndex(index);
        const maskSAMImage = await invertImageAlpha(SAMImages[index]);

        setMaskImage(maskSAMImage);
        setEnableMask(true);
        updateMaskCanvas();
        if (!SAMMode) {
            updateCanvas()
        }
    }


    return (
        <div className="p-4">
            <GoogleLogin />
            <h1 className="text-2xl font-bold mb-4">
                Color Analysis
            </h1>

            {/* {image && ( */}
            <div className="flex flex-row gap-6 relative mb-3 " >
                <div className="flex flex-col gap-3 min-w-fit">
                    <div className="mb-4 relative  " ref={fileDropRef}  >

                        {/* Drag and drop within the same dimension as canvas */}
                        <div className={`${image ? 'absolute inset-0  pointer-events-none ' : ''} `} style={{ width: canvasRef?.current?.width ?? '720' + 'px', height: canvasRef?.current?.height ?? '720' + 'px' }}>
                            <FileUpload onImageSelected={onImageSelected} imageSelected={image !== null} fileDropRef={fileDropRef} setImageSourceURL={setImageSourceURL} />
                        </div>
                        {image &&
                            <>
                                <Canvas canvasRef={canvasRef} image={image} setDrawingComplete={setDrawingComplete} reset={reset}
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
                                <HighlightHoveringColorCanvas canvasRef={highlightCanvasRef} imageCanvas={canvasRef?.current} maskCanvas={maskedCanvasRef?.current} onlyInMask={true}
                                    reset={highlightReset}
                                    color={hoveringColor} colorPalette={colorPalette} ignorePalette={ignorePalette} />
                            </>
                        }
                    </div>
                    <MaskUI maskMode={maskMode} onChangeMaskMode={onChangeMaskMode}
                        enableMask={enableMask} setEnableMask={setEnableMask}
                        invertMask={invertMask} setInvertMask={setInvertMask}
                        onSAMIndexClick={onClickSAMIndex} SAMImages={SAMImages}
                        processSAM={() => processSAM(canvasRef?.current)}
                        onApplyMask={onApplyMask} />

                    <button onClick={() => setSAMMode(!SAMMode)} className="bg-gray-200 px-2 py-1 rounded-md cursor-pointer text-sm">SAM Mode : {!SAMMode ? 'Enter' : 'Leave'}</button>


                </div>

                <ColorPicker selectedColor={{ r: selectedColor[0], g: selectedColor[1], b: selectedColor[2] }} isRGBSpace={true} />

                <Form
                    canvas={canvasRef?.current} maskCanvas={maskedCanvasRef?.current} invertMask={invertMask} hoveringColor={hoveringColor}
                    image={image}
                    imageSourceURL={imageSourceURL}
                    onPaletteColorDelete={onPaletteColorDelete}
                    onPaletteColorHover={onPaletteColorHover}
                    onPaletteColorUnHover={onPaletteColorUnHover}
                    selectedColor={selectedColor}
                    setImageSourceURL={setImageSourceURL}
                    setSelectedColor={setSelectedColor}
                    colorPalette={colorPalette} setColorPalette={setColorPalette}
                    ignorePalette={ignorePalette} setIgnorePalette={setIgnorePalette}
                    formReset={formReset}
                />
            </div>

        </div>
    );
};
export default ColorAnalysis;
