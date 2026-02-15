import { Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { NotificationBell } from '../notifications/NotificationBell';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
    const { user } = useAuthStore();
    const { t } = useTranslation();

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center flex-1">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <NotificationBell />
                <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <img
                        src={user?.avatarUrl || "https://ui-avatars.com/api/?name=User"}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full bg-gray-200"
                    />
                </div>
            </div>
        </header>
    );
}
