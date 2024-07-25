import { useEffect } from "react";

export default function Canvas({ canvasRef, image, reset }) {
    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
        }
    }, [image, reset]);

    return (<canvas ref={canvasRef} className="max-w-full h-auto" />);
}
