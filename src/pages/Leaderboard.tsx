import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Crown } from 'lucide-react';

import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

import { useDataStore } from '../store/useDataStore';

export function Leaderboard() {
    const [scopeFilter, setScopeFilter] = useState<'global' | 'restaurant'>('global');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const { t } = useTranslation();
    const { users, tenants } = useDataStore();


    const roles = [
        { id: 'all', label: 'Tudo' },
        { id: 'Empregado de Mesa', label: 'Empregados' },
        { id: 'Cozinheiro', label: 'Cozinheiros' },
        { id: 'Gerente', label: 'Gerentes' }
    ];

    // Filter and sort users by points
    const displayedUsers = [...users]
        .filter(u => scopeFilter === 'global' || u.tenantId === 't1')
        .filter(u => roleFilter === 'all' || u.position === roleFilter || (roleFilter === 'Gerente' && u.role === 'manager'))
        .sort((a, b) => (b.points || 0) - (a.points || 0));



    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('leaderboard.title')}</h1>
                    <p className="text-gray-500">{t('leaderboard.subtitle')}</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            scopeFilter === 'global' ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                        onClick={() => setScopeFilter('global')}
                    >
                        {t('leaderboard.global')}
                    </button>
                    <button
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            scopeFilter === 'restaurant' ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                        onClick={() => setScopeFilter('restaurant')}
                    >
                        {t('leaderboard.myRestaurant')}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
                {roles.map(role => (
                    <button
                        key={role.id}
                        onClick={() => setRoleFilter(role.id)}
                        className={cn(
                            "px-4 py-1.5 text-xs font-semibold rounded-full border transition-all",
                            roleFilter === role.id
                                ? "bg-primary-600 text-white border-primary-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                        )}
                    >
                        {role.label}
                    </button>
                ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top 3 Podium */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {displayedUsers.slice(0, 3).map((user, index) => (
                        <Card key={user.id} className={cn(
                            "relative overflow-hidden border-2",
                            index === 0 ? "border-yellow-400 bg-yellow-50 md:-mt-4 md:order-2" :
                                index === 1 ? "border-gray-300 bg-gray-50 md:order-1" :
                                    "border-orange-300 bg-orange-50 md:order-3"
                        )}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <Crown className="w-24 h-24" />
                                </div>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mb-4 shadow-sm",
                                    index === 0 ? "bg-yellow-500" :
                                        index === 1 ? "bg-gray-400" :
                                            "bg-orange-400"
                                )}>
                                    {index + 1}
                                </div>
                                <div className="relative">
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        className={cn(
                                            "w-20 h-20 rounded-full border-4 mb-3",
                                            index === 0 ? "border-yellow-400" :
                                                index === 1 ? "border-gray-300" :
                                                    "border-orange-300"
                                        )}
                                    />
                                    {index === 0 && (
                                        <Crown className="w-8 h-8 text-yellow-500 absolute -top-4 -right-2 fill-yellow-500" />
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{user.position || user.role} • {tenants.find(t => t.id === user.tenantId)?.name || 'Restaurante'}</p>

                                <div className="bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100">
                                    <span className="font-bold text-primary-600">{user.points} XP</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Rest of the list */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t('leaderboard.rankings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {displayedUsers.slice(3).map((user, index) => (
                                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400">
                                            {index + 4}
                                        </div>
                                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.position || user.role} • {tenants.find(t => t.id === user.tenantId)?.name || 'Restaurante'}</p>
                                        </div>

                                    </div>
                                    <div className="font-bold text-gray-900">{user.points} XP</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
