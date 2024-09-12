import { useEffect, useState } from "react"

export function useTagSuggestion({ input, setInput, all_tags, currentTags, setCurrentTags, enableNewTag = true }) {
    const [suggestions, setSuggestions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [show, setShow] = useState(false)

    useEffect(() => {
        const value = input.trim()
        if (!value) { setSuggestions([]); setShow(false); return }

        let filtered = all_tags.filter(tag =>
            tag.toLowerCase().includes(value.toLowerCase()) && !currentTags.includes(tag)
        );

        setSuggestions(filtered);
        setSelectedIndex(0)
        setShow(true)
    }, [input]);

    const onFocus = () => {
        if (input.trim()) setShow(true)
    }

    const onBlur = () => {
        // Debounce, click does not fire otherwise
        let timeout = setTimeout(() => {
            setShow(false)
            clearTimeout(timeout);
        }, 100);
    }

    const onHover = (index) => {
        setSelectedIndex(index)
    }

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (show && suggestions[selectedIndex]) {
                addTag(suggestions[selectedIndex])
            } else {
                if (enableNewTag) addTag(input)
            }
        }

        if(e.key === 'Escape') {
            setShow(false)
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


    const addTag = (suggestion) => {
        setInput('')
        setCurrentTags([...currentTags, suggestion])
    }

    return { suggestions, selectedIndex, onKeyDown, addTag, show, onFocus, onBlur, onHover }

}