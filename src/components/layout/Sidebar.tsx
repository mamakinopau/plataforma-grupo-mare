import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, BarChart3, Settings, LogOut, Trophy, Megaphone, HelpCircle, Building } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
    const { user, logout } = useAuthStore();
    const { t } = useTranslation();

    const links = [
        { to: '/', icon: LayoutDashboard, label: t('common.dashboard') },
        { to: '/courses', icon: BookOpen, label: t('common.courses') },
        { to: '/leaderboard', icon: Trophy, label: t('common.leaderboard') },
        ...(user?.role !== 'employee' ? [
            { to: '/reports', icon: BarChart3, label: t('common.reports') },
        ] : []),

        ...(user?.role === 'admin' || user?.role === 'super_admin' ? [
            { to: '/admin/users', icon: Users, label: t('common.users') },
            { to: '/admin/announcements', icon: Megaphone, label: t('common.announcements') },
            { to: '/admin/tenants', icon: Building, label: t('common.tenants') },
            { to: '/settings', icon: Settings, label: t('common.settings') },
        ] : []),


        { to: '/help', icon: HelpCircle, label: t('common.help') },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="h-40 flex items-center justify-center border-b border-gray-200 p-2">
                <img src="/logo.png" alt="Grupo Mare" className="h-full w-full object-contain" />
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            )
                        }
                    >
                        <link.icon className="w-5 h-5 mr-3" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <NavLink to="/profile" className="flex items-center mb-4 hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <img
                        src={user?.avatarUrl || "https://ui-avatars.com/api/?name=User"}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full mr-3 bg-gray-200"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                    </div>
                </NavLink>
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    {t('common.logout')}
                </button>
                <div className="mt-4 text-xs text-gray-400 text-center">
                    v1.1 (Debug)
                </div>
            </div>
        </aside>
    );
}
