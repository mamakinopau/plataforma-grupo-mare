import { Users, UserPlus, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/Card';
import { useDataStore } from '../../store/useDataStore';

export function UserStats() {
    const { t } = useTranslation();
    const { users } = useDataStore();

    // Calculate stats
    const totalUsers = users.length;

    // Active today = users who logged in today (or recently if null)
    const today = new Date().toISOString().split('T')[0];
    const activeToday = users.filter(u => u.lastLoginAt && u.lastLoginAt.startsWith(today)).length;

    // New this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = users.filter(u => {
        const joinDate = new Date(u.joinedAt);
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{t('team.stats.totalUsers')}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            Total registered users
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
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeToday}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {totalUsers > 0 ? Math.round((activeToday / totalUsers) * 100) : 0}% of total users
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
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{newThisMonth}</h3>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                            Joined recently
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
