import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Building, Users, Globe, Edit2, Trash2, Check, X, Camera } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { Tenant } from '../../types';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';

export function TenantManagement() {
    const { tenants, addTenant, updateTenant, deleteTenant } = useDataStore();
    const { t } = useTranslation();

    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Tenant>>({
        name: '',
        slug: '',
        domain: '',
        logoUrl: '',
        maxSeats: 50,
        subscriptionStatus: 'trial',
        theme: { primaryColor: '#0f172a', secondaryColor: '#3b82f6' }
    });

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            domain: '',
            logoUrl: '',
            maxSeats: 50,
            subscriptionStatus: 'trial',
            theme: { primaryColor: '#0f172a', secondaryColor: '#3b82f6' }
        });
        setIsCreating(false);
        setEditingId(null);
    };

    const handleEdit = (tenant: Tenant) => {
        setFormData({
            ...tenant,
            theme: tenant.theme || { primaryColor: '#0f172a', secondaryColor: '#3b82f6' }
        });
        setEditingId(tenant.id);
        setIsCreating(true);
    };

    const handleLogoUpload = async (file: File) => {
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `tenant-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, logoUrl: publicUrl }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Falha no upload do logo. Verifique as permissões.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.slug) return;

        if (editingId) {
            updateTenant(editingId, formData);
        } else {
            addTenant(formData as Omit<Tenant, 'id' | 'createdAt'>);
        }
        resetForm();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('tenantManagement.title')}</h1>
                    <p className="text-gray-500">{t('tenantManagement.subtitle')}</p>

                </div>
                <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {t('tenantManagement.new')}
                </Button>
            </div>

            {isCreating && (
                <Card className="border-primary-100 shadow-md">
                    <CardHeader>
                        <CardTitle>{editingId ? t('tenantManagement.editTitle') : t('tenantManagement.createTitle')}</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <div
                                        className="w-24 h-24 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50"
                                        style={{ backgroundColor: formData.logoUrl ? 'white' : formData.theme?.primaryColor || '#0f172a' }}
                                    >
                                        {formData.logoUrl ? (
                                            <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-white font-bold text-2xl">
                                                {formData.name?.substring(0, 2).toUpperCase() || 'LOGO'}
                                            </span>
                                        )}
                                    </div>
                                    <label htmlFor="logo-upload" className="absolute bottom-[-10px] right-[-10px] p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 border border-gray-200">
                                        <Camera className="w-4 h-4 text-gray-600" />
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                                            disabled={uploading}
                                        />
                                    </label>
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('tenantManagement.form.name')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        placeholder={t('tenantManagement.form.namePlaceholder')}
                                    />

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('tenantManagement.form.slug')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder={t('tenantManagement.form.slugPlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('tenantManagement.form.domain')}</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.domain}
                                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                        placeholder={t('tenantManagement.form.domainPlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('tenantManagement.form.maxSeats')}</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.maxSeats}
                                        onChange={(e) => setFormData({ ...formData, maxSeats: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('tenantManagement.form.primaryColor')}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            className="h-10 w-10 rounded border cursor-pointer"
                                            value={formData.theme?.primaryColor}
                                            onChange={(e) => setFormData({ ...formData, theme: { ...formData.theme!, primaryColor: e.target.value } })}
                                        />
                                        <span className="text-sm text-gray-500">{formData.theme?.primaryColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('tenantManagement.form.status')}</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.subscriptionStatus}
                                        onChange={(e) => setFormData({ ...formData, subscriptionStatus: e.target.value as any })}
                                    >
                                        <option value="active">{t('tenantManagement.form.active')}</option>
                                        <option value="trial">{t('tenantManagement.form.trial')}</option>
                                        <option value="inactive">{t('tenantManagement.form.inactive')}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={resetForm}>{t('tenantManagement.form.cancel')}</Button>
                                <Button type="submit">{editingId ? t('tenantManagement.form.update') : t('tenantManagement.form.create')}</Button>

                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tenants.map((tenant) => (
                    <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                                        style={{ backgroundColor: tenant.theme?.primaryColor || '#000' }}
                                    >
                                        {tenant.logoUrl && !tenant.logoUrl.includes('ui-avatars') ? (
                                            <img src={tenant.logoUrl} alt={tenant.name} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            tenant.name.substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{tenant.name}</h3>
                                        <a href={`https://${tenant.domain || tenant.slug + '.lms.com'}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            {tenant.domain || tenant.slug}
                                        </a>
                                    </div>
                                </div>
                                <Badge variant={tenant.subscriptionStatus === 'active' ? 'success' : 'warning'}>
                                    {tenant.subscriptionStatus}
                                </Badge>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {t('tenantManagement.card.maxSeats')}</span>
                                    <span className="font-medium">{tenant.maxSeats}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><Building className="w-4 h-4" /> {t('tenantManagement.card.created')}</span>
                                    <span className="font-medium">{new Date(tenant.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(tenant)}>
                                    <Edit2 className="w-4 h-4 mr-2" /> {t('tenantManagement.card.edit')}
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => deleteTenant(tenant.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
