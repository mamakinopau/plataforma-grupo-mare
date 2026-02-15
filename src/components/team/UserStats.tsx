import { Users, UserPlus, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/Card';

export function UserStats() {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{t('team.stats.totalUsers')}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">1,245</h3>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                            <span className="bg-green-100 px-1.5 py-0.5 rounded-full mr-1">+12%</span>
                            from last month
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{t('team.stats.activeToday')}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">842</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            68% of total users
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <UserCheck className="w-6 h-6 text-green-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{t('team.stats.newThisMonth')}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">48</h3>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                            <span className="bg-green-100 px-1.5 py-0.5 rounded-full mr-1">+4</span>
                            from last week
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <UserPlus className="w-6 h-6 text-purple-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
