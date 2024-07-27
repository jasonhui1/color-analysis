import React, { useState, useRef, useEffect } from "react";
import ColorThief from "colorthief";
import { calculateBrightness, closeToWhite, isColorEqual, nearestColorFromPalette } from "@/utils/color";
import FileUpload from "@/Components/FileUpload";
import Canvas, { removeTransparentPixels } from "@/Components/Canvas";
import PaletteDisplay from "@/Components/PaletteDisplay";
import MaskedCanvas from "@/Components/MaskedCanvas";
import NextImage from "next/image";
import GoogleLogin from "@/Components/Auth/GoogleLogin";
import { getUserId } from "@/api/supabase";
import { uploadPalette } from "@/api/palette";
import { uploadImage } from "@/api/image";
import { ColorPicker, TriangularColorPickerDisplayColors } from "@/Components/Color/picker";


const ColorAnalysis = () => {
    const canvasRef = useRef(null);
    const maskedCanvasRef = useRef(null);

    const [image, setImage] = useState(null);
    const [colorPalette, setColorPalette] = useState([]);

    const [reset, setReset] = useState(false);
    const [maskReset, setMaskReset] = useState(false);

    const [maskMode, setMaskMode] = useState(false);
    const [enableMask, setEnableMask] = useState(false);
    const [invertMask, setInvertMask] = useState(false);

    const [drawingComplete, setDrawingComplete] = useState(false);
    const [maskSelectDrawingComplete, setMaskSelectDrawingComplete] = useState(false);

    // const [maskDataUrl, setMaskDataUrl] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (drawingComplete) {
            setDrawingComplete(false); // Reset the flag for future drawings
            if (!maskMode) reAnalysis();
        }
    }, [drawingComplete]);

    const redraw = () => {
        setReset(!reset);
    };

    const onPaletteColorHover = (color) => {
        highlightColor(color);
    };

    const onPaletteColorUnHover = () => {
        redraw();
    };

    const analyzeColors = (img) => {
        try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 8, 10);

            palette.sort((a, b) => calculateBrightness(b) - calculateBrightness(a));
            setColorPalette(palette);
        } catch (error) {
            console.error("Error analyzing colors:", error);
        }
    };

    const onImageSelected = (img) => {
        setImage(img);
        // analyzeColors(img)
    }

    const highlightColor = (color) => {
        // TODO: use new filter canvas instead?
        if (!color) return

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const step = 4; //rgba

        for (let i = 0; i < data.length; i += step) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const nearestColor = nearestColorFromPalette([r, g, b], colorPalette);
            if (isColorEqual(color, nearestColor)) {
                // Highlight matching colors
                data[i] = color[0];
                data[i + 1] = color[1];
                data[i + 2] = color[2];
                // data[i + 3] = 255; // Full opacity
            } else {
                // Dim non-matching colors
                data[i] = Math.floor(r * 0.2);
                data[i + 1] = Math.floor(g * 0.2);
                data[i + 2] = Math.floor(b * 0.2);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const saveAndExitMask = () => {
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

    const handleUpload = async (event) => {
        setIsUploading(true);
        const { canvas: croppedCanvas } = removeTransparentPixels(canvasRef.current);
        const canvasImageUrl = croppedCanvas.toDataURL();

        //TODO: Wrap this in context  when refactor
        const id = await getUserId()

        try {
            const imageURL = await uploadImage(canvasImageUrl);
            await uploadPalette({ palette: colorPalette, userId: id, imageURL });
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
        <div className="p-4">
            <GoogleLogin />
            <h1 className="text-2xl font-bold mb-4">
                Color Analysis
            </h1>

            <FileUpload onImageSelected={onImageSelected} />

            {/* {image && ( */}
            <div className="mb-4 relative " >
                <Canvas canvasRef={canvasRef} image={image} setDrawingComplete={setDrawingComplete} reset={reset}
                    maskedImage={maskedCanvasRef.current} maskMode={maskMode} enableMask={enableMask} invertMask={invertMask}
                />
                <MaskedCanvas canvasRef={maskedCanvasRef} image={image} reset={maskReset} brushSize={10} maskMode={maskMode} />
            </div>


            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => saveAndExitMask()}> {maskMode ? 'Exit Mask' : 'Enter Mask'} </button>
            <button onClick={handleUpload} disabled={isUploading} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                {isUploading ? 'Uploading...' : 'Upload '}
            </button>
            <div>
                <input type="checkbox" checked={enableMask} onChange={() => setEnableMask(!enableMask)} />Enable mask
            </div>
            <input type="checkbox" checked={invertMask} onChange={() => setInvertMask(!invertMask)} />Invert mask
            <PaletteDisplay
                colorPalette={colorPalette}
                onPaletteColorHover={onPaletteColorHover}
                onPaletteColorUnHover={onPaletteColorUnHover}
            />

            {colorPalette && <TriangularColorPickerDisplayColors colors={colorPalette} />}

            {/* {maskDataUrl &&
                <NextImage
                    src={maskDataUrl} alt="Masked Image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 'auto', height: 'auto' }} // optional
                />
            } */}
        </div>
    );
};
export default ColorAnalysis;


