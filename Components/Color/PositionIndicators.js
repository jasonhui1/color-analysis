
export const CircleIndicator = ({ position, diameter, color, border_width = 1 }) => {
    return <div style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: diameter + 'px',
        height: diameter + 'px',
        borderRadius: '50%',
        border: border_width + 'px solid ' + color,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 'inherit',
    }} />
}

export const RectIndicator = ({ position, width, height, color, border_width = 1, unit = 'px', rotation = 0 }) => {
    return <div style={{
        position: 'absolute',
        left: `${position.x}${unit}`,
        top: `${position.y}${unit}`,
        width: width + 'px',
        height: height + 'px',
        border: border_width + 'px solid ' + color,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        zIndex: 'inherit',
    }} />
}
