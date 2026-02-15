import { create } from 'zustand';
import { Notification, Announcement } from '../types';

interface NotificationState {
    notifications: Notification[];
    announcements: Announcement[];
    unreadCount: number;

    // Actions
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;

    addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'authorId'>) => void;
    removeAnnouncement: (id: string) => void;
    toggleAnnouncement: (id: string) => void;
}

// Mock initial data
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        userId: '1',
        title: 'notifications.welcome.title',
        message: 'notifications.welcome.message',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        userId: '1',
        title: 'notifications.assigned.title',
        message: 'notifications.assigned.message',
        type: 'warning',
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    }
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: '1',
        title: 'announcements.mock.maintenance.title',
        content: 'announcements.mock.maintenance.content',
        priority: 'medium',
        authorId: 'admin',
        createdAt: new Date().toISOString(),
        isActive: true,
    }
];

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: MOCK_NOTIFICATIONS,
    announcements: MOCK_ANNOUNCEMENTS,
    unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,

    addNotification: (notification) => set((state) => ({
        notifications: [
            { ...notification, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), isRead: false },
            ...state.notifications
        ],
        unreadCount: state.unreadCount + 1
    })),

    markAsRead: (id) => set((state) => {
        const newNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        );
        return {
            notifications: newNotifications,
            unreadCount: newNotifications.filter(n => !n.isRead).length
        };
    }),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
    })),

    removeNotification: (id) => set((state) => {
        const newNotifications = state.notifications.filter(n => n.id !== id);
        return {
            notifications: newNotifications,
            unreadCount: newNotifications.filter(n => !n.isRead).length
        };
    }),

    addAnnouncement: (announcement) => set((state) => ({
        announcements: [
            {
                ...announcement,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
                authorId: 'current-user-id', // In real app, get from auth store
                isActive: true
            } as Announcement,
            ...state.announcements
        ]
    })),

    removeAnnouncement: (id) => set((state) => ({
        announcements: state.announcements.filter(a => a.id !== id)
    })),

    toggleAnnouncement: (id) => set((state) => ({
        announcements: state.announcements.map(a =>
            a.id === id ? { ...a, isActive: !a.isActive } : a
        )
    })),
}));
