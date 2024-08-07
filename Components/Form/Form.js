import ColorThief from "colorthief";
import PaletteDisplay from "../../Components/Color/PaletteDisplay";
import { useState, useEffect } from "react";
import { calculateBrightness } from "../../utils/color";
import { TriangularColorPickerDisplayColors } from "../Color/picker";
import { processImageColors } from "../Canvas/FilterCanvas";
import { TextInput } from "../General/TextInput";
import { UploadButton } from "./UploadButton";


export function Form({ canvas, image, maskCanvas,
    imageSourceURL, setImageSourceURL,
    colorPalette, setColorPalette,
    ignorePalette, setIgnorePalette,
    onPaletteColorDelete, onPaletteColorHover, onPaletteColorUnHover,
    selectedColor, setSelectedColor,
    formReset
}) {

    const [tags, setTags] = useState('');
    const [percentage, setPercentage] = useState([]);
    const [paletteCount, setPaletteCount] = useState(12);


    useEffect(() => {
        setPercentage([]);
        setTags('');
        setIgnorePalette([]);
    }, [formReset]);

    const analyzeColors = (img) => {
        try {
            const colorThief = new ColorThief();
            let palette = colorThief.getPalette(img, paletteCount, 10);

            palette.sort((a, b) => calculateBrightness(b) - calculateBrightness(a));
            setColorPalette(palette);
        } catch (error) {
            console.error("Error analyzing colors:", error);
        }
    };

    const reAnalysis = () => {
        if (!canvas) return

        const url = canvas.toDataURL();
        const myImage = new Image();
        myImage.src = url;

        // setMaskDataUrl(url);
        myImage.onload = () => {
            analyzeColors(myImage);
        };
    };

    const onCalculatePercentage = () => {
        const image = canvas
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

        setPercentage(colorPalette.map((color) => (
            Math.round((counter[color] / totalPixels) * 100)
        )))
    }

    const onClickDeletePaletteColor = (colorPalette, setColorPalette) => (color, index) => {
        onPaletteColorDelete(colorPalette, setColorPalette)(color);
        setPercentage(percentage.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-4 flex-wrap">


            <div className="flex gap-4 items-center">
                <TextInput classname="w-8" type="number" label={"Palette Count"} text={paletteCount} setText={setPaletteCount} />
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => reAnalysis()}> Analysis Palette</button>
                {/* <CheckBox checked={autoAnalysis} onChange={() => setAutoAnalysis(!autoAnalysis)} label="Auto analysis" /> */}
                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => onCalculatePercentage()}> Calculate Percentage</button>
            </div>



            <PaletteDisplay
                colorPalette={colorPalette} setColorPalette={setColorPalette} colorPalettePercentage={percentage}
                onPaletteColorHover={onPaletteColorHover}
                onPaletteColorUnHover={onPaletteColorUnHover}
                onPaletteColorDelete={onClickDeletePaletteColor(colorPalette, setColorPalette)}
                selectedColor={selectedColor} setSelectedColor={setSelectedColor}
            />

            <PaletteDisplay
                colorPalette={ignorePalette} setColorPalette={setIgnorePalette}
                onPaletteColorHover={onPaletteColorHover}
                onPaletteColorUnHover={onPaletteColorUnHover}
                onPaletteColorDelete={onClickDeletePaletteColor(ignorePalette, setIgnorePalette)}
                selectedColor={selectedColor} setSelectedColor={setSelectedColor}
            />
            {colorPalette.length > 0 && <TriangularColorPickerDisplayColors colors={colorPalette} />}

            <TextInput text={tags} setText={setTags} label='Tags' classname="min-w-96" />
            <TextInput text={imageSourceURL} setText={setImageSourceURL} label='Source' classname="min-w-96" />


            {/* {maskDataUrl &&
                <NextImage
                    src={maskDataUrl} alt="Masked Image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 'auto', height: 'auto' }} // optional
                />
            } */}

            <UploadButton colorPalette={colorPalette} canvas={canvas} image={image} tags={tags}
                percentage={percentage} ignorePalette={ignorePalette} imageSourceURL={imageSourceURL} maskCanvas={maskCanvas} />

        </div>
    );
}
