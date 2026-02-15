import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { SimpleBarChart, SimpleLineChart } from '../charts/SimpleCharts';
import { Download, ArrowLeft, Filter } from 'lucide-react';

import { User, Course, UserProgress } from '../../../types';

interface ReportViewProps {
    onBack: () => void;
    users?: User[];
    courses?: Course[];
    progress?: UserProgress[];
}

export function CourseCompletionView({ onBack, courses = [], progress = [] }: ReportViewProps) {
    const { t } = useTranslation();

    // Calculate dynamic data and sort by completions
    const sortedCourses = useMemo(() => {
        return [...courses].map(course => {
            const enrolled = progress.filter(p => p.courseId === course.id).length;
            const completed = progress.filter(p => p.courseId === course.id && p.status === 'completed').length;
            const rate = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;
            const scores = progress.filter(p => p.courseId === course.id && p.score !== undefined).map(p => p.score as number);
            const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';

            return {
                ...course,
                enrolled,
                completed,
                rate,
                avgScore
            };
        }).sort((a, b) => b.completed - a.completed);
    }, [courses, progress]);

    const chartData = sortedCourses.slice(0, 5).map(course => ({
        label: course.title,
        value: course.completed,
        color: '#3b82f6'
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack} size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('common.back')}
                    </Button>
                    <h2 className="text-xl font-bold text-gray-900">{t('reports.views.completion.title')}</h2>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {t('reports.actions.exportExcel')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('reports.views.completion.chartTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <SimpleBarChart data={chartData} height={300} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('reports.views.completion.tableTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">{t('reports.table.course')}</th>
                                    <th className="px-6 py-3">{t('reports.table.enrolled')}</th>
                                    <th className="px-6 py-3">{t('reports.table.completed')}</th>
                                    <th className="px-6 py-3">{t('reports.table.rate')}</th>
                                    <th className="px-6 py-3">{t('reports.table.avgScore')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCourses.map(course => (
                                    <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                                        <td className="px-6 py-4">{course.enrolled}</td>
                                        <td className="px-6 py-4">{course.completed}</td>
                                        <td className="px-6 py-4 text-green-600 font-medium">{course.rate}%</td>
                                        <td className="px-6 py-4">{course.avgScore === 'N/A' ? 'N/A' : `${course.avgScore}/100`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function UserPerformanceView({ onBack, users = [], progress = [] }: ReportViewProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack} size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('common.back')}
                    </Button>
                    <h2 className="text-xl font-bold text-gray-900">{t('reports.views.userPerformance.title')}</h2>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        {t('reports.actions.filter')}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        {t('reports.actions.exportExcel')}
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">{t('reports.table.name')}</th>
                                    <th className="px-6 py-3">{t('reports.table.restaurant')}</th>
                                    <th className="px-6 py-3">{t('reports.table.completedCourses')}</th>
                                    <th className="px-6 py-3">{t('reports.table.hours')}</th>
                                    <th className="px-6 py-3">{t('reports.table.lastActive')}</th>
                                    <th className="px-6 py-3">{t('reports.table.certificates')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => {
                                    const userProgress = progress.filter(p => p.userId === user.id);
                                    const completedCount = userProgress.filter(p => p.status === 'completed').length;
                                    const totalMinutes = userProgress
                                        .filter(p => p.status === 'completed')
                                        .reduce((acc) => {
                                            // Ideally we should have course durations here too, 
                                            // but for simplicity in the view let's use a rough estimate or just show the count
                                            return acc + 30; // 30 min per course estimate if duration not available
                                        }, 0);

                                    return (
                                        <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4">{user.tenantId}</td>
                                            <td className="px-6 py-4">{completedCount}</td>
                                            <td className="px-6 py-4">{Math.round(totalMinutes / 60)}h</td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">2026-02-15</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {user.badges?.length || 0} Badges
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function ActivityView({ onBack }: ReportViewProps) {
    const { t } = useTranslation();

    const activityData = [
        { label: 'Mon', value: 45 },
        { label: 'Tue', value: 120 },
        { label: 'Wed', value: 156 },
        { label: 'Thu', value: 142 },
        { label: 'Fri', value: 98 },
        { label: 'Sat', value: 45 },
        { label: 'Sun', value: 23 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack} size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('common.back')}
                    </Button>
                    <h2 className="text-xl font-bold text-gray-900">{t('reports.views.activity.title')}</h2>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('reports.views.activity.dailyLogins')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <SimpleLineChart data={activityData} height={300} />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('reports.views.activity.peakHours')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-sm">Heatmap Visualization Placeholder</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('reports.views.activity.deviceUsage')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Desktop</span>
                                <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[65%]"></div>
                                </div>
                                <span className="text-sm text-gray-500">65%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Mobile</span>
                                <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[30%]"></div>
                                </div>
                                <span className="text-sm text-gray-500">30%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Tablet</span>
                                <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[5%]"></div>
                                </div>
                                <span className="text-sm text-gray-500">5%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Placeholders for other views to keep file size manageable, 
// normally these would be separate files or fully implemented
export function RestaurantPerformanceView({ onBack }: ReportViewProps) {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.back')}
                </Button>
                <h2 className="text-xl font-bold text-gray-900">{t('reports.views.restaurant.title')}</h2>
            </div>
            <Card><CardContent className="p-8 text-center text-gray-500">Restaurant Performance Report Implementation</CardContent></Card>
        </div>
    );
}

export function CertificationsView({ onBack }: ReportViewProps) {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.back')}
                </Button>
                <h2 className="text-xl font-bold text-gray-900">{t('reports.views.certifications.title')}</h2>
            </div>
            <Card><CardContent className="p-8 text-center text-gray-500">Certifications Report Implementation</CardContent></Card>
        </div>
    );
}

export function AssessmentsView({ onBack }: ReportViewProps) {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.back')}
                </Button>
                <h2 className="text-xl font-bold text-gray-900">{t('reports.views.assessments.title')}</h2>
            </div>
            <Card><CardContent className="p-8 text-center text-gray-500">Assessments Report Implementation</CardContent></Card>
        </div>
    );
}
