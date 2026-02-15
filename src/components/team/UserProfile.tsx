import { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award, BookOpen, Clock, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface UserProfileProps {
    userId: string;
    onBack: () => void;
}

export function UserProfile({ userId, onBack }: UserProfileProps) {
    const [activeTab, setActiveTab] = useState<'training' | 'certificates' | 'activity' | 'notes'>('training');

    // Mock user data
    const user = {
        name: 'Ana Silva',
        email: 'ana.silva@grupomare.pt',
        role: 'Manager',
        restaurant: 'Mare Lisboa',
        phone: '+351 912 345 678',
        joinedDate: 'Jan 15, 2024',
        lastActive: '2 hours ago',
        avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Silva&background=0D8ABC&color=fff',
        stats: {
            completedCourses: 8,
            inProgress: 2,
            totalHours: 24,
            avgScore: 92
        }
    };

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={onBack} className="pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-50"
                        />
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">{user.role}</p>

                        <div className="flex justify-center gap-2 mb-6">
                            <Button size="sm" variant="outline">
                                <Mail className="w-4 h-4 mr-2" />
                                Message
                            </Button>
                            <Button size="sm" variant="outline">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-3 text-left border-t border-gray-100 pt-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                {user.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                                {user.phone}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                                {user.restaurant}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                                Joined {user.joinedDate}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-primary-600">{user.stats.completedCourses}</p>
                                <p className="text-xs text-gray-500">Completed</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-amber-600">{user.stats.inProgress}</p>
                                <p className="text-xs text-gray-500">In Progress</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-green-600">{user.stats.avgScore}%</p>
                                <p className="text-xs text-gray-500">Avg. Score</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-blue-600">{user.stats.totalHours}h</p>
                                <p className="text-xs text-gray-500">Learning</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200 px-6">
                            <nav className="-mb-px flex space-x-8">
                                {['training', 'certificates', 'activity', 'notes'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`
                                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                                            ${activeTab === tab
                                                ? 'border-primary-500 text-primary-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'training' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-gray-900">Assigned Courses</h3>
                                        <Button size="sm">Assign New Course</Button>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="p-2 bg-primary-50 rounded-lg">
                                                    <BookOpen className="w-6 h-6 text-primary-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <h4 className="font-medium text-gray-900">Advanced Wine Pairing</h4>
                                                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">In Progress</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-3">Due in 5 days</p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'certificates' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                                                <Award className="w-6 h-6 text-green-600" />
                                            </div>
                                            <h4 className="font-medium text-gray-900">Food Safety Level 1</h4>
                                            <p className="text-xs text-gray-500 mt-1">Issued on Jan 20, 2024</p>
                                            <Button variant="outline" size="sm" className="mt-4 w-full">Download PDF</Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="space-y-6">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                                            </div>
                                            <div className="pb-6">
                                                <p className="text-sm text-gray-900">Completed module <span className="font-medium">"Red Wines"</span></p>
                                                <p className="text-xs text-gray-500 mt-0.5">Today at 10:30 AM</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
