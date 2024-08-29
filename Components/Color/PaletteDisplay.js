import { MdOutlineEdit } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { calculateBrightness, isColorEqual } from "../../utils/color";
import { TbPencilCancel } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useColorPaletteInteractivity } from "@/hooks/useColorPalette";

export default function PaletteDisplay({
    colorPalette,
    setColorPalette = (newPalette) => { },
    colorPalettePercentage = [],
    title = "Color Palette",
    selectedColor = null,
    setSelectedColor = null, setHoveringColor = null,

    handleHover = (color) => { },
    handleUnhover = (color) => { },
    handleDelete = (color, index) => { },
    handleClick = () => { },
    handleEdit = () => { },
    enableAdd = true, enableDelete = true, enableEdit = true,
}) {

    const [isEditing, setIsEditing] = useState(false);

    const onDelete = (color, index) => {
        setIsEditing(false)
        handleDelete(color, index)
    }

    const { hoveringIndex, setHoveringIndex,
        onPaletteColorHover,
        onPaletteColorUnHover,
        onPaletteColorDelete,
        onPaletteColorClick
    } = useColorPaletteInteractivity({
        setPalette: setColorPalette, setSelectedColor, setHoveringColor,
        onHover: handleHover, onUnhover: handleUnhover, onDelete: onDelete, onClick: handleClick,
        updateHoverCondition: !isEditing, updateUnhoverCondition: !isEditing
    });


    useEffect(() => {
        if (selectedColor && isEditing) {
            const newPalette = [...colorPalette];
            newPalette[hoveringIndex] = selectedColor;
            if (isColorEqual(newPalette[hoveringIndex], colorPalette[hoveringIndex])) return

            setColorPalette(newPalette);
            handleEdit()
            // setIsEditing(false);
            // setHoveringIndex(-1);

        }
    }, [selectedColor]);

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
                    {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
                    <div className="flex gap-4  flex-wrap">
                        {colorPalette.map((color, index) => (
                            <div key={index} onMouseEnter={() => onPaletteColorHover(color, index)} onMouseLeave={() => onPaletteColorUnHover()}    >
                                <div

                                    className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center relative "
                                    style={{ backgroundColor: `rgb(${color.join(",")})` }}

                                    onMouseDown={() => onPaletteColorClick(color)}
                                    onContextMenu={(e) => e.preventDefault()}
                                >

                                    {colorPalettePercentage.length > 0 && <PercentageText color={color} percentage={colorPalettePercentage[index]} />}
                                </div>

                                {enableEdit &&
                                    <div className={`flex justify-between ${hoveringIndex !== index ? 'opacity-0' : ''}`}>

                                        {!isEditing && <MdOutlineEdit className=" cursor-pointer w-6 h-6" color="blue" onClick={() => setIsEditing(true)} />}
                                        {isEditing && <TbPencilCancel className="cursor-pointer w-6 h-6" color="red" onClick={() => setIsEditing(false)} />}
                                        {enableDelete && <FaDeleteLeft className="cursor-pointer w-6 h-6" color="white" stroke="red" strokeWidth={20} onClick={() => onPaletteColorDelete(color, index)} />}
                                    </div>
                                }
                            </div>
                        ))}
                        {enableAdd && <button onClick={addPaletteColor} className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center"><IoMdAdd size={25} /></button>}
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



// export function PaletteDisplaySimple({ colorPalette, }) {
//     return (
//         <div className="mt-4">
//             <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
//             <div className="flex gap-4">

//                 {colorPalette.map((color, index) => (
//                     <div
//                         key={index}
//                         className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center relative  "
//                         style={{ backgroundColor: `rgb(${color.join(",")})` }}
//                     >
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


// export function PaletteDisplaySimpleV2({ colorPalette, onPaletteColorHover, onPaletteColorUnHover, onPaletteColorClick, colorPalettePercentage = [], showHeading = true }) {

//     return (
//         <div>
//             {showHeading && <h2 className="text-xl font-semibold mb-2">Color Palette</h2>}
//             <div className="flex gap-4">
//                 {colorPalette.map((color, index) => (
//                     <div key={index} onMouseEnter={() => onPaletteColorHover(color)} onMouseLeave={() => onPaletteColorUnHover()} onClick={() => onPaletteColorClick(color)}    >
//                         <div

//                             className="w-16 h-16  rounded-2xl cursor-pointer shadow-md flex items-center justify-center relative  "
//                             style={{ backgroundColor: `rgb(${color.join(",")})` }}
//                         >
//                             {colorPalettePercentage.length > 0 && <PercentageText color={color} percentage={colorPalettePercentage[index]} />}
//                         </div>

//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
