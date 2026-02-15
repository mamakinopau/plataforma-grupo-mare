import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Upload } from 'lucide-react';

export function CompanySettings() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.company.title')}</CardTitle>
                    <p className="text-sm text-gray-500">{t('settings.company.subtitle')}</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Branding */}
                        <div className="space-y-6">
                            <h3 className="font-medium text-gray-900">{t('settings.company.branding.title')}</h3>

                            <Input
                                label={t('settings.company.branding.name')}
                                defaultValue="Grupo Mare"
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">{t('settings.company.branding.logo')}</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                        <img src="https://ui-avatars.com/api/?name=Grupo+Mare&background=0D8ABC&color=fff" alt="Logo" className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <Button type="button" variant="outline" className="flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        {t('settings.company.branding.upload')}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.branding.primaryColor')}</label>
                                    <div className="flex gap-2">
                                        <input type="color" className="h-10 w-20 rounded border border-gray-300 cursor-pointer" defaultValue="#0f172a" />
                                        <Input defaultValue="#0f172a" className="flex-1" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.branding.secondaryColor')}</label>
                                    <div className="flex gap-2">
                                        <input type="color" className="h-10 w-20 rounded border border-gray-300 cursor-pointer" defaultValue="#fbbf24" />
                                        <Input defaultValue="#fbbf24" className="flex-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="space-y-6 pt-6 border-t">
                            <h3 className="font-medium text-gray-900">{t('settings.company.support.title')}</h3>
                            <Input
                                label={t('settings.company.support.email')}
                                type="email"
                                defaultValue="support@grupomare.com"
                            />
                        </div>

                        {/* Certificates */}
                        <div className="space-y-6 pt-6 border-t">
                            <h3 className="font-medium text-gray-900">{t('settings.company.certificates.title')}</h3>
                            <div className="max-w-xs">
                                <Input
                                    label={t('settings.company.certificates.validity')}
                                    type="number"
                                    defaultValue="12"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : t('settings.company.save')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
