export const nearestColorFromPalette = (color, palette) => {
    return palette.reduce((closest, currentColor) => {
        const distance = Math.hypot(
            color[0] - currentColor[0],
            color[1] - currentColor[1],
            color[2] - currentColor[2]
        );

        if (distance < closest.distance || closest.distance === undefined) {
            return { color: currentColor, distance };
        } else {
            return closest;
        }
    }, { color: null, distance: undefined })
        .color;
}

export const isColorEqual = (color1, color2) => {
    if (!color1 || !color2) return false;
    return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
}
