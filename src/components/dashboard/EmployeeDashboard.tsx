import { useAuthStore } from '../../store/useAuthStore';
import { useDataStore } from '../../store/useDataStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { BookOpen, Clock, TrendingUp, Award, PlayCircle } from 'lucide-react';
import { LevelProgress, StreakCounter } from '../gamification/GamificationComponents';
import { StatCard } from './StatCard';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function EmployeeDashboard() {
    const { user } = useAuthStore();
    const { courses, progress } = useDataStore();

    const { t } = useTranslation();

    if (!user) return null;

    // Calculate stats
    const myProgress = progress.filter(p => p.userId === user.id);
    const completed = myProgress.filter(p => p.status === 'completed').length;
    const inProgress = myProgress.filter(p => p.status === 'in_progress').length;
    const totalAssigned = courses.filter(c =>
        c.targetRoles.includes(user.role as any) || c.isMandatory
    ).length;

    // Calculate average score
    const completedCoursesWithScore = myProgress.filter(p => p.status === 'completed' && p.score !== undefined);
    const averageScore = completedCoursesWithScore.length > 0
        ? Math.round(completedCoursesWithScore.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedCoursesWithScore.length)
        : 0;

    // Get recommended courses (mock logic: courses not started yet)
    const startedCourseIds = myProgress.map(p => p.courseId);
    const recommendedCourses = courses
        .filter(c => !startedCourseIds.includes(c.id))
        .slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.welcome', { name: user.name })}</h1>
                    <p className="text-gray-500">{t('dashboard.subtitle')}</p>
                </div>
                <StreakCounter streak={user.streak || 0} />
            </div>

            {/* Gamification Banner */}
            <Card className="bg-gradient-to-r from-gray-900 to-primary-900 text-white border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Award className="w-64 h-64 transform rotate-12" />
                </div>
                <CardContent className="p-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 w-full max-w-md">
                            <LevelProgress points={user.points || 0} />
                        </div>
                        <div className="hidden md:block w-px h-16 bg-white/20" />
                        <div className="flex gap-12 text-center">
                            <div>
                                <p className="text-3xl font-bold">{user.points || 0}</p>
                                <p className="text-xs text-gray-300 uppercase tracking-wider font-medium mt-1">{t('gamification.totalXp')}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{user.badges?.length || 0}</p>
                                <p className="text-xs text-gray-300 uppercase tracking-wider font-medium mt-1">{t('gamification.badges')}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label={t('common.courses')} value={totalAssigned} icon={BookOpen} color="blue" />
                <StatCard label={t('dashboard.stats.coursesCompleted')} value={completed} icon={Award} color="green" />
                <StatCard label={t('common.inProgress')} value={inProgress} icon={Clock} color="amber" />
                <StatCard label={t('dashboard.stats.averageScore')} value={`${averageScore}%`} icon={TrendingUp} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('common.continueLearning')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {myProgress.filter(p => p.status === 'in_progress').length > 0 ? (
                                    myProgress
                                        .filter(p => p.status === 'in_progress')
                                        .slice(0, 3)
                                        .map((p) => {
                                            const course = courses.find(c => c.id === p.courseId);
                                            return (
                                                <div key={p.courseId} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                                                    <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                                                        <img src={course?.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <PlayCircle className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate">{course?.title}</h4>
                                                        <div className="flex items-center mt-1 gap-2">
                                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-primary-600 rounded-full" style={{ width: `${p.progressPercentage}%` }} />
                                                            </div>
                                                            <span className="text-xs text-gray-500 font-medium">{p.progressPercentage}%</span>
                                                        </div>
                                                    </div>
                                                    <Link to={`/courses/${course?.id}`} className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 h-8 px-3 text-xs bg-primary-600 text-white hover:bg-primary-700 shadow-sm">
                                                        {t('common.resume')}
                                                    </Link>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>{t('common.noCoursesInProgress')}</p>
                                        <Link to="/courses" className="text-primary-600 underline-offset-4 hover:underline mt-2 inline-block">
                                            {t('common.browseLibrary')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.recommendedCourses')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recommendedCourses.map((course) => (
                                    <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge variant="default" className="text-xs">{course.category}</Badge>
                                            <span className="text-xs text-gray-500 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {course.durationMinutes}m
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{course.title}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>
                                        <Link to={`/courses/${course.id}`} className="w-full inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 h-8 px-3 text-xs border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                                            {t('common.startCourse')}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {myProgress.slice(0, 5).map((p) => {
                                    const course = courses.find(c => c.id === p.courseId);
                                    return (
                                        <div key={p.courseId} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                                            <div className={`mt-1 w-2 h-2 rounded-full ${p.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{course?.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {p.status === 'completed' ? t('common.completed') : t('common.accessedOn')} {new Date(p.lastAccessedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
