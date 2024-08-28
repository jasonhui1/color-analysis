import PaletteDisplay from "../../Components/Color/PaletteDisplay";
import { useState, useEffect } from "react";
import { TriangularColorPickerDisplayColors } from "../Color/picker";
import { TextInput } from "../General/TextInput";
import { UploadButton } from "./UploadButton";
import { useColorPaletteInteractivity } from "@/hooks/useColorPalette";
import ToggleComponent from "../General/ToggleComponent";
import CheckBox from "../General/CheckBox";
import TagInput from "./TagInput";
import { AnalysisColorButton } from "./AnalysisColorButton";
import { CalulatePercentageButton } from "./CalulatePercentageButton";
import { useColorContext } from "@/context/color";
import { useMainCanvasContext } from "@/context/mainCanvas";

export function Form({ invertMask,
    imageSourceURL, setImageSourceURL,
    selectedColor, setSelectedColor,
    onlyHighlightMask, setOnlyHighlightMask,
    formReset,
    paletteData = null,
}) {

    const { canvasRef } = useMainCanvasContext();
    const canvas = canvasRef.current

    const [tags, setTags] = useState([]);
    const [percentage, setPercentage] = useState([]);
    const [paletteCount, setPaletteCount] = useState(12);
    const [percentageIsAccurate, setPercentageIsAccurate] = useState(true);

    const {
        colorPalette, setColorPalette,
        ignorePalette, setIgnorePalette,
        hoveringColor, setHoveringColor
    } = useColorContext();

    useEffect(() => {
        setPercentage([]);
        setTags([]);
        setIgnorePalette([]);
    }, [formReset]);

    // Initial set if editing
    useEffect(() => {
        if (paletteData) {
            setTags(paletteData.tags);
            setImageSourceURL(paletteData.imageSourceURL);
            setPercentage(paletteData.percentage);
        }

    }, [paletteData])


    const removePercentage = (_, index) => {
        setPercentage(percentage.filter((_, i) => i !== index));
        setPercentageIsAccurate(false);
    }


    return (
        <div className="flex flex-col gap-4 flex-wrap">


            <div className="flex gap-4 items-center flex-wrap">
                <TextInput classname="w-8" type="number" label={"Palette Count"} text={paletteCount} setText={setPaletteCount} showBorder={false} />
                <AnalysisColorButton canvas={canvas} paletteCount={paletteCount} setColorPalette={setColorPalette} />
                <CalulatePercentageButton canvas={canvas} colorPalette={colorPalette} ignorePalette={ignorePalette} setPercentage={setPercentage} percentageIsAccurate={percentageIsAccurate} setPercentageIsAccurate={setPercentageIsAccurate} />
                {/* <CheckBox checked={autoAnalysis} onChange={() => setAutoAnalysis(!autoAnalysis)} label="Auto analysis" /> */}
            </div>

            <CheckBox label="Highlight only mask" checked={onlyHighlightMask} onChange={() => setOnlyHighlightMask(!onlyHighlightMask)} />

            <PaletteDisplay
                colorPalette={colorPalette} setColorPalette={setColorPalette} colorPalettePercentage={percentage}
                
                handleDelete={removePercentage}
                handleEdit={() => setPercentageIsAccurate(false)}
                
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor} setHoveringColor={setHoveringColor}
            />

            <ToggleComponent label={"Ignore Palette"}>
                <PaletteDisplay
                    title="Ignore Palette"
                    colorPalette={ignorePalette} setColorPalette={setIgnorePalette}

                    handleDelete={removePercentage}
                    handleEdit={() => setPercentageIsAccurate(false)}

                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor} setHoveringColor={setHoveringColor}
                />
            </ToggleComponent>
            {colorPalette.length > 0 && <TriangularColorPickerDisplayColors colors={colorPalette} highlightColor={hoveringColor} />}

            <TagInput tags={tags} setTags={setTags} />
            <TextInput text={imageSourceURL} setText={setImageSourceURL} label='Source' classname="min-w-96" />

            <UploadButton
                tags={tags} invertMask={invertMask}
                percentage={percentage} imageSourceURL={imageSourceURL}
                paletteId={paletteData && paletteData.id}
            />

        </div>
    );
}

