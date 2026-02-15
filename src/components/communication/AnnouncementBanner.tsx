import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useTranslation } from 'react-i18next';

export function AnnouncementBanner() {
    const { announcements } = useNotificationStore();
    const { t } = useTranslation();
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    // Get active announcements that haven't been dismissed
    const activeAnnouncements = announcements.filter(a =>
        a.isActive && !dismissedIds.includes(a.id)
    );

    if (activeAnnouncements.length === 0) return null;

    const currentAnnouncement = activeAnnouncements[0];

    const handleDismiss = () => {
        setDismissedIds([...dismissedIds, currentAnnouncement.id]);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-600';
            case 'medium': return 'bg-amber-600';
            case 'low': return 'bg-blue-600';
            default: return 'bg-blue-600';
        }
    };

    return (
        <div className={`${getPriorityColor(currentAnnouncement.priority)} text-white px-4 py-3 relative`}>
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 animate-pulse" />
                    <p className="font-medium text-sm sm:text-base">
                        <span className="font-bold mr-2">{t(currentAnnouncement.title)}:</span>
                        {t(currentAnnouncement.content)}
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
