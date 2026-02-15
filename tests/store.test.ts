import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../src/store/useAuthStore';
import { useTenantStore } from '../src/store/useTenantStore';

describe('useAuthStore', () => {
    beforeEach(() => {
        useAuthStore.getState().logout();
    });

    it('should login with a valid email', () => {
        useAuthStore.getState().login('admin@grupomare.com');
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
        expect(useAuthStore.getState().user?.role).toBe('admin');
    });

    it('should logout correctly', () => {
        useAuthStore.getState().login('admin@grupomare.com');
        useAuthStore.getState().logout();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
        expect(useAuthStore.getState().user).toBe(null);
    });
});

describe('useTenantStore', () => {
    it('should add a new restaurant', () => {
        const initialCount = useTenantStore.getState().tenants.length;
        useTenantStore.getState().addTenant({
            name: 'New Test Restaurant',
            slug: 'test-rest',
            maxSeats: 50,
            subscriptionStatus: 'active'
        });
        expect(useTenantStore.getState().tenants.length).toBe(initialCount + 1);
        expect(useTenantStore.getState().tenants.find(t => t.name === 'New Test Restaurant')).toBeDefined();
    });

    it('should update an existing restaurant name', () => {
        const tenant = useTenantStore.getState().tenants[0];
        useTenantStore.getState().updateTenant(tenant.id, { name: 'Updated Name' });
        expect(useTenantStore.getState().tenants.find(t => t.id === tenant.id)?.name).toBe('Updated Name');
    });
});
