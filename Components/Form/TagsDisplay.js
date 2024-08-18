import { TiDeleteOutline } from "react-icons/ti";


export const TagsDisplay = ({ tags, onRemove }) => {
    return (
        <>
            {tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                    {tag}
                    <button onClick={() => onRemove(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                        <TiDeleteOutline size={14} color="black" />
                    </button>
                </span>
            ))}
        </>
    );
};
