import React, { useState, useRef, useEffect } from "react";

import HighlightHoveringColorCanvas, { processImageColors } from "../../Components/Canvas/FilterCanvas";

import GoogleLogin from "../../Components/Auth/GoogleLogin";
import Canvas, { removedTransparentPixelsURL } from "../../Components/Canvas/Canvas";
import { HSLSlider, TriangularColorPickerDisplayColors } from "../../Components/Color/picker";
import FileUpload from "../../Components/Form/FileUpload";
import MaskedCanvas from "../../Components/Canvas/MaskedCanvas";
import { isColorEqual} from "../../utils/color";

import { Form } from "../../Components/Form/Form";
import { MaskUI } from "../../Components/Canvas/MaskUI";

const ColorAnalysis = () => {
    const canvasRef = useRef(null);
    const maskedCanvasRef = useRef(null);
    const highlightCanvasRef = useRef(null);
    const fileDropRef = useRef(null);

    const [selectedColor, setSelectedColor] = useState([0, 0, 0]);

    const [image, setImage] = useState(null);
    const [imageSourceURL, setImageSourceURL] = useState('');

    const [reset, setReset] = useState(false);
    const [maskReset, setMaskReset] = useState(false);
    const [highlightReset, setHighlightReset] = useState(false);
    const [formReset, setFormReset] = useState(false);

    const [maskMode, setMaskMode] = useState(false);
    const [enableMask, setEnableMask] = useState(false);
    const [invertMask, setInvertMask] = useState(false);
    const [colorPalette, setColorPalette] = useState([]);
    const [ignorePalette, setIgnorePalette] = useState([]);

    const [drawingComplete, setDrawingComplete] = useState(false);
    const [maskSelectDrawingComplete, setMaskSelectDrawingComplete] = useState(false);

    const [hoveringColor, setHoveringColor] = useState();

    useEffect(() => {
        if (drawingComplete) {
            setDrawingComplete(false); // Reset the flag for future drawings
            // if (!maskMode && autoAnalysis) reAnalysis();
        }
    }, [drawingComplete]);

    const onPaletteColorHover = (color) => {
        // highlightColor(color);
        setHoveringColor(color);
    };

    const onPaletteColorUnHover = () => {
        setHighlightReset(!highlightReset);
        setHoveringColor(null);
    };

    const onPaletteColorDelete = (palette, setPalette) => (color) => {
        const newPalette = palette.filter((c) => !isColorEqual(c, color));
        setPalette(newPalette);
        setHoveringColor(null);
    };


    const onImageSelected = (img) => {
        setImage(img);
        setMaskMode(false);
        setEnableMask(false);
        setFormReset(!reset);
    }

    const onChangeMaskMode = () => {
        setMaskMode(!maskMode)
        if (maskMode) setEnableMask(true)
    };

    const onApplyMask = () => {
        const url = removedTransparentPixelsURL(canvasRef.current, image);
        const croppedImage = new Image();
        croppedImage.src = url;

        // setMaskDataUrl(url);
        croppedImage.onload = () => {
            setImage(croppedImage);
            setEnableMask(false)
        };
    }

    return (
        <div className="p-4">
            <GoogleLogin />
            <h1 className="text-2xl font-bold mb-4">
                Color Analysis
            </h1>

            {/* {image && ( */}
            <div className="flex flex-row gap-6 relative mb-3 " >
                <div className="flex flex-col gap-3">
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
                                />
                                <MaskedCanvas canvasRef={maskedCanvasRef} image={canvasRef?.current} reset={maskReset} maskMode={maskMode} />
                                <HighlightHoveringColorCanvas canvasRef={highlightCanvasRef} imageCanvas={canvasRef?.current}
                                    reset={highlightReset}
                                    color={hoveringColor} colorPalette={colorPalette} ignorePalette={ignorePalette} />
                            </>
                        }
                    </div>
                    <MaskUI maskMode={maskMode} onChangeMaskMode={onChangeMaskMode}
                        enableMask={enableMask} setEnableMask={setEnableMask}
                        invertMask={invertMask} setInvertMask={setInvertMask}
                        onApplyMask={onApplyMask} />


                </div>

                <div className="flex flex-col">

                    {<TriangularColorPickerDisplayColors colors={[selectedColor]} />}
                    {selectedColor &&
                        <HSLSlider selectedColor={{ r: selectedColor[0], g: selectedColor[1], b: selectedColor[2] }} RGB={true} />
                    }

                </div>


                <Form
                    canvasRef={canvasRef}
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


