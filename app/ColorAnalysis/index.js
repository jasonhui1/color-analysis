import React, { useState, useRef, useEffect } from "react";
import ColorThief from "colorthief";

import HighlightHoveringColorCanvas, { processImageColors } from "../../Components/FilterCanvas";
import CheckBox from "../../Components/General/CheckBox";
import PaletteDisplay from "../../Components/Color/PaletteDisplay";
import { uploadImageClient } from "../../api/image";
import { uploadPaletteClient } from "../../api/palette";
import { getUserId } from "../../api/supabaseClient";
import GoogleLogin from "../../Components/Auth/GoogleLogin";
import Canvas, { removedTransparentPixelsURL } from "../../Components/Canvas";
import { HSLSlider, TriangularColorPickerDisplayColors } from "../../Components/Color/picker";
import FileUpload from "../../Components/FileUpload";
import MaskedCanvas from "../../Components/MaskedCanvas";
import { isColorEqual, calculateBrightness, rgbToHsl } from "../../utils/color";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const ColorAnalysis = () => {
    const canvasRef = useRef(null);
    const maskedCanvasRef = useRef(null);
    const highlightCanvasRef = useRef(null);
    const fileDropRef = useRef(null);

    const [selectedColor, setSelectedColor] = useState([0, 0, 0]);

    const [image, setImage] = useState(null);
    const [imageSourceURL, setImageSourceURL] = useState('');

    const [colorPalette, setColorPalette] = useState([]);
    const [ignorePalette, setIgnorePalette] = useState([]);
    const [colorPalettePercentage, setColorPalettePercentage] = useState([]);

    const [reset, setReset] = useState(false);
    const [maskReset, setMaskReset] = useState(false);
    const [highlightReset, setHighlightReset] = useState(false);

    const [maskMode, setMaskMode] = useState(false);
    const [enableMask, setEnableMask] = useState(false);
    const [invertMask, setInvertMask] = useState(false);
    const [autoAnalysis, setAutoAnalysis] = useState(true);

    const [drawingComplete, setDrawingComplete] = useState(false);
    const [maskSelectDrawingComplete, setMaskSelectDrawingComplete] = useState(false);

    // const [maskDataUrl, setMaskDataUrl] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState('');

    const [hoveringColor, setHoveringColor] = useState();
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (drawingComplete) {
            setDrawingComplete(false); // Reset the flag for future drawings
            if (!maskMode && autoAnalysis) reAnalysis();
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

    const analyzeColors = (img) => {
        try {
            const colorThief = new ColorThief();
            let palette = colorThief.getPalette(img, 8, 10);

            palette.sort((a, b) => calculateBrightness(b) - calculateBrightness(a));
            setColorPalette(palette);
        } catch (error) {
            console.error("Error analyzing colors:", error);
        }
    };

    const onImageSelected = (img) => {
        setImage(img);
        setMaskMode(false);
        setEnableMask(false);
        setColorPalettePercentage([]);
        // analyzeColors(img)
    }

    const onChangeMaskMode = () => {
        setMaskMode(!maskMode)
        if (maskMode) setEnableMask(true)
    };

    const reAnalysis = () => {
        if (!canvasRef.current) return

        const url = canvasRef.current.toDataURL();
        const myImage = new Image();
        myImage.src = url;

        // setMaskDataUrl(url);
        myImage.onload = () => {
            analyzeColors(myImage);
        };
    };

    const onCalculatePercentage = () => {
        const image = canvasRef.current
        if (!image) return

        const counter = {}
        let totalPixels = 0
        processImageColors(image, [...colorPalette, ...ignorePalette], ({ nearestColor, alpha }) => {
            if (alpha === 0) return
            totalPixels += 1
            counter[nearestColor] = (counter[nearestColor] || 0) + 1
        });

        // Subtract ignored colors pixels
        ignorePalette.forEach((color) => totalPixels -= counter[color])

        setColorPalettePercentage(colorPalette.map((color) => (
            Math.round((counter[color] / totalPixels) * 100)
        )))
    }

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

                <div className="flex flex-col gap-4">


                    <div className="flex gap-4 items-center">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => reAnalysis()}> Analysis Palette</button>
                        <CheckBox checked={autoAnalysis} onChange={() => setAutoAnalysis(!autoAnalysis)} label="Auto analysis" />
                        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => onCalculatePercentage()}> Calculate Percentage</button>
                    </div>



                    <PaletteDisplay
                        colorPalette={colorPalette} setColorPalette={setColorPalette} colorPalettePercentage={colorPalettePercentage}
                        onPaletteColorHover={onPaletteColorHover}
                        onPaletteColorUnHover={onPaletteColorUnHover}
                        onPaletteColorDelete={onPaletteColorDelete(colorPalette, setColorPalette)}
                        selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                    />

                    <PaletteDisplay
                        colorPalette={ignorePalette} setColorPalette={setIgnorePalette}
                        onPaletteColorHover={onPaletteColorHover}
                        onPaletteColorUnHover={onPaletteColorUnHover}
                        onPaletteColorDelete={onPaletteColorDelete(ignorePalette, setIgnorePalette)}
                        selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                    />
                    {colorPalette.length > 0 && <TriangularColorPickerDisplayColors colors={colorPalette} />}

                    <TextInput text={tags} setText={setTags} label='Tags' />
                    <TextInput text={imageSourceURL} setText={setImageSourceURL} label='Source' />


                    {/* {maskDataUrl &&
                <NextImage
                    src={maskDataUrl} alt="Masked Image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 'auto', height: 'auto' }} // optional
                />
            } */}

                    <UploadButton colorPalette={colorPalette} canvasRef={canvasRef} image={image} tags={tags}
                        percentage={colorPalettePercentage} ignorePalette={ignorePalette} imageSourceURL={imageSourceURL} />

                </div>


            </div>

        </div>
    );
};
export default ColorAnalysis;

function MaskUI({ maskMode, onChangeMaskMode,
    enableMask, setEnableMask,
    invertMask, setInvertMask,
    onApplyMask
}) {

    return (
        <div className="flex gap-4 items-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => onChangeMaskMode()}> {maskMode ? 'Exit Mask' : 'Enter Mask'} </button>
            {enableMask ? <IoMdEye cursor="pointer" onClick={() => setEnableMask(false)} size={24} /> : <IoMdEyeOff size={24} cursor="pointer" onClick={() => setEnableMask(true)} />}

            {/* <CheckBox label="Enable mask" checked={enableMask} onChange={() => setEnableMask(!enableMask)} /> */}
            <CheckBox label="Invert mask" checked={invertMask} onChange={() => setInvertMask(!invertMask)} />
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => onApplyMask()}> Apply Mask</button>

        </div>
    )
}

function UploadButton({ colorPalette, canvasRef, image, tags, percentage, ignorePalette, imageSourceURL }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (event) => {
        setIsUploading(true);
        const croppedImageURL = removedTransparentPixelsURL(canvasRef.current, image);

        //TODO: Wrap this in context  when refactor
        const id = await getUserId()

        try {
            const uploadedImageURL = await uploadImageClient(croppedImageURL);
            await uploadPaletteClient({ palette: { palette: colorPalette, percentage, ignorePalette }, userId: id, imageURL: uploadedImageURL, tags, imageSourceURL });
            console.log('upload success :>> ');

        } catch (err) {
            console.error('Error:', err);
            // setError('Failed to upload image. Please try again.');
            console.log('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <button onClick={handleUpload}
            // disabled={isUploading} 
            className="w-fit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {isUploading ? 'Uploading...' : 'Upload '}
        </button>
    );
}



function TextInput({ text, setText, label }) {
    return (
        <div>
            <label className="mr-4">{label}:</label>
            <input type="text" className="min-w-96 border-black border" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
    );
}
