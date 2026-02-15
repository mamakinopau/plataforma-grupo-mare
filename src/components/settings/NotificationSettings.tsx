import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAuthStore } from '../../store/useAuthStore';

export function NotificationSettings() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Configurações de notificações atualizadas!');
        setIsLoading(false);
    };

    const handleTestNotification = () => {
        alert('Teste de Notificação: Se as notificações estivessem ativas, você veria um alerta agora! (Sistema de testes configurado)');
    };

    const updatePref = (key: string, value: boolean) => {
        if (!user) return;
        updateUser({
            preferences: {
                ...user.preferences,
                [key]: value
            } as any
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('settings.notifications.title')}</CardTitle>
                        <p className="text-sm text-gray-500">{t('settings.notifications.subtitle')}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleTestNotification}>
                        Testar Notificações
                    </Button>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Email Notifications */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">{t('settings.notifications.email.title')}</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">{t('settings.notifications.email.assigned')}</label>
                                <Switch
                                    checked={user?.preferences.emailNotifications}
                                    onCheckedChange={(checked) => updatePref('emailNotifications', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">{t('settings.notifications.email.deadline')}</label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">{t('settings.notifications.email.certificate')}</label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">{t('settings.notifications.email.newsletter')}</label>
                                <Switch
                                    checked={user?.preferences.marketingEmails}
                                    onCheckedChange={(checked) => updatePref('marketingEmails', checked)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-medium text-gray-900">{t('settings.notifications.push.title')}</h3>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-700">{t('settings.notifications.push.enable')}</label>
                            <Switch
                                checked={user?.preferences.pushNotifications}
                                onCheckedChange={(checked) => updatePref('pushNotifications', checked)}
                            />
                        </div>
                    </div>

                    {/* Reminders */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-medium text-gray-900">{t('settings.notifications.reminders.title')}</h3>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-700">{t('settings.notifications.reminders.daily')}</label>
                            <Switch defaultChecked />
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="max-w-xs">
                            <Select
                                label={t('settings.notifications.frequency.label')}
                                options={[
                                    { value: 'daily', label: t('settings.notifications.frequency.daily') },
                                    { value: 'weekly', label: t('settings.notifications.frequency.weekly') },
                                    { value: 'never', label: t('settings.notifications.frequency.never') },
                                ]}
                                defaultValue="daily"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? 'Saving...' : t('settings.notifications.save')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
