import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { useDataStore } from '../../store/useDataStore';

interface UserFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedTenant: string;
    onTenantChange: (tenant: string) => void;
    selectedRole: string;
    onRoleChange: (role: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
}

export function UserFilters({
    searchQuery,
    onSearchChange,
    selectedTenant,
    onTenantChange,
    selectedRole,
    onRoleChange,
    selectedStatus,
    onStatusChange
}: UserFiltersProps) {
    const { t } = useTranslation();
    const { tenants } = useDataStore();

    const clearFilters = () => {
        onSearchChange('');
        onTenantChange('all');
        onRoleChange('all');
        onStatusChange('all');
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('team.filters.searchPlaceholder')}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none min-w-[140px]"
                        value={selectedTenant}
                        onChange={(e) => onTenantChange(e.target.value)}
                    >
                        <option value="all">{t('team.filters.allRestaurants')}</option>
                        {tenants.map(tenant => (
                            <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                        ))}
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none min-w-[120px]"
                        value={selectedRole}
                        onChange={(e) => onRoleChange(e.target.value)}
                    >
                        <option value="all">{t('team.filters.allRoles')}</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employee</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none min-w-[120px]"
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                    >
                        <option value="all">{t('team.filters.allStatus')}</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 whitespace-nowrap">
                        <X className="w-4 h-4" />
                        {t('reports.filters.clear')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
