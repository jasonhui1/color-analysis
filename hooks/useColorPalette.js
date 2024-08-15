import { isColorEqual } from "@/utils/color";
import { useState } from "react";

export function useColorPaletteInteractivity({ setPalette, setHoveringColor = null, setSelectedColor = null, onHover = () => { }, onUnhover = () => { }, onDelete = () => { }, onClick = () => { } }) {

    const onPaletteColorHover = (color) => {
        if (setHoveringColor) setHoveringColor(color);
        onHover()
    };

    const onPaletteColorUnHover = () => {
        if (setHoveringColor) setHoveringColor(null);
        onUnhover()
    };

    const onPaletteColorDelete = (color) => {
        setPalette(palette => palette.filter((c) => !isColorEqual(c, color)));
        if (setHoveringColor) setHoveringColor(null);
        onDelete()
    };

    const onPaletteColorClick = (color) => {
        if (setSelectedColor) setSelectedColor(color);
        onClick()
    };

    return {
        onPaletteColorHover,
        onPaletteColorUnHover,
        onPaletteColorDelete,
        onPaletteColorClick
    };

}