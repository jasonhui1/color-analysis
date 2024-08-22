import { rgbToHsl } from "@/utils/color";
import { useRef } from "react";


export const HSLSlider = ({ selectedColor, setSelectedColor = null, isRGBSpace = false, allowInput = true }) => {

    const updateColor = (type, value) => {
        setSelectedColor(prev => ({ ...prev, [type]: value }));
    };


    if (isRGBSpace) selectedColor = rgbToHsl(selectedColor.r, selectedColor.g, selectedColor.b)

    return (
        <div className="mt-4">
            <HSLControl selectedColor={selectedColor} label="H" value={selectedColor.h} min={0} max={360} onChange={setSelectedColor && updateColor('h', selectedColor.h)} allowInput={allowInput} />
            <HSLControl selectedColor={selectedColor} label="L" value={selectedColor.l} min={0} max={100} onChange={setSelectedColor && updateColor('l', selectedColor.l)} allowInput={allowInput}/>
            <HSLControl selectedColor={selectedColor} label="S" value={selectedColor.s} min={0} max={100} onChange={setSelectedColor && updateColor('s', selectedColor.s)} allowInput={allowInput}/>
        </div>
    )
}

const HSLControl = ({ selectedColor, label, value, min, max, onChange, allowInput = true }) => {

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
                className={`flex-grow h-4 relative border border-gray-500 ${allowInput ? 'cursor-pointer' : ''}`}
                onMouseDown={allowInput && handleMouseDown}
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
            {allowInput ?
                <input
                    type="number"
                    className="w-16 p-1 bg-transparent"
                    value={value}
                    onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
                    min={min}
                    max={max}
                />:
                <label className="text-sm w-8"> {value}</label>
            }
        </div>
    )
}
