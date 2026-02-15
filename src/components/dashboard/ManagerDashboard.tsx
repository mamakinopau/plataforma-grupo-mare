import { useAuthStore } from '../../store/useAuthStore';
import { useDataStore } from '../../store/useDataStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Users, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { SimpleChart } from './SimpleChart';
import { DashboardFilters } from './DashboardFilters';
import { useTranslation } from 'react-i18next';

export function ManagerDashboard() {
    const { user } = useAuthStore();
    const { courses, progress, tenants, users } = useDataStore();
    const { t } = useTranslation();


    if (!user) return null;

    // Mock data for charts (replace with real calculations in production)
    const complianceData = [
        { label: 'Kitchen', value: 85 },
        { label: 'Service', value: 92 },
        { label: 'Bar', value: 78 },
        { label: 'Management', value: 100 },
    ];

    const monthlyProgress = [
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 72 },
        { label: 'Mar', value: 85 },
        { label: 'Apr', value: 82 },
        { label: 'May', value: 90 },
        { label: 'Jun', value: 88 },
    ];

    // Calculate real stats
    const teamUsers = users.filter(u => u.tenantId === user.tenantId);
    const teamProgress = progress.filter(p => teamUsers.some(u => u.id === p.userId));

    const completedTrainings = teamProgress.filter(p => p.status === 'completed').length;
    const activeLearners = new Set(teamProgress.map(p => p.userId)).size;
    const overdueTrainings = 3;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('manager.title')}</h1>
                    <p className="text-gray-500">{t('manager.subtitle')}</p>
                </div>
                <DashboardFilters onFilterChange={() => { }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label={t('manager.stats.teamCompliance')}
                    value="87%"
                    icon={CheckCircle}
                    color="green"
                    trend={{ value: 5, isPositive: true }}
                />
                <StatCard
                    label={t('manager.stats.activeLearners')}
                    value={activeLearners.toString()}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    label={t('manager.stats.overdueTraining')}
                    value={overdueTrainings}
                    icon={AlertCircle}
                    color="red"
                    trend={{ value: 2, isPositive: false }}
                />

                <StatCard
                    label={t('manager.stats.avgQuizScore')}
                    value="92%"
                    icon={TrendingUp}
                    color="purple"
                    trend={{ value: 3, isPositive: true }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('manager.complianceByDept')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleChart data={complianceData} type="progress" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('manager.trainingActivity')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleChart data={monthlyProgress} type="bar" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('manager.teamAttention')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">{t('manager.table.employee')}</th>
                                    <th className="px-6 py-3">{t('manager.table.course')}</th>
                                    <th className="px-6 py-3">{t('manager.table.status')}</th>
                                    <th className="px-6 py-3">{t('manager.table.dueDate')}</th>
                                    <th className="px-6 py-3">{t('manager.table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamUsers.slice(0, 3).map((teamUser, idx) => {
                                    const userProg = progress.find(p => p.userId === teamUser.id);
                                    const course = courses.find(c => c.id === userProg?.courseId);

                                    return (
                                        <tr key={teamUser.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{teamUser.name}</td>
                                            <td className="px-6 py-4">{course?.title || 'Food Safety Basics'}</td>
                                            <td className={`px-6 py-4 ${idx === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                                                {idx === 0 ? t('manager.table.overdue') : t('manager.table.pending')}
                                            </td>
                                            <td className="px-6 py-4">Nov {15 + idx}, 2025</td>
                                            <td className="px-6 py-4">
                                                <button className="text-primary-600 hover:underline">{t('manager.table.remind')}</button>
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
