import { getTagsClient } from '@/lib/clientApis/tags'
import { useEffect, useState } from 'react'

const useTags = () => {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getTags = async () => {
            setLoading(true)
            const data  = await getTagsClient()

            const tags = data.map(tag => tag.tag)
            setLoading(false)
            setTags(tags)
        }

        getTags()
    }, [])

    // const addNewTag = async (tag) => {
    //     setTags([...tags, tag])
    // }

    return { tags, loading }
}

export default useTags