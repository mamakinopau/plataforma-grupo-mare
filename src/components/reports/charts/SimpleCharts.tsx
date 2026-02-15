

interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    height?: number;
}

export function SimpleBarChart({ data, height = 200 }: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="flex items-end gap-2 w-full" style={{ height }}>
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex justify-end flex-col h-full">
                        <div
                            className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 relative group-hover:scale-[1.02]"
                            style={{
                                height: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: item.color || '#3b82f6'
                            }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                {item.value}
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 truncate w-full text-center" title={item.label}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

interface LineChartProps {
    data: { label: string; value: number }[];
    height?: number;
    color?: string;
}

export function SimpleLineChart({ data, height = 200, color = '#3b82f6' }: LineChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxValue) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full relative" style={{ height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Grid lines */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />

                {/* The Line */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                />

                {/* Area under the line */}
                <polygon
                    fill={color}
                    fillOpacity="0.1"
                    points={`0,100 ${points} 100,100`}
                    vectorEffect="non-scaling-stroke"
                />

                {/* Points */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - (d.value / maxValue) * 100;
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3" // Radius will be scaled, so we use vector-effect or just keep it simple for now
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            className="hover:r-4 transition-all cursor-pointer"
                        >
                            <title>{`${d.label}: ${d.value}`}</title>
                        </circle>
                    );
                })}
            </svg>
            <div className="flex justify-between mt-2">
                {data.map((d, i) => (
                    <span key={i} className="text-xs text-gray-500">{d.label}</span>
                ))}
            </div>
        </div>
    );
}
