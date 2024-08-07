


export function TextInput({ text, setText, label, type='text', classname='' }) {
    return (
        <div className="w-fit">
            <label className="mr-4">{label}:</label>
            <input type={type} className={classname + " border-black border"} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
    );
}


