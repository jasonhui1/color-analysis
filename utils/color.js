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

export const closeToWhite = (color) => {
    const r = color[0];
    const g = color[1];
    const b = color[2];
    // const a = color[3];

    return (r > 250 && g > 250 && b > 250);
    // return (r > 250 && g > 250 && b > 250) || a < 125;
}

export function calculateBrightness(color) {
    let [r, g, b] = color;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const rgbToHsv = (r, g, b, normalised = false) => {
    if (!normalised) r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
};

// Helper function to convert HSV to RGB
export const hsvToRgb = (h, s, v) => {
    let r, g, b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}