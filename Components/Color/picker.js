import React, { useState, useRef, useEffect, memo } from 'react';
import color_wheel from "../../public/color_wheel.png";
import Image from 'next/image';
import HueShiftImage from './HueShiftImage';
import { FaRegCircle } from 'react-icons/fa';
import { getPositionFromSV, withinTriangle_strict, withinCircle, getSVFromPosition, getHueFromPosition, getPositionFromHue } from '../../utils/color_picker_calculation';
import { rgbToHsl } from '../../utils/color';
import { CircleIndicator, RectIndicator } from './PositionIndicators';
import ColorWheel from './ColorWheel';
import { HSLSlider } from './HLSSliderDisplay';

const defaultHueShift = 30 //by CSP
const TriangularColorPicker = ({ size = 300, selectedColor, setSelectedColor = null, isRGBSpace = false }) => {

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

    if (isRGBSpace) selectedColor = rgbToHsl(selectedColor.r, selectedColor.g, selectedColor.b)

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
        <div className={`w-[${size}px] h-[${size}px] relative`} onMouseDown={setSelectedColor && handleMouseDown} onMouseMove={setSelectedColor && handleMouseMove} onMouseUp={setSelectedColor && handleMouseUp} ref={divRef}>

            <ColorWheel size={size} hue={selectedColor.h} />

            {/* Indictator, one with white outline, one with black outline */}
            <CircleIndicator position={selectedColorPosition} diameter={10} color="white" border_width={2} />
            <CircleIndicator position={selectedColorPosition} diameter={12} color="black" />
            <RectIndicator position={selectedHuePosition} width={10} height={22} color="white" border_width={2} rotation={selectedColor.h + 90 + defaultHueShift} />
            <RectIndicator position={selectedHuePosition} width={12} height={24} color="black" rotation={selectedColor.h + 90 + defaultHueShift} />
        </div>

    );
};

export const ColorPicker = ({ size = 300, selectedColor, setSelectedColor = null, isRGBSpace = false, includeSliders = true }) => {

    return (
        <div className='flex flex-col'>
            <TriangularColorPicker size={size} selectedColor={selectedColor} setSelectedColor={setSelectedColor} isRGBSpace={isRGBSpace} />
            {includeSliders && <HSLSlider selectedColor={selectedColor} setSelectedColor={setSelectedColor} isRGBSpace={isRGBSpace} />}
        </div>
    );
};

export const TriangularColorPickerDisplayColors = memo(({ hue = 30, size = 300, colors = [], highlightColor = null, colorisRGB = true },) => {
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

    if (colorisRGB && colors.length > 0) {
        colors = colors.map((color) => {
            const [r, g, b] = color
            const hls = rgbToHsl(r, g, b, false, false)

            if (!highlightColor) return { ...hls, highlight: false }

            const [r_, g_, b_] = highlightColor
            if (r === r_ && g === g_ && b === b_) {
                return { ...hls, highlight: true }
            }

            return { ...hls, highlight: false }

        })
    }


    const SVPosition = colors.map(({ s, l, highlight }) => Object.assign({}, getPositionFromSV({ s, v: l, w, bb }), { highlight }))
    const HuePosition = colors.map(({ h, highlight }) => Object.assign({}, getPositionFromHue(h + defaultHueShift, radius, center, center), { highlight }))

    if (colors.length > 0) hue = colors[0].h


    return (
        <div className={`w-[${size}px] h-[${size}px] relative`}>
            <ColorWheel size={size} hue={hue} />

            {SVPosition.map(({ x, y, highlight }, index,) => (
                <div key={index} className={highlight ? 'z-10' : ''}>
                    <CircleIndicator position={{ x, y }} diameter={10} color="white" border_width={2} />
                    {highlight && <CircleIndicator position={{ x, y }} diameter={11} color="green" border_width={2} />}
                    <CircleIndicator position={{ x, y }} diameter={12} color="black" />
                </div>
            ))}

            {HuePosition.map(({ x, y, highlight }, index) => (
                <div key={index} className={highlight ? 'z-10' : ''}>
                    <RectIndicator position={{ x, y }} width={10} height={22} color="white" border_width={2} rotation={colors[index].h + 90 + defaultHueShift} />
                    {highlight && <RectIndicator position={{ x, y }} width={11} height={23} color="green" border_width={2} rotation={colors[index].h + 90 + defaultHueShift} />}

                    <RectIndicator position={{ x, y }} width={12} height={24} color="black" rotation={colors[index].h + 90 + defaultHueShift} />
                </div>
            ))}
        </div>

    );
});
