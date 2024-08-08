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

// Utility function to calculate the bounding box of non-transparent pixels
const calculateNonTransparentBoundingBox = (imageData, width, height, isInverted = false) => {
    const data = imageData.data;
    let minX = width, minY = height, maxX = 0, maxY = 0;
    const targetAlpha = isInverted ? 255 : 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[((y * width + x) * 4) + 3];
            if (alpha !== targetAlpha) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    return { minX, minY, maxX, maxY };
};


// Function to add padding to the bounding box
const addPaddingToBoundingBox = (box, width, height, padding = 1) => ({
    minX: Math.max(0, box.minX - padding),
    minY: Math.max(0, box.minY - padding),
    maxX: Math.min(width - 1, box.maxX + padding),
    maxY: Math.min(height - 1, box.maxY + padding)
});

// Main function to get the bounding box
const getBoundingBox = (canvas, isInverted = false, cropTransparent = true) => {
    if (!cropTransparent) {
        return {
            x: 0, y: 0,
            width: canvas.width, height: canvas.height
        };
    }

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const [width, height] = [canvas.width, canvas.height];

    let box = calculateNonTransparentBoundingBox(imageData, width, height, isInverted);
    box = addPaddingToBoundingBox(box, width, height);

    return {
        x: box.minX,
        y: box.minY,
        width: box.maxX - box.minX + 1,
        height: box.maxY - box.minY + 1
    };
};


// Function to create a canvas with the desired content
const createResultCanvas = (sourceCanvas, sourceBounds, targetWidth, targetHeight) => {
    const resultCanvas = document.createElement('canvas');
    const resultCtx = resultCanvas.getContext('2d');

    resultCanvas.width = targetWidth;
    resultCanvas.height = targetHeight;
    resultCtx.drawImage(
        sourceCanvas,
        sourceBounds.x, sourceBounds.y, sourceBounds.width, sourceBounds.height,
        0, 0, targetWidth, targetHeight
    );

    return resultCanvas;
};


// Main function to process and crop the image
export const processCanvas = ({ canvas, image, useCurrentCanvas = true, isInverted = false, cropTransparent = false }) => {
    const bounds = getBoundingBox(canvas, isInverted, cropTransparent);
    const scale = image.width / canvas.width;
    const targetWidth = Math.ceil(bounds.width * scale);
    const targetHeight = Math.ceil(bounds.height * scale);

    const sourceCanvas = useCurrentCanvas ? canvas : image;
    const sourceBounds = useCurrentCanvas ? bounds : {
        x: Math.floor(bounds.x * scale),
        y: Math.floor(bounds.y * scale),
        width: targetWidth,
        height: targetHeight
    };

    const resultCanvas = createResultCanvas(sourceCanvas, sourceBounds, targetWidth, targetHeight);
    return resultCanvas.toDataURL();
};

export const invertImageAlpha = async (image, returnCanvas = false) => {

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

    if (returnCanvas) return canvas

    // Create a new Image object and wait for it to load
    const resultImage = await createImageFromUrl(canvas.toDataURL());
    return resultImage;
}

// Helper function to create an Image from a canvas
export const createImageFromUrl = (url) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
};