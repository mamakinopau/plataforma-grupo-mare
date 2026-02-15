import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Breadcrumbs() {
    const location = useLocation();
    const { t } = useTranslation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Map of path segments to translation keys or readable names
    const pathMap: Record<string, string> = {
        'admin': 'Admin',
        'users': t('team.title'),
        'courses': t('common.courses'),
        'reports': t('reports.title'),
        'settings': t('settings.title'),
        'profile': t('common.profile'),
        'leaderboard': t('common.leaderboard'),
        'help': t('common.help'),
        'announcements': t('common.announcements'),
        'tenants': 'Tenants',
        'new': 'New',
        'edit': 'Edit',
    };

    if (pathnames.length === 0) return null;

    return (
        <nav className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="flex items-center hover:text-primary-600 transition-colors">
                <Home className="w-4 h-4" />
            </Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const label = pathMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

                return (
                    <div key={to} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                        {isLast ? (
                            <span className="font-medium text-gray-900">{label}</span>
                        ) : (
                            <Link to={to} className="hover:text-primary-600 transition-colors">
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
