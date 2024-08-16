import ColorThief from "colorthief";
import PaletteDisplay from "../../Components/Color/PaletteDisplay";
import { useState, useEffect } from "react";
import { calculateBrightness } from "../../utils/color";
import { TriangularColorPickerDisplayColors } from "../Color/picker";
import { processImageColors } from "../Canvas/FilterCanvas";
import { TextInput } from "../General/TextInput";
import { UploadButton } from "./UploadButton";
import { useColorPaletteInteractivity } from "@/hooks/useColorPalette";
import { CiWarning } from "react-icons/ci";
export function Form({ canvas, image, maskCanvas, invertMask,
    imageSourceURL, setImageSourceURL,
    colorPalette, setColorPalette,
    ignorePalette, setIgnorePalette,
    selectedColor, setSelectedColor,
    hoveringColor, setHoveringColor,
    formReset
}) {

    const [tags, setTags] = useState('');
    const [percentage, setPercentage] = useState([]);
    const [paletteCount, setPaletteCount] = useState(12);
    const [percentageIsAccurate, setPercentageIsAccurate] = useState(false);

    const { onPaletteColorHover,
        onPaletteColorUnHover,
        onPaletteColorDelete,
        onPaletteColorClick
    } = useColorPaletteInteractivity({ setPalette: setColorPalette, setSelectedColor, setHoveringColor });

    const {
        onPaletteColorDelete: onIgnorePaletteColorDelete,
    } = useColorPaletteInteractivity({ setPalette: setIgnorePalette, setSelectedColor, setHoveringColor });


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

        setPercentageIsAccurate(true);

    }

    const removePercentage = (index) => {
        setPercentage(percentage.filter((_, i) => i !== index));
        setPercentageIsAccurate(false);
    }

    const onDeletePaletteColor = (color, index) => {
        onPaletteColorDelete(color)
        removePercentage(index)
    };

    const onDeleteIgnorePaletteColor = (color, index) => {
        onIgnorePaletteColorDelete(color)
        removePercentage(index)

    };

    return (
        <div className="flex flex-col gap-4 flex-wrap">


            <div className="flex gap-4 items-center">
                <TextInput classname="w-8" type="number" label={"Palette Count"} text={paletteCount} setText={setPaletteCount} showBorder={false}/>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => reAnalysis()}> Analysis Palette</button>
                {/* <CheckBox checked={autoAnalysis} onChange={() => setAutoAnalysis(!autoAnalysis)} label="Auto analysis" /> */}
                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => onCalculatePercentage()}> Calculate Percentage</button>
                {!percentageIsAccurate && <CiWarning className="cursor-pointer" size={20} color="red" strokeWidth={1} onClick={() => onCalculatePercentage()} />}
            </div>



            <PaletteDisplay
                colorPalette={colorPalette} setColorPalette={setColorPalette} colorPalettePercentage={percentage}
                onPaletteColorHover={onPaletteColorHover}
                onPaletteColorUnHover={onPaletteColorUnHover}
                onPaletteColorDelete={onDeletePaletteColor}
                onPaletteColorClick={onPaletteColorClick}
                selectedColor={selectedColor}
            />

            <PaletteDisplay
                colorPalette={ignorePalette} setColorPalette={setIgnorePalette}
                onPaletteColorHover={onPaletteColorHover}
                onPaletteColorUnHover={onPaletteColorUnHover}
                onPaletteColorDelete={onDeleteIgnorePaletteColor}
                onPaletteColorClick={onPaletteColorClick}
                selectedColor={selectedColor}
                title="Ignore Palette"
            />
            {colorPalette.length > 0 && <TriangularColorPickerDisplayColors colors={colorPalette} highlightColor={hoveringColor} />}

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

            <UploadButton colorPalette={colorPalette} canvas={canvas} image={image} tags={tags} invertMask={invertMask}
                percentage={percentage} ignorePalette={ignorePalette} imageSourceURL={imageSourceURL} maskCanvas={maskCanvas} />

        </div>
    );
}
