import { useEffect, useState } from "react"

export function useTagSuggestion({ input, setInput, all_tags, currentTags, setCurrentTags }) {
    const [suggestions, setSuggestions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        const value = input.trim()
        if (!value) { setSuggestions([]); return }

        const filtered = all_tags.filter(tag =>
            tag.toLowerCase().includes(value.toLowerCase()) && !currentTags.includes(tag)
        );

        setSuggestions(filtered);
        setSelectedIndex(0)
    }, [input]);


    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (suggestions[selectedIndex]) {
                onClickSuggestion(suggestions[selectedIndex])
            } else {
                if (input) setCurrentTags([...currentTags, input])
            }
            setInput('')
            setSuggestions([])
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((selectedIndex + 1) % suggestions.length);
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((selectedIndex - 1 + suggestions.length) % suggestions.length);
        }
    }


    const onClickSuggestion = (suggestion) => {
        setInput('')
        setCurrentTags([...currentTags, suggestion])
    }

    return { suggestions, selectedIndex, onKeyDown, onClickSuggestion }

}