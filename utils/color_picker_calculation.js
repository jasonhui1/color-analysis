export function withinTriangle_strict(x, y, bb = { x1: 0, y1: 0, x2: Math.sqrt(3) / 2, y2: 1 }) {
    // Define the three vertices of the triangle
    const [x1, y1] = [bb.x1, bb.y2]; // Bottom vertex
    const [x2, y2] = [bb.x1, bb.y1]; // Top vertex
    const [x3, y3] = [bb.x2, (bb.y1 + bb.y2) / 2]; // Middle vertex

    // Calculate the area of the full triangle
    const fullArea = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);

    // Calculate areas of three sub-triangles formed by the point and triangle edges
    const area1 = Math.abs((x * (y2 - y3) + x2 * (y3 - y) + x3 * (y - y2)) / 2);
    const area2 = Math.abs((x1 * (y - y3) + x * (y3 - y1) + x3 * (y1 - y)) / 2);
    const area3 = Math.abs((x1 * (y2 - y) + x2 * (y - y1) + x * (y1 - y2)) / 2);

    // The point is inside the triangle if the sum of sub-areas equals the full area
    return Math.abs(fullArea - (area1 + area2 + area3)) < 0.00001; // Using small epsilon for float comparison
}

export function withinCircle(x, y, center, radius) {
    let [x1, y1] = [center, center]
    const dist = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
    return dist >= (center - radius)
}

export function getPositionFromSV({ s, v, w = 1, bb = { x1: 0, y1: 0 }, normalised = false }) {
    if (!normalised) {
        s = s / 100
        v = v / 100
    }

    function getPositionFromSVNormalised() {
        let y = 1 - v
        const horizontalLineLength = getXLengthInTriangle(y)
        let x = s * horizontalLineLength
        return { x, y }
    }

    const { x, y } = getPositionFromSVNormalised()

    return { x: x * w + bb.x1, y: y * w + bb.y1 }
}

export function getSVFromPosition(x, y, w = 1) {
    x /= w
    y /= w
    //trigonometry

    const horizontalLineLength = getXLengthInTriangle(y)
    if (horizontalLineLength < 0.01) return { s: 0, v: 0 }
    const newSaturation = Math.round(x / horizontalLineLength * 100)
    const newValue = Math.round(100 - (y) * 100);

    return { s: newSaturation, v: newValue }
}

export function getHueFromPosition(x, y, centerX, centerY) {
    return Math.round(Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 180)
}

export function getPositionFromHue(hue, radius, centerX, centerY, normalised = false) {
    if (normalised) hue = hue * 360
    return {
        x: -(centerX - radius / 2) * Math.cos((hue) / 180 * Math.PI) + centerX,
        y: -(centerY - radius / 2) * Math.sin((hue) / 180 * Math.PI) + centerY,
    }
}

export function getXLengthInTriangle(y) {
    const yh = (y < 0.5) ? y : 1 - y
    return Math.tan(Math.PI / 3) * yh
}