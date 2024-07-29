import { MdOutlineEdit } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { hslToRgb, isColorEqual } from "../../utils/color";
import { TbPencilCancel } from "react-icons/tb";

export default function PaletteDisplay({ colorPalette, setColorPalette,
    onPaletteColorHover,
    onPaletteColorUnHover,
    onPaletteColorDelete,
    selectedColor, setSelectedColor
}) {

    const [hoveringColor, setHoveringColor] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (selectedColor && isEditing) {
            const newPalette = colorPalette.map((c) => (isColorEqual(c, hoveringColor) ? selectedColor : c));
            setColorPalette(newPalette);
            setHoveringColor(selectedColor);
        }
    }, [selectedColor]);

    const handleHover = (color) => {
        setHoveringColor(color);
        onPaletteColorHover(color)
    };

    const handleUnHover = () => {
        if (!isEditing) {
            setHoveringColor([]);
        }
        onPaletteColorUnHover();
    };

    return (
        <>
            {colorPalette.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
                    <div className="flex gap-4">
                        {colorPalette.map((color, index) => (
                            <div key={index} onMouseEnter={() => handleHover(color)} onMouseLeave={() => handleUnHover()}    >
                                <div

                                    className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center relative  "
                                    style={{ backgroundColor: `rgb(${color.join(",")})` }}

                                    onMouseDown={() => setSelectedColor(color)}
                                    onContextMenu={(e) => e.preventDefault()}
                                >

                                    {/* <span
                  className="text-xs font-semibold"
                  style={{
                    color: getLuminance(color) > 0.5 ? "black" : "white",
                  }}
                >
                  {index + 1}
                </span> */}
                                </div>

                                <div className={`flex justify-between ${!isColorEqual(color, hoveringColor) ? 'opacity-0' : ''}`}>

                                    {!isEditing && <MdOutlineEdit className=" cursor-pointer w-6 h-6" color="blue" onClick={() => setIsEditing(true)} />}
                                    {isEditing && <TbPencilCancel className="cursor-pointer w-6 h-6" color="red" onClick={() => setIsEditing(false)} />}
                                    <FaDeleteLeft className="cursor-pointer w-6 h-6" color="white" stroke="red" strokeWidth={20} onClick={() => onPaletteColorDelete(color)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}


export function PaletteDisplaySimple({ colorPalette }) {
    return (
        <>
            {colorPalette.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
                    <div className="flex gap-4">

                        {colorPalette.map((color, index) => (
                            <div
                                key={index}
                                className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center relative  "
                                style={{ backgroundColor: `rgb(${color.join(",")})` }}
                            >
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}


export function PaletteDisplaySimpleV2({ colorPalette, onPaletteColorHover, onPaletteColorUnHover, }) {

    const [hoveringColor, setHoveringColor] = useState([]);

    const handleHover = (color) => {
        setHoveringColor(color);
        onPaletteColorHover(color)
    };

    const handleUnHover = () => {
        onPaletteColorUnHover();
    };

    return (
        <>
            {colorPalette.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
                    <div className="flex gap-4">
                        {colorPalette.map((color, index) => (
                            <div key={index} onMouseEnter={() => handleHover(color)} onMouseLeave={() => handleUnHover()}    >
                                <div

                                    className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center relative  "
                                    style={{ backgroundColor: `rgb(${color.join(",")})` }}
                                >
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
