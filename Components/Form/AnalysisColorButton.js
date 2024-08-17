import { calculateBrightness } from "@/utils/color";
import ColorThief from "colorthief";

export const AnalysisColorButton = ({ canvas, paletteCount, setColorPalette }) => {
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
        if (!canvas) return;

        const url = canvas.toDataURL();
        const myImage = new Image();
        myImage.src = url;

        // setMaskDataUrl(url);
        myImage.onload = () => {
            analyzeColors(myImage);
        };
    };
    return (
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => reAnalysis()}> Analysis Palette</button>
    );
};
