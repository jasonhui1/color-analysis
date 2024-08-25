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

export function Form({ canvas, image, maskCanvas, invertMask,
    imageSourceURL, setImageSourceURL,
    colorPalette, setColorPalette,
    ignorePalette, setIgnorePalette,
    selectedColor, setSelectedColor,
    hoveringColor, setHoveringColor,
    onlyHighlightMask, setOnlyHighlightMask,
    formReset,
    paletteData = {},
}) {

    const [tags, setTags] = useState([]);
    const [percentage, setPercentage] = useState([]);
    const [paletteCount, setPaletteCount] = useState(12);
    const [percentageIsAccurate, setPercentageIsAccurate] = useState(true);

    const { onPaletteColorHover,
        onPaletteColorUnHover,
        onPaletteColorDelete,
        onPaletteColorClick
    } = useColorPaletteInteractivity({ setPalette: setColorPalette, setSelectedColor, setHoveringColor, });

    const {
        onPaletteColorDelete: onIgnorePaletteColorDelete,
    } = useColorPaletteInteractivity({ setPalette: setIgnorePalette, setSelectedColor, setHoveringColor });


    useEffect(() => {
        setPercentage([]);
        setTags([]);
        setIgnorePalette([]);
    }, [formReset]);

    useEffect(() => {

        if (paletteData) {

            setTags(paletteData.tags);
            setImageSourceURL(paletteData.imageSourceURL);
            setPercentage(paletteData.percentage);
        }

    }, [paletteData])


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


            <div className="flex gap-4 items-center flex-wrap">
                <TextInput classname="w-8" type="number" label={"Palette Count"} text={paletteCount} setText={setPaletteCount} showBorder={false} />
                <AnalysisColorButton canvas={canvas} paletteCount={paletteCount} setColorPalette={setColorPalette} />
                <CalulatePercentageButton canvas={canvas} colorPalette={colorPalette} ignorePalette={ignorePalette} setPercentage={setPercentage} percentageIsAccurate={percentageIsAccurate} setPercentageIsAccurate={setPercentageIsAccurate} />
                {/* <CheckBox checked={autoAnalysis} onChange={() => setAutoAnalysis(!autoAnalysis)} label="Auto analysis" /> */}
            </div>

            <CheckBox label="Highlight only mask" checked={onlyHighlightMask} onChange={() => setOnlyHighlightMask(!onlyHighlightMask)} />


            <PaletteDisplay
                colorPalette={colorPalette} setColorPalette={setColorPalette} colorPalettePercentage={percentage}
                onPaletteColorHover={onPaletteColorHover}
                onPaletteColorUnHover={onPaletteColorUnHover}
                onPaletteColorDelete={onDeletePaletteColor}
                onPaletteColorClick={onPaletteColorClick}
                onPaletteColorEdit={() => setPercentageIsAccurate(false)}
                selectedColor={selectedColor}
            />

            <ToggleComponent label={"Ignore Palette"}>
                <PaletteDisplay
                    colorPalette={ignorePalette} setColorPalette={setIgnorePalette}
                    onPaletteColorHover={onPaletteColorHover}
                    onPaletteColorUnHover={onPaletteColorUnHover}
                    onPaletteColorDelete={onDeleteIgnorePaletteColor}
                    onPaletteColorClick={onPaletteColorClick}
                    onPaletteColorEdit={() => setPercentageIsAccurate(false)}

                    selectedColor={selectedColor}
                    title="Ignore Palette"
                />
            </ToggleComponent>
            {colorPalette.length > 0 && <TriangularColorPickerDisplayColors colors={colorPalette} highlightColor={hoveringColor} />}

            <TagInput tags={tags} setTags={setTags} />
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

