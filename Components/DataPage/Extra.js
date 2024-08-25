import { deletePaletteClient } from "@/lib/clientApis/palette";
import Link from "@/node_modules/next/link";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

export default function Extras({ paletteId, onDelete }) {

    const [open, setOpen] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false);
    // <button onClick={() => deletePaletteClient({ paletteId })}>X</button>

    const handleDelete = () => {
        if (showConfirmation) {
            deletePaletteClient({ paletteId })
            onDelete()
            setShowConfirmation(false);
        } else {
            setShowConfirmation(true);
        }
    };

    return (
        <div className="self-start p-2">
            <div className='flex flex-col gap-4 '>
                <BsThreeDots className='cursor-pointer' onClick={() => setOpen(!open)} size={20} />
                {open && (
                    <div className='flex flex-col gap-1 '>
                        <a className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded-md cursor-pointer" href={`./?paletteId=${paletteId}`} target="_blank">Edit</a>
                        {showConfirmation && (
                            <p className="text-red-500 px-2 py-1 rounded-md " >Are you sure you want to delete?</p>
                        )}
                        <button className="text-red-500 hover:text-red-700 px-2 py-1 rounded-md cursor-pointer border border-red-500" onClick={handleDelete}>{showConfirmation ? 'Confirm Delete' : 'Delete'}</button>
                    </div>
                )}
            </div>
        </div>
    )
}