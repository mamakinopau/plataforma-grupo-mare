import { cn } from '../../lib/utils';

interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}

interface SimpleChartProps {
    data: ChartDataPoint[];
    type?: 'bar' | 'progress';
    height?: number;
    showValues?: boolean;
    className?: string;
}

export function SimpleChart({ data, type = 'bar', height = 200, showValues = true, className }: SimpleChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));

    if (type === 'progress') {
        return (
            <div className={cn("space-y-4", className)}>
                {data.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            <span className="text-gray-500">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-500", item.color || "bg-primary-600")}
                                style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={cn("flex items-end justify-between gap-2", className)} style={{ height }}>
            {data.map((item, index) => {
                const heightPercentage = (item.value / maxValue) * 100;
                return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                        {showValues && (
                            <div className="mb-2 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.value}
                            </div>
                        )}
                        <div
                            className={cn("w-full rounded-t-md transition-all duration-500 hover:opacity-80", item.color || "bg-primary-200")}
                            style={{ height: `${heightPercentage}%` }}
                        />
                        <div className="mt-2 text-xs text-gray-500 truncate w-full text-center" title={item.label}>
                            {item.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
