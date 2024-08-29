import { isColorEqual } from "@/utils/color";
import { useState } from "react";

export function useColorPaletteInteractivity({ setPalette = null, setHoveringColor = null, setSelectedColor = null,
    onHover = (color, index) => { }, onUnhover = () => { }, onDelete = (color, index) => { }, onClick = (color, index) => { },
    updateHoverCondition = true, updateUnhoverCondition = true } = {}
) {

    const [hoveringIndex, setHoveringIndex] = useState(-1);

    const onPaletteColorHover = (color, index = -1) => {
        if (setHoveringColor) setHoveringColor(color);
        if (updateHoverCondition) setHoveringIndex(index);
        onHover(color, index)
    };

    const onPaletteColorUnHover = () => {
        if (setHoveringColor) setHoveringColor(null);
        if (updateUnhoverCondition) setHoveringIndex(-1);
        onUnhover()
    };

    const onPaletteColorDelete = (color, index) => {
        if (setPalette) setPalette(palette => palette.filter((c) => !isColorEqual(c, color)));
        if (setHoveringColor) setHoveringColor(null);

        setHoveringIndex(-1);
        onDelete(color, index)
    };

    const onPaletteColorClick = (color, index) => {
        if (setSelectedColor) setSelectedColor(color);
        onClick(color, index)
    };

    return {
        hoveringIndex, setHoveringIndex,
        onPaletteColorHover,
        onPaletteColorUnHover,
        onPaletteColorDelete,
        onPaletteColorClick,
    };

}