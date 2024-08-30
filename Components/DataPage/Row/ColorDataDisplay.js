import PaletteDisplay from "@/Components/Color/PaletteDisplay"
import { TriangularColorPickerDisplayColors } from "@/Components/Color/picker"
import CheckBox from "@/Components/General/CheckBox"
import { useColorContext } from "@/context/color"
import { sortPaletteAndPercentage } from "@/utils/color"
import { useState } from "react"
import Extras from "../Extra"

export default function ColorDataDisplay({
    paletteData,
    setSelectedColor,
    showPalette = true,
    maxSize,
}) {

    const { hoveringColor, setHoveringColor } = useColorContext()
    const { palette, percentage } = paletteData
    const { palette: sorted_palette, percentage: sorted_percentage } = sortPaletteAndPercentage(palette, percentage)


    return (
        <>
            <TriangularColorPickerDisplayColors colors={palette} size={maxSize * 0.8} highlightColor={hoveringColor} />
            {showPalette &&
                <PaletteDisplay title={''}
                    colorPalette={sorted_palette} colorPalettePercentage={sorted_percentage}
                    setSelectedColor={setSelectedColor}
                    setHoveringColor={setHoveringColor}
                    enableAdd={false} enableDelete={false} enableEdit={false}
                />


            }


        </>
    );
}