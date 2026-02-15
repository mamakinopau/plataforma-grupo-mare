import { Card, CardContent } from '../ui/Card';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface ReportCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    onClick: () => void;
    color?: string;
}

export function ReportCard({ title, description, icon: Icon, onClick, color = "text-primary-600" }: ReportCardProps) {
    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-primary-500"
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-primary-50 transition-colors`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {description}
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>
            </CardContent>
        </Card>
    );
}
