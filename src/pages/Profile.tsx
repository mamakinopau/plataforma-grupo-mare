import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';
import { useGamificationStore } from '../store/useGamificationStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { CertificateView } from '../components/course/CertificateView';
import { BadgeCard } from '../components/gamification/GamificationComponents';
import { Mail, Award, Calendar } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export function Profile() {
    const { user } = useAuthStore();
    const { progress, getCourseById } = useDataStore();
    const { badges } = useGamificationStore();
    const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'certificates' | 'badges'>('certificates');

    if (!user) return <div>Please log in</div>;

    // Get completed courses
    const completedCourses = progress
        .filter(p => p.userId === user.id && p.status === 'completed')
        .map(p => {
            const course = getCourseById(p.courseId);
            return {
                ...p,
                courseTitle: course?.title || 'Unknown Course',
                courseId: p.courseId
            };
        });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-32 bg-primary-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex items-end -mt-12 mb-6">
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-24 h-24 rounded-full border-4 border-white bg-white"
                        />
                        <div className="ml-6 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-500 capitalize">{user.role} • {user.position || 'Staff'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center text-gray-600">
                            <Mail className="w-5 h-5 mr-3 text-gray-400" />
                            {user.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                            Joined {new Date().toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Award className="w-5 h-5 mr-3 text-gray-400" />
                            {completedCourses.length} Certificates Earned
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">My Achievements</h2>

                <div className="flex space-x-4 border-b">
                    <button
                        className={`pb-2 px-4 font-medium ${activeTab === 'certificates' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('certificates')}
                    >
                        Certificates
                    </button>
                    <button
                        className={`pb-2 px-4 font-medium ${activeTab === 'badges' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('badges')}
                    >
                        Badges
                    </button>
                </div>

                {activeTab === 'certificates' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedCourses.length === 0 ? (
                            <Card className="col-span-full">
                                <CardContent className="p-12 text-center text-gray-500">
                                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">No certificates yet</p>
                                    <p className="mt-1">Complete courses to earn certificates.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            completedCourses.map((item) => (
                                <div key={item.courseId} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                                    setSelectedCertificate({
                                        id: `cert-${user.id}-${item.courseId}`,
                                        userId: user.id,
                                        courseId: item.courseId,
                                        courseTitle: item.courseTitle,
                                        issuedAt: item.completedAt || new Date().toISOString(),
                                        validationCode: `GM-${item.courseId.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(0, 4)}`,
                                        score: item.score || 100
                                    });
                                }}>
                                    <Card>
                                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                                                <Award className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{item.courseTitle}</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Issued on {new Date(item.completedAt || '').toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full">
                                                View Certificate
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {badges.map((badge) => {
                            const isEarned = user?.badges?.includes(badge.id) || false;
                            return (
                                <BadgeCard key={badge.id} badge={badge} earned={isEarned} />
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!selectedCertificate}
                onClose={() => setSelectedCertificate(null)}
                title="Certificate Preview"
                className="max-w-4xl"
            >
                {selectedCertificate && (
                    <CertificateView certificate={selectedCertificate} />
                )}
            </Modal>
        </div>
    );
}
