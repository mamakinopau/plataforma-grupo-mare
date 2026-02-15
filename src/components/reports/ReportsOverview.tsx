import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/Card';
import { Users, BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import { User, Course, UserProgress } from '../../types';

interface ReportsOverviewProps {
    users: User[];
    courses: Course[];
    progress: UserProgress[];
}

export function ReportsOverview({ users, courses, progress }: ReportsOverviewProps) {
    const { t } = useTranslation();

    // Calculate real metrics
    const activeUsersCount = users.filter(u => u.isActive).length;
    const totalCoursesCount = courses.length;

    // Certificates: Unique course completions
    const certificateCount = progress.filter(p => p.status === 'completed').length;

    // Total Hours: Sum of duration for completed courses
    const totalMinutes = progress
        .filter(p => p.status === 'completed')
        .reduce((acc, current) => {
            const course = courses.find(c => c.id === current.courseId);
            return acc + (course?.durationMinutes || 0);
        }, 0);
    const totalHours = Math.round(totalMinutes / 60);

    // Completion Rate: (Completions / Expected Total)
    // For a simplified calculation, let's assume each user should complete all mandatory courses
    const mandatoryCourses = courses.filter(c => c.isMandatory);
    const totalExpected = users.length * mandatoryCourses.length;
    const completionsForMandatory = progress.filter(p => {
        const isMandatory = mandatoryCourses.some(m => m.id === p.courseId);
        return isMandatory && p.status === 'completed';
    }).length;

    const avgCompletionRate = totalExpected > 0 ? Math.round((completionsForMandatory / totalExpected) * 100) : 0;

    const metrics = [
        {
            label: t('reports.overview.activeUsers'),
            value: activeUsersCount.toLocaleString(),
            change: "+12%", // In a real app, this would be calculated comparing to previous period
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: t('reports.overview.totalCourses'),
            value: totalCoursesCount.toString(),
            change: "+3",
            icon: BookOpen,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            label: t('reports.overview.completionRate'),
            value: `${avgCompletionRate}%`,
            change: "+5%",
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            label: t('reports.overview.certificates'),
            value: certificateCount.toLocaleString(),
            change: "+24",
            icon: Award,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            label: t('reports.overview.totalHours'),
            value: `${totalHours.toLocaleString()}h`,
            change: "+150h",
            icon: Clock,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                    <Card key={index}>
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${metric.bg}`}>
                                    <Icon className={`w-5 h-5 ${metric.color}`} />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    {metric.change}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">{metric.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
