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
    deleteCourse: (id: string) => Promise<void>;
    addCategory: (category: Category) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addUser: (user: User, options?: { sendWelcomeEmail?: boolean; autoAssignTraining?: boolean }) => Promise<void>; // In real app, this might trigger an invite
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

            const mappedTenants = (tenants as any[])?.map(t => ({
                id: t.id,
                name: t.name,
                slug: t.slug,
                domain: t.domain,
                logoUrl: t.logo_url,
                theme: t.theme,
                maxSeats: t.max_seats,
                subscriptionStatus: t.subscription_status,
                createdAt: t.created_at
            })) || [];

            console.log('[DataStore] Loaded tenants:', mappedTenants);

            set({
                courses: (courses as any[])?.map(c => ({
                    ...c,
                    category: c.category_id, // Map category_id -> category
                    durationMinutes: c.duration_minutes,
                    isMandatory: c.is_mandatory,
                    targetRoles: c.target_roles,
                    thumbnailUrl: c.thumbnail_url,
                    validityMonths: c.validity_months,
                    createdAt: c.created_at,
                    updatedAt: c.updated_at,
                    tenantIds: c.tenant_ids,
                    // Ensure sections is array
                    sections: Array.isArray(c.sections) ? c.sections : []
                })) || [],
                categories: categories || [],
                tenants: mappedTenants,
                users: (profiles as any[])?.map(p => ({
                    ...p,
                    avatarUrl: p.avatar_url,
                    role: p.role as any,
                    tenantId: p.tenant_id,
                    isActive: p.is_active,
                    joinedAt: p.created_at,
                    lastLoginAt: p.last_sign_in_at
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
        // Map to snake_case
        const dbCourse = {
            title: courseData.title,
            description: courseData.description,
            category_id: courseData.category, // Map category -> category_id
            duration_minutes: courseData.durationMinutes,
            is_mandatory: courseData.isMandatory,
            target_roles: courseData.targetRoles,
            status: courseData.status,
            sections: courseData.sections,
            thumbnail_url: courseData.thumbnailUrl,
            validity_months: courseData.validityMonths,
            tenant_ids: courseData.tenantIds,
            // Let DB handle created_at
        };

        const { data, error } = await supabase
            .from('courses')
            .insert(dbCourse)
            .select()
            .single();

        if (error) {
            console.error('Error adding course:', error);
            throw error;
        }

        if (data) {
            const newCourse: Course = {
                ...courseData,
                id: data.id,
                createdAt: data.created_at,
                // re-map back just in case
                durationMinutes: data.duration_minutes,
                isMandatory: data.is_mandatory,
                targetRoles: data.target_roles,
                thumbnailUrl: data.thumbnail_url,
                validityMonths: data.validity_months,
                tenantIds: data.tenant_ids
            };
            set(state => ({ courses: [...state.courses, newCourse] }));
        }
    },

    updateCourse: async (id, updates) => {
        // Map to snake_case
        const dbUpdates: any = {};
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.category) dbUpdates.category_id = updates.category; // Map category -> category_id
        if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;
        if (updates.isMandatory !== undefined) dbUpdates.is_mandatory = updates.isMandatory;
        if (updates.targetRoles) dbUpdates.target_roles = updates.targetRoles;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.sections) dbUpdates.sections = updates.sections;
        if (updates.thumbnailUrl) dbUpdates.thumbnail_url = updates.thumbnailUrl;
        if (updates.validityMonths !== undefined) dbUpdates.validity_months = updates.validityMonths;
        if (updates.tenantIds) dbUpdates.tenant_ids = updates.tenantIds;
        dbUpdates.updated_at = new Date().toISOString();

        const { error } = await supabase
            .from('courses')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating course:', error);
            throw error;
        }

        set(state => ({
            courses: state.courses.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
    },

    deleteCourse: async (id) => {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting course:', error);
            throw error;
        }

        set(state => ({
            courses: state.courses.filter(c => c.id !== id)
        }));
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

    addUser: async (user, options) => {
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
                    },
                    options // Pass the options (sendWelcomeEmail, autoAssignTraining) to the API
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
        // Map to snake_case for DB
        const dbTenant = {
            name: tenantData.name,
            slug: tenantData.slug,
            domain: tenantData.domain,
            logo_url: tenantData.logoUrl,
            theme: tenantData.theme,
            max_seats: tenantData.maxSeats,
            subscription_status: tenantData.subscriptionStatus,
        };

        const { data, error } = await supabase
            .from('tenants')
            .insert(dbTenant)
            .select()
            .single();

        if (data && !error) {
            const newTenant: Tenant = {
                id: data.id,
                name: data.name,
                slug: data.slug,
                domain: data.domain,
                logoUrl: data.logo_url,
                theme: data.theme,
                maxSeats: data.max_seats,
                subscriptionStatus: data.subscription_status,
                createdAt: data.created_at
            };
            set(state => ({ tenants: [...state.tenants, newTenant] }));
        }
    },

    updateTenant: async (id, updates) => {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.slug) dbUpdates.slug = updates.slug;
        if (updates.domain) dbUpdates.domain = updates.domain;
        if (updates.logoUrl) dbUpdates.logo_url = updates.logoUrl;
        if (updates.theme) dbUpdates.theme = updates.theme;
        if (updates.maxSeats) dbUpdates.max_seats = updates.maxSeats;
        if (updates.subscriptionStatus) dbUpdates.subscription_status = updates.subscriptionStatus;

        console.log('[DataStore] Updating tenant:', id, dbUpdates);

        const { data, error } = await supabase
            .from('tenants')
            .update(dbUpdates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating tenant:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.warn('[DataStore] No tenant updated. ID mismatch or RLS policy?');
            throw new Error('Nenhum registo atualizado. Verifique permissões.');
        }

        console.log('[DataStore] Tenant updated successfully', data);

        set(state => ({
            tenants: state.tenants.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
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

