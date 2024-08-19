import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import CheckBox from "../../Components/General/CheckBox";


export function MaskUI({ maskMode, setMaskMode,
    enableMask, setEnableMask,
    invertMask, setInvertMask,
    onApplyMask
}) {

    const onChangeMaskMode = () => {
        setMaskMode(!maskMode)
        if (maskMode) setEnableMask(true)
    };


    return (

        <div className="flex gap-4 items-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => onChangeMaskMode()}> {maskMode ? 'Exit Mask' : 'Enter Mask'} </button>
            <MaskEnableButton enableMask={enableMask} setEnableMask={setEnableMask} />
            {/* <CheckBox label="Enable mask" checked={enableMask} onChange={() => setEnableMask(!enableMask)} /> */}
            <CheckBox label="Invert mask" checked={invertMask} onChange={() => setInvertMask(!invertMask)} />
            <button disabled={maskMode} className="bg-orange-500 hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold py-2 px-4 rounded w-fit" onClick={() => onApplyMask()}> Apply Mask</button>

        </div>
    )
}

export function MaskEnableButton({ enableMask, setEnableMask, size = 24 }) {
    return (
        <div className="flex gap-4 items-center">
            {enableMask ?
                <IoMdEye cursor="pointer" onClick={() => setEnableMask(false)} size={size} /> :
                <IoMdEyeOff size={size} cursor="pointer" onClick={() => setEnableMask(true)} />
            }
        </div>
    )
}
