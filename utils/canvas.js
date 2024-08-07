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

export const resizeImage = (image, newWidth, newHeight) => {
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = newWidth;
    croppedCanvas.height = newHeight;

    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCtx.drawImage(image, 0, 0, newWidth, newHeight);

}


const getNonTransparentBoundingBox = (canvas, invert = false) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let [width, height] = [canvas.width, canvas.height];

    let minX = width, minY = height, maxX = 0, maxY = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[((y * width + x) * 4) + 3];
            const alphaCheck = invert ? 255 : 0
            if (alpha !== alphaCheck) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    // Add a small padding
    minX = Math.max(0, minX - 1);
    minY = Math.max(0, minY - 1);
    maxX = Math.min(width - 1, maxX + 1);
    maxY = Math.min(height - 1, maxY + 1);

    width = maxX - minX + 1;
    height = maxY - minY + 1;

    return {
        x: minX,
        y: minY,
        width,
        height
    }
}

// Canvas - current canvas
// image - last canvas
// drawOriginal - if true, draw the original image, otherwise draw the current canvas
export const removedTransparentPixelsURL = (canvas, image, drawCurrent = true, invert = false) => {

    let { x: minX, y: minY, width, height } = getNonTransparentBoundingBox(canvas, invert);

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    // Find position in original image to keep resolution
    const scale = image.width / canvas.width;

    const originalMinX = Math.floor(minX * scale);
    const originalMinY = Math.floor(minY * scale);
    const newWidth = Math.ceil(width * scale);
    const newHeight = Math.ceil(height * scale);
    croppedCanvas.width = newWidth;
    croppedCanvas.height = newHeight;

    if (drawCurrent) {
        croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, newWidth, newHeight);
    } else {
        croppedCtx.drawImage(image, originalMinX, originalMinY, newWidth, newHeight, 0, 0, newWidth, newHeight);
    }

    return croppedCanvas.toDataURL()
};

export const invertImageAlpha = async (image) => {

    const canvas = document.createElement('canvas');
    let [width, height] = [image.width, image.height];
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const alpha = data[index + 3];

            // Invert alpha if it's greater than 127
            if (alpha > 127) {
                data[index + 3] = 0;
            } else {
                data[index + 3] = 255;
            }
        }
    }

    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Create a new Image object and wait for it to load
    const resultImage = await createImageFromUrl(canvas.toDataURL());
    return resultImage;
}

// Helper function to create an Image from a canvas
const createImageFromUrl = (url) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
};