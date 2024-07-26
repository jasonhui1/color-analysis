import { useEffect } from "react";

export default function Canvas({ canvasRef, image, reset, maskedImage, maskMode, enableMask, invertMask }) {
    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            let ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, 0, 0, image.width, image.height);

            if (!maskMode && maskedImage && enableMask) {
                if (invertMask) {
                    ctx.globalCompositeOperation = 'destination-in';
                } else {
                    ctx.globalCompositeOperation = 'destination-out';
                }

                ctx.drawImage(maskedImage, 0, 0, image.width, image.height);
            }

        }
    }, [image, reset, maskedImage, maskMode, enableMask, invertMask]);

    return (<canvas ref={canvasRef} className="max-w-full h-auto" />);
}

