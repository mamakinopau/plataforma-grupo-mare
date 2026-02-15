import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Download, Eye, Smartphone, Laptop } from 'lucide-react';

export function PrivacySettings() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.privacy.title')}</CardTitle>
                    <p className="text-sm text-gray-500">{t('settings.privacy.subtitle')}</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Personal Data */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">{t('settings.privacy.data.title')}</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {t('settings.privacy.data.view')}
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                {t('settings.privacy.data.export')}
                            </Button>
                        </div>
                    </div>

                    {/* Security - Login History */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-medium text-gray-900">{t('settings.privacy.security.title')}</h3>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-700">{t('settings.privacy.security.devices')}</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Laptop className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Windows PC - Chrome</p>
                                            <p className="text-xs text-gray-500">Lisbon, Portugal • Current Session</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">iPhone 13 - Safari</p>
                                            <p className="text-xs text-gray-500">Lisbon, Portugal • 2 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
