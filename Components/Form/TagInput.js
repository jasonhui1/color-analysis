import useTags from "@/hooks/useTags"
import { TextInput } from "../General/TextInput"
import { useState, useEffect } from "react"
import { useTagSuggestion } from "@/hooks/useTagSuggestion";
import { TagsDisplay } from "./TagsDisplay";
import { TagsSuggestion } from "./TagsSuggestion";

const TagInput = ({ tags, setTags }) => {
    const { tags: all_tags, loading } = useTags()
    const [currentInput, setCurrentInput] = useState('')
    const { suggestions, selectedIndex, onKeyDown, addTag, show: showSuggestions, onFocus, onBlur, onHover } = useTagSuggestion({
        input: currentInput, setInput: setCurrentInput,
        all_tags, currentTags: tags, setCurrentTags: setTags
    })

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag))
    }

    return (
        <div className="relative"
         onKeyDown={onKeyDown} 
         onFocus={onFocus} 
         onBlur={onBlur}
         >
            <div className="flex flex-wrap gap-2 mb-2">
                <TagsDisplay tags={tags} onRemove={removeTag} />
                <TextInput text={currentInput} setText={setCurrentInput} label="Tag" />
            </div>
            {showSuggestions && <TagsSuggestion suggestions={suggestions} selectedIndex={selectedIndex} onClickSuggestion={addTag} onHover={onHover}input={currentInput} />}

        </div>

    )
}


export default TagInput