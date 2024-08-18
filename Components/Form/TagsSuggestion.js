
export const TagsSuggestion = ({ suggestions, selectedIndex, onClickSuggestion }) => {
    return (
        <>
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
        </>
    );

};
