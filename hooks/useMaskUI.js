import { useState } from "react";

export function useMaskUI() {
    const [maskMode, setMaskMode] = useState(false);
    const [enableMask, setEnableMask] = useState(false);
    const [invertMask, setInvertMask] = useState(false);

    const resetMaskUI = () => {
        setMaskMode(false);
        setEnableMask(false);
        setInvertMask(false);
    }


    return { maskMode, setMaskMode, enableMask, setEnableMask, invertMask, setInvertMask, resetMaskUI };
}