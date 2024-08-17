import useTags from "@/hooks/useTags"
import { TextInput } from "../General/TextInput"
import { useState, useEffect } from "react"
import { TiDeleteOutline } from "react-icons/ti";

const TagInput = ({ tags, setTags }) => {
    const { tags: all_tags, loading } = useTags()
    const [currentInput, setCurrentInput] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        const value = currentInput.trim()
        if (!value) { setSuggestions([]); return }

        const filtered = all_tags.filter(tag =>
            tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
        );
        setSuggestions(filtered);
        setSelectedIndex(0)
    }, [currentInput]);


    const onClickSuggestion = (suggestion) => {
        setCurrentInput('')
        setTags([...tags, suggestion])
    }

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (suggestions[selectedIndex]) {
                onClickSuggestion(suggestions[selectedIndex])
            } else {
                if (currentInput) setTags([...tags, currentInput])
            }
            setCurrentInput('')
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

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag))
    }

    return (
        <div className="relative" onKeyDown={onKeyDown}>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                            <TiDeleteOutline size={14} color="black" />
                        </button>
                    </span>
                ))}
                <TextInput text={currentInput} setText={setCurrentInput} label="Tag" />
            </div>

            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded mt-1">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => onClickSuggestion(suggestion)}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>

    )
}



export default TagInput