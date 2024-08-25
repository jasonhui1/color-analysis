
export const loadBase64Image = (base64image) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = `data:image/png;base64,${base64image}`;
        img.onload = () => {
            resolve(img);
        };
    });
};

export const loadImage = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            resolve(img);
        };
    });
};

export const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};


