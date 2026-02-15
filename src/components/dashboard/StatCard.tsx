import { Card, CardContent } from '../ui/Card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
    className?: string;
}

const colorStyles = {
    blue: { text: 'text-blue-600', bg: 'bg-blue-100' },
    green: { text: 'text-green-600', bg: 'bg-green-100' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-100' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-100' },
    red: { text: 'text-red-600', bg: 'bg-red-100' },
};

export function StatCard({ label, value, icon: Icon, trend, color = 'blue', className }: StatCardProps) {
    const styles = colorStyles[color];

    return (
        <Card className={cn("hover:shadow-md transition-shadow", className)}>
            <CardContent className="p-6 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
                    {trend && (
                        <p className={cn(
                            "text-xs font-medium mt-1 flex items-center",
                            trend.isPositive ? "text-green-600" : "text-red-600"
                        )}>
                            {trend.isPositive ? "+" : ""}{trend.value}%
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-full", styles.bg)}>
                    <Icon className={cn("w-6 h-6", styles.text)} />
                </div>
            </CardContent>
        </Card>
    );
}
