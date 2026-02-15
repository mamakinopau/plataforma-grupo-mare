import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { X } from 'lucide-react';
import { ReportFilterState } from '../../pages/Reports';
import { useDataStore } from '../../store/useDataStore';

interface ReportsFiltersProps {
    filters: ReportFilterState;
    onChange: (filters: ReportFilterState) => void;
    onClear: () => void;
}

export function ReportsFilters({ filters, onChange, onClear }: ReportsFiltersProps) {
    const { t } = useTranslation();
    const { tenants, categories } = useDataStore();

    const handleFilterChange = (key: keyof ReportFilterState, value: string) => {
        onChange({ ...filters, [key]: value });
    };

    const restaurantOptions = [
        { value: 'all', label: t('reports.filters.allRestaurants') },
        ...tenants.map(t => ({ value: t.id, label: t.name }))
    ];

    const categoryOptions = [
        { value: 'all', label: t('reports.filters.allCategories') },
        ...categories.map(c => ({ value: c.id, label: c.name }))
    ];

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Select
                        label={t('reports.filters.dateRange')}
                        options={[
                            { value: '7d', label: t('reports.filters.ranges.last7days') },
                            { value: '30d', label: t('reports.filters.ranges.last30days') },
                            { value: '3m', label: t('reports.filters.ranges.last3months') },
                            { value: '1y', label: t('reports.filters.ranges.lastYear') },
                            { value: 'custom', label: t('reports.filters.ranges.custom') },
                        ]}
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    />
                    <Select
                        label={t('reports.filters.restaurant')}
                        options={restaurantOptions}
                        value={filters.restaurantId}
                        onChange={(e) => handleFilterChange('restaurantId', e.target.value)}
                    />
                    <Select
                        label={t('reports.filters.category')}
                        options={categoryOptions}
                        value={filters.categoryId}
                        onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    />
                    <Select
                        label={t('reports.filters.statusLabel')}
                        options={[
                            { value: 'all', label: t('reports.filters.allStatus') },
                            { value: 'completed', label: t('reports.filters.status.completed') },
                            { value: 'in_progress', label: t('reports.filters.status.inProgress') },
                        ]}
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    />
                </div>
                <div className="flex items-end gap-2">
                    <Button variant="outline" onClick={onClear} className="flex items-center gap-2">
                        <X className="w-4 h-4" />
                        {t('reports.filters.clear')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
