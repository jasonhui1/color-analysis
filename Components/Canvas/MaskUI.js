import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import CheckBox from "../../Components/General/CheckBox";


export function MaskUI({ maskMode, setMaskMode,
    enableMask, setEnableMask,
    invertMask, setInvertMask,

    SAMImages, processSAM, onSAMIndexClick,
    onApplyMask
}) {

    const onChangeMaskMode = () => {
        setMaskMode(!maskMode)
        if (maskMode) setEnableMask(true)
    };


    return (
        <div className="flex flex-col gap-2">

            <div className="flex gap-4 items-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => onChangeMaskMode()}> {maskMode ? 'Exit Mask' : 'Enter Mask'} </button>
                {enableMask ? <IoMdEye cursor="pointer" onClick={() => setEnableMask(false)} size={24} /> : <IoMdEyeOff size={24} cursor="pointer" onClick={() => setEnableMask(true)} />}

                {/* <CheckBox label="Enable mask" checked={enableMask} onChange={() => setEnableMask(!enableMask)} /> */}
                <CheckBox label="Invert mask" checked={invertMask} onChange={() => setInvertMask(!invertMask)} />
                <button disabled={maskMode} className="bg-orange-500 hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => onApplyMask()}> Apply Mask</button>

            </div>
            <div className="flex gap-4 items-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => processSAM()}> Process SAM </button>
                {SAMImages.map((img, index) =>
                    <button key={index} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={() => onSAMIndexClick(index)}> {index} </button>
                )}
            </div>
        </div>
    )
}
