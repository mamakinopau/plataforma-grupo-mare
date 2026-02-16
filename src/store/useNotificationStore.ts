import { create } from 'zustand';
import { Notification, Announcement } from '../types';
import { supabase } from '../lib/supabase';

interface NotificationState {
    notifications: Notification[];
    announcements: Announcement[];
    unreadCount: number;
    isLoading: boolean;

    // Actions
    initialize: () => Promise<void>;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;

    addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'authorId'>) => Promise<void>;
    removeAnnouncement: (id: string) => Promise<void>;
    toggleAnnouncement: (id: string) => Promise<void>;
}

// Mock initial data for notifications (keep for now as requested only announcements persistence)
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        userId: '1',
        title: 'notifications.welcome.title',
        message: 'notifications.welcome.message',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
    }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: MOCK_NOTIFICATIONS,
    announcements: [],
    unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,
    isLoading: false,

    initialize: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            set({
                announcements: (data as any[])?.map(a => ({
                    id: a.id,
                    title: a.title,
                    content: a.content,
                    priority: a.priority,
                    authorId: a.author_id,
                    createdAt: a.created_at,
                    isActive: a.is_active,
                    targetRoles: a.target_roles,
                    targetTenantIds: a.target_tenant_ids,
                    expiresAt: a.expires_at
                })) || []
            });
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            set({ isLoading: false });
        }
    },

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

    addAnnouncement: async (announcement) => {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const dbAnnouncement = {
                title: announcement.title,
                content: announcement.content,
                priority: announcement.priority,
                is_active: announcement.isActive,
                author_id: user.id,
                target_roles: announcement.targetRoles || [],
                target_tenant_ids: announcement.targetTenantIds || []
            };

            const { data, error } = await supabase
                .from('announcements')
                .insert(dbAnnouncement)
                .select()
                .single();

            if (error) throw error;

            const newAnnouncement: Announcement = {
                id: data.id,
                title: data.title,
                content: data.content,
                priority: data.priority,
                authorId: data.author_id,
                createdAt: data.created_at,
                isActive: data.is_active,
                targetRoles: data.target_roles,
                targetTenantIds: data.target_tenant_ids,
                expiresAt: data.expires_at
            };

            set((state) => ({
                announcements: [newAnnouncement, ...state.announcements]
            }));

        } catch (error) {
            console.error('Error adding announcement:', error);
            throw error;
        }
    },

    removeAnnouncement: async (id) => {
        try {
            const { error } = await supabase
                .from('announcements')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                announcements: state.announcements.filter(a => a.id !== id)
            }));
        } catch (error) {
            console.error('Error deleting announcement:', error);
            throw error;
        }
    },

    toggleAnnouncement: async (id) => {
        try {
            const announcement = get().announcements.find(a => a.id === id);
            if (!announcement) return;

            const newStatus = !announcement.isActive;

            const { error } = await supabase
                .from('announcements')
                .update({ is_active: newStatus })
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                announcements: state.announcements.map(a =>
                    a.id === id ? { ...a, isActive: newStatus } : a
                )
            }));
        } catch (error) {
            console.error('Error toggling announcement:', error);
            throw error;
        }
    },
}));
