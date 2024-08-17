import { CiWarning } from "react-icons/ci";
import { processImageColors } from "../Canvas/FilterCanvas";

export const CalulatePercentageButton = ({ canvas, colorPalette, ignorePalette, setPercentage, percentageIsAccurate, setPercentageIsAccurate }) => {

    const onCalculatePercentage = () => {
        const image = canvas;
        if (!image) return;

        const counter = {};
        let totalPixels = 0;
        processImageColors(image, [...colorPalette, ...ignorePalette], ({ nearestColor, alpha }) => {
            if (alpha === 0) return;
            totalPixels += 1;
            counter[nearestColor] = (counter[nearestColor] || 0) + 1;
        });

        // Subtract ignored colors pixels
        ignorePalette.forEach((color) => totalPixels -= counter[color]);

        setPercentage(colorPalette.map((color) => (
            Math.round((counter[color] / totalPixels) * 100)
        )));

        setPercentageIsAccurate(true);

    };
    return (
        <>
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => onCalculatePercentage()}> Calculate Percentage</button>
            {!percentageIsAccurate && <CiWarning className="cursor-pointer" size={20} color="red" strokeWidth={1} onClick={() => onCalculatePercentage()} />}

        </>
    );
};
