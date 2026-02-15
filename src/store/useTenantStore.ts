import { create } from 'zustand';
import { Tenant } from '../types';

interface TenantState {
    currentTenant: Tenant | null;
    tenants: Tenant[]; // For Super Admin
    isLoading: boolean;
    error: string | null;

    // Actions
    setTenant: (tenant: Tenant) => void;
    loadTenantBySlug: (slug: string) => void;

    // Super Admin Actions
    addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => void;
    updateTenant: (id: string, updates: Partial<Tenant>) => void;
    deleteTenant: (id: string) => void;
}

// Mock Tenants
const MOCK_TENANTS: Tenant[] = [
    {
        id: '1',
        name: 'Grupo Mare',
        slug: 'grupo-mare',
        domain: 'lms.grupomare.com',
        logoUrl: '/logo.png',
        theme: {
            primaryColor: '#0f172a', // Slate 900
            secondaryColor: '#3b82f6', // Blue 500
        },
        maxSeats: 100,
        subscriptionStatus: 'active',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Restaurante Exemplo',
        slug: 'restaurante-exemplo',
        domain: 'training.restauranteexemplo.com',
        logoUrl: 'https://ui-avatars.com/api/?name=Restaurante+Exemplo&background=random',
        theme: {
            primaryColor: '#dc2626', // Red 600
            secondaryColor: '#f59e0b', // Amber 500
        },
        maxSeats: 20,
        subscriptionStatus: 'trial',
        createdAt: new Date().toISOString(),
    }
];

export const useTenantStore = create<TenantState>((set, get) => ({
    currentTenant: MOCK_TENANTS[0], // Default to first tenant
    tenants: MOCK_TENANTS,
    isLoading: false,
    error: null,

    setTenant: (tenant) => set({ currentTenant: tenant }),

    loadTenantBySlug: (slug) => {
        const tenant = get().tenants.find(t => t.slug === slug);
        if (tenant) {
            set({ currentTenant: tenant });
        } else {
            set({ error: 'Tenant not found' });
        }
    },

    addTenant: (tenantData) => set((state) => ({
        tenants: [
            ...state.tenants,
            {
                ...tenantData,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
            }
        ]
    })),

    updateTenant: (id, updates) => set((state) => ({
        tenants: state.tenants.map(t => t.id === id ? { ...t, ...updates } : t),
        currentTenant: state.currentTenant?.id === id ? { ...state.currentTenant, ...updates } : state.currentTenant
    })),

    deleteTenant: (id) => set((state) => ({
        tenants: state.tenants.filter(t => t.id !== id)
    })),
}));
