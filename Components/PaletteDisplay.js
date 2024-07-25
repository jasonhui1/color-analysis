export default function PaletteDisplay({ colorPalette,
    onPaletteColorHover,
    onPaletteColorUnHover,
}) {
    return (
        <>
            {colorPalette.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
                    <div className="flex flex-wrap gap-4">
                        {colorPalette.map((color, index) => (
                            <div
                                key={index}
                                className="w-16 h-16 rounded-full cursor-pointer shadow-md flex items-center justify-center"
                                style={{ backgroundColor: `rgb(${color.join(",")})` }}
                                onMouseEnter={() => onPaletteColorHover(color)}
                                onMouseLeave={() => onPaletteColorUnHover()}
                            >
                                {/* <span
                  className="text-xs font-semibold"
                  style={{
                    color: getLuminance(color) > 0.5 ? "black" : "white",
                  }}
                >
                  {index + 1}
                </span> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
