import { getPaletteClient } from "@/lib/clientApis/palette";
import { useEffect, useState } from "react";

export function useFetchPalettesData({ searchToggle = true, setSearchToggle = (bool) => { }, searchTags = [], paletteId = null, withTags = true, performSearch = true, }) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getData() {
        if (!performSearch) return
        setLoading(true)
        try {
            const data = await getPaletteClient({ withTags, searchTags, paletteId })
            console.log('data :>> ', data);
            if (data && data.palette) {
                if (data.percentage === undefined) data.percentage = []
            }
            setData(data)
        } catch (error) {
            console.log('error :>> ', error);
            setError(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (!searchToggle) return
        getData()
        setSearchToggle(false);
    }, [searchToggle])

    return { data, loading, error }

}