import { getPaletteClient } from "@/lib/clientApis/palette";
import { useEffect, useState } from "react";

export function useFetchPalettesData({ searchToggle, setSearchToggle, searchTags, maxSize }) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getData() {
        setLoading(true)
        const data = await getPaletteClient({ withTags: true, searchTags: searchTags, imageMaxWidth: maxSize, imageMaxHeight: maxSize })
        if (data && data.palette) {
            if (data.percentage === undefined) data.percentage = []
        }
        setData(data)
        setLoading(false)
    }

    useEffect(() => {
        if (!searchToggle) return
        getData()
        setSearchToggle(false);
    }, [searchToggle])

    return { data, loading, error }

}