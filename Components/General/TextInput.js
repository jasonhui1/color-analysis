


export function TextInput({ text, setText, label, type = 'text', classname = '' }) {

    const onChange = (e) => {
        if (type === 'number') setText(Number(e.target.value))
        else setText(e.target.value)
    }
    return (
        <div className="w-fit">
            <label className="mr-4">{label}:</label>
            <input type={type} className={classname + " border-black border"} value={text} onChange={onChange} />
        </div>
    );
}


