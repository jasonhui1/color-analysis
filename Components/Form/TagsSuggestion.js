
export const TagsSuggestion = ({ suggestions, selectedIndex, onClickSuggestion, input, className = '' }) => {
    return (
        <>
            <ul className={"absolute z-10 w-full bg-white border rounded " + className}>
                {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => onClickSuggestion(suggestion)}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                        >
                            {suggestion}
                        </li>
                    ))
                ) : <li className={`p-2 bg-gray-100`} onClick={() => onClickSuggestion(input)}>Add new</li>}
            </ul>
        </>
    );

};
