import React, { useState, useRef, useEffect, memo } from 'react';
import color_wheel from "../../public/color_wheel.png";
import Image from 'next/image';
import HueShiftImage from './HueShiftImage';
import { FaRegCircle } from 'react-icons/fa';
import { rgbToHsv } from '@/utils/color';
import { getPositionFromHue } from '@/utils/color_picker_calculation';
import { getPositionFromSV, withinTriangle_strict, withinCircle, getSVFromPosition, getHueFromPosition } from '../../utils/color_picker_calculation';
import { rgbToHsl } from '../../utils/color';

const defaultHueShift = 30 //by CSP
const TriangularColorPicker = ({ size = 300, selectedColor, setSelectedColor }) => {

    const [isDraggingColor, setIsDraggingColor] = useState(false);
    const [isDraggingHue, setIsDraggingHue] = useState(false);
    const divRef = useRef(null);

    const center = size / 2
    const ratio = 1 / 300 * size
    ///////////////////////////Cirlce///////////////////////
    const radius = 25 / ratio

    /////////////////////////Triangle///////////////////////
    const bb = {
        x1: 88 / ratio, y1: 45 / ratio,
        x2: 269 / ratio, y2: 255 / ratio
    }
    const w = bb.y2 - bb.y1

    //Calculate the position
    let selectedColorPosition = getPositionFromSV({ s: selectedColor.s, v: selectedColor.l, w, bb })

    const selectedHue = defaultHueShift + selectedColor.h
    let selectedHuePosition = getPositionFromHue(selectedHue, radius, center, center)

    function getRelativeXY(e) {
        let x = -1
        let y = -1
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        return [x, y]
    }

    const handleMouseDown = (e) => {
        let [x, y] = getRelativeXY(e)
        if (x < 0 && y < 0) return

        if (withinTriangle_strict(x, y, bb)) {
            setIsDraggingColor(true);
            updateColor(e);
        } else if (withinCircle(x, y, center, radius)) {
            setIsDraggingHue(true);
            updateHue(e);
        }
    };

    const handleMouseMove = (e) => {
        if (isDraggingColor) {
            updateColor(e);
        } else if (isDraggingHue) {
            updateHue(e)
        }
    };

    const handleMouseUp = () => {
        setIsDraggingColor(false);
        setIsDraggingHue(false);
    };

    const updateColor = (e) => {
        let [x, y] = getRelativeXY(e)
        if (x < 0 && y < 0) return
        // console.log('x,y :>> ', x, y);

        //within bounding box
        // if (withinTriangle(x, y)) {
        x -= bb.x1
        y -= bb.y1

        const { s, v } = getSVFromPosition(x, y, w)

        setSelectedColor({
            ...selectedColor,
            s: Math.max(0, Math.min(100, s)),
            l: Math.max(0, Math.min(100, v))
        });

    };

    const updateHue = (e) => {
        const [x, y] = getRelativeXY(e)
        if (x < 0 && y < 0) return

        let hue = getHueFromPosition(x, y, center, center) - defaultHueShift
        if (hue < 0) hue += 360

        setSelectedColor({
            ...selectedColor,
            h: hue
        });
    };

    return (
        <div className={`w-[${size}px] h-[${size}px] relative`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} ref={divRef}>

            <div className='relative flex'>
                {/* Hue not correctly calculated I think, same as hue rotate */}
                {/* <Image src={"https://i.imgur.com/BRVZgWi.png"} width={size} height={size} alt="color_combined" /> */}
                {/* <div className='w-full h-full absolute' style={{ background: `hsl(${selectedColor.h}, 100%, 50%)`, mixBlendMode: 'hue', clipPath: `path('M 88 45 L 88 255 L 269 150 z')` }} /> */}
                <Image className='absolute' src={color_wheel} alt="color_wheel" width={size} height={size} draggable={false} style={{
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                    KhtmlUserDrag: 'none',
                    MozUserDrag: 'none',
                    OUserDrag: 'none',
                }} />
            </div>
            {/* Use Js canvas */}
            <HueShiftImage
                src={"https://i.imgur.com/BRVZgWi.png"}
                width={size}
                height={size}
                alt="color_combined"
                hueShift={selectedColor.h}
            />

            {/* Indictator, one with white outline, one with black outline */}
            <CircleIndicator position={selectedColorPosition} width={10} height={10} color="white" border_width={2} />
            <CircleIndicator position={selectedColorPosition} width={12} height={12} color="black" />
            <RectIndicator position={selectedHuePosition} width={10} height={22} color="white" border_width={2} rotation={selectedColor.h + 90 + defaultHueShift} />
            <RectIndicator position={selectedHuePosition} width={12} height={24} color="black" rotation={selectedColor.h + 90 + defaultHueShift} />
        </div>

    );
};

const CircleIndicator = ({ position, width, height, color, border_width = 1 }) => {
    return <div style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: width + 'px',
        height: height + 'px',
        borderRadius: '50%',
        border: border_width + 'px solid ' + color,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
    }} />
}


const RectIndicator = ({ position, width, height, color, border_width = 1, unit = 'px', rotation = 0, }) => {
    return <div style={{
        position: 'absolute',
        left: `${position.x}${unit}`,
        top: `${position.y}${unit}`,
        width: width + 'px',
        height: height + 'px',
        border: border_width + 'px solid ' + color,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        pointerEvents: 'none'
    }} />
}

export const ColorPicker = ({ selectedColor, setSelectedColor }) => {

    const updateColor = (type, value) => {
        setSelectedColor(prev => ({ ...prev, [type]: value }));
    };

    return (
        <div>
            <TriangularColorPicker size={300} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

            <div className="mt-4">
                <HSLControl selectedColor={selectedColor} label="H" value={selectedColor.h} min={0} max={360} onChange={(value) => updateColor('h', value)} />
                <HSLControl selectedColor={selectedColor} label="L" value={selectedColor.l} min={0} max={100} onChange={(value) => updateColor('l', value)} />
                <HSLControl selectedColor={selectedColor} label="S" value={selectedColor.s} min={0} max={100} onChange={(value) => updateColor('s', value)} />
            </div>
        </div>
    );
};

const HSLControl = ({ selectedColor, label, value, min, max, onChange }) => {

    const sliderRef = useRef(null);
    const background =
        label === 'H' ? `linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%) ` :
            label === 'S' ? `linear-gradient(to right, hsl(${selectedColor.h}, 0%, ${selectedColor.l}%) 0%,  hsl(${selectedColor.h}, 100%, ${selectedColor.l}%) 100% ` :
                `linear-gradient(to right, hsl(${selectedColor.h}, ${selectedColor.s}%, 0%) 0%,  hsl(${selectedColor.h}, ${selectedColor.s}%, 50%) 50% ,  hsl(${selectedColor.h}, ${selectedColor.s}%, 100%) 100% `


    const handleSliderChange = (e) => {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const newValue = Math.round((x / rect.width) * (max - min) + min);
        onChange(Math.max(min, Math.min(max, newValue)));
    };

    const handleMouseDown = (e) => {
        handleSliderChange(e);
        document.addEventListener('mousemove', handleSliderChange);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleSliderChange);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="flex flex-row gap-4 mb-1 justify-between items-center  ">
            <label className="">{label} </label>
            <div
                ref={sliderRef}
                className={`flex-grow h-4 relative cursor-pointer border border-gray-500`}
                onMouseDown={handleMouseDown}
                style={{ background: `${background}` }}
            >

                <div
                    className="absolute -bottom-2 w-0 h-0 
                     border-l-[6px] border-l-transparent 
                     border-r-[6px] border-r-transparent 
                     border-b-[8px] border-b-gray-600"
                    style={{ left: `calc(${(value - min) / (max - min) * 100}% - 8px)` }}
                />
            </div>
            <input
                type="number"
                className="w-16 p-1"
                value={value}
                onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
                min={min}
                max={max}
            />
        </div>
    )
}


export const TriangularColorPickerDisplayColors = memo(({ hue = 30, size = 300, colors = [], colorisRGB = true }) => {
    const center = size / 2
    const ratio = size / 300
    ///////////////////////////Cirlce///////////////////////
    const radius = 25 * ratio

    /////////////////////////Triangle///////////////////////
    const bb = {
        x1: 88 * ratio, y1: 45 * ratio,
        x2: 269 * ratio, y2: 255 * ratio
    }
    const w = bb.y2 - bb.y1

    if (colorisRGB && colors) {
        colors = colors.map(([r, g, b]) => rgbToHsl(r, g, b))
        colors = colors.map(([h, s, l]) => ({ h, s, l }));
    }

    const SVPosition = colors.map(({ s, l }) => getPositionFromSV({ s, v: l, w, bb, normalised: true }))
    const HuePosition = colors.map(({ h }) => getPositionFromHue(h + defaultHueShift / 360, radius, center, center, true))

    if (colors.length > 0) hue = colors[0].h * 360

    return (
        <div className={`w-[${size}px] h-[${size}px] relative`}>
            <Image className='absolute' src={color_wheel} alt="color_wheel" width={size} height={size} draggable={false} style={{
                userSelect: 'none',
                WebkitUserDrag: 'none',
                KhtmlUserDrag: 'none',
                MozUserDrag: 'none',
                OUserDrag: 'none',
            }} />
            <HueShiftImage
                src={"https://i.imgur.com/BRVZgWi.png"}
                width={size}
                height={size}
                alt="color_combined"
                hueShift={hue}
            />

            {SVPosition.map((position, index) => (
                <div key={index}>
                    <CircleIndicator position={position} width={10} height={10} color="white" border_width={2} />
                    <CircleIndicator position={position} width={12} height={12} color="black" />
                </div>
            ))}

            {HuePosition.map((position, index) => (
                <div key={index}>
                    <RectIndicator position={position} width={10} height={22} color="white" border_width={2} rotation={colors[index].h * 360 + 90 + defaultHueShift} />
                    <RectIndicator position={position} width={12} height={24} color="black" rotation={colors[index].h * 360 + 90 + defaultHueShift} />
                </div>
            ))}
        </div>

    );
});
