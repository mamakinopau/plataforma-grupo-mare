import { create } from 'zustand';
import { Course, Tenant, User, UserProgress, Category } from '../types';
import { supabase } from '../lib/supabase';

interface DataState {
    courses: Course[];
    tenants: Tenant[];
    progress: UserProgress[];
    categories: Category[];
    users: User[];
    isLoading: boolean;

    // Actions
    initialize: () => Promise<void>;
    getCourseById: (id: string) => Course | undefined;
    getCoursesByTenant: (tenantId: string) => Course[];
    getUserProgress: (userId: string, courseId: string) => UserProgress | undefined;
    updateProgress: (userId: string, courseId: string, progress: Partial<UserProgress>) => Promise<void>;
    addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => Promise<void>;
    updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
    addCategory: (category: Category) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addUser: (user: User) => Promise<void>; // In real app, this might trigger an invite
    updateUser: (id: string, user: Partial<User>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => Promise<void>;
    updateTenant: (id: string, updates: Partial<Tenant>) => Promise<void>;
    deleteTenant: (id: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
    courses: [],
    tenants: [],
    progress: [],
    categories: [],
    users: [],
    isLoading: false,

    initialize: async () => {
        set({ isLoading: true });
        try {
            const [
                { data: courses },
                { data: tenants },
                { data: categories },
                { data: profiles },
                { data: progress }
            ] = await Promise.all([
                supabase.from('courses').select('*'),
                supabase.from('tenants').select('*'),
                supabase.from('categories').select('*'),
                supabase.from('profiles').select('*'),
                supabase.from('user_progress').select('*')
            ]);

            set({
                courses: courses || [],
                tenants: tenants || [],
                categories: categories || [],
                users: (profiles as any[])?.map(p => ({
                    ...p,
                    role: p.role as any,
                    tenantId: p.tenant_id,
                    isActive: p.is_active,
                    joinedAt: p.created_at,
                    lastLoginAt: p.last_sign_in_at // If using auth.users join, otherwise undefined is fine for now
                })) || [],
                progress: progress || [],
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to initialize data store:', error);
            set({ isLoading: false });
        }
    },

    getCourseById: (id) => get().courses.find(c => c.id === id),

    getCoursesByTenant: (tenantId) => get().courses.filter(c =>
        c.tenantIds?.includes(tenantId) || !c.tenantIds || c.tenantIds.length === 0
    ),

    getUserProgress: (userId, courseId) =>
        get().progress.find(p => p.userId === userId && p.courseId === courseId),

    updateProgress: async (userId, courseId, newProgress) => {
        // Optimistic update
        const currentProgress = get().progress;
        const existingIndex = currentProgress.findIndex(p => p.userId === userId && p.courseId === courseId);

        let newItem: UserProgress;

        if (existingIndex >= 0) {
            newItem = { ...currentProgress[existingIndex], ...newProgress };
            const updated = [...currentProgress];
            updated[existingIndex] = newItem;
            set({ progress: updated });

            await supabase
                .from('user_progress')
                .update(newProgress)
                .eq('user_id', userId)
                .eq('course_id', courseId);
        } else {
            newItem = {
                userId,
                courseId,
                status: 'in_progress',
                progressPercentage: 0,
                completedLessons: [],
                lastAccessedAt: new Date().toISOString(),
                ...newProgress
            } as UserProgress;

            set({ progress: [...currentProgress, newItem] });

            await supabase
                .from('user_progress')
                .insert({
                    user_id: userId,
                    course_id: courseId,
                    ...newProgress
                });
        }
    },

    addCourse: async (courseData) => {
        const { data, error } = await supabase
            .from('courses')
            .insert(courseData)
            .select()
            .single();

        if (data && !error) {
            set(state => ({ courses: [...state.courses, data as Course] }));
        }
    },

    updateCourse: async (id, updates) => {
        const { error } = await supabase
            .from('courses')
            .update(updates)
            .eq('id', id);

        if (!error) {
            set(state => ({
                courses: state.courses.map(c => c.id === id ? { ...c, ...updates } : c)
            }));
        }
    },

    addCategory: async (category) => {
        const { error } = await supabase
            .from('categories')
            .insert(category);

        if (!error) {
            set(state => ({
                categories: [...state.categories, category]
            }));
        }
    },

    deleteCategory: async (id) => {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (!error) {
            set(state => ({
                categories: state.categories.filter(cat => cat.id !== id)
            }));
        }
    },

    addUser: async (user) => {
        try {
            // Call our Vercel Serverless Function
            const response = await fetch('/api/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: 'TempPassword123!', // Default temporary password
                    name: user.name,
                    role: user.role,
                    tenantId: user.tenantId,
                    position: user.position,
                    userData: {
                        onboarding_completed: user.onboardingCompleted,
                        joined_at: user.joinedAt
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create user');
            }

            const { user: newUser } = await response.json();

            // Optimistically update the local store
            // We use the ID returned from the server (though in this flow we might wait for a refresh)
            // But adding it locally provides immediate feedback
            set(state => ({ users: [...state.users, { ...user, id: newUser.id }] }));

        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // Re-throw to be handled by the component
        }
    },

    updateUser: async (id, updates) => {
        // Map camelCase to snake_case for DB
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.role) dbUpdates.role = updates.role;
        if (updates.tenantId) dbUpdates.tenant_id = updates.tenantId;
        if (updates.position) dbUpdates.position = updates.position;
        if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

        const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', id);

        if (!error) {
            set(state => ({
                users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
            }));
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await fetch('/api/delete-user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete user');
            }

            set(state => ({
                users: state.users.filter(u => u.id !== id)
            }));
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    addTenant: async (tenantData) => {
        const { data, error } = await supabase
            .from('tenants')
            .insert(tenantData)
            .select()
            .single();

        if (data && !error) {
            set(state => ({ tenants: [...state.tenants, data as Tenant] }));
        }
    },

    updateTenant: async (id, updates) => {
        const { error } = await supabase
            .from('tenants')
            .update(updates)
            .eq('id', id);

        if (!error) {
            set(state => ({
                tenants: state.tenants.map(t => t.id === id ? { ...t, ...updates } : t)
            }));
        }
    },

    deleteTenant: async (id) => {
        const { error } = await supabase
            .from('tenants')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting tenant:', error);
            // Translate common errors
            if (error.code === '23503') { // Foreign key violation
                alert('Não é possível apagar este restaurante porque existem utilizadores associados a ele. Remova os utilizadores primeiro ou contacte o suporte.');
            } else {
                alert(`Erro ao apagar restaurante: ${error.message}`);
            }
            return;
        }

        set(state => ({
            tenants: state.tenants.filter(t => t.id !== id)
        }));
    },
}));

