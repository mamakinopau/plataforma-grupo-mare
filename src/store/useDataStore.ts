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
                users: (profiles as any[])?.map(p => ({ ...p, role: p.role as any })) || [],
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
        // Note: Creating a user usually requires Supabase Auth Admin API or sign up
        // Here we just insert into profiles for simplicity as per the transition plan
        // In a real scenario, we'd call a cloud function to create the auth user
        const { error } = await supabase
            .from('profiles')
            .insert(user);

        if (!error) {
            set(state => ({ users: [...state.users, user] }));
        }
    },

    updateUser: async (id, updates) => {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id);

        if (!error) {
            set(state => ({
                users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
            }));
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

        if (!error) {
            set(state => ({
                tenants: state.tenants.filter(t => t.id !== id)
            }));
        }
    },
}));

