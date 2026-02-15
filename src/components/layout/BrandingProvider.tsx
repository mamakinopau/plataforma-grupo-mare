import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useDataStore } from '../../store/useDataStore';

export function BrandingProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const { tenants } = useDataStore();

    const currentTenant = user?.tenantId ? tenants.find(t => t.id === user.tenantId) : null;

    useEffect(() => {
        if (currentTenant?.theme) {
            const root = document.documentElement;
            // This is a simplified example. In a real app with Tailwind, 
            // you might map these to CSS variables that Tailwind uses.
            // For now, we'll just set some CSS variables that could be used by custom classes
            root.style.setProperty('--color-primary', currentTenant.theme.primaryColor);
            root.style.setProperty('--color-secondary', currentTenant.theme.secondaryColor);

            // Update title and favicon if needed
            document.title = `${currentTenant.name} - LMS`;
        }
    }, [currentTenant]);

    return <>{children}</>;
}
