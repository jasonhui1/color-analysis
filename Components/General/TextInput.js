
export function TextInput({ text, setText, label }) {
    return (
        <div>
            <label className="mr-4">{label}:</label>
            <input type="text" className="min-w-96 border-black border" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
    );
}


