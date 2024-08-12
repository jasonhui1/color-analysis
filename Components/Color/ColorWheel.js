import Image from 'next/image';
import color_wheel from "@/public/color_wheel.png";
import color_triangle from "@/public/color_triangle.png";
import HueShiftImage from './HueShiftImage';

export default function ColorWheel({ size, hue }) {
    return (
        <div className='relative pointer-events-none'>
            {/* Hue not correctly calculated I think, same as hue rotate */}
            {/* <div className='w-full h-full absolute' style={{ background: `hsl(${selectedColor.h}, 100%, 50%)`, mixBlendMode: 'hue', clipPath: `path('M 88 45 L 88 255 L 269 150 z')` }} /> */}
            <Image className='absolute' src={color_wheel} alt="color_wheel" width={size} height={size} draggable={false} style={{
                userSelect: 'none',
                WebkitUserDrag: 'none',
                KhtmlUserDrag: 'none',
                MozUserDrag: 'none',
                OUserDrag: 'none',
            }} />

            {/* Use Js canvas */}
            <HueShiftImage
                src={color_triangle}
                width={size}
                height={size}
                alt="color_combined"
                hueShift={hue}
            />
        </div>

    )
}