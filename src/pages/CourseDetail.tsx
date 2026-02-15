import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { QuizPlayer } from '../components/course/QuizPlayer';
import { CertificateView } from '../components/course/CertificateView';
import { ChevronLeft, CheckCircle, Circle } from 'lucide-react';

export function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { getCourseById, getUserProgress, updateProgress } = useDataStore();
    const { user } = useAuthStore();

    const course = getCourseById(courseId || '');
    const progress = user ? getUserProgress(user.id, courseId || '') : null;

    if (!course) return <div>Course not found</div>;

    // Check if course is completed
    if (progress?.status === 'completed') {
        const certificate = {
            id: `cert-${user?.id}-${course.id}`,
            userId: user?.id || '',
            courseId: course.id,
            courseTitle: course.title,
            issuedAt: progress.completedAt || new Date().toISOString(),
            validationCode: `GM-${Date.now().toString(36).toUpperCase()}`,
            score: progress.score || 100
        };

        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => navigate('/courses')}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Library
                </Button>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-8">
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Course Completed!</h2>
                    <p className="text-green-700">Congratulations, you have successfully completed this course.</p>
                </div>
                <CertificateView certificate={certificate} />
            </div>
        );
    }

    // Flatten lessons for calculation
    const allLessons = course.sections.flatMap(s => s.lessons);
    const currentLessonId = progress?.currentLessonId || allLessons[0]?.id;
    const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[0];

    const handleLessonComplete = (lessonId: string, score?: number) => {
        if (!user) return;

        const currentCompleted = progress?.completedLessons || [];
        if (!currentCompleted.includes(lessonId)) {
            const newCompleted = [...currentCompleted, lessonId];
            const percent = Math.round((newCompleted.length / allLessons.length) * 100);

            // Find next lesson
            const currentIndex = allLessons.findIndex(l => l.id === lessonId);
            const nextLessonId = allLessons[currentIndex + 1]?.id;

            updateProgress(user.id, course.id, {
                completedLessons: newCompleted,
                progressPercentage: percent,
                status: percent === 100 ? 'completed' : 'in_progress',
                currentLessonId: nextLessonId || lessonId,
                ...(score !== undefined && { score }), // Update score if provided (e.g. from quiz)
                ...(percent === 100 && { completedAt: new Date().toISOString() })
            });
        }
    };

    const handleQuizComplete = (score: number, passed: boolean) => {
        if (passed) {
            handleLessonComplete(currentLesson.id, score);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" onClick={() => navigate('/courses')}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Library
                </Button>
                {user && (user.role === 'admin' || user.role === 'manager') && (
                    <Button variant="outline" onClick={() => navigate(`/admin/courses/${course.id}/edit`)}>
                        Edit Course
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Content Player */}
                    <div className={`rounded-xl overflow-hidden ${currentLesson?.type === 'video' ? 'aspect-video bg-black flex items-center justify-center' : 'bg-white border border-gray-200 min-h-[400px]'}`}>
                        {currentLesson?.type === 'video' ? (
                            <iframe
                                src={currentLesson.content}
                                className="w-full h-full"
                                title={currentLesson.title}
                                allowFullScreen
                            />
                        ) : currentLesson?.type === 'pdf' ? (
                            <iframe
                                src={currentLesson.content}
                                className="w-full h-full min-h-[600px]"
                                title={currentLesson.title}
                            />
                        ) : currentLesson?.type === 'quiz' && currentLesson.quizConfig ? (
                            <div className="p-6 w-full h-full overflow-y-auto">
                                <QuizPlayer
                                    config={currentLesson.quizConfig}
                                    onComplete={handleQuizComplete}
                                />
                            </div>
                        ) : (
                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-4">{currentLesson?.title}</h2>
                                <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson?.content || '' }} />
                            </div>
                        )}

                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                        <p className="text-gray-500 mt-2">{course.description}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="h-[calc(100vh-200px)] flex flex-col">
                        <CardContent className="p-0 flex-1 overflow-y-auto">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-semibold">Course Content</h3>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">Progress</span>
                                        <span className="font-medium">{progress?.progressPercentage || 0}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-600 transition-all duration-500"
                                            style={{ width: `${progress?.progressPercentage || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-6">
                                {course.sections.map((section) => (
                                    <div key={section.id}>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                                            {section.title}
                                        </h4>
                                        <div className="space-y-1">
                                            {section.lessons.map((lesson) => {
                                                const isCompleted = progress?.completedLessons.includes(lesson.id);
                                                const isCurrent = currentLessonId === lesson.id;
                                                const isLocked = !isCompleted && !isCurrent && !lesson.isPreview &&
                                                    allLessons.findIndex(l => l.id === lesson.id) > (progress?.completedLessons.length || 0);

                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        disabled={isLocked}
                                                        onClick={() => !isLocked && updateProgress(user!.id, course.id, { currentLessonId: lesson.id })}
                                                        className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors ${isCurrent ? 'bg-primary-50 ring-1 ring-primary-200' : 'hover:bg-gray-50'
                                                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                        ) : (
                                                            <Circle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isCurrent ? 'text-primary-600' : 'text-gray-300'}`} />
                                                        )}
                                                        <div>
                                                            <p className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>
                                                                {lesson.title}
                                                            </p>
                                                            <div className="flex items-center mt-1 space-x-2">
                                                                <span className="text-xs text-gray-400 capitalize">{lesson.type}</span>
                                                                <span className="text-xs text-gray-300">•</span>
                                                                <span className="text-xs text-gray-400">{lesson.durationMinutes} min</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                            {currentLesson?.type !== 'quiz' && (
                                <Button
                                    className="w-full"
                                    disabled={progress?.completedLessons.includes(currentLesson.id)}
                                    onClick={() => handleLessonComplete(currentLesson.id)}
                                >
                                    {progress?.completedLessons.includes(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
