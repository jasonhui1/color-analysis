import { MdOutlineEdit } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { calculateBrightness } from "../../utils/color";
import { TbPencilCancel } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";

export default function PaletteDisplay({ colorPalette, setColorPalette, colorPalettePercentage = [],
    onPaletteColorHover,
    onPaletteColorUnHover,
    onPaletteColorDelete,
    selectedColor, setSelectedColor
}) {

    const [hoveringIndex, setHoveringIndex] = useState(-1);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (selectedColor && isEditing) {
            const newPalette = [...colorPalette];
            newPalette[hoveringIndex] = selectedColor;
            setColorPalette(newPalette);
            // setIsEditing(false);
            // setHoveringIndex(-1);

        }
    }, [selectedColor]);

    const handleHover = (color, index) => {
        if (isEditing) return;
        setHoveringIndex(index);
        onPaletteColorHover(color)
    };

    const handleUnHover = () => {
        if (!isEditing) {
            setHoveringIndex(-1);
        }
        onPaletteColorUnHover();
    };

    const handleDelete = (color, index) => {
        onPaletteColorDelete(color, index)
        setHoveringIndex(-1);
        setIsEditing(false)
    }

    const addPaletteColor = () => {
        const newPalette = [...colorPalette, [0, 0, 0]];
        setColorPalette(newPalette);
        setHoveringIndex(newPalette.length - 1);
        setIsEditing(true);
    };

    return (
        <>
            {(
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
                    <div className="flex gap-4  flex-wrap">
                        {colorPalette.map((color, index) => (
                            <div key={index} onMouseEnter={() => handleHover(color, index)} onMouseLeave={() => handleUnHover()}    >
                                <div

                                    className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center relative "
                                    style={{ backgroundColor: `rgb(${color.join(",")})` }}

                                    onMouseDown={() => setSelectedColor(color)}
                                    onContextMenu={(e) => e.preventDefault()}
                                >


                                    {colorPalettePercentage.length > 0 && <PercentageText color={color} percentage={colorPalettePercentage[index]} />}
                                </div>


                                <div className={`flex justify-between ${hoveringIndex !== index ? 'opacity-0' : ''}`}>

                                    {!isEditing && <MdOutlineEdit className=" cursor-pointer w-6 h-6" color="blue" onClick={() => setIsEditing(true)} />}
                                    {isEditing && <TbPencilCancel className="cursor-pointer w-6 h-6" color="red" onClick={() => setIsEditing(false)} />}
                                    <FaDeleteLeft className="cursor-pointer w-6 h-6" color="white" stroke="red" strokeWidth={20} onClick={() => handleDelete(color, index)} />
                                </div>
                            </div>
                        ))}
                        <button onClick={addPaletteColor} className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center"><IoMdAdd size={25} /></button>
                    </div>
                </div>
            )}
        </>
    );
}

const PercentageText = ({ color, percentage }) => {
    return (
        <span
            className="text-xs font-semibold"
            style={{
                color: calculateBrightness(color) > 127 ? "black" : "white",
            }}
        >
            {percentage}%
        </span>
    )
}



export function PaletteDisplaySimple({ colorPalette, }) {
    return (
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
    );
}


export function PaletteDisplaySimpleV2({ colorPalette, onPaletteColorHover, onPaletteColorUnHover, onPaletteClick, colorPalettePercentage = [], showHeading = true }) {

    return (
        <div className="mt-4">
            {showHeading && <h2 className="text-xl font-semibold mb-2">Color Palette</h2>}
            <div className="flex gap-4">
                {colorPalette.map((color, index) => (
                    <div key={index} onMouseEnter={() => onPaletteColorHover(color)} onMouseLeave={() => onPaletteColorUnHover()} onClick={() => onPaletteClick(color)}    >
                        <div

                            className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center relative  "
                            style={{ backgroundColor: `rgb(${color.join(",")})` }}
                        >
                            {colorPalettePercentage.length > 0 && <PercentageText color={color} percentage={colorPalettePercentage[index]} />}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
