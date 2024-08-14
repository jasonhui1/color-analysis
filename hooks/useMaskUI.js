import { useState } from "react";

export function useMaskUI() {
    const [maskMode, setMaskMode] = useState(false);
    const [enableMask, setEnableMask] = useState(false);
    const [invertMask, setInvertMask] = useState(false);
    const [onlyHighlightMask, setOnlyHighlightMask] = useState(false);

    const reset = () => {
        setMaskMode(false);
        setEnableMask(false);
        setInvertMask(false);
    }


    return { maskMode, setMaskMode, enableMask, setEnableMask, invertMask, setInvertMask, onlyHighlightMask, setOnlyHighlightMask, reset };
}