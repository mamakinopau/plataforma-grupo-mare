import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Megaphone, Trash2, Edit2, X, Check } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Announcement } from '../../types';
import { useTranslation } from 'react-i18next';

export function Announcements() {
    const { announcements, addAnnouncement, removeAnnouncement, toggleAnnouncement } = useNotificationStore();
    const { t } = useTranslation();
    const [isCreating, setIsCreating] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        priority: 'medium',
        isActive: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAnnouncement.title && newAnnouncement.content) {
            addAnnouncement({
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                priority: newAnnouncement.priority as 'low' | 'medium' | 'high',
                isActive: newAnnouncement.isActive || true,
            });
            setIsCreating(false);
            setNewAnnouncement({
                title: '',
                content: '',
                priority: 'medium',
                isActive: true,
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('announcements.title')}</h1>
                    <p className="text-gray-500">{t('announcements.subtitle')}</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {t('announcements.new')}
                </Button>
            </div>

            {isCreating && (
                <Card className="border-primary-100 shadow-md">
                    <CardHeader>
                        <CardTitle>{t('announcements.createTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('announcements.form.title')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    placeholder={t('announcements.form.titlePlaceholder')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('announcements.form.content')}</label>
                                <textarea
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    placeholder={t('announcements.form.contentPlaceholder')}
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('announcements.form.priority')}</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value={newAnnouncement.priority}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                                    >
                                        <option value="low">{t('announcements.form.priorities.low')}</option>
                                        <option value="medium">{t('announcements.form.priorities.medium')}</option>
                                        <option value="high">{t('announcements.form.priorities.high')}</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded text-primary-600 focus:ring-primary-500"
                                            checked={newAnnouncement.isActive}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isActive: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{t('announcements.form.activeImmediately')}</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>{t('announcements.form.cancel')}</Button>
                                <Button type="submit">{t('announcements.form.create')}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {announcements.map((announcement) => (
                    <Card key={announcement.id} className={`border-l-4 ${announcement.priority === 'high' ? 'border-l-red-500' :
                        announcement.priority === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'
                        }`}>
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${announcement.priority === 'high' ? 'bg-red-100 text-red-600' :
                                    announcement.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    <Megaphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        {t(announcement.title)}
                                        {!announcement.isActive && (
                                            <Badge className="text-xs">{t('announcements.inactive')}</Badge>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 mt-1">{t(announcement.content)}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                        <span>{t('announcements.created')} {new Date(announcement.createdAt).toLocaleDateString()}</span>
                                        <span className="capitalize">{t('announcements.priority')} {t(`announcements.form.priorities.${announcement.priority}`)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleAnnouncement(announcement.id)}
                                    className={`p-2 rounded-full transition-colors ${announcement.isActive
                                        ? 'text-green-600 hover:bg-green-50'
                                        : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                    title={announcement.isActive ? "Deactivate" : "Activate"}
                                >
                                    {announcement.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => removeAnnouncement(announcement.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}

                {announcements.length === 0 && !isCreating && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">{t('announcements.empty')}</p>
                        <p className="text-sm text-gray-400">{t('announcements.emptyDesc')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
