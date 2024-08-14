import { isColorEqual } from "@/utils/color";
import { useState } from "react";

export function useColorPalette({ onHover = () => { }, onUnhover = () => { }, onDelete = () => { }, onClick = () => { } } = {}) {
    const [colorPalette, setColorPalette] = useState([]);
    const [ignorePalette, setIgnorePalette] = useState([]);
    const [selectedColor, setSelectedColor] = useState([0, 0, 0]);
    const [hoveringColor, setHoveringColor] = useState();

    const onPaletteColorHover = (color) => {
        // highlightColor(color);
        setHoveringColor(color);
        onHover()
    };

    const onPaletteColorUnHover = () => {
        setHoveringColor(null);
        onUnhover()
    };

    const onPaletteColorDelete = (palette, setPalette) => (color) => {
        const newPalette = palette.filter((c) => !isColorEqual(c, color));
        setPalette(newPalette);
        setHoveringColor(null);
        onDelete()
    };

    const onPaletteColorClick = (color) => {
        setSelectedColor(color);
        onClick()
    };

    return {
        colorPalette,
        ignorePalette,
        selectedColor,
        hoveringColor,
        setColorPalette, setIgnorePalette, setSelectedColor,
        onPaletteColorHover,
        onPaletteColorUnHover,
        onPaletteColorDelete,
        onPaletteColorClick
    };

}