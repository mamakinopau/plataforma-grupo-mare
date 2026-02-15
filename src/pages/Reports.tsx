import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataStore } from '../store/useDataStore';
import { ReportsFilters } from '../components/reports/ReportsFilters';
import { ReportsOverview } from '../components/reports/ReportsOverview';
import { ReportCard } from '../components/reports/ReportCard';
import { CustomReportBuilder } from '../components/reports/CustomReportBuilder';
import {
    CourseCompletionView,
    UserPerformanceView,
    RestaurantPerformanceView,
    CertificationsView,
    ActivityView,
    AssessmentsView
} from '../components/reports/views/ReportViews';
import { FileText, Users, Building2, Award, Activity, ClipboardCheck, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

type ReportType = 'overview' | 'completion' | 'user' | 'restaurant' | 'certifications' | 'activity' | 'assessments';

export interface ReportFilterState {
    dateRange: string;
    restaurantId: string;
    categoryId: string;
    status: string;
}

const INITIAL_FILTERS: ReportFilterState = {
    dateRange: '30d',
    restaurantId: 'all',
    categoryId: 'all',
    status: 'all'
};

export function Reports() {
    const { t } = useTranslation();
    const { users, courses, progress } = useDataStore();

    const [currentView, setCurrentView] = useState<ReportType>('overview');
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [filters, setFilters] = useState<ReportFilterState>(INITIAL_FILTERS);

    // Filter logic
    const filteredData = useMemo(() => {
        let filteredUsers = [...users];
        let filteredCourses = [...courses];
        let filteredProgress = [...progress];

        if (filters.restaurantId !== 'all') {
            filteredUsers = filteredUsers.filter(u => u.tenantId === filters.restaurantId);
            filteredProgress = filteredProgress.filter(p => {
                const user = users.find(u => u.id === p.userId);
                return user?.tenantId === filters.restaurantId;
            });
        }

        if (filters.categoryId !== 'all') {
            filteredCourses = filteredCourses.filter(c => c.category === filters.categoryId);
            filteredProgress = filteredProgress.filter(p => {
                const course = courses.find(c => c.id === p.courseId);
                return course?.category === filters.categoryId;
            });
        }

        if (filters.status !== 'all') {
            filteredProgress = filteredProgress.filter(p => p.status === filters.status);
        }

        // Date range filtering is complex without real dates for all records, 
        // but we can implement a basic shell for it if needed later.

        return {
            users: filteredUsers,
            courses: filteredCourses,
            progress: filteredProgress
        };
    }, [filters, users, courses, progress]);

    const renderView = () => {
        switch (currentView) {
            case 'completion': return (
                <CourseCompletionView
                    onBack={() => setCurrentView('overview')}
                    courses={filteredData.courses}
                    progress={filteredData.progress}
                />
            );
            case 'user': return (
                <UserPerformanceView
                    onBack={() => setCurrentView('overview')}
                    users={filteredData.users}
                    progress={filteredData.progress}
                />
            );
            case 'restaurant': return <RestaurantPerformanceView onBack={() => setCurrentView('overview')} />;
            case 'certifications': return <CertificationsView onBack={() => setCurrentView('overview')} />;
            case 'activity': return <ActivityView onBack={() => setCurrentView('overview')} />;
            case 'assessments': return <AssessmentsView onBack={() => setCurrentView('overview')} />;
            default: return (
                <div className="space-y-8">
                    <ReportsOverview
                        users={filteredData.users}
                        courses={filteredData.courses}
                        progress={filteredData.progress}
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">{t('reports.availableReports')}</h2>
                            <Button onClick={() => setIsBuilderOpen(true)} className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                {t('reports.actions.createCustom')}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ReportCard
                                title={t('reports.cards.completion.title')}
                                description={t('reports.cards.completion.desc')}
                                icon={FileText}
                                onClick={() => setCurrentView('completion')}
                                color="text-blue-600"
                            />
                            <ReportCard
                                title={t('reports.cards.user.title')}
                                description={t('reports.cards.user.desc')}
                                icon={Users}
                                onClick={() => setCurrentView('user')}
                                color="text-green-600"
                            />
                            <ReportCard
                                title={t('reports.cards.restaurant.title')}
                                description={t('reports.cards.restaurant.desc')}
                                icon={Building2}
                                onClick={() => setCurrentView('restaurant')}
                                color="text-purple-600"
                            />
                            <ReportCard
                                title={t('reports.cards.certifications.title')}
                                description={t('reports.cards.certifications.desc')}
                                icon={Award}
                                onClick={() => setCurrentView('certifications')}
                                color="text-amber-600"
                            />
                            <ReportCard
                                title={t('reports.cards.activity.title')}
                                description={t('reports.cards.activity.desc')}
                                icon={Activity}
                                onClick={() => setCurrentView('activity')}
                                color="text-indigo-600"
                            />
                            <ReportCard
                                title={t('reports.cards.assessments.title')}
                                description={t('reports.cards.assessments.desc')}
                                icon={ClipboardCheck}
                                onClick={() => setCurrentView('assessments')}
                                color="text-rose-600"
                            />
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h1>
                <p className="text-gray-500">{t('reports.subtitle')}</p>
            </div>

            <ReportsFilters
                filters={filters}
                onChange={setFilters}
                onClear={() => setFilters(INITIAL_FILTERS)}
            />

            {renderView()}

            <CustomReportBuilder isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} />
        </div>
    );
}
