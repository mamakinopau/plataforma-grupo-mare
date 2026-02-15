import { useState } from 'react';
import { Button } from '../ui/Button';
import { Calendar, Filter, Download } from 'lucide-react';

interface DashboardFiltersProps {
    onFilterChange: (filters: any) => void;
    onExport?: () => void;
    showRestaurantFilter?: boolean;
}

export function DashboardFilters({ onFilterChange, onExport, showRestaurantFilter = false }: DashboardFiltersProps) {
    const [dateRange, setDateRange] = useState('month');

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                        className={`px-3 py-1.5 text-sm font-medium ${dateRange === 'week' ? 'bg-primary-50 text-primary-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setDateRange('week')}
                    >
                        This Week
                    </button>
                    <div className="w-px bg-gray-200 h-full"></div>
                    <button
                        className={`px-3 py-1.5 text-sm font-medium ${dateRange === 'month' ? 'bg-primary-50 text-primary-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setDateRange('month')}
                    >
                        This Month
                    </button>
                    <div className="w-px bg-gray-200 h-full"></div>
                    <button
                        className={`px-3 py-1.5 text-sm font-medium ${dateRange === 'year' ? 'bg-primary-50 text-primary-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setDateRange('year')}
                    >
                        This Year
                    </button>
                </div>

                {showRestaurantFilter && (
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        All Restaurants
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex items-center gap-2 ml-auto sm:ml-0">
                    <Calendar className="w-4 h-4" />
                    Custom Date
                </Button>
                {onExport && (
                    <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                )}
            </div>
        </div>
    );
}
