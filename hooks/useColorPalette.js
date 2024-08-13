import { isColorEqual } from "@/utils/color";
import { useState } from "react";

export function useColorPalette({ onHover=null, onUnhover=null, onDelete=null, onClick=null }) {
    const [colorPalette, setColorPalette] = useState([]);
    const [ignorePalette, setIgnorePalette] = useState([]);
    const [selectedColor, setSelectedColor] = useState([0, 0, 0]);
    const [hoveringColor, setHoveringColor] = useState();

    const onPaletteColorHover = (color) => {
        // highlightColor(color);
        setHoveringColor(color);
        if (onHover) onHover()
    };

    const onPaletteColorUnHover = () => {
        setHoveringColor(null);
        if (onUnhover) onUnhover()
    };

    const onPaletteColorDelete = (palette, setPalette) => (color) => {
        const newPalette = palette.filter((c) => !isColorEqual(c, color));
        setPalette(newPalette);
        setHoveringColor(null);
        if (onDelete) onDelete()
    };

    const onPaletteColorClick = (color) => {
        setSelectedColor(color);
        if (onClick) onClick()
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