import React, { useEffect, useRef } from 'react';
import { rgbToHsv, hsvToRgb } from '../../utils/color';

const img = new Image();
img.setAttribute('crossOrigin', '');
img.src = 'https://i.imgur.com/BRVZgWi.png';

const HueShiftImage = ({ src, width, height, alt, hueShift, render = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!render) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // const img = new Image();
    // img.setAttribute('crossOrigin', '');
    // img.src = src;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
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
  }, [src, width, height, hueShift, render]);

  return (
    <canvas ref={canvasRef} width={width} height={height} />
  );
};

export default HueShiftImage;