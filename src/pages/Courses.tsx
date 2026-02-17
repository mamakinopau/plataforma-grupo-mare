import { useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Clock, PlayCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { CategoryManagement } from '../components/admin/CategoryManagement';

export function Courses() {

    const { courses, categories: storeCategories } = useDataStore();
    const { user } = useAuthStore();
    const [filter, setFilter] = useState('All');
    const { t } = useTranslation();

    const categories = ['All', ...storeCategories.map(c => c.id)];
    const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.category === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('courses.title')}</h1>
                    <p className="text-gray-500">{t('courses.subtitle')}</p>
                </div>
                {user && (user.role === 'admin' || user.role === 'manager' || user.role === 'super_admin') && (
                    <Link to="/admin/courses/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            {t('courses.createCourse')}
                        </Button>
                    </Link>
                )}
            </div>

            {user && (user.role === 'admin' || user.role === 'super_admin') && (
                <CategoryManagement />
            )}

            <div className="flex flex-wrap gap-2">
                {categories.map(cat => {
                    const categoryName = cat === 'All' ? 'Todos' : storeCategories.find(c => c.id === cat)?.name || cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {categoryName}
                        </button>
                    );
                })}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-48">
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2">
                                {course.isMandatory && <Badge variant="destructive">{t('courses.mandatory')}</Badge>}
                            </div>
                        </div>
                        <CardContent className="flex-1 p-5 flex flex-col">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="default">{course.category}</Badge>
                                    <div className="flex items-center text-gray-500 text-xs">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {course.durationMinutes} {t('courses.min')}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <Link to={`/courses/${course.id}`} className="flex-1">
                                        <Button className="w-full">
                                            <PlayCircle className="w-4 h-4 mr-2" />
                                            {t('courses.startCourse')}
                                        </Button>
                                    </Link>
                                    {user && (user.role === 'admin' || user.role === 'manager' || user.role === 'super_admin') && (
                                        <>
                                            <Link to={`/admin/courses/${course.id}/edit`}>
                                                <Button variant="outline" size="sm" className="w-8 px-0">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-8 px-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => {
                                                    if (window.confirm(t('courses.confirmDelete') || 'Tem a certeza que deseja eliminar este curso?')) {
                                                        const { deleteCourse } = useDataStore.getState();
                                                        deleteCourse(course.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
