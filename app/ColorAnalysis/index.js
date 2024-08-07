import React, { useState, useRef, useEffect } from "react";

import HighlightHoveringColorCanvas, { processImageColors } from "../../Components/Canvas/FilterCanvas";

import GoogleLogin from "../../Components/Auth/GoogleLogin";
import Canvas, { removedTransparentPixelsURL } from "../../Components/Canvas/Canvas";
import { HSLSlider, TriangularColorPickerDisplayColors } from "../../Components/Color/picker";
import FileUpload from "../../Components/Form/FileUpload";
import MaskedCanvas from "../../Components/Canvas/MaskedCanvas";
import { isColorEqual } from "../../utils/color";

import { Form } from "../../Components/Form/Form";
import { MaskUI } from "../../Components/Canvas/MaskUI";
import SAMCanvas from "../../Components/Canvas/SAMCanvas";


const ColorAnalysis = () => {
    const canvasRef = useRef(null);
    const maskedCanvasRef = useRef(null);
    const SAMCanvasRef = useRef(null);
    const highlightCanvasRef = useRef(null);
    const fileDropRef = useRef(null);

    const [selectedColor, setSelectedColor] = useState([0, 0, 0]);

    const [image, setImage] = useState(null);
    const imageFileRef = useRef(null);
    const [imageSourceURL, setImageSourceURL] = useState('');

    // SAM, use hooks later
    const [SAMImages, setSAMImages] = useState([]);
    const [SAMEnableIndex, setSAMEnableIndex] = useState(-1);
    const [SAMPositions, setSAMPositions] = useState([]);
    const [SAMIgnorePositions, setSAMIgnorePositions] = useState([]);

    //Resets, use canvas hook
    const [reset, setReset] = useState(false);
    const [maskReset, setMaskReset] = useState(false);
    const [highlightReset, setHighlightReset] = useState(false);
    const [SAMReset, setSAMReset] = useState(true);
    const [formReset, setFormReset] = useState(false);

    // Mask UI, use hooks later
    const [maskMode, setMaskMode] = useState(false);
    const [SAMMode, setSAMMode] = useState(false);
    const [enableMask, setEnableMask] = useState(false);
    const [invertMask, setInvertMask] = useState(false);

    //
    const [drawingComplete, setDrawingComplete] = useState(false);
    const [maskSelectDrawingComplete, setMaskSelectDrawingComplete] = useState(false);

    //
    const [colorPalette, setColorPalette] = useState([]);
    const [ignorePalette, setIgnorePalette] = useState([]);
    const [hoveringColor, setHoveringColor] = useState();

    

    useEffect(() => {
        if (drawingComplete) {
            setDrawingComplete(false); // Reset the flag for future drawings
            // if (!maskMode && autoAnalysis) reAnalysis();
        }
    }, [drawingComplete]);

    useEffect(() => {
        if (!SAMMode) {
            setReset(!reset);
        }
    }, [SAMEnableIndex]);

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

    const onImageSelected = (img, file) => {
        setImage(img);
        setMaskMode(false);
        setEnableMask(false);
        setFormReset(!reset);

        imageFileRef.current = file
        setSAMEnableIndex(-1);
        setSAMImages([]);
        setSAMPositions([]);
        setSAMReset(state => !state);
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
            setReset(!reset);

            setSAMEnableIndex(-1);
            setSAMImages([]);
            setSAMPositions([]);
            setSAMIgnorePositions([]);
        };
    }

    useEffect(() => {
        // fetch('http://localhost:5000/api/hello')
        //     .then(response => response.json())
        //     .then(data => console.log(data))
    }, [])



    const processSAM = async () => {
        // if (!file) return
        if (!canvasRef.current) return
        if (SAMPositions.length === 0 && SAMIgnorePositions.length === 0) { console.log('SAM: No position selected'); return }
        // const dataURL = canvasRef.current.toDataURL('image/png');
        // const file = dataURLtoFile(dataURL, `canvas.png`);

        const file = imageFileRef.current
        const scale = image.width / canvasRef.current.width
        const positivePosition = SAMPositions.map(([x, y]) => [x * scale, y * scale])
        const negativePosition = SAMIgnorePositions.map(([x, y]) => [x * scale, y * scale])

        const formData = new FormData()
        formData.append('image', file);
        formData.append('positions', JSON.stringify(positivePosition))
        formData.append('ignorePositions', JSON.stringify(negativePosition))

        setSAMEnableIndex(-1);
        setSAMImages([]);

        try {
            const response = await fetch('http://localhost:5000/api/process-image', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()
            if (!data.images) throw new Error('No images in response')
            const maskedImages = await Promise.all(data.images.map(loadImage));
            setSAMImages(maskedImages)

        } catch (error) {
            console.error('Error:', error)
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
                                    SAMImage={SAMCanvasRef.current} SAMMode={SAMMode}
                                />
                                <MaskedCanvas canvasRef={maskedCanvasRef} image={canvasRef?.current} reset={maskReset} maskMode={maskMode}
                                />
                                <SAMCanvas canvasRef={SAMCanvasRef} image={canvasRef?.current} reset={SAMReset} maskMode={SAMMode}
                                    SAMPositions={SAMPositions} setSAMPositions={setSAMPositions}
                                    SAMIgnorePositions={SAMIgnorePositions} setSAMIgnorePositions={setSAMIgnorePositions}
                                    SAMImages={SAMImages} SAMEnableIndex={SAMEnableIndex}
                                />
                                <HighlightHoveringColorCanvas canvasRef={highlightCanvasRef} imageCanvas={canvasRef?.current}
                                    reset={highlightReset}
                                    color={hoveringColor} colorPalette={colorPalette} ignorePalette={ignorePalette} />
                            </>
                        }
                    </div>
                    <MaskUI maskMode={maskMode} onChangeMaskMode={onChangeMaskMode}
                        enableMask={enableMask} setEnableMask={setEnableMask}
                        invertMask={invertMask} setInvertMask={setInvertMask}
                        setSAMEnableIndex={setSAMEnableIndex} SAMImages={SAMImages}
                        processSAM={processSAM}
                        onApplyMask={onApplyMask} />

                    <button onClick={() => setSAMMode(!SAMMode)} className="bg-gray-200 px-2 py-1 rounded-md cursor-pointer text-sm">SAM Mode : {SAMMode ? 'ON' : 'OFF'}</button>


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

const loadImage = (base64image) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = `data:image/png;base64,${base64image}`;
        img.onload = () => {
            resolve(img);
        };
    });
};

const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};