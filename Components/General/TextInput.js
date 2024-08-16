


export function TextInput({ text, setText, label, type = 'text', classname = '', showBorder = true }) {

    const borderClassName = showBorder ? 'border-black border' : ''

    const onChange = (e) => {
        if (type === 'number') setText(Number(e.target.value))
        else setText(e.target.value)
    }
    return (
        <div className="w-fit flex gap-2">
            <label className="mr-4">{label}:</label>
            <input type={type} className={classname + ' ' + borderClassName} value={text} onChange={onChange} />
        </div>
    );
}


