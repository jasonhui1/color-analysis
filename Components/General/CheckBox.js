const CheckBox = ({ checked, onChange, label }) => {
    return (<label className="flex items-center cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="mr-1"
        />
        <span className="text-sm">{label}</span>
    </label>)
}
export default CheckBox;