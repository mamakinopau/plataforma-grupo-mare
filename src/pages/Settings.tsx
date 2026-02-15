import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';
import { CompanySettings } from '../components/settings/CompanySettings';
import { User, Bell, Monitor, Shield, Building2 } from 'lucide-react';
import { cn } from '../lib/utils';

type TabId = 'profile' | 'notifications' | 'appearance' | 'privacy' | 'company';

export function Settings() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabId>('profile');

    const tabs = [
        { id: 'profile', label: t('settings.tabs.profile'), icon: User },
        { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
        { id: 'appearance', label: t('settings.tabs.appearance'), icon: Monitor },
        { id: 'privacy', label: t('settings.tabs.privacy'), icon: Shield },
        ...(user?.role === 'admin' || user?.role === 'super_admin' ? [
            { id: 'company', label: t('settings.tabs.company'), icon: Building2 }
        ] : [])
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
                <p className="text-gray-500">{t('settings.subtitle')}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabId)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                        activeTab === tab.id
                                            ? "bg-primary-50 text-primary-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5",
                                        activeTab === tab.id ? "text-primary-600" : "text-gray-400"
                                    )} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'notifications' && <NotificationSettings />}
                    {activeTab === 'appearance' && <AppearanceSettings />}
                    {activeTab === 'privacy' && <PrivacySettings />}
                    {activeTab === 'company' && <CompanySettings />}
                </div>
            </div>
        </div>
    );
}
