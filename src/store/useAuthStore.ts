import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    checkSession: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch extended profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    set({
                        user: {
                            id: session.user.id,
                            email: session.user.email!,
                            name: profile.name,
                            role: profile.role,
                            tenantId: profile.tenant_id,
                            avatarUrl: profile.avatar_url,
                            phone: profile.phone,
                            position: profile.position,
                            points: profile.points,
                            level: profile.level,
                            streak: profile.streak,
                            isActive: profile.is_active,
                            onboardingCompleted: profile.onboarding_completed,
                            joinedAt: profile.created_at,
                            preferences: { // Default preferences for now
                                emailNotifications: true,
                                pushNotifications: true,
                                marketingEmails: false
                            }
                        } as User,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } else {
                    // Fallback if profile doesn't exist yet (shouldn't happen if setup correctly)
                    console.warn('Profile not found for user', session.user.id);
                    set({ isAuthenticated: true, isLoading: false, user: { id: session.user.id, email: session.user.email, role: 'employee', name: session.user.email!.split('@')[0], tenantId: '', isActive: true, joinedAt: new Date().toISOString(), onboardingCompleted: false, preferences: { emailNotifications: true, pushNotifications: true, marketingEmails: false } } as User });
                }
            } else {
                set({ isAuthenticated: false, isLoading: false });
            }
        } catch (error) {
            console.error('Session check failed', error);
            set({ isAuthenticated: false, isLoading: false });
        }
    },

    login: async (email: string, password?: string) => {
        if (!password) {
            alert("Password is required for real authentication.");
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data.session?.user) {
                // Fetch extended profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.session.user.id)
                    .single();

                set({
                    user: {
                        id: data.session.user.id,
                        email: data.session.user.email!,
                        name: profile.name,
                        role: profile.role,
                        tenantId: profile.tenant_id,
                        avatarUrl: profile.avatar_url,
                        phone: profile.phone,
                        position: profile.position,
                        points: profile.points,
                        level: profile.level,
                        streak: profile.streak,
                        isActive: profile.is_active,
                        onboardingCompleted: profile.onboarding_completed,
                        joinedAt: profile.created_at,
                        preferences: { // Default preferences for now
                            emailNotifications: true,
                            pushNotifications: true,
                            marketingEmails: false
                        }
                    } as User,
                    isAuthenticated: true
                });
            }
        } catch (error: any) {
            console.error('Login failed:', error);
            alert(`Login failed: ${error.message}`);
            throw error;
        }
    },

    logout: async () => {
        console.log('[AuthStore] Logging out...');
        const { error } = await supabase.auth.signOut();
        if (error) console.error('[AuthStore] Supabase signOut error:', error);

        console.log('[AuthStore] Setting state to unauthenticated');
        set({ user: null, isAuthenticated: false });
        console.log('[AuthStore] State updated');
    },

    updateUser: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        // Optimistic update
        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null
        }));

        try {
            // Persist to Supabase
            // Map camelCase to snake_case for DB
            const dbUpdates: any = {
                name: updates.name,
                email: updates.email,
                avatar_url: updates.avatarUrl,
                phone: updates.phone,
                // Add other fields as necessary
            };

            // Remove undefined fields
            Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', currentUser.id);

            if (error) throw error;

        } catch (error) {
            console.error('Failed to update user profile:', error);
            // Revert optimistic update (optional, but good practice)
            // set({ user: currentUser });
            alert('Erro ao gravar alterações no perfil.');
        }
    },
}));

