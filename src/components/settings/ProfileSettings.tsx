import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { User, Camera, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { useDataStore } from '../../store/useDataStore';

export function ProfileSettings() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuthStore();
    const { tenants } = useDataStore();

    // ... (keep existing state)

    const currentTenant = tenants.find(t => t.id === user?.tenantId);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [photoUrl, setPhotoUrl] = useState(user?.avatarUrl || '');
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (file: File) => {
        if (!user) return;
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            setPhotoUrl(publicUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Falha no upload da foto. Verifique as permissões de Storage.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        updateUser({
            name,
            email,
            phone,
            avatarUrl: photoUrl
        });

        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Alterações gravadas com sucesso!');
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.profile.title')}</CardTitle>
                    <p className="text-sm text-gray-500">{t('settings.profile.subtitle')}</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-md overflow-hidden">
                                    {photoUrl || user?.avatarUrl ? (
                                        <img src={photoUrl || user?.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="profile-photo-input"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                />
                                <button
                                    type="button"
                                    disabled={uploading}
                                    onClick={() => document.getElementById('profile-photo-input')?.click()}
                                    className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium text-gray-900">{t('settings.profile.photo')}</h3>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={uploading}
                                        onClick={() => document.getElementById('profile-photo-input')?.click()}
                                    >
                                        {uploading ? 'A enviar...' : t('settings.profile.changePhoto')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => setPhotoUrl('')}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {t('settings.profile.removePhoto')}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label={t('settings.profile.fullName')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                label={t('settings.profile.email')}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                label={t('settings.profile.phone')}
                                type="tel"
                                placeholder="+351 912 345 678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <Input
                                label={t('settings.profile.restaurant')}
                                value={currentTenant?.name || 'Sem Restaurante associado'}
                                disabled
                            />
                            <Input
                                label={t('settings.profile.role')}
                                defaultValue={user?.role}
                                disabled
                                className="capitalize"
                            />
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('settings.profile.password.title')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label={t('settings.profile.password.current')}
                                    type="password"
                                />
                                <div className="space-y-4">
                                    <Input
                                        label={t('settings.profile.password.new')}
                                        type="password"
                                    />
                                    <Input
                                        label={t('settings.profile.password.confirm')}
                                        type="password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : t('settings.profile.save')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
