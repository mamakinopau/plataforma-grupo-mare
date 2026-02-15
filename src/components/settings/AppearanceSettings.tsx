import { useTranslation } from 'react-i18next';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppearanceStore } from '../../store/useAppearanceStore';

export function AppearanceSettings() {
    const { t, i18n } = useTranslation();
    const { theme, fontSize, setTheme, setFontSize } = useAppearanceStore();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.appearance.title')}</CardTitle>
                    <p className="text-sm text-gray-500">{t('settings.appearance.subtitle')}</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Theme */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">{t('settings.appearance.theme.label')}</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme('light')}
                                className={cn(
                                    "border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all",
                                    theme === 'light' ? "border-primary-600 bg-white text-primary-600" : "border-transparent bg-gray-50 text-gray-500 hover:border-gray-200"
                                )}
                            >
                                <Sun className="w-6 h-6" />
                                <span className="text-sm font-medium">{t('settings.appearance.theme.light')}</span>
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={cn(
                                    "border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all",
                                    theme === 'dark' ? "border-primary-600 bg-gray-800 text-white" : "border-transparent bg-gray-50 text-gray-500 hover:border-gray-200"
                                )}
                            >
                                <Moon className="w-6 h-6" />
                                <span className="text-sm font-medium">{t('settings.appearance.theme.dark')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="max-w-xs">
                            <Select
                                label={t('settings.appearance.fontSize.label')}
                                options={[
                                    { value: 'small', label: t('settings.appearance.fontSize.small') },
                                    { value: 'medium', label: t('settings.appearance.fontSize.medium') },
                                    { value: 'large', label: t('settings.appearance.fontSize.large') },
                                ]}
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value as any)}
                            />
                        </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="max-w-xs">
                            <Select
                                label={t('settings.appearance.language.label')}
                                options={[
                                    { value: 'pt', label: 'Português' },
                                    { value: 'en', label: 'English' },
                                ]}
                                value={i18n.language}
                                onChange={(e) => changeLanguage(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="max-w-xs">
                            <Select
                                label={t('settings.appearance.timezone.label')}
                                options={[
                                    { value: 'Europe/Lisbon', label: 'Lisbon (GMT+0)' },
                                    { value: 'Europe/London', label: 'London (GMT+0)' },
                                    { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
                                ]}
                                defaultValue="Europe/Lisbon"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
