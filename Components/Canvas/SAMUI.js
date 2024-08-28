
const SAMUI = ({ canvas, SAM, onClickIndex }) => {
    const { mode, setMode, process, images } = SAM
    return (
        <div className="flex flex-col gap-2">
            <button onClick={() => setMode(!mode)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> {!mode ? 'Edit positions' : 'Exit '}</button>

            <div className="flex gap-4 items-center">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => process(canvas)}> Process SAM </button>
                {images.map((img, index) =>
                    <button key={index} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={() => onClickIndex(index)}> {index} </button>
                )}
            </div>
        </div>
    )
}

export default SAMUI