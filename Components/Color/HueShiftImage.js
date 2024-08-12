import React, { useEffect, useRef } from 'react';
import { rgbToHsv, hsvToRgb } from '../../utils/color';
import Image from 'next/image';

const HueShiftImage = ({ src, width, height, alt, hueShift, render = true }) => {

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const drawImage = (image) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const [width, height] = [canvas.width, canvas.height];
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert RGB to HSV
      const [h, s, v] = rgbToHsv(r, g, b);

      // Shift the hue
      const newHue = (h + hueShift / 360) % 1;

      // Convert back to RGB
      const [newR, newG, newB] = hsvToRgb(newHue, s, v);

      data[i] = newR;
      data[i + 1] = newG;
      data[i + 2] = newB;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  useEffect(() => {
    if (!render) return;

    const img = imageRef.current;
    if (img.complete) {
      drawImage(img);
    } else {
      img.onload = () => {
        drawImage(img);

      };
    }

  }, [imageRef.current, src, width, height, hueShift, render]);

  return (
    <>
      <canvas ref={canvasRef} width={width} height={height} />
      <div className=' absolute opacity-0'>
        <Image
          ref={imageRef}
          src={src}
          width={width}
          height={height}
          alt="Hidden image for canvas"
          unoptimized
        />
      </div>
    </>
  );
};

export default HueShiftImage;