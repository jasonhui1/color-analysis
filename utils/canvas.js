export const calculateCanvasSize = (image, maxSize) => {
    // Calculate new dimensions
    let width = image.width;
    let height = image.height;

    if (!(Math.max(width, height) > maxSize)) return { width, height };

    if (width > height) {
        const aspectRatio = image.height / image.width;
        width = maxSize;
        height = maxSize * aspectRatio;
    } else {
        const aspectRatio = image.width / image.height;
        height = maxSize;
        width = maxSize * aspectRatio;
    }

    return { width, height };

}