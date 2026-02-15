import { useMemo } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useDataStore } from '../../store/useDataStore';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { SimpleChart } from './SimpleChart';
import { DashboardFilters } from './DashboardFilters';
import { useTranslation } from 'react-i18next';

export function AdminDashboard() {
    const { user } = useAuthStore();
    const { users, courses, tenants, progress } = useDataStore();
    const { t } = useTranslation();

    if (!user) return null;

    // Dynamic Calculations
    const completionRate = useMemo(() => {
        if (progress.length === 0) return 0;
        const completed = progress.filter(p => p.status === 'completed').length;
        return Math.round((completed / progress.length) * 100);
    }, [progress]);

    const certificatesIssued = useMemo(() => {
        return progress.filter(p => p.status === 'completed').length;
    }, [progress]);

    const restaurantPerformance = useMemo(() => {
        return tenants.map(tenant => {
            const tenantUserIds = users.filter(u => u.tenantId === tenant.id).map(u => u.id);
            const tenantProgress = progress.filter(p => tenantUserIds.includes(p.userId));

            if (tenantProgress.length === 0) return { label: tenant.name, value: 0 };

            const completed = tenantProgress.filter(p => p.status === 'completed').length;
            const rate = Math.round((completed / tenantProgress.length) * 100);
            return { label: tenant.name, value: rate };
        }).sort((a, b) => b.value - a.value).slice(0, 5);
    }, [tenants, users, progress]);

    const popularCourses = useMemo(() => {
        const courseCounts: Record<string, number> = {};
        progress.forEach(p => {
            courseCounts[p.courseId] = (courseCounts[p.courseId] || 0) + 1;
        });

        return Object.entries(courseCounts)
            .map(([courseId, count]) => {
                const course = courses.find(c => c.id === courseId);
                return { label: course?.title || 'Unknown', value: count };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [progress, courses]);

    const handleExport = () => {
        alert("Exporting data to CSV...");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
                    <p className="text-gray-500">{t('admin.subtitle')}</p>
                </div>
                <DashboardFilters
                    onFilterChange={() => { }}
                    onExport={handleExport}
                    showRestaurantFilter={true}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label={t('admin.stats.totalUsers')}
                    value={users.length.toLocaleString()}
                    icon={Users}
                    color="blue"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    label={t('admin.stats.activeCourses')}
                    value={courses.length.toString()}
                    icon={BookOpen}
                    color="purple"
                />

                <StatCard
                    label={t('admin.stats.completionRate')}
                    value={`${completionRate}%`}
                    icon={TrendingUp}
                    color="green"
                    trend={{ value: 4, isPositive: true }}
                />
                <StatCard
                    label={t('admin.stats.certificatesIssued')}
                    value={certificatesIssued.toLocaleString()}
                    icon={Award}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.performanceByRestaurant')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleChart data={restaurantPerformance} type="bar" height={250} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.popularCourses')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleChart data={popularCourses} type="progress" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('admin.systemAlerts')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">Low Completion Rate - Mare Algarve</p>
                                            <p className="text-xs text-gray-500">Completion rate dropped below 70% this week.</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">2 hours ago</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.quickActions')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                            {t('admin.actions.generateReport')}
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                            {t('admin.actions.manageUsers')}
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                            {t('admin.actions.reviewContent')}
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
