import { useNotificationStore } from '../../store/useNotificationStore';
import { Bell, Check, Trash2, X, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface NotificationCenterProps {
    onClose: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
    const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
    const { t } = useTranslation();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    {t('common.notifications')}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                        {t('common.markAllRead')}
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">{t('notifications.empty')}</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {t(notification.title)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                            {t(notification.message)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-1 text-gray-400 hover:text-primary-600"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeNotification(notification.id)}
                                            className="p-1 text-gray-400 hover:text-red-600"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 border-t bg-gray-50 text-center">
                <Button variant="link" size="sm" className="text-xs">
                    {t('common.viewAllNotifications')}
                </Button>
            </div>
        </div>
    );
}
