
const ImageTagDisplay = ({ tag, onClick }) => {
    return (
        <div className='bg-gray-200 px-2 py-1 rounded-md cursor-pointer text-sm' onClick={onClick}>{tag}</div>
    )
}

export const ImageTagsDisplay = ({ tags, onClickTag }) => {
    return (
        <div className='flex gap-2 flex-wrap'>
            {tags && tags.map((tag, index) =>
                <ImageTagDisplay key={index} tag={tag} onClick={() => onClickTag(tag)} />)
            }
        </div>
    )
}
