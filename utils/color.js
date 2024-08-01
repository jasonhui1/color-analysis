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

export const rgbToHsl = (r, g, b, normalisedInput = false, normaliseResult = false) => {
    if (!normalisedInput) r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    const d = max - min;
    s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

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

    if (normaliseResult) {
        return { h, s, l };
    } else {
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
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

// https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
export function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p
}